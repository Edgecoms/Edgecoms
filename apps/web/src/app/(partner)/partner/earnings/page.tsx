"use client";

import {
	EmptyState,
	PortalHeader,
	StatCard,
	StatusBadge,
	TableShell,
} from "@edgecoms/ui/components/portal";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import {
	formatMoney,
	formatPeriod,
	primaryMoney,
	secondaryMoney,
} from "@/lib/money";
import { trpc } from "@/utils/trpc";

export default function PartnerEarningsPage() {
	const { data, isLoading } = useQuery(trpc.partner.earnings.queryOptions());

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				description="Your commission by month, what is owed, and every payout. Where tax was withheld at source, you see what you earned and what reached you."
				title="Earnings"
			/>

			{data?.payoutBlocker ? (
				<div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
					<span className="font-medium text-body-sm">
						We cannot pay you yet
					</span>
					<p className="text-body-sm">
						{data.payoutBlocker}. Nothing is lost: what you have earned stays
						owed to you and goes out with the next payout once this is fixed.
					</p>
					<Link
						className="w-fit text-body-sm underline"
						href={"/partner/settings" as Route}
					>
						Add your payout details
					</Link>
				</div>
			) : null}

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<StatCard
					hint={secondaryMoney(data?.lifetime ?? []) ?? "All-time commission"}
					label="Lifetime"
					loading={isLoading}
					value={primaryMoney(data?.lifetime ?? [], data?.zeroCurrency)}
				/>
				<StatCard
					hint={
						secondaryMoney(data?.upcomingPayout ?? []) ?? "Pending commission"
					}
					label="Upcoming payout"
					loading={isLoading}
					value={primaryMoney(data?.upcomingPayout ?? [], data?.zeroCurrency)}
				/>
				<StatCard
					hint="Current period"
					label="This month"
					loading={isLoading}
					value={data ? formatPeriod(data.currentPeriod) : "-"}
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
								<th>Currency</th>
								<th className="text-right">Pending</th>
								<th className="text-right">Paid</th>
								<th className="text-right">Total</th>
							</>
						}
					>
						{(data?.months ?? []).map((month) => (
							/* One row per month AND currency: a month earned in two
							   currencies is two payouts, so it is two lines here. */
							<tr key={`${month.period}:${month.currency}`}>
								<td className="text-primary-foreground">
									{formatPeriod(month.period)}
								</td>
								<td className="text-secondary-foreground">{month.currency}</td>
								<td className="text-right text-secondary-foreground tabular-nums">
									{formatMoney(month.pendingMinor, month.currency)}
								</td>
								<td className="text-right text-secondary-foreground tabular-nums">
									{formatMoney(month.paidMinor, month.currency)}
								</td>
								<td className="text-right text-primary-foreground tabular-nums">
									{formatMoney(month.totalMinor, month.currency)}
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
								<th>Through</th>
								<th>Status</th>
								<th className="text-right">Earned</th>
								<th className="text-right">Withheld</th>
								<th className="text-right">Paid to you</th>
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
								<td className="text-right text-secondary-foreground tabular-nums">
									{formatMoney(payout.amountMinor, payout.currency)}
								</td>
								<td className="text-right text-secondary-foreground tabular-nums">
									<div className="flex flex-col items-end">
										<span>
											{formatMoney(payout.withheldMinor, payout.currency)}
										</span>
										{payout.withholdingNote ? (
											<span className="text-caption">
												{payout.withholdingNote}
											</span>
										) : null}
									</div>
								</td>
								<td className="text-right text-primary-foreground tabular-nums">
									<div className="flex flex-col items-end">
										<span>{formatMoney(payout.netMinor, payout.currency)}</span>
										{payout.settledMinor && payout.settledCurrency ? (
											<span className="text-caption text-secondary-foreground">
												Sent{" "}
												{formatMoney(
													payout.settledMinor,
													payout.settledCurrency
												)}
											</span>
										) : null}
									</div>
								</td>
							</tr>
						))}
					</TableShell>
				)}
			</div>
		</div>
	);
}
