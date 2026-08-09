"use client";

import {
	ArrowRight,
	Check,
	ChevronRight,
	Lock,
	Minus,
	Plus,
	ShieldCheck,
	ShoppingBag,
	Sparkles,
	Truck,
	X,
} from "lucide-react";
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
	const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

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
					<div className="flex flex-col items-start text-left max-w-[540px] z-20 relative">
						<span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 font-semibold text-xs text-blue-700 shadow-2xs">
							<span className="size-2 rounded-full bg-blue-600" />
							{product?.name ?? "Edge Cart"}
						</span>

						<h1 className="mt-4 font-bold font-satoshi text-4xl sm:text-5xl lg:text-[52px] text-neutral-900 leading-[1.08] tracking-tight">
							{product?.tagline ?? "The highest-intent moment in your funnel is doing nothing."}
						</h1>

						<p className="mt-4 text-neutral-500 text-sm sm:text-base leading-relaxed max-w-[480px]">
							{product?.heroLead ??
								"A slide cart that opens without a page load, upsells chosen by rule instead of by guess, and free-shipping progress that moves as they add, all at the one moment the shopper has already decided to buy."}
						</p>

						<div className="mt-6 flex items-center gap-3">
							<a
								href={product?.appStoreUrl ?? "https://apps.shopify.com/edgecart"}
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
								<span>Live Demo</span>
							</a>
						</div>
					</div>

					{/* Slide Cart Preview UI Component */}
					<div className="relative mt-10 sm:mt-6 w-full max-w-md mx-auto rounded-3xl border border-neutral-200/90 bg-white shadow-2xl p-6 overflow-hidden">
						{/* Cart Drawer Header */}
						<div className="flex items-center justify-between border-neutral-100 border-b pb-3">
							<div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
								<ShoppingBag className="size-4 text-blue-600" />
								<span>Your Shopping Cart ({cartCount + (hasUpsell ? 1 : 0)})</span>
							</div>
							<span className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
								<X className="size-4" />
							</span>
						</div>

						{/* Free Shipping Progress Bar */}
						<div className="my-4 bg-blue-50/60 rounded-xl p-3 border border-blue-100/80">
							<div className="flex items-center justify-between text-xs font-semibold text-neutral-800 mb-1.5">
								<span className="flex items-center gap-1.5 text-blue-700">
									<Truck className="size-3.5" />
									{progressPercent >= 100 ? (
										<span className="text-emerald-700 font-bold">🎉 You unlocked Free Express Shipping!</span>
									) : (
										<span>Add ${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping</span>
									)}
								</span>
								<span className="font-mono">{Math.round(progressPercent)}%</span>
							</div>
							<div className="w-full h-2 rounded-full bg-blue-100 overflow-hidden">
								<div
									className="h-full bg-blue-600 rounded-full transition-all duration-300"
									style={{ width: `${progressPercent}%` }}
								/>
							</div>
						</div>

						{/* Main Cart Item */}
						<div className="flex gap-3 py-3 border-neutral-100 border-b">
							<div className="size-14 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-500 shrink-0">
								Item 1
							</div>
							<div className="flex-1 flex flex-col justify-between">
								<div className="flex justify-between items-start">
									<span className="font-bold text-neutral-900 text-xs">Minimalist Leather Backpack</span>
									<span className="font-mono font-bold text-xs text-neutral-900">$85.00</span>
								</div>
								<div className="flex items-center justify-between mt-2">
									<span className="text-[10px] text-neutral-400">Color: Charcoal</span>
									<div className="flex items-center rounded-lg border border-neutral-200 px-2 py-0.5 text-xs gap-2">
										<button type="button" onClick={() => setCartCount(Math.max(1, cartCount - 1))}>-</button>
										<span className="font-mono font-semibold">{cartCount}</span>
										<button type="button" onClick={() => setCartCount(cartCount + 1)}>+</button>
									</div>
								</div>
							</div>
						</div>

						{/* Rule-Based Upsell Card */}
						<div className="my-3 rounded-2xl border border-amber-200/80 bg-amber-50/40 p-3 flex items-center justify-between">
							<div className="flex items-center gap-2.5">
								<div className="size-10 rounded-lg bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center border border-amber-200">
									Leather Care
								</div>
								<div>
									<div className="font-bold text-neutral-900 text-xs">Premium Leather Balm</div>
									<div className="text-[10px] text-neutral-500">Frequently bought together • +$14.00</div>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setHasUpsell(!hasUpsell)}
								className={`rounded-lg px-3 py-1 text-xs font-semibold shadow-2xs transition-colors ${
									hasUpsell
										? "bg-emerald-600 text-white"
										: "bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50"
								}`}
							>
								{hasUpsell ? "Added ✓" : "Add +"}
							</button>
						</div>

						{/* Checkout Footer */}
						<div className="mt-4 pt-3 border-neutral-200 border-t flex flex-col gap-2.5">
							<div className="flex justify-between items-center text-xs">
								<span className="text-neutral-500">Subtotal</span>
								<span className="font-mono font-bold text-sm text-neutral-900">${subtotal.toFixed(2)}</span>
							</div>
							<button
								type="button"
								className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 py-3 font-semibold text-xs text-white shadow-xs flex items-center justify-center gap-2 transition-colors"
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

export default function EdgeCartPage() {
	if (!product) return null;

	return (
		<main className="min-h-screen bg-white">
			<EdgeCartHeroSection />
			<LogoCloud />
			<EdgeCartFaqSection />
			<CtaDark />
		</main>
	);
}
