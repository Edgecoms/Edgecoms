"use client";

import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
	EmptyState,
	PortalHeader,
	StatCard,
	StatusBadge,
	TableShell,
} from "@/components/portal/ui";
import { formatMoney, formatPeriod } from "@/lib/money";
import { trpc } from "@/utils/trpc";

export default function PartnerEarningsPage() {
	const { data, isLoading } = useQuery(trpc.partner.earnings.queryOptions());
	const currency = data?.currency ?? "USD";

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				description="Your commission by month, what's owed, and your payout history."
				title="Earnings"
			/>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<StatCard
					hint="All-time commission"
					label="Lifetime"
					loading={isLoading}
					value={formatMoney(data?.lifetimeMinor ?? "0", currency)}
				/>
				<StatCard
					hint="Pending commission"
					label="Upcoming payout"
					loading={isLoading}
					value={formatMoney(data?.upcomingPayoutMinor ?? "0", currency)}
				/>
				<StatCard
					hint="Current period"
					label="This month"
					loading={isLoading}
					value={data ? formatPeriod(data.currentPeriod) : "—"}
				/>
			</div>

			<div className="flex flex-col gap-4">
				<h2 className="font-medium text-h3 text-primary-foreground">
					By month
				</h2>
				{isLoading && <Skeleton className="h-40 w-full rounded-xl" />}

				{!isLoading && data?.months.length === 0 && (
					<EmptyState
						description="Once your approved merchants are billed, your monthly commission shows up here."
						title="No earnings yet"
					/>
				)}

				{!isLoading && !!data?.months.length && (
					<TableShell
						head={
							<>
								<th>Period</th>
								<th className="text-right">Pending</th>
								<th className="text-right">Paid</th>
								<th className="text-right">Total</th>
							</>
						}
					>
						{(data?.months ?? []).map((month) => (
							<tr key={month.period}>
								<td className="text-primary-foreground">
									{formatPeriod(month.period)}
								</td>
								<td className="text-right text-secondary-foreground tabular-nums">
									{formatMoney(month.pendingMinor, currency)}
								</td>
								<td className="text-right text-secondary-foreground tabular-nums">
									{formatMoney(month.paidMinor, currency)}
								</td>
								<td className="text-right text-primary-foreground tabular-nums">
									{formatMoney(month.totalMinor, currency)}
								</td>
							</tr>
						))}
					</TableShell>
				)}
			</div>

			<div className="flex flex-col gap-4">
				<h2 className="font-medium text-h3 text-primary-foreground">
					Payout history
				</h2>
				{!isLoading && data && data.payouts.length === 0 ? (
					<EmptyState
						description="Payouts are grouped by period and appear here once Edge marks them paid."
						title="No payouts yet"
					/>
				) : (
					<TableShell
						head={
							<>
								<th>Period</th>
								<th>Status</th>
								<th className="text-right">Amount</th>
							</>
						}
					>
						{(data?.payouts ?? []).map((payout) => (
							<tr key={payout.id}>
								<td className="text-primary-foreground">
									{formatPeriod(payout.periodMonth)}
								</td>
								<td>
									<StatusBadge status={payout.status} />
								</td>
								<td className="text-right text-primary-foreground tabular-nums">
									{formatMoney(payout.amountMinor, payout.currency)}
								</td>
							</tr>
						))}
					</TableShell>
				)}
			</div>
		</div>
	);
}
