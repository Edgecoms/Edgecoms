import { Clock, Globe, LineChart, ShoppingBag, Star } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/components/landing/frame";
import { Reveal } from "@/components/ui/reveal";

export function AppsStack() {
	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame>
				{/* Top Section Header */}
				<Reveal>
					<div className="border-neutral-200 border-b bg-white px-6 py-16 text-center sm:px-8 sm:py-20">
						<div className="mx-auto max-w-2xl">
							<h2 className="font-bold font-satoshi text-3xl text-neutral-900 leading-[1.15] tracking-tight sm:text-4xl lg:text-[44px]">
								The complete commerce
								<br />
								app stack for Shopify
							</h2>
							<p className="mx-auto mt-4 max-w-xl text-neutral-500 text-sm leading-relaxed sm:text-base">
								Everything high-growth brands need to lift AOV, boost conversion
								rate, and track true revenue attribution.
							</p>
							<div className="mt-6">
								<Link
									className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-2.5 font-medium text-white text-xs shadow-xs transition-all hover:bg-neutral-800 hover:shadow-md sm:text-sm"
									href={"/#apps" as Route}
								>
									Explore all apps
								</Link>
							</div>
						</div>
					</div>
				</Reveal>

				{/* Top Row: 2 Columns */}
				<div className="grid grid-cols-1 divide-y divide-neutral-200 border-neutral-200 border-b bg-white md:grid-cols-2 md:divide-x md:divide-y-0">
					{/* Card 1: Edge Bundles */}
					<Reveal className="grid">
						<div className="group flex flex-col justify-between">
							{/* Illustration Canvas */}
							<div className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-neutral-50/40 p-6 [background-size:16px_16px] sm:min-h-[340px]">
								{/* Background Faded Tiers */}
								<div className="absolute top-8 w-full max-w-[340px] opacity-35 transition-opacity group-hover:opacity-50">
									<div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-[11px] text-neutral-500 shadow-2xs">
										<span>Buy 1 (Standard Pack)</span>
										<span className="font-mono text-[10px] text-neutral-600">
											$34.00
										</span>
									</div>
									<div className="mt-2 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-[11px] text-neutral-500 shadow-2xs">
										<span>Buy 3 (Best Value - Save 25%)</span>
										<span className="font-mono text-[10px] text-neutral-600">
											$76.50
										</span>
									</div>
								</div>

								{/* Foreground Popover Card */}
								<div className="relative z-10 w-full max-w-[320px] rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xl transition-transform duration-300 group-hover:scale-[1.02]">
									{/* Header Row */}
									<div className="flex items-center justify-between pb-3">
										<div className="flex items-center gap-2">
											<Image
												alt="Edge Bundles"
												className="size-6 rounded-md border border-neutral-200/80 object-contain"
												height={24}
												src="/app-icons/edge-bundles.webp"
												width={24}
											/>
											<span className="font-semibold text-neutral-900 text-xs">
												Edge Bundles
											</span>
										</div>
										<span className="rounded-full border border-neutral-200/60 bg-emerald-50 px-2.5 py-0.5 font-semibold text-[10px] text-emerald-700">
											+24.8% AOV Lift
										</span>
									</div>

									{/* Primary Highlighted Tier */}
									<div className="my-2.5 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-neutral-800 text-xs">
										<div>
											<span className="font-medium text-neutral-900">
												Buy 2 Pack
											</span>{" "}
											· Save 15%
											<span className="ml-2 rounded bg-blue-600 px-1.5 py-0.5 font-bold text-[9px] text-white uppercase">
												Popular
											</span>
										</div>
										<span className="font-bold text-blue-600">$57.80</span>
									</div>

									{/* Secondary Tier */}
									<div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/60 p-3 text-neutral-600 text-xs">
										<span>Buy 3 Pack · Save 25%</span>
										<span className="font-semibold text-neutral-900">
											$76.50
										</span>
									</div>

									{/* Footnote */}
									<div className="mt-3 flex items-center justify-between border-neutral-100 border-t pt-2.5 text-[11px] text-neutral-400">
										<div className="flex items-center gap-1.5">
											<ShoppingBag className="size-3.5 text-neutral-400" />
											<span className="font-medium text-[10px] text-neutral-500">
												Automatic discount applied at checkout
											</span>
										</div>
										<span className="text-[10px] text-neutral-400">
											Zero bloat
										</span>
									</div>
								</div>
							</div>

							{/* Text Content */}
							<div className="flex flex-col items-start justify-between p-6 sm:p-8">
								<div>
									<div className="mb-1.5 flex items-center gap-2">
										<Image
											alt="Edge Bundles"
											className="size-5 rounded object-contain"
											height={20}
											src="/app-icons/edge-bundles.webp"
											width={20}
										/>
										<span className="font-mono font-semibold text-[11px] text-neutral-500 uppercase tracking-wider">
											Average Order Value
										</span>
									</div>
									<h3 className="font-semibold text-base text-neutral-900 tracking-tight sm:text-lg">
										Edge Bundles
									</h3>
									<p className="mt-2 text-neutral-500 text-xs leading-relaxed sm:text-sm">
										Turn single-item orders into multi-item carts with volume
										tiers, BOGO offers, and frequently-bought-together pairings
										without discount codes.
									</p>
								</div>
								<div className="mt-6">
									<Link
										className="inline-flex items-center justify-center rounded-lg border border-neutral-200/90 bg-white px-3.5 py-1.5 font-medium text-neutral-700 text-xs shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
										href={"/products/edge-bundles" as Route}
									>
										Learn more
									</Link>
								</div>
							</div>
						</div>
					</Reveal>

					{/* Card 2: Trackproof */}
					<Reveal className="grid" delay={0.08}>
						<div className="group flex flex-col justify-between">
							{/* Illustration Canvas */}
							<div className="relative flex min-h-[300px] w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-neutral-50/40 p-6 [background-size:16px_16px] sm:min-h-[340px]">
								{/* Top Channel Revenue Stat Card */}
								<div className="z-10 flex items-center gap-4 rounded-xl border border-neutral-200/90 bg-white px-4 py-2.5 shadow-sm">
									<div className="flex items-center gap-2">
										<div className="flex size-6 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 font-bold text-neutral-700 text-xs">
											<LineChart className="size-3.5 text-neutral-700" />
										</div>
										<div>
											<p className="font-medium text-[10px] text-neutral-400 leading-none">
												Meta Ads
											</p>
											<p className="mt-0.5 font-bold text-neutral-900 text-xs leading-none">
												US$20.6k
											</p>
										</div>
									</div>
									<div className="h-6 w-px bg-neutral-200" />
									<div className="flex items-center gap-2">
										<div className="flex size-6 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-neutral-700">
											<Globe className="size-3.5" />
										</div>
										<div>
											<p className="font-medium text-[10px] text-neutral-400 leading-none">
												Google Ads
											</p>
											<p className="mt-0.5 font-bold text-neutral-900 text-xs leading-none">
												US$14.2k
											</p>
										</div>
									</div>
								</div>

								{/* Floating Action Pill */}
								<div className="z-20 my-3 flex cursor-pointer items-center gap-2 rounded-full bg-neutral-900 px-4 py-1.5 text-white text-xs shadow-lg transition-transform duration-300 hover:scale-105">
									<Image
										alt="Trackproof"
										className="size-4 rounded object-contain"
										height={16}
										src="/app-icons/trackproof.webp"
										width={16}
									/>
									<span className="font-semibold">
										Tracked Revenue US$34.8k
									</span>
								</div>

								{/* Live Attribution Stream */}
								<div className="z-10 w-full max-w-[290px] space-y-2 rounded-2xl border border-neutral-200/90 bg-white p-3.5 shadow-md">
									{/* Row 1 */}
									<div className="flex items-center justify-between text-xs">
										<div className="flex items-center gap-2.5">
											<div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-tr from-blue-400 to-indigo-600 font-semibold text-[10px] text-white">
												M
											</div>
											<div>
												<span className="block font-medium text-[12px] text-neutral-800 leading-none">
													Oliver H.
												</span>
												<span className="text-[9px] text-neutral-400">
													Meta CAPI
												</span>
											</div>
										</div>
										<span className="font-medium font-mono text-[11px] text-emerald-600">
											+$124.00
										</span>
									</div>

									{/* Row 2 */}
									<div className="flex items-center justify-between text-xs">
										<div className="flex items-center gap-2.5">
											<div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 font-semibold text-[10px] text-white">
												T
											</div>
											<div>
												<span className="block font-medium text-[12px] text-neutral-800 leading-none">
													Diego A.
												</span>
												<span className="text-[9px] text-neutral-400">
													TikTok Pixel
												</span>
											</div>
										</div>
										<span className="font-medium font-mono text-[11px] text-emerald-600">
											+$84.00
										</span>
									</div>

									{/* Row 3 */}
									<div className="flex items-center justify-between text-xs">
										<div className="flex items-center gap-2.5">
											<div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 font-semibold text-[10px] text-white">
												G
											</div>
											<div>
												<span className="block font-medium text-[12px] text-neutral-800 leading-none">
													Stephen S.
												</span>
												<span className="text-[9px] text-neutral-400">
													Google Ads
												</span>
											</div>
										</div>
										<span className="font-medium font-mono text-[11px] text-emerald-600">
											+$210.00
										</span>
									</div>
								</div>
							</div>

							{/* Text Content */}
							<div className="flex flex-col items-start justify-between p-6 sm:p-8">
								<div>
									<div className="mb-1.5 flex items-center gap-2">
										<Image
											alt="Trackproof"
											className="size-5 rounded object-contain"
											height={20}
											src="/app-icons/trackproof.webp"
											width={20}
										/>
										<span className="font-mono font-semibold text-[11px] text-neutral-500 uppercase tracking-wider">
											Attribution & Revenue Proof
										</span>
									</div>
									<h3 className="font-semibold text-base text-neutral-900 tracking-tight sm:text-lg">
										Trackproof
									</h3>
									<p className="mt-2 text-neutral-500 text-xs leading-relaxed sm:text-sm">
										Server-side pixel attribution that tracks purchase revenue
										directly in Shopify so ad platforms optimize toward true
										profit.
									</p>
								</div>
								<div className="mt-6">
									<Link
										className="inline-flex items-center justify-center rounded-lg border border-neutral-200/90 bg-white px-3.5 py-1.5 font-medium text-neutral-700 text-xs shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
										href={"/products/trackproof" as Route}
									>
										Learn more
									</Link>
								</div>
							</div>
						</div>
					</Reveal>
				</div>

				{/* Bottom Row: 3 Columns */}
				<div className="grid grid-cols-1 divide-y divide-neutral-200 bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
					{/* Card 3: Edge Cart */}
					<Reveal className="grid">
						<div className="group flex flex-col justify-between">
							{/* Illustration Canvas */}
							<div className="relative flex min-h-[280px] w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-neutral-50/40 p-5 [background-size:16px_16px] sm:min-h-[320px]">
								{/* Slide Cart Drawer Card */}
								<div className="relative z-10 w-full max-w-[240px] space-y-2.5 rounded-2xl border border-neutral-200/90 bg-white p-3.5 shadow-xl transition-transform duration-300 group-hover:-translate-y-1">
									{/* Header */}
									<div className="flex items-center justify-between border-neutral-100 border-b pb-2">
										<div className="flex items-center gap-1.5">
											<Image
												alt="Edge Cart"
												className="size-4 rounded object-contain"
												height={16}
												src="/app-icons/edge-cart.webp"
												width={16}
											/>
											<span className="font-semibold text-neutral-900 text-xs">
												Your Cart (2)
											</span>
										</div>
										<span className="font-mono text-[10px] text-neutral-400">
											$84.00
										</span>
									</div>

									{/* Free Shipping Progress Bar */}
									<div className="rounded-xl border border-amber-100 bg-amber-50/70 p-2 text-left">
										<div className="flex items-center justify-between font-medium text-[10px] text-amber-900">
											<span>Free Shipping</span>
											<span>Add $16.00</span>
										</div>
										<div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-amber-200/60">
											<div className="h-full w-[80%] rounded-full bg-amber-500" />
										</div>
									</div>

									{/* One-Click Drawer Upsell */}
									<div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/80 p-2">
										<div className="flex items-center gap-2">
											<div className="flex size-6 items-center justify-center rounded bg-neutral-200 font-bold text-[10px] text-neutral-600">
												+1
											</div>
											<div className="text-left">
												<p className="font-medium text-[10px] text-neutral-800 leading-none">
													Priority Shipping
												</p>
												<p className="mt-0.5 text-[9px] text-neutral-400 leading-none">
													$4.99
												</p>
											</div>
										</div>
										<button
											className="rounded bg-neutral-900 px-2 py-0.5 font-semibold text-[9px] text-white"
											type="button"
										>
											+ Add
										</button>
									</div>
								</div>
							</div>

							{/* Text Content */}
							<div className="flex flex-col items-start justify-between p-6 sm:p-8">
								<div>
									<div className="mb-1.5 flex items-center gap-2">
										<Image
											alt="Edge Cart"
											className="size-4 rounded object-contain"
											height={16}
											src="/app-icons/edge-cart.webp"
											width={16}
										/>
										<span className="font-mono font-semibold text-[10px] text-neutral-500 uppercase tracking-wider">
											Slide Cart Drawer
										</span>
									</div>
									<h3 className="font-semibold text-base text-neutral-900 tracking-tight sm:text-lg">
										Edge Cart
									</h3>
									<p className="mt-2 text-neutral-500 text-xs leading-relaxed sm:text-sm">
										Replace standard cart pages with a sticky slide-out drawer
										featuring free shipping bars and in-cart upsells.
									</p>
								</div>
								<div className="mt-6">
									<Link
										className="inline-flex items-center justify-center rounded-lg border border-neutral-200/90 bg-white px-3.5 py-1.5 font-medium text-neutral-700 text-xs shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
										href={"/products/edge-cart" as Route}
									>
										Learn more
									</Link>
								</div>
							</div>
						</div>
					</Reveal>

					{/* Card 4: Edge Subscriptions */}
					<Reveal className="grid" delay={0.08}>
						<div className="group flex flex-col justify-between">
							{/* Illustration Canvas */}
							<div className="relative flex min-h-[280px] w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-neutral-50/40 p-5 [background-size:16px_16px] sm:min-h-[320px]">
								{/* Subscription Portal Mockup */}
								<div className="z-10 w-full max-w-[250px] rounded-2xl border border-neutral-200/90 bg-white p-3.5 shadow-lg transition-transform duration-300 group-hover:scale-[1.02]">
									{/* Header Profile */}
									<div className="flex items-center justify-between border-neutral-100 border-b pb-2.5">
										<div className="flex items-center gap-2">
											<Image
												alt="Edge Subscriptions"
												className="size-5 rounded object-contain"
												height={20}
												src="/app-icons/edge-subscriptions.webp"
												width={20}
											/>
											<span className="font-semibold text-neutral-900 text-xs">
												Auto-Refill
											</span>
										</div>
										<span className="rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-[9px] text-emerald-800">
											Active
										</span>
									</div>

									{/* Subscription Details */}
									<div className="mt-2.5 space-y-1.5 text-[11px]">
										<div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 p-2 font-medium text-neutral-700">
											<span className="text-[10px]">Frequency</span>
											<span className="font-semibold text-[10px] text-neutral-900">
												Every 30 Days
											</span>
										</div>

										<div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 p-2 font-medium text-neutral-700">
											<span className="text-[10px]">Recurring Discount</span>
											<span className="font-bold text-[10px] text-blue-600">
												Save 15%
											</span>
										</div>

										<div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 p-2 font-medium text-neutral-700">
											<span className="text-[10px]">Next Order Date</span>
											<span className="font-mono text-[10px] text-neutral-500">
												in 4 days
											</span>
										</div>
									</div>

									{/* Portal Actions */}
									<div className="mt-3 flex items-center justify-between border-neutral-100 border-t pt-2.5">
										<button
											className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 font-medium text-[10px] text-neutral-700 hover:bg-neutral-50"
											type="button"
										>
											Skip order
										</button>
										<button
											className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 font-medium text-[10px] text-neutral-700 hover:bg-neutral-50"
											type="button"
										>
											Swap product
										</button>
									</div>
								</div>
							</div>

							{/* Text Content */}
							<div className="flex flex-col items-start justify-between p-6 sm:p-8">
								<div>
									<div className="mb-1.5 flex items-center gap-2">
										<Image
											alt="Edge Subscriptions"
											className="size-4 rounded object-contain"
											height={16}
											src="/app-icons/edge-subscriptions.webp"
											width={16}
										/>
										<span className="font-mono font-semibold text-[10px] text-neutral-500 uppercase tracking-wider">
											Recurring Revenue
										</span>
									</div>
									<h3 className="font-semibold text-base text-neutral-900 tracking-tight sm:text-lg">
										Edge Subscriptions
									</h3>
									<p className="mt-2 text-neutral-500 text-xs leading-relaxed sm:text-sm">
										Build predictable recurring revenue with auto-refill
										subscriptions, customer portals, and zero transaction fee
										surcharges.
									</p>
								</div>
								<div className="mt-6">
									<Link
										className="inline-flex items-center justify-center rounded-lg border border-neutral-200/90 bg-white px-3.5 py-1.5 font-medium text-neutral-700 text-xs shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
										href={"/products/edge-subscriptions" as Route}
									>
										Learn more
									</Link>
								</div>
							</div>
						</div>
					</Reveal>

					{/* Card 5: Edge Timer & Reviews */}
					<Reveal className="grid" delay={0.16}>
						<div className="group flex flex-col justify-between">
							{/* Illustration Canvas */}
							<div className="relative flex min-h-[280px] w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-neutral-50/40 p-5 [background-size:16px_16px] sm:min-h-[320px]">
								{/* Timer & Reviews Combined Widget */}
								<div className="z-10 w-full max-w-[250px] rounded-xl border border-neutral-200/90 bg-white p-3.5 shadow-lg transition-transform duration-300 group-hover:scale-[1.02]">
									{/* Countdown Timer Block */}
									<div className="rounded-lg bg-neutral-900 p-2.5 text-center text-white">
										<div className="flex items-center justify-center gap-1 font-medium text-[10px] text-neutral-300">
											<Clock className="size-3 text-amber-400" />
											<span>Flash Sale Ends In</span>
										</div>
										<div className="mt-1 flex items-center justify-center gap-1.5 font-bold font-mono text-sm text-white">
											<span className="rounded bg-white/10 px-1 py-0.5">
												04
											</span>
											:
											<span className="rounded bg-white/10 px-1 py-0.5">
												18
											</span>
											:
											<span className="rounded bg-white/10 px-1 py-0.5 text-amber-400">
												32
											</span>
										</div>
									</div>

									{/* Reviews & Social Proof Rating */}
									<div className="mt-2.5 flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 p-2">
										<div className="flex items-center gap-1">
											<Image
												alt="Edge Reviews"
												className="size-4 rounded object-contain"
												height={16}
												src="/app-icons/edge-reviews.webp"
												width={16}
											/>
											<div className="flex text-amber-400">
												<Star className="size-3 fill-amber-400" />
												<Star className="size-3 fill-amber-400" />
												<Star className="size-3 fill-amber-400" />
												<Star className="size-3 fill-amber-400" />
												<Star className="size-3 fill-amber-400" />
											</div>
										</div>
										<span className="font-bold text-[10px] text-neutral-800">
											4.9/5 (1.4k)
										</span>
									</div>
								</div>
							</div>

							{/* Text Content */}
							<div className="flex flex-col items-start justify-between p-6 sm:p-8">
								<div>
									<div className="mb-1.5 flex items-center gap-2">
										<Image
											alt="Edge Timer"
											className="size-4 rounded object-contain"
											height={16}
											src="/app-icons/edge-timer.webp"
											width={16}
										/>
										<Image
											alt="Edge Reviews"
											className="size-4 rounded object-contain"
											height={16}
											src="/app-icons/edge-reviews.webp"
											width={16}
										/>
										<span className="font-mono font-semibold text-[10px] text-neutral-500 uppercase tracking-wider">
											Urgency & Social Proof
										</span>
									</div>
									<h3 className="font-semibold text-base text-neutral-900 tracking-tight sm:text-lg">
										Edge Timer & Reviews
									</h3>
									<p className="mt-2 text-neutral-500 text-xs leading-relaxed sm:text-sm">
										Drive instant buying decisions with real-time countdown
										timers and verified photo reviews built for sub-50ms speed.
									</p>
								</div>
								<div className="mt-6 flex items-center gap-2">
									<Link
										className="inline-flex items-center justify-center rounded-lg border border-neutral-200/90 bg-white px-3 py-1.5 font-medium text-neutral-700 text-xs shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
										href={"/products/edge-timer" as Route}
									>
										Edge Timer
									</Link>
									<Link
										className="inline-flex items-center justify-center rounded-lg border border-neutral-200/90 bg-white px-3 py-1.5 font-medium text-neutral-700 text-xs shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
										href={"/products/edge-reviews" as Route}
									>
										Edge Reviews
									</Link>
								</div>
							</div>
						</div>
					</Reveal>
				</div>
			</Frame>
		</section>
	);
}
