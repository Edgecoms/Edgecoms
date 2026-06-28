import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Database } from "@edgecoms/db";
// biome-ignore lint/performance/noNamespaceImport: Drizzle needs the full schema namespace.
import * as schema from "@edgecoms/db/schema/index";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

/** In-process Postgres (PGlite) with the real migration applied — for testing
 * the tRPC routers against actual SQL with a fabricated session context. */

const MIGRATIONS_DIR = join(import.meta.dir, "../../../db/src/migrations");

function loadMigrationSql(): string {
	return readdirSync(MIGRATIONS_DIR)
		.filter((file) => file.endsWith(".sql"))
		.sort()
		.map((file) => readFileSync(join(MIGRATIONS_DIR, file), "utf8"))
		.join("\n");
}

export interface TestDb {
	client: PGlite;
	close: () => Promise<void>;
	db: Database;
}

export async function createTestDb(): Promise<TestDb> {
	const client = new PGlite();
	await client.exec(loadMigrationSql());
	const db = drizzle(client, { schema }) as unknown as Database;
	return { db, client, close: () => client.close() };
}
