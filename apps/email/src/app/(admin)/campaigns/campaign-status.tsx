"use client";

import { Button } from "@edgecoms/ui/components/button";
import { StatCard, StatusBadge } from "@edgecoms/ui/components/portal";
import { useMutation } from "@tanstack/react-query";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { count, dateTime } from "@/lib/format";
import { queryClient, trpc } from "@/utils/trpc";

const POLL_MS = 3000;

interface StatusCampaign {
	failureReason: string | null;
	id: string;
	recipientCount: number | null;
	scheduledAt: Date | string | null;
	sentAt: Date | string | null;
	sentInTestMode: boolean | null;
	status: string;
}

const STAT_ROWS = [
	["email.delivered", "Delivered"],
	["email.opened", "Opened"],
	["email.clicked", "Clicked"],
	["email.bounced", "Bounced"],
	["email.complained", "Complaints"],
] as const;

/**
 * A campaign past its draft. While the recipient import runs, this page
 * drives the send forward by polling; the server makes every step idempotent,
 * so two open tabs cannot send it twice.
 */
export function CampaignStatus({
	campaign,
	stats,
}: {
	campaign: StatusCampaign;
	stats: Record<string, number>;
}) {
	const router = useRouter();
	const [cancelling, setCancelling] = useState(false);
	const advance = useMutation(
		trpc.campaigns.advance.mutationOptions({
			onSettled: () => queryClient.invalidateQueries(),
		})
	);
	const cancel = useMutation(
		trpc.campaigns.cancel.mutationOptions({
			onError: (error) => toast.error(error.message),
			onSuccess: async () => {
				setCancelling(false);
				await queryClient.invalidateQueries();
			},
		})
	);
	const duplicate = useMutation(
		trpc.campaigns.duplicate.mutationOptions({
			onError: (error) => toast.error(error.message),
			onSuccess: ({ id }) => router.push(`/campaigns/${id}` as Route),
		})
	);

	const importing = campaign.status === "importing";
	const { mutate } = advance;
	useEffect(() => {
		if (!importing) {
			return;
		}
		mutate({ id: campaign.id });
		const timer = setInterval(() => mutate({ id: campaign.id }), POLL_MS);
		return () => clearInterval(timer);
	}, [importing, campaign.id, mutate]);

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-wrap items-center gap-4">
				<StatusBadge status={campaign.status} />
				<span className="text-body-sm text-secondary-foreground">
					{importing ? "Loading recipients into Resend…" : null}
					{campaign.sentAt ? `Sent ${dateTime(campaign.sentAt)}` : null}
					{campaign.status === "scheduled"
						? `Goes out ${dateTime(campaign.scheduledAt)}`
						: null}
				</span>
			</div>

			{campaign.sentInTestMode ? (
				<p className="rounded-lg border border-border p-3 text-body-sm text-secondary-foreground">
					Sent in test mode: it went to the test inbox. No merchant received it.
				</p>
			) : null}
			{campaign.failureReason ? (
				<p className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-body-sm text-rose-800">
					{campaign.failureReason}
				</p>
			) : null}

			<section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
				<StatCard
					label="Recipients"
					value={
						campaign.recipientCount === null
							? "-"
							: count(campaign.recipientCount)
					}
				/>
				{STAT_ROWS.map(([type, label]) => (
					<StatCard key={type} label={label} value={count(stats[type] ?? 0)} />
				))}
			</section>

			<div className="flex flex-wrap gap-3">
				{campaign.status === "scheduled" ? (
					<Button
						onClick={() => setCancelling(true)}
						size="lg"
						variant="secondary"
					>
						Cancel scheduled send
					</Button>
				) : null}
				<Button
					disabled={duplicate.isPending}
					onClick={() => duplicate.mutate({ id: campaign.id })}
					size="lg"
					variant="secondary"
				>
					Duplicate as draft
				</Button>
			</div>

			<ConfirmDialog
				confirmLabel="Cancel the send"
				description="Resend drops the scheduled broadcast. Nobody receives it."
				onConfirm={() => cancel.mutate({ id: campaign.id })}
				onOpenChange={setCancelling}
				open={cancelling}
				pending={cancel.isPending}
				title="Cancel this campaign?"
			/>
		</div>
	);
}
