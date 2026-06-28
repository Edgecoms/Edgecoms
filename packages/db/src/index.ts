import { env } from "@edgecoms/env/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// biome-ignore lint/performance/noNamespaceImport: Drizzle needs the full schema namespace.
import * as schema from "./schema";

/**
 * Creates a Drizzle client backed by an explicit pg Pool. The Pool is returned
 * alongside the client so callers that own a process lifecycle (the billing
 * worker, seed scripts) can `await pool.end()` and let the process exit — the
 * Railway cron invariant in CLAUDE.md depends on this.
 */
export function createDb() {
	const pool = new Pool({ connectionString: env.DATABASE_URL });
	const db = drizzle(pool, { schema });
	return { db, pool };
}

const instance = createDb();

/** Long-lived app-wide client (Next.js server runtime, auth). */
export const db = instance.db;
export const pool = instance.pool;

export type Database = typeof db;
