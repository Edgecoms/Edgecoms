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
		live: true,
		metric: "AOV",
		appStoreUrl: "https://apps.shopify.com/edge-bundles",
		screenshot: "/app-shots/edge-bundles.avif",
		eyebrow: "Bundles, volume tiers & frequently-bought-together",
		tagline: "Raise AOV without touching ad spend.",
		heroLead:
			"Bundles, volume tiers, and frequently-bought-together offers that get a second item into the cart. No discount codes, no extra traffic, no new customers required.",
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
				title: "Choose what it runs on",
				body: "Every product, everything except a list, a specific few, or whole collections. This is the step that decides whether the discount lands where your margin can carry it.",
			},
			{
				title: "Build the tiers",
				body: "Add a bar for each pack: buy two get one free, buy three get two free, an extra percentage on the bigger ones. Then set the badge, the label and which variants the shopper picks.",
			},
			{
				title: "Preview it, then publish",
				body: "Check it against a real product from your catalog on desktop and mobile, keep it as a draft while you are unsure, and publish when it looks right.",
			},
		],
		features: [
			{
				metric: "Average order value",
				title: "Buy two, get one free, with no discount code anywhere",
				image: "/app-shots/bundles-tiers.avif",
				body: "Volume tiers and buy-one-get-one offers, with an extra percentage stacked on the bigger packs so the saving visibly grows as the shopper moves up the list. They are not reading about a deal, they are watching one get better, and the next tier is always close enough to be worth reaching for.",
			},
			{
				metric: "Every number above",
				title: "The offer reports on itself",
				image: "/app-shots/bundles-analytics.avif",
				body: "Views, adds to cart, revenue and conversion rate sit on the bundle's own page with a trend line beside each one, not buried in a separate analytics area you have to go and find. When an offer is underperforming, you open it and the reason is already on screen.",
			},
			{
				metric: "Conversion rate",
				title: "See it on a real product before anyone else does",
				image: "/app-shots/bundles-builder.avif",
				body: "The live preview renders your offer against any reference product from your own catalog, in desktop and mobile, and it inherits your theme as it goes. Save it as a draft, look at it on the thing you are actually selling, publish when it is right.",
			},
			{
				metric: "Margin",
				title: "Run it exactly where it pays, and only when it should",
				body: "Target every product, everything except a list, a specific handful, or whole collections, then schedule when the offer starts and stops. Margin decides where a discount runs, and an offer that ends by itself is one you cannot forget to switch off.",
			},
			{
				metric: "AOV · urgency",
				title: "A countdown built into the offer itself",
				image: "/app-shots/bundles-gift.avif",
				body: "The timer belongs to the bundle rather than sitting in a banner somewhere else on the site. It expires with the deal it is attached to, so there is never a clock promising a price the cart will refuse to honour.",
			},
			{
				metric: "Lifetime value",
				title: "Turn the biggest pack into a subscription",
				image: "/app-shots/bundles-subscription.avif",
				body: "An automatic-refill option sits inside the bundle, so the shopper who has just chosen the best-value pack can also choose to have it arrive every month. Somebody buying three of something is the easiest subscriber you will ever get, and this is the one moment they are thinking about it.",
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
					"It depends on your catalog and your margin, and anyone quoting you a single number has not seen your store. Below a few hundred orders a month, read the figure monthly rather than weekly. Daily AOV on low volume is noise, not signal.",
			},
			{
				question: "Can I run bundles on one collection only?",
				answer:
					"Yes. Target every product, everything except a list you choose, specific products, or whole collections, and schedule when the offer opens and closes. It is the difference between a promotion and an accidental sitewide sale.",
			},
			{
				question: "Can I see the offer before customers do?",
				answer:
					"Yes. The preview renders against any product in your catalog, on desktop and mobile, and you can leave the whole offer as a draft until you are happy with it.",
			},
			{
				question: "Can a bundle also sell a subscription?",
				answer:
					"Yes. An automatic-refill option can sit inside the bundle, so the shopper choosing the largest pack can have it repeat. Someone buying three at once is the most likely subscriber you have, and that is the moment to ask.",
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
		live: true,
		metric: "RPV",
		appStoreUrl: "https://apps.shopify.com/edgecart",
		screenshot: "/app-shots/cart-drawer.webp",
		eyebrow: "Slide cart & cart upsells",
		tagline: "The highest-intent moment in your funnel is doing nothing.",
		heroLead:
			"A slide cart that opens without a page load, upsells chosen by rule instead of by guess, and free-shipping progress that moves as they add, all at the one moment the shopper has already decided to buy.",
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
				image: "/app-shots/cart-customization.webp",
				body: "A cart page costs you a page load and gives the shopper a fresh chance to leave. The drawer opens over the product they were just looking at, so reviewing the order never means navigating away from it.",
			},
			{
				metric: "AOV · attach rate",
				title: "Offer by rule, not by guess",
				image: "/app-shots/cart-drafts.webp",
				body: "A forty-dollar cart and a two-hundred-dollar cart should not see the same add-on. Rules pick the offer from what is actually in the cart: its contents, its value, the collection, the country. The suggestion is one this particular shopper might plausibly want.",
			},
			{
				metric: "Average order value",
				title: "A progress bar that moves while they watch",
				image: "/app-shots/cart-shipping.webp",
				body: "Free-shipping progress fills in real time and shows exactly what is left to qualify. It is the oldest average-order-value lever in ecommerce and it still works, because it turns a threshold into something the shopper wants to finish.",
			},
			{
				metric: "AOV · margin",
				title: "One-tap add-ons at the margin you want",
				image: "/app-shots/cart-addons.webp",
				body: "Warranty, gift wrap and express shipping are accepted inside the drawer without restarting checkout. High margin, almost no friction, and never an extra screen between the shopper and paying you.",
			},
			{
				metric: "Conversion rate",
				title: "Answer the doubt where the doubt happens",
				image: "/app-shots/cart-payments.png",
				body: "Payment icons, the returns policy and your guarantee sit in the drawer at the moment of commitment, not three scrolls up a page the shopper has already scrolled past.",
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
					"Yes. Shop Pay, PayPal, and Apple Pay all carry through the drawer, so an upsell never costs you a one-tap checkout.",
			},
			{
				question: "What acceptance rate should I expect?",
				answer:
					"Strong offers run in the single digits, and that is normal. If an offer is sitting near zero, the offer is wrong rather than the placement. Swap the product before you change the rules.",
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
		appStoreUrl: "https://apps.shopify.com/urgency-timer",
		screenshot: "/app-shots/timer-storefront.webp",
		eyebrow: "Countdown timers & urgency",
		tagline: "Give them a deadline. Watch CVR move.",
		heroLead:
			"Countdown timers on product pages, the cart, the announcement bar and collections, tied to deadlines that are actually real. Live in about five minutes, with no code and no theme edits.",
		heroTrust: ["From $4.99/mo", "Live in 5 minutes", "No code"],
		description:
			"“I'll come back later” is where conversion rate goes to die. A real deadline, whether a sale ending, a dispatch cutoff or a restock, turns later into now, and it is the cheapest CVR lever you have.",
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
				image: "/app-shots/timer-templates.webp",
			},
			{
				metric: "Conversion rate",
				title: "Evergreen for new visitors, fixed dates for real sales",
				body: "A fixed range for a promotion that genuinely ends, or a per-visitor countdown so someone arriving today sees a full clock instead of one that expired last month. Both are honest. They just do different jobs, and using the wrong one is how stores train shoppers to ignore them.",
			},
			{
				metric: "Hours you get back",
				title: "It starts and ends without you being awake",
				body: "Launches, restocks and seasonal peaks run on a schedule and respect timezones. The timer appears when the sale opens and takes itself down the moment it is over, which is the part everyone forgets to do manually.",
			},
			{
				metric: "Conversion rate",
				title: "It shouldn't look like something you installed",
				body: "Start from a named template, then take it apart: solid or gradient background with an angle you set, corner radius, border weight and colour, your own fonts. The preview updates as you go, so you never publish something you have not already looked at.",
				image: "/app-shots/timer-design.webp",
			},
			{
				metric: "Risk",
				title: "No code, and nothing left behind",
				body: "Everything is configured from a dashboard, with no theme edits at any point. Install and uninstall both leave your theme exactly as they found it, which is the thing you care about the first time you switch themes.",
			},
			{
				metric: "Margin",
				title: "Run urgency only where it pays for itself",
				body: "Set timers by product tag rather than one at a time, and target by location on the top plan. The deadline lands on the products whose margin can carry the discount behind it, instead of becoming a sitewide sale you did not mean to run.",
			},
		],
		worksWith: [
			"Any OS 2.0 theme",
			"Shopify Admin",
			"Edge Cart",
			"Edge Bundles",
		],
		pricing: [
			{
				confirmed: true,
				name: "Starter",
				price: "$4.99",
				priceNote: "/mo",
				includes:
					"Up to 10,000 timer views a month, product and landing page timers, scheduled and recurring. $47.88 billed yearly saves 20%.",
			},
			{
				confirmed: true,
				name: "Standard",
				price: "$7.99",
				priceNote: "/mo",
				includes:
					"Up to 50,000 views, plus cart and top-bar timers and product tag-based setup. $76.68 billed yearly saves 20%.",
			},
			{
				confirmed: true,
				name: "Premium",
				price: "$14.99",
				priceNote: "/mo",
				includes:
					"Unlimited views and timers, geolocation targeting, priority email support. $143.88 billed yearly saves 20%.",
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
					"On genuine deadlines, yes. A permanent “sale ends in 10:00” that resets on every refresh trains repeat visitors to ignore you and costs more than it earns. Use evergreen on new-visitor pages and fixed dates for real promotions.",
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
		live: true,
		metric: "PDP CVR",
		appStoreUrl: "https://apps.shopify.com/edge-reviews",
		eyebrow: "Reviews & customer photos",
		tagline: "Your product page doesn't close. Your last 200 buyers do.",
		heroLead:
			"Collect photo and video reviews automatically after delivery, then put them where the decision actually happens: the product page, the collection grid, the cart, and Google's results.",
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
				body: "Email and SMS requests fire a set number of days after the order actually arrives, not after it was billed.",
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
				body: "Photo and video reviews, uploaded in one tap from the phone the customer is already holding, each marked verified so nobody has to wonder. A thirty-second clip of your product in somebody's real kitchen does work that no product description you write will ever do.",
				image: "/app-shots/reviews-widget.avif",
			},
			{
				metric: "Conversion rate",
				title: "One set of reviews, several shapes",
				body: "The same reviews render as a wall of customer photos, a compact carousel under the buy button, or a full widget with the aggregate score on top. A landing page and a product page want different things from the same proof, and you should not have to collect it twice.",
				image: "/app-shots/reviews-layouts.avif",
			},
			{
				metric: "CVR · average order value",
				title: "Put the proof where the doubt is",
				body: "Reviews go on the product page, the collection cards, the cart drawer and the post-purchase page. The same review does a different job in each spot. On a collection card it earns the click; in the cart it stops the second thoughts.",
				image: "/app-shots/reviews-spotlight.avif",
			},
			{
				metric: "Reviews collected",
				title: "A form people actually finish",
				body: "Stars first, because tapping five of them costs nothing and commits the customer to finishing. Then the review itself, then an optional title. Every field you add before the star rating is a review you do not get.",
				image: "/app-shots/reviews-form.avif",
			},
			{
				metric: "Trust · conversion rate",
				title: "Answer the question before it becomes a bounce",
				body: "Ask a question sits beside Write a review, so a shopper who is unsure asks instead of leaving. Your answer stays on the page for everyone who wonders the same thing afterwards, which is the part that compounds.",
			},
			{
				metric: "Reviews collected",
				title: "Ask the day the box arrives",
				body: "Requests fire a set number of days after delivery, not after dispatch. Asking someone to review a product they have not received yet is the single most common reason stores end up with almost no reviews.",
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
					"You can hide spam and reply to anything. We would push back on deleting genuine criticism. Shoppers read the negative reviews first, and a page with none reads as censored.",
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
		live: true,
		metric: "Intl. CVR",
		appStoreUrl: "https://apps.shopify.com/edge-currency",
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
				body: "End prices at .99, .00, or the nearest whole unit, configured per currency, because what looks right in yen does not look right in euros.",
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
				body: "Fonts, colours and placement are configurable, and flags are optional, because plenty of brands would rather not put a flag next to a price. The switcher should read as part of the theme, not part of an app.",
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
		live: true,
		metric: "LTV",
		appStoreUrl: "https://apps.shopify.com/edge-subscription",
		screenshot: "/app-shots/edge-subscriptions.avif",
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
			"Acquisition is the expensive part and you have already paid it. A subscription is the same customer buying again without you buying the click twice, which is why a subscriber is worth a multiple of a one-time buyer.",
		problemStats: ["subscriberLtv", "failedPaymentLoss", "cartAbandonment"],
		how: [
			{
				title: "Build the plan",
				body: "Billing type, delivery frequency and interval, and whether there is a minimum or maximum number of orders. Pay as you go, or prepaid up front.",
			},
			{
				title: "Set the discounts",
				body: "A subscription discount, a delivery discount, and the option to change either one after a set number of orders. This is where a subscriber gets a reason to reach order five.",
			},
			{
				title: "Hand over the controls",
				body: "Swap, skip, reschedule, address and card all live in the customer's own portal, so the things that used to arrive in your inbox never leave their account.",
			},
		],
		features: [
			{
				metric: "Subscriber rate",
				title: "Sell the subscription at the moment they are already buying",
				body: "A product-page option that sits beside the one-time price and the bundle, not on a separate page and not in an email a week later. The shopper comparing a single, a two-pack and a subscription picks the subscription surprisingly often, because you asked while they were already deciding.",
				image: "/app-shots/subs-bundle.avif",
			},
			{
				metric: "LTV · churn",
				title: "Make the discount grow the longer they stay",
				body: "Set a subscription discount, then change it after a set number of orders, and do the same with delivery: free shipping from order two onward if you want it. A subscriber at order four is deciding whether to keep going, and a discount that improves is a reason not to go looking.",
				image: "/app-shots/subs-plans.avif",
			},
			{
				metric: "Churn",
				title: "Let them swap and skip instead of cancelling",
				body: "The portal lets a customer swap the product, skip a delivery, reschedule it, change the address and update the card, all without emailing you. Most cancellations are really \u201cnot this month\u201d or \u201cnot this flavour\u201d, and both of those have a button.",
				image: "/app-shots/subs-portal.avif",
			},
			{
				metric: "Recurring revenue",
				title: "Every future charge, visible and movable",
				body: "The billing schedule lists every delivery that has happened and every one still to come, and you can reschedule any of them, skip one, or charge it now. When a customer asks to shift a delivery a week, it is one click rather than a conversation.",
				image: "/app-shots/subs-schedule.webp",
			},
			{
				metric: "Lifetime value",
				title: "Watch the base grow, and watch what leaves it",
				body: "Active subscriptions over time, new subscriptions per day, and cancellations and pauses charted next to them. Growth on its own is flattering; growth beside churn is the number that tells you whether the base is actually compounding.",
				image: "/app-shots/subs-analytics.png",
			},
			{
				metric: "Ops time",
				title: "Swap what ships without touching the subscription",
				body: "Automatic product swap moves a subscriber onto a different product after a set point, so a starter size can become the full size, or a discontinued line can roll onto its replacement. Nobody has to cancel and re-subscribe, which is where you lose them.",
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
				question: "Can a customer change what they receive?",
				answer:
					"Yes. They can swap the product themselves from the portal, and you can set an automatic swap that moves them onto a different product after a set number of orders , a starter size onto the full size, say, without anyone having to cancel and start again.",
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
		appStoreUrl: "https://apps.shopify.com/trackproof",
		eyebrow: "Server-side conversion tracking",
		tagline: "Your ROAS is better than Meta is telling you.",
		heroLead:
			"Server-side conversions for Meta, Google, and TikTok through each platform's Conversions API, deduplicated against your existing pixel, so every purchase is counted once and none of them go missing.",
		heroTrust: ["Free", "Meta, Google & TikTok", "Live tracking health score"],
		description:
			"Browser pixels miss conversions to ad blockers, privacy settings, and dropped sessions. You do not see the gap. You see a campaign that looks unprofitable, and you switch off an ad set that was working.",
		problemStats: ["pixelUnderreporting", "cartAbandonment", "mobileCheckout"],
		how: [
			{
				title: "Install the script, turn on the app embed",
				body: "One click each. The embed is what captures first-party click IDs, and that is where a large part of your match quality comes from.",
			},
			{
				title: "Connect Meta, Google and TikTok",
				body: "OAuth, no pasting access tokens between browser tabs. Every standard Shopify event is already mapped, so data starts flowing the moment a channel connects.",
			},
			{
				title: "Fire a test event and read the score",
				body: "Confirm events land in each platform, then let the setup checklist and the health score tell you what is still worth fixing.",
			},
		],
		features: [
			{
				metric: "Reported conversions",
				title: "Every event, and which path it actually took",
				body: "The Conversions API for Meta, Google and TikTok runs alongside your pixel, and the event log shows you whether each event went by pixel, by server, or both. Ad blockers and dropped sessions stop being the thing that decides what your ad platform is allowed to know, and you can see it happening rather than take it on trust.",
			},
			{
				metric: "Match quality · trust",
				title: "Open any event and see exactly what we sent",
				body: "Every row opens onto the raw payload as it left your store, hashed identifiers and all, next to the platform's own response confirming it was received, and that event's match quality and dedup status. When Meta support asks you for a trace ID, it is already on the screen. Most tracking apps ask you to trust them. This one shows its working.",
			},
			{
				metric: "ROAS accuracy",
				title: "One purchase, one conversion, reported as a fact",
				body: "Every server event carries the deduplication key its platform expects, so the pixel and the API never both claim the same order. Purchase dedup gets its own line on the health card, because “probably not double-counting” is not a good enough basis for spending money.",
			},
			{
				metric: "Dynamic ads",
				title: "Send the product ID your catalog actually uses",
				body: "Choose whether content_ids sends the variant ID, the product ID or the SKU, so it matches the format in your catalog feed. Get this wrong and dynamic ads quietly retarget the wrong product or nothing at all. It is one of the most common reasons DPA underperforms, and one of the hardest to spot from inside Ads Manager.",
			},
			{
				metric: "Optimisation",
				title: "See exactly what maps to what, on every platform",
				body: "Every Shopify event next to its counterpart on Meta, Google and TikTok in one table, including the ones a platform has no equivalent for, marked as unmapped rather than silently dropped. Mapped parameters, value source and consent gating are all visible per event, and you can build custom events for anything Shopify does not emit natively.",
			},
			{
				metric: "Risk",
				title: "Find out before your ROAS does",
				body: "A tracking health score out of a hundred, built from delivery coverage, connected channels and credential health, with a setup checklist that names what is still missing. Tracking normally breaks silently and gets discovered a fortnight later in a report, after the budget has already moved somewhere worse.",
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
				question: "Will my ROAS go up?",
				answer:
					"Your reported ROAS usually does, because fewer conversions go missing on the way to the platform. Your actual sales do not change. Your visibility of them does. That is the entire point: you stop switching off ad sets that were quietly working.",
			},
			{
				question: "Is the match score Meta's official Event Match Quality?",
				answer:
					"No, and the app says so on the page rather than letting you assume otherwise. It is our estimate, calculated from the identifiers we actually send with each event, and it moves for the same reasons Meta's does. Meta's official EMQ lives in Events Manager and we link you straight to it.",
			},
			{
				question: "Do I keep my pixel?",
				answer:
					"Yes, and you should. Server-side runs alongside it and deduplication is what stops the two from both claiming the same purchase. The event log shows which events were sent by both paths.",
			},
			{
				question: "Which product ID should content_ids send?",
				answer:
					"Whichever one your catalog feed is built on: variant ID, product ID or SKU, switchable per store. If the two do not match, dynamic ads cannot resolve the product, so retargeting silently degrades while everything else looks fine.",
			},
			{
				question: "What happens to events a platform does not support?",
				answer:
					"They are shown as unmapped in the event table rather than dropped without telling you. Google takes a few events Meta and TikTok do not, and vice versa, and you can see exactly which at a glance.",
			},
			{
				question: "What about GDPR and Consent Mode v2?",
				answer:
					"Consent-mode gating is built in and can be set per event, customer data is hashed before it leaves your store, and TikTok events are gated alongside GA4 Consent Mode v2. Events are not sent for shoppers who have not consented.",
			},
			{
				question: "How long does setup take?",
				answer:
					"Minutes. Install the script, turn on the app embed, connect a channel by OAuth, fire a test event. Every standard Shopify event is mapped before you arrive.",
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
