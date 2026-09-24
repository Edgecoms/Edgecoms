import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import { mailAppSettings } from "@edgecoms/db/schema/mail";
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

/** What a template needs to know about an app, configured or not. */
export function identityOf(app: AppWithSettings): AppIdentity {
	return {
		appUrl: app.settings?.appUrl ?? null,
		brandColor: app.settings?.brandColor ?? null,
		name: app.name,
		reviewUrl: app.settings?.reviewUrl ?? null,
		slug: app.slug,
		supportUrl: app.settings?.supportUrl ?? null,
	};
}
