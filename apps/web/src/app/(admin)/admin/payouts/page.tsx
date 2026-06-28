"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	EmptyState,
	PortalHeader,
	StatusBadge,
	TableShell,
} from "@/components/portal/ui";
import { formatMoney, formatPeriod } from "@/lib/money";
import { queryClient, trpc } from "@/utils/trpc";

export default function AdminPayoutsPage() {
	const groupableQuery = useQuery(trpc.admin.payouts.groupable.queryOptions());
	const historyQuery = useQuery(trpc.admin.payouts.list.queryOptions());
	const payMutation = useMutation(trpc.admin.payouts.pay.mutationOptions());

	function pay(group: {
		partnerId: string;
		periodMonth: string;
		currency: string;
	}) {
		payMutation.mutate(group, {
			onSuccess: () => {
				toast("Payout recorded.");
				for (const key of [
					trpc.admin.payouts.groupable.queryKey(),
					trpc.admin.payouts.list.queryKey(),
					trpc.admin.commissions.list.queryKey(),
					trpc.admin.dashboard.queryKey(),
				]) {
					queryClient.invalidateQueries({ queryKey: key });
				}
			},
			onError: (error) => toast.error(error.message),
		});
	}

	return (
		<div className="flex flex-col gap-10">
			<PortalHeader
				description="Group a partner's pending commissions for a period into a single paid payout."
				title="Payouts"
			/>

			<section className="flex flex-col gap-4">
				<h2 className="font-medium text-h3 text-primary-foreground">Payable</h2>
				{groupableQuery.isLoading && (
					<Skeleton className="h-32 w-full rounded-xl" />
				)}
				{!groupableQuery.isLoading && groupableQuery.data?.length === 0 && (
					<EmptyState
						description="When approved merchants generate commission, payable groups appear here."
						title="Nothing payable right now"
					/>
				)}
				{!groupableQuery.isLoading && !!groupableQuery.data?.length && (
					<TableShell
						head={
							<>
								<th>Partner</th>
								<th>Period</th>
								<th className="text-right">Items</th>
								<th className="text-right">Total</th>
								<th className="text-right">Action</th>
							</>
						}
					>
						{(groupableQuery.data ?? []).map((group) => (
							<tr
								key={`${group.partnerId}-${group.periodMonth}-${group.currency}`}
							>
								<td className="text-primary-foreground">{group.partner}</td>
								<td className="text-secondary-foreground">
									{formatPeriod(group.periodMonth)}
								</td>
								<td className="text-right text-secondary-foreground tabular-nums">
									{group.items}
								</td>
								<td className="text-right text-primary-foreground tabular-nums">
									{formatMoney(group.totalMinor, group.currency)}
								</td>
								<td className="text-right">
									<Button
										disabled={payMutation.isPending}
										onClick={() =>
											pay({
												partnerId: group.partnerId,
												periodMonth: group.periodMonth,
												currency: group.currency,
											})
										}
										size="md"
										variant="primary"
									>
										Mark paid
									</Button>
								</td>
							</tr>
						))}
					</TableShell>
				)}
			</section>

			<section className="flex flex-col gap-4">
				<h2 className="font-medium text-h3 text-primary-foreground">
					Payout history
				</h2>
				{historyQuery.isLoading && (
					<Skeleton className="h-32 w-full rounded-xl" />
				)}
				{!historyQuery.isLoading && historyQuery.data?.length === 0 && (
					<EmptyState
						description="No payouts have been recorded yet."
						title="No payouts"
					/>
				)}
				{!historyQuery.isLoading && !!historyQuery.data?.length && (
					<TableShell
						head={
							<>
								<th>Partner</th>
								<th>Period</th>
								<th>Status</th>
								<th className="text-right">Amount</th>
							</>
						}
					>
						{(historyQuery.data ?? []).map((payout) => (
							<tr key={payout.id}>
								<td className="text-primary-foreground">{payout.partner}</td>
								<td className="text-secondary-foreground">
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
			</section>
		</div>
	);
}
