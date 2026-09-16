"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Checkbox } from "@edgecoms/ui/components/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
} from "@edgecoms/ui/components/dialog";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import {
	EmptyState,
	PortalHeader,
	StatusBadge,
	TableShell,
} from "@/components/portal/ui";
import { formatMoney, formatPeriod } from "@/lib/money";
import { queryClient, trpc } from "@/utils/trpc";

/** A payable group, as `payouts.groupable` returns one. */
interface PayableGroup {
	bonusCount: number;
	bonusesMinor: string;
	commissionsMinor: string;
	currency: string;
	items: number;
	partner: string;
	partnerId: string;
	periodMonth: string;
	totalMinor: string;
}

/** A recorded payout, as `payouts.list` returns one. */
interface PaidPayout {
	amountMinor: string;
	currency: string;
	id: string;
	method: string | null;
	netMinor: string;
	partner: string;
	periodMonth: string;
	reference: string | null;
	settledCurrency: string | null;
	settledMinor: string | null;
	status: string;
	withheldMinor: string;
	withholdingNote: string | null;
}

type PayoutMethod = "bank_transfer" | "other" | "payment_link" | "upi" | "wire";

/** Everything `pay()` needs beyond the group's own key. */
interface PayDetails {
	force: boolean;
	method: PayoutMethod;
	reference: string;
	withheld: string;
	withholdingNote: string;
}

/** The routes the server accepts, commonest first rather than alphabetical. */
const METHODS: readonly (readonly [PayoutMethod, string])[] = [
	["bank_transfer", "Bank transfer"],
	["upi", "UPI"],
	["wire", "Wire"],
	["payment_link", "Payment link"],
	["other", "Other"],
];

const METHOD_LABELS: Record<string, string> = Object.fromEntries(METHODS);

/** `Input` is h-8 and text-xs; the native select has to be told to match. */
const SELECT_FIELD =
	"h-8 w-full rounded-none border border-input bg-transparent px-2.5 text-primary-foreground text-xs";

/** "1 commission" / "3 commissions": "1 commissions" reads as a bug. */
function countLabel(count: number, one: string, many: string): string {
	return `${count} ${count === 1 ? one : many}`;
}

/** A money figure with the detail that accounts for it underneath. */
function Figure({ hint, value }: { hint?: string | null; value: string }) {
	return (
		<div className="flex flex-col items-end gap-0.5">
			<span className="text-primary-foreground tabular-nums">{value}</span>
			{hint ? (
				<span className="max-w-48 text-right text-caption text-secondary-foreground">
					{hint}
				</span>
			) : null}
		</div>
	);
}

function PayableTable({
	groups,
	onPay,
}: {
	groups: readonly PayableGroup[];
	onPay: (group: PayableGroup) => void;
}) {
	return (
		<TableShell
			head={
				<>
					<th>Partner</th>
					<th>Period</th>
					<th className="text-right">Commission</th>
					<th className="text-right">Bonuses</th>
					<th className="text-right">Total</th>
					<th className="text-right">Action</th>
				</>
			}
		>
			{groups.map((group) => (
				<tr key={`${group.partnerId}-${group.periodMonth}-${group.currency}`}>
					<td className="text-primary-foreground">{group.partner}</td>
					<td className="text-secondary-foreground">
						{formatPeriod(group.periodMonth)}
					</td>
					<td className="text-right">
						<Figure
							hint={countLabel(group.items, "commission", "commissions")}
							value={formatMoney(group.commissionsMinor, group.currency)}
						/>
					</td>
					<td className="text-right">
						<Figure
							hint={
								group.bonusCount === 0
									? null
									: countLabel(group.bonusCount, "bonus", "bonuses")
							}
							value={formatMoney(group.bonusesMinor, group.currency)}
						/>
					</td>
					<td className="text-right font-medium text-primary-foreground tabular-nums">
						{formatMoney(group.totalMinor, group.currency)}
					</td>
					<td className="text-right">
						<Button onClick={() => onPay(group)} size="md" variant="primary">
							Pay
						</Button>
					</td>
				</tr>
			))}
		</TableShell>
	);
}

