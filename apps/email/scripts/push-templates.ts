import { createDb } from "@edgecoms/db";
import {
	RESEND_UNSUBSCRIBE_URL,
	renderHtml,
	renderText,
} from "@edgecoms/mail/render";
import {
	brandFor,
	LIFECYCLE_NAMES,
	LIFECYCLE_TEMPLATES,
	lifecycleContent,
} from "../src/emails/templates";
import {
	fromHeader,
	identityOf,
	listAppsWithSettings,
} from "../src/server/apps/identity";
import { upsertTemplate } from "../src/server/resend";

/**
 * Renders every lifecycle template for every CONFIGURED app and pushes it to
 * Resend as `<app-slug>-<template>`. Apps without settings are skipped: they
 * have no sender yet. Safe to re-run; each run updates in place.
 *
 *   bun run resend:push-templates     (reads apps/email/.env)
 */
const { db, pool } = createDb();
try {
	for (const app of await listAppsWithSettings(db)) {
		const settings = app.settings;
		if (!settings) {
			process.stdout.write(`skip ${app.slug}: not configured\n`);
			continue;
		}
		const identity = identityOf(app);
		const brand = brandFor(identity, RESEND_UNSUBSCRIBE_URL);
		for (const template of LIFECYCLE_TEMPLATES) {
			const content = lifecycleContent(template, identity);
			const outcome = await upsertTemplate({
				alias: `${app.slug}-${template}`,
				from: fromHeader(settings),
				html: renderHtml(content, brand),
				name: `${app.name}: ${LIFECYCLE_NAMES[template]}`,
				replyTo: settings.replyTo,
				subject: content.subject,
				text: renderText(content, brand),
			});
			process.stdout.write(`${outcome} ${app.slug}-${template}\n`);
		}
	}
} finally {
	// A script that leaves the pool open never exits.
	await pool.end();
}
