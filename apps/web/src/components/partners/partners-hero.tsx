"use client";

import { ButtonLink } from "@edgecoms/ui/components/button";
import { Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Route } from "next";
import Image from "next/image";
import { Frame, PartnersIcon } from "@/components/landing/frame";
import { REVEAL_EASE, Reveal } from "@/components/ui/reveal";
import { BOOKING_URL } from "@/lib/booking";

const PARTNER_CARDS = [
	// Column 1 (Leftmost - faded)
	[
		{
			avatar:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
			flag: "🇺🇸",
			name: "Lauren Anderson",
			payouts: "$550",
			revenue: "$1.8K",
		},
		{
			avatar:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
			flag: "🇩🇪",
			name: "Elias Weber",
			payouts: "$235",
			revenue: "$783",
		},
		{
			avatar:
				"https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
			flag: "🇬🇧",
			name: "Derek Forbes",
			payouts: "$450",
			revenue: "$1.5K",
		},
	],
	// Column 2 (Middle Left)
	[
		{
			avatar:
				"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
			flag: "🇺🇸",
			name: "Mia Taylor",
			payouts: "$6.8K",
			revenue: "$22.6K",
		},
		{
			avatar:
				"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
			flag: "🇺🇸",
			name: "Liam Carter",
			payouts: "$9.2K",
			revenue: "$30K",
		},
		{
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
			flag: "🇨🇦",
			name: "Marvin Ta",
			payouts: "$5.4K",
			revenue: "$18.3K",
		},
	],
	// Column 3 (Middle Right)
	[
		{
			avatar:
				"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
			flag: "🇨🇦",
			name: "Sophie Laurent",
			payouts: "$3.3K",
			revenue: "$11K",
		},
		{
			avatar:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
			flag: "🇦🇷",
			name: "Lucia Gonzalez",
			payouts: "$7.2K",
			revenue: "$24K",
		},
		{
			avatar:
				"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
			flag: "🇬🇧",
			name: "Oliver Hawthorne",
			payouts: "$255",
			revenue: "$850",
		},
	],
	// Column 4 (Rightmost - faded)
	[
		{
			avatar:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
			flag: "🇯🇵",
			name: "Hiroshi Tanaka",
			payouts: "$5.7K",
			revenue: "$19.2K",
		},
		{
			avatar:
				"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
			flag: "🇺🇸",
			name: "Samantha Johns",
			payouts: "$5.1K",
			revenue: "$17K",
		},
		{
			avatar:
				"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80",
			flag: "🇪🇸",
			name: "Diego Alvarez",
			payouts: "$390",
			revenue: "$1.3K",
		},
	],
] as const;

