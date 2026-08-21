"use client";

import { ButtonLink } from "@edgecoms/ui/components/button";
import { Globe } from "@edgecoms/ui/components/globe";
import { BookOpen, CheckCircle2, Heart, Sparkles, Users } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MigrationGrid } from "@/components/home/migration-grid";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { PartnersHero } from "@/components/partners/partners-hero";
import { Reveal } from "@/components/ui/reveal";
import { PARTNER_PROGRAM_STATS } from "@/lib/marketing-stats";

/** Commission is 20% of net in every row: the arithmetic on screen has to hold. */
const LIVE_CHARGES = [
	{ app: "Edge Cart", commission: "$5.80", flag: "🇳🇱", net: "$29.00" },
	{ app: "Edge Bundles", commission: "$3.80", flag: "🇿🇦", net: "$19.00" },
	{ app: "Edge Reviews", commission: "$7.80", flag: "🇮🇱", net: "$39.00" },
] as const;

const RECURRING_MERCHANTS = [
	{ domain: "northwind.myshopify.com", initial: "N", share: "$146.20" },
	{ domain: "kestrelgoods.myshopify.com", initial: "K", share: "$118.40" },
	{ domain: "maelo.myshopify.com", initial: "M", share: "$63.40" },
] as const;

const LEDGER_ROWS = [
	{
		app: "Edge Cart",
		commission: "$78.00",
		rate: "20%",
		transaction: "txn_8841",
	},
	{
		app: "Edge Reviews",
		commission: "$50.00",
		rate: "20%",
		transaction: "txn_8846",
	},
	{
		app: "Edge Bundles",
		commission: "$18.20",
		rate: "20%",
		transaction: "txn_8903",
	},
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
			<Reveal>
				<MigrationGrid />
			</Reveal>

			{/* SECTION 3: REVENUE ON AUTOPILOT 3-FEATURE CARDS */}
			<Reveal>
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
											Boost sign-ups with rewards and discounts for your
											partners and the customers they refer respectively.
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
			</Reveal>

			{/* SECTION 4: TESTIMONIAL QUOTE */}
			<Reveal>
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
								product-led growth, I cannot recommend building a partner
								program with Edge enough.&rdquo;
							</p>

							<div className="mt-6 flex flex-col items-center gap-1">
								<span className="font-medium text-neutral-900 text-xs sm:text-sm">
									Marcus Bell
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
			</Reveal>

			{/* SECTION 5: HOW PARTNERS GET PAID 3-FEATURE CARDS */}
			<Reveal>
				<section className="relative w-full">
					<Frame className="bg-white pt-16 pb-0 sm:pt-20">
						<div className="flex flex-col items-center text-center">
							<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
								How partners get paid
							</h2>
							<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
								No referral links to share, no invoices to chase. Register the
								stores you already manage and take a share of what they spend on
								Edge, every month.
							</p>

							{/* 3-Column Grid */}
							<div className="mt-12 grid w-full grid-cols-1 divide-y border-neutral-200 border-t md:grid-cols-3 md:divide-x md:divide-y-0">
								{/* Card 1: Recurring commission */}
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
																Net revenue
															</span>
															<span className="font-bold text-[11px] text-neutral-900 leading-tight">
																US$1,640
															</span>
														</div>
													</div>
													<div className="flex items-center gap-2 pl-2">
														<div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 font-semibold text-[11px] text-neutral-700">
															%
														</div>
														<div className="flex flex-col">
															<span className="text-[9px] text-neutral-400">
																Your share
															</span>
															<span className="font-bold text-[11px] text-neutral-900 leading-tight">
																US$328
															</span>
														</div>
													</div>
												</div>
											</div>

											{/* Dark Floating Payout Badge */}
											<div className="z-10 -mt-2.5 mb-1 flex items-center gap-1.5 rounded-full bg-neutral-900 px-3.5 py-1 text-white shadow-md">
												<span className="flex size-4 items-center justify-center rounded-full bg-white/20 text-[9px]">
													&#8635;
												</span>
												<span className="font-medium text-xs">
													March payout US$328.00
												</span>
											</div>

											{/* Per-merchant Rows Container */}
											<div className="-mt-1.5 w-full max-w-[240px] space-y-1.5 rounded-xl border border-neutral-200/80 bg-white/90 p-2 shadow-2xs backdrop-blur-xs">
												{RECURRING_MERCHANTS.map((merchant) => (
													<div
														className="flex items-center justify-between px-1.5"
														key={merchant.domain}
													>
														<div className="flex min-w-0 items-center gap-2">
															<span className="flex size-4.5 shrink-0 items-center justify-center rounded-md bg-neutral-900 font-semibold text-[8px] text-white">
																{merchant.initial}
															</span>
															<span className="truncate font-medium text-[10px] text-neutral-700">
																{merchant.domain}
															</span>
														</div>
														<span className="font-mono text-[9px] text-neutral-400">
															{merchant.share}
														</span>
													</div>
												))}
											</div>
										</div>

										<h3 className="mt-6 font-medium font-satoshi text-lg text-neutral-900">
											Recurring for the life of the store
										</h3>
										<p className="mt-2.5 text-neutral-600 text-xs leading-relaxed">
											You earn a percentage of the net subscription revenue each
											merchant generates, paid again every month for as long as
											they stay on Edge. No expiry, no clawback window.
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

								{/* Card 2: Register the stores you manage */}
								<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
									<div>
										{/* Visual Graphic 2 */}
										<div className="relative flex h-60 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-b from-neutral-50 to-neutral-100/40 p-4">
											{/* Domain Claim Field */}
											<div className="flex w-full max-w-[240px] items-center gap-2 rounded-xl border border-neutral-200/90 bg-white p-2.5 shadow-2xs">
												<span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-900 font-semibold text-[10px] text-white">
													N
												</span>
												<span className="truncate font-mono text-[10px] text-neutral-700">
													northwind.myshopify.com
												</span>
											</div>

											{/* Vertical Connector Line */}
											<div className="h-4 w-px bg-neutral-300" />

											{/* Approval Card */}
											<div className="flex w-full max-w-[240px] flex-col gap-2 rounded-xl border border-neutral-200/90 bg-white p-3 shadow-2xs">
												<div className="flex items-center justify-between">
													<span className="font-semibold text-[11px] text-neutral-900">
														Northwind Supply
													</span>
													<span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 font-medium text-[9px] text-emerald-700">
														<CheckCircle2 className="size-2.5" />
														Approved
													</span>
												</div>
												<div className="space-y-1 rounded-lg border border-neutral-100 bg-neutral-50/80 p-2 text-[10px]">
													<div className="flex items-center justify-between text-neutral-500">
														<span>Your rate</span>
														<span className="font-medium text-neutral-800">
															20%
														</span>
													</div>
													<div className="flex items-center justify-between text-neutral-500">
														<span>Earning apps</span>
														<span className="font-medium text-neutral-800">
															Edge Cart, Edge Reviews
														</span>
													</div>
												</div>
											</div>
										</div>

										<h3 className="mt-6 font-medium font-satoshi text-lg text-neutral-900">
											Register the stores you manage
										</h3>
										<p className="mt-2.5 text-neutral-600 text-xs leading-relaxed">
											Add a store by its myshopify.com domain. Once we approve
											it, every Edge app it starts paying for earns you
											commission. No link for a merchant to forget to click.
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

								{/* Card 3: Auditable earnings ledger */}
								<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
									<div>
										{/* Visual Graphic 3 */}
										<div className="relative flex h-60 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-b from-neutral-50 to-neutral-100/40 p-4">
											{/* Ledger Card */}
											<div className="flex w-full max-w-[240px] flex-col gap-2.5 rounded-2xl border border-neutral-200/90 bg-white p-3.5 shadow-2xs">
												<div className="flex items-center justify-between">
													<span className="font-semibold text-neutral-900 text-xs">
														Mar 1 to Mar 31
													</span>
													<span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-medium text-[9px] text-neutral-600">
														Locked
													</span>
												</div>

												<div className="space-y-1.5 rounded-xl border border-neutral-100 bg-neutral-50/80 p-2.5 text-[10px]">
													{LEDGER_ROWS.map((row) => (
														<div
															className="flex items-center justify-between text-neutral-500"
															key={row.transaction}
														>
															<span className="truncate">{row.app}</span>
															<span className="flex shrink-0 items-center gap-1.5">
																<span className="font-mono text-[9px] text-neutral-400">
																	{row.transaction} &middot; {row.rate}
																</span>
																<span className="font-medium text-neutral-800">
																	{row.commission}
																</span>
															</span>
														</div>
													))}
													<div className="flex items-center justify-between border-neutral-200/60 border-t pt-1.5 text-neutral-500">
														<span>Payable</span>
														<span className="font-bold text-neutral-900 text-xs">
															$328.00
														</span>
													</div>
												</div>
											</div>
										</div>

										<h3 className="mt-6 font-medium font-satoshi text-lg text-neutral-900">
											Every cent traceable
										</h3>
										<p className="mt-2.5 text-neutral-600 text-xs leading-relaxed">
											Each line ties to one Shopify charge at the rate that was
											in force when you earned it. Renegotiating your rate
											applies going forward and never rewrites what you are
											already owed.
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
			</Reveal>

			{/* SECTION 6: GLOBE SECTION & LIVE CHARGE POPUPS */}
			<Reveal>
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

								{/* Live Charge Popups Stack on right side of Globe */}
								<div className="pointer-events-none absolute top-8 right-2 z-10 flex flex-col gap-2.5 sm:right-10">
									{LIVE_CHARGES.map((charge, idx) => (
										<div
											className="flex w-[200px] flex-col gap-1.5 rounded-xl border border-neutral-200/80 bg-white/95 p-3 text-left shadow-md backdrop-blur-xs transition-all hover:scale-102 sm:w-[220px]"
											key={charge.flag}
											style={{ opacity: 1 - idx * 0.12 }}
										>
											<div className="flex items-center gap-1.5 font-medium text-neutral-800 text-xs">
												<span className="text-sm">{charge.flag}</span>
												<span className="font-semibold text-[11px] text-neutral-900">
													{charge.app} renewed
												</span>
											</div>
											<div className="grid grid-cols-2 border-neutral-100 border-t pt-1 text-[10px]">
												<div className="flex flex-col">
													<span className="text-[9px] text-neutral-400">
														Net to Edge
													</span>
													<span className="font-semibold text-neutral-900">
														{charge.net}
													</span>
												</div>
												<div className="flex flex-col">
													<span className="text-[9px] text-neutral-400">
														Your 20%
													</span>
													<span className="font-semibold text-purple-600">
														{charge.commission}
													</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							<h2 className="mt-8 font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
								Paid from Shopify&apos;s own billing data
							</h2>

							<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
								There is nothing for us to track. Every commission is generated
								from a charge Shopify has already recorded against your
								merchant: once per transaction, in whole cents,{" "}
								<em>never recalculated</em>.
							</p>

							{/* 3 Big Stat Numbers */}
							<div className="mt-12 grid w-full grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
								{PARTNER_PROGRAM_STATS.map((stat) => (
									<div className="flex flex-col items-center" key={stat.label}>
										<span className="font-bold font-satoshi text-4xl text-purple-600 sm:text-5xl">
											{stat.value}
										</span>
										<span className="mt-2 font-medium text-purple-600/90 text-xs">
											{stat.label}
										</span>
									</div>
								))}
							</div>
						</div>
					</Frame>
				</section>
			</Reveal>

			{/* SECTION 7: REWARD VIRAL CONTENT (Matching Target Reference Screenshot) */}
			<Reveal>
				<section className="relative w-full">
					<Frame className="border-neutral-200 border-b bg-white pt-16 pb-0 sm:pt-20">
						<div className="flex flex-col items-center text-center">
							<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
								Reward viral content
							</h2>
							<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
								Reward partners for creating viral content, with support for
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
			</Reveal>

			{/* SECTION 8: LOVED BY MODERN COMPANIES SUCCESS STORY */}
			<Reveal>
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
			</Reveal>

			{/* SECTION 9: CLOSING CTA (Same as Homepage) */}
			<Reveal>
				<CtaDark />
			</Reveal>
		</main>
	);
}
