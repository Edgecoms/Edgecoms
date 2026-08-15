import {
	BadgePercent,
	Clock,
	Globe,
	Layers,
	LineChart,
	RefreshCw,
	ShieldCheck,
	ShoppingBag,
	Sparkles,
	Star,
	TrendingUp,
	Zap,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Frame } from "@/components/landing/frame";
import { Reveal } from "@/components/ui/reveal";

const EDGE_SUITE_FEATURES = [
	{
		title: "Raise AOV",
		items: [
			{ icon: ShoppingBag, label: "Volume & Tiered Bundles" },
			{ icon: BadgePercent, label: "Buy-One-Get-One (BOGO) Offers" },
			{ icon: Layers, label: "Frequently Bought Together" },
			{ icon: TrendingUp, label: "Dynamic Bundle Builder" },
		],
	},
	{
		title: "Boost Conversion",
		items: [
			{ icon: ShoppingBag, label: "Slide Cart & Drawer Upsells" },
			{ icon: Clock, label: "Urgency Countdown Timers" },
			{ icon: Star, label: "Photo & Verified Reviews" },
			{ icon: Globe, label: "Multi-Currency Auto-Switcher" },
		],
	},
	{
		title: "Repeat & Attribute",
		items: [
			{ icon: RefreshCw, label: "Auto-Refill Subscriptions" },
			{ icon: LineChart, label: "Server-Side Pixel Attribution" },
			{ icon: ShieldCheck, label: "Shopify Analytics Integration" },
			{ icon: Zap, label: "Real-Time Conversion Tracking" },
		],
	},
	{
		title: "Enterprise Built",
		items: [
			{ icon: Zap, label: "Zero Theme Liquid Bloat" },
			{ icon: Globe, label: "Sub-50ms Global Edge Latency" },
			{ icon: ShieldCheck, label: "Priority 24/7 Merchant Support" },
			{ icon: Sparkles, highlight: true, label: "Includes Free Plans" },
		],
	},
] as const;

