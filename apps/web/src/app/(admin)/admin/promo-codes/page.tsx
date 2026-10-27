"use client";

import { Button } from "@edgecoms/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
} from "@edgecoms/ui/components/dialog";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import {
	EmptyState,
	PortalHeader,
	StatusBadge,
	TableShell,
} from "@edgecoms/ui/components/portal";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { formatExpiry, optionalInt, percentToBps } from "@/lib/code-form";
import { formatMoney } from "@/lib/money";
import { queryClient, trpc } from "@/utils/trpc";

/**
 * Promo codes: a discount Edge hands out itself, on any paid plan of any Edge
 * app. No partner, no attribution, no commission — a store a partner referred
 * can redeem one too.
 *
 * The terms can't be edited after issue (stores that redeemed would silently
 * get a different deal), so this page only issues, disables and re-enables.
 */

type PromoKind = "free_cycles" | "percentage";

interface PromoRow {
	code: string;
	discountBps: number | null;
	discountCycles: number | null;
	discountKind: string;
	expiresAt: string | Date | null;
	id: string;
	label: string | null;
	maxRedemptions: number | null;
	redemptions: number;
	revenue: { currency: string; netMinor: string }[];
	status: "active" | "disabled";
	stores: number;
}

function describeOffer(row: PromoRow): string {
	const cycles =
		row.discountCycles === null ? "ongoing" : `${row.discountCycles} cycles`;
	switch (row.discountKind) {
		case "free_cycles":
			return `Free for ${row.discountCycles ?? 0} cycles`;
		case "percentage":
			return `${(row.discountBps ?? 0) / 100}% off, ${cycles}`;
		default:
			return row.discountKind;
	}
}

const FIELD = "h-9 rounded-lg border border-border bg-bg text-body-sm";
const SELECT_FIELD = `${FIELD} w-full px-3 text-primary-foreground`;

function PromoTable({
	rows,
	onToggle,
	toggling,
}: {
	rows: PromoRow[];
	onToggle: (id: string, status: "active" | "disabled") => void;
	toggling: boolean;
}) {
	return (
		<TableShell
			head={
				<>
					<th>Code</th>
					<th>Status</th>
					<th>Offer (any paid plan)</th>
					<th className="text-right">Stores</th>
					<th className="text-right">App redemptions</th>
					<th className="text-right">Net revenue</th>
					<th>Redeem by</th>
					<th className="text-right">Action</th>
				</>
			}
		>
			{rows.map((row) => (
				<tr key={row.id}>
					<td>
						<div className="flex flex-col">
							<span className="font-mono text-primary-foreground">
								{row.code}
							</span>
							{row.label ? (
								<span className="text-caption text-secondary-foreground">
									{row.label}
								</span>
							) : null}
						</div>
					</td>
					<td>
						<StatusBadge
							status={row.status === "active" ? "approved" : "suspended"}
						/>
					</td>
					<td className="text-secondary-foreground">{describeOffer(row)}</td>
					<td className="text-right text-primary-foreground tabular-nums">
						{row.stores}
						{row.maxRedemptions === null ? "" : ` / ${row.maxRedemptions}`}
					</td>
					<td className="text-right text-secondary-foreground tabular-nums">
						{row.redemptions}
					</td>
					<td className="text-right text-primary-foreground tabular-nums">
						{row.revenue.length === 0
							? "—"
							: row.revenue
									.map((r) => formatMoney(r.netMinor, r.currency))
									.join(" + ")}
					</td>
					<td className="text-secondary-foreground">
						{formatExpiry(row.expiresAt)}
					</td>
					<td className="text-right">
						<Button
							disabled={toggling}
							onClick={() => onToggle(row.id, row.status)}
							size="md"
							variant="secondary"
						>
							{row.status === "active" ? "Disable" : "Enable"}
						</Button>
					</td>
				</tr>
			))}
		</TableShell>
	);
}

