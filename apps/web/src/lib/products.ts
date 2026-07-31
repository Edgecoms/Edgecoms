/**
 * The Edge app catalog for the marketing site — the single source of copy for
 * the suite grid, the /products bands, and every /products/[slug] page. Mirrors
 * the seeded catalog in `@edgecoms/db` (7 apps) and is kept here so server
 * components render it without a DB round-trip.
 *
 * Two rules hold across this file:
 *
 * 1. **Prose carries no hard numbers.** Every figure renders through the
 *    structured stat fields, which resolve against `marketing-stats.ts`, so an
 *    unverified claim can never hide inside a paragraph.
 * 2. **Every feature ends in the metric it moves.** A merchant does not buy a
 *    capability, they buy a movement in a number they already check.
 *
 * PRICING: only Edge Timer and Trackproof are live on the App Store, and only
 * their tiers are confirmed (`confirmed: true`). Everything else is a proposal
 * — publishing it commits you to it, so reconcile against the real listings
 * before launch.
 */

/** Which side of `RPV = CVR × AOV` an app pulls on. Drives the suite grouping. */
export type RpvLever = "aov" | "cvr" | "ltv" | "proof";

/**
 * One full-width block on an app page: eyebrow, headline, body, and a visual
 * that alternates sides down the page.
 *
 * Because each one is a whole section rather than a cell in a grid, `title` has
 * to carry a claim rather than name a capability — "Turn the single-item order
 * into a two-item order", not "Bundling". `body` gets two or three sentences to
 * land the mechanism, and `metric` is the eyebrow above it, so a merchant
 * scanning the page is really scanning a column of metrics and stops at the one
 * that is currently their problem.
 */
export interface AppFeature {
	body: string;
	/**
	 * Visual for this block, under `public/app-shots/`. Falls back to a tinted
	 * panel with the metric set in it, so the layout holds before the
	 * screenshots exist.
	 */
	image?: string;
	/** The metric the block moves. Rendered as the eyebrow. */
	metric: string;
	title: string;
}

export interface AppStep {
	body: string;
	title: string;
}

export interface AppFaq {
	answer: string;
	question: string;
}

export interface PricingTier {
	/** False = a proposal, not a shipped price. See the file header. */
	confirmed: boolean;
	includes: string;
	name: string;
	/** Rendered verbatim, so it carries its own unit: "Free", "$9.99". */
	price: string;
	priceNote?: string;
}

export interface AppTestimonial {
	/**
	 * Shown with the quote whenever the reviewer is not independent. Presenting
	 * a self-authored review as third-party proof is what App Store policy calls
	 * manipulation, so this is not optional when it applies.
	 */
	disclosure?: string;
	location: string;
	name: string;
	quote: string;
	rating: number;
}

export interface EdgeProduct {
	/**
	 * The live Shopify App Store listing. TODO: fill in for Edge Timer and
	 * Trackproof, which are both live today. While this is undefined the app page
	 * sends people to /contact instead of promising an install button that goes
	 * nowhere.
	 */
	appStoreUrl?: string;
	category: string;
	/** Closing line on the app page. */
	ctaHeading: string;
	description: string;
	eyebrow: string;
	faq: readonly AppFaq[];
	/** Six. Each ends in the metric it moves. */
	features: readonly AppFeature[];
	/** Sub-headline: the mechanism, in one sentence. */
	heroLead: string;
	/** The small trust line under the hero buttons. */
	heroTrust: readonly string[];
	how: readonly AppStep[];
	lever: RpvLever;
	/** Live on the Shopify App Store today. */
	live: boolean;
	/** The metric this app owns, spelled short: "AOV", "CVR". */
	metric: string;
	name: string;
	pricing: readonly PricingTier[];
	/**
	 * Keys into `INDUSTRY_STATS`. Currently unrendered — the problem stat bar was
	 * dropped from the app pages to match the reference format. Kept because the
	 * mapping is researched and cheap to hold, and because a stat bar is the
	 * obvious thing to reach for if the pages ever need a proof block above the
	 * features. Delete both this and `INDUSTRY_STATS` if that never happens.
	 */
	problemStats: readonly string[];
	/**
	 * A real screenshot of this app running, under `public/app-shots/`. When set,
	 * the journey explorer shows it instead of the schematic diagram.
	 *
	 * It has to be a shot of *our* app. A competitor's feature image dropped in
	 * here is both their copyright and a claim that their UI is ours — and the
	 * merchant who installs on the strength of it finds a different product.
	 * Until then the diagrams are the honest fill: they show what the app does
	 * without pretending to be a photograph of it.
	 *
	 * Good ones to take: Edge Cart's drawer with the free-shipping bar mid-fill,
	 * a Bundles offer on a real product page, a Timer on an announcement bar,
	 * the Trackproof health score with live events.
	 */
	screenshot?: string;
	/**
	 * True when `screenshot` is a stand-in rather than a shot of our own app —
	 * a comp pulled from elsewhere to judge the layout against.
	 *
	 * Comps render in development and are excluded from production builds, the
	 * same gate the placeholder case studies use. That way the intent to replace
	 * them is enforced by the build rather than remembered.
	 */
	screenshotIsComp?: boolean;
	slug: string;
	/** The H1 on the app page. Names the metric or the loss. */
	tagline: string;
	testimonial?: AppTestimonial;
	worksWith: readonly string[];
}

