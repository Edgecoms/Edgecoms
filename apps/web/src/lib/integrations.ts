/**
 * The platforms Edge plugs into, for the logo row under the hero.
 *
 * This is the honest version of a "trusted by" wall. That needs customers who
 * have agreed to be named; until those exist, the same slot can carry something
 * true today that answers the question a merchant actually has at that moment:
 * will this work with what I already run?
 *
 * Entries are brands, not features. "Consent Mode v2", "Shopify Markets" and
 * "TikTok Events API" are real things we support, but none of them has a mark
 * of its own — as logos they are just Google, Shopify and TikTok. The
 * feature-level claims live in the `worksWith` chips on each app page, which is
 * where somebody checking compatibility in detail will actually look.
 *
 * RULE: every entry here must be backed by a `worksWith` claim on at least one
 * app in `products.ts`. A row of logos for platforms we do not really support is
 * the same false claim as a borrowed customer logo, and harder to spot.
 *
 * TRADEMARKS: using these marks to state factual compatibility is normal and
 * legitimate. Two conditions: use each brand's own official asset rather than
 * something traced or redrawn, and do not restyle it beyond the uniform
 * greyscale treatment the row applies to all of them.
 */
export interface Integration {
	/**
	 * Official mark under `public/logos/`. Until it is set, the row falls back to
	 * the brand name as a wordmark, so the section works today and upgrades file
	 * by file. See the README in that folder for where each asset comes from.
	 */
	logo?: string;
	/** Alt text, and the wordmark rendered until `logo` is filled in. */
	name: string;
	/** Which app claims it, so the backing claim stays traceable from here. */
	provenance: string;
	/** Rendered width in px at the row's height. Marks are optically sized. */
	width?: number;
}

/*
 * Shop Pay was dropped as its own entry: it is a Shopify product and the
 * Shopify mark already stands for it, so a separate tile was one more thing to
 * read for no extra information.
 *
 * Klaviyo has no mark here yet — its logo is not published as a standalone
 * file anywhere we could take it from cleanly, so it renders as a wordmark
 * until somebody pulls the asset from the Klaviyo brand kit.
 */
export const INTEGRATIONS: readonly Integration[] = [
	{
		name: "Shopify",
		logo: "/logos/shopify.svg",
		width: 40,
		provenance: "edge-currency",
	},
	{
		name: "Meta",
		logo: "/logos/meta.svg",
		width: 40,
		provenance: "trackproof",
	},
	{
		name: "Google",
		logo: "/logos/google.svg",
		width: 40,
		provenance: "trackproof",
	},
	{
		name: "TikTok",
		logo: "/logos/tiktok.svg",
		width: 40,
		provenance: "trackproof",
	},
	{ name: "Klaviyo", provenance: "edge-reviews" },
] as const;
