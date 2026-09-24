"use client";

import { Button } from "@edgecoms/ui/components/button";
import {
	EmptyState,
	PortalHeader,
	StatCard,
	StatusBadge,
	TableShell,
} from "@edgecoms/ui/components/portal";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	allMoney,
	formatMoney,
	formatPeriod,
	type MoneyEntry,
} from "@/lib/money";
import { queryClient, trpc } from "@/utils/trpc";

/**
 * Every bonus ever issued: the money-leaving-the-business ledger.
 *
 * Paid and revoked rows stay on screen. A ledger that shows only what is still
 * outstanding cannot be reconciled against a payout that has already gone out,
 * and a revoked bonus is the one row an admin most needs to find again.
 *
 * Revoke is offered only while a bonus is `pending`, which is the only state
 * the server will act on. A paid bonus is history and a revoked one is already
 * revoked, and there is no update path for either.
 */

interface BonusRow {
	amountMinor: string;
	createdAt: Date | string;
	currency: string;
	id: string;
	/** Null for a discretionary bonus; set when the programme owed it. */
	milestoneKey: string | null;
	partner: string;
	periodMonth: string;
	reason: string;
	status: string;
}

/** Descending, so the largest currency leads every money list on this page. */
function byAmountDesc(left: bigint, right: bigint): number {
	if (left === right) {
		return 0;
	}
	return left > right ? -1 : 1;
}

/**
 * Per-currency totals for one status.
 *
 * Grouped, never added together: there is no exchange rate in this system, so
 * one figure spanning currencies would be a number that is not money. The sum
 * is bigint because no float ever touches an amount.
 */
function totalsByCurrency(
	rows: readonly BonusRow[],
	status: string
): MoneyEntry[] {
	const sums = new Map<string, bigint>();
	for (const row of rows) {
		if (row.status === status) {
			sums.set(
				row.currency,
				(sums.get(row.currency) ?? 0n) + BigInt(row.amountMinor)
			);
		}
	}
	return [...sums.entries()]
		.sort((left, right) => byAmountDesc(left[1], right[1]))
		.map(([currency, amount]) => ({
			amountMinor: amount.toString(),
			currency,
		}));
}

/** The day the money was authorised, so "newest first" has something to read. */
function formatIssued(createdAt: Date | string): string {
	return new Date(createdAt).toLocaleDateString(undefined, {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

/**
 * Which kind of bonus this is, in an admin's terms.
 *
 * The distinction is whether anything was OWED. A discretionary bonus was a
 * person's decision and nothing obliged it; a milestone was owed to every
 * partner who reached the rung; a store bounty is owed for every store that
 * starts paying. `startsWith` rather than a regex, so nothing needs hoisting.
 */
function describeKind(milestoneKey: string | null): string {
	if (milestoneKey === null) {
		return "Discretionary";
	}
	return milestoneKey.startsWith("merchant_earning:")
		? "Store bounty"
		: "Milestone";
}

function BonusTable({
	onRevoke,
	revoking,
	rows,
}: {
	onRevoke: (bonusId: string) => void;
	revoking: boolean;
	rows: readonly BonusRow[];
}) {
	return (
		<TableShell
			head={
				<>
					<th>Partner</th>
					<th>Reason</th>
					<th>Period</th>
					<th>Kind</th>
					<th>Status</th>
					<th className="text-right">Amount</th>
					<th className="text-right">Action</th>
				</>
			}
		>
			{rows.map((row) => (
				<tr key={row.id}>
					<td>
						<div className="flex flex-col">
							<span className="text-primary-foreground">{row.partner}</span>
							<span className="text-caption text-secondary-foreground">
								Issued {formatIssued(row.createdAt)}
							</span>
						</div>
					</td>
					<td className="max-w-sm text-pretty text-secondary-foreground">
						{row.reason}
					</td>
					<td className="text-secondary-foreground">
						{describeKind(row.milestoneKey)}
					</td>
					<td className="text-secondary-foreground">
						{formatPeriod(row.periodMonth)}
					</td>
					<td>
						<StatusBadge status={row.status} />
					</td>
					<td className="text-right text-primary-foreground tabular-nums">
						{formatMoney(row.amountMinor, row.currency)}
					</td>
					<td className="text-right">
						{row.status === "pending" ? (
							<Button
								disabled={revoking}
								onClick={() => onRevoke(row.id)}
								size="md"
								variant="secondary"
							>
								Revoke
							</Button>
						) : null}
					</td>
				</tr>
			))}
		</TableShell>
	);
}

export default function AdminBonusesPage() {
	const bonusesQuery = useQuery(trpc.admin.partners.bonuses.queryOptions());
	const revokeMutation = useMutation(
		trpc.admin.partners.revokeBonus.mutationOptions()
	);

	const rows = bonusesQuery.data ?? [];

	function revoke(bonusId: string) {
		revokeMutation.mutate(
			{ bonusId },
			{
				onError: (error) => toast.error(error.message),
				onSuccess: () => {
					toast.success("Bonus revoked. It leaves that month's payout.");
					queryClient.invalidateQueries({
						queryKey: trpc.admin.partners.bonuses.queryKey(),
					});
				},
			}
		);
	}

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				description="Every bonus ever issued, newest first. A bonus can be revoked only while it is still pending."
				title="Bonuses"
			/>

			<div className="grid gap-4 sm:grid-cols-2">
				<StatCard
					hint="Riding a future payout, so still revocable."
					label="Pending"
					loading={bonusesQuery.isLoading}
					value={allMoney(totalsByCurrency(rows, "pending"))}
				/>
				<StatCard
					hint="Already out of the business."
					label="Paid"
					loading={bonusesQuery.isLoading}
					value={allMoney(totalsByCurrency(rows, "paid"))}
				/>
			</div>

			{bonusesQuery.isLoading && (
				<Skeleton className="h-48 w-full rounded-xl" />
			)}
			{!bonusesQuery.isLoading && rows.length === 0 && (
				<EmptyState
					description="Bonuses issued from the Partners page appear here, alongside the ones the milestone programme awards."
					title="No bonuses yet"
				/>
			)}
			{!bonusesQuery.isLoading && rows.length > 0 && (
				<BonusTable
					onRevoke={revoke}
					revoking={revokeMutation.isPending}
					rows={rows}
				/>
			)}
		</div>
	);
}
