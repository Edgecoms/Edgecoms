import { createDb } from "@edgecoms/db";
import { env } from "@edgecoms/env/mail";
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
import {
	lifecycleAutomation,
	upsertAutomation,
	upsertTemplate,
} from "../src/server/resend";

/**
 * Renders every lifecycle template for every CONFIGURED app, pushes it to
 * Resend as `<app-slug>-<template>`, then creates or updates the automation
 * that sends it. Apps without settings are skipped: they have no sender yet.
 * Safe to re-run; each run updates in place.
 *
 *   bun run resend:push-templates     (reads apps/email/.env)
 */
// These templates go to real inboxes: their icon and link addresses must be
// the public HTTPS app, never a dev server.
if (!env.EDGE_MAIL_URL?.startsWith("https://")) {
	process.stderr.write(
		`EDGE_MAIL_URL is "${env.EDGE_MAIL_URL ?? ""}". Push templates with the production URL (https://email.edgecoms.app), not a local one.\n`
	);
	process.exit(1);
}

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
			const name = `${app.name}: ${LIFECYCLE_NAMES[template]}`;
			const outcome = await upsertTemplate({
				alias: `${app.slug}-${template}`,
				from: fromHeader(settings),
				html: renderMinimalHtml(content, brand),
				name,
				subject: content.subject,
				text: renderText(content, brand),
				variables,
			});
			const automation = await upsertAutomation(
				name,
				lifecycleAutomation(app.slug, template, fromHeader(settings))
			);
			process.stdout.write(
				`${outcome} ${app.slug}-${template}, automation ${automation}\n`
			);
		}
	}
} finally {
	// A script that leaves the pool open never exits.
	await pool.end();
}
