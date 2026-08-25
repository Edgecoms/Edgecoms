/**
 * ALL COPY AND CONTENT FOR THE COURSE SITE, IN ONE FILE.
 *
 * Two rules carried over from the main marketing site, because they are worth
 * keeping and this deployment has no other guardrail:
 *
 * 1. PROSE NEVER STATES A HARD NUMBER. Figures render only through the
 *    structured fields below, so an unsourced claim cannot hide inside a
 *    paragraph where nobody thinks to check it.
 * 2. ANYTHING UNPROVEN IS FLAGGED. `provenance: "invented"` means a placeholder
 *    that must be replaced with something defensible or deleted before launch.
 *    A fabricated student result is a false-advertising claim, not filler.
 */

export type Provenance = "invented" | "third-party" | "verified";

/**
 * THE PLACEHOLDER GATE.
 *
 * Everything below flagged `invented` renders in development, so the design can
 * be reviewed with realistic content in place, and renders NOWHERE in a
 * production build. That asymmetry is deliberate and load-bearing.
 *
 * A fabricated student testimonial is not lorem ipsum — it is a false
 * advertising claim, and this course currently has no students to quote. The
 * same goes for "300+ students enrolled". Flagging them in a comment was not
 * enough: nothing read the flag, so an invented figure rendered identically to
 * a verified one and was one `git push` away from being a public claim.
 *
 * To go live with real content: replace the entries, set their `provenance` to
 * `"verified"`, and the gate stops applying to them.
 */
export const SHOW_UNVERIFIED = process.env.NODE_ENV === "development";

/** Keeps only what is safe to publish: verified always, invented in dev only. */
export function publishable<T extends { provenance: Provenance }>(
	items: readonly T[]
): readonly T[] {
	return items.filter(
		(item) => item.provenance === "verified" || SHOW_UNVERIFIED
	);
}

/* ── The offer ───────────────────────────────────────────────────────────── */

/**
 * The list price, shown struck through above the free offer.
 *
 * ⚠️ LEGAL NOTE — READ BEFORE LAUNCH.
 * A struck-through price is a "reference price" claim. Under FTC guidance (and
 * the equivalent UK/EU rules on price comparisons) a former price must be one
 * the product was ACTUALLY offered at, openly and for a reasonable period. If
 * this course has never sold at this figure, striking it through is deceptive.
 *
 *   SHOW_STRUCK_PRICE = true   → "$̶4̶9̶9̶  Free", and the heading reads
 *                                "It was $499. Now it's free."  Only honest
 *                                once it has genuinely been sold at $499.
 *   SHOW_STRUCK_PRICE = false  → no struck figure anywhere, and the heading
 *                                reads "Free while it's in beta." Claims
 *                                nothing about any past price.
 *
 * The flag now governs EVERY place the old price appears — hero, signup,
 * closing CTA and sticky bar — through the shared `PriceTag` component. It
 * previously gated two strings while four components rendered the struck
 * figure unconditionally, so turning it off left the crossed-out price on
 * screen and simply removed the sentence that explained it.
 */
export const LIST_PRICE = "$499";

/** Set by request. See the warning above before this ships. */
export const SHOW_STRUCK_PRICE = true;

export const CURRENT_PRICE = "Free";

/* ── Numbers ─────────────────────────────────────────────────────────────── */

export interface Stat {
	label: string;
	provenance: Provenance;
	value: string;
}

/**
 * The band under the hero. EVERY FIGURE IS INVENTED — replace or delete the
 * band. An empty space is cheaper than a retraction.
 */
export const COURSE_STATS: readonly Stat[] = [
	{ label: "students enrolled", provenance: "invented", value: "300+" },
	{ label: "modules, taught in sequence", provenance: "verified", value: "10" },
	{ label: "hours of video", provenance: "invented", value: "12+" },
] as const;

/** What the hero band may actually show. See `publishable`. */
export const VISIBLE_STATS = publishable(COURSE_STATS);

/* ── Curriculum ──────────────────────────────────────────────────────────── */

export interface CourseModule {
	/** TODO(launch): replace with the real lesson count once filmed. */
	lessons: number;
	summary: string;
	title: string;
}

