/**
 * The stack Edge plugs into, for the ticker under the hero.
 *
 * This is the honest version of a logo wall. A "trusted by" strip needs
 * customers who have agreed to be named; until those exist, the same slot can
 * carry something that is true today and answers the question a merchant
 * actually has at that moment — *will this work with what I already run?*
 *
 * RULE: every entry here must be backed by a `worksWith` claim on at least one
 * app in `products.ts`. If an integration is dropped there, drop it here. A
 * ticker that names a platform the apps do not actually support is the same
 * false claim as a borrowed customer logo, just harder to spot.
 *
 * When real merchant logos do exist, they belong in this slot instead: swap the
 * `<span>` in the ticker for a `next/image` of a mark in `public/logos/`, get
 * the file from the merchant rather than off their storefront, and get the
 * permission in writing first.
 */
export interface Integration {
	/** Rendered in the ticker. Keep it to the name a merchant would recognise. */
	name: string;
	/** Which app claims it, so the backing claim is traceable from here. */
	provenance: string;
}

export const INTEGRATIONS: readonly Integration[] = [
	{ name: "Shopify Markets", provenance: "edge-currency" },
	{ name: "Shop Pay", provenance: "edge-subscriptions" },
	{ name: "Meta Conversions API", provenance: "trackproof" },
	{ name: "Google Ads", provenance: "trackproof" },
	{ name: "TikTok Events API", provenance: "trackproof" },
	{ name: "Klaviyo", provenance: "edge-reviews" },
	{ name: "Shopify Payments", provenance: "edge-currency" },
	{ name: "Google Shopping", provenance: "edge-reviews" },
	{ name: "Consent Mode v2", provenance: "trackproof" },
	{ name: "OS 2.0 themes", provenance: "edge-bundles" },
] as const;
