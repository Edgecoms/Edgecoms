"use client";

import { ButtonLink } from "@edgecoms/ui/components/button";
import { ArrowUpRight, Store } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame, GridField, PartnersIcon } from "@/components/landing/frame";
import { Reveal } from "@/components/ui/reveal";
import { BOOKING_URL } from "@/lib/booking";
import { CASE_STUDIES } from "@/lib/marketing-stats";

const CATEGORIES = [
	"All",
	"Supplements",
	"Beauty",
	"Home",
	"Apparel",
	"Pets",
	"Outdoor",
] as const;

interface DirectoryStore {
	apps: readonly string[];
	category: (typeof CATEGORIES)[number];
	description: string;
	href: string;
	name: string;
}

const DIRECTORY_STORES: readonly DirectoryStore[] = [
	{
		apps: ["Edge Subscriptions", "Edge Bundles"],
		category: "Supplements",
		description:
			"Aurient sells daily men's health formulas with multi-month packs and subscription workflows.",
		href: "/case-studies/aurient",
		name: "Aurient",
	},
	{
		apps: ["Edge Cart", "Edge Reviews"],
		category: "Beauty",
		description:
			"Vyssence raises first-order value for beauty shoppers using slide-cart upsells and photo trust reviews.",
		href: "/case-studies/vyssence",
		name: "Vyssence",
	},
	{
		apps: ["Edge Timer", "Edge Reviews"],
		category: "Home",
		description:
			"Klyro Light shortens the decision window for home lighting with real room photos and countdown timers.",
		href: "/case-studies/klyrolight",
		name: "Klyro Light",
	},
	{
		apps: ["Edge Timer", "Edge Cart"],
		category: "Apparel",
		description:
			"Celorah pairs hero apparel items with free second-item promotions on a strict countdown deadline.",
		href: "/case-studies/celorah",
		name: "Celorah",
	},
	{
		apps: ["Edge Cart", "Edge Subscriptions"],
		category: "Pets",
		description:
			"J Pet Central automates pet supply reorders and scheduling so ready buyers never run out.",
		href: "/case-studies/jpetcentral",
		name: "J Pet Central",
	},
	{
		apps: ["Edge Timer", "Edge Subscriptions"],
		category: "Outdoor",
		description:
			"Matata Xplore makes seasonal outdoor trip cutoffs explicit with countdown timers and cart incentives.",
		href: "/case-studies/matataxplore",
		name: "Matata Xplore",
	},
] as const;

