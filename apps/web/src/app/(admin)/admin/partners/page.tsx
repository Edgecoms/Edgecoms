"use client";

import { Button } from "@edgecoms/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
} from "@edgecoms/ui/components/dialog";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { PortalHeader, StatusBadge, TableShell } from "@/components/portal/ui";
import { queryClient, trpc } from "@/utils/trpc";

interface PartnerRow {
	companyName: string | null;
	defaultRateBps: number;
	id: string;
	merchantCount: number;
	name: string;
	status: string;
	website: string | null;
}

function pctToBps(value: string): number {
	const pct = Number.parseFloat(value);
	return Number.isFinite(pct) ? Math.round(pct * 100) : 0;
}

export default function AdminPartnersPage() {
	const partnersQuery = useQuery(trpc.admin.partners.list.queryOptions());
	const appsQuery = useQuery(trpc.admin.apps.list.queryOptions());
	const approveMutation = useMutation(
		trpc.admin.partners.approve.mutationOptions()
	);
	const statusMutation = useMutation(
		trpc.admin.partners.setStatus.mutationOptions()
	);
	const rateId = useId();
	const [approving, setApproving] = useState<PartnerRow | null>(null);

	function refresh() {
		queryClient.invalidateQueries({
			queryKey: trpc.admin.partners.list.queryKey(),
		});
		queryClient.invalidateQueries({
			queryKey: trpc.admin.dashboard.queryKey(),
		});
	}

	function handleApprove(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!approving) {
			return;
		}
		const form = new FormData(event.currentTarget);
		const appRates = (appsQuery.data ?? [])
			.map((app) => ({
				appId: app.id,
				raw: String(form.get(`rate_${app.id}`) ?? ""),
			}))
			.filter((entry) => entry.raw.trim() !== "")
			.map((entry) => ({ appId: entry.appId, rateBps: pctToBps(entry.raw) }));

		approveMutation.mutate(
			{
				partnerId: approving.id,
				defaultRateBps: pctToBps(String(form.get("defaultRate"))),
				appRates: appRates.length > 0 ? appRates : undefined,
			},
			{
				onSuccess: () => {
					toast.success("Partner approved.");
					setApproving(null);
					refresh();
				},
				onError: (error) => toast.error(error.message),
			}
		);
	}

	function setStatus(partnerId: string, status: "approved" | "suspended") {
		statusMutation.mutate(
			{ partnerId, status },
			{
				onSuccess: () => {
					toast.success(status === "suspended" ? "Suspended." : "Reinstated.");
					refresh();
				},
				onError: (error) => toast.error(error.message),
			}
		);
	}

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				description="Approve partners with a commission rate, add per-app overrides, and manage status."
				title="Partners"
			/>

			{partnersQuery.isLoading ? (
				<Skeleton className="h-48 w-full rounded-xl" />
			) : (
				<TableShell
					head={
						<>
							<th>Partner</th>
							<th>Status</th>
							<th className="text-right">Rate</th>
							<th className="text-right">Merchants</th>
							<th className="text-right">Action</th>
						</>
					}
				>
					{(partnersQuery.data ?? []).map((partner) => (
						<tr key={partner.id}>
							<td>
								<div className="flex flex-col">
									<span className="text-primary-foreground">
										{partner.companyName ?? partner.name}
									</span>
									<span className="text-caption text-secondary-foreground">
										{partner.email}
									</span>
								</div>
							</td>
							<td>
								<StatusBadge status={partner.status} />
							</td>
							<td className="text-right text-primary-foreground tabular-nums">
								{(partner.defaultRateBps / 100).toFixed(1)}%
							</td>
							<td className="text-right text-secondary-foreground tabular-nums">
								{partner.merchantCount}
							</td>
							<td className="text-right">
								{partner.status === "pending" ||
								partner.status === "suspended" ? (
									<Button
										onClick={() => setApproving(partner)}
										size="md"
										variant="primary"
									>
										{partner.status === "suspended" ? "Re-approve" : "Approve"}
									</Button>
								) : (
									<Button
										onClick={() => setStatus(partner.id, "suspended")}
										size="md"
										variant="secondary"
									>
										Suspend
									</Button>
								)}
							</td>
						</tr>
					))}
				</TableShell>
			)}

			<Dialog
				onOpenChange={(open) => {
					if (!open) {
						setApproving(null);
					}
				}}
				open={approving !== null}
			>
				{approving ? (
					<DialogContent
						description="Set the partner's default commission rate. Add per-app overrides as needed."
						title={`Approve ${approving.companyName ?? approving.name}`}
					>
						<form className="flex flex-col gap-5" onSubmit={handleApprove}>
							<div className="flex flex-col gap-2">
								<Label htmlFor={rateId}>Default commission rate (%)</Label>
								<Input
									defaultValue={(
										approving.defaultRateBps / 100 || 10
									).toString()}
									id={rateId}
									name="defaultRate"
									step="0.1"
									type="number"
								/>
							</div>

							<fieldset className="flex flex-col gap-2">
								<legend className="text-xs">
									Per-app overrides (optional)
								</legend>
								<div className="flex flex-col gap-2">
									{(appsQuery.data ?? []).map((app) => (
										<div
											className="flex items-center justify-between gap-3"
											key={app.id}
										>
											<span className="text-body-sm text-secondary-foreground">
												{app.name}
											</span>
											<Input
												className="w-24"
												name={`rate_${app.id}`}
												placeholder="—"
												step="0.1"
												type="number"
											/>
										</div>
									))}
								</div>
							</fieldset>

							<div className="flex items-center justify-end gap-3">
								<DialogClose
									render={
										<Button size="lg" type="button" variant="secondary">
											Cancel
										</Button>
									}
								/>
								<Button
									disabled={approveMutation.isPending}
									size="lg"
									type="submit"
									variant="primary"
								>
									{approveMutation.isPending ? "Approving…" : "Approve partner"}
								</Button>
							</div>
						</form>
					</DialogContent>
				) : null}
			</Dialog>
		</div>
	);
}
