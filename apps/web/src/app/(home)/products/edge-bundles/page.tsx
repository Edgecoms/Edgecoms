"use client";

import {
	ArrowRight,
	Box,
	Check,
	ChevronDown,
	Code,
	Download,
	Layers,
	Minus,
	Package,
	Play,
	Plus,
	ShoppingBag,
	Sparkles,
	TrendingUp,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { BOOKING_URL } from "@/lib/booking";
import { getProduct } from "@/lib/products";

const product = getProduct("edge-bundles");

function EdgeBundlesHeroSection() {
	const [selectedTier, setSelectedTier] = useState<number>(2);

	return (
		<section className="relative isolate w-full overflow-hidden border-neutral-200 border-b bg-white">
			<Frame className="relative pt-16 pb-12 sm:pt-20 sm:pb-16">
				{/* Inner background grid lines with radial mask */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60 [mask-image:radial-gradient(ellipse_100%_65%_at_50%_100%,black_30%,transparent_80%)]"
				/>

				{/* Soft violet/indigo ambient glow */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[radial-gradient(ellipse_85%_65%_at_50%_90%,rgba(147,51,234,0.15),rgba(99,102,241,0.1),transparent_75%)]"
				/>

				<div className="mx-auto max-w-[1080px] px-4 sm:px-6">
					<div className="flex flex-col items-start text-left max-w-[540px] z-20 relative">
						<span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200/80 bg-purple-50 px-3 py-1 font-semibold text-xs text-purple-700 shadow-2xs">
							<span className="size-2 rounded-full bg-purple-600" />
							{product?.name ?? "Edge Bundles"}
						</span>

						<h1 className="mt-4 font-bold font-satoshi text-4xl sm:text-5xl lg:text-[52px] text-neutral-900 leading-[1.08] tracking-tight">
							{product?.tagline ?? "Raise AOV without touching ad spend."}
						</h1>

						<p className="mt-4 text-neutral-500 text-sm sm:text-base leading-relaxed max-w-[480px]">
							{product?.heroLead ??
								"Bundles, volume tiers, and frequently-bought-together offers that get a second item into the cart. No discount codes, no extra traffic, no new customers required."}
						</p>

						<div className="mt-6 flex items-center gap-3">
							<a
								href={product?.appStoreUrl ?? "https://apps.shopify.com/edge-bundles"}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800"
							>
								Start for free
							</a>
							<a
								href={BOOKING_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 font-medium text-sm text-neutral-900 shadow-2xs transition-colors hover:bg-neutral-50"
							>
								<Play className="size-3.5 fill-neutral-800 text-neutral-800" />
								<span>Watch Demo</span>
							</a>
						</div>
					</div>

					{/* Interactive Bundle Builder Preview UI Card */}
					<div className="relative mt-10 sm:mt-6 w-full max-w-2xl mx-auto rounded-3xl border border-neutral-200/90 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-md">
						<div className="flex items-center justify-between border-neutral-200 border-b pb-4">
							<div className="flex items-center gap-2.5">
								<div className="size-9 rounded-xl bg-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
									<Package className="size-5" />
								</div>
								<div>
									<h3 className="font-bold text-neutral-900 text-sm">Ultra-Hydration Skincare Set</h3>
									<p className="text-xs text-neutral-400">Mix & Match Volume Tier Offer</p>
								</div>
							</div>
							<span className="rounded-full bg-purple-50 border border-purple-200 px-3 py-1 font-mono font-bold text-xs text-purple-700">
								+ $42.00 AOV Boost
							</span>
						</div>

						{/* Tier Selector List */}
						<div className="mt-6 flex flex-col gap-3">
							{[
								{ id: 1, title: "Buy 1 Item", desc: "Standard retail price", price: "$48.00", badge: null },
								{ id: 2, title: "Buy 2 Get 1 Free (Popular)", desc: "Save 33% on bundle", price: "$96.00", badge: "SAVE 33%" },
								{ id: 3, title: "Buy 3 Get 2 Free (Best Value)", desc: "Save 40% on 5 items", price: "$144.00", badge: "SAVE 40%" },
							].map((tier) => (
								<button
									key={tier.id}
									type="button"
									onClick={() => setSelectedTier(tier.id)}
									className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
										selectedTier === tier.id
											? "border-purple-600 bg-purple-50/40 shadow-xs ring-1 ring-purple-600"
											: "border-neutral-200 bg-white hover:border-neutral-300"
									}`}
								>
									<div className="flex items-center gap-3">
										<div
											className={`size-5 rounded-full border flex items-center justify-center ${
												selectedTier === tier.id
													? "border-purple-600 bg-purple-600 text-white"
													: "border-neutral-300"
											}`}
										>
											{selectedTier === tier.id && <Check className="size-3 stroke-[3]" />}
										</div>
										<div>
											<div className="font-bold text-neutral-900 text-sm">{tier.title}</div>
											<div className="text-xs text-neutral-500">{tier.desc}</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										{tier.badge && (
											<span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold text-[10px]">
												{tier.badge}
											</span>
										)}
										<span className="font-mono font-bold text-neutral-900 text-base">{tier.price}</span>
									</div>
								</button>
							))}
						</div>

						{/* Add to Cart Action */}
						<div className="mt-6 pt-4 border-neutral-100 border-t flex items-center justify-between">
							<span className="text-xs text-neutral-500">
								No coupon code required • Instant checkout
							</span>
							<button
								type="button"
								className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 font-semibold text-xs text-white shadow-xs hover:bg-neutral-800 transition-colors"
							>
								<ShoppingBag className="size-4" />
								Add Bundle to Cart
							</button>
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}

function EdgeBundlesFaqSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFaq = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	const faqItems = product?.faq ?? [];

	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-16 sm:py-20">
				<div className="px-6 text-center sm:px-8">
					<h2 className="font-bold font-satoshi text-3xl text-neutral-900 leading-[1.1] tracking-tight sm:text-4xl">
						Frequently asked questions
					</h2>

					<div className="mx-auto mt-10 max-w-xl text-left border-neutral-200/80 border-t border-b divide-y divide-neutral-200/80">
						{faqItems.map((faq, idx) => {
							const isOpen = openIndex === idx;
							return (
								<div key={faq.question} className="py-1">
									<button
										type="button"
										onClick={() => toggleFaq(idx)}
										aria-expanded={isOpen}
										className="flex w-full items-center justify-between py-3.5 text-left font-medium text-xs text-neutral-900 transition-colors hover:text-neutral-600 sm:text-sm"
									>
										<span>{faq.question}</span>
										<span className="ml-4 flex size-5 shrink-0 items-center justify-center text-neutral-500">
											{isOpen ? (
												<Minus className="size-3.5 text-neutral-700" />
											) : (
												<Plus className="size-3.5 text-neutral-500" />
											)}
										</span>
									</button>
									{isOpen && (
										<div className="pb-4 pt-1 text-neutral-500 text-xs leading-relaxed sm:text-sm">
											{faq.answer}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</Frame>
		</section>
	);
}

export default function EdgeBundlesPage() {
	if (!product) return null;

	return (
		<main className="min-h-screen bg-white">
			<EdgeBundlesHeroSection />
			<LogoCloud />
			<EdgeBundlesFaqSection />
			<CtaDark />
		</main>
	);
}
