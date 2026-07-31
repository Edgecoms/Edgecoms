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
	/**
	 * Edge apps this merchant is actually running, verified from their own page
	 * source. This is the part of a case study that needs no permission to be
	 * accurate and no figure to be true: it is checkable by anyone who views
	 * source on the storefront.
	 */
	apps: readonly string[];
	/**
	 * Wide lifestyle or storefront shot, under `public/case-studies/`. The stat
	 * cards sit on top of it, so anything busy in the middle third will fight
	 * them — a room, a shelf or a flat-lay works better than a packshot.
	 */
	banner?: string;
	/** Named only once the merchant has agreed in writing to be named. */
	brand: string;
	category: string;
	/**
	 * The four narrative sections of a case study page. All optional: the page
	 * renders what exists, so a study can go live on the merchant and their stack
	 * alone and gain the story once you have interviewed them.
	 */
	challenge?: string;
	/**
	 * Product photography for the card, under `public/case-studies/`. Ask the
	 * merchant for it — a shot lifted off their storefront is their asset, used
	 * without permission, on a page that also claims them as a customer.
	 * Optional: without it the card falls back to a brand-tinted panel, so a
	 * case study with real numbers can ship before the photo exists.
	 */
	image?: string;
	/** Their wordmark, under `public/case-studies/`. Shown above the name. */
	logo?: string;
	overview?: string;
	/**
	 * True once the figures below are real and the merchant has agreed to be
	 * named. A published study renders everywhere. An unpublished one renders
	 * only where placeholders are allowed — see `SHOW_PLACEHOLDER_PROOF`.
	 */
	published: boolean;
	/**
	 * Measured outcomes. Optional on purpose: a card can ship with the merchant
	 * and their stack while the numbers are still being collected. Three at most,
	 * because a result band with six figures reads as noise.
	 */
	results?: readonly MarketingStat[];
	resultsCopy?: string;
	solution?: string;
	/** Two sentences: what they sell, what they ran, what moved. */
	summary?: string;
	timeframe?: string;
	title?: string;
	/** Their storefront. Used to verify the claim and to link the card. */
	url?: string;
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
	aurient: {
		apps: [
			"Edge Timer",
			"Edge Bundles",
			"Edge Cart",
			"Edge Subscriptions",
			"Edge Reviews",
			"Trackproof",
		],
		banner: "/case-studies/aurient-banner.png",
		brand: "Aurient",
		category: "Supplements",
		logo: "/case-studies/aurient-logo.png",
		title:
			"A supplement that needs twelve weeks to work, sold in a market with a one-bottle habit",
		summary:
			"Aurient sell a single daily formula for men. Their own product page is honest about the timeline: energy in weeks one to three, strength and recovery building through eight to twelve. That one sentence decides the whole commercial problem.",
		overview:
			"Aurient is a one-product brand. Muscle Peptide 185 is a non-hormonal daily formula, and everything on the storefront is built around a single decision rather than a catalogue. Their site reports more than ten thousand orders shipped and a sixty-day money-back guarantee, which tells you where they have chosen to carry the risk.",
		challenge:
			"A daily supplement only does anything if somebody takes it daily, for months. Aurient say so plainly on the page.\n\nThat makes the single-bottle order the worst outcome available: the customer spends money, stops before the formula has had time to work, concludes it did nothing, and never comes back.\n\nThe commercial problem is not the first sale. It is making the first order big enough to cover the window the product actually needs.",
		solution:
			"The whole suite, each app aimed at a different part of that. Bundles turns the default order from one bottle into a multi-month pack, so the first purchase covers the eight-to-twelve week window instead of falling short of it.\n\nSubscriptions is the cleanest answer of all, because a daily formula taken for months is a subscription whether or not anyone calls it one, and the moment to ask is while the customer is buying three. Cart catches the order that is already in progress, and Timer puts a deadline on a considered purchase people otherwise leave and forget. Reviews does the heaviest lifting, because a supplement is bought on trust and a stranger's photograph outperforms any claim the brand makes about itself.\n\nTrackproof sits underneath all of it: supplement acquisition on Meta is expensive, and a conversion the pixel misses is an ad set switched off for being unprofitable when it was not.",
		results: [
			{
				label:
					"Subscribe-and-save on a formula that needs eight to twelve weeks to work",
				provenance: "verified",
				value: "LTV",
			},
			{
				label: "Multi-month packs, so the first order covers the window",
				provenance: "verified",
				value: "AOV",
			},
			{
				label:
					"Server-side conversions, so Meta sees the sales it actually drove",
				provenance: "verified",
				value: "ROAS",
			},
		],
		published: false,
		url: "https://shopaurient.com",
	},
	vyssence: {
		apps: [
			"Edge Timer",
			"Edge Bundles",
			"Edge Cart",
			"Edge Subscriptions",
			"Edge Reviews",
		],
		banner: "/case-studies/vyssence-banner.png",
		brand: "Vyssence",
		category: "Beauty",
		logo: "/case-studies/vyssence-logo.png",
		title:
			"Beauty, where the second product is easier to sell than the second customer",
		summary:
			"Vyssence run five Edge apps together. In beauty that is not five separate decisions, it is one: raise the value of a first order from a customer you have already paid to acquire, then give them a reason to come back without paying for the click twice.",
		overview:
			"Vyssence is a beauty brand running most of the Edge suite on the storefront. Beauty is one of the most expensive categories to buy traffic in, which changes what a store should optimise for once someone has arrived.",
		challenge:
			"In a category where cost per acquisition keeps climbing, the cheapest revenue available is not a new customer. It is a bigger order from the one already on the page.\n\nMost beauty stores are set up the other way around: enormous effort on the ad, and a product page that sells exactly one item at exactly one price.",
		solution:
			"Bundles makes the second item part of the same decision rather than a separate visit, and Cart makes one more offer at the point the shopper has already committed.\n\nSubscriptions turns a routine product into a repeat one, which in beauty is the difference between a customer and a purchase. Reviews carries the trust load, which here means photographs from people with the same skin or hair rather than studio shots. Timer gives the whole thing a deadline, because a considered beauty purchase is the kind a shopper defers indefinitely if nothing asks them not to.",
		results: [
			{
				label:
					"A second product added inside the first decision, not a second visit",
				provenance: "verified",
				value: "AOV",
			},
			{
				label: "A routine product turned into a repeat one",
				provenance: "verified",
				value: "LTV",
			},
			{
				label: "Photo reviews from people with the same skin and hair",
				provenance: "verified",
				value: "CVR",
			},
		],
		published: false,
		url: "https://vyssence.com",
	},
	klyrolight: {
		apps: ["Edge Timer", "Edge Cart", "Edge Subscriptions", "Edge Reviews"],
		banner: "/case-studies/klyrolight-banner.png",
		brand: "Klyro Light",
		category: "Home",
		logo: "/case-studies/klyrolight-logo.png",
		title:
			"A considered home purchase, and the two apps that shorten the thinking",
		summary:
			"Klyro Light run four Edge apps. For a home product bought once and looked at every day afterwards, they answer the questions that actually lose the sale: is it good, why now, and is that everything I need.",
		overview:
			"Klyro Light is a home brand running four Edge apps. It is a category where the purchase is deliberate, the price point invites comparison, and the customer is going to live with the object.",
		challenge:
			"Home goods are researched. The shopper opens three tabs, compares, and returns to whichever store left them most confident.\n\nDeferral is the default outcome, and a store that gives no reason to decide today is choosing to be one of the tabs rather than the purchase.",
		solution:
			"Reviews with real photographs do the heavy work, because a lamp in a stranger's actual room answers a question no product shot can: what it looks like somewhere that is not a studio.\n\nTimer supplies the reason to stop comparing. Cart makes the last offer at the point of commitment, where a second lamp or a spare bulb is an easy yes rather than another decision.",
		results: [
			{
				label: "A deadline that ends the tab-comparing",
				provenance: "verified",
				value: "CVR",
			},
			{
				label: "One more offer at the point of commitment",
				provenance: "verified",
				value: "AOV",
			},
			{
				label: "The lamp photographed in somebody's actual room",
				provenance: "verified",
				value: "Trust",
			},
		],
		published: false,
		url: "https://klyrolight.com",
	},
	celorah: {
		apps: ["Edge Timer", "Edge Cart", "Edge Subscriptions", "Edge Reviews"],
		banner: "/case-studies/celorah-banner.jpg",
		brand: "Celorah",
		category: "Apparel",
		logo: "/case-studies/celorah-logo.png",
		title: "A free-gift offer with a deadline, built as one page",
		summary:
			"Celorah run a viral hoodie with the track pants free, today only. The whole offer, the pairing and the deadline together, is a single product page doing the work of a campaign.",
		overview:
			"Celorah is an apparel brand running four Edge apps. Their headline offer pairs a hero product with a second item free, on a stated deadline.",
		challenge:
			"Apparel has the sharpest version of the impulse problem. A shopper likes the hoodie, means to think about it, and does not come back. Meanwhile the store has paid for the visit either way.\n\nThe category also carries a size and fit objection that a product photograph on its own does not answer.",
		solution:
			"The offer and the urgency are built as one thing rather than bolted together. A free second item raises the order value without a discount code touching the hero product's price, and a real deadline turns intent to think about it into a decision today.\n\nReviews handles the fit question the way apparel actually gets bought now, which is by looking at the garment on somebody who is not a model.",
		results: [
			{
				label: "A free second item instead of a discount on the first",
				provenance: "verified",
				value: "AOV",
			},
			{
				label: "A stated deadline on a viral hero product",
				provenance: "verified",
				value: "CVR",
			},
			{
				label: "Fit answered by customer photos, before checkout",
				provenance: "verified",
				value: "Returns",
			},
		],
		published: false,
		url: "https://www.celorahshop.com",
	},
	jpetcentral: {
		apps: ["Edge Timer", "Edge Cart", "Edge Subscriptions"],
		banner: "/case-studies/jpetcentral-banner.jpg",
		brand: "J Pet Central",
		category: "Pets",
		logo: "/case-studies/jpetcentral-logo.png",
		title: "Pet supplies, where the customer already intends to buy",
		summary:
			"J Pet Central run Timer, Cart and Subscriptions. In a category where the shopper has already decided they need the thing, the job is not persuasion. It is scheduling, and then making sure the next one arrives without being asked for.",
		overview:
			"J Pet Central is a pet brand running Timer, Cart and Subscriptions.",
		challenge:
			"Pet owners are not usually deciding whether to buy. They are deciding when, and where from.\n\nThat makes the enemy deferral rather than doubt, and deferral is what sends a ready buyer to whichever store they happen to open next.",
		solution:
			"A deadline on a genuine promotion turns a purchase that was going to happen this month into one that happens today, on this store.\n\nSubscriptions then removes the decision entirely for the things that run out, which is most of what a pet owner buys. Nothing about the product has to change and no margin is given away on the everyday price.",
		results: [
			{
				label: "The things that run out, reordered without being asked for",
				provenance: "verified",
				value: "LTV",
			},
			{
				label: "Urgency used as scheduling, not persuasion",
				provenance: "verified",
				value: "CVR",
			},
			{
				label: "One more item at the moment of commitment",
				provenance: "verified",
				value: "AOV",
			},
		],
		published: false,
		url: "https://jpetcentral.com",
	},
	matataxplore: {
		apps: ["Edge Timer", "Edge Cart", "Edge Subscriptions"],
		banner: "/case-studies/matataxplore-banner.png",
		brand: "Matata Xplore",
		category: "Outdoor",
		logo: "/case-studies/matataxplore-logo.png",
		title: "Outdoor gear, where the season is the deadline",
		summary:
			"Matata Xplore run Timer, Cart and Subscriptions. Outdoor retail already has natural deadlines built into it, and a timer makes them visible.",
		overview:
			"Matata Xplore is an outdoor brand running Timer, Cart and Subscriptions.",
		challenge:
			"Outdoor gear sells against the calendar. Trips, seasons and weather create real cutoffs, and a shopper who misses one does not buy later, they do not buy at all.\n\nMost stores leave that urgency implicit and hope the customer feels it themselves.",
		solution:
			"A scheduled timer makes an existing deadline explicit, so the cutoff a shopper is vaguely aware of becomes a number counting down on the page.\n\nIt is the honest kind of urgency, because the deadline was already real.",
		results: [
			{
				label: "Season cutoffs made visible instead of implied",
				provenance: "verified",
				value: "CVR",
			},
			{
				label: "Repeat supply for the gear that gets used up",
				provenance: "verified",
				value: "LTV",
			},
			{
				label: "A larger first order before the trip, not after it",
				provenance: "verified",
				value: "AOV",
			},
		],
		published: false,
		url: "https://www.matataxplore.com",
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
		label: "of orders contain a single item, the biggest AOV leak there is",
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
