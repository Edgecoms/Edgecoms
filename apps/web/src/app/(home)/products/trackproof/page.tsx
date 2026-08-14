"use client";

import {
	Activity,
	ArrowRight,
	Calendar,
	Check,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	Code,
	Database,
	Download,
	Eye,
	Filter,
	Globe,
	Minus,
	Play,
	Plus,
	ShieldCheck,
	Sparkles,
	TrendingUp,
	XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { Funnel } from "@/components/landing/funnel";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";
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
						<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 text-xs shadow-2xs">
							<span className="size-2 rounded-full bg-emerald-500" />
							Trackproof Analytics
						</span>

						{/* Title */}
						<h1 className="mt-4 font-bold font-satoshi text-4xl text-neutral-900 leading-[1.08] tracking-tight sm:text-5xl lg:text-[52px]">
							{product?.tagline ??
								"Your ROAS is better than Meta is telling you."}
						</h1>

						{/* Subhead */}
						<p className="mt-4 max-w-[480px] text-neutral-500 text-sm leading-relaxed sm:text-base">
							{product?.heroLead ??
								"Server-side conversions for Meta, Google, and TikTok through each platform's Conversions API, deduplicated against your existing pixel, so every purchase is counted once and none of them go missing."}
						</p>

						{/* Action Buttons */}
						<div className="mt-6 flex items-center gap-3">
							<a
								className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800"
								href={
									product?.appStoreUrl ?? "https://apps.shopify.com/trackproof"
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

					{/* Seamless Chart Area matching image */}
					<div className="relative mt-8 h-[440px] w-full sm:mt-4 sm:h-[500px]">
						{/* Y-Axis Labels on Left Edge */}
						<div className="pointer-events-none absolute top-16 bottom-16 left-0 z-10 flex flex-col justify-between font-mono text-[11px] text-neutral-400">
							<span>4,000</span>
							<span>3,000</span>
							<span>2,000</span>
							<span>1,000</span>
						</div>

						{/* SVG Curved Chart Lines matching exact trajectory in image */}
						<svg
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
										dub.sh
									</span>
								</div>

								<div>
									<div className="font-semibold text-neutral-900 text-xs">
										Danielle Wilson
									</div>
									<div className="text-[11px] text-neutral-400">
										danielle@dub.co
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

function RealTimeAnalyticsSection() {
	const [activeTab, setActiveTab] = useState<"clicks" | "leads" | "sales">(
		"clicks"
	);

	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-16 sm:py-24">
				{/* Header */}
				<div className="flex flex-col items-center px-6 text-center sm:px-8">
					<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-semibold text-neutral-700 text-xs shadow-2xs">
						<TrendingUp className="size-3.5 text-neutral-700" />
						Real-time Analytics
					</span>
					<h2 className="mt-4 font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
						Success at a glance
					</h2>
					<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
						With our powerful real-time analytics, you can focus on what truly
						matters for your marketing attribution.
					</p>

					<div className="mt-6 flex items-center gap-3">
						<a
							className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 font-semibold text-white text-xs shadow-xs transition-colors hover:bg-neutral-800"
							href="/contact"
						>
							Learn more
						</a>
						<a
							className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2 font-medium text-neutral-900 text-xs shadow-2xs transition-colors hover:bg-neutral-50"
							href={BOOKING_URL}
							rel="noopener noreferrer"
							target="_blank"
						>
							Live demo
						</a>
					</div>
				</div>

				{/* Interactive Analytics Card matching Image 1 */}
				<div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-3xl border border-neutral-200/90 bg-white shadow-lg">
					{/* 3 Metric Tabs */}
					<div className="grid grid-cols-3 divide-x divide-neutral-200 border-neutral-200 border-b bg-neutral-50/50">
						{/* Tab 1: Clicks */}
						<button
							className={`relative flex flex-col justify-between p-6 text-left transition-colors ${
								activeTab === "clicks"
									? "bg-white text-neutral-900"
									: "text-neutral-500 hover:bg-neutral-50"
							}`}
							onClick={() => setActiveTab("clicks")}
							type="button"
						>
							{activeTab === "clicks" ? (
								<span className="absolute right-0 bottom-0 left-0 h-0.5 bg-black" />
							) : null}
							<div className="flex items-center justify-between font-medium text-neutral-500 text-xs">
								<span className="flex items-center gap-1.5">
									<span className="size-2 rounded-full bg-blue-500" /> Clicks
								</span>
								<ChevronRight className="size-3.5 text-neutral-300" />
							</div>
							<div className="mt-3 font-bold font-mono text-2xl text-neutral-900">
								109,400
							</div>
						</button>

						{/* Tab 2: Leads */}
						<button
							className={`relative flex flex-col justify-between p-6 text-left transition-colors ${
								activeTab === "leads"
									? "bg-white text-neutral-900"
									: "text-neutral-500 hover:bg-neutral-50"
							}`}
							onClick={() => setActiveTab("leads")}
							type="button"
						>
							{activeTab === "leads" ? (
								<span className="absolute right-0 bottom-0 left-0 h-0.5 bg-black" />
							) : null}
							<div className="flex items-center justify-between font-medium text-neutral-500 text-xs">
								<span className="flex items-center gap-1.5">
									<span className="size-2 rounded-full bg-purple-500" /> Leads
								</span>
								<ChevronRight className="size-3.5 text-neutral-300" />
							</div>
							<div className="mt-3 font-bold font-mono text-2xl text-neutral-900">
								2,182
							</div>
						</button>

						{/* Tab 3: Sales */}
						<button
							className={`relative flex flex-col justify-between p-6 text-left transition-colors ${
								activeTab === "sales"
									? "bg-white text-neutral-900"
									: "text-neutral-500 hover:bg-neutral-50"
							}`}
							onClick={() => setActiveTab("sales")}
							type="button"
						>
							{activeTab === "sales" ? (
								<span className="absolute right-0 bottom-0 left-0 h-0.5 bg-black" />
							) : null}
							<div className="flex items-center justify-between font-medium text-neutral-500 text-xs">
								<span className="flex items-center gap-1.5">
									<span className="size-2 rounded-full bg-teal-500" /> Sales
								</span>
							</div>
							<div className="mt-3 font-bold font-mono text-2xl text-neutral-900">
								US$9,484
							</div>
						</button>
					</div>

					{/* Chart Area */}
					<div className="relative h-[280px] p-6 sm:h-[320px] sm:p-8">
						{/* Y-Axis Labels */}
						<div className="pointer-events-none absolute top-8 bottom-12 left-6 flex flex-col justify-between font-mono text-[11px] text-neutral-300">
							<span>5K</span>
							<span>4K</span>
							<span>3K</span>
						</div>

						{/* SVG Chart Line matching Image 1 */}
						<svg
							className="absolute inset-x-14 inset-y-8 h-[220px] w-[calc(100%-80px)] overflow-visible"
							fill="none"
							preserveAspectRatio="none"
							viewBox="0 0 700 200"
						>
							<defs>
								<linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
									<stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
									<stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
								</linearGradient>
							</defs>

							{/* Dotted horizontal grid lines */}
							<line
								stroke="#f1f5f9"
								strokeDasharray="4 4"
								strokeWidth="1"
								x1="0"
								x2="700"
								y1="20"
								y2="20"
							/>
							<line
								stroke="#f1f5f9"
								strokeDasharray="4 4"
								strokeWidth="1"
								x1="0"
								x2="700"
								y1="90"
								y2="90"
							/>
							<line
								stroke="#f1f5f9"
								strokeDasharray="4 4"
								strokeWidth="1"
								x1="0"
								x2="700"
								y1="160"
								y2="160"
							/>

							{/* Area Fill */}
							<path
								d="M 0 60 L 40 40 L 80 110 L 120 70 L 160 120 L 200 90 L 240 130 L 280 60 L 320 150 L 360 20 L 400 90 L 440 30 L 480 170 L 520 80 L 560 50 L 600 130 L 640 60 L 680 150 L 700 150 L 700 200 L 0 200 Z"
								fill="url(#areaGradient)"
							/>

							{/* Line */}
							<path
								d="M 0 60 L 40 40 L 80 110 L 120 70 L 160 120 L 200 90 L 240 130 L 280 60 L 320 150 L 360 20 L 400 90 L 440 30 L 480 170 L 520 80 L 560 50 L 600 130 L 640 60 L 680 150 L 700 150"
								stroke="#3b82f6"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
							/>

							{/* Active Point at x=440, y=30 */}
							<circle cx="440" cy="30" fill="#3b82f6" r="3.5" />
						</svg>

						{/* Active Hover Tooltip matching Image 1 */}
						<div className="absolute top-[12%] left-[60%] z-10 flex w-[130px] flex-col rounded-xl border border-neutral-200 bg-white p-2.5 text-xs shadow-md">
							<span className="border-neutral-100 border-b pb-1 font-medium text-[10px] text-neutral-400">
								July 28, 2026
							</span>
							<div className="mt-1 flex items-center justify-between text-xs">
								<span className="flex items-center gap-1 text-neutral-600">
									<span className="size-1.5 rounded-full bg-blue-500" /> Clicks
								</span>
								<span className="font-mono font-semibold text-neutral-900">
									3,527
								</span>
							</div>
						</div>

						{/* X-Axis Dates */}
						<div className="absolute right-8 bottom-3 left-14 flex justify-between font-mono text-[10px] text-neutral-300">
							<span>Jul 15</span>
							<span>Jul 20</span>
							<span>Jul 25</span>
							<span>Jul 30</span>
							<span>Aug 4</span>
							<span>Aug 9</span>
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}

function TrackproofFeaturesGridSection() {
	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-0">
				{/* Top 2-Column Grid (50/50 Split) matching Image 2 */}
				<div className="grid grid-cols-1 divide-y border-neutral-200 border-b lg:grid-cols-2 lg:divide-x lg:divide-y-0">
					{/* Card 1: Dashboard Sharing */}
					<div className="flex flex-col justify-between p-8 sm:p-12">
						{/* Mock Share Modal Visual */}
						<div className="relative mb-8 flex min-h-[220px] flex-col gap-4 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 shadow-2xs backdrop-blur-xs">
							<div className="flex items-center justify-between border-neutral-200/80 border-b pb-3">
								<span className="font-semibold text-neutral-900 text-xs">
									Share dashboard
								</span>
							</div>
							<div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-3">
								<div className="flex items-center gap-2">
									<div className="flex size-5 items-center justify-center rounded-md bg-neutral-900 font-bold text-[10px] text-white">
										T
									</div>
									<span className="font-medium font-mono text-neutral-800 text-xs">
										d.to/try
									</span>
								</div>
								<span className="pl-7 font-mono text-[11px] text-neutral-400">
									↳ app.dub.co/register
								</span>
							</div>
							<div className="flex items-center justify-between pt-1">
								<span className="font-medium text-neutral-600 text-xs">
									Enable public sharing
								</span>
								<div className="flex h-5 w-9 items-center justify-end rounded-full bg-neutral-900 p-0.5">
									<div className="size-4 rounded-full bg-white shadow-2xs" />
								</div>
							</div>
							<div className="flex items-center gap-2">
								<input
									className="flex-1 select-all rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 font-mono text-[11px] text-neutral-400"
									readOnly
									type="text"
									value="https://app.dub.co/share/dash_6NSA6vNm"
								/>
								<button
									className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 font-medium text-neutral-700 text-xs shadow-2xs hover:bg-neutral-50"
									type="button"
								>
									Copy link
								</button>
							</div>
						</div>

						<div>
							<h3 className="font-bold font-satoshi text-neutral-900 text-xl">
								Analytics dashboard sharing
							</h3>
							<p className="mt-2 max-w-md text-neutral-500 text-xs leading-relaxed sm:text-sm">
								Share your dashboard with your team, partners, investors, or
								other external stakeholders, with one click.
							</p>
							<div className="mt-5">
								<a
									className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 font-medium text-neutral-900 text-xs shadow-2xs transition-colors hover:bg-neutral-50"
									href="/contact"
								>
									Learn more
								</a>
							</div>
						</div>
					</div>

					{/* Card 2: Geo and Device Data */}
					<div className="flex flex-col justify-between p-8 sm:p-12">
						{/* Stacked Translucent Cards Visual */}
						<div className="relative mb-8 flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 shadow-2xs backdrop-blur-xs">
							<div className="relative flex w-full max-w-xs flex-col gap-2">
								{/* Card Layer 1 (Browsers) */}
								<div className="flex translate-y-2 transform items-center justify-between rounded-xl border border-neutral-200 bg-white/70 p-2.5 text-neutral-400 text-xs opacity-60 shadow-2xs">
									<span className="flex items-center gap-1.5 font-medium">
										<Globe className="size-3.5" /> Devices
									</span>
									<span className="font-mono text-[11px]">1.6K</span>
								</div>
								{/* Card Layer 2 (Countries) */}
								<div className="relative z-10 flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-3 text-xs shadow-md">
									<div className="flex items-center justify-between border-neutral-100 border-b pb-1.5 font-semibold text-neutral-700">
										<span className="flex items-center gap-1.5">
											<Globe className="size-3.5 text-neutral-800" /> Countries
										</span>
									</div>
									<div className="flex items-center justify-between rounded-lg bg-neutral-50 px-2 py-1 text-[11px]">
										<span className="font-medium text-neutral-700">
											🇺🇸 United States
										</span>
										<span className="font-mono font-semibold text-neutral-900">
											1.8K
										</span>
									</div>
									<div className="flex items-center justify-between px-2 py-0.5 text-[11px]">
										<span className="text-neutral-500">🇨🇦 Canada</span>
										<span className="font-mono text-neutral-700">1.2K</span>
									</div>
									<div className="flex items-center justify-between px-2 py-0.5 text-[11px]">
										<span className="text-neutral-500">🇬🇧 United Kingdom</span>
										<span className="font-mono text-neutral-700">850</span>
									</div>
								</div>
							</div>
						</div>

						<div>
							<h3 className="font-bold font-satoshi text-neutral-900 text-xl">
								Detailed geo and device-specific data
							</h3>
							<p className="mt-2 max-w-md text-neutral-500 text-xs leading-relaxed sm:text-sm">
								Analyze performance of your short links based on cities,
								countries, browsers, devices, and more.
							</p>
							<div className="mt-5">
								<a
									className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 font-medium text-neutral-900 text-xs shadow-2xs transition-colors hover:bg-neutral-50"
									href="/contact"
								>
									Learn more
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom 4-Column Grid matching Image 2 */}
				<div className="grid grid-cols-1 divide-y border-neutral-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-4">
					{/* 1. Date Range Picker */}
					<div className="flex flex-col justify-between p-8 sm:p-10">
						<div>
							<div className="flex size-9 items-center justify-center rounded-lg border border-emerald-200/60 bg-emerald-50 text-emerald-600 shadow-2xs">
								<Calendar className="size-4" />
							</div>
							<h4 className="mt-4 font-bold font-satoshi text-base text-neutral-900">
								Date range picker
							</h4>
							<p className="mt-1.5 text-neutral-500 text-xs leading-relaxed">
								Select custom date ranges with flexibility and accuracy.
							</p>
						</div>
						<div className="mt-6">
							<a
								className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-medium text-neutral-900 text-xs shadow-2xs transition-colors hover:bg-neutral-50"
								href="/contact"
							>
								Learn more
							</a>
						</div>
					</div>

					{/* 2. Data Export */}
					<div className="flex flex-col justify-between p-8 sm:p-10">
						<div>
							<div className="flex size-9 items-center justify-center rounded-lg border border-emerald-200/60 bg-emerald-50 text-emerald-600 shadow-2xs">
								<Download className="size-4" />
							</div>
							<h4 className="mt-4 font-bold font-satoshi text-base text-neutral-900">
								Data export
							</h4>
							<p className="mt-1.5 text-neutral-500 text-xs leading-relaxed">
								Use exported CSV data with your tools or for sharing.
							</p>
						</div>
						<div className="mt-6">
							<a
								className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-medium text-neutral-900 text-xs shadow-2xs transition-colors hover:bg-neutral-50"
								href="/contact"
							>
								Learn more
							</a>
						</div>
					</div>

					{/* 3. Extensive Filters */}
					<div className="flex flex-col justify-between p-8 sm:p-10">
						<div>
							<div className="flex size-9 items-center justify-center rounded-lg border border-emerald-200/60 bg-emerald-50 text-emerald-600 shadow-2xs">
								<Filter className="size-4" />
							</div>
							<h4 className="mt-4 font-bold font-satoshi text-base text-neutral-900">
								Extensive filters
							</h4>
							<p className="mt-1.5 text-neutral-500 text-xs leading-relaxed">
								Endless combinations for refining your analytics.
							</p>
						</div>
						<div className="mt-6">
							<a
								className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-medium text-neutral-900 text-xs shadow-2xs transition-colors hover:bg-neutral-50"
								href="/contact"
							>
								Learn more
							</a>
						</div>
					</div>

					{/* 4. Ask AI */}
					<div className="flex flex-col justify-between p-8 sm:p-10">
						<div>
							<div className="flex size-9 items-center justify-center rounded-lg border border-emerald-200/60 bg-emerald-50 text-emerald-600 shadow-2xs">
								<Sparkles className="size-4" />
							</div>
							<h4 className="mt-4 font-bold font-satoshi text-base text-neutral-900">
								Ask AI
							</h4>
							<p className="mt-1.5 text-neutral-500 text-xs leading-relaxed">
								Use natural language to query and filter with ease.
							</p>
						</div>
						<div className="mt-6">
							<a
								className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-medium text-neutral-900 text-xs shadow-2xs transition-colors hover:bg-neutral-50"
								href="/contact"
							>
								Learn more
							</a>
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}

function VisualizeJourneySection() {
	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-16 sm:py-24">
				{/* Header */}
				<div className="flex flex-col items-center px-6 text-center sm:px-8">
					<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-semibold text-neutral-700 text-xs shadow-2xs">
						<Filter className="size-3.5 text-neutral-700" />
						Conversion Tracking
					</span>
					<h2 className="mt-4 font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
						Visualize your journey
					</h2>
					<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
						Understand how your marketing clicks are converting to revenue,
						without the guesswork.
					</p>

					<div className="mt-6 flex items-center gap-3">
						<a
							className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 font-semibold text-white text-xs shadow-xs transition-colors hover:bg-neutral-800"
							href={BOOKING_URL}
							rel="noopener noreferrer"
							target="_blank"
						>
							<Play className="size-3.5 fill-white text-white" />
							<span>Watch Demo</span>
						</a>
						<a
							className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 font-medium text-neutral-900 text-xs shadow-2xs transition-colors hover:bg-neutral-50"
							href="/docs"
						>
							<Code className="size-3.5 text-neutral-700" />
							<span>Read the docs</span>
						</a>
					</div>
				</div>

				<div className="mt-12">
					<Funnel embedded />
				</div>
			</Frame>
		</section>
	);
}

