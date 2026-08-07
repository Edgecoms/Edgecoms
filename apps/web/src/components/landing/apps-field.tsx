import {
	Activity,
	CheckCircle2,
	Package,
	ShoppingCart,
	TrendingUp,
} from "lucide-react";

export function AppsField() {
	return (
		<div className="relative w-full border-neutral-200 border-t bg-[#F8FAFC] px-4 py-12 sm:px-8 sm:py-16">
			<div className="mx-auto flex max-w-[680px] flex-col gap-3">
				{/* Top Card - Edge Bundles */}
				<div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-4.5">
					<div className="flex items-center gap-3">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 font-bold text-orange-600">
							<Package className="size-5" />
						</div>
						<div className="flex flex-col">
							<div className="flex items-center gap-2">
								<span className="font-medium text-[14px] text-neutral-900">
									bundles.edgecoms.com
								</span>
								<span className="rounded bg-orange-100/80 px-2 py-0.5 font-semibold text-[10px] text-orange-700">
									Primary App
								</span>
							</div>
							<span className="text-[12px] text-neutral-400">
								Volume Tiers &amp; Buy-One-Get-One Offers
							</span>
						</div>
					</div>
					<div className="flex items-center gap-3 self-end sm:self-auto">
						<div className="flex items-center gap-1 rounded-md bg-neutral-100 px-2.5 py-1 font-medium text-[12px] text-neutral-600">
							<TrendingUp className="size-3.5 text-orange-600" />
							<span>+27% AOV</span>
						</div>
						<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-medium text-[11px] text-emerald-700">
							<CheckCircle2 className="size-3.5 text-emerald-600" />
							Active
						</span>
					</div>
				</div>

				{/* Middle Card - Edge Cart */}
				<div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-4.5">
					<div className="flex items-center gap-3">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 font-bold text-purple-600">
							<ShoppingCart className="size-5" />
						</div>
						<div className="flex flex-col">
							<div className="flex items-center gap-2">
								<span className="font-medium text-[14px] text-neutral-900">
									cart.edgecoms.com
								</span>
							</div>
							<span className="text-[12px] text-neutral-400">
								Slide Cart &amp; One-Click In-Cart Upsells
							</span>
						</div>
					</div>
					<div className="flex items-center gap-3 self-end sm:self-auto">
						<div className="flex items-center gap-1 rounded-md bg-neutral-100 px-2.5 py-1 font-medium text-[12px] text-neutral-600">
							<TrendingUp className="size-3.5 text-purple-600" />
							<span>+19% RPV</span>
						</div>
						<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-medium text-[11px] text-emerald-700">
							<CheckCircle2 className="size-3.5 text-emerald-600" />
							Active
						</span>
					</div>
				</div>

				{/* Bottom Card - Trackproof Attribution */}
				<div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] sm:p-5">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center gap-3">
							<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 font-bold text-emerald-600">
								<Activity className="size-5" />
							</div>
							<div className="flex flex-col">
								<span className="font-medium text-[14px] text-neutral-900">
									trackproof.edgecoms.com
								</span>
								<span className="text-[12px] text-neutral-400">
									Server-Side Meta CAPI &amp; Multi-Touch Attribution
								</span>
							</div>
						</div>
						<div className="flex items-center gap-3 self-end sm:self-auto">
							<div className="flex items-center gap-1 rounded-md bg-neutral-100 px-2.5 py-1 font-medium text-[12px] text-neutral-600">
								<span>Accurate ROAS</span>
							</div>
							<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-medium text-[11px] text-emerald-700">
								<CheckCircle2 className="size-3.5 text-emerald-600" />
								Verified
							</span>
						</div>
					</div>

					<div className="h-px w-full bg-neutral-100" />

					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<span className="text-[12px] text-neutral-500">
								Server-side conversion records:
							</span>
							<div className="flex items-center gap-2">
								<span className="rounded bg-neutral-100 px-2 py-0.5 font-medium text-[11px] text-neutral-700">
									Meta CAPI
								</span>
								<span className="rounded bg-neutral-50 px-2 py-0.5 font-medium text-[11px] text-neutral-400">
									Google Pixel
								</span>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full text-left text-[12px]">
								<thead>
									<tr className="border-neutral-100 border-b font-medium text-neutral-400">
										<th className="pb-1.5 font-medium">Event</th>
										<th className="pb-1.5 font-medium">Method</th>
										<th className="pb-1.5 font-medium">Match Rate</th>
										<th className="pb-1.5 font-medium">Status</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-neutral-50 text-neutral-600">
									<tr>
										<td className="py-2 font-medium text-neutral-900">
											Purchase
										</td>
										<td className="py-2 text-neutral-500">Server CAPI</td>
										<td className="py-2 text-neutral-500">99.4%</td>
										<td className="py-2 font-medium text-emerald-600">
											Synced
										</td>
									</tr>
									<tr>
										<td className="py-2 font-medium text-neutral-900">
											AddToCart
										</td>
										<td className="py-2 text-neutral-500">Browser + Server</td>
										<td className="py-2 text-neutral-500">98.8%</td>
										<td className="py-2 font-medium text-emerald-600">
											Synced
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
