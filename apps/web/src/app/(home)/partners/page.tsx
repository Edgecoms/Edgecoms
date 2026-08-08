"use client";

import { ButtonLink } from "@edgecoms/ui/components/button";
import {
	ArrowUpRight,
	CheckCircle2,
	Heart,
	Layers,
	Layout,
	Play,
	ShieldCheck,
	Sparkles,
	Users,
} from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame, PartnersIcon } from "@/components/landing/frame";
import { BOOKING_URL } from "@/lib/booking";

const HERO_COLUMNS = [
	// Column 1 (Leftmost)
	{
		colClass: "",
		cards: [
			{
				avatar:
					"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
				flag: "us",
				name: "Lauren Anderson",
				payouts: "$550",
				revenue: "$1.8K",
			},
			{
				avatar:
					"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
				flag: "de",
				name: "Elias Weber",
				payouts: "$235",
				revenue: "$783",
			},
			{
				avatar:
					"https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
				flag: "us",
				name: "Derek Forbes",
				payouts: "$450",
				revenue: "$1.5K",
			},
		],
	},
	// Column 2 (Middle Left)
	{
		colClass: "",
		cards: [
			{
				avatar:
					"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
				flag: "us",
				name: "Mia Taylor",
				payouts: "$6.8K",
				revenue: "$22.6K",
			},
			{
				avatar:
					"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
				flag: "us",
				name: "Liam Carter",
				payouts: "$9.2K",
				revenue: "$30K",
			},
			{
				avatar:
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
				flag: "ca",
				name: "Marvin Ta",
				payouts: "$5.4K",
				revenue: "$18.3K",
			},
		],
	},
	// Column 3 (Middle Right)
	{
		colClass: "",
		cards: [
			{
				avatar:
					"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
				flag: "ca",
				name: "Sophie Laurent",
				payouts: "$3.3K",
				revenue: "$11K",
			},
			{
				avatar:
					"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
				flag: "es",
				name: "Lucia Gonzalez",
				payouts: "$7.2K",
				revenue: "$24K",
			},
			{
				avatar:
					"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
				flag: "gb",
				name: "Oliver Hawthorne",
				payouts: "$255",
				revenue: "$850",
			},
		],
	},
	// Column 4 (Rightmost)
	{
		colClass: "",
		cards: [
			{
				avatar:
					"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
				flag: "jp",
				name: "Hiroshi Tanaka",
				payouts: "$5.7K",
				revenue: "$19.2K",
			},
			{
				avatar:
					"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
				flag: "us",
				name: "Samantha Johnson",
				payouts: "$5.1K",
				revenue: "$17K",
			},
			{
				avatar:
					"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
				flag: "mx",
				name: "Diego Alvarez",
				payouts: "$390",
				revenue: "$1.3K",
			},
		],
	},
] as const;

const MIGRATION_GRID_COLUMNS = [
	{
		header: "Migrated off Rewardful",
		logos: [
			{
				brand: "Vyssence",
				logo: "/case-studies/vyssence-logo.png",
				slug: "vyssence",
			},
			{
				brand: "Celorah",
				logo: "/case-studies/celorah-logo.png",
				slug: "celorah",
			},
			{
				brand: "Aurient",
				logo: "/case-studies/aurient-logo.png",
				slug: "aurient",
			},
			{
				brand: "Klyro Light",
				caseStudy: true,
				logo: "/case-studies/klyrolight-logo.png",
				slug: "klyrolight",
			},
		],
	},
	{
		header: "Migrated off PartnerStack",
		logos: [
			{
				brand: "Aurient",
				logo: "/case-studies/aurient-logo.png",
				slug: "aurient",
			},
			{
				brand: "Klyro Light",
				caseStudy: true,
				logo: "/case-studies/klyrolight-logo.png",
				slug: "klyrolight",
			},
			{
				brand: "J Pet Central",
				logo: "/case-studies/jpetcentral-logo.png",
				slug: "jpetcentral",
			},
		],
	},
	{
		header: "Migrated off FirstPromoter",
		logos: [
			{
				brand: "J Pet Central",
				caseStudy: true,
				logo: "/case-studies/jpetcentral-logo.png",
				slug: "jpetcentral",
			},
			{
				brand: "Matata Xplore",
				logo: "/case-studies/matataxplore-logo.png",
				slug: "matataxplore",
			},
		],
	},
	{
		header: "More great teams on Edge",
		logos: [
			{
				brand: "Matata Xplore",
				logo: "/case-studies/matataxplore-logo.png",
				slug: "matataxplore",
			},
			{
				brand: "Vyssence",
				logo: "/case-studies/vyssence-logo.png",
				slug: "vyssence",
			},
			{
				brand: "Celorah",
				logo: "/case-studies/celorah-logo.png",
				slug: "celorah",
			},
		],
	},
] as const;

