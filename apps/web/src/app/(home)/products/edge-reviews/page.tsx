"use client";

import {
	Check,
	ChevronRight,
	Heart,
	MessageSquare,
	Minus,
	Play,
	Plus,
	ShieldCheck,
	Star,
	ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { BOOKING_URL } from "@/lib/booking";
import { getProduct } from "@/lib/products";

const product = getProduct("edge-reviews");

function EdgeReviewsHeroSection() {
	return (
		<section className="relative isolate w-full overflow-hidden border-neutral-200 border-b bg-white">
			<Frame className="relative pt-16 pb-12 sm:pt-20 sm:pb-16">
				{/* Grid lines with radial mask */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60 [mask-image:radial-gradient(ellipse_100%_65%_at_50%_100%,black_30%,transparent_80%)]"
				/>

				{/* Soft rose/pink ambient glow */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[radial-gradient(ellipse_85%_65%_at_50%_90%,rgba(244,63,94,0.15),rgba(225,29,72,0.1),transparent_75%)]"
				/>

				<div className="mx-auto max-w-[1080px] px-4 sm:px-6">
					<div className="flex flex-col items-start text-left max-w-[540px] z-20 relative">
						<span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1 font-semibold text-xs text-rose-700 shadow-2xs">
							<span className="size-2 rounded-full bg-rose-600" />
							{product?.name ?? "Edge Reviews"}
						</span>

						<h1 className="mt-4 font-bold font-satoshi text-4xl sm:text-5xl lg:text-[52px] text-neutral-900 leading-[1.08] tracking-tight">
							{product?.tagline ?? "Your product page doesn't close. Your last 200 buyers do."}
						</h1>

						<p className="mt-4 text-neutral-500 text-sm sm:text-base leading-relaxed max-w-[480px]">
							{product?.heroLead ??
								"Collect photo and video reviews automatically after delivery, then put them where the decision actually happens: the product page, the collection grid, the cart, and Google's results."}
						</p>

						<div className="mt-6 flex items-center gap-3">
							<a
								href={product?.appStoreUrl ?? "https://apps.shopify.com/edge-reviews"}
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

					{/* Customer Photo & Video Review Gallery Wall UI Showcase */}
					<div className="relative mt-10 sm:mt-6 w-full max-w-2xl mx-auto rounded-3xl border border-neutral-200/90 bg-white shadow-xl p-6 sm:p-8">
						<div className="flex items-center justify-between border-neutral-200 border-b pb-4">
							<div className="flex items-center gap-3">
								<div className="flex text-amber-400 gap-0.5">
									{[...Array(5)].map((_, i) => (
										<Star key={i.toString()} className="size-4 fill-amber-400" />
									))}
								</div>
								<span className="font-bold text-neutral-900 text-sm">4.9 out of 5.0</span>
								<span className="text-xs text-neutral-400 font-mono">(1,280 reviews)</span>
							</div>
							<span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 font-mono font-bold text-xs text-rose-700">
								Google Rich Snippets Enabled
							</span>
						</div>

						{/* Photo & Video Review Cards Grid */}
						<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Card 1 */}
							<div className="rounded-2xl border border-neutral-200 bg-neutral-50/40 p-4 shadow-2xs flex flex-col justify-between gap-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="size-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
											SL
										</div>
										<div>
											<div className="font-bold text-xs text-neutral-900">Sarah Jenkins</div>
											<div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
												<ShieldCheck className="size-3" /> Verified Buyer
											</div>
										</div>
									</div>
									<div className="flex text-amber-400 text-xs">★★★★★</div>
								</div>
								<p className="text-xs text-neutral-600 leading-relaxed italic">
									"The build quality blew me away. Arrived 2 days early and works even better than expected!"
								</p>
								<div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 border-neutral-200/60 border-t">
									<span>Purchased 3 days ago</span>
									<span className="flex items-center gap-1 text-neutral-600 font-medium cursor-pointer">
										<ThumbsUp className="size-3" /> Helpful (24)
									</span>
								</div>
							</div>

							{/* Card 2 */}
							<div className="rounded-2xl border border-neutral-200 bg-neutral-50/40 p-4 shadow-2xs flex flex-col justify-between gap-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="size-8 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center">
											MT
										</div>
										<div>
											<div className="font-bold text-xs text-neutral-900">Marcus Vance</div>
											<div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
												<ShieldCheck className="size-3" /> Verified Buyer
											</div>
										</div>
									</div>
									<div className="flex text-amber-400 text-xs">★★★★★</div>
								</div>
								<p className="text-xs text-neutral-600 leading-relaxed italic">
									"Absolutley essential for our daily routine now. Wouldn't buy from any other store."
								</p>
								<div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 border-neutral-200/60 border-t">
									<span>Purchased 1 week ago</span>
									<span className="flex items-center gap-1 text-neutral-600 font-medium cursor-pointer">
										<ThumbsUp className="size-3" /> Helpful (18)
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}

function EdgeReviewsFaqSection() {
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

export default function EdgeReviewsPage() {
	if (!product) return null;

	return (
		<main className="min-h-screen bg-white">
			<EdgeReviewsHeroSection />
			<LogoCloud />
			<EdgeReviewsFaqSection />
			<CtaDark />
		</main>
	);
}
