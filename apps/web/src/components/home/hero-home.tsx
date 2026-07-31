import { ButtonLink } from "@edgecoms/ui/components/button";
import type { Route } from "next";
import Link from "next/link";

export function HeroHome() {
	return (
		<section className="relative isolate flex min-h-[calc(100svh-var(--header-height))] w-full items-center justify-center overflow-hidden">
			{/* Decorative dot field. Radix alpha token so it tracks light/dark, and
			    an elliptical mask so the grid fades out instead of hitting a hard
			    edge at the viewport bounds. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a4)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_45%,black_25%,transparent_78%)]"
			/>

			<div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center sm:gap-8 sm:py-24">
				{/* Announcement pill — keeps the partner program one click from the
				    fold without letting it take over a merchant-facing page. */}
				<Link
					className="group inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-page px-4 py-1.5 text-caption text-secondary-foreground transition-colors hover:bg-surface-item-hover"
					href={"/partners" as Route}
				>
					<span className="truncate">
						Partner program · earn recurring commission on every store you bring
					</span>
					<span className="shrink-0 text-primary-foreground underline decoration-border underline-offset-4 group-hover:decoration-current">
						Learn more
					</span>
				</Link>

				<h1 className="text-balance font-medium text-display text-primary-foreground sm:text-display-lg lg:text-display-xl">
					The apps your store needs, built to work as one
				</h1>

				<p className="max-w-2xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
					Bundles, cart, reviews, subscriptions, currency, urgency. Six focused
					Shopify apps from one team — one bill, one design language, one place
					to get help.
				</p>

				<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
					<ButtonLink
						className="h-11 rounded-full px-6 text-[15px]"
						href={"/products" as Route}
						size="xl"
						variant="brand"
					>
						Explore the suite
					</ButtonLink>
					<ButtonLink
						className="h-11 rounded-full px-6 text-[15px]"
						href={"/contact" as Route}
						size="xl"
						variant="secondary"
					>
						Talk to us
					</ButtonLink>
				</div>
			</div>
		</section>
	);
}
