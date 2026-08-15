"use client";

import { Check, Minus, Play, Plus, RotateCw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { Reveal } from "@/components/ui/reveal";
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
					<div className="relative z-20 flex max-w-[540px] flex-col items-start text-left">
						<Reveal>
							<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 text-xs shadow-2xs">
								<span className="size-2 rounded-full bg-emerald-600" />
								{product?.name ?? "Edge Subscriptions"}
							</span>
						</Reveal>

						<Reveal delay={0.08}>
							<h1 className="mt-4 font-bold font-satoshi text-4xl text-neutral-900 leading-[1.08] tracking-tight sm:text-5xl lg:text-[52px]">
								{product?.tagline ?? "Turn one sale into twelve."}
							</h1>
						</Reveal>

						<Reveal delay={0.16}>
							<p className="mt-4 max-w-[480px] text-neutral-500 text-sm leading-relaxed sm:text-base">
								{product?.heroLead ??
									"Subscribe-and-save on any product, a customer portal people actually use instead of emailing you, and dunning that recovers the subscription revenue most stores quietly lose to expired cards."}
							</p>
						</Reveal>

						<Reveal delay={0.24}>
							<div className="mt-6 flex items-center gap-3">
								<a
									className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800"
									href={
										product?.appStoreUrl ??
										"https://apps.shopify.com/edge-subscription"
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
									<Play className="size-3.5 fill-neutral-800 text-neutral-800" />
									<span>Watch Demo</span>
								</a>
							</div>
						</Reveal>
					</div>

					{/* Subscribe & Save Interactive Portal Showcase */}
					<div className="relative mx-auto mt-10 w-full max-w-xl rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xl sm:mt-6 sm:p-8">
						<div className="flex items-center justify-between border-neutral-200 border-b pb-4">
							<div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
								<RotateCw className="size-4 text-emerald-600" />
								<span>Subscribe & Save Engine</span>
							</div>
							<span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-bold font-mono text-emerald-700 text-xs">
								0% Transaction Fee
							</span>
						</div>

						{/* Subscription Plan Picker */}
						<div className="mt-6 flex flex-col gap-3">
							<div className="flex items-center justify-between rounded-2xl border-2 border-emerald-600 bg-emerald-50/40 p-4">
								<div className="flex items-center gap-3">
									<div className="flex size-5 items-center justify-center rounded-full border-2 border-emerald-600 bg-emerald-600 text-white">
										<Check className="size-3 stroke-[3]" />
									</div>
									<div>
										<div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
											<span>Subscribe & Save 15%</span>
											<span className="rounded bg-emerald-200 px-1.5 py-0.2 font-bold text-[9px] text-emerald-800">
												RECOMMENDED
											</span>
										</div>
										<div className="text-neutral-500 text-xs">
											Auto-refills delivered on your schedule
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="font-bold font-mono text-base text-neutral-900">
										$34.00
									</div>
									<div className="font-mono text-[10px] text-neutral-400 line-through">
										$40.00
									</div>
								</div>
							</div>

							{/* Delivery Frequency Options */}
							<div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-4">
								<span className="font-semibold text-neutral-700 text-xs">
									Delivery Frequency
								</span>
								<div className="grid grid-cols-3 gap-2">
									{[
										{ days: "30", label: "Every 30 Days" },
										{ days: "60", label: "Every 60 Days" },
										{ days: "90", label: "Every 90 Days" },
									].map((opt) => (
										<button
											className={`rounded-xl border py-2 text-center font-medium text-xs transition-all ${
												frequency === opt.days
													? "border-emerald-600 bg-emerald-600 font-semibold text-white shadow-2xs"
													: "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
											}`}
											key={opt.days}
											onClick={() => setFrequency(opt.days)}
											type="button"
										>
											{opt.label}
										</button>
									))}
								</div>
							</div>
						</div>

						{/* Customer Portal Management Controls */}
						<div className="mt-4 flex items-center justify-between border-neutral-100 border-t pt-4 text-neutral-500 text-xs">
							<span className="flex items-center gap-1 font-semibold text-emerald-700">
								<ShieldCheck className="size-4" /> Self-serve customer portal:
								Skip, pause, or cancel anytime
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

export default function EdgeSubscriptionsPage() {
	if (!product) {
		return null;
	}

	return (
		<main className="min-h-screen bg-white">
			<EdgeSubscriptionsHeroSection />
			<Reveal>
				<LogoCloud />
			</Reveal>
			<Reveal>
				<EdgeSubscriptionsFaqSection />
			</Reveal>
			<Reveal>
				<CtaDark />
			</Reveal>
		</main>
	);
}
