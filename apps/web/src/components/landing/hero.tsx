import { ButtonLink } from "@edgecoms/ui/components/button";
import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { GridField } from "@/components/landing/frame";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-white">
			{/* Halved on top of the mask. The grid is meant to say the page has a
			    structure, not to be read — at full strength the lines were competing
			    with the headline sitting on them. */}
			<GridField className="opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />

			<div className="mx-auto flex w-full max-w-[820px] flex-col items-center gap-6 px-6 pt-20 pb-24 text-center sm:pt-28 sm:pb-32">
				{/* The partner program is a second audience, so it gets the
				    announcement rail rather than the headline. */}
				{/* One surface with a hairline through it, rather than a chip sitting
				    inside a pill. The inner fill made "Read more" read as the button
				    and the announcement as its label — but the whole pill is the link,
				    and only one of the two halves was saying so. */}
				<Link
					className="group flex items-center gap-3 rounded-full border border-neutral-200 bg-white py-1.5 pr-3.5 pl-4 text-label shadow-sm"
					href={"/partners" as Route}
				>
					<span className="font-medium text-neutral-900">
						Introducing the Edge Partner Program
					</span>
					<span aria-hidden="true" className="h-4 w-px bg-neutral-200" />
					<span className="flex items-center gap-1 text-neutral-500 transition-colors group-hover:text-neutral-900">
						Read more
						<ArrowUpRight aria-hidden="true" className="size-3" />
					</span>
				</Link>

				<h1 className="text-balance text-[42px] text-primary-foreground leading-[1.05] tracking-tight sm:text-display-xl">
					Turn traffic into revenue
				</h1>

				<p className="max-w-155 text-pretty text-caption text-neutral-500 leading-snug sm:text-body-lg">
					Edge is the Shopify app suite for higher order value, better
					conversion rate, and revenue that repeats.
				</p>

				<div className="mt-4 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row">
					{/* `primary` and `secondary` already are the black fill and the
					    bordered white — the hand-rolled pair was reimplementing both,
					    minus the press scale and the focus ring. Only the height, radius
					    and type size are overridden here; `xl` is h-9, which is a UI
					    button rather than a hero one. */}
					<ButtonLink
						className="h-11 rounded-lg px-6 text-body-sm"
						href={"/products" as Route}
						size="xl"
						variant="primary"
					>
						Explore the suite
					</ButtonLink>
					<ButtonLink
						className="h-11 rounded-lg px-6 text-body-sm"
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
		</section>
	);
}
