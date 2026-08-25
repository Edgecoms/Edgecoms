import { courseLeads } from "@edgecoms/db/schema/course-leads";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * The course site's OWN database client.
 *
 * It deliberately does NOT import `@edgecoms/db`'s root export. That module
 * pulls in `@edgecoms/env/server`, which requires `BETTER_AUTH_SECRET`,
 * `BETTER_AUTH_URL` and `CORS_ORIGIN` — the money platform's secrets. A public
 * marketing site on a different domain has no business holding those, and a
 * deploy that needs them just to save a name and an email is a deploy that will
 * eventually be given them.
 *
 * So only the table definition is imported (it depends on nothing but Drizzle),
 * and the connection is opened here from a single variable.
 */

const globalForDb = globalThis as unknown as {
	coursePool: Pool | undefined;
};

/**
 * Returns the client, or `null` when `DATABASE_URL` is unset.
 *
 * Null rather than a thrown error at import time, so the site still builds and
 * renders without a database. The *write path* is what fails closed — see
 * `submitLead`. What must never happen is the form telling somebody they are
 * signed up when nothing was stored.
 */
export function getDb() {
	const connectionString = process.env.DATABASE_URL;

	if (!connectionString) {
		return null;
	}

	// Cached UNCONDITIONALLY, in production as well as in dev.
	//
	// The familiar "only cache outside production" idiom exists to survive HMR,
	// and copying it here would have been a serious bug rather than a style
	// choice: this module is only ever reached from a server action, so an
	// uncached getDb() opens a brand new pool of `max` connections on every
	// single form submission and never closes any of them. Postgres starts
	// refusing connections under very ordinary traffic. Caching in dev too
	// keeps HMR from leaking pools for the same reason.
	const pool = globalForDb.coursePool ?? new Pool({ connectionString, max: 5 });

	globalForDb.coursePool = pool;

	return drizzle(pool, { schema: { courseLeads } });
}
