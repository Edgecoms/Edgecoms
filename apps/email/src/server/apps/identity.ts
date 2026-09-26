import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import { mailAppSettings } from "@edgecoms/db/schema/mail";
import { env } from "@edgecoms/env/mail";
import { and, asc, eq, inArray } from "drizzle-orm";
import type { AppIdentity } from "@/emails/templates";

/**
 * The apps Edge Mail serves, with each one's Shopify App Store listing (from
 * the marketing catalog, apps/web/src/lib/products.ts). The shared `apps`
 * catalog also holds Trackproof, which is out of scope for now; adding it
 * means adding it here (and its icon to `public/app-icons`, which a test
 * checks).
 */
const APP_STORE_LISTINGS = {
	"edge-bundles": "https://apps.shopify.com/edge-bundles",
	"edge-cart": "https://apps.shopify.com/edgecart",
	"edge-currency": "https://apps.shopify.com/edge-currency",
	"edge-reviews": "https://apps.shopify.com/edge-reviews",
	"edge-subscriptions": "https://apps.shopify.com/edge-subscription",
	"edge-timer": "https://apps.shopify.com/urgency-timer",
} as const;

export const MAIL_APP_SLUGS = Object.keys(
	APP_STORE_LISTINGS
) as readonly (keyof typeof APP_STORE_LISTINGS)[];

/**
 * Each app's Shopify client id (the `client_id` in its shopify.app.toml).
 * Public, not a secret: the admin opens an installed app by it.
 */
const CLIENT_IDS: Record<(typeof MAIL_APP_SLUGS)[number], string> = {
	"edge-bundles": "83b1eb07b6463a1c8cf28031a507ea7f",
	"edge-cart": "5957f4800812fe7bacbaae0c4abfc411",
	"edge-currency": "56540f1533d5c549f42c30eb3d8ac399",
	"edge-reviews": "8f98e9e5db93521fb328ca60269ae4ea",
	"edge-subscriptions": "b42bfc6479a53048cfd6c1dc4c0e2a65",
	"edge-timer": "5ed2d50b3a29697af7360b72762d758b",
};

const MYSHOPIFY = /\.myshopify\.com$/;

/**
 * The app open inside this store's admin, so a button lands the merchant in
 * the app rather than on its App Store page. The store handle in an admin URL
 * is the myshopify subdomain.
 */
export function adminUrl(slug: string, shopDomain: string): string | null {
	const clientId = CLIENT_IDS[slug as keyof typeof CLIENT_IDS];
	if (!(clientId && MYSHOPIFY.test(shopDomain))) {
		return null;
	}
	const store = shopDomain.replace(MYSHOPIFY, "");
	return `https://admin.shopify.com/store/${store}/apps/${clientId}`;
}

/** Where a merchant gets help with any Edge app. */
export const SUPPORT_URL = "https://edgecoms.app/contact";

/**
 * Edge Mail's apps with their settings, or null settings for an app with no
 * sender yet. The one query the Apps page, the template gallery, the push
 * script and the campaign sender all read.
 */
export function listAppsWithSettings(db: Database) {
	return db
		.select({
			appId: apps.id,
			name: apps.name,
			slug: apps.slug,
			settings: mailAppSettings,
		})
		.from(apps)
		.leftJoin(mailAppSettings, eq(mailAppSettings.appId, apps.id))
		.where(inArray(apps.slug, [...MAIL_APP_SLUGS]))
		.orderBy(asc(apps.name));
}

/** One of Edge Mail's apps with its settings, or undefined. */
export async function appWithSettings(db: Database, appId: string) {
	const [app] = await db
		.select({
			appId: apps.id,
			name: apps.name,
			slug: apps.slug,
			settings: mailAppSettings,
		})
		.from(apps)
		.leftJoin(mailAppSettings, eq(mailAppSettings.appId, apps.id))
		.where(and(eq(apps.id, appId), inArray(apps.slug, [...MAIL_APP_SLUGS])))
		.limit(1);
	return app;
}

export type AppWithSettings = Awaited<
	ReturnType<typeof listAppsWithSettings>
>[number];

/** The `From:` header for an app. */
export function fromHeader(settings: {
	senderEmail: string;
	senderName: string;
}): string {
	return `${settings.senderName} <${settings.senderEmail}>`;
}

/**
 * Every Edge Mail app's icon is served from `apps/email/public/app-icons` as a
 * 200px PNG (email clients cannot rely on WebP). Hosted by the SENDER on
 * purpose: an image in a sent email must keep resolving for years, so it
 * should not move when the marketing site does.
 */
const HOSTED_ICONS = new Set<string>(MAIL_APP_SLUGS);

/** The hosted icon's public address, or null when this deploy has no URL set. */
export function hostedIconUrl(slug: string): string | null {
	if (!(HOSTED_ICONS.has(slug) && env.EDGE_MAIL_URL)) {
		return null;
	}
	return new URL(`/app-icons/${slug}.png`, env.EDGE_MAIL_URL).toString();
}

function listingOf(slug: string): string | null {
	return slug in APP_STORE_LISTINGS
		? APP_STORE_LISTINGS[slug as keyof typeof APP_STORE_LISTINGS]
		: null;
}

/**
 * An app's links and icon, derived rather than configured. The App Store
 * listing doubles as the way back into the app: for a merchant who has it
 * installed, Shopify shows "Open app" there.
 */
export function linksOf(slug: string) {
	const listing = listingOf(slug);
	return {
		appUrl: listing,
		logoUrl: hostedIconUrl(slug),
		reviewUrl: listing ? `${listing}/reviews` : null,
		supportUrl: SUPPORT_URL,
	};
}

/** What a template needs to know about an app. */
export function identityOf(app: { name: string; slug: string }): AppIdentity {
	return { ...linksOf(app.slug), name: app.name, slug: app.slug };
}
