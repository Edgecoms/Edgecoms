"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Frame } from "@/components/landing/frame";

const FAQ_ITEMS = [
	{
		answer:
			"Revenue per visitor is conversion rate times average order value. Six of our apps directly lift AOV and conversion rate through bundles, cart upsells, countdown timers, photo reviews, auto-refill subscriptions, and multi-currency switching, while Trackproof proves the exact revenue move server-side.",
		question: "How do Edge apps improve my revenue per visitor?",
	},
	{
		answer:
			"No. All Edge apps are built with zero theme Liquid bloat and run on a global edge infrastructure with sub-50ms latency, ensuring your storefront load speed remains lightning fast.",
		question: "Do Edge apps slow down my Shopify store theme?",
	},
	{
		answer:
			"You can start with any single app like Edge Bundles or Trackproof, and add additional apps as your storefront grows. Most of our apps include generous free plans.",
		question: "Can I start with just one app or do I need the whole suite?",
	},
	{
		answer:
			"Installation takes less than 10 minutes. Edge apps automatically inherit your Shopify OS 2.0 theme styling with zero coding or developer setup required.",
		question: "How long does it take to install and configure Edge apps?",
	},
	{
		answer:
			"Trackproof provides server-side pixel attribution that directly syncs purchase conversions back to Meta, Google, and TikTok Ads so your ad platforms optimize toward real profit rather than estimated clicks.",
		question: "How does Trackproof differ from standard Shopify analytics?",
	},
] as const;

export function FaqSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFaq = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame>
				<div className="px-6 py-16 text-center sm:px-8 sm:py-20">
					{/* Section Headline */}
					<h2 className="font-bold font-satoshi text-3xl text-neutral-900 leading-[1.1] tracking-tight sm:text-4xl">
						Frequently asked questions
					</h2>

					{/* Accordion List */}
					<div className="mx-auto mt-10 max-w-xl text-left border-neutral-200/80 border-t border-b divide-y divide-neutral-200/80">
						{FAQ_ITEMS.map((item, idx) => {
							const isOpen = openIndex === idx;
							return (
								<div key={item.question} className="py-1">
									<button
										type="button"
										onClick={() => toggleFaq(idx)}
										aria-expanded={isOpen}
										className="flex w-full items-center justify-between py-3.5 text-left font-medium text-xs text-neutral-900 transition-colors hover:text-neutral-600 sm:text-sm"
									>
										<span>{item.question}</span>
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
											{item.answer}
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
