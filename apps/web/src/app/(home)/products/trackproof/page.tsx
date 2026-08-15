"use client";

import {
	Activity,
	CheckCircle2,
	Code,
	Minus,
	Play,
	Plus,
	ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { Reveal } from "@/components/ui/reveal";
import { BOOKING_URL } from "@/lib/booking";
import { getProduct } from "@/lib/products";

const product = getProduct("trackproof");

const COMPARISON_POINTS = [
	{
		title: "Browser Pixel Only",
		bad: true,
		items: [
			"Misses up to 30% of purchases due to iOS 14.5, Safari ITP, & ad blockers",
			"Distorted ROAS makes winning ad sets look unprofitable",
			"Frequent silent breakages discovered weeks after budget wasted",
			"Dynamic product ads retarget wrong products due to SKU mismatches",
		],
	},
	{
		title: "Trackproof Server-Side CAPI",
		bad: false,
		items: [
			"100% purchase capture via dual-path Server + Pixel logging",
			"True reported ROAS so you scale winning ads with total confidence",
			"Real-time 98/100 Tracking Health Score with instant alert monitoring",
			"Exact variant/product/SKU catalog matching for dynamic retargeting",
		],
	},
] as const;

function TrackproofHeroSection() {
	return (
		<section className="relative isolate w-full overflow-hidden border-neutral-200 border-b bg-white">
			{/* Frame container matching partners page hero with side hairline rules */}
			<Frame className="relative pt-16 pb-12 sm:pt-20 sm:pb-16">
				{/* Inner background grid lines with radial mask to fade out upper title area */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60 [mask-image:radial-gradient(ellipse_100%_65%_at_50%_100%,black_30%,transparent_80%)]"
				/>

				{/* Soft emerald/teal ambient glow fill in the lower section */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[radial-gradient(ellipse_85%_65%_at_50%_90%,rgba(16,185,129,0.18),rgba(20,184,166,0.12),transparent_75%)]"
				/>

				<div className="mx-auto max-w-[1080px] px-4 sm:px-6">
					{/* Left-Aligned Copy Block matching image */}
					<div className="relative z-20 flex max-w-[540px] flex-col items-start text-left">
						{/* Eyebrow Badge */}
						<Reveal>
							<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 text-xs shadow-2xs">
								<span className="size-2 rounded-full bg-emerald-500" />
								Trackproof Analytics
							</span>
						</Reveal>

						{/* Title */}
						<Reveal delay={0.08}>
							<h1 className="mt-4 font-bold font-satoshi text-4xl text-neutral-900 leading-[1.08] tracking-tight sm:text-5xl lg:text-[52px]">
								{product?.tagline ??
									"Your ROAS is better than Meta is telling you."}
							</h1>
						</Reveal>

						{/* Subhead */}
						<Reveal delay={0.16}>
							<p className="mt-4 max-w-[480px] text-neutral-500 text-sm leading-relaxed sm:text-base">
								{product?.heroLead ??
									"Server-side conversions for Meta, Google, and TikTok through each platform's Conversions API, deduplicated against your existing pixel, so every purchase is counted once and none of them go missing."}
							</p>
						</Reveal>

						{/* Action Buttons */}
						<Reveal delay={0.24}>
							<div className="mt-6 flex items-center gap-3">
								<a
									className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800"
									href={
										product?.appStoreUrl ??
										"https://apps.shopify.com/trackproof"
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

					{/* Seamless Chart Area matching image */}
					<div className="relative mt-8 h-[440px] w-full sm:mt-4 sm:h-[500px]">
						{/* Y-Axis Labels on Left Edge */}
						<div className="pointer-events-none absolute top-16 bottom-16 left-0 z-10 flex flex-col justify-between font-mono text-[11px] text-neutral-400">
							<span>4,000</span>
							<span>3,000</span>
							<span>2,000</span>
							<span>1,000</span>
						</div>

						{/* Decorative chart lines. The figures they trace are printed in
						    the labels beside them, so the shape carries nothing a screen
						    reader needs. */}
						<svg
							aria-hidden="true"
							className="absolute inset-0 h-full w-full overflow-visible"
							fill="none"
							preserveAspectRatio="none"
							viewBox="0 0 1000 440"
						>
							{/* Blue Line (Clicks) */}
							<path
								d="M 40 240 Q 120 160 200 150 T 360 190 T 520 140 T 680 170 T 840 70 L 1000 20"
								stroke="#3b82f6"
								strokeLinecap="round"
								strokeWidth="2"
							/>

							{/* Purple Line (Leads) */}
							<path
								d="M 40 310 Q 120 270 200 300 T 360 260 T 520 230 T 680 270 T 840 180 L 1000 130"
								stroke="#a855f7"
								strokeLinecap="round"
								strokeWidth="2"
							/>

							{/* Teal Line (Sales) */}
							<path
								d="M 40 380 Q 120 340 200 370 T 360 320 T 520 350 T 680 300 T 840 270 L 1000 210"
								stroke="#14b8a6"
								strokeLinecap="round"
								strokeWidth="2"
							/>

							{/* Vertical Guide Line at x=780 */}
							<line
								stroke="#93c5fd"
								strokeWidth="1.5"
								x1="780"
								x2="780"
								y1="40"
								y2="400"
							/>

							{/* Data Points on Vertical Guide Line */}
							<circle
								cx="780"
								cy="95"
								fill="#ffffff"
								r="4"
								stroke="#3b82f6"
								strokeWidth="2"
							/>
							<circle
								cx="780"
								cy="205"
								fill="#ffffff"
								r="4"
								stroke="#a855f7"
								strokeWidth="2"
							/>
							<circle
								cx="780"
								cy="280"
								fill="#ffffff"
								r="4"
								stroke="#14b8a6"
								strokeWidth="2"
							/>
						</svg>

						{/* Floating Tooltip Cards (Image replica) */}
						<div className="absolute top-[8%] right-[16%] z-20 flex w-[220px] flex-col gap-2.5 rounded-2xl border border-neutral-200/90 bg-white/95 p-3.5 text-xs shadow-xl backdrop-blur-md sm:top-[6%] sm:right-[20%]">
							{/* Top Card Block */}
							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between border-neutral-100 border-b pb-2">
									<span className="flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 font-medium font-mono text-[11px] text-neutral-700">
										<Code className="size-3 text-neutral-500" /> d.to/try
									</span>
									<span className="font-medium text-[10px] text-neutral-400">
										Jul 2026
									</span>
								</div>

								<div className="flex flex-col gap-1.5">
									<div className="flex items-center justify-between text-xs">
										<span className="flex items-center gap-1.5 text-neutral-600">
											<span className="size-2 rounded-full bg-blue-500" />{" "}
											Clicks
										</span>
										<span className="font-mono font-semibold text-neutral-900">
											7.5K
										</span>
									</div>
									<div className="flex items-center justify-between text-xs">
										<span className="flex items-center gap-1.5 text-neutral-600">
											<span className="size-2 rounded-full bg-purple-500" />{" "}
											Leads
										</span>
										<span className="font-mono font-semibold text-neutral-900">
											5.4K
										</span>
									</div>
									<div className="flex items-center justify-between text-xs">
										<span className="flex items-center gap-1.5 text-neutral-600">
											<span className="size-2 rounded-full bg-teal-500" /> Sales
										</span>
										<span className="font-mono font-semibold text-emerald-700">
											$2.9K
										</span>
									</div>
								</div>
							</div>

							{/* Bottom Connected Customer Profile Card */}
							<div className="flex flex-col gap-2 border-neutral-100 border-t pt-2.5">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="flex size-7 items-center justify-center rounded-full border border-neutral-200 bg-neutral-800 font-bold text-[11px] text-white">
											DW
										</div>
										<span className="rounded bg-neutral-100 px-1.5 py-0.5 font-medium text-[10px] text-neutral-600">
											🇺🇸 US
										</span>
									</div>
									<span className="font-mono text-[10px] text-neutral-400">
										acme.com
									</span>
								</div>

								<div>
									<div className="font-semibold text-neutral-900 text-xs">
										Danielle Wilson
									</div>
									<div className="text-[11px] text-neutral-400">
										danielle@acme.com
									</div>
								</div>

								<div className="flex items-center justify-between border-neutral-100 border-t pt-2 text-[11px]">
									<span className="text-neutral-400">Lifetime value</span>
									<span className="font-mono font-semibold text-neutral-900">
										$12.5k
									</span>
								</div>
								<div className="flex items-center justify-between text-[11px]">
									<span className="text-neutral-400">Customer since</span>
									<span className="font-mono text-neutral-600">Jan 2025</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}

function RealTimeEventsStreamSection() {
	const LIVE_EVENTS = [
		{
			event: "Subscription",
			link: "company.link/fb",
			customer: "Yuki Tanada",
			flag: "🇯🇵",
			country: "Japan",
			amount: "$49 USD",
			date: "Aug 9, 12:14 PM",
		},
		{
			event: "Subscription",
			link: "company.link/x",
			customer: "Isabella García",
			flag: "🇪🇸",
			country: "Spain",
			amount: "$99 USD",
			date: "Aug 9, 12:10 PM",
		},
		{
			event: "Subscription",
			link: "company.link/linkedin",
			customer: "Emma Thompson",
			flag: "🇺🇸",
			country: "United States",
			amount: "$24 USD",
			date: "Aug 9, 12:06 PM",
		},
		{
			event: "Subscription",
			link: "company.link/insta",
			customer: "James Chen",
			flag: "🇨🇭",
			country: "Switzerland",
			amount: "$49 USD",
			date: "Aug 9, 12:02 PM",
		},
		{
			event: "Subscription",
			link: "company.link/fb",
			customer: "Sofia Rodriguez",
			flag: "🇹🇼",
			country: "Taiwan",
			amount: "$99 USD",
			date: "Aug 9, 11:59 AM",
		},
		{
			event: "Subscription",
			link: "company.link/x",
			customer: "Michael O'Connor",
			flag: "🇹🇼",
			country: "Taiwan",
			amount: "$24 USD",
			date: "Aug 9, 11:55 AM",
		},
		{
			event: "Subscription",
			link: "company.link/linkedin",
			customer: "Yuki Tanada",
			flag: "🇯🇵",
			country: "Japan",
			amount: "$49 USD",
			date: "Aug 9, 11:51 AM",
		},
	];

	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-16 sm:py-24">
				<div className="flex flex-col items-center px-6 text-center sm:px-8">
					<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-semibold text-neutral-700 text-xs shadow-2xs">
						<Activity className="size-3.5 text-neutral-700" />
						Real-Time Events Stream
					</span>
					<h2 className="mt-4 font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
						See it as it happens
					</h2>
					<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
						Gain deeper insights with fine-grained, event-level data. Understand
						every click, lead, and sale in real-time.
					</p>
				</div>

				<div className="mx-auto mt-14 max-w-4xl rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-lg sm:p-8">
					<div className="mb-6 grid grid-cols-3 gap-4">
						<div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4">
							<span className="text-neutral-500 text-xs">Clicks</span>
							<div className="mt-1 font-bold font-mono text-neutral-900 text-xl">
								6,215
							</div>
						</div>
						<div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4">
							<span className="text-neutral-500 text-xs">Leads</span>
							<div className="mt-1 font-bold font-mono text-neutral-900 text-xl">
								736
							</div>
						</div>
						<div className="rounded-2xl border-2 border-neutral-900 bg-white p-4 shadow-2xs">
							<span className="font-medium text-neutral-500 text-xs">
								Sales
							</span>
							<div className="mt-1 font-bold font-mono text-neutral-900 text-xl">
								US$780
							</div>
						</div>
					</div>

					<div className="overflow-x-auto rounded-xl border border-neutral-200">
						<table className="w-full text-left text-xs">
							<thead className="border-neutral-200 border-b bg-neutral-50 font-medium text-neutral-500">
								<tr>
									<th className="px-4 py-2.5">Event</th>
									<th className="px-4 py-2.5">Link</th>
									<th className="px-4 py-2.5">Customer</th>
									<th className="px-4 py-2.5">Country</th>
									<th className="px-4 py-2.5">Sale Amount</th>
									<th className="px-4 py-2.5">Date</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-neutral-100 text-neutral-700">
								{LIVE_EVENTS.map((row, i) => (
									<tr
										className="transition-colors hover:bg-neutral-50/80"
										key={`${row.customer}-${i.toString()}`}
									>
										<td className="px-4 py-2.5 font-medium text-neutral-900">
											{row.event}
										</td>
										<td className="px-4 py-2.5 font-mono text-neutral-500">
											{row.link}
										</td>
										<td className="px-4 py-2.5 font-medium">{row.customer}</td>
										<td className="px-4 py-2.5">
											{row.flag} {row.country}
										</td>
										<td className="px-4 py-2.5 font-mono font-semibold text-emerald-700">
											{row.amount}
										</td>
										<td className="px-4 py-2.5 font-mono text-neutral-400">
											{row.date}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</Frame>
		</section>
	);
}

function TrackingHealthSection() {
	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-0">
				<div className="flex flex-col justify-between bg-gradient-to-br from-teal-50/40 via-emerald-50/20 to-white p-8 sm:p-12">
					<div>
						<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 font-semibold text-neutral-700 text-xs shadow-2xs">
							<ShieldCheck className="size-3.5 text-teal-600" />
							Tracking Health
						</span>

						<h3 className="mt-6 font-bold font-satoshi text-neutral-900 text-xl sm:text-2xl">
							Know the moment tracking breaks
						</h3>
						<p className="mt-3 max-w-2xl text-neutral-600 text-sm leading-relaxed">
							A pixel that stops firing does not announce itself. It shows up
							later as an ad set that looks unprofitable, so the budget gets cut
							from something that was working. Trackproof watches both the
							server and browser paths and alerts you the day a gap opens, not
							at the end of the month.
						</p>
					</div>

					<ul className="mt-8 grid grid-cols-1 gap-2.5 border-neutral-200/80 border-t pt-6 text-neutral-600 text-xs sm:grid-cols-3 sm:text-sm">
						<li className="flex items-center gap-2">
							<CheckCircle2 className="size-4 shrink-0 text-teal-600" />
							Dual-path logging across server and pixel
						</li>
						<li className="flex items-center gap-2">
							<CheckCircle2 className="size-4 shrink-0 text-teal-600" />
							Deduplicated events, so nothing is counted twice
						</li>
						<li className="flex items-center gap-2">
							<CheckCircle2 className="size-4 shrink-0 text-teal-600" />
							Alerts the day a drop starts
						</li>
					</ul>
				</div>
			</Frame>
		</section>
	);
}

function TrackproofComparisonSection() {
	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-16 sm:py-24">
				<div className="mx-auto flex max-w-3xl flex-col items-center text-center">
					<span className="font-mono font-semibold text-purple-600 text-xs uppercase tracking-widest">
						Why browser pixels fail
					</span>
					<h2 className="mt-3 font-bold font-satoshi text-3xl text-neutral-900 leading-[1.1] tracking-tight sm:text-4xl lg:text-[42px]">
						Stop turning off ad sets that are quietly working.
					</h2>
					<p className="mt-3 max-w-2xl text-neutral-500 text-sm leading-relaxed sm:text-base">
						Browser pixels miss up to 30% of conversions to iOS privacy
						settings, Safari ITP, and ad blockers. Trackproof bridges the gap
						with server-side Conversions API.
					</p>
				</div>

				<div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
					{/* Browser Pixel Only */}
					<div className="flex flex-col justify-between rounded-3xl border border-rose-200 bg-rose-50/20 p-8 shadow-2xs">
						<div>
							<div className="flex items-center justify-between border-rose-100 border-b pb-4">
								<h3 className="font-bold font-satoshi text-rose-950 text-xl">
									Browser Pixel Only
								</h3>
								<span className="flex size-7 items-center justify-center rounded-full border border-rose-300 bg-white font-bold text-rose-500 text-xs">
									✕
								</span>
							</div>

							<ul className="mt-6 flex flex-col gap-4">
								{COMPARISON_POINTS[0].items.map((item) => (
									<li
										className="flex items-start gap-3 text-rose-950/80 text-sm leading-relaxed"
										key={item}
									>
										<span className="mt-0.5 shrink-0 font-bold text-rose-500 text-sm">
											✕
										</span>
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="mt-8 border-rose-100 border-t pt-4 font-semibold text-rose-700 text-xs">
							Result: Wasted ad budget & wrong scaling decisions
						</div>
					</div>

					{/* Trackproof Server-Side CAPI */}
					<div className="flex flex-col justify-between rounded-3xl border border-emerald-200 bg-emerald-50/20 p-8 shadow-2xs">
						<div>
							<div className="flex items-center justify-between border-emerald-100 border-b pb-4">
								<h3 className="font-bold font-satoshi text-emerald-950 text-xl">
									Trackproof Server-Side CAPI
								</h3>
								<span className="flex size-7 items-center justify-center rounded-full border border-emerald-300 bg-white font-bold text-emerald-600 text-xs">
									✓
								</span>
							</div>

							<ul className="mt-6 flex flex-col gap-4">
								{COMPARISON_POINTS[1].items.map((item) => (
									<li
										className="flex items-start gap-3 text-emerald-950/90 text-sm leading-relaxed"
										key={item}
									>
										<span className="mt-0.5 shrink-0 font-bold text-emerald-600 text-sm">
											✓
										</span>
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="mt-8 border-emerald-100 border-t pt-4 font-semibold text-emerald-700 text-xs">
							Result: 100% verified conversion data & confident scale
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}

/* SECTION 11: 6 CORE CAPABILITIES (Exact Replica of Image 2) */
function TrackproofCoreCapabilitiesSection() {
	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			{/* Dot Matrix Grid Pattern Backdrop matching Image 2 */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-70 [background-size:20px_20px]"
			/>

			<Frame className="py-16 sm:py-24">
				<div className="mx-auto flex max-w-3xl flex-col items-center text-center">
					<span className="font-mono font-semibold text-neutral-400 text-xs uppercase tracking-widest">
						CORE CAPABILITIES
					</span>
					<h2 className="mt-3 font-bold font-satoshi text-3xl text-neutral-900 leading-[1.1] tracking-tight sm:text-4xl lg:text-[42px]">
						Built for Shopify store owners who demand true ROAS
					</h2>
				</div>

				<div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{(product?.features ?? []).map((feat) => (
						<div
							className="flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white/90 p-7 shadow-xs backdrop-blur-xs transition-colors hover:border-neutral-300"
							key={feat.title}
						>
							<div>
								<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-neutral-50 px-2.5 py-0.5 font-medium font-mono text-[11px] text-neutral-600">
									{feat.metric}
								</span>
								<h3 className="mt-4 font-bold font-satoshi text-lg text-neutral-900 leading-snug">
									{feat.title}
								</h3>
								<p className="mt-2.5 text-neutral-500 text-xs leading-relaxed sm:text-sm">
									{feat.body}
								</p>
							</div>
						</div>
					))}
				</div>
			</Frame>
		</section>
	);
}

/* SECTION 12: FREQUENTLY ASKED QUESTIONS (Exact Replica of Image 2) */
function TrackproofFaqSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFaq = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	const faqItems = product?.faq ?? [];

	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-16 sm:py-20">
				<div className="px-6 text-center sm:px-8">
					{/* Section Headline */}
					<h2 className="font-bold font-satoshi text-3xl text-neutral-900 leading-[1.1] tracking-tight sm:text-4xl">
						Frequently asked questions
					</h2>

					{/* Accordion List matching Image 2 */}
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

export default function TrackproofProductPage() {
	if (!product) {
		return null;
	}

	return (
		<main className="min-h-screen bg-white">
			{/* SECTION 1: HERO */}
			<TrackproofHeroSection />

			{/* SECTION 2: LOGO CLOUD */}
			<Reveal>
				<LogoCloud />
			</Reveal>

			{/* SECTION 3: REAL-TIME EVENTS STREAM */}
			<Reveal>
				<RealTimeEventsStreamSection />
			</Reveal>

			{/* SECTION 4: TRACKING HEALTH */}
			<Reveal>
				<TrackingHealthSection />
			</Reveal>

			{/* SECTION 5: PIXEL VS TRACKPROOF COMPARISON */}
			<Reveal>
				<TrackproofComparisonSection />
			</Reveal>

			{/* SECTION 6: CORE CAPABILITIES */}
			<Reveal>
				<TrackproofCoreCapabilitiesSection />
			</Reveal>

			{/* SECTION 7: FREQUENTLY ASKED QUESTIONS */}
			<Reveal>
				<TrackproofFaqSection />
			</Reveal>

			{/* SECTION 8: CLOSING CTA */}
			<Reveal>
				<CtaDark />
			</Reveal>
		</main>
	);
}
