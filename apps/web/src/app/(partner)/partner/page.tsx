"use client";

import { ButtonLink } from "@edgecoms/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import {
	EmptyState,
	PortalHeader,
	StatCard,
	StatusBadge,
	TableShell,
} from "@/components/portal/ui";
import { formatMoney, formatPeriod } from "@/lib/money";
import { trpc } from "@/utils/trpc";

export default function PartnerDashboardPage() {
	const { data, isLoading } = useQuery(trpc.partner.dashboard.queryOptions());
	const currency = data?.currency ?? "USD";

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				action={
					<ButtonLink
						href={"/partner/merchants/register" as Route}
						size="lg"
						variant="primary"
					>
						Register merchant
					</ButtonLink>
				}
				description="Your merchants, recurring revenue, and commission at a glance."
				title="Dashboard"
			/>

			{data?.status && data.status !== "approved" ? (
				<div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-body-sm">
					Your partner account is <strong>{data.status}</strong>. You can
					register merchants now — commission begins once you and your merchants
					are approved.
				</div>
			) : null}

			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				<StatCard
					label="Active merchants"
					loading={isLoading}
					value={data?.activeMerchants ?? 0}
				/>
				<StatCard
					hint="Awaiting approval"
					label="Pending"
					loading={isLoading}
					value={data?.pendingRegistrations ?? 0}
				/>
				<StatCard
					hint="Commission this month"
					label="This month"
					loading={isLoading}
					value={formatMoney(data?.thisMonthCommissionMinor ?? "0", currency)}
				/>
				<StatCard
					hint="All-time commission"
					label="Lifetime"
					loading={isLoading}
					value={formatMoney(data?.lifetimeEarningsMinor ?? "0", currency)}
				/>
			</div>

			<div className="flex flex-col gap-4">
				<h2 className="font-medium text-h3 text-primary-foreground">
					Recent activity
				</h2>
				{!isLoading && data && data.recentActivity.length === 0 ? (
					<EmptyState
						description="Commission will appear here as your approved merchants are billed for Edge apps."
						title="No commission yet"
					/>
				) : (
					<TableShell
						head={
							<>
								<th>Merchant</th>
								<th>App</th>
								<th>Period</th>
								<th>Status</th>
								<th className="text-right">Commission</th>
							</>
						}
					>
						{(data?.recentActivity ?? []).map((row) => (
							<tr key={row.id}>
								<td className="text-primary-foreground">{row.merchantName}</td>
								<td className="text-secondary-foreground">{row.appName}</td>
								<td className="text-secondary-foreground">
									{formatPeriod(row.period)}
								</td>
								<td>
									<StatusBadge status={row.status} />
								</td>
								<td className="text-right text-primary-foreground tabular-nums">
									{formatMoney(row.amountMinor, row.currency)}
								</td>
							</tr>
						))}
					</TableShell>
				)}
			</div>
		</div>
	);
}
