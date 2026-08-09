"use client";

import {
	ArrowRight,
	Calendar,
	Check,
	ChevronRight,
	CreditCard,
	Minus,
	Play,
	Plus,
	RefreshCw,
	RotateCw,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import { useState } from "react";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { BOOKING_URL } from "@/lib/booking";
import { getProduct } from "@/lib/products";

const product = getProduct("edge-subscriptions");

function EdgeSubscriptionsHeroSection() {
	const [frequency, setFrequency] = useState<string>("30");

	return (
		<section className="relative isolate w-full overflow-hidden border-neutral-200 border-b bg-white">
			<Frame className="relative pt-16 pb-12 sm:pt-20 sm:pb-16">
				{/* Grid lines with radial mask */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60 [mask-image:radial-gradient(ellipse_100%_65%_at_50%_100%,black_30%,transparent_80%)]"
				/>

				{/* Soft emerald/teal ambient glow */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[radial-gradient(ellipse_85%_65%_at_50%_90%,rgba(16,185,129,0.15),rgba(5,150,105,0.1),transparent_75%)]"
				/>

				<div className="mx-auto max-w-[1080px] px-4 sm:px-6">
					<div className="flex flex-col items-start text-left max-w-[540px] z-20 relative">
						<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 font-semibold text-xs text-emerald-700 shadow-2xs">
							<span className="size-2 rounded-full bg-emerald-600" />
							{product?.name ?? "Edge Subscriptions"}
						</span>

						<h1 className="mt-4 font-bold font-satoshi text-4xl sm:text-5xl lg:text-[52px] text-neutral-900 leading-[1.08] tracking-tight">
							{product?.tagline ?? "Turn one sale into twelve."}
						</h1>

						<p className="mt-4 text-neutral-500 text-sm sm:text-base leading-relaxed max-w-[480px]">
							{product?.heroLead ??
								"Subscribe-and-save on any product, a customer portal people actually use instead of emailing you, and dunning that recovers the subscription revenue most stores quietly lose to expired cards."}
						</p>

						<div className="mt-6 flex items-center gap-3">
							<a
								href={product?.appStoreUrl ?? "https://apps.shopify.com/edge-subscription"}
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

					{/* Subscribe & Save Interactive Portal Showcase */}
					<div className="relative mt-10 sm:mt-6 w-full max-w-xl mx-auto rounded-3xl border border-neutral-200/90 bg-white shadow-xl p-6 sm:p-8">
						<div className="flex items-center justify-between border-neutral-200 border-b pb-4">
							<div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
								<RotateCw className="size-4 text-emerald-600" />
								<span>Subscribe & Save Engine</span>
							</div>
							<span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono font-bold text-xs text-emerald-700">
								0% Transaction Fee
							</span>
						</div>

						{/* Subscription Plan Picker */}
						<div className="mt-6 flex flex-col gap-3">
							<div className="rounded-2xl border-2 border-emerald-600 bg-emerald-50/40 p-4 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="size-5 rounded-full border-2 border-emerald-600 bg-emerald-600 text-white flex items-center justify-center">
										<Check className="size-3 stroke-[3]" />
									</div>
									<div>
										<div className="font-bold text-neutral-900 text-sm flex items-center gap-2">
											<span>Subscribe & Save 15%</span>
											<span className="rounded bg-emerald-200 text-emerald-800 px-1.5 py-0.2 text-[9px] font-bold">
												RECOMMENDED
											</span>
										</div>
										<div className="text-xs text-neutral-500">Auto-refills delivered on your schedule</div>
									</div>
								</div>
								<div className="text-right">
									<div className="font-mono font-bold text-neutral-900 text-base">$34.00</div>
									<div className="font-mono text-[10px] text-neutral-400 line-through">$40.00</div>
								</div>
							</div>

							{/* Delivery Frequency Options */}
							<div className="p-4 rounded-2xl border border-neutral-200 bg-white flex flex-col gap-2">
								<span className="text-xs font-semibold text-neutral-700">Delivery Frequency</span>
								<div className="grid grid-cols-3 gap-2">
									{[
										{ days: "30", label: "Every 30 Days" },
										{ days: "60", label: "Every 60 Days" },
										{ days: "90", label: "Every 90 Days" },
									].map((opt) => (
										<button
											key={opt.days}
											type="button"
											onClick={() => setFrequency(opt.days)}
											className={`py-2 rounded-xl border text-xs font-medium text-center transition-all ${
												frequency === opt.days
													? "border-emerald-600 bg-emerald-600 text-white shadow-2xs font-semibold"
													: "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
											}`}
										>
											{opt.label}
										</button>
									))}
								</div>
							</div>
						</div>

						{/* Customer Portal Management Controls */}
						<div className="mt-4 pt-4 border-neutral-100 border-t flex items-center justify-between text-xs text-neutral-500">
							<span className="flex items-center gap-1 text-emerald-700 font-semibold">
								<ShieldCheck className="size-4" /> Self-serve customer portal: Skip, pause, or cancel anytime
							</span>
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}

function EdgeSubscriptionsFaqSection() {
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

export default function EdgeSubscriptionsPage() {
	if (!product) return null;

	return (
		<main className="min-h-screen bg-white">
			<EdgeSubscriptionsHeroSection />
			<LogoCloud />
			<EdgeSubscriptionsFaqSection />
			<CtaDark />
		</main>
	);
}
