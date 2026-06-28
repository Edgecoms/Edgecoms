import { db, pool } from "./index";
import { apps } from "./schema/apps";
import { EDGE_APPS, resolveAppGid } from "./seed-data";

/**
 * Seeds the 9 Edge apps. Idempotent: upserts on `slug`, refreshing the name and
 * Partner API GID, so re-running (e.g. after setting real GIDs via env) is safe.
 * Run with: `bun run db:seed` (loads apps/web/.env via --env-file).
 */
async function seed() {
	for (const app of EDGE_APPS) {
		const partnerApiGid = resolveAppGid(app);
		await db
			.insert(apps)
			.values({ slug: app.slug, name: app.name, partnerApiGid })
			.onConflictDoUpdate({
				target: apps.slug,
				set: { name: app.name, partnerApiGid },
			});
	}
	process.stdout.write(`Seeded ${EDGE_APPS.length} Edge apps.\n`);
}

seed()
	.then(() => pool.end())
	.then(() => process.exit(0))
	.catch((error) => {
		process.stderr.write(`Seed failed: ${String(error)}\n`);
		pool.end().finally(() => process.exit(1));
	});
