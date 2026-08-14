"use client";

import { Globe, Minus, Play, Plus } from "lucide-react";
import { useState } from "react";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { BOOKING_URL } from "@/lib/booking";
import { getProduct } from "@/lib/products";

const product = getProduct("edge-currency");

function EdgeCurrencyHeroSection() {
	const [activeCurrency, setActiveCurrency] = useState<string>("USD");

	const CURRENCIES = [
		{
			code: "USD",
			flag: "🇺🇸",
			symbol: "$",
			raw: "48.27",
			rounded: "49.00",
			label: "United States",
		},
		{
			code: "EUR",
			flag: "🇪🇺",
			symbol: "€",
			raw: "44.62",
			rounded: "45.00",
			label: "Eurozone",
		},
		{
			code: "GBP",
			flag: "🇬🇧",
			symbol: "£",
			raw: "38.15",
			rounded: "39.00",
			label: "United Kingdom",
		},
		{
			code: "JPY",
			flag: "🇯🇵",
			symbol: "¥",
			raw: "7214",
			rounded: "7200",
			label: "Japan",
		},
		{
			code: "CAD",
			flag: "🇨🇦",
			symbol: "$",
			raw: "64.88",
			rounded: "65.00",
			label: "Canada",
		},
	];

	const selected =
		CURRENCIES.find((c) => c.code === activeCurrency) ?? CURRENCIES[0];

	return (
		<section className="relative isolate w-full overflow-hidden border-neutral-200 border-b bg-white">
			<Frame className="relative pt-16 pb-12 sm:pt-20 sm:pb-16">
				{/* Grid lines with radial mask */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60 [mask-image:radial-gradient(ellipse_100%_65%_at_50%_100%,black_30%,transparent_80%)]"
				/>

				{/* Soft cyan/teal ambient glow */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[radial-gradient(ellipse_85%_65%_at_50%_90%,rgba(6,182,212,0.15),rgba(20,184,166,0.1),transparent_75%)]"
				/>

				<div className="mx-auto max-w-[1080px] px-4 sm:px-6">
					<div className="relative z-20 flex max-w-[540px] flex-col items-start text-left">
						<span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200/80 bg-cyan-50 px-3 py-1 font-semibold text-cyan-700 text-xs shadow-2xs">
							<span className="size-2 rounded-full bg-cyan-600" />
							{product?.name ?? "Edge Currency"}
						</span>

						<h1 className="mt-4 font-bold font-satoshi text-4xl text-neutral-900 leading-[1.08] tracking-tight sm:text-5xl lg:text-[52px]">
							{product?.tagline ?? "$47.83 isn't a price. It's arithmetic."}
						</h1>

						<p className="mt-4 max-w-[480px] text-neutral-500 text-sm leading-relaxed sm:text-base">
							{product?.heroLead ??
								"Detect the visitor's country on first load, show the price in their own currency, and round it so it reads like a price somebody set rather than a conversion somebody ran."}
						</p>

						<div className="mt-6 flex items-center gap-3">
							<a
								className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800"
								href={
									product?.appStoreUrl ??
									"https://apps.shopify.com/edge-currency"
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
					</div>

					{/* Interactive Multi-Currency Switcher Showcase */}
					<div className="relative mx-auto mt-10 w-full max-w-xl rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xl sm:mt-6 sm:p-8">
						<div className="flex items-center justify-between border-neutral-200 border-b pb-4">
							<div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
								<Globe className="size-4 text-cyan-600" />
								<span>Automatic Geo-IP Currency Switcher</span>
							</div>
							<span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 font-bold font-mono text-cyan-700 text-xs">
								Shopify Markets Ready
							</span>
						</div>

						{/* Currency Pills selector */}
						<div className="mt-6 flex flex-wrap gap-2">
							{CURRENCIES.map((curr) => (
								<button
									className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 font-semibold text-xs transition-all ${
										activeCurrency === curr.code
											? "border-cyan-600 bg-cyan-50 text-cyan-900 shadow-2xs ring-1 ring-cyan-600"
											: "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
									}`}
									key={curr.code}
									onClick={() => setActiveCurrency(curr.code)}
									type="button"
								>
									<span>{curr.flag}</span>
									<span>{curr.code}</span>
								</button>
							))}
						</div>

						{/* Live Currency Price Transformation Display */}
						<div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5">
							<div className="flex flex-col gap-1 border-neutral-200 border-r pr-4">
								<span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
									Unrounded FX Math
								</span>
								<span className="font-mono text-neutral-400 text-xl line-through">
									{selected.symbol}
									{selected.raw}
								</span>
								<span className="font-medium text-[10px] text-rose-500">
									Looks calculated & unpolished
								</span>
							</div>

							<div className="flex flex-col gap-1 pl-2">
								<span className="font-bold text-[10px] text-cyan-700 uppercase tracking-wider">
									Edge Smart Rounding
								</span>
								<span className="font-bold font-mono text-2xl text-neutral-900">
									{selected.symbol}
									{selected.rounded}
								</span>
								<span className="font-semibold text-[10px] text-emerald-700">
									Clean localized merchant price ✓
								</span>
							</div>
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}

function EdgeCurrencyFaqSection() {
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

export default function EdgeCurrencyPage() {
	if (!product) {
		return null;
	}

	return (
		<main className="min-h-screen bg-white">
			<EdgeCurrencyHeroSection />
			<LogoCloud />
			<EdgeCurrencyFaqSection />
			<CtaDark />
		</main>
	);
}
