/**
 * Every claim the video makes about the Edge Partners program, with the source
 * that authorises it. This is money copy — a wrong line here is a payout
 * dispute, so nothing goes on screen that is not backed by the marketing site
 * or the invariants in CLAUDE.md.
 *
 * Slots the user must supply are exported as empty and rendered as empty.
 */

/** Sources: program-compare.tsx, partner-faq.tsx, how-it-works.tsx, CLAUDE.md. */
export const RULE_CARDS = [
	"Your rate is agreed when you're approved",
	"Frozen onto every commission at generation",
	"Paid on what Edge nets, not on gross",
	"Lifetime, while the merchant stays subscribed",
	"Apps the store already paid for are excluded",
	"No minimum store count, no quota",
] as const;

/**
 * Screen 4. The rotating noun in "Paid for every ___" — the three things a
 * commission actually attaches to. Source: the earnings-ledger and eligibility
 * sections of CLAUDE.md (one commission per earning event, recurring for as
 * long as the merchant stays subscribed, across every merchant you register).
 */
export const EARN_PREFIX = "Paid for every";
export const EARN_TRIGGERS = ["charge", "renewal", "merchant"] as const;

/**
 * The floating cards on screen 4 — the reasons to join, in the partner's words.
 * `mark` is the phrase the card highlights: never a rate or an amount, because
 * no such figure is authorised yet. Same provenance as RULE_CARDS.
 *
 * The grandfathered-apps rule is deliberately absent — it is a caveat, not a
 * reason to sign up, and belongs on a rules screen rather than this one.
 */
export const PAYOUT_CARDS = [
	{
		after: " for the life of the store",
		before: "Agree your rate once. It's ",
		label: "Locked in",
		mark: "frozen onto every payout",
	},
	{
		after: ", not once",
		before: "Get paid ",
		label: "Recurring",
		mark: "every month they stay",
	},
	{
		after: ". Just register the store you already manage",
		before: "",
		label: "Zero lift",
		mark: "No links, no codes",
	},
	{
		after: " in your dashboard, to the cent",
		before: "See ",
		label: "Transparent",
		mark: "every charge and commission",
	},
	{
		after: ", after Shopify's cut",
		before: "Paid on ",
		label: "Honest math",
		mark: "what Edge actually nets",
	},
	{
		after: " store count, no quota, no tiers",
		before: "",
		label: "No cap",
		mark: "No minimum",
	},
] as const;

/** The live app suite — icons in apps/web/public/app-icons. */
export const EDGE_APPS = [
	"Edge Timer",
	"Edge Reviews",
	"Edge Bundles",
	"Edge Cart",
	"Edge Currency",
	"Edge Subscriptions",
	"TrackProof",
] as const;

/** Published on the site as case studies, so cleared for on-screen use. */
export const MERCHANTS = [
	{ logo: "aurient-logo.png", name: "Aurient" },
	{ logo: "vyssence-logo.png", name: "Vyssence" },
	{ logo: "klyrolight-logo.png", name: "Klyro Light" },
	{ logo: "celorah-logo.png", name: "Celorah" },
	{ logo: "jpetcentral-logo.png", name: "JPet Central" },
	{ logo: "matataxplore-logo.png", name: "Matata Xplore" },
] as const;

/**
 * Screen 5 — the payouts dashboard.
 *
 * ILLUSTRATIVE, NOT AUTHORISED. The merchant names are real (published case
 * studies) but every figure below is invented to make the dashboard legible.
 * Nobody has signed these off, so they must be replaced with real numbers or
 * explicitly cleared as a mock before this video ships.
 *
 * The one thing they do guarantee is internal consistency: the monthly total is
 * derived from the rows rather than typed, so the screen can never show a total
 * that disagrees with the list under it.
 */
export const DEMO_ROW_AMOUNTS = [1240, 980, 745, 612, 438, 296] as const;
export const DEMO_MONTH_TOTAL = DEMO_ROW_AMOUNTS.reduce((a, b) => a + b, 0);
export const DEMO_LIFETIME_TOTAL = 28_940;

/** Sources: how-it-works.tsx, CLAUDE.md (Edge nets, then pays a monthly share). */
export const PAYOUTS_HEADLINE =
	"Automatic monthly\npayouts, calculated\nto the cent";

/**
 * Screen 6 — bounties. Every string here comes from section 7 of
 * apps/web/src/app/(home)/partners/page.tsx, which is live on the marketing
 * site, so it is already cleared copy, with the dash in the subline replaced
 * by a comma. The 10,000-view goal is the site's own example, not a rate.
 */
export const BOUNTY = {
	badge: "Reward earned",
	cta: "Learn more about bounties",
	goal: 10_000,
	headline: "Reward viral content",
	subline:
		"Reward partners for creating viral content, with support for\nvariable bonuses and earnings limits. Perfect for influencer\nand UGC campaigns.",
	title: "Get rewarded for YouTube views about Edge",
	unit: "views",
} as const;

/**
 * Screen 7 — the partner testimonial. An agency that runs Edge apps for the
 * merchants it manages and is enrolled in the Partners program.
 *
 * The quote is written from the brief; the lines are split here so the scene
 * reveals one at a time, and `markLine` is the line whose text is followed by
 * the highlighted phrase.
 *
 * ATTRIBUTION IS A STAND-IN, at the user's explicit direction (2026-08-15):
 * the partner, the agency and the portrait are invented, not a real person who
 * said this. Swap all four fields for a real, consenting partner before the
 * video is published anywhere a viewer would read it as a genuine endorsement.
 */
export const TESTIMONIAL = {
	avatar: "p2.jpg",
	lines: [
		"The Edge apps are genuinely useful for our",
		"agency. We recommend them to every",
		"merchant we manage. They earn more, and",
		"we're ",
		"through the Edge Partners program.",
	],
	mark: "earning right alongside them",
	/** Index into `lines` whose text is followed by `mark`. */
	markLine: 3,
	name: "Sofia Reyes",
	role: "Founder, Larkfield Commerce",
	tag: "Edge Partner",
} as const;

/**
 * Screen 8 — the close. Mirrors the site's own closing panel (CtaDark) so the
 * video ends on the surface a viewer lands on. The headline and subline are
 * written for partners rather than merchants, and claim nothing the earlier
 * screens have not already established.
 */
export const CLOSE = {
	headline: "Get paid for the stores\nyou already run",
	subline:
		"Register the merchants you manage, agree your rate,\nand earn every month they stay on Edge.",
	url: "edgecoms.com/partners",
} as const;

/**
 * Awaiting real values. Rendered as empty frames — never invented.
 * - `STATS`: referred MRR and partner payout figures.
 * - `LEADERBOARD`: partner names and amounts.
 * - `TESTIMONIALS`: tweets, payout emails, earnings screenshots.
 */
export const STATS: { label: string; value: number }[] = [];
export const LEADERBOARD: { amount: string; avatar: string; name: string }[] =
	[];
export const TESTIMONIALS: { handle: string; quote: string }[] = [];

/** Placeholder row count so the layout is real while the data is pending. */
export const LEADERBOARD_SLOTS = 4;
export const STAT_SLOTS = ["Referred MRR", "Your payout"] as const;
