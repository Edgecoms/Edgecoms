"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmptyState, PortalHeader, TableShell } from "@/components/portal/ui";
import { queryClient, trpc } from "@/utils/trpc";

/**
 * SUGGESTED MATCHES: installs that came from an address which clicked a
 * partner's link, and which nothing attributed automatically.
 *
 * A shared address is the whole problem. An agency, a household and a cafe all
 * look the same from here, so the platform records the coincidence and refuses
 * to act on it. This page is where a person decides.
 *
 * Approving lands the store exactly as an honoured claim does: bound to the
 * partner, `pending` until merchant approval, earning from today. A store that
 * already belongs to somebody is never moved, even from here.
 */

interface SuggestionRow {
	appSlug: string | null;
	createdAt: Date | string;
	id: string;
	linkSlug: string | null;
	partnerName: string;
	shopDomain: string;
	subId: string | null;
}

function formatWhen(value: Date | string): string {
	return new Date(value).toLocaleString(undefined, {
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		month: "short",
	});
}

function describeOutcome(status: string): string {
	if (status === "attributed") {
		return "Attributed. The store is waiting for merchant approval.";
	}
	if (status === "existing") {
		return "That store already belongs to a partner, so nothing moved.";
	}
	if (status === "self_referral") {
		return "Refused: that store looks like the partner's own.";
	}
	return "Nothing to do: the suggestion was already handled.";
}

function SuggestionActions({ claimId }: { claimId: string }) {
	const invalidate = () =>
		queryClient.invalidateQueries({
			queryKey: trpc.admin.referrals.suggestions.list.queryKey(),
		});
	const approve = useMutation(
		trpc.admin.referrals.suggestions.approve.mutationOptions()
	);
	const dismiss = useMutation(
		trpc.admin.referrals.suggestions.dismiss.mutationOptions()
	);
	const busy = approve.isPending || dismiss.isPending;

	return (
		<div className="flex justify-end gap-2">
			<Button
				disabled={busy}
				onClick={() =>
					dismiss.mutate(
						{ claimId },
						{
							onError: (error) => toast.error(error.message),
							onSuccess: () => {
								toast.success("Dismissed.");
								invalidate();
							},
						}
					)
				}
				size="md"
				variant="tertiary"
			>
				Dismiss
			</Button>
			<Button
				disabled={busy}
				onClick={() =>
					approve.mutate(
						{ claimId },
						{
							onError: (error) => toast.error(error.message),
							onSuccess: (result) => {
								toast.success(describeOutcome(result.status));
								invalidate();
							},
						}
					)
				}
				size="md"
				variant="secondary"
			>
				Attribute
			</Button>
		</div>
	);
}

export default function AdminReferralsPage() {
	const suggestionsQuery = useQuery(
		trpc.admin.referrals.suggestions.list.queryOptions()
	);
	const rows: SuggestionRow[] = suggestionsQuery.data ?? [];

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				description="Installs that came from an address which clicked a partner's link. Nothing here is attributed until you say so, because one address can belong to an agency, a household or a cafe."
				title="Suggested matches"
			/>

			{suggestionsQuery.isLoading && (
				<Skeleton className="h-40 w-full rounded-xl" />
			)}

			{!suggestionsQuery.isLoading && rows.length === 0 && (
				<EmptyState
					description="A suggestion appears when a store installs an Edge app from an address that clicked a partner's link in the last week, and no claim or code explains it."
					title="Nothing to judge"
				/>
			)}

			{!suggestionsQuery.isLoading && rows.length > 0 && (
				<TableShell
					head={
						<>
							<th>Store</th>
							<th>Partner</th>
							<th>Link</th>
							<th>Seen</th>
							<th className="text-right">Action</th>
						</>
					}
				>
					{rows.map((row) => (
						<tr key={row.id}>
							<td className="font-mono text-primary-foreground">
								{row.shopDomain}
							</td>
							<td className="text-secondary-foreground">{row.partnerName}</td>
							<td className="text-secondary-foreground">
								{row.linkSlug ?? "Main link"}
								{row.subId ? ` · ${row.subId}` : ""}
							</td>
							<td className="text-secondary-foreground">
								{formatWhen(row.createdAt)}
							</td>
							<td className="text-right">
								<SuggestionActions claimId={row.id} />
							</td>
						</tr>
					))}
				</TableShell>
			)}
		</div>
	);
}
