import { inArray } from "drizzle-orm";
import { db, pool } from "./index";
import {
	BFCM_PROMO_CODES,
	BFCM_PROMO_CYCLES,
	BFCM_PROMO_EXPIRES_AT,
} from "./promo-seed-data";
import { partnerCodes } from "./schema/partners";
import { promoCodes } from "./schema/promos";

/**
 * Issues the Black Friday promo codes. Idempotent: a code that already exists is
 * left exactly as it is, because issued terms are immutable (see
 * schema/promos.ts). Refuses to run if any code is already a partner code, the
 * same one-namespace rule the admin router enforces.
 * Run with: `bun run db:seed:promos` (loads apps/web/.env via --env-file).
 */
async function seedPromos() {
	const clashes = await db
		.select({ code: partnerCodes.code })
		.from(partnerCodes)
		.where(inArray(partnerCodes.code, [...BFCM_PROMO_CODES]));
	if (clashes.length > 0) {
		throw new Error(
			`Already partner codes: ${clashes.map((row) => row.code).join(", ")}`
		);
	}

	const inserted = await db
		.insert(promoCodes)
		.values(
			BFCM_PROMO_CODES.map((code) => ({
				code,
				discountKind: "free_cycles" as const,
				discountCycles: BFCM_PROMO_CYCLES,
				expiresAt: BFCM_PROMO_EXPIRES_AT,
			}))
		)
		.onConflictDoNothing({ target: promoCodes.code })
		.returning({ code: promoCodes.code });
	process.stdout.write(
		`Issued ${inserted.length} new promo codes; ${BFCM_PROMO_CODES.length - inserted.length} already existed.\n`
	);
}

seedPromos()
	.then(() => pool.end())
	.then(() => process.exit(0))
	.catch((error) => {
		process.stderr.write(`Promo seed failed: ${String(error)}\n`);
		pool.end().finally(() => process.exit(1));
	});
