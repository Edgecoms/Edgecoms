"use client";

import { ButtonLink } from "@edgecoms/ui/components/button";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import {
	EmptyState,
	PortalHeader,
	StatusBadge,
	TableShell,
} from "@/components/portal/ui";
import { formatMoney } from "@/lib/money";
import { trpc } from "@/utils/trpc";

export default function PartnerMerchantsPage() {
	const { data, isLoading } = useQuery(
		trpc.partner.merchants.list.queryOptions()
	);

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				action={
					<ButtonLink
						href={"/partner/merchants/register" as Route}
						size="lg"
						variant="primary"
					>
						Register merchant
					</ButtonLink>
				}
				description="Every store you've registered, with the commission it has generated."
				title="Merchants"
			/>

			{isLoading && <Skeleton className="h-48 w-full rounded-xl" />}

			{!isLoading && data?.length === 0 && (
				<EmptyState
					action={
						<ButtonLink
							href={"/partner/merchants/register" as Route}
							size="lg"
							variant="primary"
						>
							Register your first merchant
						</ButtonLink>
					}
					description="Register the Shopify stores you manage to start earning commission."
					title="No merchants yet"
				/>
			)}

			{!isLoading && !!data?.length && (
				<TableShell
					head={
						<>
							<th>Store</th>
							<th>Status</th>
							<th className="text-right">Revenue generated</th>
							<th className="text-right">Commission earned</th>
						</>
					}
				>
					{(data ?? []).map((merchant) => (
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
							<td>
								<StatusBadge status={merchant.status} />
							</td>
							<td className="text-right text-secondary-foreground tabular-nums">
								{formatMoney(merchant.revenueMinor, merchant.currency)}
							</td>
							<td className="text-right text-primary-foreground tabular-nums">
								{formatMoney(merchant.commissionMinor, merchant.currency)}
							</td>
						</tr>
					))}
				</TableShell>
			)}
		</div>
	);
}
