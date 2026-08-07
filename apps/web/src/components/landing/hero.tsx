import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { GridField } from "@/components/landing/frame";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-white">
			<GridField className="[mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />

			<div className="mx-auto flex w-full max-w-[820px] flex-col items-center gap-8 px-6 pt-20 pb-24 text-center sm:pt-28 sm:pb-32">
				{/* The partner program is a second audience, so it gets the
				    announcement rail rather than the headline. */}
				<Link
					className="group flex items-center gap-2 rounded-full border border-neutral-200 bg-white p-1 pl-4 text-[13px] shadow-sm"
					href={"/partners" as Route}
				>
					<span className="font-medium text-neutral-900">
						Introducing the Edge Partner Program
					</span>
					<span className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-neutral-500 transition-colors group-hover:text-neutral-900">
						Read more
						<ArrowUpRight aria-hidden="true" className="size-3" />
					</span>
				</Link>

				<h1 className="text-balance font-medium text-[42px] text-neutral-900 leading-[1.05] tracking-[-0.03em] sm:text-[64px]">
					Turn traffic into revenue
				</h1>

				<p className="max-w-[620px] text-pretty text-[19px] text-neutral-500 leading-relaxed sm:text-[21px]">
					Edge is the Shopify app suite for higher order value, better
					conversion rate, and revenue that repeats.
				</p>

				<div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row">
					<Link
						className="flex h-11 items-center justify-center rounded-lg bg-neutral-900 px-6 font-medium text-[15px] text-white transition-colors hover:bg-neutral-800"
						href={"/products" as Route}
					>
						Explore the suite
					</Link>
					<a
						className="flex h-11 items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 font-medium text-[15px] text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
						href={BOOKING_URL}
						rel="noopener"
						target="_blank"
					>
						{BOOKING_LABEL}
					</a>
				</div>
			</div>
		</section>
	);
}