export function PartnersHero() {
	const reduced = useReducedMotion();

	return (
		<section className="relative isolate w-full overflow-hidden border-neutral-200 border-b bg-white">
			{/* Frame container matching homepage 1080px column with side hairline rules */}
			<Frame className="relative pt-12 pb-16 sm:pt-20">
				{/* Inner background grid lines with radial mask to fade out upper title area */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50 [mask-image:radial-gradient(ellipse_100%_65%_at_50%_100%,black_30%,transparent_80%)]"
				/>

				{/* Soft pink/purple ambient glow fill behind cards */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[radial-gradient(ellipse_85%_65%_at_50%_90%,rgba(244,114,182,0.18),rgba(217,70,239,0.1),transparent_75%)]"
				/>

				<div className="flex flex-col items-center px-6 text-center sm:px-8">
					{/* Eyebrow Pill Badge */}
					<Reveal>
						<div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-purple-200/80 bg-purple-50/80 px-3.5 py-1 font-medium text-purple-700 text-xs shadow-2xs">
							<PartnersIcon className="size-3.5" />
							<span>Edge Partners</span>
						</div>
					</Reveal>

					{/* Main Title */}
					<Reveal delay={0.08}>
						<h1 className="max-w-3xl font-bold text-4xl text-neutral-900 tracking-tight sm:text-5xl lg:text-6xl">
							Grow your revenue with partnerships
						</h1>
					</Reveal>

					{/* Paragraph */}
					<Reveal delay={0.16}>
						<p className="mt-5 max-w-xl text-balance text-base text-neutral-600 leading-relaxed sm:text-lg">
							Edge Partners is the modern affiliate and partner program for
							agency partners, creators, and Shopify experts.
						</p>
					</Reveal>

					{/* CTA Buttons */}
					<Reveal delay={0.24}>
						<div className="mt-8 flex items-center justify-center gap-3">
							<ButtonLink
								className="h-10 rounded-lg bg-black px-5 font-medium text-sm text-white shadow-xs hover:bg-neutral-800"
								href={"/register" as Route}
								size="lg"
								variant="primary"
							>
								Get started
							</ButtonLink>
							<ButtonLink
								className="flex h-10 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 font-medium text-neutral-900 text-sm shadow-2xs hover:bg-neutral-50"
								href={BOOKING_URL as Route}
								rel="noopener"
								size="lg"
								target="_blank"
								variant="secondary"
							>
								<span className="flex size-4 items-center justify-center rounded-full border border-neutral-400">
									<Play className="ml-0.5 size-2 fill-neutral-900 text-neutral-900" />
								</span>
								Watch demo
							</ButtonLink>
						</div>
					</Reveal>
				</div>

				{/* Floating Partner Cards Grid bounded within Frame */}
				<div className="relative mt-14 w-full overflow-hidden px-4 sm:px-8">
					<div className="relative [mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_88%,transparent_100%)]">
						<div className="grid grid-cols-1 gap-4 py-2 [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] sm:grid-cols-2 lg:grid-cols-4">
							{PARTNER_CARDS.map((column, colIdx) => (
								/* The wall arrives column by column, then never quite settles:
								   each column keeps drifting on its own clock, so the block
								   reads as a live roster rather than as a screenshot. Four
								   columns on one clock would pulse in unison, which looks like
								   a single breathing object instead of four. */
								<motion.div
									animate={
										reduced
											? undefined
											: { filter: "blur(0px)", opacity: 1, y: 0 }
									}
									className="flex flex-col gap-4"
									initial={
										reduced
											? undefined
											: { filter: "blur(8px)", opacity: 0, y: 28 }
									}
									key={`partner-col-${colIdx.toString()}`}
									transition={{
										delay: 0.3 + colIdx * 0.09,
										duration: 0.8,
										ease: REVEAL_EASE,
									}}
								>
									<motion.div
										animate={reduced ? undefined : { y: [0, -9, 0] }}
										className="flex flex-col gap-4"
										transition={{
											duration: 7 + colIdx * 1.3,
											ease: "easeInOut",
											repeat: Number.POSITIVE_INFINITY,
										}}
									>
										{column.map((card) => (
											<div
												className="flex w-full items-center gap-3.5 rounded-2xl border border-neutral-200/90 bg-white p-3 shadow-2xs transition-all hover:scale-102 hover:shadow-md"
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
													<div className="flex items-center gap-1.5 truncate">
														<span className="text-xs">{card.flag}</span>
														<span className="truncate font-semibold text-neutral-900 text-xs">
															{card.name}
														</span>
													</div>
													<div className="mt-1 flex items-center justify-between text-[10px]">
														<div className="flex flex-col">
															<span className="font-medium text-[9px] text-neutral-400 uppercase tracking-wider">
																Revenue
															</span>
															<span className="font-semibold text-neutral-900 text-xs">
																{card.revenue}
															</span>
														</div>
														<div className="h-6 w-px bg-neutral-100" />
														<div className="flex flex-col">
															<span className="font-medium text-[9px] text-neutral-400 uppercase tracking-wider">
																Payouts
															</span>
															<span className="font-semibold text-neutral-900 text-xs">
																{card.payouts}
															</span>
														</div>
													</div>
												</div>
											</div>
										))}
									</motion.div>
								</motion.div>
							))}
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}
