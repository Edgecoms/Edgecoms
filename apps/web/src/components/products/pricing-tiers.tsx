import { ButtonLink } from "@edgecoms/ui/components/button";
import type { Route } from "next";
import type { PricingTier } from "@/lib/products";

/**
 * The middle tier carries the emphasis when there are three, because that is
 * where a merchant who has already decided to pay ends up. With one or two
 * tiers nothing is emphasised — there is no decision to nudge.
 */
function isFeatured(tiers: readonly PricingTier[], index: number): boolean {
	return tiers.length === 3 && index === 1;
}

/**
 * Not every app has a free tier — Edge Timer's real listing starts at $4.99 —
 * so the closing line is derived rather than asserted. A blanket "the free plan
 * is probably enough" under a price list with no free plan reads as carelessness
 * at best.
 */
export function hasFreeTier(tiers: readonly PricingTier[]): boolean {
	return tiers.some((tier) => tier.price.toLowerCase().startsWith("free"));
}

export function PricingTiers({
	tiers,
	title,
}: {
	tiers: readonly PricingTier[];
	title: string;
}) {
	const gridCols = tiers.length === 1 ? "sm:grid-cols-1" : "sm:grid-cols-3";

	return (
		<section aria-labelledby="pricing-heading" className="w-full pb-16">
			<div className="mx-auto w-full max-w-7xl px-6">
				<div className="flex flex-col gap-4">
					<h2
						className="max-w-2xl text-balance font-medium text-display text-primary-foreground"
						id="pricing-heading"
					>
						{title}
					</h2>
					<p className="max-w-2xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
						Billed through Shopify, on the invoice you already get. Change tier
						or cancel from your Shopify admin, the same way you would for any
						other app.
					</p>
				</div>

				<div
					className={`mt-12 grid grid-cols-1 gap-px border border-border bg-border ${gridCols}`}
				>
					{tiers.map((tier, index) => (
						<div
							className={`flex flex-col gap-4 p-8 sm:p-10 ${isFeatured(tiers, index) ? "bg-page" : "bg-bg"}`}
							key={tier.name}
						>
							<div className="flex items-center gap-2">
								<span className="font-medium text-body-sm text-brand">
									{tier.name}
								</span>
								{isFeatured(tiers, index) ? (
									<span className="rounded-full bg-brand/12 px-2 py-0.5 font-medium font-mono text-[10px] text-brand uppercase tracking-[0.08em]">
										Most picked
									</span>
								) : null}
							</div>

							<span className="font-medium text-display text-primary-foreground tabular-nums">
								{tier.price}
								{tier.priceNote ? (
									<span className="ml-0.5 font-normal text-body-lg text-secondary-foreground">
										{tier.priceNote}
									</span>
								) : null}
							</span>

							<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
								{tier.includes}
							</p>
						</div>
					))}
				</div>

				<div className="mt-8 flex flex-wrap items-center gap-4">
					<ButtonLink
						className="h-11 rounded-full px-6 text-[15px]"
						href={"/contact" as Route}
						size="xl"
						variant="secondary"
					>
						Ask us which tier you need
					</ButtonLink>
					<span className="text-body-sm text-secondary-foreground">
						{hasFreeTier(tiers)
							? "We will tell you if the free plan is enough. It usually is at the start."
							: "Tell us your monthly traffic and we will point at the tier that fits, rather than the expensive one."}
					</span>
				</div>
			</div>
		</section>
	);
}
