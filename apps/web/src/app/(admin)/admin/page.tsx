"use client";

import { Button } from "@edgecoms/ui/components/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PortalHeader, StatCard } from "@/components/portal/ui";
import { formatMoney } from "@/lib/money";
import { queryClient, trpc } from "@/utils/trpc";

function formatTimestamp(value: string | Date | null | undefined): string {
	if (!value) {
		return "—";
	}
	return new Date(value).toLocaleString();
}

export default function AdminDashboardPage() {
	const { data, isLoading } = useQuery(trpc.admin.dashboard.queryOptions());
	const syncQuery = useQuery(trpc.admin.syncState.queryOptions());
	const runSync = useMutation(trpc.admin.runSync.mutationOptions());
	const currency = data?.currency ?? "USD";
	const sync = syncQuery.data?.[0];

	function handleRunSync() {
		runSync.mutate(undefined, {
			onSuccess: (summary) => {
				toast.success(
					`Sync complete — ${summary.reconcile.earningsInserted} new earnings, ${summary.commissions.commissionsCreated} commissions.`
				);
				queryClient.invalidateQueries({
					queryKey: trpc.admin.syncState.queryKey(),
				});
				queryClient.invalidateQueries({
					queryKey: trpc.admin.dashboard.queryKey(),
				});
			},
			onError: (error) => toast.error(error.message),
		});
	}

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				action={
					<Button
						disabled={runSync.isPending}
						onClick={handleRunSync}
						size="lg"
						variant="secondary"
					>
						{runSync.isPending ? "Running…" : "Run sync now"}
					</Button>
				}
				description="Program health: partners, merchants, commission, and what's owed."
				title="Admin overview"
			/>

			<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
				<StatCard
					label="Partners"
					loading={isLoading}
					value={data?.totalPartners ?? 0}
				/>
				<StatCard
					hint="Awaiting approval"
					label="Pending partners"
					loading={isLoading}
					value={data?.pendingPartners ?? 0}
				/>
				<StatCard
					label="Active merchants"
					loading={isLoading}
					value={data?.activeMerchants ?? 0}
				/>
				<StatCard
					hint="Awaiting approval"
					label="Pending merchants"
					loading={isLoading}
					value={data?.pendingMerchants ?? 0}
				/>
				<StatCard
					hint="This month"
					label="Commissions"
					loading={isLoading}
					value={formatMoney(data?.monthlyCommissionsMinor ?? "0", currency)}
				/>
				<StatCard
					hint="Unpaid commission"
					label="Pending payouts"
					loading={isLoading}
					value={formatMoney(data?.pendingPayoutsMinor ?? "0", currency)}
				/>
			</div>

			<div className="flex flex-col gap-4">
				<h2 className="font-medium text-h3 text-primary-foreground">
					Billing sync
				</h2>
				<div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-page p-5 sm:grid-cols-3">
					<div className="flex flex-col gap-1">
						<span className="font-medium font-mono text-[11px] text-secondary-foreground uppercase tracking-[0.08em]">
							Last success
						</span>
						<span className="text-body-sm text-primary-foreground">
							{formatTimestamp(sync?.lastSuccessAt)}
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="font-medium font-mono text-[11px] text-secondary-foreground uppercase tracking-[0.08em]">
							Last run finished
						</span>
						<span className="text-body-sm text-primary-foreground">
							{formatTimestamp(sync?.lastRunFinishedAt)}
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="font-medium font-mono text-[11px] text-secondary-foreground uppercase tracking-[0.08em]">
							Cursor
						</span>
						<span className="truncate text-body-sm text-primary-foreground">
							{sync?.cursor ?? "—"}
						</span>
					</div>
					{sync?.lastError ? (
						<div className="sm:col-span-3">
							<span className="font-medium font-mono text-[11px] text-rose-600 uppercase tracking-[0.08em]">
								Last error
							</span>
							<p className="text-body-sm text-rose-700">{sync.lastError}</p>
						</div>
					) : null}
					{sync ? null : (
						<p className="text-body-sm text-secondary-foreground sm:col-span-3">
							No sync has run yet. Configure the Partner API credentials and run
							a sync.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
