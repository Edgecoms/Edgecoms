import { ButtonLink } from "@edgecoms/ui/components/button";
import { ArrowRight } from "lucide-react";
import type { Route } from "next";

const benefits = [
	{
		label: "Recurring revenue.",
		description: "Earn monthly commissions as your merchants grow with Edge.",
	},
	{
		label: "Dedicated platform.",
		description:
			"Register merchants, manage clients, and track payouts from one partner dashboard.",
	},
	{
		label: "Partner-first support.",
		description:
			"Priority assistance, early access to new products, and direct collaboration with the Edge team.",
	},
] as const;

export function PartnerHome() {
	return (
		<section className="relative w-full overflow-hidden">
			<div className="mx-auto flex min-h-[calc(100svh-var(--header-height))] w-full max-w-7xl items-center px-6 py-20">
				<div className="w-full rounded-[2rem] border border-border bg-white p-8 sm:p-12 lg:p-20">
					<div className="grid items-start gap-y-14 lg:grid-cols-2 lg:gap-x-16">
						{/* headline + cta */}
						<div className="flex flex-col items-start gap-8">
							<h2 className="text-balance font-medium text-h1 text-primary-foreground tracking-tight lg:text-display-xl">
								Partner with Edge.
							</h2>

							<ButtonLink
								className="rounded-full"
								href={"/partners" as Route}
								size="xl"
								variant="primary"
							>
								Explore Partner Program
								<ArrowRight aria-hidden="true" />
							</ButtonLink>
						</div>

						{/* benefits */}
						<div className="flex flex-col gap-10 lg:pl-8">
							{benefits.map((benefit) => (
								<div className="flex flex-col gap-2" key={benefit.label}>
									<h3 className="font-semibold text-[13px] text-primary-foreground uppercase tracking-[0.08em]">
										{benefit.label}
									</h3>
									<p className="max-w-sm text-pretty text-body-sm text-secondary-foreground leading-relaxed">
										{benefit.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
