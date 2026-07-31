import { ButtonLink } from "@edgecoms/ui/components/button";
import type { Route } from "next";
import { Highlight } from "@/components/ui/highlight";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";

/* Deliberately all true, all checkable. Note what is NOT here: "free plan on
   every app". Edge Timer's real App Store listing starts at $4.99, so that
   claim is false, and a merchant discovers it one click later. The house
   figures — store count, average rating — live in the numbers band further
   down, where they read as a stats block rather than as a claim smuggled under
   the fold. */
const TRUST_LINE = [
	"Free plans on most apps",
	"Billed through Shopify",
	"Cancel from your admin",
] as const;

/**
 * The hero sits on the page surface rather than on a brand-filled panel. A
 * full-bleed orange block competes with the headline for attention and leaves
 * the brand colour with nothing left to mean further down the page — so orange
 * is spent only where it should pull a click (the primary button, the metric
 * badges) and on the single closing CTA panel.
 */
export function HeroHome() {
	return (
		<section className="relative isolate w-full overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a4)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_38%,black_20%,transparent_78%)]"
			/>

			{/* Height is padding-driven on mobile and viewport-driven from `sm` up.
			    Forcing 100svh on a 375px screen would push the buttons and the trust
			    line below the fold, which is the opposite of what the hero is for.
			    The deduction from `sm` up stops the hero owning a whole viewport.
			    Centred content in a full-height box puts an equal band of dead space
			    above and below it, and the band below was reading as a gap rather
			    than as breathing room. Short enough now that the proof row peeks at
			    the fold and pulls the scroll. */}
			<div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 pt-20 pb-6 text-center sm:min-h-[calc(100svh-var(--header-height)-18rem)] sm:justify-center sm:gap-8 sm:pt-16 sm:pb-4">
				{/* No announcement pill. The partner program is a second audience, and
				    putting it above the headline made a merchant-facing hero open with
				    a message not aimed at the merchant. It is still reachable from the
				    header, the footer, and the closing CTA. */}
				<h1 className="text-balance font-medium text-display text-primary-foreground sm:text-display-lg lg:text-display-xl">
					<Highlight>Same traffic. Higher AOV.</Highlight>
				</h1>

				<p className="max-w-2xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
					Seven Shopify apps that move the only two numbers your revenue is made
					of: how many visitors buy, and how much each one spends. You already
					paid for the traffic, so this is about getting more out of it.
				</p>

				<div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
					<ButtonLink
						className="h-11 rounded-full px-6 text-[15px]"
						href={"/products" as Route}
						size="xl"
						variant="brand"
					>
						Browse the apps
					</ButtonLink>
					<ButtonLink
						className="h-11 rounded-full px-6 text-[15px]"
						href={BOOKING_URL as Route}
						rel="noopener"
						size="xl"
						target="_blank"
						variant="secondary"
					>
						{BOOKING_LABEL}
					</ButtonLink>
				</div>

				<ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-caption text-secondary-foreground">
					{TRUST_LINE.map((item, index) => (
						<li className="flex items-center gap-3" key={item}>
							{index > 0 ? (
								<span aria-hidden="true" className="text-[var(--gray-7)]">
									·
								</span>
							) : null}
							{item}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