export function ScaleConfidence() {
	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame>
				<div className="px-4 py-8 sm:px-6 sm:py-12">
					{/* Section Header */}
					<Reveal>
						<div className="mx-auto max-w-2xl text-center">
							<h2 className="font-bold font-satoshi text-3xl text-neutral-900 leading-[1.1] tracking-tight sm:text-4xl lg:text-[44px]">
								Launch today,
								<br />
								scale with confidence
							</h2>
							<p className="mt-4 text-neutral-500 text-sm leading-relaxed sm:text-base">
								Advanced features to lift conversion rate, grow average order
								value, and automate storefront growth at scale.
							</p>
						</div>
					</Reveal>

					{/* Section Content */}
					<div className="mt-12 flex flex-col gap-6 sm:mt-16">
						{/* Top Main Feature Card */}
						<div className="rounded-3xl border border-neutral-200/80 bg-neutral-50/50 p-6 sm:p-8">
							{/* Top Card Header */}
							<div className="flex items-start justify-between gap-4">
								<div>
									<span className="inline-block rounded-full border border-neutral-200/80 bg-white px-2.5 py-0.5 font-medium text-[11px] text-neutral-600 shadow-2xs">
										Suite
									</span>
									<h3 className="mt-3 font-bold text-neutral-900 text-xl tracking-tight sm:text-2xl">
										Complete Commerce Suite
									</h3>
									<p className="mt-1 text-neutral-500 text-xs sm:text-sm">
										Access all 7 Edge apps with a single installation on any
										Shopify OS 2.0 theme.
									</p>
								</div>
								<Link
									className="inline-flex shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-medium text-neutral-700 text-xs shadow-2xs transition-colors hover:bg-neutral-50"
									href={"/#apps" as Route}
								>
									Explore all apps
								</Link>
							</div>

							{/* 4 Feature Columns */}
							<div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
								{EDGE_SUITE_FEATURES.map((col, index) => (
									<Reveal delay={index * 0.07} key={col.title}>
										<div>
											<h4 className="mb-3 font-semibold text-neutral-900 text-xs sm:text-sm">
												{col.title}
											</h4>
											<ul className="flex flex-col gap-2.5">
												{col.items.map((item) => {
													const Icon = item.icon;
													const isHighlight =
														"highlight" in item && item.highlight;

													return (
														<li
															className="flex items-center gap-2 text-neutral-600 text-xs sm:text-[13px]"
															key={item.label}
														>
															{isHighlight ? (
																<span className="flex size-4 shrink-0 items-center justify-center rounded bg-orange-500 text-white">
																	<Icon className="size-2.5" />
																</span>
															) : (
																<Icon className="size-3.5 shrink-0 text-neutral-400" />
															)}
															<span
																className={
																	isHighlight
																		? "font-medium text-neutral-900 underline underline-offset-2"
																		: "underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-500"
																}
															>
																{item.label}
															</span>
														</li>
													);
												})}
											</ul>
										</div>
									</Reveal>
								))}
							</div>
						</div>

						{/* Bottom 2 Grid Cards */}
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							{/* Card 1: Starter / Free Tier */}
							<div className="flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-neutral-50/50 p-6 sm:p-8">
								{/* Visual Header Block */}
								<div className="relative flex h-[180px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/60 bg-gradient-to-b from-orange-50/40 via-white to-white p-4 shadow-2xs sm:h-[200px]">
									{/* Month / Tier Pill */}
									<div className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 font-semibold text-neutral-900 text-xs">
										Free Plan Available
									</div>

									{/* Stats Row */}
									<div className="mt-4 flex items-center gap-2 sm:gap-3">
										<div className="flex flex-col items-center p-2 text-neutral-400 text-xs opacity-40">
											<span className="font-semibold text-[10px]">THEME</span>
											<span className="font-bold text-base">OS 2.0</span>
										</div>

										{/* Highlighted Selected Card */}
										<div className="flex flex-col items-center rounded-2xl border border-neutral-200/80 bg-white px-4 py-2.5 shadow-md">
											<span className="font-semibold text-[11px] text-neutral-500">
												PRICE
											</span>
											<span className="font-bold text-2xl text-neutral-900">
												$0
											</span>
										</div>

										<div className="flex flex-col items-center rounded-2xl bg-neutral-100/60 p-2.5 text-neutral-500 text-xs opacity-70">
											<span className="font-semibold text-[10px]">TRIAL</span>
											<span className="font-bold text-base">FREE</span>
										</div>

										<div className="flex flex-col items-center p-2 text-neutral-400 text-xs opacity-40">
											<span className="font-semibold text-[10px]">CARDS</span>
											<span className="font-bold text-base">NONE</span>
										</div>
									</div>
								</div>

								{/* Card Content */}
								<div className="mt-6">
									<span className="inline-block rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 font-medium text-[11px] text-neutral-700 shadow-2xs">
										Starter
									</span>
									<h3 className="mt-3 font-bold text-2xl text-neutral-900 tracking-tight sm:text-3xl">
										Free on 5 of 7 apps
									</h3>
									<p className="mt-2 max-w-sm text-neutral-500 text-xs leading-relaxed sm:text-sm">
										Install Edge Bundles, Cart, Timer, Currency, and Reviews
										with zero upfront cost. Upgrade only as your store's order
										volume grows.
									</p>
								</div>
							</div>

							{/* Card 2: Full Suite Discount */}
							<div className="flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-neutral-50/50 p-6 sm:p-8">
								{/* Visual Header Block */}
								<div className="relative flex h-[180px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/60 bg-gradient-to-b from-orange-50/40 via-white to-white p-4 shadow-2xs sm:h-[200px]">
									{/* Tier Pill */}
									<div className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 font-semibold text-neutral-900 text-xs">
										All-Access Growth Suite
									</div>

									{/* Stats Row */}
									<div className="mt-4 flex items-center gap-2 sm:gap-3">
										<div className="flex flex-col items-center p-2 text-neutral-400 text-xs opacity-40">
											<span className="font-semibold text-[10px]">APPS</span>
											<span className="font-bold text-base">7/7</span>
										</div>

										{/* Highlighted Selected Card with Annotation */}
										<div className="relative flex flex-col items-center rounded-2xl border border-neutral-200/80 bg-white px-4 py-2.5 shadow-md">
											<span className="font-semibold text-[11px] text-neutral-500">
												SAVINGS
											</span>
											<span className="font-bold text-2xl text-neutral-900">
												50%
											</span>
											<span className="absolute -bottom-3 -rotate-6 rounded border border-orange-200 bg-orange-50 px-1 font-bold font-mono text-[9px] text-orange-600 shadow-2xs">
												SUITE!
											</span>
										</div>

										<div className="flex flex-col items-center rounded-2xl bg-neutral-100/60 p-2.5 text-neutral-500 text-xs opacity-70">
											<span className="font-semibold text-[10px]">FEES</span>
											<span className="font-bold text-base">0%</span>
										</div>

										<div className="flex flex-col items-center p-2 text-neutral-400 text-xs opacity-40">
											<span className="font-semibold text-[10px]">SETUP</span>
											<span className="font-bold text-base">EASY</span>
										</div>
									</div>
								</div>

								{/* Card Content */}
								<div className="mt-6">
									<span className="inline-block rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 font-medium text-[11px] text-neutral-700 shadow-2xs">
										Full Suite
									</span>
									<h3 className="mt-3 font-bold text-2xl text-neutral-900 tracking-tight sm:text-3xl">
										Save 50% when bundled
									</h3>
									<p className="mt-2 max-w-sm text-neutral-500 text-xs leading-relaxed sm:text-sm">
										Get unlimited access to the complete suite of 7 Edge apps
										for one simple flat monthly price with no hidden per-order
										fees.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}
