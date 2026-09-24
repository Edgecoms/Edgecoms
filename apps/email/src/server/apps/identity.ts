import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import { mailAppSettings } from "@edgecoms/db/schema/mail";
import { env } from "@edgecoms/env/mail";
import { asc, eq } from "drizzle-orm";
import type { AppIdentity } from "@/emails/templates";

/**
 * Every catalog app with its Edge Mail settings, or null settings when the app
 * has not been configured yet. The one query the Apps page, the template
 * gallery, the push script and the campaign sender all read.
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
		.orderBy(asc(apps.name));
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
 * Apps whose icon Edge Mail serves itself, from `apps/email/public/app-icons`,
 * as a 200px PNG (email clients cannot rely on WebP). Hosted by the SENDER on
 * purpose: an image in a sent email must keep resolving for years, so it
 * should not move when the marketing site does.
 */
const HOSTED_ICONS = new Set([
	"edge-bundles",
	"edge-cart",
	"edge-currency",
	"edge-reviews",
	"edge-subscriptions",
	"edge-timer",
]);

/** The hosted icon's public address, or null when this deploy has no URL set. */
export function hostedIconUrl(slug: string): string | null {
	if (!(HOSTED_ICONS.has(slug) && env.EDGE_MAIL_URL)) {
		return null;
	}
	return new URL(`/app-icons/${slug}.png`, env.EDGE_MAIL_URL).toString();
}

/** What a template needs to know about an app, configured or not. */
export function identityOf(app: AppWithSettings): AppIdentity {
	return {
		appUrl: app.settings?.appUrl ?? null,
		brandColor: app.settings?.brandColor ?? null,
		// An uploaded logo wins; otherwise the icon hosted here.
		logoUrl: app.settings?.logoUrl ?? hostedIconUrl(app.slug),
		name: app.name,
		reviewUrl: app.settings?.reviewUrl ?? null,
		slug: app.slug,
		supportUrl: app.settings?.supportUrl ?? null,
	};
}