function IssuePromoDialog({
	open,
	onOpenChange,
	onSubmit,
	pending,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	pending: boolean;
}) {
	const codeId = useId();
	const labelId = useId();
	const maxId = useId();
	const expiresId = useId();
	const kindId = useId();
	const percentId = useId();
	const cyclesId = useId();
	const [kind, setKind] = useState<PromoKind>("free_cycles");

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent
				className="bg-elevated"
				description="Merchants paste this into any Edge app's billing page."
				title="Issue a promo code"
			>
				<form className="flex flex-col gap-5" onSubmit={onSubmit}>
					<div className="flex flex-col gap-2">
						<Label htmlFor={codeId}>Code</Label>
						<Input
							autoComplete="off"
							className={FIELD}
							id={codeId}
							name="code"
							placeholder="EDGE3FREE"
							required
						/>
						<span className="text-caption text-secondary-foreground">
							4 to 32 letters, digits or hyphens. Must not match a partner code.
						</span>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor={labelId}>Internal name (optional)</Label>
						<Input
							className={FIELD}
							id={labelId}
							name="label"
							placeholder="Q4 launch promo"
						/>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor={kindId}>Offer</Label>
							<select
								className={SELECT_FIELD}
								id={kindId}
								name="discountKind"
								onChange={(event) =>
									setKind(event.currentTarget.value as PromoKind)
								}
								value={kind}
							>
								<option value="free_cycles">Free for N cycles</option>
								<option value="percentage">Percentage off</option>
							</select>
						</div>
						{kind === "percentage" ? (
							<div className="flex flex-col gap-2">
								<Label htmlFor={percentId}>Percent off</Label>
								<Input
									className={FIELD}
									id={percentId}
									max="100"
									min="1"
									name="discountPercent"
									required
									step="0.01"
									type="number"
								/>
							</div>
						) : null}
						<div className="flex flex-col gap-2">
							<Label htmlFor={cyclesId}>Billing cycles</Label>
							<Input
								className={FIELD}
								defaultValue="3"
								id={cyclesId}
								min="1"
								name="discountCycles"
								placeholder="Ongoing"
								required={kind === "free_cycles"}
								type="number"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor={maxId}>Max stores</Label>
							<Input
								className={FIELD}
								id={maxId}
								min="1"
								name="maxRedemptions"
								placeholder="Unlimited"
								type="number"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor={expiresId}>Redeem by</Label>
							<Input
								className={FIELD}
								id={expiresId}
								name="expiresAt"
								type="date"
							/>
						</div>
					</div>

					<span className="text-caption text-secondary-foreground">
						Applies to every paid plan in every Edge app. One store counts once
						toward the cap however many apps it redeems in. The offer can't be
						changed after issue.
					</span>

					<div className="flex items-center justify-end gap-3">
						<DialogClose
							render={
								<Button size="lg" type="button" variant="secondary">
									Cancel
								</Button>
							}
						/>
						<Button
							disabled={pending}
							size="lg"
							type="submit"
							variant="primary"
						>
							{pending ? "Issuing…" : "Issue code"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function AdminPromoCodesPage() {
	const listQuery = useQuery(trpc.admin.promoCodes.list.queryOptions());
	const createMutation = useMutation(
		trpc.admin.promoCodes.create.mutationOptions()
	);
	const updateMutation = useMutation(
		trpc.admin.promoCodes.update.mutationOptions()
	);
	const [creating, setCreating] = useState(false);

	function refresh() {
		queryClient.invalidateQueries({
			queryKey: trpc.admin.promoCodes.list.queryKey(),
		});
	}

	function handleCreate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const kind = String(form.get("discountKind")) as PromoKind;
		const expiresAt = String(form.get("expiresAt") ?? "").trim();

		let discountBps: number | null = null;
		if (kind === "percentage") {
			discountBps = percentToBps(String(form.get("discountPercent") ?? ""));
			if (discountBps === null) {
				toast.error("Enter a percentage between 0 and 100, up to 2 decimals.");
				return;
			}
		}

		createMutation.mutate(
			{
				code: String(form.get("code")),
				label: String(form.get("label") ?? ""),
				maxRedemptions: optionalInt(form.get("maxRedemptions")),
				// A date input gives a bare day; the code expires at the end of it.
				expiresAt: expiresAt
					? new Date(`${expiresAt}T23:59:59Z`).toISOString()
					: null,
				discountKind: kind,
				discountBps,
				discountCycles: optionalInt(form.get("discountCycles")),
			},
			{
				onSuccess: (result) => {
					toast.success(`Promo code ${result.code} created.`);
					setCreating(false);
					refresh();
				},
				onError: (error) => toast.error(error.message),
			}
		);
	}

	function toggleStatus(id: string, status: "active" | "disabled") {
		updateMutation.mutate(
			{
				promoCodeId: id,
				status: status === "active" ? "disabled" : "active",
			},
			{
				onSuccess: () => {
					toast.success(
						status === "active" ? "Code disabled." : "Code re-enabled."
					);
					refresh();
				},
				onError: (error) => toast.error(error.message),
			}
		);
	}

	const rows = listQuery.data ?? [];
	const issueButton = (
		<Button onClick={() => setCreating(true)} size="lg" variant="primary">
			Issue a promo code
		</Button>
	);

	function body() {
		if (listQuery.isLoading) {
			return <Skeleton className="h-48 w-full rounded-xl" />;
		}
		if (rows.length === 0) {
			return (
				<EmptyState
					action={issueButton}
					description="Issue one and hand it out. Merchants paste it into any Edge app to get the discount."
					title="No promo codes yet"
				/>
			);
		}
		return (
			<PromoTable
				onToggle={toggleStatus}
				rows={rows}
				toggling={updateMutation.isPending}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				action={issueButton}
				description="Discounts on any paid plan of any Edge app. A promo code links the store to nobody and earns no commission."
				title="Promo codes"
			/>

			{body()}

			<p className="text-caption text-secondary-foreground">
				Disabling a code stops new redemptions. Stores that already redeemed
				keep their discount.
			</p>

			<IssuePromoDialog
				onOpenChange={setCreating}
				onSubmit={handleCreate}
				open={creating}
				pending={createMutation.isPending}
			/>
		</div>
	);
}