const LIVE_SALES = [
	{ commission: "$0.20", flag: "🇮🇳", revenue: "$0.88" },
	{ commission: "$0.05", flag: "🇯🇵", revenue: "$0.15" },
	{ commission: "$0.33", flag: "🇺🇸", revenue: "$1.10" },
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
			<section className="relative isolate w-full overflow-hidden bg-white">
				{/* Full screen width grid boxes background pattern matching Image 1 */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] opacity-45 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,black_40%,transparent_100%)]"
				/>

				<Frame className="relative border-neutral-200 border-b pb-16">
					<div className="flex flex-col items-center px-6 pt-16 pb-12 text-center sm:px-8 sm:pt-24">
						{/* Eyebrow badge */}
						<div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 font-medium text-purple-700 text-xs shadow-2xs">
							<PartnersIcon className="size-3.5" />
							Edge Partners
						</div>

						<h1 className="mt-5 max-w-3xl font-medium font-satoshi text-4xl text-neutral-900 tracking-tight sm:text-5xl lg:text-6xl">
							Grow your revenue with partnerships
						</h1>

						<p className="mt-4 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							Edge Partners is the modern affiliate and partner program for
							agency partners, creators, and Shopify experts.
						</p>

						<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
							<ButtonLink
								className="h-10 rounded-lg px-6 font-medium text-sm"
								href={"/register" as Route}
								size="lg"
								variant="primary"
							>
								Get started
							</ButtonLink>
							<ButtonLink
								className="h-10 rounded-lg px-5 font-medium text-sm"
								href={BOOKING_URL as Route}
								rel="noopener"
								size="lg"
								target="_blank"
								variant="secondary"
							>
								<Play className="size-3.5 fill-current" /> Watch demo
							</ButtonLink>
						</div>
					</div>

					{/* Floating Affiliate Partner Cards Grid matching Image 1 */}
					<div className="relative mt-10 w-full overflow-hidden px-4 sm:px-8">
						{/* Vibrant Pink & Purple background radial glow behind cards */}
						<div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_75%_75%_at_50%_50%,rgba(236,72,153,0.22),rgba(168,85,247,0.22),transparent_80%)] blur-md" />

						<div className="relative [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
							<div className="grid grid-cols-1 gap-4 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_80%,transparent)] sm:grid-cols-2 lg:grid-cols-4">
								{HERO_COLUMNS.map((column, colIdx) => (
									<div
										className={`flex flex-col gap-4 transition-all duration-300 ${column.colClass}`}
										key={`col-${colIdx.toString()}`}
									>
										{column.cards.map((card) => (
											<div
												className="flex w-full items-center gap-3.5 rounded-2xl border border-neutral-200/90 bg-white p-3 shadow-md transition-all hover:scale-102 hover:shadow-lg"
												key={card.name}
											>
												<Image
													alt={card.name}
													className="size-12 shrink-0 rounded-xl object-cover"
													height={48}
													src={card.avatar}
													width={48}
												/>
												<div className="flex min-w-0 flex-1 flex-col">
													<div className="flex items-center gap-1.5 truncate font-bold text-neutral-900 text-xs">
														<span className="font-mono text-[10px] text-neutral-400 uppercase">
															{card.flag}
														</span>
														<span className="truncate">{card.name}</span>
													</div>
													<div className="mt-1 flex items-center justify-between text-[10px]">
														<div className="flex flex-col">
															<span className="font-medium text-[8px] text-neutral-400 uppercase tracking-wider">
																Revenue
															</span>
															<span className="font-bold text-neutral-900 text-xs">
																{card.revenue}
															</span>
														</div>
														<div className="flex flex-col text-right">
															<span className="font-medium text-[8px] text-neutral-400 uppercase tracking-wider">
																Payouts
															</span>
															<span className="font-bold text-purple-600 text-xs">
																{card.payouts}
															</span>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								))}
							</div>
						</div>

						{/* Soft bottom fade overlay */}
						<div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent" />
					</div>
				</Frame>
			</section>

			{/* SECTION 2: 4-COLUMN MIGRATION TABS & LOGOS (Matching Target Image 2 bottom layout) */}
			<section className="relative w-full overflow-hidden bg-white">
				<Frame className="border-neutral-200 border-b">
					<div className="grid grid-cols-1 divide-y border-neutral-200 sm:grid-cols-2 md:grid-cols-4 md:divide-x md:divide-y-0">
						{MIGRATION_GRID_COLUMNS.map((col) => (
							<div className="flex flex-col bg-white" key={col.header}>
								{/* Column Tab Header Pill Box */}
								<div className="border-neutral-200 border-b bg-neutral-50/60 p-2.5">
									<div className="w-full rounded-lg border border-neutral-200/80 bg-neutral-100/90 px-3 py-1.5 text-center font-medium text-neutral-700 text-xs">
										{col.header}
									</div>
								</div>

								{/* Column 2x2 Logo Grid */}
								<div className="grid grid-cols-2 items-center justify-items-center gap-6 p-6">
									{col.logos.map((item) => (
										<div
											className="flex flex-col items-center gap-1"
											key={item.brand}
										>
											<Link
												className="flex h-7 items-center justify-center transition-opacity hover:opacity-80"
												href={`/case-studies/${item.slug}` as Route}
											>
												<Image
													alt={item.brand}
													className="h-5 w-auto object-contain"
													height={80}
													src={item.logo}
													width={160}
												/>
											</Link>
											{"caseStudy" in item && item.caseStudy && (
												<span className="rounded-full bg-purple-100 px-1.5 py-0.5 font-bold font-mono text-[8px] text-purple-700 uppercase tracking-widest">
													CASE STUDY
												</span>
											)}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</Frame>
			</section>

			{/* SECTION 3: REVENUE ON AUTOPILOT 3-FEATURE CARDS */}
			<section className="relative w-full bg-white">
				<Frame className="border-neutral-200 border-b py-16">
					<div className="flex flex-col items-center text-center">
						<h2 className="font-medium font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Revenue on autopilot
						</h2>
						<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							Build scalable referral and affiliate programs to rise above the
							competition and become a category leader.
						</p>

						{/* 3-Column Grid */}
						<div className="mt-12 grid w-full grid-cols-1 divide-y border-neutral-200 border-y md:grid-cols-3 md:divide-x md:divide-y-0">
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
										className="inline-flex items-center gap-1 font-medium text-neutral-900 text-xs hover:underline"
										href={"/register" as Route}
									>
										Learn more <ArrowUpRight className="size-3.5" />
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
										className="inline-flex items-center gap-1 font-medium text-neutral-900 text-xs hover:underline"
										href={"/register" as Route}
									>
										Learn more <ArrowUpRight className="size-3.5" />
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
										className="inline-flex items-center gap-1 font-medium text-neutral-900 text-xs hover:underline"
										href={"/register" as Route}
									>
										Learn more <ArrowUpRight className="size-3.5" />
									</Link>
								</div>
							</div>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 4: TESTIMONIAL QUOTE */}
			<section className="relative w-full bg-white">
				<Frame className="border-neutral-200 border-b py-16">
					<div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
						<span className="font-bold font-satoshi text-neutral-900 text-xl">
							❖ Framer
						</span>
						<p className="mt-6 font-satoshi text-lg text-neutral-800 leading-relaxed sm:text-xl">
							&ldquo;Edge is the ultimate partner infrastructure for every
							startup. If you&apos;re looking to 10x your community /
							product-led growth – I cannot recommend building a partner program
							with Edge enough.&rdquo;
						</p>

						<div className="mt-6 flex flex-col items-center gap-1">
							<div className="flex size-10 items-center justify-center rounded-full bg-neutral-200 font-bold text-neutral-800 text-xs">
								KB
							</div>
							<span className="mt-2 font-medium text-neutral-900 text-xs">
								Koen Bok
							</span>
							<span className="text-[11px] text-neutral-500">CEO, Framer</span>
						</div>

						<Link
							className="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 font-medium text-neutral-700 text-xs hover:bg-neutral-100"
							href={"/case-studies/aurient" as Route}
						>
							Read the story <ArrowUpRight className="size-3.5" />
						</Link>
					</div>
				</Frame>
			</section>

			{/* SECTION 5: EFFORTLESS PAYOUTS 3-FEATURE CARDS */}
			<section className="relative w-full bg-white">
				<Frame className="border-neutral-200 border-b py-16">
					<div className="flex flex-col items-center text-center">
						<h2 className="font-medium font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Effortless payouts
						</h2>
						<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							Our streamlined payouts free up your time, so you can focus on
							growing your business and doing what you do best.
						</p>

						{/* 3-Column Grid */}
						<div className="mt-12 grid w-full grid-cols-1 divide-y border-neutral-200 border-y md:grid-cols-3 md:divide-x md:divide-y-0">
							{/* Card 1: 1-click global payouts */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									<div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4">
										<div className="flex w-full flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
											<div className="flex items-center justify-between">
												<span className="font-medium text-neutral-600 text-xs">
													Payout US$84.00
												</span>
												<span className="rounded bg-emerald-50 px-1.5 py-0.5 font-medium text-[10px] text-emerald-700">
													Paid
												</span>
											</div>
											<div className="flex items-center justify-between text-[10px] text-neutral-400">
												<span>Automated batch payout</span>
												<span>1-Click</span>
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
										className="inline-flex items-center gap-1 font-medium text-neutral-900 text-xs hover:underline"
										href={"/register" as Route}
									>
										Learn more <ArrowUpRight className="size-3.5" />
									</Link>
								</div>
							</div>

							{/* Card 2: Tax compliance */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									<div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4">
										<div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-2xs">
											<ShieldCheck className="size-8 text-emerald-600" />
											<span className="font-medium text-neutral-900 text-xs">
												Tax Compliance Handled
											</span>
											<span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
												W-9 / W-8 BEN Verified
											</span>
										</div>
									</div>

									<h3 className="mt-6 font-medium font-satoshi text-lg text-neutral-900">
										Tax compliance
									</h3>
									<p className="mt-2.5 text-neutral-600 text-xs leading-relaxed">
										We automatically handle tax compliance for you – no need to
										worry about sending W-9, 1099, W-8 forms manually.
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

							{/* Card 3: Built-in invoicing */}
							<div className="flex flex-col justify-between bg-white p-8 text-left transition-colors hover:bg-neutral-50/50">
								<div>
									<div className="flex h-40 items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50 p-4">
										<div className="flex w-full flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-3 shadow-2xs">
											<div className="flex items-center justify-between text-xs">
												<span className="font-medium text-neutral-900">
													Invoice #SUB-0001
												</span>
												<span className="font-bold font-mono text-purple-600">
													$1,538.50
												</span>
											</div>
											<div className="flex items-center gap-1 text-[10px] text-neutral-400">
												<CheckCircle2 className="size-3 text-emerald-500" />
												<span>Auto-generated PDF</span>
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
										className="inline-flex items-center gap-1 font-medium text-neutral-900 text-xs hover:underline"
										href={"/register" as Route}
									>
										Learn more <ArrowUpRight className="size-3.5" />
									</Link>
								</div>
							</div>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 6: GLOBE SECTION & LIVE REFERRAL POPUPS (Matching Screenshot 1) */}
			<section className="relative w-full bg-white">
				<Frame className="border-neutral-200 border-b py-16">
					<div className="flex flex-col items-center text-center">
						{/* Dotted Globe Visual with Live Conversion Popups */}
						<div className="relative flex h-64 w-full max-w-lg items-center justify-center overflow-hidden rounded-3xl border border-neutral-200/60 bg-gradient-to-b from-purple-50/40 via-white to-white p-4 sm:h-72">
							{/* Dotted Globe Graphic Background */}
							<div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
								<div className="size-60 rounded-full border border-purple-300/60 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:12px_12px] sm:size-72" />
							</div>

							{/* Live Referral Popups Stack (Matching Screenshot 1) */}
							<div className="relative z-10 flex flex-col gap-2.5">
								{LIVE_SALES.map((sale, idx) => (
									<div
										className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white/90 px-4 py-2.5 shadow-md backdrop-blur-md transition-all hover:scale-102"
										key={sale.flag}
										style={{ opacity: 1 - idx * 0.15 }}
									>
										<div className="flex items-center gap-2 font-medium text-neutral-800 text-xs">
											<span className="text-sm">{sale.flag}</span>
											<span>New referral sale</span>
										</div>
										<div className="flex items-center gap-3 text-[11px]">
											<div className="flex flex-col text-right">
												<span className="text-[9px] text-neutral-400 uppercase">
													Revenue
												</span>
												<span className="font-semibold text-neutral-800">
													{sale.revenue}
												</span>
											</div>
											<div className="flex flex-col text-right">
												<span className="text-[9px] text-neutral-400 uppercase">
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

						<h2 className="mt-8 font-medium font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Battle-tested tracking and payouts infrastructure
						</h2>

						<p className="mt-3 max-w-md text-neutral-500 text-sm leading-relaxed sm:text-base">
							We currently track 1.5M+ million conversion events and send over
							$2 million in partner payouts – <em>every single month</em>.
						</p>

						{/* 3 Big Stat Numbers */}
						<div className="mt-12 grid w-full grid-cols-1 divide-y border-neutral-200 border-t sm:grid-cols-3 sm:divide-x sm:divide-y-0">
							<div className="flex flex-col items-center py-8">
								<span className="font-bold font-satoshi text-4xl text-purple-600 sm:text-5xl">
									$33M+
								</span>
								<span className="mt-2 text-neutral-500 text-xs">
									commissions earned by partners
								</span>
							</div>

							<div className="flex flex-col items-center py-8">
								<span className="font-bold font-satoshi text-4xl text-purple-600 sm:text-5xl">
									$168M+
								</span>
								<span className="mt-2 text-neutral-500 text-xs">
									revenue driven by partners
								</span>
							</div>

							<div className="flex flex-col items-center py-8">
								<span className="font-bold font-satoshi text-4xl text-purple-600 sm:text-5xl">
									7,000+
								</span>
								<span className="mt-2 text-neutral-500 text-xs">
									active partners in our network
								</span>
							</div>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 7: REWARD VIRAL CONTENT (Matching Screenshot 2) */}
			<section className="relative w-full bg-white">
				<Frame className="border-neutral-200 border-b py-16">
					<div className="flex flex-col items-center text-center">
						<h2 className="font-medium font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Reward viral content
						</h2>
						<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							Reward partners for creating viral content – with support for
							variable bonuses and earnings limits. Perfect for influencer/UGC
							campaigns.
						</p>

						<ButtonLink
							className="mt-5 h-8 rounded-lg border border-neutral-200 bg-white px-4 font-medium text-neutral-800 text-xs hover:bg-neutral-50"
							href={"/register" as Route}
							size="sm"
							variant="secondary"
						>
							Learn more about bounties
						</ButtonLink>

						{/* 2-Column Cards Grid */}
						<div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
							{/* Left Card: 3D Heart YouTube Bounty */}
							<div className="flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs">
								<div className="flex h-52 items-center justify-center rounded-2xl bg-neutral-100/80 p-4">
									<div className="flex size-20 items-center justify-center rounded-3xl bg-white shadow-md">
										<Heart className="size-10 fill-red-500 text-red-500" />
									</div>
								</div>
								<div className="mt-5 text-left">
									<h3 className="font-medium text-neutral-900 text-sm">
										Get rewarded for YouTube views about Edge
									</h3>
									<div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500">
										<span>7,261 of 10,000 views</span>
										<span className="font-semibold text-emerald-600">72%</span>
									</div>
									<div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
										<div className="h-full w-[72%] rounded-full bg-emerald-500" />
									</div>
								</div>
							</div>

							{/* Right Card: Video Creator Review */}
							<div className="flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs">
								<div className="relative h-52 overflow-hidden rounded-2xl bg-neutral-900">
									<Image
										alt="Video review creator"
										className="object-cover opacity-80"
										fill
										src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
									/>
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="flex size-12 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-lg backdrop-blur-md">
											<Play className="ml-0.5 size-5 fill-current" />
										</div>
									</div>
								</div>
								<div className="mt-5 text-left">
									<h3 className="font-medium text-neutral-900 text-sm">
										The best product reviews of the week
									</h3>
									<div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500">
										<span className="font-medium text-neutral-800">
											Evan Brooks ✓
										</span>
										<span>•</span>
										<span>4.8k views • 6 hours ago</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 8: SEAMLESS INTEGRATION 3-FEATURE CARDS (Matching Screenshot 3) */}
			<section className="relative w-full bg-white">
				<Frame className="border-neutral-200 border-b py-16">
					<div className="flex flex-col items-center text-center">
						<h2 className="font-medium font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Seamless integration
						</h2>
						<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							Drive partner signups with branded landing pages and embedded
							referral dashboards within your app.
						</p>

						{/* 3-Column Grid */}
						<div className="mt-12 grid w-full grid-cols-1 divide-y border-neutral-200 border-y md:grid-cols-3 md:divide-x md:divide-y-0">
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

			{/* SECTION 9: LOVED BY MODERN COMPANIES SUCCESS STORY (Matching Screenshot 4) */}
			<section className="relative w-full bg-white">
				<Frame className="border-neutral-200 border-b py-16">
					<div className="flex flex-col items-center text-center">
						<h2 className="font-medium font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Loved by modern e-commerce companies
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
