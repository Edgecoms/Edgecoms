import type { Provenance } from "@/lib/content";

/**
 * SOCIAL PROOF: TESTIMONIALS, REVIEWS, AND WHAT WE CAN HONESTLY CLAIM TODAY.
 *
 * Separated from the rest of the copy because it is the highest-risk content on
 * the site. A fabricated testimonial is not filler — it is a false advertising
 * claim, and in the UK/EU it is also a banned practice under the CPRs (Schedule
 * 1) to state that a product has been endorsed when it has not, or to publish
 * reviews without taking reasonable steps to check they are genuine.
 *
 * So a quote here has to clear TWO independent gates before it renders:
 *
 *   provenance === "verified"   — a real person really said this
 *   permission  === "granted"   — and agreed to it appearing on a public page
 *
 * Both, not either. A genuine quote used without permission is still a problem,
 * and a permissioned quote we invented is worse. Anything failing either gate
 * shows in development only, so the layout can be designed against realistic
 * content without that content ever reaching a production build.
 */

/**
 * Whether the person has agreed to be quoted publicly, by name, here.
 *
 * `"pending"` is the important state: it means they said something nice in a
 * DM and nobody has asked yet. That is the most common way a fake-looking
 * testimonial ends up on a real site.
 */
export type Permission = "granted" | "none" | "pending";

export interface Testimonial {
	/** Their photo, once you have it and they have agreed to it. */
	avatar: string | null;
	/** ISO date the quote was given, so a stale one can be found and refreshed. */
	collectedAt: string | null;
	/** Stable key. Also names the avatar file: `/images/testimonials/<id>.webp`. */
	id: string;
	/** Full name. Only ever a real one — never invent a person. */
	name: string;
	permission: Permission;
	provenance: Provenance;
	quote: string;
	/** Out of five, if they gave one. `null` when they only wrote prose. */
	rating: number | null;
	/** Role and company, e.g. "Founder, Aurient". */
	role: string;
	/** Where it came from — an email, a call, a form. Your audit trail. */
	source: string | null;
}

const MAX_RATING = 5;

/**
 * PLACEHOLDERS. Every entry below is invented and unpermissioned, and therefore
 * renders in development only.
 *
 * Names are deliberately absent (`name: ""`) rather than made up, so nothing
 * here can be mistaken for a real person who could be looked up and found not
 * to exist. When you collect a real one: replace the quote, add the person's
 * name and role, set `provenance: "verified"` and `permission: "granted"`, and
 * record where it came from.
 */
export const TESTIMONIALS: readonly Testimonial[] = [
	{
		avatar: null,
		collectedAt: null,
		id: "fragrance-founder",
		name: "",
		permission: "none",
		provenance: "invented",
		quote:
			"I had been treating conversion rate and order value as one problem. Splitting them the way module one does showed me I had been working on the wrong half all year.",
		rating: 5,
		role: "Founder, home fragrance brand",
		source: null,
	},
	{
		avatar: null,
		collectedAt: null,
		id: "apparel-manager",
		name: "",
		permission: "none",
		provenance: "invented",
		quote:
			"The product page module alone would have been worth paying for. We reordered the page the way it teaches and the change held through a full season.",
		rating: 5,
		role: "Ecommerce manager, apparel",
		source: null,
	},
	{
		avatar: null,
		collectedAt: null,
		id: "agency-founder",
		name: "",
		permission: "none",
		provenance: "invented",
		quote:
			"I now run the same audit on every client store in week one. It has replaced about four separate documents we used to maintain.",
		rating: 4,
		role: "Founder, agency",
		source: null,
	},
	{
		avatar: null,
		collectedAt: null,
		id: "supplements-growth",
		name: "",
		permission: "none",
		provenance: "invented",
		quote:
			"The measurement module ended an argument my team had been having for two quarters. We were both wrong, and the holdout proved it.",
		rating: 5,
		role: "Head of growth, supplements",
		source: null,
	},
	{
		avatar: null,
		collectedAt: null,
		id: "single-product-owner",
		name: "",
		permission: "none",
		provenance: "invented",
		quote:
			"I came for the paid traffic module and got the most value out of retention, which I had been ignoring completely.",
		rating: 4,
		role: "Owner, single-product store",
		source: null,
	},
	{
		avatar: null,
		collectedAt: null,
		id: "shopify-freelancer",
		name: "",
		permission: "none",
		provenance: "invented",
		quote:
			"I could always build the thing. This taught me how to argue for which thing to build, which is what clients actually pay for.",
		rating: 5,
		role: "Freelancer, Shopify development",
		source: null,
	},
] as const;

/** Real AND cleared to publish. Both gates, deliberately. */
export function isPublishable(testimonial: Testimonial): boolean {
	return (
		testimonial.provenance === "verified" &&
		testimonial.permission === "granted"
	);
}

/** What may actually ship. Placeholders survive in development only. */
export const VISIBLE_TESTIMONIALS: readonly Testimonial[] = TESTIMONIALS.filter(
	(testimonial) =>
		isPublishable(testimonial) || process.env.NODE_ENV === "development"
);

/** How many are genuinely publishable, regardless of environment. */
export const REAL_TESTIMONIAL_COUNT = TESTIMONIALS.filter(isPublishable).length;

export interface AggregateRating {
	average: number;
	count: number;
}

/**
 * The star summary, COMPUTED from real ratings and never written by hand.
 *
 * Returns `null` below a floor of four, for two reasons: an "average" of one
 * review is not an average, and Google's review-snippet policy expects an
 * aggregate to represent a real body of opinion. A hardcoded "4.8★" next to
 * three reviews is exactly the kind of claim that earns a manual action.
 */
const MIN_RATINGS_FOR_AVERAGE = 4;

export function aggregateRating(): AggregateRating | null {
	const rated = TESTIMONIALS.filter(
		(testimonial) => isPublishable(testimonial) && testimonial.rating !== null
	);

	if (rated.length < MIN_RATINGS_FOR_AVERAGE) {
		return null;
	}

	const total = rated.reduce(
		(sum, testimonial) => sum + (testimonial.rating ?? 0),
		0
	);

	return {
		average: Math.round((total / rated.length) * 10) / 10,
		count: rated.length,
	};
}

export { MAX_RATING };

/**
 * WHAT WE CAN HONESTLY SAY TODAY, with no students at all.
 *
 * This is the answer to "a new course has no social proof". Borrowed authority
 * is real authority: Edgecoms builds Shopify apps that run on live storefronts,
 * and that is checkable, unlike a student count. Each line below is a claim the
 * company can defend from its own product work.
 *
 * TODO(launch): if any Edge app has a real, public App Store rating, that is
 * the single strongest honest number available — add it here with
 * `provenance: "verified"` and a link to the listing.
 */
export const AUTHORITY_POINTS: readonly string[] = [
	"We build Shopify apps that run on live merchant storefronts",
	"Conversion rate and average order value are our day job, not a side interest",
	"Everything taught here is something we run ourselves first",
	"We show the workings, so you can check them rather than trust us",
] as const;

/** The Edge apps, named. Real products, and the most concrete proof we have. */
export const EDGE_APPS: readonly string[] = [
	"Edge Bundles",
	"Edge Cart",
	"Edge Timer",
	"Edge Reviews",
	"Edge Subscriptions",
	"Edge Currency",
	"Trackproof",
] as const;