export const COURSE_MODULES: readonly CourseModule[] = [
	{
		lessons: 5,
		summary:
			"Revenue per visitor is conversion rate times average order value. Learn to read your own store as that equation, so every decision after this one has a number attached to it.",
		title: "The revenue equation",
	},
	{
		lessons: 4,
		summary:
			"Who actually buys from you, what they were trying to solve, and the words they use for it. Research you can finish in a week, not a quarter.",
		title: "Customer research that pays for itself",
	},
	{
		lessons: 5,
		summary:
			"What you sell, how it is packaged, and why the same product at the same price converts differently depending on how it is framed.",
		title: "Offer and positioning",
	},
	{
		lessons: 6,
		summary:
			"The page most of your traffic lands on and most of it leaves from. Structure, imagery, proof, objection handling, and the order they need to appear in.",
		title: "The product page",
	},
	{
		lessons: 5,
		summary:
			"Where the drop-off actually happens, how to measure it properly, and what to change first. Cart, shipping, payment, and the recovery flows behind them.",
		title: "Cart and checkout",
	},
	{
		lessons: 5,
		summary:
			"Bundles, volume tiers, and post-purchase offers. Raising what each buyer spends without touching the price of your hero product or training customers to wait for a discount.",
		title: "Raising average order value",
	},
	{
		lessons: 6,
		summary:
			"Paid acquisition without setting money on fire. Creative, testing structure, budget discipline, and knowing when a channel is genuinely done.",
		title: "Traffic that pays back",
	},
	{
		lessons: 6,
		summary:
			"Email, SMS, and subscriptions. Turning one purchase into a second, because the second one costs you nothing in ad spend.",
		title: "Retention and repeat revenue",
	},
	{
		lessons: 5,
		summary:
			"Attribution, cohorts, and holdouts. How to tell which of the last ten things you changed actually moved the number, and how to stop arguing about it.",
		title: "Measurement and attribution",
	},
	{
		lessons: 4,
		summary:
			"The operating cadence that keeps growth compounding: what to review weekly, what to leave alone, what to hire for, and what to automate.",
		title: "Scaling the system",
	},
] as const;

/* ── Sections ────────────────────────────────────────────────────────────── */

export interface Inclusion {
	body: string;
	emoji: string;
	title: string;
}

export const COURSE_INCLUSIONS: readonly Inclusion[] = [
	{
		body: "Ten modules taught in sequence, each building on the equation from the first. Watch at your own pace, rewatch whenever.",
		emoji: "🎓",
		title: "The full video curriculum",
	},
	{
		body: "Real stores pulled apart on camera — what is working, what is leaking revenue, and what we would change first.",
		emoji: "🔍",
		title: "Store teardowns",
	},
	{
		body: "The spreadsheets we use ourselves: the revenue model, the offer canvas, the testing tracker, the retention audit.",
		emoji: "📊",
		title: "Templates and calculators",
	},
	{
		body: "A private space to ask questions, post your numbers, and get eyes on your store from people solving the same problems.",
		emoji: "💬",
		title: "Community access",
	},
	{
		body: "A live session every month to work through whatever is actually blocking people that month. Recorded if you cannot make it.",
		emoji: "🎥",
		title: "Monthly live Q&A",
	},
	{
		body: "Ecommerce moves. When a module goes out of date we refilm it, and you get the new version at no extra cost.",
		emoji: "♾️",
		title: "Lifetime updates",
	},
] as const;

/**
 * The qualifier list.
 *
 * Deliberately mixed: the first few work for someone who has not launched yet,
 * the rest for someone already trading. A list that assumes a running store
 * quietly tells half the audience the course is not for them, which is exactly
 * the flaw the old hero headline had.
 */
export const COURSE_PAIN_POINTS: readonly string[] = [
	"I do not know where to start, and every guide contradicts the last one",
	"I have watched hours of free videos and still cannot say what to do on Monday",
	"People visit my store and leave without buying, and I do not know why",
	"I am paying more for traffic every month and keeping less of it",
	"Customers buy once and I never hear from them again",
	"I cannot tell which of the things I changed actually made a difference",
	"I want one order to follow, not another list of tactics",
] as const;

export interface Audience {
	body: string;
	title: string;
}

export const COURSE_AUDIENCE: readonly Audience[] = [
	{
		body: "Running a store that already sells, and wanting the next stage to come from something other than more ad spend.",
		title: "Store owners",
	},
	{
		body: "Selling growth work to clients and wanting one defensible framework behind every recommendation you make.",
		title: "Agencies and freelancers",
	},
	{
		body: "Owning the number internally, and needing to argue for changes with evidence rather than opinion.",
		title: "Marketing managers",
	},
	{
		body: "Comfortable shipping the change, less comfortable deciding which change is worth shipping.",
		title: "Developers moving into growth",
	},
	{
		body: "Early enough that the decisions are still cheap to make, and worth making in the right order.",
		title: "Founders pre-launch",
	},
	{
		body: "Anyone who would rather understand why something works than collect another folder of screenshots.",
		title: "Anyone tired of tactics",
	},
] as const;

