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
					<div className="flex flex-col items-start text-left max-w-[540px] z-20 relative">
						{/* Eyebrow Badge */}
						<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 font-semibold text-xs text-emerald-700 shadow-2xs">
							<span className="size-2 rounded-full bg-emerald-500" />
							Trackproof Analytics
						</span>

						{/* Title */}
						<h1 className="mt-4 font-bold font-satoshi text-4xl sm:text-5xl lg:text-[52px] text-neutral-900 leading-[1.08] tracking-tight">
							{product?.tagline ?? "Your ROAS is better than Meta is telling you."}
						</h1>

						{/* Subhead */}
						<p className="mt-4 text-neutral-500 text-sm sm:text-base leading-relaxed max-w-[480px]">
							{product?.heroLead ??
								"Server-side conversions for Meta, Google, and TikTok through each platform's Conversions API, deduplicated against your existing pixel, so every purchase is counted once and none of them go missing."}
						</p>

						{/* Action Buttons */}
						<div className="mt-6 flex items-center gap-3">
							<a
								href={product?.appStoreUrl ?? "https://apps.shopify.com/trackproof"}
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

					{/* Seamless Chart Area matching image */}
					<div className="relative mt-8 sm:mt-4 w-full h-[440px] sm:h-[500px]">
						{/* Y-Axis Labels on Left Edge */}
						<div className="absolute left-0 top-16 bottom-16 flex flex-col justify-between text-[11px] font-mono text-neutral-400 pointer-events-none z-10">
							<span>4,000</span>
							<span>3,000</span>
							<span>2,000</span>
							<span>1,000</span>
						</div>

						{/* SVG Curved Chart Lines matching exact trajectory in image */}
						<svg
							className="absolute inset-0 h-full w-full overflow-visible"
							viewBox="0 0 1000 440"
							fill="none"
							preserveAspectRatio="none"
						>
							{/* Blue Line (Clicks) */}
							<path
								d="M 40 240 Q 120 160 200 150 T 360 190 T 520 140 T 680 170 T 840 70 L 1000 20"
								stroke="#3b82f6"
								strokeWidth="2"
								strokeLinecap="round"
							/>

							{/* Purple Line (Leads) */}
							<path
								d="M 40 310 Q 120 270 200 300 T 360 260 T 520 230 T 680 270 T 840 180 L 1000 130"
								stroke="#a855f7"
								strokeWidth="2"
								strokeLinecap="round"
							/>

							{/* Teal Line (Sales) */}
							<path
								d="M 40 380 Q 120 340 200 370 T 360 320 T 520 350 T 680 300 T 840 270 L 1000 210"
								stroke="#14b8a6"
								strokeWidth="2"
								strokeLinecap="round"
							/>

							{/* Vertical Guide Line at x=780 */}
							<line x1="780" y1="40" x2="780" y2="400" stroke="#93c5fd" strokeWidth="1.5" />

							{/* Data Points on Vertical Guide Line */}
							<circle cx="780" cy="95" r="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
							<circle cx="780" cy="205" r="4" fill="#ffffff" stroke="#a855f7" strokeWidth="2" />
							<circle cx="780" cy="280" r="4" fill="#ffffff" stroke="#14b8a6" strokeWidth="2" />
						</svg>

						{/* Floating Tooltip Cards (Image replica) */}
						<div className="absolute right-[16%] sm:right-[20%] top-[8%] sm:top-[6%] z-20 flex flex-col gap-2.5 shadow-xl rounded-2xl border border-neutral-200/90 bg-white/95 p-3.5 backdrop-blur-md w-[220px] text-xs">
							{/* Top Card Block */}
							<div className="flex flex-col gap-2">
								<div className="flex items-center justify-between border-neutral-100 border-b pb-2">
									<span className="font-mono text-[11px] font-medium text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md flex items-center gap-1">
										<Code className="size-3 text-neutral-500" /> d.to/try
									</span>
									<span className="text-[10px] text-neutral-400 font-medium">
										Jul 2026
									</span>
								</div>

								<div className="flex flex-col gap-1.5">
									<div className="flex items-center justify-between text-xs">
										<span className="flex items-center gap-1.5 text-neutral-600">
											<span className="size-2 rounded-full bg-blue-500" /> Clicks
										</span>
										<span className="font-semibold font-mono text-neutral-900">
											7.5K
										</span>
									</div>
									<div className="flex items-center justify-between text-xs">
										<span className="flex items-center gap-1.5 text-neutral-600">
											<span className="size-2 rounded-full bg-purple-500" /> Leads
										</span>
										<span className="font-semibold font-mono text-neutral-900">
											5.4K
										</span>
									</div>
									<div className="flex items-center justify-between text-xs">
										<span className="flex items-center gap-1.5 text-neutral-600">
											<span className="size-2 rounded-full bg-teal-500" /> Sales
										</span>
										<span className="font-semibold font-mono text-emerald-700">
											$2.9K
										</span>
									</div>
								</div>
							</div>

							{/* Bottom Connected Customer Profile Card */}
							<div className="border-neutral-100 border-t pt-2.5 flex flex-col gap-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="size-7 rounded-full bg-neutral-800 text-white font-bold text-[11px] flex items-center justify-center border border-neutral-200">
											DW
										</div>
										<span className="text-[10px] font-medium text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded">
											🇺🇸 US
										</span>
									</div>
									<span className="text-[10px] text-neutral-400 font-mono">
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
					<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-semibold text-xs text-neutral-700 shadow-2xs">
						<TrendingUp className="size-3.5 text-neutral-700" />
						Real-time Analytics
					</span>
					<h2 className="mt-4 font-bold font-satoshi text-3xl sm:text-4xl text-neutral-900 tracking-tight">
						Success at a glance
					</h2>
					<p className="mt-3 max-w-lg text-neutral-500 text-sm sm:text-base leading-relaxed">
						With our powerful real-time analytics, you can focus on what truly
						matters for your marketing attribution.
					</p>

					<div className="mt-6 flex items-center gap-3">
						<a
							href="/contact"
							className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 font-semibold text-xs text-white shadow-xs transition-colors hover:bg-neutral-800"
						>
							Learn more
						</a>
						<a
							href={BOOKING_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2 font-medium text-xs text-neutral-900 shadow-2xs transition-colors hover:bg-neutral-50"
						>
							Live demo
						</a>
					</div>
				</div>

				{/* Interactive Analytics Card matching Image 1 */}
				<div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-neutral-200/90 bg-white shadow-lg overflow-hidden">
					{/* 3 Metric Tabs */}
					<div className="grid grid-cols-3 border-neutral-200 border-b divide-x divide-neutral-200 bg-neutral-50/50">
						{/* Tab 1: Clicks */}
						<button
							type="button"
							onClick={() => setActiveTab("clicks")}
							className={`p-6 text-left flex flex-col justify-between transition-colors relative ${
								activeTab === "clicks"
									? "bg-white text-neutral-900"
									: "text-neutral-500 hover:bg-neutral-50"
							}`}
						>
							{activeTab === "clicks" ? (
								<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
							) : null}
							<div className="flex items-center justify-between text-xs font-medium text-neutral-500">
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
							type="button"
							onClick={() => setActiveTab("leads")}
							className={`p-6 text-left flex flex-col justify-between transition-colors relative ${
								activeTab === "leads"
									? "bg-white text-neutral-900"
									: "text-neutral-500 hover:bg-neutral-50"
							}`}
						>
							{activeTab === "leads" ? (
								<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
							) : null}
							<div className="flex items-center justify-between text-xs font-medium text-neutral-500">
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
							type="button"
							onClick={() => setActiveTab("sales")}
							className={`p-6 text-left flex flex-col justify-between transition-colors relative ${
								activeTab === "sales"
									? "bg-white text-neutral-900"
									: "text-neutral-500 hover:bg-neutral-50"
							}`}
						>
							{activeTab === "sales" ? (
								<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
							) : null}
							<div className="flex items-center justify-between text-xs font-medium text-neutral-500">
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
					<div className="relative p-6 sm:p-8 h-[280px] sm:h-[320px]">
						{/* Y-Axis Labels */}
						<div className="absolute left-6 top-8 bottom-12 flex flex-col justify-between text-[11px] font-mono text-neutral-300 pointer-events-none">
							<span>5K</span>
							<span>4K</span>
							<span>3K</span>
						</div>

						{/* SVG Chart Line matching Image 1 */}
						<svg
							className="absolute inset-x-14 inset-y-8 h-[220px] w-[calc(100%-80px)] overflow-visible"
							viewBox="0 0 700 200"
							fill="none"
							preserveAspectRatio="none"
						>
							<defs>
								<linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
									<stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
								</linearGradient>
							</defs>

							{/* Dotted horizontal grid lines */}
							<line x1="0" y1="20" x2="700" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
							<line x1="0" y1="90" x2="700" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
							<line x1="0" y1="160" x2="700" y2="160" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

							{/* Area Fill */}
							<path
								d="M 0 60 L 40 40 L 80 110 L 120 70 L 160 120 L 200 90 L 240 130 L 280 60 L 320 150 L 360 20 L 400 90 L 440 30 L 480 170 L 520 80 L 560 50 L 600 130 L 640 60 L 680 150 L 700 150 L 700 200 L 0 200 Z"
								fill="url(#areaGradient)"
							/>

							{/* Line */}
							<path
								d="M 0 60 L 40 40 L 80 110 L 120 70 L 160 120 L 200 90 L 240 130 L 280 60 L 320 150 L 360 20 L 400 90 L 440 30 L 480 170 L 520 80 L 560 50 L 600 130 L 640 60 L 680 150 L 700 150"
								stroke="#3b82f6"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>

							{/* Active Point at x=440, y=30 */}
							<circle cx="440" cy="30" r="3.5" fill="#3b82f6" />
						</svg>

						{/* Active Hover Tooltip matching Image 1 */}
						<div className="absolute left-[60%] top-[12%] z-10 flex flex-col rounded-xl border border-neutral-200 bg-white p-2.5 shadow-md text-xs w-[130px]">
							<span className="text-[10px] font-medium text-neutral-400 border-neutral-100 border-b pb-1">
								July 28, 2026
							</span>
							<div className="mt-1 flex items-center justify-between text-xs">
								<span className="flex items-center gap-1 text-neutral-600">
									<span className="size-1.5 rounded-full bg-blue-500" /> Clicks
								</span>
								<span className="font-semibold font-mono text-neutral-900">
									3,527
								</span>
							</div>
						</div>

						{/* X-Axis Dates */}
						<div className="absolute left-14 right-8 bottom-3 flex justify-between text-[10px] font-mono text-neutral-300">
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
				<div className="grid grid-cols-1 divide-y border-neutral-200 border-b lg:grid-cols-2 lg:divide-y-0 lg:divide-x">
					{/* Card 1: Dashboard Sharing */}
					<div className="flex flex-col justify-between p-8 sm:p-12">
						{/* Mock Share Modal Visual */}
						<div className="relative mb-8 min-h-[220px] rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 shadow-2xs backdrop-blur-xs flex flex-col gap-4">
							<div className="flex items-center justify-between border-neutral-200/80 border-b pb-3">
								<span className="font-semibold text-xs text-neutral-900">
									Share dashboard
								</span>
							</div>
							<div className="rounded-xl border border-neutral-200 bg-white p-3 flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<div className="size-5 rounded-md bg-neutral-900 text-white font-bold text-[10px] flex items-center justify-center">
										T
									</div>
									<span className="font-mono text-xs font-medium text-neutral-800">
										d.to/try
									</span>
								</div>
								<span className="text-[11px] text-neutral-400 font-mono pl-7">
									↳ app.dub.co/register
								</span>
							</div>
							<div className="flex items-center justify-between pt-1">
								<span className="text-xs text-neutral-600 font-medium">
									Enable public sharing
								</span>
								<div className="w-9 h-5 rounded-full bg-neutral-900 p-0.5 flex items-center justify-end">
									<div className="size-4 rounded-full bg-white shadow-2xs" />
								</div>
							</div>
							<div className="flex items-center gap-2">
								<input
									type="text"
									readOnly
									value="https://app.dub.co/share/dash_6NSA6vNm"
									className="flex-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] font-mono text-neutral-400 select-all"
								/>
								<button
									type="button"
									className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 font-medium text-xs text-neutral-700 hover:bg-neutral-50 shadow-2xs"
								>
									Copy link
								</button>
							</div>
						</div>

						<div>
							<h3 className="font-bold font-satoshi text-xl text-neutral-900">
								Analytics dashboard sharing
							</h3>
							<p className="mt-2 text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-md">
								Share your dashboard with your team, partners, investors, or other
								external stakeholders, with one click.
							</p>
							<div className="mt-5">
								<a
									href="/contact"
									className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 font-medium text-xs text-neutral-900 shadow-2xs hover:bg-neutral-50 transition-colors"
								>
									Learn more
								</a>
							</div>
						</div>
					</div>

					{/* Card 2: Geo and Device Data */}
					<div className="flex flex-col justify-between p-8 sm:p-12">
						{/* Stacked Translucent Cards Visual */}
						<div className="relative mb-8 min-h-[220px] rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 shadow-2xs backdrop-blur-xs flex flex-col justify-center items-center">
							<div className="relative w-full max-w-xs flex flex-col gap-2">
								{/* Card Layer 1 (Browsers) */}
								<div className="rounded-xl border border-neutral-200 bg-white/70 p-2.5 shadow-2xs text-xs flex items-center justify-between text-neutral-400 opacity-60 transform translate-y-2">
									<span className="flex items-center gap-1.5 font-medium">
										<Globe className="size-3.5" /> Devices
									</span>
									<span className="font-mono text-[11px]">1.6K</span>
								</div>
								{/* Card Layer 2 (Countries) */}
								<div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-md text-xs flex flex-col gap-2 relative z-10">
									<div className="flex items-center justify-between border-neutral-100 border-b pb-1.5 text-neutral-700 font-semibold">
										<span className="flex items-center gap-1.5">
											<Globe className="size-3.5 text-neutral-800" /> Countries
										</span>
									</div>
									<div className="flex items-center justify-between text-[11px] bg-neutral-50 px-2 py-1 rounded-lg">
										<span className="text-neutral-700 font-medium">🇺🇸 United States</span>
										<span className="font-mono text-neutral-900 font-semibold">1.8K</span>
									</div>
									<div className="flex items-center justify-between text-[11px] px-2 py-0.5">
										<span className="text-neutral-500">🇨🇦 Canada</span>
										<span className="font-mono text-neutral-700">1.2K</span>
									</div>
									<div className="flex items-center justify-between text-[11px] px-2 py-0.5">
										<span className="text-neutral-500">🇬🇧 United Kingdom</span>
										<span className="font-mono text-neutral-700">850</span>
									</div>
								</div>
							</div>
						</div>

						<div>
							<h3 className="font-bold font-satoshi text-xl text-neutral-900">
								Detailed geo and device-specific data
							</h3>
							<p className="mt-2 text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-md">
								Analyze performance of your short links based on cities, countries,
								browsers, devices, and more.
							</p>
							<div className="mt-5">
								<a
									href="/contact"
									className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 font-medium text-xs text-neutral-900 shadow-2xs hover:bg-neutral-50 transition-colors"
								>
									Learn more
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom 4-Column Grid matching Image 2 */}
				<div className="grid grid-cols-1 divide-y border-neutral-200 sm:grid-cols-2 md:grid-cols-4 sm:divide-y-0 sm:divide-x">
					{/* 1. Date Range Picker */}
					<div className="p-8 sm:p-10 flex flex-col justify-between">
						<div>
							<div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-2xs">
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
								href="/contact"
								className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-medium text-xs text-neutral-900 shadow-2xs hover:bg-neutral-50 transition-colors"
							>
								Learn more
							</a>
						</div>
					</div>

					{/* 2. Data Export */}
					<div className="p-8 sm:p-10 flex flex-col justify-between">
						<div>
							<div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-2xs">
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
								href="/contact"
								className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-medium text-xs text-neutral-900 shadow-2xs hover:bg-neutral-50 transition-colors"
							>
								Learn more
							</a>
						</div>
					</div>

					{/* 3. Extensive Filters */}
					<div className="p-8 sm:p-10 flex flex-col justify-between">
						<div>
							<div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-2xs">
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
								href="/contact"
								className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-medium text-xs text-neutral-900 shadow-2xs hover:bg-neutral-50 transition-colors"
							>
								Learn more
							</a>
						</div>
					</div>

					{/* 4. Ask AI */}
					<div className="p-8 sm:p-10 flex flex-col justify-between">
						<div>
							<div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-2xs">
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
								href="/contact"
								className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-medium text-xs text-neutral-900 shadow-2xs hover:bg-neutral-50 transition-colors"
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
					<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-semibold text-xs text-neutral-700 shadow-2xs">
						<Filter className="size-3.5 text-neutral-700" />
						Conversion Tracking
					</span>
					<h2 className="mt-4 font-bold font-satoshi text-3xl sm:text-4xl text-neutral-900 tracking-tight">
						Visualize your journey
					</h2>
					<p className="mt-3 max-w-lg text-neutral-500 text-sm sm:text-base leading-relaxed">
						Understand how your marketing clicks are converting to revenue, without the guesswork.
					</p>

					<div className="mt-6 flex items-center gap-3">
						<a
							href={BOOKING_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 font-semibold text-xs text-white shadow-xs transition-colors hover:bg-neutral-800"
						>
							<Play className="size-3.5 fill-white text-white" />
							<span>Watch Demo</span>
						</a>
						<a
							href="/docs"
							className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 font-medium text-xs text-neutral-900 shadow-2xs transition-colors hover:bg-neutral-50"
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
				<div className="grid grid-cols-1 divide-y border-neutral-200 lg:grid-cols-2 lg:divide-y-0 lg:divide-x">
					{/* Column 1: Customer Insights */}
					<div className="flex flex-col justify-between p-8 sm:p-12">
						<div className="relative mb-8 min-h-[240px] rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 shadow-2xs backdrop-blur-xs flex flex-col gap-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2.5">
									<div className="size-9 rounded-full bg-neutral-800 text-white font-bold text-xs flex items-center justify-center border border-neutral-200">
										DW
									</div>
									<div>
										<div className="flex items-center gap-1.5">
											<span className="font-bold text-neutral-900 text-xs">Danielle Wilson</span>
											<span className="rounded bg-neutral-900 px-1 py-0.2 text-[9px] font-bold text-white">Pro</span>
											<span className="text-[10px] text-neutral-400 font-mono">2y 10m</span>
										</div>
										<span className="text-[11px] text-neutral-400">danielle@dub.co</span>
									</div>
								</div>
								<span className="text-[10px] font-medium text-neutral-600 bg-white px-2 py-0.5 rounded border border-neutral-200">
									🇺🇸 United States
								</span>
							</div>

							<div className="grid grid-cols-3 gap-2 border-neutral-200/80 border-y py-2.5 text-[11px]">
								<div>
									<span className="text-neutral-400 block text-[9px] uppercase tracking-wider">Lead</span>
									<span className="font-semibold text-neutral-900 font-mono">21h 2m</span>
								</div>
								<div>
									<span className="text-neutral-400 block text-[9px] uppercase tracking-wider">Sale</span>
									<span className="font-semibold text-neutral-900 font-mono">2d 20h</span>
								</div>
								<div>
									<span className="text-neutral-400 block text-[9px] uppercase tracking-wider">Lifetime value</span>
									<span className="font-semibold text-emerald-700 font-mono">$576</span>
								</div>
							</div>

							<div className="flex flex-col gap-1 text-[11px]">
								<span className="text-[10px] text-neutral-400 font-semibold uppercase">Activity</span>
								<div className="flex items-center justify-between text-neutral-600">
									<span>💳 $65.00 payment made</span>
									<span className="text-[10px] text-neutral-400 font-mono">Dec 14 at 3:04 AM</span>
								</div>
								<div className="flex items-center justify-between text-neutral-600">
									<span>✓ Updated to Business plan</span>
									<span className="text-[10px] text-neutral-400 font-mono">Dec 14 at 3:04 AM</span>
								</div>
							</div>
						</div>

						<div>
							<h3 className="font-bold font-satoshi text-xl text-neutral-900">
								Customer insights
							</h3>
							<p className="mt-2 text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-md">
								Visualize your customer acquisition costs, retention rates, lifetime value, and more to understand your return on marketing spend.
							</p>
						</div>
					</div>

					{/* Column 2: Tech Stack Integrations */}
					<div className="flex flex-col justify-between p-8 sm:p-12">
						<div className="relative mb-8 min-h-[240px] rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 shadow-2xs backdrop-blur-xs flex items-center justify-center">
							<div className="grid grid-cols-4 gap-3 w-full max-w-xs">
								<div className="aspect-square rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs flex items-center justify-center font-bold text-indigo-600 text-xs">
									stripe
								</div>
								<div className="aspect-square rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs flex items-center justify-center text-blue-500 text-xs font-bold">
									◆
								</div>
								<div className="aspect-square rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs flex items-center justify-center text-emerald-600 text-xs font-bold">
									§
								</div>
								<div className="aspect-square rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs flex items-center justify-center text-orange-600 font-bold text-[10px]">
									_zapier
								</div>
								<div className="aspect-square rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs flex items-center justify-center text-emerald-700 font-bold text-xs">
									🛒
								</div>
								<div className="aspect-square rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs flex items-center justify-center text-purple-600 font-bold text-xs">
									💬
								</div>
								<div className="aspect-square rounded-xl border border-neutral-100 bg-white/40 p-3" />
								<div className="aspect-square rounded-xl border border-neutral-100 bg-white/30 p-3" />
							</div>
						</div>

						<div>
							<h3 className="font-bold font-satoshi text-xl text-neutral-900">
								Integrate with your tech stack
							</h3>
							<p className="mt-2 text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-md">
								Leverage our native integrations with various authentication and payment platforms to automatically track your conversions.
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
		{ event: "Subscription", link: "company.link/fb", customer: "Yuki Tanada", flag: "🇯🇵", country: "Japan", amount: "$49 USD", date: "Aug 9, 12:14 PM" },
		{ event: "Subscription", link: "company.link/x", customer: "Isabella García", flag: "🇪🇸", country: "Spain", amount: "$99 USD", date: "Aug 9, 12:10 PM" },
		{ event: "Subscription", link: "company.link/linkedin", customer: "Emma Thompson", flag: "🇺🇸", country: "United States", amount: "$24 USD", date: "Aug 9, 12:06 PM" },
		{ event: "Subscription", link: "company.link/insta", customer: "James Chen", flag: "🇨🇭", country: "Switzerland", amount: "$49 USD", date: "Aug 9, 12:02 PM" },
		{ event: "Subscription", link: "company.link/fb", customer: "Sofia Rodriguez", flag: "🇹🇼", country: "Taiwan", amount: "$99 USD", date: "Aug 9, 11:59 AM" },
		{ event: "Subscription", link: "company.link/x", customer: "Michael O'Connor", flag: "🇹🇼", country: "Taiwan", amount: "$24 USD", date: "Aug 9, 11:55 AM" },
		{ event: "Subscription", link: "company.link/linkedin", customer: "Yuki Tanada", flag: "🇯🇵", country: "Japan", amount: "$49 USD", date: "Aug 9, 11:51 AM" },
	];

	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-16 sm:py-24">
				<div className="flex flex-col items-center px-6 text-center sm:px-8">
					<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-semibold text-xs text-neutral-700 shadow-2xs">
						<Activity className="size-3.5 text-neutral-700" />
						Real-Time Events Stream
					</span>
					<h2 className="mt-4 font-bold font-satoshi text-3xl sm:text-4xl text-neutral-900 tracking-tight">
						See it as it happens
					</h2>
					<p className="mt-3 max-w-lg text-neutral-500 text-sm sm:text-base leading-relaxed">
						Gain deeper insights with fine-grained, event-level data. Understand every click, lead, and sale in real-time.
					</p>
				</div>

				<div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-lg">
					<div className="grid grid-cols-3 gap-4 mb-6">
						<div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4">
							<span className="text-xs text-neutral-500">Clicks</span>
							<div className="font-bold text-xl text-neutral-900 font-mono mt-1">6,215</div>
						</div>
						<div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4">
							<span className="text-xs text-neutral-500">Leads</span>
							<div className="font-bold text-xl text-neutral-900 font-mono mt-1">736</div>
						</div>
						<div className="rounded-2xl border-2 border-neutral-900 bg-white p-4 shadow-2xs">
							<span className="text-xs text-neutral-500 font-medium">Sales</span>
							<div className="font-bold text-xl text-neutral-900 font-mono mt-1">US$780</div>
						</div>
					</div>

					<div className="overflow-x-auto rounded-xl border border-neutral-200">
						<table className="w-full text-left text-xs">
							<thead className="bg-neutral-50 text-neutral-500 border-neutral-200 border-b font-medium">
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
									<tr key={`${row.customer}-${i.toString()}`} className="hover:bg-neutral-50/80 transition-colors">
										<td className="px-4 py-2.5 font-medium text-neutral-900">{row.event}</td>
										<td className="px-4 py-2.5 font-mono text-neutral-500">{row.link}</td>
										<td className="px-4 py-2.5 font-medium">{row.customer}</td>
										<td className="px-4 py-2.5">{row.flag} {row.country}</td>
										<td className="px-4 py-2.5 font-semibold font-mono text-emerald-700">{row.amount}</td>
										<td className="px-4 py-2.5 font-mono text-neutral-400">{row.date}</td>
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
				<div className="grid grid-cols-1 divide-y border-neutral-200 lg:grid-cols-2 lg:divide-y-0 lg:divide-x">
					<div className="flex flex-col justify-between p-8 sm:p-12">
						<div className="relative mb-8 min-h-[220px] rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 shadow-2xs backdrop-blur-xs flex items-center justify-center">
							<div className="flex flex-wrap items-center justify-center gap-2 max-w-xs">
								<span className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs">
									Folder is <strong className="text-emerald-700 bg-emerald-50 px-1 rounded">Site Links</strong> ×
								</span>
								<span className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs">
									Link is <strong className="font-mono text-neutral-900">dub.sh</strong> ×
								</span>
								<span className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs">
									City is 🇺🇸 Brooklyn ×
								</span>
								<span className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs">
									Browser is Chrome ×
								</span>
							</div>
						</div>

						<div>
							<h3 className="font-bold font-satoshi text-xl text-neutral-900">
								Detailed filters
							</h3>
							<p className="mt-2 text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-md">
								Narrow down exactly how your traffic is arriving and where it's coming from.
							</p>
							<div className="mt-5">
								<a
									href="/contact"
									className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 font-medium text-xs text-neutral-900 shadow-2xs hover:bg-neutral-50 transition-colors"
								>
									Learn more
								</a>
							</div>
						</div>
					</div>

					<div className="flex flex-col justify-between p-8 sm:p-12 bg-gradient-to-br from-teal-50/40 via-emerald-50/20 to-white">
						<div>
							<div className="font-bold text-xl text-neutral-900 tracking-tight flex items-center gap-1.5">
								<span className="text-teal-600 font-extrabold text-2xl">❇</span> perplexity
							</div>

							<blockquote className="mt-6 text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
								"Dub has been a game-changer for our marketing campaigns – our links get tens of millions of clicks monthly and with Dub, we are able to easily design our link previews, <u className="decoration-dashed decoration-neutral-400">attribute clicks</u>, and visualize our data."
							</blockquote>
						</div>

						<div className="mt-8 flex items-center gap-3 border-neutral-200/80 border-t pt-4">
							<div className="size-10 rounded-xl bg-neutral-900 text-white font-bold text-xs flex items-center justify-center border border-neutral-200">
								JH
							</div>
							<div>
								<div className="font-semibold text-neutral-900 text-xs sm:text-sm">Johnny Ho</div>
								<div className="text-[11px] text-neutral-500">Co-founder, Perplexity</div>
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
					<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-semibold text-xs text-neutral-700 shadow-2xs">
						<Eye className="size-3.5 text-neutral-700" />
						Customer Insights
					</span>
					<h2 className="mt-4 font-bold font-satoshi text-3xl sm:text-4xl text-neutral-900 tracking-tight">
						Know your customer
					</h2>
					<p className="mt-3 max-w-lg text-neutral-500 text-sm sm:text-base leading-relaxed">
						Track your customer journey from first click to conversion, with detailed events and insights.
					</p>

					<div className="mt-6">
						<a
							href="/contact"
							className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800"
						>
							Learn more
						</a>
					</div>
				</div>

				<div className="mt-14 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
					<div className="flex flex-col gap-4">
						<div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4 text-xs flex flex-col gap-1.5">
							<span className="font-semibold text-neutral-900">Details</span>
							<span className="text-neutral-600">🇺🇸 Los Angeles, USA</span>
							<span className="text-neutral-600">💻 Mac OS</span>
							<span className="text-neutral-600">🖥️ Desktop</span>
							<span className="text-neutral-600">🧩 Safari</span>
						</div>

						<div className="rounded-2xl border border-neutral-200 bg-white p-4 text-xs flex flex-col gap-1 shadow-2xs">
							<span className="text-neutral-400 text-[10px]">Found via</span>
							<span className="font-mono text-neutral-800 text-[11px]">refer.dub.co/steven</span>
							<span className="text-neutral-400 text-[10px]">via yoursite.com</span>
							<span className="text-neutral-400 text-[10px] font-mono mt-1">Sep 2, 2024 3:02PM</span>
						</div>
					</div>

					<div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl text-center flex flex-col items-center gap-3">
						<div className="size-24 rounded-2xl bg-neutral-200 border border-neutral-200 overflow-hidden flex items-center justify-center font-bold text-neutral-400 text-2xl">
							EC
						</div>
						<div>
							<h3 className="font-bold text-neutral-900 text-base">Emily Carter</h3>
							<p className="text-xs text-neutral-400">emily@acme.com</p>
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4 text-xs flex flex-col gap-1">
							<span className="font-semibold text-neutral-900">UTM</span>
							<div className="flex justify-between"><span className="text-neutral-400">Source</span><span className="font-mono">google</span></div>
							<div className="flex justify-between"><span className="text-neutral-400">Campaign</span><span className="font-mono">marketing</span></div>
							<div className="flex justify-between"><span className="text-neutral-400">Term</span><span className="font-mono">new_feature</span></div>
						</div>

						<div className="rounded-2xl border border-neutral-200 bg-white p-4 text-xs flex flex-col gap-2 shadow-2xs">
							<div className="flex justify-between border-neutral-100 border-b pb-1">
								<span className="text-neutral-400">Customer since</span>
								<span className="font-semibold text-neutral-900">Oct 2, 2024</span>
							</div>
							<div className="flex justify-between">
								<span className="text-neutral-400">Lifetime value</span>
								<span className="font-bold text-emerald-700 font-mono">$140</span>
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
				<div className="flex flex-col items-center text-center max-w-3xl mx-auto">
					<span className="font-semibold font-mono text-xs text-purple-600 uppercase tracking-widest">
						Why browser pixels fail
					</span>
					<h2 className="mt-3 font-bold font-satoshi text-3xl sm:text-4xl lg:text-[42px] text-neutral-900 tracking-tight leading-[1.1]">
						Stop turning off ad sets that are quietly working.
					</h2>
					<p className="mt-3 text-neutral-500 text-sm sm:text-base leading-relaxed max-w-2xl">
						Browser pixels miss up to 30% of conversions to iOS privacy settings, Safari ITP, and ad blockers.
						Trackproof bridges the gap with server-side Conversions API.
					</p>
				</div>

				<div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-5xl mx-auto">
					{/* Browser Pixel Only */}
					<div className="rounded-3xl border border-rose-200 bg-rose-50/20 p-8 shadow-2xs flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between pb-4 border-b border-rose-100">
								<h3 className="font-bold font-satoshi text-xl text-rose-950">
									Browser Pixel Only
								</h3>
								<span className="flex size-7 items-center justify-center rounded-full border border-rose-300 bg-white text-rose-500 font-bold text-xs">
									✕
								</span>
							</div>

							<ul className="mt-6 flex flex-col gap-4">
								{COMPARISON_POINTS[0].items.map((item) => (
									<li key={item} className="flex items-start gap-3 text-sm text-rose-950/80 leading-relaxed">
										<span className="mt-0.5 text-rose-500 font-bold text-sm shrink-0">✕</span>
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="mt-8 pt-4 border-t border-rose-100 text-xs font-semibold text-rose-700">
							Result: Wasted ad budget & wrong scaling decisions
						</div>
					</div>

					{/* Trackproof Server-Side CAPI */}
					<div className="rounded-3xl border border-emerald-200 bg-emerald-50/20 p-8 shadow-2xs flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between pb-4 border-b border-emerald-100">
								<h3 className="font-bold font-satoshi text-xl text-emerald-950">
									Trackproof Server-Side CAPI
								</h3>
								<span className="flex size-7 items-center justify-center rounded-full border border-emerald-300 bg-white text-emerald-600 font-bold text-xs">
									✓
								</span>
							</div>

							<ul className="mt-6 flex flex-col gap-4">
								{COMPARISON_POINTS[1].items.map((item) => (
									<li key={item} className="flex items-start gap-3 text-sm text-emerald-950/90 leading-relaxed">
										<span className="mt-0.5 text-emerald-600 font-bold text-sm shrink-0">✓</span>
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="mt-8 pt-4 border-t border-emerald-100 text-xs font-semibold text-emerald-700">
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
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-70"
			/>

			<Frame className="py-16 sm:py-24">
				<div className="flex flex-col items-center text-center max-w-3xl mx-auto">
					<span className="font-semibold font-mono text-xs text-neutral-400 uppercase tracking-widest">
						CORE CAPABILITIES
					</span>
					<h2 className="mt-3 font-bold font-satoshi text-3xl sm:text-4xl lg:text-[42px] text-neutral-900 tracking-tight leading-[1.1]">
						Built for Shopify store owners who demand true ROAS
					</h2>
				</div>

				<div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
					{(product?.features ?? []).map((feat) => (
						<div
							key={feat.title}
							className="rounded-3xl border border-neutral-200/80 bg-white/90 p-7 shadow-xs backdrop-blur-xs flex flex-col justify-between transition-colors hover:border-neutral-300"
						>
							<div>
								<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-neutral-50 px-2.5 py-0.5 font-medium font-mono text-[11px] text-neutral-600">
									{feat.metric}
								</span>
								<h3 className="mt-4 font-bold font-satoshi text-lg text-neutral-900 leading-snug">
									{feat.title}
								</h3>
								<p className="mt-2.5 text-neutral-500 text-xs sm:text-sm leading-relaxed">
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

export default function TrackproofProductPage() {
	if (!product) return null;

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
