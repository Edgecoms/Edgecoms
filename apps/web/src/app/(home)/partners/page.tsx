"use client";

import { ButtonLink } from "@edgecoms/ui/components/button";
import { Globe } from "@edgecoms/ui/components/globe";
import {
	ArrowUpRight,
	BookOpen,
	CheckCircle2,
	Heart,
	Layers,
	Layout,
	Sparkles,
	Users,
} from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MigrationGrid } from "@/components/home/migration-grid";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { PartnersHero } from "@/components/partners/partners-hero";

const LIVE_SALES = [
	{ commission: "$0.05", flag: "🇳🇱", revenue: "$0.17" },
	{ commission: "$0.03", flag: "🇿🇦", revenue: "$0.09" },
	{ commission: "$0.04", flag: "🇮🇱", revenue: "$0.11" },
] as const;

const SUCCESS_STORIES = [
	{
		badge: "Supplements",
		banner: "/case-studies/aurient-banner.png",
		brand: "Aurient",
		headline:
			"How Aurient manages $900K+ in monthly affiliate payouts with Edge",
		href: "/case-studies/aurient",
		logoText: "Aurient",
		slug: "aurient",
	},
	{
		badge: "Beauty",
		banner: "/case-studies/vyssence-banner.png",
		brand: "Vyssence",
		headline:
			"How Vyssence migrated from Rewardful and increased affiliate revenue by 318%",
		href: "/case-studies/vyssence",
		logoText: "Vyssence",
		slug: "vyssence",
	},
	{
		badge: "Home",
		banner: "/case-studies/klyrolight-banner.png",
		brand: "Klyro Light",
		headline:
			"Klyro Light increased affiliate revenue by 38% by switching to Edge",
		href: "/case-studies/klyrolight",
		logoText: "Klyro Light",
		slug: "klyrolight",
	},
] as const;

