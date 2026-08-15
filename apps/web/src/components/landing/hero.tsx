"use client";

import { ButtonLink } from "@edgecoms/ui/components/button";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { Route } from "next";
import Link from "next/link";
import { Frame, GridField } from "@/components/landing/frame";
import { REVEAL_EASE } from "@/components/ui/reveal";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";

/* The hero is already in view, so it animates on load rather than on scroll.
   The stagger is the whole effect: pill, headline, lead, buttons, in the order
   the eye reads them. 110ms apart with a 0.9s expo tail means each element is
   still settling as the next starts, which is what makes four movements read as
   one. The blur is what makes 18px of travel read as arriving rather than as a
   twitch — reduced-motion gets opacity only. */
const CONTAINER: Variants = {
	hidden: {},
	show: { transition: { delayChildren: 0.08, staggerChildren: 0.11 } },
};

const ITEM: Variants = {
	hidden: { filter: "blur(10px)", opacity: 0, y: 18 },
	show: {
		filter: "blur(0px)",
		opacity: 1,
		transition: { duration: 0.9, ease: REVEAL_EASE },
		y: 0,
	},
};

const FADE: Variants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { duration: 0.5 } },
};

export function Hero() {
	const item = useReducedMotion() ? FADE : ITEM;

	return (
		<section className="relative isolate w-full overflow-hidden bg-white">
			{/* Halved on top of the mask. The grid is meant to say the page has a
			    structure, not to be read — at full strength the lines were competing
			    with the headline sitting on them. */}
			<GridField className="opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />

			<Frame>
				<motion.div
					animate="show"
					className="mx-auto flex w-full max-w-[820px] flex-col items-center gap-5 px-4 pt-16 pb-20 text-center sm:gap-6 sm:px-6 sm:pt-28 sm:pb-32"
					initial="hidden"
					variants={CONTAINER}
				>
					{/* Partner program pill link - single pill on mobile, divided pill on desktop */}
					<motion.div className="max-w-full" variants={item}>
						<Link
							className="group inline-flex max-w-full items-center overflow-hidden rounded-full border border-neutral-200 bg-white shadow-2xs transition-colors hover:border-neutral-300"
							href={"/partners" as Route}
						>
							{/* Desktop view (sm and above): Divided pill with vertical hairline */}
							<div className="hidden items-center text-label sm:flex">
								<span className="whitespace-nowrap px-3.5 py-1.5 font-medium text-neutral-900">
									Introducing the Edge Partner Program
								</span>
								<span
									aria-hidden="true"
									className="self-stretch border-neutral-200 border-r"
								/>
								<span className="flex items-center gap-1 whitespace-nowrap px-3.5 py-1.5 font-medium text-neutral-500 transition-colors group-hover:text-neutral-900">
									Read more
									<ArrowUpRight aria-hidden="true" className="size-3.5" />
								</span>
							</div>

							{/* Mobile view (< sm): Single clean capsule pill with title and arrow icon */}
							<div className="flex items-center gap-1.5 px-3.5 py-1.5 font-medium text-neutral-800 text-xs sm:hidden">
								<span>Introducing the Edge Partner Program</span>
								<ArrowUpRight
									aria-hidden="true"
									className="size-3.5 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-900"
								/>
							</div>
						</Link>
					</motion.div>

					<motion.h1
						className="text-balance font-satoshi text-3xl text-primary-foreground leading-[1.1] tracking-tight sm:text-[44px] sm:leading-[1.05] lg:text-display-xl"
						variants={item}
					>
						Turn traffic into revenue
					</motion.h1>

					<motion.p
						className="max-w-md text-pretty text-neutral-500 text-sm leading-relaxed sm:max-w-155 sm:text-body-lg sm:leading-snug"
						variants={item}
					>
						Edge is the Shopify app suite for higher order value, better
						conversion rate, and revenue that repeats.
					</motion.p>

					<motion.div
						className="mt-2 flex flex-row items-center justify-center gap-2.5 sm:mt-4 sm:gap-3"
						variants={item}
					>
						<ButtonLink
							className="h-10 rounded-lg px-4 font-medium text-xs sm:h-11 sm:px-6 sm:text-body-sm"
							href={"/products" as Route}
							size="xl"
							variant="primary"
						>
							Explore the suite
						</ButtonLink>
						<ButtonLink
							className="h-10 rounded-lg px-4 font-medium text-xs sm:h-11 sm:px-6 sm:text-body-sm"
							href={BOOKING_URL as Route}
							rel="noopener"
							size="xl"
							target="_blank"
							variant="secondary"
						>
							{BOOKING_LABEL}
						</ButtonLink>
					</motion.div>
				</motion.div>
			</Frame>
		</section>
	);
}
