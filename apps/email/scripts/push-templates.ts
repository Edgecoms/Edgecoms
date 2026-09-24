import { createDb } from "@edgecoms/db";
import { renderMinimalHtml } from "@edgecoms/mail/minimal";
import { renderText } from "@edgecoms/mail/render";
import {
	brandFor,
	LIFECYCLE_NAMES,
	LIFECYCLE_TEMPLATES,
	LIFECYCLE_VARIABLES,
	lifecycleContent,
	TEMPLATE_VARIABLES,
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
		const brand = brandFor(identity, TEMPLATE_VARIABLES.preferencesUrl);
		// With no preferences link in the event, the manage link still goes
		// somewhere real: the app's support page.
		const variables = LIFECYCLE_VARIABLES.map((variable) => ({
			fallbackValue:
				variable.fallback ?? identity.supportUrl ?? "https://edgecoms.app",
			key: variable.key,
		}));
		for (const template of LIFECYCLE_TEMPLATES) {
			const content = lifecycleContent(template, identity);
			const outcome = await upsertTemplate({
				alias: `${app.slug}-${template}`,
				from: fromHeader(settings),
				html: renderMinimalHtml(content, brand),
				name: `${app.name}: ${LIFECYCLE_NAMES[template]}`,
				subject: content.subject,
				text: renderText(content, brand),
				variables,
			});
			process.stdout.write(`${outcome} ${app.slug}-${template}\n`);
		}
	}
} finally {
	// A script that leaves the pool open never exits.
	await pool.end();
}
