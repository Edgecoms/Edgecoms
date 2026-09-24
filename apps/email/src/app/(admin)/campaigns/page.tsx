"use client";

import { Button } from "@edgecoms/ui/components/button";
import {
	EmptyState,
	PortalHeader,
	StatusBadge,
	TableShell,
} from "@edgecoms/ui/components/portal";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import { ago, count, dateTime } from "@/lib/format";
import { trpc } from "@/utils/trpc";
import { CAMPAIGN_TYPES } from "./shared";

const TYPE_LABEL = Object.fromEntries(CAMPAIGN_TYPES);

function when(campaign: {
	scheduledAt: Date | string | null;
	sentAt: Date | string | null;
	updatedAt: Date | string;
}): string {
	if (campaign.sentAt) {
		return dateTime(campaign.sentAt);
	}
	if (campaign.scheduledAt) {
		return `Scheduled ${dateTime(campaign.scheduledAt)}`;
	}
	return `Edited ${ago(campaign.updatedAt)}`;
}

export default function CampaignsPage() {
	const campaigns = useQuery(trpc.campaigns.list.queryOptions());

	return (
		<div className="flex flex-col gap-6">
			<PortalHeader
				action={
					<Link href={"/campaigns/new" as Route}>
						<Button size="lg" variant="primary">
							New campaign
						</Button>
					</Link>
				}
				description="Product releases and marketing, sent through Resend to the people who opted in."
				title="Campaigns"
			/>
			{campaigns.isLoading ? <Skeleton className="h-40 w-full" /> : null}
			{campaigns.data?.length === 0 ? (
				<EmptyState
					description="Write one, preview it, send yourself a test, then send."
					title="No campaigns yet"
				/>
			) : null}
			{campaigns.data && campaigns.data.length > 0 ? (
				<TableShell
					head={
						<>
							<th>Campaign</th>
							<th>App</th>
							<th>Type</th>
							<th>Status</th>
							<th>Recipients</th>
							<th>When</th>
						</>
					}
				>
					{campaigns.data.map((campaign) => (
						<tr key={campaign.id}>
							<td>
								<Link
									className="text-primary-foreground underline-offset-4 hover:underline"
									href={`/campaigns/${campaign.id}` as Route}
								>
									{campaign.name}
								</Link>
								{campaign.sentInTestMode ? (
									<div className="text-caption text-secondary-foreground">
										Test mode: no merchant received it
									</div>
								) : null}
							</td>
							<td>{campaign.appName}</td>
							<td>{TYPE_LABEL[campaign.type] ?? campaign.type}</td>
							<td>
								<StatusBadge status={campaign.status} />
							</td>
							<td className="tabular-nums">
								{campaign.recipientCount === null
									? "-"
									: count(campaign.recipientCount)}
							</td>
							<td>{when(campaign)}</td>
						</tr>
					))}
				</TableShell>
			) : null}
		</div>
	);
}
