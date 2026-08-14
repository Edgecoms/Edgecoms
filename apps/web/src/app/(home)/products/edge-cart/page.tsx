"use client";

import { Lock, Minus, Plus, ShoppingBag, Truck, X } from "lucide-react";
import { useState } from "react";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { BOOKING_URL } from "@/lib/booking";
import { getProduct } from "@/lib/products";

const product = getProduct("edge-cart");

function EdgeCartHeroSection() {
	const [cartCount, setCartCount] = useState<number>(1);
	const [hasUpsell, setHasUpsell] = useState<boolean>(false);

	const subtotal = 85.0 + (hasUpsell ? 14.0 : 0);
	const freeShippingThreshold = 100.0;
	const progressPercent = Math.min(
		100,
		(subtotal / freeShippingThreshold) * 100
	);

	return (
		<section className="relative isolate w-full overflow-hidden border-neutral-200 border-b bg-white">
			<Frame className="relative pt-16 pb-12 sm:pt-20 sm:pb-16">
				{/* Grid lines with soft radial mask */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60 [mask-image:radial-gradient(ellipse_100%_65%_at_50%_100%,black_30%,transparent_80%)]"
				/>

				{/* Soft blue ambient glow */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[radial-gradient(ellipse_85%_65%_at_50%_90%,rgba(59,130,246,0.15),rgba(37,99,235,0.1),transparent_75%)]"
				/>

				<div className="mx-auto max-w-[1080px] px-4 sm:px-6">
					<div className="relative z-20 flex max-w-[540px] flex-col items-start text-left">
						<span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 font-semibold text-blue-700 text-xs shadow-2xs">
							<span className="size-2 rounded-full bg-blue-600" />
							{product?.name ?? "Edge Cart"}
						</span>

						<h1 className="mt-4 font-bold font-satoshi text-4xl text-neutral-900 leading-[1.08] tracking-tight sm:text-5xl lg:text-[52px]">
							{product?.tagline ??
								"The highest-intent moment in your funnel is doing nothing."}
						</h1>

						<p className="mt-4 max-w-[480px] text-neutral-500 text-sm leading-relaxed sm:text-base">
							{product?.heroLead ??
								"A slide cart that opens without a page load, upsells chosen by rule instead of by guess, and free-shipping progress that moves as they add, all at the one moment the shopper has already decided to buy."}
						</p>

						<div className="mt-6 flex items-center gap-3">
							<a
								className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800"
								href={
									product?.appStoreUrl ?? "https://apps.shopify.com/edgecart"
								}
								rel="noopener noreferrer"
								target="_blank"
							>
								Start for free
							</a>
							<a
								className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 font-medium text-neutral-900 text-sm shadow-2xs transition-colors hover:bg-neutral-50"
								href={BOOKING_URL}
								rel="noopener noreferrer"
								target="_blank"
							>
								<span>Live Demo</span>
							</a>
						</div>
					</div>

					{/* Slide Cart Preview UI Component */}
					<div className="relative mx-auto mt-10 w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-2xl sm:mt-6">
						{/* Cart Drawer Header */}
						<div className="flex items-center justify-between border-neutral-100 border-b pb-3">
							<div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
								<ShoppingBag className="size-4 text-blue-600" />
								<span>
									Your Shopping Cart ({cartCount + (hasUpsell ? 1 : 0)})
								</span>
							</div>
							<span className="cursor-pointer text-neutral-400 hover:text-neutral-600">
								<X className="size-4" />
							</span>
						</div>

						{/* Free Shipping Progress Bar */}
						<div className="my-4 rounded-xl border border-blue-100/80 bg-blue-50/60 p-3">
							<div className="mb-1.5 flex items-center justify-between font-semibold text-neutral-800 text-xs">
								<span className="flex items-center gap-1.5 text-blue-700">
									<Truck className="size-3.5" />
									{progressPercent >= 100 ? (
										<span className="font-bold text-emerald-700">
											🎉 You unlocked Free Express Shipping!
										</span>
									) : (
										<span>
											Add ${(freeShippingThreshold - subtotal).toFixed(2)} more
											for Free Shipping
										</span>
									)}
								</span>
								<span className="font-mono">
									{Math.round(progressPercent)}%
								</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-blue-100">
								<div
									className="h-full rounded-full bg-blue-600 transition-all duration-300"
									style={{ width: `${progressPercent}%` }}
								/>
							</div>
						</div>

						{/* Main Cart Item */}
						<div className="flex gap-3 border-neutral-100 border-b py-3">
							<div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 font-bold text-neutral-500 text-xs">
								Item 1
							</div>
							<div className="flex flex-1 flex-col justify-between">
								<div className="flex items-start justify-between">
									<span className="font-bold text-neutral-900 text-xs">
										Minimalist Leather Backpack
									</span>
									<span className="font-bold font-mono text-neutral-900 text-xs">
										$85.00
									</span>
								</div>
								<div className="mt-2 flex items-center justify-between">
									<span className="text-[10px] text-neutral-400">
										Color: Charcoal
									</span>
									<div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-2 py-0.5 text-xs">
										<button
											onClick={() => setCartCount(Math.max(1, cartCount - 1))}
											type="button"
										>
											-
										</button>
										<span className="font-mono font-semibold">{cartCount}</span>
										<button
											onClick={() => setCartCount(cartCount + 1)}
											type="button"
										>
											+
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* Rule-Based Upsell Card */}
						<div className="my-3 flex items-center justify-between rounded-2xl border border-amber-200/80 bg-amber-50/40 p-3">
							<div className="flex items-center gap-2.5">
								<div className="flex size-10 items-center justify-center rounded-lg border border-amber-200 bg-amber-100 font-bold text-[10px] text-amber-800">
									Leather Care
								</div>
								<div>
									<div className="font-bold text-neutral-900 text-xs">
										Premium Leather Balm
									</div>
									<div className="text-[10px] text-neutral-500">
										Frequently bought together • +$14.00
									</div>
								</div>
							</div>
							<button
								className={`rounded-lg px-3 py-1 font-semibold text-xs shadow-2xs transition-colors ${
									hasUpsell
										? "bg-emerald-600 text-white"
										: "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
								}`}
								onClick={() => setHasUpsell(!hasUpsell)}
								type="button"
							>
								{hasUpsell ? "Added ✓" : "Add +"}
							</button>
						</div>

						{/* Checkout Footer */}
						<div className="mt-4 flex flex-col gap-2.5 border-neutral-200 border-t pt-3">
							<div className="flex items-center justify-between text-xs">
								<span className="text-neutral-500">Subtotal</span>
								<span className="font-bold font-mono text-neutral-900 text-sm">
									${subtotal.toFixed(2)}
								</span>
							</div>
							<button
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-semibold text-white text-xs shadow-xs transition-colors hover:bg-purple-700"
								type="button"
							>
								<Lock className="size-3.5" />
								<span>Checkout with Shop Pay</span>
							</button>
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}

function EdgeCartFaqSection() {
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

					<div className="mx-auto mt-10 max-w-xl divide-y divide-neutral-200/80 border-neutral-200/80 border-t border-b text-left">
						{faqItems.map((faq, idx) => {
							const isOpen = openIndex === idx;
							return (
								<div className="py-1" key={faq.question}>
									<button
										aria-expanded={isOpen}
										className="flex w-full items-center justify-between py-3.5 text-left font-medium text-neutral-900 text-xs transition-colors hover:text-neutral-600 sm:text-sm"
										onClick={() => toggleFaq(idx)}
										type="button"
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
										<div className="pt-1 pb-4 text-neutral-500 text-xs leading-relaxed sm:text-sm">
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

export default function EdgeCartPage() {
	if (!product) {
		return null;
	}

	return (
		<main className="min-h-screen bg-white">
			<EdgeCartHeroSection />
			<LogoCloud />
			<EdgeCartFaqSection />
			<CtaDark />
		</main>
	);
}
