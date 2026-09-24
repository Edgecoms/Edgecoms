import { parseArgs } from "node:util";
import { createDb } from "@edgecoms/db";
import { mailContacts } from "@edgecoms/db/schema/mail";
import { appSecret, env } from "@edgecoms/env/mail";
import { eq } from "drizzle-orm";
import { EdgeMail, type EdgeMailEvent } from "../clients/edge-mail-client";
import { MAIL_EVENT_TYPES } from "../src/server/events/schema";
import { preferencesUrl } from "../src/server/preferences/token";

/**
 * Plays an Edge app for local testing: sends one signed event to Edge Mail
 * through the same client file the Shopify apps copy, then prints the
 * merchant's preferences link (open it to opt them in to campaigns).
 *
 *   bun run simulate app.installed
 *   bun run simulate app.activated --email you@example.com --plan pro
 *   bun run simulate app.uninstalled --app edge-bundles --shop other.myshopify.com
 *   bun run simulate app.installed --id fixed-1     (repeat to see a duplicate)
 */

const { positionals, values } = parseArgs({
	allowPositionals: true,
	options: {
		app: { default: "edge-cart", type: "string" },
		email: { default: "merchant@example.com", type: "string" },
		id: { type: "string" },
		name: { default: "Alex", type: "string" },
		plan: { type: "string" },
		shop: { default: "demo-store.myshopify.com", type: "string" },
	},
});

function fail(message: string): never {
	process.stderr.write(`${message}\n`);
	process.exit(1);
}

const event = positionals[0] ?? "";
if (!(MAIL_EVENT_TYPES as readonly string[]).includes(event)) {
	fail(
		`Usage: bun run simulate <event> [--app slug] [--shop domain] [--email address] [--name first] [--plan handle] [--id eventId]\nEvents: ${MAIL_EVENT_TYPES.join(", ")}`
	);
}
const secret = appSecret(values.app);
if (!secret) {
	const key = `EDGE_MAIL_SECRET_${values.app.toUpperCase().replaceAll("-", "_")}`;
	fail(`Set ${key} (32+ characters) in apps/email/.env first.`);
}
if (!env.EDGE_MAIL_URL) {
	fail("Set EDGE_MAIL_URL in apps/email/.env (http://localhost:3006).");
}

const edgeMail = new EdgeMail({
	appId: values.app,
	endpoint: env.EDGE_MAIL_URL,
	maxAttempts: 1,
	secret,
});
const result = await edgeMail.track({
	contact: { email: values.email, firstName: values.name },
	event: event as EdgeMailEvent,
	eventId: values.id ?? `sim:${event}:${Date.now()}`,
	properties: values.plan ? { plan: values.plan } : {},
	store: { domain: values.shop, name: values.name },
});
process.stdout.write(`${event} as ${values.app}: ${JSON.stringify(result)}\n`);

const { db, pool } = createDb();
try {
	const [contact] = await db
		.select({ id: mailContacts.id })
		.from(mailContacts)
		.where(eq(mailContacts.email, values.email.trim().toLowerCase()))
		.limit(1);
	const link = contact ? preferencesUrl(contact.id) : null;
	process.stdout.write(
		link
			? `Preferences link: ${link}\n`
			: "No preferences link (set EDGE_MAIL_PREFERENCES_SECRET).\n"
	);
} finally {
	await pool.end();
}
