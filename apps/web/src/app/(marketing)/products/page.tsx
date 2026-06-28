import { ButtonLink } from "@edgecoms/ui/components/button";
import { ArrowRight } from "lucide-react";
import type { Metadata, Route } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { EDGE_PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
	title: "Products — Edge",
	description:
		"A growing suite of thoughtfully crafted Shopify apps that help merchants sell more, convert better, and grow with confidence.",
};

export default function ProductsPage() {
	return (
		<>
			<section className="relative w-full overflow-hidden">
				<div className="mx-auto w-full max-w-7xl px-6 pt-32 pb-16">
					<PageHeader
						eyebrow="The Edge suite"
						lead="Nine focused apps, one coherent platform. Each one does a single job exceptionally well — and they're built to work better together."
						title="Built for modern commerce."
					/>
				</div>
			</section>

			<section className="relative w-full">
				<div className="mx-auto w-full max-w-7xl px-6 pb-24">
					<ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
						{EDGE_PRODUCTS.map((product) => (
							<li
								className="flex flex-col gap-3 bg-page p-8 transition-colors hover:bg-surface-item-hover"
								key={product.slug}
							>
								<span className="font-medium font-mono text-[11px] text-secondary-foreground uppercase tracking-[0.08em]">
									{product.category}
								</span>
								<h2 className="font-medium text-h3 text-primary-foreground">
									{product.name}
								</h2>
								<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
									{product.description}
								</p>
							</li>
						))}
					</ul>
				</div>
			</section>

			<section className="relative w-full">
				<div className="mx-auto w-full max-w-7xl px-6 pb-32">
					<div className="flex flex-col items-start gap-6 rounded-[2rem] border border-border bg-page p-10 sm:p-16">
						<h2 className="max-w-2xl text-balance font-medium text-h1 text-primary-foreground tracking-tight">
							One platform. Every stage of growth.
						</h2>
						<p className="max-w-xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
							Start with one app or run the whole suite. Edge grows with your
							merchants — from first sale to global scale.
						</p>
						<ButtonLink
							className="rounded-full"
							href={"/partners" as Route}
							size="xl"
							variant="primary"
						>
							Become a Partner
							<ArrowRight aria-hidden="true" />
						</ButtonLink>
					</div>
				</div>
			</section>
		</>
	);
}
