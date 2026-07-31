/**
 * EVERY NUMBER THE SITE CANNOT YET PROVE, IN ONE FILE.
 *
 * Nothing in here has been verified. It exists so the marketing pages can be
 * built and laid out now, and so replacing invented figures with real ones is a
 * single-file edit rather than a hunt through twenty components.
 *
 * Two kinds of unproven number live here, and they need different fixes:
 *
 * - `invented` — a claim about Edge or an Edge merchant that nobody has
 *   measured. Replace with a figure you can defend from Shopify analytics or a
 *   merchant's own dashboard, or delete the block that renders it.
 * - `third-party` — an industry statistic that is probably true but is
 *   currently uncited. Attach a real source (Baymard, Shopify, the platform's
 *   own docs) before launch, or drop it. An uncited "71% of orders are
 *   single-item" is a liability, not proof.
 *
 * RULE: prose on this site does not contain hard numbers. Numbers render only
 * through the structured fields below, so an unsourced figure can never hide
 * inside a paragraph where nobody thinks to check it.
 */

export type StatProvenance = "invented" | "third-party" | "verified";

export interface MarketingStat {
	/** Short caption under the figure. */
	label: string;
	/** Where the number came from, and therefore what has to happen before launch. */
	provenance: StatProvenance;
	/** Citation URL or internal note. Required before a `third-party` stat ships. */
	source?: string;
	/** Rendered verbatim — keep the unit in the string ("+27%", "3.4×", "< 4 hrs"). */
	value: string;
}

/**
 * The homepage numbers band. Four maximum: three real figures beat six invented
 * ones, because the invented ones only have to be caught once.
 */
export const HOUSE_STATS: readonly MarketingStat[] = [
	{ label: "Stores running Edge", provenance: "invented", value: "1,400+" },
	{
		label: "Merchant revenue influenced",
		provenance: "invented",
		value: "$12M+",
	},
	{ label: "Average App Store rating", provenance: "invented", value: "4.9★" },
	{ label: "Median support reply", provenance: "invented", value: "< 4 hrs" },
] as const;

/**
 * The headline result badge for each app, shown on the suite grid and the app
 * page hero. `provenance: "verified"` means the string states a capability
 * rather than a measured delta, so it needs no backing figure.
 */
export const APP_RESULT_BADGES: Readonly<Record<string, MarketingStat>> = {
	"edge-bundles": {
		label: "Average order value",
		provenance: "invented",
		value: "AOV +27%",
	},
	"edge-cart": {
		label: "Revenue per visitor",
		provenance: "invented",
		value: "RPV +19%",
	},
	"edge-currency": {
		label: "International conversion",
		provenance: "invented",
		value: "Intl. CVR +12%",
	},
	"edge-reviews": {
		label: "Product page conversion",
		provenance: "invented",
		value: "PDP CVR +15%",
	},
	"edge-subscriptions": {
		label: "Lifetime value",
		provenance: "invented",
		value: "LTV 3.4×",
	},
	"edge-timer": {
		label: "Conversion rate",
		provenance: "invented",
		value: "CVR +22%",
	},
	trackproof: {
		label: "Attribution",
		provenance: "verified",
		value: "Accurate ROAS",
	},
};

export interface CaseStudy {
	/** Anonymised until the merchant signs off on being named. */
	brand: string;
	category: string;
	/**
	 * Product photography for the card, under `public/case-studies/`. Ask the
	 * merchant for it — a shot lifted off their storefront is their asset, used
	 * without permission, on a page that also claims them as a customer.
	 * Optional: without it the card falls back to a brand-tinted panel, so a
	 * case study with real numbers can ship before the photo exists.
	 */
	image?: string;
	/**
	 * True once the figures below are real and the merchant has agreed to be
	 * named. A published study renders everywhere. An unpublished one renders
	 * only where placeholders are allowed — see `SHOW_PLACEHOLDER_PROOF`.
	 */
	published: boolean;
	/** Three at most — a result band with six figures reads as noise. */
	results: readonly MarketingStat[];
	/** Two sentences: what they sell, what they ran, what moved. */
	summary: string;
	timeframe: string;
	title: string;
}

/**
 * Whether unpublished case studies are shown.
 *
 * On in development, so the proof layout can be built and reviewed against
 * realistic content. Off in production builds, so an invented merchant result
 * cannot reach the live site by way of somebody forgetting a boolean.
 *
 * Set `NEXT_PUBLIC_SHOW_PLACEHOLDER_PROOF=true` to force it on somewhere else —
 * a preview deploy you want to show someone, for instance. Anywhere it is on,
 * unpublished cards carry a visible "Placeholder" badge, so a screenshot of a
 * preview can never be mistaken for a screenshot of the real thing.
 */
export const SHOW_PLACEHOLDER_PROOF =
	process.env.NEXT_PUBLIC_SHOW_PLACEHOLDER_PROOF === "true" ||
	process.env.NODE_ENV === "development";

/** Should this study render here at all? */
export function isCaseStudyVisible(study: CaseStudy): boolean {
	return study.published || SHOW_PLACEHOLDER_PROOF;
}

/**
 * One case study per app. ENTIRELY INVENTED — every brand, sentence, and figure
 * below is a placeholder for a real store's numbers.
 *
 * When you collect the real ones, ask "what did your AOV do in the first
 * month?" rather than "would you leave a review". You get the figure and the
 * quote in the same reply.
 */
