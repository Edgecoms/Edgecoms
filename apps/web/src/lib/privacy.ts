/**
 * THE SUITE-WIDE PRIVACY POLICY — the single public URL every Edge app's
 * Shopify App Store listing points at.
 *
 * Three rules hold across this file, and they are the reason it exists as data
 * rather than as prose typed into a page:
 *
 * 1. **Every claim here is checked against the code.** The per-app rows below
 *    were written by reading each app's Prisma schema, not by describing what
 *    the app is for. A privacy policy that overstates what you delete or
 *    understates what you store is a regulatory problem, so when an app starts
 *    storing something new, its row changes in the same pull request.
 * 2. **Merchant and shopper data are named separately.** For shopper data the
 *    merchant is the controller and Edgecoms is the processor; for merchant and
 *    partner data Edgecoms is the controller. Collapsing the two would misstate
 *    who a data-subject request goes to.
 * 3. **No sub-processor appears here until it is actually wired up.** A list
 *    that names a vendor "for future use" is a disclosure of a transfer that
 *    never happened.
 */

/**
 * The operating entity.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BEFORE THIS PAGE GOES LIVE, replace `legalName` with the exact registered
 * company name and set `registeredAddress`. Both are named here once so the
 * change is a two-line edit rather than a search across the page.
 *
 * `registeredAddress` is `null` today and the contact section renders without
 * it rather than printing a placeholder, so an unfinished value can never ship
 * as visible text. Article 13 GDPR wants the controller's identity and contact
 * details, and a postal address is the part reviewers look for.
 *
 * NOTE: the per-app policies still shipping inside the app repos
 * (`trackproof/PRIVACY-POLICY.md`, `edge-bundles/app/routes/privacy.tsx`,
 * `edge-subscription/app/lib/brand.ts`) name a *different* entity. Those need
 * to be corrected to match this file, or the two disagree in public.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const PRIVACY_ENTITY = {
	legalName: "Edgecoms",
	privacyEmail: "privacy@edgecoms.com",
	registeredAddress: null as string | null,
	supportEmail: "support@edgecoms.com",
} as const;

/** Rendered as "Last updated". Bump it whenever a claim below changes. */
export const PRIVACY_UPDATED = "September 5, 2026";

/**
 * What each app stores about a merchant's shoppers.
 *
 * Keyed by the same slugs as `EDGE_PRODUCTS` so the page can render the two
 * side by side and a missing row is visible rather than silent. `stores` is
 * what the app writes to its own database; `notCollected` is the explicit
 * negative, which is the half of a privacy policy a merchant's legal team
 * actually reads.
 */
export interface AppDataRow {
	notCollected: string;
	slug: string;
	stores: string;
}

export const APP_DATA_ROWS: readonly AppDataRow[] = [
	{
		slug: "edge-cart",
		stores:
			"Cart drawer events — opens, checkout clicks, upsell impressions and adds, discount code applications — each carrying a random session identifier and the cart total at the time of the event.",
		notCollected:
			"Names, email addresses, postal addresses, payment details, or any order contents beyond an anonymous checkout-click count.",
	},
	{
		slug: "edge-bundles",
		stores:
			"Bundle views, add-to-carts, tier selections and purchases keyed to an anonymous per-tab session identifier; the Shopify customer identifier for signed-in shoppers so repeat-buyer analytics work; abandoned-bundle records where the merchant has switched recovery on; and a 90-day assignment cookie while an A/B test is running.",
		notCollected:
			"Customer names, phone numbers, postal addresses or payment details. Order line items and totals are read for revenue attribution; the customer fields on those orders are not.",
	},
	{
		slug: "edge-timer",
		stores:
			"Timer impressions, each with an anonymous visitor identifier, IP address, browser user-agent, country, page URL and product identifier — the record behind the conversion reporting in the merchant's dashboard.",
		notCollected:
			"Names, email addresses, phone numbers, postal addresses or payment details.",
	},
	{
		slug: "edge-reviews",
		stores:
			"Reviews a shopper chooses to submit, including the display name and any photos attached; the customer email address a review request is sent to; and an opt-out suppression list so somebody who unsubscribes is never emailed again.",
		notCollected:
			"Phone numbers, postal addresses or payment details. Review request emails are sent only for orders the merchant has configured a flow for.",
	},
	{
		slug: "edge-currency",
		stores:
			"Currency widget views and switches, recording the currency moved from and to and the visitor's country, so the merchant can see which markets convert.",
		notCollected:
			"Any identifier for the visitor at all — no session id, no IP address, no cookies beyond the currency preference held in the shopper's own browser.",
	},
	{
		slug: "edge-subscriptions",
		stores:
			"The subscription contracts the app runs on the merchant's behalf: customer email address and Shopify customer identifier, the charges raised against each contract, and a cancellation reason where the shopper gives one.",
		notCollected:
			"Payment card details. Subscriptions run on Shopify's native Subscription Contracts API, so card data stays with Shopify's payment processor and never reaches Edgecoms.",
	},
	{
		slug: "trackproof",
		stores:
			"Storefront and order events — page views, product views, add-to-carts, checkout steps, purchases and refunds — together with the browser user-agent, IP address, page URL, referrer and Shopify browser identifier used for ad-platform match quality. Customer email, phone, name and billing or shipping location taken from orders are stored only as AES-256-GCM ciphertext, never in plain text, and are hashed with SHA-256 before being transmitted to any advertising platform.",
		notCollected:
			"Payment details. Raw email addresses and phone numbers are never transmitted to a third party and never logged.",
	},
];

