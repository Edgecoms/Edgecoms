import { ButtonLink } from "@edgecoms/ui/components/button";
import type { Route } from "next";
import Link from "next/link";
import { BrandPanel } from "@/components/marketing/brand-panel";

export function HeroHome() {
	return (
		<section className="w-full px-3 pb-3">
			{/* Inset panel rather than a full-bleed band, so the page background
			    still frames it and the corners can round. Height tracks the
			    viewport minus the sticky header and this wrapper's own padding. */}
			<BrandPanel className="flex min-h-[calc(100svh-var(--header-height)-0.75rem)] w-full items-center justify-center">
				<div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center sm:gap-8 sm:py-28">
					{/* Announcement pill — keeps the partner program one click from the
					    fold without letting it take over a merchant-facing page. */}
					<Link
						className="group inline-flex max-w-full items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-caption text-white transition-colors hover:bg-white/20"
						href={"/partners" as Route}
					>
						<span className="truncate">
							Partner program · earn recurring commission on every store you
							bring
						</span>
						<span className="shrink-0 underline decoration-white/50 underline-offset-4 group-hover:decoration-current">
							Learn more
						</span>
					</Link>

					<h1 className="text-balance font-medium text-display text-white sm:text-display-lg lg:text-display-xl">
						The apps your store needs, built to work as one
					</h1>

					<p className="max-w-2xl text-pretty text-body-lg text-white leading-relaxed">
						Bundles, cart, reviews, subscriptions, currency, urgency. Six
						focused Shopify apps from one team — one bill, one design language,
						one place to get help.
					</p>

					<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
						<ButtonLink
							className="h-11 rounded-full bg-white px-6 text-[15px] text-neutral-900 hover:bg-white/90 active:bg-white/90"
							href={"/products" as Route}
							size="xl"
							variant="secondary"
						>
							Explore the suite
						</ButtonLink>
						<ButtonLink
							className="h-11 rounded-full border border-white/40 bg-white/10 px-6 text-[15px] text-white hover:bg-white/20 active:bg-white/20"
							href={"/contact" as Route}
							size="xl"
							variant="tertiary"
						>
							Talk to us
						</ButtonLink>
					</div>
				</div>
			</BrandPanel>
		</section>
	);
}
