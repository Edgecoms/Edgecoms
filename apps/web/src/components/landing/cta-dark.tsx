import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { GridField } from "@/components/landing/frame";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";

const PRIMARY_CLASS =
	"flex h-11 items-center justify-center rounded-lg bg-white px-6 font-medium text-[15px] text-neutral-900 transition-colors hover:bg-neutral-200";

/**
 * The closing panel, with its notch.
 *
 * Everything is optional and defaults to the house copy, because eight
 * surfaces render this band and only one of them (the Edge Cart landing page,
 * which takes paid traffic and has to close on its own offer) says something
 * different. Forking the component would have meant two copies of the SVG
 * notch, and the notch is the part nobody wants to maintain twice.
 */
export function CtaDark({
	heading = "Supercharge the traffic you already have",
	primaryExternal = false,
	primaryHref = "/products",
	primaryLabel = "Explore the suite",
	secondary,
	sub = "See why Shopify brands run Edge to raise order value, lift conversion, and keep customers coming back.",
}: {
	heading?: string;
	/** Leaves the site, so it needs an anchor rather than a `Link`. */
	primaryExternal?: boolean;
	primaryHref?: string;
	primaryLabel?: string;
	/**
	 * Replaces the booking link. A node rather than an href because the Edge
	 * Cart page opens a dialog here rather than navigating.
	 */
	secondary?: ReactNode;
	sub?: string;
} = {}) {
	return (
		<section className="relative isolate overflow-hidden bg-neutral-950">
			{/* The white tongue: the page surface continuing down into the dark
			    panel. Drawn rather than done with border-radius because the curve
			    has to ease in and out of the flat edge on both sides. */}
			<svg
				aria-hidden="true"
				className="absolute inset-x-0 top-0 h-[72px] w-full"
				preserveAspectRatio="none"
				viewBox="0 0 1440 72"
			>
				<title>Section divider</title>
				<path
					d="M0 0 H520 C570 0 570 72 620 72 H820 C870 72 870 0 920 0 H1440 V0 Z"
					fill="#ffffff"
				/>
			</svg>

			<GridField
				className="opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_20%,transparent_90%)]"
				dark
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_120%,rgba(22,163,74,0.14),transparent)]"
			/>

			<div className="relative mx-auto flex w-full max-w-[720px] flex-col items-center gap-8 px-6 pt-40 pb-32 text-center">
				<h2 className="text-balance font-medium text-[38px] text-white leading-[1.05] tracking-[-0.03em] sm:text-[52px]">
					{heading}
				</h2>

				<p className="max-w-[520px] text-pretty text-[18px] text-neutral-400 leading-relaxed">
					{sub}
				</p>

				<div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row">
					{primaryExternal ? (
						<a
							className={PRIMARY_CLASS}
							href={primaryHref}
							rel="noopener noreferrer"
							target="_blank"
						>
							{primaryLabel}
						</a>
					) : (
						<Link className={PRIMARY_CLASS} href={primaryHref as Route}>
							{primaryLabel}
						</Link>
					)}
					{secondary ?? (
						<a
							className="flex h-11 items-center justify-center rounded-lg bg-white/10 px-6 font-medium text-[15px] text-white transition-colors hover:bg-white/20"
							href={BOOKING_URL}
							rel="noopener"
							target="_blank"
						>
							{BOOKING_LABEL}
						</a>
					)}
				</div>
			</div>
		</section>
	);
}
