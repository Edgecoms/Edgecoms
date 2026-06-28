/**
 * The Edge app catalog for the marketing site. Mirrors the seeded catalog in
 * `@edgecoms/db` (6 apps) with marketing copy. Kept here so server components
 * render it without a DB round-trip.
 */
export interface EdgeProduct {
	category: string;
	description: string;
	name: string;
	slug: string;
	tagline: string;
}

export const EDGE_PRODUCTS: readonly EdgeProduct[] = [
	{
		slug: "edge-bundles",
		name: "Edge Bundles",
		category: "Average order value",
		tagline: "Curated bundles that lift order value.",
		description:
			"Increase average order value with curated, ready-to-buy product bundles that feel native to your store.",
	},
	{
		slug: "edge-timer",
		name: "Edge Timer",
		category: "Conversion",
		tagline: "Urgency that converts, not annoys.",
		description:
			"Create urgency naturally with countdowns that turn browsers into buyers — without the cheap tricks.",
	},
	{
		slug: "edge-reviews",
		name: "Edge Reviews",
		category: "Trust",
		tagline: "Social proof from real customers.",
		description:
			"Build trust with verified customer reviews, photos, and ratings that surface at the right moment.",
	},
	{
		slug: "edge-cart",
		name: "Edge Cart",
		category: "Checkout",
		tagline: "A faster path to checkout.",
		description:
			"A frictionless slide cart with upsells, progress bars, and a checkout that removes every last hesitation.",
	},
	{
		slug: "edge-currency",
		name: "Edge Currency",
		category: "International",
		tagline: "Sell globally, priced locally.",
		description:
			"Automatic local pricing and currency conversion so shoppers everywhere see prices that feel like home.",
	},
	{
		slug: "edge-subscriptions",
		name: "Edge Subscriptions",
		category: "Recurring revenue",
		tagline: "Recurring revenue, merchant-friendly.",
		description:
			"Grow predictable revenue with flexible subscriptions, customer portals, and dunning that recovers churn.",
	},
] as const;
