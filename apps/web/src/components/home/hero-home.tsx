import { ButtonLink } from "@edgecoms/ui/components/button";
import type { Route } from "next";

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
				<p className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.14em]">
					Seven apps. One platform.
				</p>

				<h1 className="text-balance font-medium text-display text-primary-foreground sm:text-display-lg lg:text-display-xl">
					Everything your Shopify store needs to sell more
				</h1>

				<p className="max-w-2xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
					Edge is a suite of thoughtfully crafted Shopify apps that help
					merchants sell more, convert better, and grow with confidence.
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
						href={"/partners" as Route}
						size="xl"
						variant="secondary"
					>
						Become a partner
					</ButtonLink>
				</div>
			</div>
		</section>
	);
}