function CustomerInsightsAndIntegrationsSection() {
	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-0">
				<div className="grid grid-cols-1 divide-y border-neutral-200 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
					{/* Column 1: Customer Insights */}
					<div className="flex flex-col justify-between p-8 sm:p-12">
						<div className="relative mb-8 flex min-h-[240px] flex-col gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 shadow-2xs backdrop-blur-xs">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2.5">
									<div className="flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-800 font-bold text-white text-xs">
										DW
									</div>
									<div>
										<div className="flex items-center gap-1.5">
											<span className="font-bold text-neutral-900 text-xs">
												Danielle Wilson
											</span>
											<span className="rounded bg-neutral-900 px-1 py-0.2 font-bold text-[9px] text-white">
												Pro
											</span>
											<span className="font-mono text-[10px] text-neutral-400">
												2y 10m
											</span>
										</div>
										<span className="text-[11px] text-neutral-400">
											danielle@dub.co
										</span>
									</div>
								</div>
								<span className="rounded border border-neutral-200 bg-white px-2 py-0.5 font-medium text-[10px] text-neutral-600">
									🇺🇸 United States
								</span>
							</div>

							<div className="grid grid-cols-3 gap-2 border-neutral-200/80 border-y py-2.5 text-[11px]">
								<div>
									<span className="block text-[9px] text-neutral-400 uppercase tracking-wider">
										Lead
									</span>
									<span className="font-mono font-semibold text-neutral-900">
										21h 2m
									</span>
								</div>
								<div>
									<span className="block text-[9px] text-neutral-400 uppercase tracking-wider">
										Sale
									</span>
									<span className="font-mono font-semibold text-neutral-900">
										2d 20h
									</span>
								</div>
								<div>
									<span className="block text-[9px] text-neutral-400 uppercase tracking-wider">
										Lifetime value
									</span>
									<span className="font-mono font-semibold text-emerald-700">
										$576
									</span>
								</div>
							</div>

							<div className="flex flex-col gap-1 text-[11px]">
								<span className="font-semibold text-[10px] text-neutral-400 uppercase">
									Activity
								</span>
								<div className="flex items-center justify-between text-neutral-600">
									<span>💳 $65.00 payment made</span>
									<span className="font-mono text-[10px] text-neutral-400">
										Dec 14 at 3:04 AM
									</span>
								</div>
								<div className="flex items-center justify-between text-neutral-600">
									<span>✓ Updated to Business plan</span>
									<span className="font-mono text-[10px] text-neutral-400">
										Dec 14 at 3:04 AM
									</span>
								</div>
							</div>
						</div>

						<div>
							<h3 className="font-bold font-satoshi text-neutral-900 text-xl">
								Customer insights
							</h3>
							<p className="mt-2 max-w-md text-neutral-500 text-xs leading-relaxed sm:text-sm">
								Visualize your customer acquisition costs, retention rates,
								lifetime value, and more to understand your return on marketing
								spend.
							</p>
						</div>
					</div>

					{/* Column 2: Tech Stack Integrations */}
					<div className="flex flex-col justify-between p-8 sm:p-12">
						<div className="relative mb-8 flex min-h-[240px] items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 shadow-2xs backdrop-blur-xs">
							<div className="grid w-full max-w-xs grid-cols-4 gap-3">
								<div className="flex aspect-square items-center justify-center rounded-xl border border-neutral-200 bg-white p-3 font-bold text-indigo-600 text-xs shadow-2xs">
									stripe
								</div>
								<div className="flex aspect-square items-center justify-center rounded-xl border border-neutral-200 bg-white p-3 font-bold text-blue-500 text-xs shadow-2xs">
									◆
								</div>
								<div className="flex aspect-square items-center justify-center rounded-xl border border-neutral-200 bg-white p-3 font-bold text-emerald-600 text-xs shadow-2xs">
									§
								</div>
								<div className="flex aspect-square items-center justify-center rounded-xl border border-neutral-200 bg-white p-3 font-bold text-[10px] text-orange-600 shadow-2xs">
									_zapier
								</div>
								<div className="flex aspect-square items-center justify-center rounded-xl border border-neutral-200 bg-white p-3 font-bold text-emerald-700 text-xs shadow-2xs">
									🛒
								</div>
								<div className="flex aspect-square items-center justify-center rounded-xl border border-neutral-200 bg-white p-3 font-bold text-purple-600 text-xs shadow-2xs">
									💬
								</div>
								<div className="aspect-square rounded-xl border border-neutral-100 bg-white/40 p-3" />
								<div className="aspect-square rounded-xl border border-neutral-100 bg-white/30 p-3" />
							</div>
						</div>

						<div>
							<h3 className="font-bold font-satoshi text-neutral-900 text-xl">
								Integrate with your tech stack
							</h3>
							<p className="mt-2 max-w-md text-neutral-500 text-xs leading-relaxed sm:text-sm">
								Leverage our native integrations with various authentication and
								payment platforms to automatically track your conversions.
							</p>
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

function DetailedFiltersAndTestimonialSection() {
	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-0">
				<div className="grid grid-cols-1 divide-y border-neutral-200 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
					<div className="flex flex-col justify-between p-8 sm:p-12">
						<div className="relative mb-8 flex min-h-[220px] items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 shadow-2xs backdrop-blur-xs">
							<div className="flex max-w-xs flex-wrap items-center justify-center gap-2">
								<span className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-medium text-neutral-700 text-xs shadow-2xs">
									Folder is{" "}
									<strong className="rounded bg-emerald-50 px-1 text-emerald-700">
										Site Links
									</strong>{" "}
									×
								</span>
								<span className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-medium text-neutral-700 text-xs shadow-2xs">
									Link is{" "}
									<strong className="font-mono text-neutral-900">dub.sh</strong>{" "}
									×
								</span>
								<span className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-medium text-neutral-700 text-xs shadow-2xs">
									City is 🇺🇸 Brooklyn ×
								</span>
								<span className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-medium text-neutral-700 text-xs shadow-2xs">
									Browser is Chrome ×
								</span>
							</div>
						</div>

						<div>
							<h3 className="font-bold font-satoshi text-neutral-900 text-xl">
								Detailed filters
							</h3>
							<p className="mt-2 max-w-md text-neutral-500 text-xs leading-relaxed sm:text-sm">
								Narrow down exactly how your traffic is arriving and where it's
								coming from.
							</p>
							<div className="mt-5">
								<a
									className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 font-medium text-neutral-900 text-xs shadow-2xs transition-colors hover:bg-neutral-50"
									href="/contact"
								>
									Learn more
								</a>
							</div>
						</div>
					</div>

					<div className="flex flex-col justify-between bg-gradient-to-br from-teal-50/40 via-emerald-50/20 to-white p-8 sm:p-12">
						<div>
							<div className="flex items-center gap-1.5 font-bold text-neutral-900 text-xl tracking-tight">
								<span className="font-extrabold text-2xl text-teal-600">❇</span>{" "}
								perplexity
							</div>

							<blockquote className="mt-6 font-medium text-neutral-700 text-sm leading-relaxed sm:text-base">
								"Dub has been a game-changer for our marketing campaigns – our
								links get tens of millions of clicks monthly and with Dub, we
								are able to easily design our link previews,{" "}
								<u className="decoration-neutral-400 decoration-dashed">
									attribute clicks
								</u>
								, and visualize our data."
							</blockquote>
						</div>

						<div className="mt-8 flex items-center gap-3 border-neutral-200/80 border-t pt-4">
							<div className="flex size-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-900 font-bold text-white text-xs">
								JH
							</div>
							<div>
								<div className="font-semibold text-neutral-900 text-xs sm:text-sm">
									Johnny Ho
								</div>
								<div className="text-[11px] text-neutral-500">
									Co-founder, Perplexity
								</div>
							</div>
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}

function KnowYourCustomerSection() {
	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-16 sm:py-24">
				<div className="flex flex-col items-center px-6 text-center sm:px-8">
					<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-semibold text-neutral-700 text-xs shadow-2xs">
						<Eye className="size-3.5 text-neutral-700" />
						Customer Insights
					</span>
					<h2 className="mt-4 font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
						Know your customer
					</h2>
					<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
						Track your customer journey from first click to conversion, with
						detailed events and insights.
					</p>

					<div className="mt-6">
						<a
							className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800"
							href="/contact"
						>
							Learn more
						</a>
					</div>
				</div>

				<div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 items-center gap-6 sm:grid-cols-3">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1.5 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4 text-xs">
							<span className="font-semibold text-neutral-900">Details</span>
							<span className="text-neutral-600">🇺🇸 Los Angeles, USA</span>
							<span className="text-neutral-600">💻 Mac OS</span>
							<span className="text-neutral-600">🖥️ Desktop</span>
							<span className="text-neutral-600">🧩 Safari</span>
						</div>

						<div className="flex flex-col gap-1 rounded-2xl border border-neutral-200 bg-white p-4 text-xs shadow-2xs">
							<span className="text-[10px] text-neutral-400">Found via</span>
							<span className="font-mono text-[11px] text-neutral-800">
								refer.dub.co/steven
							</span>
							<span className="text-[10px] text-neutral-400">
								via yoursite.com
							</span>
							<span className="mt-1 font-mono text-[10px] text-neutral-400">
								Sep 2, 2024 3:02PM
							</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-3 rounded-3xl border border-neutral-200 bg-white p-6 text-center shadow-xl">
						<div className="flex size-24 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 font-bold text-2xl text-neutral-400">
							EC
						</div>
						<div>
							<h3 className="font-bold text-base text-neutral-900">
								Emily Carter
							</h3>
							<p className="text-neutral-400 text-xs">emily@acme.com</p>
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4 text-xs">
							<span className="font-semibold text-neutral-900">UTM</span>
							<div className="flex justify-between">
								<span className="text-neutral-400">Source</span>
								<span className="font-mono">google</span>
							</div>
							<div className="flex justify-between">
								<span className="text-neutral-400">Campaign</span>
								<span className="font-mono">marketing</span>
							</div>
							<div className="flex justify-between">
								<span className="text-neutral-400">Term</span>
								<span className="font-mono">new_feature</span>
							</div>
						</div>

						<div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-4 text-xs shadow-2xs">
							<div className="flex justify-between border-neutral-100 border-b pb-1">
								<span className="text-neutral-400">Customer since</span>
								<span className="font-semibold text-neutral-900">
									Oct 2, 2024
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-neutral-400">Lifetime value</span>
								<span className="font-bold font-mono text-emerald-700">
									$140
								</span>
							</div>
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}

/* SECTION 10: PIXEL VS TRACKPROOF COMPARISON (Exact Replica of Image 1) */
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
			{/* SECTION 1: HERO (Image 2 Replica) */}
			<TrackproofHeroSection />

			{/* SECTION 2: LOGO CLOUD (Matching Homepage) */}
			<LogoCloud />

			{/* SECTION 3: REAL-TIME ANALYTICS (Success at a Glance) */}
			<RealTimeAnalyticsSection />

			{/* SECTION 4: FEATURE GRID (Dashboard Sharing & 4 Cards) */}
			<TrackproofFeaturesGridSection />

			{/* SECTION 5: VISUALIZE YOUR JOURNEY */}
			<VisualizeJourneySection />

			{/* SECTION 6: CUSTOMER INSIGHTS & INTEGRATIONS */}
			<CustomerInsightsAndIntegrationsSection />

			{/* SECTION 7: REAL-TIME EVENTS STREAM */}
			<RealTimeEventsStreamSection />

			{/* SECTION 8: DETAILED FILTERS & TESTIMONIAL */}
			<DetailedFiltersAndTestimonialSection />

			{/* SECTION 9: KNOW YOUR CUSTOMER */}
			<KnowYourCustomerSection />

			{/* SECTION 10: PIXEL VS TRACKPROOF COMPARISON (Image 1) */}
			<TrackproofComparisonSection />

			{/* SECTION 11: 6 CORE CAPABILITIES (Image 2) */}
			<TrackproofCoreCapabilitiesSection />

			{/* SECTION 12: FREQUENTLY ASKED QUESTIONS (Image 3 & Products FAQ) */}
			<TrackproofFaqSection />

			{/* SECTION 13: CLOSING CTA */}
			<CtaDark />
		</main>
	);
}
