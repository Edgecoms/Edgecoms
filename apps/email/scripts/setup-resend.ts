import { EDGE_APPS } from "@edgecoms/db/seed-data";
import { MAIL_EVENT_TYPES } from "../src/server/events/schema";
import { ensureResendSetup } from "../src/server/resend";

/**
 * Creates the Resend topics, contact properties and event names Edge Mail
 * relies on. Safe to re-run: it only creates what is missing.
 *
 *   bun run resend:setup     (reads apps/email/.env)
 */
const created = await ensureResendSetup({
	appSlugs: EDGE_APPS.map((app) => app.slug),
	eventNames: MAIL_EVENT_TYPES,
});
process.stdout.write(
	created.length > 0
		? `Created:\n  ${created.join("\n  ")}\n`
		: "Resend is already set up.\n"
);