export const EDGE_PRODUCTS: readonly EdgeProduct[] = [
	{
		slug: "edge-bundles",
		name: "Edge Bundles",
		category: "Average order value",
		lever: "aov",
		live: false,
		metric: "AOV",
		screenshot: "/app-shots/edge-bundles.avif",
		screenshotIsComp: true,
		eyebrow: "Bundles, volume tiers & frequently-bought-together",
		tagline: "Raise AOV without touching ad spend.",
		heroLead:
			"Bundles, volume tiers, and frequently-bought-together offers that get a second item into the cart — no discount codes, no extra traffic, no new customers required.",
		heroTrust: ["Free plan", "Live in 10 minutes", "Any OS 2.0 theme"],
		description:
			"Most orders contain one item. Edge Bundles turns that single line into two or three with mix-and-match sets, volume tiers that show the saving as it grows, and pairings built from what your customers actually buy together.",
		problemStats: [
			"singleItemOrders",
			"retentionVsAcquisition",
			"cartAbandonment",
		],
		how: [
			{
				title: "Pick the products",
				body: "A fixed set, a volume tier, or let Edge pair them from your real order history instead of a guess.",
			},
			{
				title: "Set the offer",
				body: "Fixed price, percentage off, or buy-one-get-one. You see exactly what the shopper will see before it goes live.",
			},
			{
				title: "Place it and read the lift",
				body: "Product page, cart, or both. AOV and attach rate come back broken out per offer, so you know which one earned its place.",
			},
		],
		features: [
			{
				metric: "Average order value",
				title: "Turn the single-item order into a two-item order",
				body: "Most orders contain exactly one thing, and that is the cheapest revenue in your store to go after. A bundle puts the natural second item in front of the shopper while they are already deciding — as a fixed set, a mix-and-match, or a build-your-own box, with per-variant rules so it never offers a size you cannot ship.",
			},
			{
				metric: "AOV · units per order",
				title: "Let them watch the discount grow",
				body: "Volume tiers show the saving climbing as items go into the cart. The shopper is not reading about a deal, they are watching one happen, and the next tier is always close enough to be worth reaching for.",
			},
			{
				metric: "Attach rate",
				title: "Pair what your customers actually buy together",
				body: "Frequently-bought-together suggestions are built from your own order history, not a category guess made by someone who has never seen your catalog. The pairing that works in your store is usually not the one you would have picked.",
			},
			{
				metric: "Hours you get back",
				title: "One line on the order, correct stock underneath",
				body: "A bundle sells as a single SKU at a single price, while component inventory decrements individually behind it. Nothing to reconcile by hand, and no stock drift to discover at the end of the month.",
			},
			{
				metric: "Conversion rate",
				title: "It looks like your store, because it reads your theme",
				body: "Fonts, colours and spacing are pulled from your theme automatically, and every one of them is overridable. It renders inline on the page, never in a popup a shopper has to dismiss before they can buy.",
			},
			{
				metric: "Every number above",
				title: "See which offer earned its place",
				body: "Revenue, attach rate and average order value are broken out per bundle instead of blended into a single figure. You find out which offer is carrying the lift, and which one has been sitting there doing nothing since launch.",
			},
		],
		worksWith: [
			"Shopify Markets",
			"Shopify Discounts",
			"Edge Cart",
			"Edge Subscriptions",
			"Any OS 2.0 theme",
		],
		pricing: [
			{
				confirmed: false,
				name: "Free",
				price: "Free",
				includes: "Up to 50 bundle orders a month, every bundle type.",
			},
			{
				confirmed: false,
				name: "Growth",
				price: "$9.99",
				priceNote: "/mo",
				includes: "Unlimited bundles, per-offer AOV and attach-rate reporting.",
			},
			{
				confirmed: false,
				name: "Scale",
				price: "$24.99",
				priceNote: "/mo",
				includes: "Automatic pairing, A/B testing, priority support.",
			},
		],
		faq: [
			{
				question: "Will bundle pricing fight my discount codes?",
				answer:
					"No. You decide per offer whether a bundle stacks with codes or excludes them, so a promotion never accidentally discounts the same line twice.",
			},
			{
				question: "How much AOV lift is realistic?",
				answer:
					"It depends on your catalog and your margin, and anyone quoting you a single number has not seen your store. Below a few hundred orders a month, read the figure monthly rather than weekly — daily AOV on low volume is noise, not signal.",
			},
			{
				question: "Does inventory draw down correctly?",
				answer:
					"Yes. A bundle sells as one line to the customer, and component stock decrements individually behind it.",
			},
			{
				question: "Can I run bundles on one collection only?",
				answer:
					"Yes. Target by product, collection, tag, or country, so you only run offers where the margin supports them.",
			},
			{
				question: "Will this slow my product page down?",
				answer:
					"It ships as a Shopify App Block and renders with the page rather than loading a separate script over the network. Uninstalling leaves no code in your theme.",
			},
		],
		ctaHeading:
			"Your ad spend already bought the visitor. Get a bigger order out of them.",
	},
	{
		slug: "edge-cart",
		name: "Edge Cart",
		category: "Revenue per visitor",
		lever: "aov",
		live: false,
		metric: "RPV",
		eyebrow: "Slide cart & cart upsells",
		tagline: "The highest-intent moment in your funnel is doing nothing.",
		heroLead:
			"A slide cart that opens without a page load, upsells chosen by rule instead of by guess, and free-shipping progress that moves as they add — all at the one moment the shopper has already decided to buy.",
		heroTrust: ["Free plan", "No theme edits", "Reversible in one click"],
		description:
			"A cart page is a dead end that costs you a page load. A cart drawer is the last offer you get to make, to the one shopper in the store who has already said yes. Edge Cart turns it from storage into a surface.",
		problemStats: [
			"cartAbandonment",
			"mobileCheckout",
			"retentionVsAcquisition",
		],
		how: [
			{
				title: "Toggle it on",
				body: "It replaces your theme cart without a theme edit, and reverts just as fast if you change your mind.",
			},
			{
				title: "Set your rules",
				body: "Offer a different add-on to a small cart than to a large one, by cart contents, cart value, collection, or country.",
			},
			{
				title: "Read the acceptance rate",
				body: "Kill the offers nobody takes and scale the ones they do. Every offer reports its own acceptance rate and revenue per visitor.",
			},
		],
		features: [
			{
				metric: "Conversion rate",
				title: "Keep them in the store, not on a cart page",
				body: "A cart page costs you a page load and gives the shopper a fresh chance to leave. The drawer opens over the product they were just looking at, so reviewing the order never means navigating away from it.",
			},
			{
				metric: "AOV · attach rate",
				title: "Offer by rule, not by guess",
				body: "A forty-dollar cart and a two-hundred-dollar cart should not see the same add-on. Rules pick the offer from what is actually in the cart — its contents, its value, the collection, the country — so the suggestion is one this particular shopper might plausibly want.",
			},
			{
				metric: "Average order value",
				title: "A progress bar that moves while they watch",
				body: "Free-shipping progress fills in real time and shows exactly what is left to qualify. It is the oldest average-order-value lever in ecommerce and it still works, because it turns a threshold into something the shopper wants to finish.",
			},
			{
				metric: "AOV · margin",
				title: "One-tap add-ons at the margin you want",
				body: "Warranty, gift wrap and express shipping are accepted inside the drawer without restarting checkout. High margin, almost no friction, and never an extra screen between the shopper and paying you.",
			},
			{
				metric: "Conversion rate",
				title: "Answer the doubt where the doubt happens",
				body: "Payment icons, the returns policy and your guarantee sit in the drawer at the moment of commitment — not three scrolls up a page the shopper has already scrolled past.",
			},
			{
				metric: "Every number above",
				title: "Kill the offers nobody takes",
				body: "Acceptance rate, revenue per visitor and average order value report per offer rather than blended. An offer that is not working shows up as itself instead of hiding inside a comfortable average.",
			},
		],
		worksWith: [
			"Shop Pay & express checkouts",
			"Edge Bundles",
			"Edge Currency",
			"Edge Subscriptions",
			"Any OS 2.0 theme",
		],
		pricing: [
			{
				confirmed: false,
				name: "Free",
				price: "Free",
				includes: "Up to 200 cart sessions a month, full slide cart.",
			},
			{
				confirmed: false,
				name: "Growth",
				price: "$14.99",
				priceNote: "/mo",
				includes:
					"Unlimited sessions, rule-based upsells, per-offer reporting.",
			},
			{
				confirmed: false,
				name: "Scale",
				price: "$39.99",
				priceNote: "/mo",
				includes: "A/B testing, advanced targeting, priority support.",
			},
		],
		faq: [
			{
				question: "Does it replace my current cart?",
				answer:
					"Yes, and you can revert to your theme cart in one click. Nothing about the change is one-way.",
			},
			{
				question: "Do express checkout buttons still work?",
				answer:
					"Yes. Shop Pay, PayPal, and Apple Pay all carry through the drawer — an upsell never costs you a one-tap checkout.",
			},
			{
				question: "What acceptance rate should I expect?",
				answer:
					"Strong offers run in the single digits, and that is normal. If an offer is sitting near zero, the offer is wrong rather than the placement — swap the product before you change the rules.",
			},
			{
				question: "Can I run different offers per country?",
				answer:
					"Yes, targeting includes country, so you are not offering express shipping where you cannot deliver it.",
			},
			{
				question: "Is it fast on mobile?",
				answer:
					"It is built mobile-first, which is where the large majority of Shopify checkouts happen. The drawer opens without a network round-trip.",
			},
		],
		ctaHeading: "Make the cart earn its place in the funnel.",
	},
	{
		slug: "edge-timer",
		name: "Edge Timer",
		category: "Conversion rate",
		lever: "cvr",
		live: true,
		metric: "CVR",
		eyebrow: "Countdown timers & urgency",
		tagline: "Give them a deadline. Watch CVR move.",
		heroLead:
			"Countdown timers on any page — product, cart, announcement bar, collection — tied to deadlines that are actually real. Live in about five minutes, with no code and no theme edits.",
		heroTrust: ["From $4.99/mo", "Live in 5 minutes", "No code"],
		description:
			"“I'll come back later” is where conversion rate goes to die. A real deadline — a sale ending, a dispatch cutoff, a restock — turns later into now, and it is the cheapest CVR lever you have.",
		problemStats: ["cartAbandonment", "mobileCheckout", "reviewsBeforeBuying"],
		how: [
			{
				title: "Pick a placement",
				body: "Product page, cart, announcement bar, or collection. One app covers every surface rather than one app per surface.",
			},
			{
				title: "Set the clock",
				body: "A fixed date range for a real promotion, an evergreen timer that resets per visitor, or a trigger tied to a launch or restock.",
			},
			{
				title: "Style it and publish",
				body: "It picks up your theme's fonts and colours, and it removes itself the moment it expires.",
			},
		],
		features: [
			{
				metric: "Conversion rate",
				title: "Put a real deadline wherever the decision happens",
				body: "Product pages, cart, announcement bar and collection pages, from one app and one dashboard. Urgency belongs at the moment someone is deciding, not only on the page you happened to install it on first.",
			},
			{
				metric: "Conversion rate",
				title: "Evergreen for new visitors, fixed dates for real sales",
				body: "A fixed range for a promotion that genuinely ends, or a per-visitor countdown so someone arriving today sees a full clock instead of one that expired last month. Both are honest — they just do different jobs, and using the wrong one is how stores train shoppers to ignore them.",
			},
			{
				metric: "Hours you get back",
				title: "It starts and ends without you being awake",
				body: "Launches, restocks and seasonal peaks run on a schedule and respect timezones. The timer appears when the sale opens and takes itself down the moment it is over, which is the part everyone forgets to do manually.",
			},
			{
				metric: "Conversion rate",
				title: "It shouldn't look like something you installed",
				body: "Colours, fonts and layout are built in rather than bolted on. A countdown that reads as part of the page persuades; one that reads as an advert sitting on top of the page gets ignored.",
			},
			{
				metric: "Risk",
				title: "No code, and nothing left behind",
				body: "Everything is configured from a dashboard, with no theme edits at any point. Install and uninstall both leave your theme exactly as they found it — which is the thing you care about the first time you switch themes.",
			},
			{
				metric: "Margin",
				title: "Run urgency only where it pays for itself",
				body: "Target by collection so the discount behind the deadline lands on products whose margin can carry it, instead of running a sitewide sale you did not really mean to run.",
			},
		],
		worksWith: [
			"Any OS 2.0 theme",
			"Edge Cart",
			"Edge Bundles",
			"Shopify Markets",
		],
		pricing: [
			{
				confirmed: true,
				name: "Starter",
				price: "$4.99",
				priceNote: "/mo",
				includes: "10,000 monthly views, every placement.",
			},
			{
				confirmed: true,
				name: "Standard",
				price: "$7.99",
				priceNote: "/mo",
				includes: "50,000 monthly views.",
			},
			{
				confirmed: true,
				name: "Premium",
				price: "$14.99",
				priceNote: "/mo",
				includes: "Unlimited views, priority support.",
			},
		],
		testimonial: {
			quote:
				"Super solid app! It's clean, easy to configure, and does exactly what it says on the tin.",
			name: "Aurient",
			location: "USA",
			rating: 5,
			disclosure: "Aurient is a Shopify store operated by Edgecoms.",
		},
		faq: [
			{
				question: "Do I need a developer?",
				answer: "No. Everything is configured in the dashboard.",
			},
			{
				question: "What does evergreen mean?",
				answer:
					"The countdown resets per visitor, so someone landing on the page for the first time today sees a full clock rather than one that expired last month.",
			},
			{
				question: "Does urgency actually lift conversion rate?",
				answer:
					"On genuine deadlines, yes. A permanent “sale ends in 10:00” that resets on every refresh trains repeat visitors to ignore you and costs more than it earns — use evergreen on new-visitor pages and fixed dates for real promotions.",
			},
			{
				question: "Can I run more than one timer at a time?",
				answer: "Yes, across different placements and different collections.",
			},
			{
				question: "What happens when it hits zero?",
				answer:
					"It hides itself, shows a message you set, or restarts. Your call, per timer.",
			},
		],
		ctaHeading: "A deadline costs nothing and moves conversion rate.",
	},
	{
		slug: "edge-reviews",
		name: "Edge Reviews",
		category: "Product page conversion",
		lever: "cvr",
		live: false,
		metric: "PDP CVR",
		eyebrow: "Reviews & customer photos",
		tagline: "Your product page doesn't close. Your last 200 buyers do.",
		heroLead:
			"Collect photo and video reviews automatically after delivery, then put them where the decision actually happens — the product page, the collection grid, the cart, and Google's results.",
		heroTrust: [
			"Free plan",
			"Import your existing reviews",
			"Google rich results",
		],
		description:
			"No shopper believes your product description. They believe the person who already bought it. Edge Reviews collects that proof without you chasing it, and places it at the moment of doubt rather than at the bottom of the page.",
		problemStats: ["reviewsBeforeBuying", "cartAbandonment", "mobileCheckout"],
		how: [
			{
				title: "Import what you already have",
				body: "Bring your existing review count across by CSV or direct migration. Starting from zero costs conversion you have already earned.",
			},
			{
				title: "Ask automatically, after delivery",
				body: "Email and SMS requests fire a set number of days after the order actually arrives — not after it was billed.",
			},
			{
				title: "Place them where they close",
				body: "Product page, collection cards, cart drawer, and post-purchase. The same review does different work in each spot.",
			},
		],
		features: [
			{
				metric: "Product page conversion",
				title: "Collect the format that actually convinces",
				body: "Photo and video reviews, uploaded in one tap from the phone the customer is already holding. A picture of your product in somebody's real kitchen does work that no product description you write will ever do.",
			},
			{
				metric: "Reviews collected",
				title: "Ask the day the box arrives",
				body: "Requests fire a set number of days after delivery, not after dispatch. Asking someone to review a product they have not received yet is the single most common reason stores end up with almost no reviews.",
			},
			{
				metric: "Sessions · click-through",
				title: "Stars in Google, without touching schema",
				body: "Rich result markup is generated for you, so your organic listings carry ratings. It is the rare change that raises click-through on traffic you are already earning for free.",
			},
			{
				metric: "CVR · average order value",
				title: "Put the proof where the doubt is",
				body: "Reviews go on the product page, the collection cards, the cart drawer and the post-purchase page. The same review does a different job in each spot — on a collection card it earns the click, in the cart it stops the second thoughts.",
			},
			{
				metric: "Trust · conversion rate",
				title: "Answer the critical ones in public",
				body: "A well-handled three-star review sells harder than a five-star one, because it proves somebody is home and paying attention. Replies thread underneath, where the next shopper reads them.",
			},
			{
				metric: "Switching cost",
				title: "Bring your review count with you",
				body: "Import by CSV or migrate directly from your current app. Starting again from zero throws away years of accumulated proof and costs you conversion from day one — the count itself is part of what persuades.",
			},
		],
		worksWith: [
			"Klaviyo",
			"Google Shopping",
			"Meta catalogue",
			"Edge Cart",
			"Any OS 2.0 theme",
		],
		pricing: [
			{
				confirmed: false,
				name: "Free",
				price: "Free",
				includes: "50 review requests a month, unlimited display.",
			},
			{
				confirmed: false,
				name: "Growth",
				price: "$12.99",
				priceNote: "/mo",
				includes: "Photo and video reviews, SMS requests, Google rich results.",
			},
			{
				confirmed: false,
				name: "Scale",
				price: "$29.99",
				priceNote: "/mo",
				includes: "Unlimited requests, customer photo gallery, API access.",
			},
		],
		faq: [
			{
				question: "Can I import my existing reviews?",
				answer:
					"Yes, by CSV or direct migration from the major review apps. Your review count comes with you.",
			},
			{
				question: "Do I get star ratings in Google?",
				answer: "Yes, rich result markup is on by default.",
			},
			{
				question: "Can I delete bad reviews?",
				answer:
					"You can hide spam and reply to anything. We would push back on deleting genuine criticism — shoppers read the negative reviews first, and a page with none reads as censored.",
			},
			{
				question: "Do you send SMS requests?",
				answer:
					"Yes, on the paid tiers. Response rates are higher than email, and so is the cost per request.",
			},
			{
				question: "Will it slow the product page down?",
				answer:
					"Reviews below the fold are lazy-loaded, so they do not compete with your product images for the initial render.",
			},
		],
		ctaHeading: "Let the last 200 buyers sell the next one.",
	},
	{
		slug: "edge-currency",
		name: "Edge Currency",
		category: "International conversion",
		lever: "cvr",
		live: false,
		metric: "Intl. CVR",
		eyebrow: "Multi-currency & geolocation",
		tagline: "$47.83 isn't a price. It's arithmetic.",
		heroLead:
			"Detect the visitor's country on first load, show the price in their own currency, and round it so it reads like a price somebody set rather than a conversion somebody ran.",
		heroTrust: ["Free forever plan", "180+ currencies", "Zero setup"],
		description:
			"An international shopper who has to do currency maths in their head is a shopper doing work instead of buying. Edge Currency removes that step, and rounds the result so the number looks deliberate.",
		problemStats: [
			"localCurrencyPreference",
			"cartAbandonment",
			"mobileCheckout",
		],
		how: [
			{
				title: "Install it",
				body: "Currencies populate from Shopify Markets automatically. There is no rate table to maintain.",
			},
			{
				title: "Set your rounding",
				body: "End prices at .99, .00, or the nearest whole unit — configured per currency, because what looks right in yen does not look right in euros.",
			},
			{
				title: "Place the switcher",
				body: "Header, footer, or floating. It inherits your theme, and flags are optional.",
			},
		],
		features: [
			{
				metric: "International conversion",
				title: "The right currency before they scroll",
				body: "Country is detected on first load, so the price is already local when the page paints. No modal asking a first-time visitor to pick a region before they have been allowed to see a single product.",
			},
			{
				metric: "International conversion",
				title: "Round it so it reads like a price somebody set",
				body: "A converted number with stray decimals quietly tells an international shopper that this store is not really meant for them. Rounding rules, configured per currency, make every market look like the home market.",
			},
			{
				metric: "Margin",
				title: "Live rates, and a margin if you want one",
				body: "Rates refresh on a schedule, and you can add a percentage to cover the conversion spread you actually pay your processor. Otherwise a moving rate eats margin you never see leave.",
			},
			{
				metric: "International conversion",
				title: "Say the right thing in each market",
				body: "Free-shipping thresholds and delivery estimates change by country, so you never promise two-day delivery somewhere you cannot deliver in two days. The refund that follows a broken promise costs more than the order was worth.",
			},
			{
				metric: "Conversion rate",
				title: "Yours, down to whether there are flags",
				body: "Fonts, colours and placement are configurable, and flags are optional — plenty of brands would rather not put a flag next to a price. The switcher should read as part of the theme, not part of an app.",
			},
			{
				metric: "Support tickets",
				title: "Checkout shows the price they were shown",
				body: "Display currency and settlement currency stay in sync with Shopify Markets. Nobody sees one number on the product page and a different one at checkout, which is the version of this that generates angry emails.",
			},
		],
		worksWith: [
			"Shopify Markets & Markets Pro",
			"Shopify Payments",
			"Edge Cart",
			"Edge Bundles",
			"Any OS 2.0 theme",
		],
		pricing: [
			{
				confirmed: false,
				name: "Free forever",
				price: "Free",
				includes: "Five currencies with automatic detection.",
			},
			{
				confirmed: false,
				name: "Pro",
				price: "$6.99",
				priceNote: "/mo",
				includes: "Unlimited currencies, custom rounding, FX margin.",
			},
		],
		faq: [
			{
				question: "Which currency is the customer actually charged in?",
				answer:
					"Whichever one Shopify Markets settles in. Display and charge stay consistent, so nobody sees one number on the product page and another at checkout.",
			},
			{
				question: "Does this affect Shopify Payments?",
				answer:
					"No. It works alongside Shopify's own currency handling rather than replacing it.",
			},
			{
				question: "How often do rates update?",
				answer:
					"On a regular schedule, and you can add an FX margin so a moving rate never eats your margin.",
			},
			{
				question: "Can I hide certain currencies per market?",
				answer: "Yes. Show only the currencies you actually want to sell in.",
			},
			{
				question: "Is it compatible with Markets Pro?",
				answer: "Yes.",
			},
		],
		ctaHeading: "Stop losing international carts to a confusing number.",
	},
	{
		slug: "edge-subscriptions",
		name: "Edge Subscriptions",
		category: "Lifetime value",
		lever: "ltv",
		live: false,
		metric: "LTV",
		screenshot: "/app-shots/edge-subscriptions.avif",
		screenshotIsComp: true,
		eyebrow: "Subscriptions & subscribe-and-save",
		tagline: "Turn one sale into twelve.",
		heroLead:
			"Subscribe-and-save on any product, a customer portal people actually use instead of emailing you, and dunning that recovers the subscription revenue most stores quietly lose to expired cards.",
		heroTrust: [
			"0% transaction fee",
			"Native Shopify checkout",
			"Migration done for you",
		],
		description:
			"Acquisition is the expensive part and you have already paid it. A subscription is the same customer buying again without you buying the click twice — which is why a subscriber is worth a multiple of a one-time buyer.",
		problemStats: ["subscriberLtv", "failedPaymentLoss", "cartAbandonment"],
		how: [
			{
				title: "Choose the products",
				body: "Any product, any variant. Subscribe-and-save appears on the product page and inherits your theme.",
			},
			{
				title: "Set the plan",
				body: "Frequency, discount, and minimum commitment. Escalating discounts reward the customers who stay.",
			},
			{
				title: "Hand over control",
				body: "Skip, swap, pause, and reschedule happen in the customer's own account, not in your support inbox.",
			},
		],
		features: [
			{
				metric: "Subscriber rate",
				title: "Put subscribe-and-save on the things people rebuy",
				body: "A product-page widget that matches your theme, on whichever items a customer would naturally buy again. The offer has to be in front of them at the moment they are already buying it once — asking later, by email, converts a fraction as well.",
			},
			{
				metric: "Churn",
				title: "Give them a pause button",
				body: "Most cancellations mean “not this month”, not “never again”, but a portal with only a cancel button turns the first into the second. Skip, swap and pause keep the relationship alive through the month somebody's cupboard is already full.",
			},
			{
				metric: "Recurring revenue",
				title: "Recover the card before the customer notices",
				body: "Expired and declined cards are worked automatically with smart retries and dunning emails. This is revenue you have already earned and already delivered against, and most stores lose a slice of it every month without ever seeing it go.",
			},
			{
				metric: "LTV · churn",
				title: "Reward the ones who stay",
				body: "A discount that grows with each delivery gives a long-term subscriber a reason not to go looking around at order four, which is roughly where subscription churn actually happens.",
			},
			{
				metric: "Lifetime value",
				title: "See churn coming while you can still act",
				body: "Cancellation reasons, recurring revenue and cohort retention, in plain English rather than a chart nobody opens. Knowing which cohort is leaving is only useful while there is still time to do something about it.",
			},
			{
				metric: "Switching cost",
				title: "We move your contracts for you",
				body: "Migration from your current app is work we do, not work we hand you, and customers are never asked to re-enter payment details. Contracts live in Shopify, so if you ever leave us, nothing is held hostage on the way out.",
			},
		],
		worksWith: [
			"Shopify Subscriptions APIs",
			"Shop Pay",
			"Klaviyo",
			"Edge Bundles",
			"Edge Cart",
		],
		pricing: [
			{
				confirmed: false,
				name: "Free",
				price: "Free",
				includes: "Up to $500 a month in subscription revenue.",
			},
			{
				confirmed: false,
				name: "Growth",
				price: "$19",
				priceNote: "/mo",
				includes: "Unlimited subscriptions, dunning, customer portal.",
			},
			{
				confirmed: false,
				name: "Scale",
				price: "$49",
				priceNote: "/mo",
				includes: "Cohort analytics, managed migration, priority support.",
			},
		],
		faq: [
			{
				question: "Does it use native Shopify checkout?",
				answer: "Yes, including Shop Pay.",
			},
			{
				question: "Do you take a percentage of subscription revenue?",
				answer:
					"No. A flat monthly fee on every plan. A percentage fee is a tax that grows precisely as you succeed, and it is the reason most stores eventually migrate away from their first subscription app.",
			},
			{
				question: "Can you migrate me from another subscription app?",
				answer:
					"Yes, and we do the work. Your contracts move without asking customers to re-enter payment details.",
			},
			{
				question: "What happens if I cancel?",
				answer:
					"Subscription contracts live in Shopify, not in our database. Nothing about leaving is designed to be painful.",
			},
			{
				question: "Pause or cancel?",
				answer:
					"Both, from the customer portal. Pause is the one that saves the relationship.",
			},
		],
		ctaHeading: "One sale, then twelve.",
	},
	{
		slug: "trackproof",
		name: "Trackproof",
		category: "Attribution",
		lever: "proof",
		live: true,
		metric: "Reported ROAS",
		eyebrow: "Server-side conversion tracking",
		tagline: "Your ROAS is better than Meta is telling you.",
		heroLead:
			"Server-side conversions for Meta, Google, and TikTok through each platform's Conversions API, deduplicated against your existing pixel — so every purchase is counted once, and none of them go missing.",
		heroTrust: ["Free", "Meta, Google & TikTok", "Live tracking health score"],
		description:
			"Browser pixels miss conversions to ad blockers, privacy settings, and dropped sessions. You do not see the gap — you see a campaign that looks unprofitable, and you switch off an ad set that was working.",
		problemStats: ["pixelUnderreporting", "cartAbandonment", "mobileCheckout"],
		how: [
			{
				title: "Connect your ad accounts",
				body: "OAuth for all three platforms. No pasting access tokens between browser tabs.",
			},
			{
				title: "Events map themselves",
				body: "Standard Shopify events arrive pre-mapped, so there is nothing to configure before data starts flowing.",
			},
			{
				title: "Watch the health score",
				body: "Live diagnostics tell you something broke before your reported ROAS does.",
			},
		],
		features: [
			{
				metric: "Reported conversions",
				title: "Send the purchase from your server, not the browser",
				body: "The Conversions API for Meta, Google and TikTok, running alongside the pixel you already have. Ad blockers, privacy settings and dropped sessions stop being the thing that decides what your ad platform is allowed to know.",
			},
			{
				metric: "ROAS accuracy",
				title: "One purchase, one conversion",
				body: "Automatic deduplication between the pixel and the server, whichever arrives first. Double-counting produces a return on ad spend that looks wonderful and is wrong, and acting on that costs more than the gap you started with.",
			},
			{
				metric: "Attribution",
				title: "More events find their person",
				body: "Customer data is hashed before it leaves your store — both what the platforms require and what lifts match rates. A conversion the platform cannot tie back to a click may as well never have happened.",
			},
			{
				metric: "Optimisation",
				title: "Optimise toward what you actually care about",
				body: "Standard Shopify events arrive pre-mapped, and you can add your own. If a second order matters more to your business than a first, you can say so and let the platform bid for it.",
			},
			{
				metric: "Risk",
				title: "Find out before your ROAS does",
				body: "A live health score with per-platform diagnostics and consent-mode gating. Tracking normally breaks silently and gets discovered a fortnight later in a report, after the budget has already moved somewhere worse.",
			},
			{
				metric: "Cost per acquisition",
				title: "Free, and not the kind of free that ends",
				body: "No plan to choose, no card to add, no event cap to trip over on the best trading day of your year. It is free because accurate data makes the ad platforms better at spending your money, and that is payment enough.",
			},
		],
		worksWith: [
			"Meta Conversions API",
			"Google Ads",
			"TikTok Events API",
			"Shopify Customer Privacy API",
			"Consent Mode v2",
		],
		pricing: [
			{
				confirmed: true,
				name: "Free",
				price: "Free",
				includes:
					"All three platforms, all events, no limits, no card required.",
			},
		],
		faq: [
			{
				question: "What about GDPR?",
				answer:
					"Consent-mode gating is built in and customer data is hashed before transmission. Events are not sent for shoppers who have not consented.",
			},
			{
				question: "Do I keep my pixel?",
				answer:
					"Yes. Server-side tracking runs alongside it, and deduplication is what stops the two from double-counting the same purchase.",
			},
			{
				question: "Will my ROAS go up?",
				answer:
					"Your reported ROAS usually does, because fewer conversions go missing. Your actual sales do not change — your visibility of them does. That is the entire point: you stop switching off ad sets that were quietly working.",
			},
			{
				question: "How long does setup take?",
				answer:
					"Minutes rather than hours. Events are pre-mapped, and connecting an ad account is an OAuth click.",
			},
			{
				question: "Do you support Consent Mode v2?",
				answer: "Yes.",
			},
		],
		ctaHeading: "Stop optimising spend on incomplete data.",
	},
] as const;

