import { ButtonLink } from "@edgecoms/ui/components/button";
import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Frame, GridField } from "@/components/landing/frame";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";

export function Hero() {
	return (
		<section className="relative isolate w-full overflow-hidden bg-white">
			{/* Halved on top of the mask. The grid is meant to say the page has a
			    structure, not to be read — at full strength the lines were competing
			    with the headline sitting on them. */}
			<GridField className="opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />

			<Frame>
				<div className="mx-auto flex w-full max-w-[820px] flex-col items-center gap-5 px-4 pt-16 pb-20 text-center sm:gap-6 sm:px-6 sm:pt-28 sm:pb-32">
					{/* Partner program pill link - single pill on mobile, divided pill on desktop */}
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

					<h1 className="text-balance font-satoshi text-3xl text-primary-foreground leading-[1.1] tracking-tight sm:text-[44px] sm:leading-[1.05] lg:text-display-xl">
						Turn traffic into revenue
					</h1>

					<p className="max-w-md text-pretty text-neutral-500 text-sm leading-relaxed sm:max-w-155 sm:text-body-lg sm:leading-snug">
						Edge is the Shopify app suite for higher order value, better
						conversion rate, and revenue that repeats.
					</p>

					<div className="mt-2 flex flex-row items-center justify-center gap-2.5 sm:mt-4 sm:gap-3">
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
					</div>
				</div>
			</Frame>
		</section>
	);
}
