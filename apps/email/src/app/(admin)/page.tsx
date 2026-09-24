import { db } from "@edgecoms/db";
import {
	EmptyState,
	PortalHeader,
	StatCard,
	StatusBadge,
	TableShell,
} from "@edgecoms/ui/components/portal";
import type { Route } from "next";
import Link from "next/link";
import { ago, count } from "@/lib/format";
import {
	audienceTotals,
	deliveryStats,
	rate,
	recentCampaigns,
} from "@/server/queries/dashboard";
import { requireAdmin } from "@/server/session";

const WINDOW_DAYS = 30;

export default async function DashboardPage() {
	await requireAdmin();
	const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000);
	const [stats, audience, campaigns] = await Promise.all([
		deliveryStats(db, since),
		audienceTotals(db),
		recentCampaigns(db),
	]);
	const t = stats.totals;
	const delivered = t["email.delivered"];

	return (
		<div className="flex flex-col gap-10">
			<PortalHeader
				description={`Every Edge app's email, over the last ${WINDOW_DAYS} days.`}
				title="Dashboard"
			/>

			<section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
				<StatCard label="Emails sent" value={count(t["email.sent"])} />
				<StatCard
					hint={rate(delivered, t["email.sent"]) ?? undefined}
					label="Delivered"
					value={count(delivered)}
				/>
				<StatCard
					label="Open rate"
					value={rate(t["email.opened"], delivered) ?? "-"}
				/>
				<StatCard
					label="Click rate"
					value={rate(t["email.clicked"], delivered) ?? "-"}
				/>
				<StatCard
					label="Bounce rate"
					value={rate(t["email.bounced"], t["email.sent"]) ?? "-"}
				/>
				<StatCard label="Unsubscribes" value={count(stats.unsubscribes)} />
			</section>

			<section className="grid grid-cols-2 gap-4 md:grid-cols-4">
				<StatCard label="Contacts" value={count(audience.contacts)} />
				<StatCard label="Stores" value={count(audience.stores)} />
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="font-medium text-body text-primary-foreground">
					Performance by app
				</h2>
				{stats.byApp.length === 0 ? (
					<EmptyState
						description="Numbers appear once Resend starts reporting deliveries."
						title="No email sent yet"
					/>
				) : (
					<TableShell
						head={
							<>
								<th>App</th>
								<th>Sent</th>
								<th>Delivered</th>
								<th>Open rate</th>
								<th>Click rate</th>
							</>
						}
					>
						{stats.byApp.map(({ counts, name }) => (
							<tr key={name}>
								<td className="text-primary-foreground">{name}</td>
								<td className="tabular-nums">{count(counts["email.sent"])}</td>
								<td className="tabular-nums">
									{count(counts["email.delivered"])}
								</td>
								<td className="tabular-nums">
									{rate(counts["email.opened"], counts["email.delivered"]) ??
										"-"}
								</td>
								<td className="tabular-nums">
									{rate(counts["email.clicked"], counts["email.delivered"]) ??
										"-"}
								</td>
							</tr>
						))}
					</TableShell>
				)}
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="font-medium text-body text-primary-foreground">
					Recent campaigns
				</h2>
				{campaigns.length === 0 ? (
					<EmptyState
						description="Create one from Campaigns."
						title="No campaigns yet"
					/>
				) : (
					<TableShell
						head={
							<>
								<th>Campaign</th>
								<th>App</th>
								<th>Status</th>
								<th>Recipients</th>
								<th>Updated</th>
							</>
						}
					>
						{campaigns.map((campaign) => (
							<tr key={campaign.id}>
								<td>
									<Link
										className="text-primary-foreground underline-offset-4 hover:underline"
										href={`/campaigns/${campaign.id}` as Route}
									>
										{campaign.name}
									</Link>
								</td>
								<td>{campaign.appName}</td>
								<td>
									<StatusBadge status={campaign.status} />
								</td>
								<td className="tabular-nums">
									{campaign.recipientCount === null
										? "-"
										: count(campaign.recipientCount)}
								</td>
								<td>{ago(campaign.updatedAt)}</td>
							</tr>
						))}
					</TableShell>
				)}
			</section>
		</div>
	);
}