export const CASE_STUDIES: Readonly<Record<string, CaseStudy>> = {
	"edge-bundles": {
		brand: "Brand A",
		published: false,
		category: "Home",
		timeframe: "60 days",
		title: "AOV +31% in 60 days",
		summary:
			"Placeholder. Two sentences on what they sell, which offer they ran, and what moved.",
		results: [
			{ label: "Average order value", provenance: "invented", value: "+31%" },
			{ label: "Attach rate", provenance: "invented", value: "24%" },
			{ label: "Time to payback", provenance: "invented", value: "9 days" },
		],
	},
	"edge-cart": {
		brand: "Brand B",
		published: false,
		category: "Apparel",
		timeframe: "45 days",
		title: "RPV +19% in 45 days",
		summary:
			"Placeholder. Two sentences on the offer rules they set and which one earned its place.",
		results: [
			{ label: "Revenue per visitor", provenance: "invented", value: "+19%" },
			{ label: "Offer acceptance", provenance: "invented", value: "6.9%" },
			{ label: "Cart abandonment", provenance: "invented", value: "−8%" },
		],
	},
	"edge-currency": {
		brand: "Brand C",
		published: false,
		category: "Beauty",
		timeframe: "90 days",
		title: "International CVR +12%",
		summary:
			"Placeholder. Two sentences on the markets they opened and what rounding changed.",
		results: [
			{
				label: "International conversion",
				provenance: "invented",
				value: "+12%",
			},
			{ label: "Non-domestic sessions", provenance: "invented", value: "34%" },
			{ label: "Price-confusion tickets", provenance: "invented", value: "0" },
		],
	},
	"edge-reviews": {
		brand: "Brand F",
		published: false,
		category: "Outdoor",
		timeframe: "90 days",
		title: "PDP CVR +15% on 2,100 photo reviews",
		summary:
			"Placeholder. Two sentences on when they asked, what they collected, and where it went.",
		results: [
			{
				label: "Product page conversion",
				provenance: "invented",
				value: "+15%",
			},
			{
				label: "Photo reviews collected",
				provenance: "invented",
				value: "2,100",
			},
			{ label: "Request response rate", provenance: "invented", value: "31%" },
		],
	},
	"edge-subscriptions": {
		brand: "Brand D",
		published: false,
		category: "Food & drink",
		timeframe: "6 months",
		title: "18% of revenue is now recurring",
		summary:
			"Placeholder. Two sentences on the plan they launched and what dunning recovered.",
		results: [
			{ label: "Revenue recurring", provenance: "invented", value: "18%" },
			{
				label: "Subscriber lifetime value",
				provenance: "invented",
				value: "3.4×",
			},
			{
				label: "Failed payments recovered",
				provenance: "invented",
				value: "62%",
			},
		],
	},
	"edge-timer": {
		brand: "Brand E",
		published: false,
		category: "Accessories",
		timeframe: "72-hour flash sale",
		title: "CVR +22% across a 72-hour flash sale",
		summary:
			"Placeholder. Two sentences on the deadline they set and how the store behaved around it.",
		results: [
			{ label: "Conversion rate", provenance: "invented", value: "+22%" },
			{
				label: "Versus normal daily orders",
				provenance: "invented",
				value: "3×",
			},
			{ label: "Setup time", provenance: "invented", value: "5 min" },
		],
	},
	trackproof: {
		brand: "Brand G",
		published: false,
		category: "Supplements",
		timeframe: "30 days",
		title: "24% more conversions reported",
		summary:
			"Placeholder. Reported ROAS before, reported ROAS after, and what they changed in spend as a result — that last part is the whole story. The value is not the number, it is the decision it unblocked.",
		results: [
			{ label: "Conversions reported", provenance: "invented", value: "+24%" },
			{
				label: "Reported ROAS gap closed",
				provenance: "invented",
				value: "0.4",
			},
			{ label: "Setup time", provenance: "invented", value: "15 min" },
		],
	},
};

/**
 * Industry statistics used in the app-page stat bars. Each one needs a citation
 * attached to `source` before launch — they are the kind of figure a sceptical
 * merchant will look up, and being wrong on one costs the credibility of all
 * the others on the page.
 */
export const INDUSTRY_STATS: Readonly<Record<string, MarketingStat>> = {
	cartAbandonment: {
		label: "of carts are abandoned, most of them to “later”",
		provenance: "third-party",
		source: "TODO: Baymard Institute cart abandonment index",
		value: "70%",
	},
	failedPaymentLoss: {
		label: "of subscription revenue is lost to failed cards",
		provenance: "third-party",
		source: "TODO: cite a payments/churn study",
		value: "9%",
	},
	localCurrencyPreference: {
		label: "of shoppers prefer to buy in their own currency",
		provenance: "third-party",
		source: "TODO: cite the cross-border commerce study",
		value: "92%",
	},
	mobileCheckout: {
		label: "of Shopify checkouts happen on a phone",
		provenance: "third-party",
		source: "TODO: cite Shopify commerce report",
		value: "80%",
	},
	pixelUnderreporting: {
		label: "of conversions go unreported with a browser pixel alone",
		provenance: "third-party",
		source: "TODO: cite Meta CAPI documentation or an attribution study",
		value: "Up to 30%",
	},
	retentionVsAcquisition: {
		label:
			"cheaper to grow an order than to buy the same revenue in new customers",
		provenance: "third-party",
		source: "TODO: cite the retention economics source",
		value: "5–25×",
	},
	reviewsBeforeBuying: {
		label: "of shoppers read reviews before they buy",
		provenance: "third-party",
		source: "TODO: cite the consumer review survey",
		value: "93%",
	},
	singleItemOrders: {
		label: "of orders contain a single item — the biggest AOV leak there is",
		provenance: "third-party",
		source: "TODO: cite the basket composition source",
		value: "71%",
	},
	subscriberLtv: {
		label: "the lifetime value of a subscriber versus a one-time buyer",
		provenance: "third-party",
		source: "TODO: cite the subscription LTV benchmark",
		value: "3.4×",
	},
};
