"use client";

import {
	EmptyState,
	PortalHeader,
	StatusBadge,
	TableShell,
} from "@edgecoms/ui/components/portal";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { allMoney } from "@/lib/money";
import { trpc } from "@/utils/trpc";

export default function PartnerMerchantsPage() {
	const { data, isLoading } = useQuery(
		trpc.partner.merchants.list.queryOptions()
	);

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				description="Every store bound to your code. Net revenue is what Edge receives after Shopify's share, which is the figure your commission is a percentage of, so it is lower than the store's Shopify bill."
				title="Merchants"
			/>

			{isLoading && <Skeleton className="h-48 w-full rounded-xl" />}

			{!isLoading && data?.length === 0 && (
				<EmptyState
					description="Give your code to a merchant you manage. When they enter it in an Edge app, their store appears here for approval."
					title="No merchants yet"
				/>
			)}

			{!isLoading && !!data?.length && (
				<TableShell
					head={
						<>
							<th>Store</th>
							<th>Status</th>
							<th className="text-right">Net revenue to Edge</th>
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
								{allMoney(merchant.revenue, merchant.zeroCurrency)}
							</td>
							<td className="text-right text-primary-foreground tabular-nums">
								{allMoney(merchant.commission, merchant.zeroCurrency)}
							</td>
						</tr>
					))}
				</TableShell>
			)}
		</div>
	);
}
