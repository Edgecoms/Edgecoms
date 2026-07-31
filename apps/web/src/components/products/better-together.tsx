import { GridMarkers } from "@/components/home/grid-markers";

/* The argument for the suite over six point solutions. Each one names the two
   apps involved, because a vague "they integrate" claim is worth nothing. */
const PAIRINGS = [
	{
		body: "Cart and Bundles share one view of the cart, so a bundle offer never fights the upsell already on screen — and the two never double-discount the same line.",
		title: "Bundles knows what's in the cart",
	},
	{
		body: "Subscriptions tells Reviews when a recurring order actually ships, so the review request lands after delivery rather than after billing.",
		title: "Reviews knows what a subscriber received",
	},
	{
		body: "Bundles, Cart, and Subscriptions all read the same detected currency. A shopper never sees a bundle priced in one currency and a cart total in another.",
		title: "Currency prices every surface at once",
	},
	{
		body: "A countdown attached to a bundle expires with that bundle. No orphaned timer promising a deal the cart will refuse to honour.",
		title: "Timer expires with the offer it belongs to",
	},
	{
		body: "Trackproof reports the purchase server-side with the offer that produced it attached, so an AOV lift you see in Shopify is the same lift your ad platform is optimising toward.",
		title: "Trackproof measures what the others changed",
	},
	{
		body: "Conversion rate, average order value, and revenue per visitor are reported in one place across every app — instead of four dashboards that each claim credit for the same order.",
		title: "One number for revenue per visitor, not four",
	},
] as const;

export function BetterTogether() {
	return (
		<section
			aria-labelledby="together-heading"
			className="relative w-full scroll-mt-24 py-24"
			id="better-together"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a3)_1px,transparent_1px)] [background-size:22px_22px]"
			/>

			<div className="mx-auto w-full max-w-7xl px-6">
				<div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
					<h2
						className="text-balance font-medium text-display text-primary-foreground"
						id="together-heading"
					>
						Better together
					</h2>
					<p className="text-pretty text-body-lg text-secondary-foreground leading-relaxed">
						Seven apps from seven vendors can only sit next to each other, and
						they will double-discount the same line and claim credit for the
						same order. These were built by one team, so they actually talk —
						which is behaviour you cannot assemble out of point solutions.
					</p>
				</div>

				<div className="relative mt-16">
					<div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2">
						{PAIRINGS.map((pairing) => (
							<div
								className="flex flex-col gap-3 bg-bg p-8 sm:p-10"
								key={pairing.title}
							>
								<h3 className="text-balance font-medium text-h3 text-primary-foreground">
									{pairing.title}
								</h3>
								<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
									{pairing.body}
								</p>
							</div>
						))}
					</div>

					<GridMarkers cols={2} rows={3} />
				</div>
			</div>
		</section>
	);
}