function HistoryTable({ payouts }: { payouts: readonly PaidPayout[] }) {
	return (
		<TableShell
			head={
				<>
					<th>Partner</th>
					<th>Period</th>
					<th>Method</th>
					<th>Reference</th>
					<th>Status</th>
					<th className="text-right">Gross</th>
					<th className="text-right">Withheld</th>
					<th className="text-right">Net</th>
				</>
			}
		>
			{payouts.map((payout) => (
				<tr key={payout.id}>
					<td className="text-primary-foreground">{payout.partner}</td>
					<td className="text-secondary-foreground">
						{formatPeriod(payout.periodMonth)}
					</td>
					<td className="text-secondary-foreground">
						{payout.method
							? (METHOD_LABELS[payout.method] ?? payout.method)
							: "-"}
					</td>
					<td className="max-w-40 truncate font-mono text-caption text-secondary-foreground">
						{payout.reference ?? "-"}
					</td>
					<td>
						<StatusBadge status={payout.status} />
					</td>
					<td className="text-right">
						<Figure value={formatMoney(payout.amountMinor, payout.currency)} />
					</td>
					<td className="text-right">
						<Figure
							hint={payout.withholdingNote}
							value={formatMoney(payout.withheldMinor, payout.currency)}
						/>
					</td>
					<td className="text-right">
						<Figure
							/* What landed, when it landed in another currency. No rate is
							   stored, so the pair is the whole of what we know. */
							hint={
								payout.settledMinor === null
									? null
									: `Sent ${formatMoney(
											payout.settledMinor,
											payout.settledCurrency ?? payout.currency
										)}`
							}
							value={formatMoney(payout.netMinor, payout.currency)}
						/>
					</td>
				</tr>
			))}
		</TableShell>
	);
}

