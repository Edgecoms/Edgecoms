"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type FormEvent, useId } from "react";
import { toast } from "sonner";
import { PortalHeader, StatusBadge } from "@/components/portal/ui";
import { queryClient, trpc } from "@/utils/trpc";

export default function PartnerSettingsPage() {
	const companyId = useId();
	const websiteId = useId();
	const payoutMethodId = useId();
	const payoutRefId = useId();

	const { data, isLoading } = useQuery(
		trpc.partner.settings.get.queryOptions()
	);
	const updateMutation = useMutation(
		trpc.partner.settings.update.mutationOptions()
	);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		updateMutation.mutate(
			{
				companyName: String(form.get("companyName") ?? ""),
				website: String(form.get("website") ?? ""),
				payoutMethod: String(form.get("payoutMethod") ?? ""),
				payoutReference: String(form.get("payoutReference") ?? ""),
			},
			{
				onSuccess: () => {
					toast.success("Settings saved.");
					queryClient.invalidateQueries({
						queryKey: trpc.partner.settings.get.queryKey(),
					});
				},
				onError: (error) => toast.error(error.message),
			}
		);
	}

	return (
		<div className="mx-auto flex max-w-2xl flex-col gap-8">
			<PortalHeader
				description="Your company profile and payout details."
				title="Settings"
			/>

			{isLoading || !data ? (
				<Skeleton className="h-72 w-full rounded-xl" />
			) : (
				<>
					<div className="flex flex-wrap items-center gap-6 rounded-xl border border-border bg-page p-5">
						<div className="flex flex-col gap-1">
							<span className="font-medium font-mono text-[11px] text-secondary-foreground uppercase tracking-[0.08em]">
								Account status
							</span>
							<StatusBadge status={data.status} />
						</div>
						<div className="flex flex-col gap-1">
							<span className="font-medium font-mono text-[11px] text-secondary-foreground uppercase tracking-[0.08em]">
								Commission rate
							</span>
							<span className="font-medium text-body text-primary-foreground tabular-nums">
								{(data.defaultRateBps / 100).toFixed(2)}%
							</span>
						</div>
					</div>

					<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
						<div className="flex flex-col gap-2">
							<Label htmlFor={companyId}>Company name</Label>
							<Input
								defaultValue={data.companyName ?? ""}
								id={companyId}
								name="companyName"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor={websiteId}>Website</Label>
							<Input
								defaultValue={data.website ?? ""}
								id={websiteId}
								name="website"
								placeholder="https://"
							/>
						</div>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<div className="flex flex-col gap-2">
								<Label htmlFor={payoutMethodId}>Payout method</Label>
								<Input
									defaultValue={data.payoutMethod ?? ""}
									id={payoutMethodId}
									name="payoutMethod"
									placeholder="PayPal, Wise, Bank…"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor={payoutRefId}>Payout reference</Label>
								<Input
									defaultValue={data.payoutReference ?? ""}
									id={payoutRefId}
									name="payoutReference"
									placeholder="Account / email"
								/>
							</div>
						</div>
						<div>
							<Button
								disabled={updateMutation.isPending}
								size="xl"
								type="submit"
								variant="primary"
							>
								{updateMutation.isPending ? "Saving…" : "Save changes"}
							</Button>
						</div>
					</form>
				</>
			)}
		</div>
	);
}
