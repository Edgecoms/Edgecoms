/**
 * The Edge app catalog for the marketing site. Mirrors the seeded catalog in
 * `@edgecoms/db` (6 apps) with marketing copy. Kept here so server components
 * render it without a DB round-trip.
 */
export interface EdgeProduct {
	/** Concrete things the app does, for the product page. Three or four. */
	capabilities: readonly string[];
	category: string;
	description: string;
	name: string;
	slug: string;
	tagline: string;
}

export const EDGE_PRODUCTS: readonly EdgeProduct[] = [
	{
		slug: "edge-bundles",
		capabilities: [
			"Mix-and-match sets with per-variant rules",
			"Tiered discounts that update live in the cart",
			"Frequently-bought-together built from real order history",
			"Renders inside your theme — no popup, no overlay",
		],
		name: "Edge Bundles",
		category: "Average order value",
		tagline: "Turn one item in the cart into three.",
		description:
			"Mix-and-match sets, tiered discounts, and frequently-bought-together that reflects what your customers actually buy together. Renders inside your theme, not in a popup.",
	},
	{
		slug: "edge-cart",
		capabilities: [
			"Slide cart that opens without a page load",
			"Free-shipping progress and threshold nudges",
			"One-tap upsells that stay above the checkout button",
			"Sticky checkout bar on mobile",
		],
		name: "Edge Cart",
		category: "Checkout",
		tagline: "The shortest path from cart to paid.",
		description:
			"A slide cart that opens instantly, free-shipping progress that nudges without nagging, and one-tap upsells that never push the checkout button off-screen.",
	},
	{
		slug: "edge-reviews",
		capabilities: [
			"Automated post-purchase review requests",
			"Photo and video reviews from verified buyers",
			"Product page, collection grid, and Google rich results",
			"Moderation queue with reply-in-thread",
		],
		name: "Edge Reviews",
		category: "Trust",
		tagline: "Proof, exactly where the doubt happens.",
		description:
			"Verified reviews with photos, collected by automated post-purchase requests and surfaced on the product page, the collection grid, and Google's rich results.",
	},
	{
		slug: "edge-timer",
		capabilities: [
			"Scheduled start and end, timezone-aware",
			"Dispatch-cutoff and restock countdowns",
			"Product, collection, and cart placements",
			"Disappears on its own the moment it expires",
		],
		name: "Edge Timer",
		category: "Urgency",
		tagline: "Urgency you won't be embarrassed by.",
		description:
			"Countdowns tied to real deadlines — a sale ending, the cutoff for next-day dispatch, a restock. Scheduled, timezone-aware, and gone the moment they expire.",
	},
	{
		slug: "edge-currency",
		capabilities: [
			"Automatic currency detection by region",
			"Rounding rules that avoid prices like $47.83",
			"A switcher that inherits your theme styles",
			"Runs alongside Shopify Markets, not against it",
		],
		name: "Edge Currency",
		category: "International",
		tagline: "Every shopper sees a price that feels local.",
		description:
			"Automatic currency detection, rounding rules that avoid $47.83, and a switcher that matches your theme. Works with Shopify Markets instead of fighting it.",
	},
	{
		slug: "edge-subscriptions",
		capabilities: [
			"Flexible intervals, prepaid, and gift plans",
			"Customer portal with skip, swap, and pause",
			"Dunning that retries failed payments before churn",
			"Retention and churn reporting per plan",
		],
		name: "Edge Subscriptions",
		category: "Recurring revenue",
		tagline: "Revenue that shows up without a new sale.",
		description:
			"Flexible plans, a portal that lets customers skip instead of cancel, and dunning that recovers failed payments before they turn into churn.",
	},
] as const;
