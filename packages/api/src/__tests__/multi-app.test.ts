import { afterEach, beforeEach, expect, test } from "bun:test";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { merchants } from "@edgecoms/db/schema/merchants";
import { partnerCodes, partners } from "@edgecoms/db/schema/partners";
import { eq } from "drizzle-orm";
import { ATTEMPT_LIMIT } from "../attribution/attempts";
import { bindAttribution } from "../attribution/bind";
import { createTestDb, type TestDb } from "./db-harness";

/**
 * ONE STORE, EVERY EDGE APP, THE SAME CODE.
 *
 * The real onboarding shape: a merchant who takes the whole suite pastes the
 * same code into each app as they install it. Every one of those is a separate
 * call to /attributions for the same shop.
 */

const P = "aaaaaaaa-0000-0000-0000-000000000001";
const SHOP = "suite.myshopify.com";
const NOW = new Date("2026-08-24T12:00:00Z");

/** The full seeded catalog. */
const ALL_APPS = [
	"edge-bundles",
	"edge-timer",
	"edge-reviews",
	"edge-cart",
	"edge-currency",
	"edge-subscriptions",
	"trackproof",
];

let harness: TestDb;

beforeEach(async () => {
	harness = await createTestDb();
	const { db } = harness;
	await db
		.insert(user)
		.values({ id: "u1", name: "Alex", email: "a@x.com", role: "partner" });
	await db.insert(partners).values({
		id: P,
		userId: "u1",
		status: "approved",
		defaultRateBps: 2000,
	});
	await db.insert(apps).values(
		ALL_APPS.map((slug, i) => ({
			id: `cccccccc-0000-0000-0000-00000000000${i + 1}`,
			slug,
			name: slug,
			partnerApiGid: `gid://${slug}`,
		}))
	);
	await db.insert(partnerCodes).values({
		partnerId: P,
		code: "SUITECODE",
		discountKind: "percentage",
		discountBps: 10_000,
		discountCycles: 6,
		discountGrantLimit: 10,
	});
});

afterEach(async () => {
	await harness.close();
});

test("the same code works in every Edge app the merchant installs", async () => {
	const results: Awaited<ReturnType<typeof bindAttribution>>[] = [];
	for (const appSlug of ALL_APPS) {
		results.push(
			await bindAttribution(
				harness.db,
				{ appSlug, code: "SUITECODE", shopDomain: SHOP },
				NOW
			)
		);
	}

	// Every app must get a usable answer. None may be turned away.
	const refused = results
		.map((r, i) => (r.ok ? null : `${ALL_APPS[i]}=${r.status}`))
		.filter(Boolean);
	expect(refused).toEqual([]);

	// First is the bind, the rest are replays of the same binding.
	expect(results[0]?.ok && results[0].status).toBe("bound");
	for (const r of results.slice(1)) {
		expect(r.ok && r.status).toBe("already_bound");
	}

	// Every app receives the SAME discount terms, so each can apply it.
	for (const r of results) {
		expect(r.ok && r.offer).toMatchObject({ bps: 10_000, cycles: 6 });
	}

	// One store, one merchant row, one grant slot.
	const rows = await harness.db
		.select()
		.from(merchants)
		.where(eq(merchants.shopDomain, SHOP));
	expect(rows).toHaveLength(1);
	expect(rows[0]?.discountGrantedAt).not.toBeNull();
});

test("a legitimate install run does not spend the abuse budget", async () => {
	// Bind through every app first: seven successes for one shop.
	for (const appSlug of ALL_APPS) {
		await bindAttribution(
			harness.db,
			{ appSlug, code: "SUITECODE", shopDomain: SHOP },
			NOW
		);
	}

	// The limiter must still fire on real enumeration afterwards, otherwise
	// excluding successes would have traded one bug for a hole.
	for (let i = 0; i < ATTEMPT_LIMIT; i++) {
		const guess = await bindAttribution(
			harness.db,
			{ appSlug: "edge-cart", code: `WRONG${i}`, shopDomain: SHOP },
			NOW
		);
		expect(guess).toEqual({ ok: false, status: "invalid_code" });
	}
	const blocked = await bindAttribution(
		harness.db,
		{ appSlug: "edge-cart", code: "SUITECODE", shopDomain: SHOP },
		NOW
	);
	expect(blocked).toEqual({ ok: false, status: "rate_limited" });
});