export const COURSE_COMPARISON = {
	ours: [
		"Built from operating real stores, not from other courses",
		"Every tactic tied to a metric you can check yourself",
		"Real store teardowns, numbers included",
		"Refilmed when it goes out of date, free forever",
		"A live session every month with the people who made it",
	],
	theirs: [
		"Recycled tactics repackaged every season",
		"Theory with no number attached to any of it",
		"Screenshots of somebody else's dashboard as proof",
		"Recorded once years ago and never touched again",
		"You are on your own the moment the payment clears",
	],
} as const;

/** Who is teaching. Claims Edgecoms can defend from its own product work. */
export const INSTRUCTOR_CREDENTIALS: readonly string[] = [
	"We build and maintain a suite of Shopify apps used on live storefronts",
	"Our work is conversion rate and average order value, every day, on real stores",
	"We see what happens after the tactic ships, not just the case study screenshot",
	"Everything taught here is something we run ourselves before we recommend it",
	"When we do not know, we say so — and we tell you how to find out",
] as const;

/* ── FAQ ─────────────────────────────────────────────────────────────────── */

export interface Faq {
	answer: string;
	question: string;
}

export const COURSE_FAQ: readonly Faq[] = [
	{
		answer:
			"Nothing. You give us your name, email and phone number, and we send you the access link. There is no card, no trial that converts into a charge, and nothing to cancel later.",
		question: "What's the catch? Why is it free?",
	},
	{
		answer:
			"Because we build Shopify apps, and the people who get value from this course tend to be exactly the people our apps are built for. Teaching the thinking first is a better introduction than an ad. You are never obliged to install anything.",
		question: "So what do you get out of it?",
	},
	{
		answer:
			"Your name, email and phone number, used to send you access and occasional updates about the course. We do not sell your details to anyone. You can unsubscribe from any email, and ask us to delete your record entirely, at any time.",
		question: "What will you do with my details?",
	},
	{
		answer:
			"We build and run Shopify apps used by real merchants, and we see the conversion and order-value data those stores produce. This course is the reasoning behind that work, written down in the order it is actually useful.",
		question: "Who is teaching it?",
	},
	{
		answer:
			"It is platform-agnostic in principle and Shopify-specific in the examples. The equation, the research, the offer design and the measurement all transfer. The click-by-click walkthroughs are filmed in Shopify.",
		question: "Do I need to be on Shopify?",
	},
	{
		answer:
			"None. If you have not launched, the early modules are the ones that decide whether your store works at all — research, offer, positioning, product page — and you will be making those decisions from a much better position than most people do. The measurement and paid traffic modules will be theory until you have visitors, and they will be waiting when you do.",
		question: "I have not launched yet. Is this still for me?",
	},
	{
		answer:
			"It should not be. Everything is in plain English, and where a term is unavoidable it gets defined the first time it appears. If you have run a store for a few years you will move faster through the first two modules, but the sequencing and the measurement material tend to be new to most people.",
		question:
			"Is it too basic if I already sell a bit, or too advanced if I don't?",
	},
	{
		answer:
			"It is self-paced and nothing expires, so it takes as long as you want it to. The modules are short enough to fit around a working day, and you can stop after the ones that apply to you and come back to the rest later.",
		question: "How long does it take?",
	},
	{
		answer:
			"Yes. Access does not expire and neither do the updates. When a module is refilmed you get the new version automatically.",
		question: "Is access really lifetime?",
	},
	{
		answer:
			"No. The course teaches the reasoning, and the reasoning applies whatever tools you use. Where an Edge app is the fastest way to implement something we will say so, and we will also tell you how to do it without one.",
		question: "Do I have to use Edge apps to apply this?",
	},
	{
		answer:
			"Yes, and it is a common way to use it. The templates and teardown format are built to be used on client stores, not just your own. Send your team the link.",
		question: "Can my whole team sign up?",
	},
] as const;

/* ── Privacy ─────────────────────────────────────────────────────────────── */

/**
 * The consent line under the form.
 *
 * Kept here because it is a legal statement, not decoration, and it has to stay
 * truthful to what `submitLead` actually stores: name, email, phone, a source
 * tag and timestamps. If the action starts collecting or sharing anything else,
 * this text changes in the same commit.
 *
 * TODO(launch): publish a privacy policy and set `PRIVACY_POLICY_HREF`. Under
 * UK/EU GDPR the notice must also name the data controller and a retention
 * period; both belong in that policy, and the link below is how this form
 * points at them.
 */
export const PRIVACY_POLICY_HREF: string | null = null;

export const PRIVACY_NOTICE =
	"We use your name, email and phone only to send your course access and occasional updates about it. Your phone number is a fallback for when email bounces, which is the single most common reason access never arrives. We never sell your details or pass them to anyone else, and you can unsubscribe or ask us to delete your record at any time by replying to any email or writing to hello@edgecoms.com.";