/** Lookup by slug for the app pages. */
export function getProduct(slug: string): EdgeProduct | undefined {
	return EDGE_PRODUCTS.find((product) => product.slug === slug);
}

/** The `RPV = CVR × AOV` groupings, in the order the homepage tells them. */
export const RPV_LEVERS: readonly {
	description: string;
	key: RpvLever;
	label: string;
	title: string;
}[] = [
	{
		key: "cvr",
		label: "CVR",
		title: "Lift conversion rate",
		description: "More of the visitors you already have decide to buy.",
	},
	{
		key: "aov",
		label: "AOV",
		title: "Lift average order value",
		description: "Each one of those buyers spends more on the way through.",
	},
	{
		key: "ltv",
		label: "LTV",
		title: "Multiply it over time",
		description:
			"They come back and buy again without you paying for the click twice.",
	},
	{
		key: "proof",
		label: "ROAS",
		title: "Prove what actually happened",
		description:
			"Your reported numbers match reality, so you act on the right ones.",
	},
] as const;

/** Apps for one lever, in catalog order. */
export function productsByLever(lever: RpvLever): readonly EdgeProduct[] {
	return EDGE_PRODUCTS.filter((product) => product.lever === lever);
}

/**
 * The apps in the order a single visit encounters them, with the moment each
 * one acts on.
 *
 * This is a different cut from `RPV_LEVERS`, and that is the point: the levers
 * answer "which number does this move", while this answers "where in the visit
 * does this happen". A merchant who cannot say which of their numbers is weak
 * can almost always say which part of their funnel feels broken.
 *
 * Stages are written as the shopper's actions rather than as funnel jargon —
 * "they hesitate" locates the problem in a way "consideration stage" does not.
 */
export const JOURNEY: readonly { slug: string; stage: string }[] = [
	{ slug: "edge-currency", stage: "They land" },
	{ slug: "edge-reviews", stage: "They read the product page" },
	{ slug: "edge-timer", stage: "They hesitate" },
	{ slug: "edge-bundles", stage: "They add to cart" },
	{ slug: "edge-cart", stage: "They open the cart" },
	{ slug: "edge-subscriptions", stage: "They come back" },
	{ slug: "trackproof", stage: "You read the result" },
] as const;
