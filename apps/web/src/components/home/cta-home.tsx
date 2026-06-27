import { ButtonLink } from "@edgecoms/ui/components/button";
import type { Route } from "next";

export function CtaHome() {
	return (
		<section className="relative w-full overflow-hidden">
			<div className="mx-auto flex w-full max-w-7xl items-center px-6 py-24 lg:py-32">
				<div className="flex w-full flex-col items-start justify-between gap-10 lg:flex-row lg:items-center lg:gap-16">
					<h2 className="max-w-2xl text-balance font-medium text-display text-primary-foreground tracking-tight lg:text-display-lg">
						One ecosystem. Endless possibilities.
					</h2>

					<div className="flex shrink-0 flex-wrap items-center gap-3">
						<ButtonLink
							className="rounded-full"
							href={"/partners" as Route}
							size="xl"
							variant="primary"
						>
							Become a Partner
						</ButtonLink>

						<ButtonLink
							className="rounded-full"
							href={"/products" as Route}
							size="xl"
							variant="secondary"
						>
							Explore Products
						</ButtonLink>
					</div>
				</div>
			</div>
		</section>
	);
}
