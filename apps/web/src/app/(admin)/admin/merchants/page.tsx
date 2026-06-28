"use client";

import { Button } from "@edgecoms/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
} from "@edgecoms/ui/components/dialog";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { PortalHeader, StatusBadge, TableShell } from "@/components/portal/ui";
import { queryClient, trpc } from "@/utils/trpc";

interface MerchantRow {
	id: string;
	name: string;
	notes: string | null;
	partnerCompany: string | null;
	partnerName: string;
	shopDomain: string;
	status: string;
}

export default function AdminMerchantsPage() {
	const merchantsQuery = useQuery(trpc.admin.merchants.list.queryOptions());
	const appsQuery = useQuery(trpc.admin.apps.list.queryOptions());
	const approveMutation = useMutation(
		trpc.admin.merchants.approve.mutationOptions()
	);
	const rejectMutation = useMutation(
		trpc.admin.merchants.reject.mutationOptions()
	);
	const [approving, setApproving] = useState<MerchantRow | null>(null);

	function refresh() {
		queryClient.invalidateQueries({
			queryKey: trpc.admin.merchants.list.queryKey(),
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
		const grandfatheredAppIds = form.getAll("grandfathered").map(String);

		approveMutation.mutate(
			{ merchantId: approving.id, grandfatheredAppIds },
			{
				onSuccess: () => {
					toast.success("Merchant approved.");
					setApproving(null);
					refresh();
				},
				onError: (error) => toast.error(error.message),
			}
		);
	}

	function reject(merchantId: string) {
		rejectMutation.mutate(
			{ merchantId },
			{
				onSuccess: () => {
					toast.success("Merchant rejected.");
					refresh();
				},
				onError: (error) => toast.error(error.message),
			}
		);
	}

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				description="Approve merchants and capture the apps they were already paying for — those never earn."
				title="Merchant approvals"
			/>

			{merchantsQuery.isLoading ? (
				<Skeleton className="h-48 w-full rounded-xl" />
			) : (
				<TableShell
					head={
						<>
							<th>Store</th>
							<th>Partner</th>
							<th>Status</th>
							<th className="text-right">Action</th>
						</>
					}
				>
					{(merchantsQuery.data ?? []).map((merchant) => (
						<tr key={merchant.id}>
							<td>
								<div className="flex flex-col">
									<span className="text-primary-foreground">
										{merchant.name}
									</span>
									<span className="text-caption text-secondary-foreground">
										{merchant.shopDomain}
									</span>
								</div>
							</td>
							<td className="text-secondary-foreground">
								{merchant.partnerCompany ?? merchant.partnerName}
							</td>
							<td>
								<StatusBadge status={merchant.status} />
							</td>
							<td className="text-right">
								{merchant.status === "pending" ? (
									<div className="flex items-center justify-end gap-2">
										<Button
											onClick={() => reject(merchant.id)}
											size="md"
											variant="secondary"
										>
											Reject
										</Button>
										<Button
											onClick={() => setApproving(merchant)}
											size="md"
											variant="primary"
										>
											Approve
										</Button>
									</div>
								) : (
									<span className="text-caption text-secondary-foreground">
										—
									</span>
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
						description="Select the apps this store was ALREADY paying for at approval. These are grandfathered and never earn commission."
						title={`Approve ${approving.name}`}
					>
						<form className="flex flex-col gap-5" onSubmit={handleApprove}>
							<fieldset className="flex flex-col gap-3">
								<legend className="text-xs">Grandfathered apps</legend>
								<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
									{(appsQuery.data ?? []).map((app) => (
										<label
											className="flex items-center gap-2 text-body-sm text-secondary-foreground"
											key={app.id}
										>
											<input
												className="size-4 accent-primary"
												name="grandfathered"
												type="checkbox"
												value={app.id}
											/>
											{app.name}
										</label>
									))}
								</div>
								{approving.notes ? (
									<p className="whitespace-pre-line rounded-lg bg-surface-item-hover px-3 py-2 text-caption text-secondary-foreground">
										{approving.notes}
									</p>
								) : null}
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
									{approveMutation.isPending
										? "Approving…"
										: "Approve merchant"}
								</Button>
							</div>
						</form>
					</DialogContent>
				) : null}
			</Dialog>
		</div>
	);
}
