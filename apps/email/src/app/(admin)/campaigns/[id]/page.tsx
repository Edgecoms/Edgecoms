"use client";

import { PortalHeader } from "@edgecoms/ui/components/portal";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { CampaignStatus } from "../campaign-status";
import { Composer } from "../composer";

export default function CampaignPage() {
	const { id } = useParams<{ id: string }>();
	const query = useQuery(trpc.campaigns.get.queryOptions({ id }));

	if (!query.data) {
		return <Skeleton className="h-96 w-full" />;
	}
	const { campaign, stats } = query.data;
	const tested =
		campaign.testSentAt !== null &&
		new Date(campaign.testSentAt).getTime() >=
			new Date(campaign.contentUpdatedAt).getTime();

	return (
		<div className="flex flex-col gap-6">
			<PortalHeader description={campaign.subject} title={campaign.name} />
			{campaign.status === "draft" ? (
				<Composer
					campaign={{
						form: {
							appId: campaign.appId,
							audience: campaign.audience,
							body: campaign.body,
							ctaLabel: campaign.ctaLabel ?? "",
							ctaUrl: campaign.ctaUrl ?? "",
							eyebrow: campaign.eyebrow ?? "",
							headline: campaign.headline,
							name: campaign.name,
							preheader: campaign.preheader,
							subject: campaign.subject,
							type: campaign.type,
						},
						id: campaign.id,
						tested,
					}}
					key={`${campaign.id}:${String(campaign.contentUpdatedAt)}`}
				/>
			) : (
				<CampaignStatus campaign={campaign} stats={stats} />
			)}
		</div>
	);
}