export interface Subprocessor {
	/** What it is given. The narrow answer, not the vendor's own blurb. */
	dataShared: string;
	name: string;
	purpose: string;
}

/**
 * Everyone outside Edgecoms who touches this data. Kept deliberately short:
 * each entry is a transfer somebody is entitled to object to.
 */
export const SUBPROCESSORS: readonly Subprocessor[] = [
	{
		name: "Shopify",
		purpose:
			"The platform the apps run on, the source of storefront and order events, and the biller for every subscription.",
		dataShared:
			"Shopify is the origin of this data rather than a recipient of it. Its own privacy terms govern the store.",
	},
	{
		name: "Railway",
		purpose:
			"Application hosting and the PostgreSQL databases behind the Edge apps. Servers are in the United States.",
		dataShared: "All app data described above, encrypted at rest.",
	},
	{
		name: "Vercel",
		purpose:
			"Hosting for edgecoms.com and cookieless aggregate traffic analytics for the marketing site.",
		dataShared:
			"Website request data. The analytics are aggregate and set no cookies; they do not identify a visitor.",
	},
	{
		name: "Resend",
		purpose:
			"Transactional email — merchant digests, review requests, subscription notices, and data-request exports.",
		dataShared:
			"The recipient's email address and the contents of the message being sent.",
	},
	{
		name: "Sentry",
		purpose: "Error monitoring and crash reporting.",
		dataShared:
			"Stack traces and request metadata. Customer personal data is not sent to Sentry.",
	},
	{
		name: "Discord",
		purpose:
			"In-app support messages are relayed to a private support workspace so the team can answer them.",
		dataShared:
			"The contents of a support conversation and the email address of whoever started it.",
	},
	{
		name: "Meta, TikTok and Google",
		purpose:
			"Destinations for Trackproof only, and only the accounts a merchant has connected themselves.",
		dataShared:
			"Conversion events, with customer identifiers hashed (SHA-256) before they are sent. Coarse location fields — city, region, postal code, country — are sent unhashed where the receiving platform requires that for matching.",
	},
	{
		name: "LLM providers (Anthropic, OpenAI, Google or OpenRouter)",
		purpose:
			"Power the AI copywriting and recommendation features inside Edge Bundles, depending on configuration.",
		dataShared:
			"Product titles, the merchant's brand-voice notes, and aggregate co-purchase counts. No shopper identifiers and no order records.",
	},
];

/**
 * The three Shopify webhooks that make deletion real, quoted by their wire
 * names because that is what an App Store reviewer searches this page for.
 */
export const REDACTION_WEBHOOKS: readonly {
	behaviour: string;
	topic: string;
}[] = [
	{
		topic: "customers/data_request",
		behaviour:
			"Everything held about that shopper is compiled and returned to the merchant, who relays it. For Trackproof this is limited to event metadata and hashed identifiers.",
	},
	{
		topic: "customers/redact",
		behaviour:
			"Every row tied to that shopper is deleted, matched on both the Shopify customer identifier and the email address.",
	},
	{
		topic: "shop/redact",
		behaviour:
			"Sent by Shopify roughly 48 hours after an uninstall. The store's entire dataset — configuration, events, credentials and sessions — is hard-deleted.",
	},
];

/** Retention windows that apply even while an app stays installed. */
export const RETENTION_RULES: readonly string[] = [
	"Edge Cart analytics events are purged automatically after 90 days.",
	"Trackproof event records are kept only as long as they are needed to deliver a conversion and power the verification dashboard, on a retention window the merchant sets to 30, 90 or 180 days.",
	"Marketing leads submitted on edgecoms.com are kept until the person asks for deletion.",
	"Everything else is retained while the app is installed and deleted on redaction or uninstall.",
];