export default function CustomersPage() {
	const [activeCategory, setActiveCategory] =
		useState<(typeof CATEGORIES)[number]>("All");

	const filteredStores =
		activeCategory === "All"
			? DIRECTORY_STORES
			: DIRECTORY_STORES.filter((s) => s.category === activeCategory);

	return (
		<main className="flex w-full flex-col overflow-x-clip bg-white">
			{/* SECTION 1: HERO HEADER & 3-HERO CARDS */}
			<Reveal>
				<section className="relative isolate w-full bg-white">
					<Frame className="relative border-neutral-200 border-b pb-16">
						<GridField className="opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_30%_30%,black,transparent)]" />

						{/* Header Left-aligned */}
						<div className="flex flex-col items-start px-6 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
							<h1 className="font-medium font-satoshi text-4xl text-neutral-900 tracking-tight sm:text-5xl lg:text-6xl">
								Meet our customers
							</h1>
							<p className="mt-3.5 max-w-xl text-neutral-500 text-sm leading-relaxed sm:text-base">
								Edge gives superpowers to Shopify merchants and high-growth
								e-commerce brands – from early stage stores to category leaders.
							</p>

							<div className="mt-6 flex items-center gap-3">
								<ButtonLink
									className="h-9 rounded-lg px-4 font-medium text-xs sm:h-10 sm:px-5 sm:text-sm"
									href={"/products" as Route}
									size="md"
									variant="primary"
								>
									Make the switch
								</ButtonLink>
								<ButtonLink
									className="h-9 rounded-lg px-4 font-medium text-xs sm:h-10 sm:px-5 sm:text-sm"
									href={BOOKING_URL as Route}
									rel="noopener"
									size="md"
									target="_blank"
									variant="secondary"
								>
									Get a demo
								</ButtonLink>
							</div>
						</div>

						{/* 3-Hero Cards Grid matching Image 1 layout */}
						<div className="px-4 sm:px-8">
							<div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
								{/* Tall Left Hero Card (Aurient) */}
								<Link
									className="group relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-900 p-7 shadow-xl transition-all duration-500 hover:shadow-2xl lg:col-span-7 lg:min-h-[540px]"
									href={"/case-studies/aurient" as Route}
								>
									<Image
										alt={CASE_STUDIES.aurient.brand}
										className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
										fill
										priority
										sizes="(max-width: 1024px) 100vw, 700px"
										src={CASE_STUDIES.aurient.banner ?? ""}
									/>
									{/* Solid vibrant blue gradient at bottom matching Image 2 */}
									<div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#0266FF] via-[#0266FF]/85 to-transparent" />

									{/* Top-left Brand Badge */}
									<div className="relative flex items-center gap-2.5">
										<div className="flex size-8 items-center justify-center rounded-lg border border-white/20 bg-white/20 text-white backdrop-blur-md">
											<span className="font-bold text-xs">A</span>
										</div>
										<span className="font-semibold text-lg text-white tracking-tight">
											{CASE_STUDIES.aurient.brand}
										</span>
									</div>

									{/* Bottom Headline */}
									<div className="relative mt-auto pt-16">
										<h2 className="font-medium font-satoshi text-2xl text-white leading-snug sm:text-3xl lg:text-[32px] lg:leading-tight">
											How Aurient achieved 2.8× subscriber LTV with Edge
											Subscriptions & Bundles
										</h2>
									</div>
								</Link>

								{/* Right Stacked 2 Cards */}
								<div className="flex flex-col gap-5 lg:col-span-5">
									{/* Top Right Card (Vyssence) */}
									<Link
										className="group relative flex min-h-[230px] flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-900 p-6 shadow-lg transition-all duration-500 hover:shadow-xl"
										href={"/case-studies/vyssence" as Route}
									>
										<Image
											alt={CASE_STUDIES.vyssence.brand}
											className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
											fill
											sizes="(max-width: 1024px) 100vw, 500px"
											src={CASE_STUDIES.vyssence.banner ?? ""}
										/>
										{/* Solid vibrant magenta/pink gradient at bottom matching Image 2 */}
										<div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#c026d3] via-[#c026d3]/85 to-transparent" />

										<div className="relative flex items-center gap-2.5">
											<div className="flex size-7 items-center justify-center rounded-lg border border-white/20 bg-white/20 text-white backdrop-blur-md">
												<span className="font-bold text-xs">V</span>
											</div>
											<span className="font-semibold text-base text-white tracking-tight">
												{CASE_STUDIES.vyssence.brand}
											</span>
										</div>

										<div className="relative mt-auto pt-8">
											<h3 className="font-medium font-satoshi text-white text-xl leading-snug">
												How Vyssence increased average order value by 22% using
												Edge Cart & Bundles
											</h3>
										</div>
									</Link>

									{/* Bottom Right Card (Klyro Light) */}
									<Link
										className="group relative flex min-h-[230px] flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-900 p-6 shadow-lg transition-all duration-500 hover:shadow-xl"
										href={"/case-studies/klyrolight" as Route}
									>
										<Image
											alt={CASE_STUDIES.klyrolight.brand}
											className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
											fill
											sizes="(max-width: 1024px) 100vw, 500px"
											src={CASE_STUDIES.klyrolight.banner ?? ""}
										/>
										{/* Solid vibrant purple/indigo gradient at bottom matching Image 2 */}
										<div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#5b5bd6] via-[#5b5bd6]/85 to-transparent" />

										<div className="relative flex items-center gap-2.5">
											<div className="flex size-7 items-center justify-center rounded-lg border border-white/20 bg-white/20 text-white backdrop-blur-md">
												<span className="font-bold text-xs">K</span>
											</div>
											<span className="font-semibold text-base text-white tracking-tight">
												{CASE_STUDIES.klyrolight.brand}
											</span>
										</div>

										<div className="relative mt-auto pt-8">
											<h3 className="font-medium font-satoshi text-white text-xl leading-snug">
												Klyro Light lifted product page conversion by 18% with
												Edge Reviews & Timer
											</h3>
										</div>
									</Link>
								</div>
							</div>
						</div>
					</Frame>
				</section>
			</Reveal>

			{/* SECTION 2: LOGO CLOUD BAR (Using brand logo images with side vertical lines) */}
			<Reveal>
				<section className="relative w-full overflow-hidden bg-white">
					<Frame className="border-neutral-200 border-b py-8">
						<ul className="grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-6 px-6 sm:grid-cols-3 lg:grid-cols-6">
							{Object.entries(CASE_STUDIES)
								.filter(([, study]) => Boolean(study.logo))
								.map(([slug, study]) => (
									<li className="flex items-center justify-center" key={slug}>
										<Link
											className="flex h-8 items-center justify-center transition-opacity hover:opacity-80"
											href={`/case-studies/${slug}` as Route}
										>
											<Image
												alt={study.brand}
												className="h-7 w-auto object-contain"
												height={96}
												src={study.logo as string}
												width={220}
											/>
										</Link>
									</li>
								))}
						</ul>
					</Frame>
				</section>
			</Reveal>

			{/* SECTION 3: DETAILED TESTIMONIAL QUOTE CARDS GRID (Matching Image 2 Middle layout) */}
			<Reveal>
				<section className="w-full bg-white">
					<Frame className="border-neutral-200 border-b">
						<div className="grid grid-cols-1 divide-y border-neutral-200 md:grid-cols-2 md:divide-x md:divide-y-0">
							{/* Card 1: Vyssence */}
							<div className="flex flex-col justify-between p-8 sm:p-10">
								<div>
									<div className="flex items-center gap-2">
										<span className="font-bold font-satoshi text-lg text-neutral-900">
											Vyssence
										</span>
									</div>
									<p className="mt-6 text-neutral-700 text-sm leading-relaxed sm:text-base">
										Bundles turned our single-item orders into two-item orders.
										Average order value is up{" "}
										<strong className="font-semibold text-neutral-900">
											+22% AOV
										</strong>{" "}
										and we never touched ad spend.{" "}
										<Link
											className="inline-flex items-center gap-0.5 text-blue-600 hover:underline"
											href={"/case-studies/vyssence" as Route}
										>
											Read story <ArrowUpRight className="size-3.5" />
										</Link>
									</p>
								</div>

								<div className="mt-8 flex items-center justify-between pt-4">
									<div className="flex items-center gap-2">
										<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-medium text-[11px] text-neutral-700">
											<span className="size-2 rounded-full bg-orange-500" />
											Edge Bundles
										</span>
										<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-medium text-[11px] text-neutral-700">
											<span className="size-2 rounded-full bg-blue-500" />
											Edge Cart
										</span>
									</div>

									<div className="flex items-center gap-2 text-right">
										<div>
											<div className="font-medium text-neutral-900 text-xs">
												Head of Ecommerce
											</div>
											<div className="text-[11px] text-neutral-500">
												Vyssence
											</div>
										</div>
										<div className="flex size-8 items-center justify-center rounded-full bg-neutral-200 font-bold text-neutral-800 text-xs">
											VY
										</div>
									</div>
								</div>
							</div>

							{/* Card 2: Aurient */}
							<div className="flex flex-col justify-between p-8 sm:p-10">
								<div>
									<div className="flex items-center gap-2">
										<span className="font-bold font-satoshi text-lg text-neutral-900">
											Aurient
										</span>
									</div>
									<p className="mt-6 text-neutral-700 text-sm leading-relaxed sm:text-base">
										Subscriptions doubled our{" "}
										<strong className="font-semibold text-neutral-900">
											repeat purchase rate
										</strong>{" "}
										and boosted customer LTV to{" "}
										<strong className="font-semibold text-neutral-900">
											2.8×
										</strong>{" "}
										in a single quarter.{" "}
										<Link
											className="inline-flex items-center gap-0.5 text-blue-600 hover:underline"
											href={"/case-studies/aurient" as Route}
										>
											Read story <ArrowUpRight className="size-3.5" />
										</Link>
									</p>
								</div>

								<div className="mt-8 flex items-center justify-between pt-4">
									<div className="flex items-center gap-2">
										<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-medium text-[11px] text-neutral-700">
											<PartnersIcon className="size-3.5 p-0.5" />
											Edge Subscriptions
										</span>
										<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-medium text-[11px] text-neutral-700">
											Edge Reviews
										</span>
									</div>

									<div className="flex items-center gap-2 text-right">
										<div>
											<div className="font-medium text-neutral-900 text-xs">
												Founder
											</div>
											<div className="text-[11px] text-neutral-500">
												Aurient
											</div>
										</div>
										<div className="flex size-8 items-center justify-center rounded-full bg-neutral-200 font-bold text-neutral-800 text-xs">
											AU
										</div>
									</div>
								</div>
							</div>

							{/* Card 3: Klyro Light */}
							<div className="flex flex-col justify-between border-neutral-200 border-t p-8 sm:p-10">
								<div>
									<div className="flex items-center gap-2">
										<span className="font-bold font-satoshi text-lg text-neutral-900">
											Klyro Light
										</span>
									</div>
									<p className="mt-6 text-neutral-700 text-sm leading-relaxed sm:text-base">
										Trackproof showed us{" "}
										<strong className="font-semibold text-neutral-900">
											two ad campaigns
										</strong>{" "}
										we had switched off were actually profitable. That alone
										paid for the entire year.{" "}
										<Link
											className="inline-flex items-center gap-0.5 text-blue-600 hover:underline"
											href={"/case-studies/klyrolight" as Route}
										>
											Read story <ArrowUpRight className="size-3.5" />
										</Link>
									</p>
								</div>

								<div className="mt-8 flex items-center justify-between pt-4">
									<div className="flex items-center gap-2">
										<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-medium text-[11px] text-neutral-700">
											Trackproof
										</span>
										<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-medium text-[11px] text-neutral-700">
											Edge Timer
										</span>
									</div>

									<div className="flex items-center gap-2 text-right">
										<div>
											<div className="font-medium text-neutral-900 text-xs">
												Growth Lead
											</div>
											<div className="text-[11px] text-neutral-500">
												Klyro Light
											</div>
										</div>
										<div className="flex size-8 items-center justify-center rounded-full bg-neutral-200 font-bold text-neutral-800 text-xs">
											KL
										</div>
									</div>
								</div>
							</div>

							{/* Card 4: Celorah */}
							<div className="flex flex-col justify-between border-neutral-200 border-t p-8 sm:p-10">
								<div>
									<div className="flex items-center gap-2">
										<span className="font-bold font-satoshi text-lg text-neutral-900">
											Celorah
										</span>
									</div>
									<p className="mt-6 text-neutral-700 text-sm leading-relaxed sm:text-base">
										Setup took an afternoon. The{" "}
										<strong className="font-semibold text-neutral-900">
											cart upsell
										</strong>{" "}
										covered the subscription cost in the very first week,
										lifting AOV by{" "}
										<strong className="font-semibold text-neutral-900">
											+26%
										</strong>
										.{" "}
										<Link
											className="inline-flex items-center gap-0.5 text-blue-600 hover:underline"
											href={"/case-studies/celorah" as Route}
										>
											Read story <ArrowUpRight className="size-3.5" />
										</Link>
									</p>
								</div>

								<div className="mt-8 flex items-center justify-between pt-4">
									<div className="flex items-center gap-2">
										<span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-medium text-[11px] text-neutral-700">
											Edge Cart
										</span>
									</div>

									<div className="flex items-center gap-2 text-right">
										<div>
											<div className="font-medium text-neutral-900 text-xs">
												Owner
											</div>
											<div className="text-[11px] text-neutral-500">
												Celorah
											</div>
										</div>
										<div className="flex size-8 items-center justify-center rounded-full bg-neutral-200 font-bold text-neutral-800 text-xs">
											CE
										</div>
									</div>
								</div>
							</div>
						</div>
					</Frame>
				</section>
			</Reveal>

			{/* SECTION 4: TRUSTED BY THE BEST COMPANIES DIRECTORY (Matching Image 3 layout) */}
			<Reveal>
				<section className="w-full bg-white">
					<Frame className="border-neutral-200 border-b py-16">
						<div className="flex flex-col items-center text-center">
							<h2 className="font-medium font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
								Stores running Edge
							</h2>

							{/* Category Pills Bar */}
							<div className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
								{CATEGORIES.map((cat) => (
									<button
										className={`rounded-full px-3.5 py-1.5 font-medium text-xs transition-colors ${
											activeCategory === cat
												? "bg-neutral-900 text-white"
												: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
										}`}
										key={cat}
										onClick={() => setActiveCategory(cat)}
										type="button"
									>
										{cat}
									</button>
								))}
							</div>

							{/* Directory Grid */}
							<div className="mt-10 grid w-full grid-cols-1 border-neutral-200 border-t border-l sm:grid-cols-2 md:grid-cols-3">
								{filteredStores.map((store) => (
									<div
										className="flex flex-col justify-between border-neutral-200 border-r border-b bg-white p-6 text-left transition-colors hover:bg-neutral-50/70"
										key={store.name}
									>
										<div>
											<div className="font-bold font-satoshi text-base text-neutral-900">
												{store.name}
											</div>
											<p className="mt-3 text-neutral-600 text-xs leading-relaxed">
												{store.description}{" "}
												<Link
													className="inline-flex items-center gap-0.5 text-blue-600 hover:underline"
													href={store.href as Route}
												>
													Read story <ArrowUpRight className="size-3" />
												</Link>
											</p>
										</div>

										<div className="mt-6 flex flex-wrap items-center gap-1.5">
											{store.apps.map((app) => (
												<span
													className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-medium text-[10px] text-neutral-700"
													key={app}
												>
													<span className="size-1.5 rounded-full bg-orange-500" />
													{app}
												</span>
											))}
										</div>
									</div>
								))}

								{/* Final Tile: Add Your Store */}
								<div className="flex flex-col items-center justify-center border-neutral-200 border-r border-b bg-neutral-50/40 p-6 text-center">
									<div className="flex size-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 shadow-2xs">
										<Store className="size-4" />
									</div>
									<h3 className="mt-3 font-medium text-neutral-900 text-xs">
										Add your store
									</h3>
									<ButtonLink
										className="mt-3 h-8 rounded-lg px-3 text-xs"
										href={"/products" as Route}
										size="sm"
										variant="secondary"
									>
										Browse apps
									</ButtonLink>
								</div>
							</div>
						</div>
					</Frame>
				</section>
			</Reveal>

			{/* SECTION 5: CLOSING CTA SECTION (Homepage CtaDark) */}
			<Reveal>
				<CtaDark />
			</Reveal>
		</main>
	);
}
