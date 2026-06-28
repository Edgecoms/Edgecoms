import { ButtonLink } from "@edgecoms/ui/components/button";
import { ArrowRight } from "lucide-react";
import type { Metadata, Route } from "next";
import { PageHeader } from "@/components/marketing/page-header";

export const metadata: Metadata = {
	title: "About — Edge",
	description:
		"Edge builds thoughtfully crafted Shopify apps and a partner program that rewards the people who grow great merchants. Your edge starts here.",
};

const values = [
	{
		title: "Craft over clutter",
		description:
			"Every app does one job exceptionally well. No feature bloat, no dark patterns — software that respects the merchant and the shopper.",
	},
	{
		title: "Aligned incentives",
		description:
			"Partners earn when merchants succeed. We win together, over the long term, or not at all.",
	},
	{
		title: "Calm and considered",
		description:
			"We move deliberately and build for durability. The boring guarantees — correctness, clarity, trust — are the ones that matter.",
	},
] as const;

export default function AboutPage() {
	return (
		<>
			<section className="relative w-full overflow-hidden">
				<div className="mx-auto w-full max-w-7xl px-6 pt-32 pb-16">
					<PageHeader
						eyebrow="About Edge"
						lead="Edge is a studio of Shopify apps and the platform that fronts them. We help merchants sell more and convert better — and we pay the partners who bring them to us, for the long haul."
						title="A Shopify growth platform, built with intention."
					/>
				</div>
			</section>

			<section className="relative w-full">
				<div className="mx-auto w-full max-w-7xl px-6 pb-24">
					<div className="grid grid-cols-1 gap-12 border-border border-t pt-16 lg:grid-cols-3">
						<h2 className="font-medium text-h2 text-primary-foreground tracking-tight">
							What we believe
						</h2>
						<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:col-span-2">
							{values.map((value) => (
								<div className="flex flex-col gap-2" key={value.title}>
									<h3 className="font-medium text-h3 text-primary-foreground">
										{value.title}
									</h3>
									<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
										{value.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="relative w-full">
				<div className="mx-auto w-full max-w-7xl px-6 pb-32">
					<div className="flex flex-col items-start gap-6 rounded-[2rem] border border-border bg-page p-10 sm:p-16">
						<p className="max-w-3xl text-balance font-medium text-display text-primary-foreground">
							Your edge starts here.
						</p>
						<div className="flex flex-wrap items-center gap-3">
							<ButtonLink
								className="rounded-full"
								href={"/products" as Route}
								size="xl"
								variant="primary"
							>
								Explore the suite
								<ArrowRight aria-hidden="true" />
							</ButtonLink>
							<ButtonLink
								className="rounded-full"
								href={"/partners" as Route}
								size="xl"
								variant="secondary"
							>
								Become a Partner
							</ButtonLink>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