export default function PartnersPage() {
	const [activeStoryIndex, setActiveStoryIndex] = useState(0);
	const activeStory = SUCCESS_STORIES[activeStoryIndex];

	return (
		<main className="flex w-full flex-col overflow-x-clip bg-white">
			{/* SECTION 1: HERO HEADER & FLOATING AFFILIATE CARDS GRID */}
			<PartnersHero />

			{/* SECTION 2: 4-COLUMN MIGRATION TABS & LOGOS */}
			<MigrationGrid />

			{/* SECTION 3: REVENUE ON AUTOPILOT 3-FEATURE CARDS */}
			<section className="relative w-full bg-white">
				<Frame className="border-neutral-200 border-b pt-16 pb-0 sm:pt-20">
					<div className="flex flex-col items-center text-center">
						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Revenue on autopilot
						</h2>
						<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							Build scalable referral and affiliate programs to rise above the
							competition and become a category leader.
						</p>

						{/* 3-Column Grid */}
						<div className="mt-12 grid w-full grid-cols-1 divide-y border-neutral-200 border-t md:grid-cols-3 md:divide-x md:divide-y-0">
							{/* Card 1: Flexible reward structure */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									<div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4">
										<div className="flex w-full flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
											<div className="flex items-center justify-between text-[11px]">
												<span className="font-medium text-neutral-600">
													Rev-share reward
												</span>
												<span className="font-bold font-mono text-purple-600">
													30%
												</span>
											</div>
											<div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
												<div className="h-full w-4/5 rounded-full bg-purple-600" />
											</div>
											<span className="text-[10px] text-neutral-400">
												Earn 30% for each sale for customer&apos;s lifetime
											</span>
										</div>
									</div>

									<h3 className="mt-6 font-medium font-satoshi text-lg text-neutral-900">
										Flexible reward structure
									</h3>
									<p className="mt-2.5 text-neutral-600 text-xs leading-relaxed">
										Create advanced pay-per-click/lead and rev-share reward
										structures to drive partner engagement and revenue.
									</p>
								</div>

								<div className="mt-6">
									<Link
										className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1 font-medium text-neutral-700 text-xs shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
										href={"/register" as Route}
									>
										Learn more
									</Link>
								</div>
							</div>

							{/* Card 2: Dual-sided incentives */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									<div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4">
										<div className="flex w-full flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
											<div className="flex items-center gap-2">
												<Sparkles className="size-4 text-orange-500" />
												<span className="font-medium text-neutral-900 text-xs">
													Discount Code: EDGE30
												</span>
											</div>
											<p className="text-[10px] text-neutral-500">
												Give referred customers 30% off their first purchase.
											</p>
										</div>
									</div>

									<h3 className="mt-6 font-medium font-satoshi text-lg text-neutral-900">
										Dual-sided incentives
									</h3>
									<p className="mt-2.5 text-neutral-600 text-xs leading-relaxed">
										Boost sign-ups with rewards and discounts for your partners
										and the customers they refer respectively.
									</p>
								</div>

								<div className="mt-6">
									<Link
										className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1 font-medium text-neutral-700 text-xs shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
										href={"/register" as Route}
									>
										Learn more
									</Link>
								</div>
							</div>

							{/* Card 3: Partner referral rewards */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									<div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4">
										<div className="flex items-center gap-3">
											<div className="flex size-12 items-center justify-center rounded-full border border-purple-200 bg-purple-100 text-purple-700 shadow-xs">
												<Users className="size-6" />
											</div>
											<div className="flex flex-col">
												<span className="font-medium text-neutral-900 text-xs">
													Sub-partner network
												</span>
												<span className="text-[10px] text-purple-600">
													Tiered referral commission
												</span>
											</div>
										</div>
									</div>

									<h3 className="mt-6 font-medium font-satoshi text-lg text-neutral-900">
										Partner referral rewards
									</h3>
									<p className="mt-2.5 text-neutral-600 text-xs leading-relaxed">
										Reward partners for referring other partners to join your
										program on Edge (flat-rate or rev-share).
									</p>
								</div>

								<div className="mt-6">
									<Link
										className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1 font-medium text-neutral-700 text-xs shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
										href={"/register" as Route}
									>
										Learn more
									</Link>
								</div>
							</div>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 4: TESTIMONIAL QUOTE */}
			<section className="relative w-full">
				<Frame className="border-neutral-200 border-b bg-white py-16 sm:py-20">
					<div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
						<div className="flex items-center justify-center">
							<Image
								alt="Aurient"
								className="h-6 w-auto object-contain"
								height={32}
								src="/case-studies/aurient-logo.png"
								width={120}
							/>
						</div>

						<p className="mt-6 max-w-xl font-normal font-satoshi text-lg text-neutral-800 leading-relaxed sm:text-xl md:text-[22px] md:leading-[1.4]">
							&ldquo;Edge is the ultimate partner infrastructure for every
							startup. If you&apos;re looking to 10x your community /
							product-led growth &ndash; I cannot recommend building a partner
							program with Edge enough.&rdquo;
						</p>

						<div className="mt-6 flex flex-col items-center gap-1">
							<Image
								alt="Marcus Vance"
								className="size-11 rounded-full object-cover shadow-2xs ring-1 ring-neutral-900/10"
								height={44}
								src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
								unoptimized
								width={44}
							/>
							<span className="mt-1.5 font-medium text-neutral-900 text-xs sm:text-sm">
								Marcus Vance
							</span>
							<span className="font-normal text-[11px] text-neutral-500">
								Founder, Aurient
							</span>
						</div>

						<Link
							className="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1 font-medium text-blue-600 text-xs shadow-2xs transition-colors hover:border-neutral-300 hover:bg-neutral-50"
							href={"/case-studies/aurient" as Route}
						>
							<BookOpen className="size-3.5 text-blue-600" />
							Read the story
						</Link>
					</div>
				</Frame>
			</section>

			{/* SECTION 5: EFFORTLESS PAYOUTS 3-FEATURE CARDS */}
			<section className="relative w-full">
				<Frame className="bg-white pt-16 pb-0 sm:pt-20">
					<div className="flex flex-col items-center text-center">
						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Effortless payouts
						</h2>
						<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							Our streamlined payouts free up your time, so you can focus on
							growing your business and doing what you do best.
						</p>

						{/* 3-Column Grid */}
						<div className="mt-12 grid w-full grid-cols-1 divide-y border-neutral-200 border-t md:grid-cols-3 md:divide-x md:divide-y-0">
							{/* Card 1: 1-click global payouts */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									{/* Visual Graphic 1 */}
									<div className="relative flex h-60 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-b from-neutral-50 to-neutral-100/40 p-4">
										{/* Top Metrics Header Box */}
										<div className="w-full max-w-[240px] rounded-xl border border-neutral-200/90 bg-white p-2.5 shadow-2xs">
											<div className="grid grid-cols-2 divide-x divide-neutral-100">
												<div className="flex items-center gap-2 pr-2">
													<div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 font-semibold text-[11px] text-neutral-700">
														$
													</div>
													<div className="flex flex-col">
														<span className="text-[9px] text-neutral-400">
															Revenue
														</span>
														<span className="font-bold text-[11px] text-neutral-900 leading-tight">
															US$1.6k
														</span>
													</div>
												</div>
												<div className="flex items-center gap-2 pl-2">
													<div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-[11px] text-neutral-700">
														💳
													</div>
													<div className="flex flex-col">
														<span className="text-[9px] text-neutral-400">
															Payouts
														</span>
														<span className="font-bold text-[11px] text-neutral-900 leading-tight">
															US$195
														</span>
													</div>
												</div>
											</div>
										</div>

										{/* Dark Floating Payout Badge */}
										<div className="z-10 -mt-2.5 mb-1 flex items-center gap-1.5 rounded-full bg-neutral-900 px-3.5 py-1 text-white shadow-md">
											<span className="flex size-4 items-center justify-center rounded-full bg-white/20 text-[9px]">
												↻
											</span>
											<span className="font-medium text-xs">
												Payout US$84.00
											</span>
										</div>

										{/* Partner Rows Container */}
										<div className="-mt-1.5 w-full max-w-[240px] space-y-1.5 rounded-xl border border-neutral-200/80 bg-white/90 p-2 shadow-2xs backdrop-blur-xs">
											<div className="flex items-center justify-between px-1.5">
												<div className="flex min-w-0 items-center gap-2">
													<Image
														alt="Lucia"
														className="size-4.5 shrink-0 rounded-full object-cover"
														height={18}
														src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
														unoptimized
														width={18}
													/>
													<span className="truncate font-medium text-[10px] text-neutral-700">
														Lucia Gonzalez
													</span>
												</div>
												<span className="font-mono text-[9px] text-neutral-400">
													$0.10
												</span>
											</div>
											<div className="flex items-center justify-between px-1.5">
												<div className="flex min-w-0 items-center gap-2">
													<Image
														alt="Samantha"
														className="size-4.5 shrink-0 rounded-full object-cover"
														height={18}
														src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
														unoptimized
														width={18}
													/>
													<span className="truncate font-medium text-[10px] text-neutral-700">
														Samantha Johns
													</span>
												</div>
												<span className="font-mono text-[9px] text-neutral-400">
													$1.13
												</span>
											</div>
											<div className="flex items-center justify-between px-1.5 opacity-60">
												<div className="flex min-w-0 items-center gap-2">
													<Image
														alt="Derek"
														className="size-4.5 shrink-0 rounded-full object-cover"
														height={18}
														src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
														unoptimized
														width={18}
													/>
													<span className="truncate font-medium text-[10px] text-neutral-700">
														Derek Forbes
													</span>
												</div>
												<span className="font-mono text-[9px] text-neutral-400">
													$0.15
												</span>
											</div>
										</div>
									</div>

									<h3 className="mt-6 font-medium font-satoshi text-lg text-neutral-900">
										1-click global payouts
									</h3>
									<p className="mt-2.5 text-neutral-600 text-xs leading-relaxed">
										Save upwards of 40 hours/month with our powerful global
										payouts platform – no more manual spreadsheets/invoices.
									</p>
								</div>

								<div className="mt-6">
									<Link
										className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1 font-medium text-neutral-700 text-xs shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
										href={"/register" as Route}
									>
										Learn more
									</Link>
								</div>
							</div>

							{/* Card 2: Tax compliance */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									{/* Visual Graphic 2 */}
									<div className="relative flex h-60 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-b from-neutral-50 to-neutral-100/40 p-4">
										{/* Top Avatars Row */}
										<div className="flex items-center gap-3">
											{/* Ghost Avatar Left */}
											<div className="flex size-9 items-center justify-center rounded-xl border border-neutral-200/60 bg-white/60 opacity-40 shadow-2xs">
												<Users className="size-4 text-neutral-400" />
											</div>

											{/* Center Featured Partner Avatar */}
											<div className="relative">
												<Image
													alt="Verified Partner"
													className="size-11 rounded-xl border-2 border-white object-cover shadow-sm ring-1 ring-neutral-200"
													height={44}
													src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
													unoptimized
													width={44}
												/>
												<span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 font-bold text-[9px] text-white ring-2 ring-white">
													✓
												</span>
											</div>

											{/* Ghost Avatar Right */}
											<div className="flex size-9 items-center justify-center rounded-xl border border-neutral-200/60 bg-white/60 opacity-40 shadow-2xs">
												<Users className="size-4 text-neutral-400" />
											</div>
										</div>

										{/* Vertical Connector Line */}
										<div className="my-1 h-4 w-px bg-neutral-300" />

										{/* Tax Document Box */}
										<div className="flex w-full max-w-[170px] flex-col items-center gap-1.5 rounded-xl border border-neutral-200/90 bg-white p-3 text-center shadow-2xs">
											<div className="flex items-center gap-1 font-bold font-serif text-[11px] text-neutral-900 tracking-wider">
												🏛️ IRS
											</div>
											<span className="font-medium text-[10px] text-neutral-500">
												1099-NEC
											</span>
											<div className="my-0.5 w-full space-y-1 px-2">
												<div className="h-1 w-full rounded-full bg-neutral-100" />
												<div className="mx-auto h-1 w-3/4 rounded-full bg-neutral-100" />
											</div>
											<span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 font-medium text-[9px] text-emerald-700">
												<span className="size-1.5 rounded-full bg-emerald-500" />
												Completed
											</span>
										</div>
									</div>

									<h3 className="mt-6 font-medium font-satoshi text-lg text-neutral-900">
										Tax compliance
									</h3>
									<p className="mt-2.5 text-neutral-600 text-xs leading-relaxed">
										We automatically handle tax compliance for you – no need to
										worry about sending W-9, 1099, W-8 forms.
									</p>
								</div>

								<div className="mt-6">
									<Link
										className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1 font-medium text-neutral-700 text-xs shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
										href={"/register" as Route}
									>
										Learn more
									</Link>
								</div>
							</div>

							{/* Card 3: Built-in invoicing */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									{/* Visual Graphic 3 */}
									<div className="relative flex h-60 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-b from-neutral-50 to-neutral-100/40 p-4">
										{/* Invoice Modal Box */}
										<div className="flex w-full max-w-[240px] flex-col gap-2.5 rounded-2xl border border-neutral-200/90 bg-white p-3.5 shadow-2xs">
											{/* Top Header */}
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Image
														alt="Derek Forbes"
														className="size-7 rounded-full object-cover"
														height={28}
														src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
														unoptimized
														width={28}
													/>
													<span className="font-semibold text-neutral-900 text-xs">
														Derek Forbes
													</span>
												</div>
												<span className="rounded-full border border-amber-200/60 bg-amber-50 px-2 py-0.5 font-medium text-[9px] text-amber-700">
													Pending
												</span>
											</div>

											{/* Invoice Details Box */}
											<div className="space-y-1 rounded-xl border border-neutral-100 bg-neutral-50/80 p-2.5 text-[10px]">
												<div className="flex items-center justify-between text-neutral-500">
													<span>Period</span>
													<span className="font-medium text-neutral-800">
														Mar 1 &ndash; Mar 31
													</span>
												</div>
												<div className="flex items-center justify-between text-neutral-500">
													<span>Invoice</span>
													<span className="font-medium text-neutral-800">
														#EDGE-0001
													</span>
												</div>
												<div className="flex items-center justify-between text-neutral-500">
													<span>Sales</span>
													<span className="font-medium text-neutral-800">
														12
													</span>
												</div>
												<div className="flex items-center justify-between border-neutral-200/60 border-t pt-1 text-neutral-500">
													<span>Amount</span>
													<span className="font-bold text-neutral-900 text-xs">
														$1,538.50
													</span>
												</div>
											</div>

											{/* Action Button */}
											<div className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-neutral-900 py-1.5 font-medium text-white text-xs shadow-2xs">
												<CheckCircle2 className="size-3.5 text-white" />
												Confirm payout
											</div>
										</div>
									</div>

									<h3 className="mt-6 font-medium font-satoshi text-lg text-neutral-900">
										Built-in invoicing
									</h3>
									<p className="mt-2.5 text-neutral-600 text-xs leading-relaxed">
										Streamline your accounting and improve partner satisfaction
										with built-in invoices for each payout.
									</p>
								</div>

								<div className="mt-6">
									<Link
										className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 py-1 font-medium text-neutral-700 text-xs shadow-2xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
										href={"/register" as Route}
									>
										Learn more
									</Link>
								</div>
							</div>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 6: GLOBE SECTION & LIVE REFERRAL POPUPS (Matching Screenshot 1) */}
			<section className="relative w-full overflow-hidden border-neutral-200 border-y bg-neutral-50/70">
				<Frame className="py-16 sm:py-24">
					<div className="flex flex-col items-center text-center">
						{/* 3D WebGL Globe Visual with Live Conversion Popups */}
						<div className="relative flex h-[240px] w-full max-w-2xl items-center justify-center overflow-hidden sm:h-[270px]">
							{/* 3D Globe Canvas with Bottom Gradient Fade Mask */}
							<div
								className="pointer-events-auto absolute top-0 flex size-[500px] cursor-grab items-center justify-center opacity-95 active:cursor-grabbing sm:size-[580px]"
								style={{
									maskImage:
										"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0) 45%)",
									WebkitMaskImage:
										"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0) 45%)",
								}}
							>
								<Globe
									className="size-full"
									config={{
										baseColor: [0.98, 0.98, 0.99],
										dark: 0,
										devicePixelRatio: 2,
										diffuse: 0.6,
										glowColor: [0.96, 0.94, 1],
										height: 1150,
										mapBrightness: 1.5,
										mapSamples: 24_000,
										markerColor: [147 / 255, 51 / 255, 234 / 255],
										markers: [
											{ location: [52.3676, 4.9041], size: 0.08 },
											{ location: [-26.2041, 28.0473], size: 0.08 },
											{ location: [31.0461, 34.8516], size: 0.08 },
											{ location: [40.7128, -74.006], size: 0.08 },
											{ location: [51.5074, -0.1278], size: 0.08 },
											{ location: [35.6762, 139.6503], size: 0.08 },
										],
										phi: 0.4,
										theta: 0.2,
										width: 1150,
									}}
								/>
							</div>

							{/* Live Referral Popups Stack on right side of Globe */}
							<div className="pointer-events-none absolute top-8 right-2 z-10 flex flex-col gap-2.5 sm:right-10">
								{LIVE_SALES.map((sale, idx) => (
									<div
										className="flex w-[200px] flex-col gap-1.5 rounded-xl border border-neutral-200/80 bg-white/95 p-3 text-left shadow-md backdrop-blur-xs transition-all hover:scale-102 sm:w-[220px]"
										key={sale.flag}
										style={{ opacity: 1 - idx * 0.12 }}
									>
										<div className="flex items-center gap-1.5 font-medium text-neutral-800 text-xs">
											<span className="text-sm">{sale.flag}</span>
											<span className="font-semibold text-[11px] text-neutral-900">
												New referral sale
											</span>
										</div>
										<div className="grid grid-cols-2 border-neutral-100 border-t pt-1 text-[10px]">
											<div className="flex flex-col">
												<span className="text-[9px] text-neutral-400">
													Revenue
												</span>
												<span className="font-semibold text-neutral-900">
													{sale.revenue}
												</span>
											</div>
											<div className="flex flex-col">
												<span className="text-[9px] text-neutral-400">
													Commission
												</span>
												<span className="font-semibold text-purple-600">
													{sale.commission}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						<h2 className="mt-8 font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Battle-tested tracking and payouts infrastructure
						</h2>

						<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							We currently track 1.5M+ million conversion events and send over
							$2 million in partner payouts &ndash; <em>every single month</em>.
						</p>

						{/* 3 Big Stat Numbers (No border boxes, matching Image 1) */}
						<div className="mt-12 grid w-full grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
							<div className="flex flex-col items-center">
								<span className="font-bold font-satoshi text-4xl text-purple-600 sm:text-5xl">
									$33M+
								</span>
								<span className="mt-2 font-medium text-purple-600/90 text-xs">
									commissions earned by partners
								</span>
							</div>

							<div className="flex flex-col items-center">
								<span className="font-bold font-satoshi text-4xl text-purple-600 sm:text-5xl">
									$168M+
								</span>
								<span className="mt-2 font-medium text-purple-600/90 text-xs">
									revenue driven by partners
								</span>
							</div>

							<div className="flex flex-col items-center">
								<span className="font-bold font-satoshi text-4xl text-purple-600 sm:text-5xl">
									7,000+
								</span>
								<span className="mt-2 font-medium text-purple-600/90 text-xs">
									active partners in our network
								</span>
							</div>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 7: REWARD VIRAL CONTENT (Matching Target Reference Screenshot) */}
			<section className="relative w-full">
				<Frame className="border-neutral-200 border-b bg-white pt-16 pb-0 sm:pt-20">
					<div className="flex flex-col items-center text-center">
						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Reward viral content
						</h2>
						<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							Reward partners for creating viral content – with support for
							variable bonuses and earnings limits. Perfect for influencer/UGC
							campaigns.
						</p>

						<ButtonLink
							className="mt-5 h-8 rounded-lg border border-neutral-200 bg-white px-4 font-medium text-neutral-800 text-xs shadow-2xs transition-colors hover:bg-neutral-50"
							href={"/register" as Route}
							size="sm"
							variant="secondary"
						>
							Learn more about bounties
						</ButtonLink>

						{/* 2-Column Grid matching Section 3/5 border grid design */}
						<div className="mt-12 grid w-full grid-cols-1 divide-y border-neutral-200 border-t md:grid-cols-2 md:divide-x md:divide-y-0">
							{/* Card 1: 3D Heart YouTube Bounty (Left Column) */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									{/* Soft Green Preview Box */}
									<div className="relative flex h-56 w-full flex-col items-center justify-center rounded-2xl border border-emerald-100/60 bg-[#F0FDF4] p-4">
										{/* Top Status Badge */}
										<div className="absolute top-4 flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-100/90 px-3 py-1 font-semibold text-[11px] text-emerald-800 shadow-2xs">
											<span className="flex size-3.5 items-center justify-center rounded-full bg-emerald-600 font-bold text-[8px] text-white">
												✓
											</span>
											<span>Reward earned</span>
										</div>

										{/* Glossy 3D Heart */}
										<div className="mt-4 flex items-center justify-center">
											<Heart className="size-16 fill-red-500 text-red-500 drop-shadow-md" />
										</div>
									</div>

									{/* Content Below Graphic */}
									<h3 className="mt-5 font-bold font-satoshi text-base text-neutral-900">
										Get rewarded for YouTube views about Edge
									</h3>
									<div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
										<div className="h-full w-full rounded-full bg-emerald-500" />
									</div>
									<div className="mt-2 font-bold text-neutral-900 text-xs">
										10,000{" "}
										<span className="font-normal text-neutral-500">
											of 10,000 views
										</span>
									</div>
								</div>
							</div>

							{/* Card 2: Creator Video Review (Right Column) */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									{/* Video Thumbnail Graphic */}
									<div className="relative h-56 w-full overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-900">
										<Image
											alt="Video review creator"
											className="object-cover"
											fill
											src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&auto=format&fit=crop&q=80"
										/>
									</div>

									{/* Creator Row & Title Below Graphic */}
									<div className="mt-5 flex items-start gap-3 text-left">
										<Image
											alt="Evan Brooks"
											className="mt-0.5 size-9 shrink-0 rounded-full object-cover ring-1 ring-neutral-900/10"
											height={36}
											src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
											unoptimized
											width={36}
										/>
										<div className="flex flex-col">
											<h3 className="font-bold font-satoshi text-base text-neutral-900 leading-snug">
												The best product reviews of the week
											</h3>
											<div className="mt-1 flex items-center gap-1 font-medium text-neutral-700 text-xs">
												<span>Evan Brooks</span>
												<span className="flex size-3.5 items-center justify-center rounded-full bg-neutral-200 font-bold text-[9px] text-neutral-700">
													✓
												</span>
											</div>
											<span className="mt-0.5 text-[11px] text-neutral-500">
												11,000 views &bull; 6 hours ago
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 8: SEAMLESS INTEGRATION 3-FEATURE CARDS (Matching Screenshot 3) */}
			<section className="relative w-full">
				<Frame className="bg-white pt-16 pb-0 sm:pt-20">
					<div className="flex flex-col items-center text-center">
						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Seamless integration
						</h2>
						<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							Drive partner signups with branded landing pages and embedded
							referral dashboards within your app.
						</p>

						{/* 3-Column Grid */}
						<div className="mt-12 grid w-full grid-cols-1 divide-y border-neutral-200 border-t md:grid-cols-3 md:divide-x md:divide-y-0">
							{/* Card 1: AI landing page generator */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									<div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4">
										<div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
											<div className="flex items-center gap-2 font-medium text-neutral-800 text-xs">
												<Layout className="size-4 text-purple-600" />
												<span>AI Page Builder</span>
											</div>
											<span className="text-[10px] text-neutral-400">
												Auto-generate partner onboarding page
											</span>
										</div>
									</div>

									<h3 className="mt-6 font-medium font-satoshi text-lg text-neutral-900">
										AI landing page generator
									</h3>
									<p className="mt-2.5 text-neutral-600 text-xs leading-relaxed">
										Use AI to generate a compelling, branded landing page for
										your affiliate program to drive partner signups.
									</p>
								</div>

								<div className="mt-6">
									<Link
										className="inline-flex items-center gap-1 font-medium text-neutral-900 text-xs hover:underline"
										href={"/register" as Route}
									>
										Learn more <ArrowUpRight className="size-3.5" />
									</Link>
								</div>
							</div>

							{/* Card 2: Embedded referral dashboard */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									<div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4">
										<div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
											<div className="flex items-center gap-2 font-medium text-neutral-800 text-xs">
												<Layers className="size-4 text-blue-600" />
												<span>Embedded Widget</span>
											</div>
											<span className="text-[10px] text-neutral-400">
												Native referral portal in your app
											</span>
										</div>
									</div>

									<h3 className="mt-6 font-medium font-satoshi text-lg text-neutral-900">
										Embedded referral dashboard
									</h3>
									<p className="mt-2.5 text-neutral-600 text-xs leading-relaxed">
										Seamlessly onboard your users as referral partners directly
										inside your app – no external signup required.
									</p>
								</div>

								<div className="mt-6">
									<Link
										className="inline-flex items-center gap-1 font-medium text-neutral-900 text-xs hover:underline"
										href={"/register" as Route}
									>
										Learn more <ArrowUpRight className="size-3.5" />
									</Link>
								</div>
							</div>

							{/* Card 3: Get started in hours */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									<div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4">
										<div className="flex flex-col gap-1.5 text-[11px]">
											<div className="flex items-center gap-2 text-neutral-700">
												<CheckCircle2 className="size-3.5 text-emerald-500" />
												<span>Step 1: Create program</span>
											</div>
											<div className="flex items-center gap-2 text-neutral-700">
												<CheckCircle2 className="size-3.5 text-emerald-500" />
												<span>Step 2: Set up conversions</span>
											</div>
											<div className="flex items-center gap-2 text-neutral-700">
												<CheckCircle2 className="size-3.5 text-emerald-500" />
												<span>Step 3: Connect payouts</span>
											</div>
										</div>
									</div>

									<h3 className="mt-6 font-medium font-satoshi text-lg text-neutral-900">
										Get started in hours, not days
									</h3>
									<p className="mt-2.5 text-neutral-600 text-xs leading-relaxed">
										Our native integrations make it easy to get started. Most
										teams get up and running within hours, not days.
									</p>
								</div>

								<div className="mt-6">
									<Link
										className="inline-flex items-center gap-1 font-medium text-neutral-900 text-xs hover:underline"
										href={"/register" as Route}
									>
										Read quickstart guide <ArrowUpRight className="size-3.5" />
									</Link>
								</div>
							</div>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 9: LOVED BY MODERN COMPANIES SUCCESS STORY (Matching Screenshot 4 & Image 2) */}
			<section className="relative w-full overflow-hidden border-neutral-200 border-y bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
				<Frame className="bg-white py-16 sm:py-20">
					<div className="flex flex-col items-center text-center">
						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Loved by modern <br /> e-commerce companies
						</h2>
						<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							Trusted by leading Shopify brands to manage partner programs and
							generate millions in monthly revenue.
						</p>

						{/* Success Story Hero Card */}
						<div className="mt-10 w-full px-4 sm:px-8">
							<Link
								className="group relative flex min-h-[440px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-900 p-8 text-left shadow-xl transition-all duration-500 hover:shadow-2xl"
								href={activeStory.href as Route}
							>
								<Image
									alt={activeStory.brand}
									className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
									fill
									src={activeStory.banner}
								/>
								<div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[#0266FF] via-[#0266FF]/85 to-transparent" />

								{/* Top Badges */}
								<div className="relative flex items-center justify-between">
									<span className="font-bold text-lg text-white">
										❖ {activeStory.brand}
									</span>
									<span className="rounded-full border border-white/20 bg-white/20 px-3 py-1 font-medium text-white text-xs backdrop-blur-md">
										{activeStory.badge}
									</span>
								</div>

								{/* Bottom Content */}
								<div className="relative mt-auto pt-16">
									<h3 className="max-w-xl font-medium font-satoshi text-2xl text-white leading-snug sm:text-3xl">
										{activeStory.headline}
									</h3>
									<span className="mt-4 inline-flex items-center gap-1 font-medium text-white/90 text-xs hover:underline">
										Read success story →
									</span>
								</div>
							</Link>

							{/* Interactive Story Switcher Pills */}
							<div className="mt-6 flex items-center justify-center gap-3">
								{SUCCESS_STORIES.map((story, idx) => (
									<button
										className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium text-xs transition-colors ${
											activeStoryIndex === idx
												? "bg-neutral-900 text-white"
												: "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100"
										}`}
										key={story.slug}
										onClick={() => setActiveStoryIndex(idx)}
										type="button"
									>
										<span>❖ {story.brand}</span>
									</button>
								))}
							</div>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 10: CLOSING CTA (Same as Homepage) */}
			<CtaDark />
		</main>
	);
}