function PayForm({
	group,
	onSubmit,
	pending,
}: {
	group: PayableGroup;
	onSubmit: (details: PayDetails) => void;
	pending: boolean;
}) {
	const methodId = useId();
	const withheldId = useId();
	const noteId = useId();
	const referenceId = useId();
	const forceId = useId();
	// Controlled, so the form reads one boolean rather than a hidden input.
	const [force, setForce] = useState(false);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const withheld = String(form.get("withheld") ?? "").trim();
		onSubmit({
			force,
			method: String(form.get("method") ?? "bank_transfer") as PayoutMethod,
			reference: String(form.get("reference") ?? "").trim(),
			/* The server takes a decimal string and refuses an empty one. */
			withheld: withheld === "" ? "0" : withheld,
			withholdingNote: String(form.get("withholdingNote") ?? "").trim(),
		});
	}

	return (
		<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
			<div className="flex flex-col gap-2">
				<Label htmlFor={methodId}>How the money moved</Label>
				<select className={SELECT_FIELD} id={methodId} name="method">
					{METHODS.map(([value, label]) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</select>
				<span className="text-caption text-secondary-foreground">
					A domestic transfer, an outward remittance and a paid link reconcile
					against different evidence, so it is recorded rather than inferred.
				</span>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={withheldId}>
					Withheld at source ({group.currency})
				</Label>
				<Input
					defaultValue="0"
					id={withheldId}
					inputMode="decimal"
					name="withheld"
					placeholder="0.00"
				/>
				<span className="text-caption text-secondary-foreground">
					Tax deducted at source and paid to the authority, not to the partner:
					they receive the net, which is the gross less this. Leave it at 0 when
					nothing was withheld.
				</span>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={noteId}>Withholding note</Label>
				<Input
					id={noteId}
					name="withholdingNote"
					placeholder="194H, 5%, certificate 4471"
				/>
				<span className="text-caption text-secondary-foreground">
					Section, rate or certificate number: whatever accounts for the
					deduction later.
				</span>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={referenceId}>Reference</Label>
				<Input
					id={referenceId}
					name="reference"
					placeholder="UTR or transfer reference"
				/>
				<span className="text-caption text-secondary-foreground">
					The UTR, wire reference, or the id of the link that was paid. This is
					what a dispute is settled with.
				</span>
			</div>

			<div className="flex items-start gap-3">
				<Checkbox
					checked={force}
					className="mt-0.5"
					id={forceId}
					onCheckedChange={setForce}
				/>
				<div className="flex flex-col gap-1">
					<Label htmlFor={forceId}>Pay below the minimum</Label>
					<span className="text-caption text-secondary-foreground">
						Overrides the minimum of 50 in the payout currency, which otherwise
						holds a small group back so a transfer fee cannot eat it. Holding
						costs the partner nothing: the group joins next month's.
					</span>
				</div>
			</div>

			<div className="flex items-center justify-end gap-3">
				<DialogClose
					render={
						<Button size="lg" type="button" variant="secondary">
							Cancel
						</Button>
					}
				/>
				<Button disabled={pending} size="lg" type="submit" variant="primary">
					{pending ? "Recording…" : "Record payout"}
				</Button>
			</div>
		</form>
	);
}

export default function AdminPayoutsPage() {
	const groupableQuery = useQuery(trpc.admin.payouts.groupable.queryOptions());
	const historyQuery = useQuery(trpc.admin.payouts.list.queryOptions());
	const payMutation = useMutation(trpc.admin.payouts.pay.mutationOptions());
	const [paying, setPaying] = useState<PayableGroup | null>(null);

	function pay(details: PayDetails) {
		if (!paying) {
			return;
		}
		const group = paying;
		payMutation.mutate(
			{
				currency: group.currency,
				force: details.force,
				method: details.method,
				partnerId: group.partnerId,
				periodMonth: group.periodMonth,
				reference: details.reference === "" ? undefined : details.reference,
				withheld: details.withheld,
				withholdingNote:
					details.withholdingNote === "" ? undefined : details.withholdingNote,
			},
			{
				/* Verbatim: the server names the one thing that stopped it, whether
				   that is missing payout details, the minimum, or withholding over
				   the amount earned. Rewording it here would lose the reason. */
				onError: (error) => toast.error(error.message),
				onSuccess: (result) => {
					toast.success(
						`Paid ${formatMoney(result.netMinor, group.currency)} net, ${formatMoney(result.withheldMinor, group.currency)} withheld.`
					);
					setPaying(null);
					for (const key of [
						trpc.admin.payouts.groupable.queryKey(),
						trpc.admin.payouts.list.queryKey(),
						trpc.admin.commissions.list.queryKey(),
						trpc.admin.dashboard.queryKey(),
					]) {
						queryClient.invalidateQueries({ queryKey: key });
					}
				},
			}
		);
	}

	return (
		<div className="flex flex-col gap-10">
			<PortalHeader
				description="Group a partner's pending commissions and bonuses for a period into one paid payout, and record what left, what was withheld, and how it moved."
				title="Payouts"
			/>

			<section className="flex flex-col gap-4">
				<h2 className="font-medium text-h3 text-primary-foreground">Payable</h2>
				{groupableQuery.isLoading && (
					<Skeleton className="h-32 w-full rounded-xl" />
				)}
				{!groupableQuery.isLoading && groupableQuery.data?.length === 0 && (
					<EmptyState
						description="When approved merchants generate commission, payable groups appear here."
						title="Nothing payable right now"
					/>
				)}
				{!groupableQuery.isLoading && !!groupableQuery.data?.length && (
					<PayableTable groups={groupableQuery.data} onPay={setPaying} />
				)}
			</section>

			<section className="flex flex-col gap-4">
				<h2 className="font-medium text-h3 text-primary-foreground">
					Payout history
				</h2>
				{historyQuery.isLoading && (
					<Skeleton className="h-32 w-full rounded-xl" />
				)}
				{!historyQuery.isLoading && historyQuery.data?.length === 0 && (
					<EmptyState
						description="No payouts have been recorded yet."
						title="No payouts"
					/>
				)}
				{!historyQuery.isLoading && !!historyQuery.data?.length && (
					<HistoryTable payouts={historyQuery.data} />
				)}
			</section>

			<Dialog
				onOpenChange={(open) => {
					if (!open) {
						setPaying(null);
					}
				}}
				open={paying !== null}
			>
				{paying ? (
					<DialogContent
						description={`${formatMoney(paying.totalMinor, paying.currency)} gross for ${formatPeriod(paying.periodMonth)}: ${formatMoney(paying.commissionsMinor, paying.currency)} commission and ${formatMoney(paying.bonusesMinor, paying.currency)} in bonuses. Withholding is deducted at source, so the partner receives the net.`}
						title={`Pay ${paying.partner}`}
					>
						<PayForm
							group={paying}
							onSubmit={pay}
							pending={payMutation.isPending}
						/>
					</DialogContent>
				) : null}
			</Dialog>
		</div>
	);
}
