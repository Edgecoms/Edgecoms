import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { merchants } from "@edgecoms/db/schema/merchants";
import { partnerCodes, partners } from "@edgecoms/db/schema/partners";
import { eq } from "drizzle-orm";
import { bindAttribution } from "../attribution/bind";
import { previewCode } from "../attribution/preview";
import { createTestDb, type TestDb } from "./db-harness";

/**
 * DISCOUNT GRANTS — docs/partner-plan-discounts.md.
 *
 * What is being protected here:
 *
 *   • The allocation is PER PARTNER. Three codes must not yield three times the
 *     grants, which is the bug you get by counting on the code instead.
 *   • Terms are FROZEN at bind. Editing a code must never change what an
 *     already-bound store was promised.
 *   • Running out of allocation withholds the DISCOUNT, not the binding. The
 *     store still attributes and still earns commission at full price.
 */

const P1 = "aaaaaaaa-0000-0000-0000-000000000001";
const P2 = "aaaaaaaa-0000-0000-0000-000000000002";
const APP_SUB = "cccccccc-0000-0000-0000-000000000001";
const APP_BUNDLES = "cccccccc-0000-0000-0000-000000000002";

const NOW = new Date("2026-08-24T12:00:00Z");

let harness: TestDb;

beforeEach(async () => {
	harness = await createTestDb();
	await seed();
});

afterEach(async () => {
	await harness.close();
});

async function seed() {
	const { db } = harness;
	await db.insert(user).values([
		{ id: "u1", name: "Alex Agency", email: "alex@x.com", role: "partner" },
		{ id: "u2", name: "Rival Agency", email: "rival@x.com", role: "partner" },
	]);
	await db.insert(partners).values([
		{ id: P1, userId: "u1", status: "approved", defaultRateBps: 2500 },
		{ id: P2, userId: "u2", status: "approved", defaultRateBps: 2000 },
	]);
	await db.insert(apps).values([
		{
			id: APP_SUB,
			slug: "edge-subscription",
			name: "Edge Subscription",
			partnerApiGid: "gid://sub",
		},
		{
			id: APP_BUNDLES,
			slug: "edge-bundles",
			name: "Edge Bundles",
			partnerApiGid: "gid://bundles",
		},
	]);
	await db.insert(partnerCodes).values([
		// The agreed programme: 100% off Enterprise for 6 cycles, first 3 stores.
		// Three rather than ten so the exhaustion tests stay short.
		{
			partnerId: P1,
			code: "ALEXAGENCY",
			discountKind: "percentage",
			discountBps: 10_000,
			discountCycles: 6,
			discountGrantLimit: 3,
		},
		// A SECOND code for the same partner, same allocation.
		{
			partnerId: P1,
			code: "ALEXSECOND",
			discountKind: "percentage",
			discountBps: 10_000,
			discountCycles: 6,
			discountGrantLimit: 3,
		},
		// Phase 1 behaviour: binds fine, grants nothing.
		{ partnerId: P1, code: "NODISCOUNT" },
		// Unlimited allocation.
		{
			partnerId: P1,
			code: "ALEXUNLIMITED",
			discountKind: "free_cycles",
			discountCycles: 3,
		},
		{ partnerId: P2, code: "RIVALAGENCY" },
	]);
}

function bind(input: {
	code: string;
	shopDomain: string;
	appSlug?: string;
	paidAppSlugs?: string[];
}) {
	return bindAttribution(
		harness.db,
		{ appSlug: "edge-subscription", ...input },
		NOW
	);
}

async function merchantFor(shopDomain: string) {
	const row = await harness.db.query.merchants.findFirst({
		where: eq(merchants.shopDomain, shopDomain),
	});
	if (!row) {
		throw new Error(`no merchant for ${shopDomain}`);
	}
	return row;
}

describe("allocation", () => {
	test("grants the discount up to the limit, then stops", async () => {
		for (const n of [1, 2, 3]) {
			const result = await bind({
				code: "ALEXAGENCY",
				shopDomain: `store${n}.myshopify.com`,
			});
			expect(result.ok).toBe(true);
			expect(result.ok && result.offer).toEqual({
				kind: "percentage",
				bps: 10_000,
				amountMinor: null,
				currency: null,
				cycles: 6,
				appliesTo: "enterprise",
			});
		}

		const fourth = await bind({
			code: "ALEXAGENCY",
			shopDomain: "store4.myshopify.com",
		});
		// Still bound, still attributed, still earns — just no discount.
		expect(fourth.ok).toBe(true);
		expect(fourth.ok && fourth.status).toBe("bound");
		expect(fourth.ok && fourth.offer).toBeNull();
		expect((await merchantFor("store4.myshopify.com")).discountGrantedAt).toBe(
			null
		);
	});

	test("the allocation is shared across a partner's codes", async () => {
		await bind({ code: "ALEXAGENCY", shopDomain: "a.myshopify.com" });
		await bind({ code: "ALEXAGENCY", shopDomain: "b.myshopify.com" });
		// Different code, same partner — must consume the SAME allocation.
		await bind({ code: "ALEXSECOND", shopDomain: "c.myshopify.com" });

		const fourth = await bind({
			code: "ALEXSECOND",
			shopDomain: "d.myshopify.com",
		});
		expect(fourth.ok && fourth.offer).toBeNull();
	});

	test("one partner's grants do not consume another's", async () => {
		for (const n of [1, 2, 3]) {
			await bind({ code: "ALEXAGENCY", shopDomain: `p1-${n}.myshopify.com` });
		}
		const rival = await bind({
			code: "RIVALAGENCY",
			shopDomain: "rival.myshopify.com",
		});
		expect(rival.ok).toBe(true);
		// P2's code carries no discount, but the point is it was not blocked by
		// P1 exhausting its own allocation.
		expect(rival.ok && rival.status).toBe("bound");
	});

	test("a null limit grants without bound", async () => {
		for (const n of [1, 2, 3, 4, 5]) {
			const result = await bind({
				code: "ALEXUNLIMITED",
				shopDomain: `u${n}.myshopify.com`,
			});
			expect(result.ok && result.offer).toEqual({
				kind: "free_cycles",
				bps: null,
				amountMinor: null,
				currency: null,
				cycles: 3,
				appliesTo: "enterprise",
			});
		}
	});

	test("a rejected merchant releases its slot", async () => {
		for (const n of [1, 2, 3]) {
			await bind({ code: "ALEXAGENCY", shopDomain: `r${n}.myshopify.com` });
		}
		await harness.db
			.update(merchants)
			.set({ status: "rejected" })
			.where(eq(merchants.shopDomain, "r1.myshopify.com"));

		const next = await bind({
			code: "ALEXAGENCY",
			shopDomain: "r4.myshopify.com",
		});
		expect(next.ok && next.offer).not.toBeNull();
	});

	test("an approved merchant keeps its slot", async () => {
		for (const n of [1, 2, 3]) {
			await bind({ code: "ALEXAGENCY", shopDomain: `k${n}.myshopify.com` });
		}
		await harness.db
			.update(merchants)
			.set({ status: "approved" })
			.where(eq(merchants.shopDomain, "k1.myshopify.com"));

		const next = await bind({
			code: "ALEXAGENCY",
			shopDomain: "k4.myshopify.com",
		});
		expect(next.ok && next.offer).toBeNull();
	});

	/**
	 * PGlite is a single in-process connection, so two transactions cannot truly
	 * overlap here and this does NOT exercise the `FOR UPDATE` lock. What it does
	 * prove is that concurrently-issued binds never exceed the allocation, which
	 * is the invariant; the lock is what makes it hold on real Postgres too.
	 */
	test("concurrently issued binds cannot exceed the allocation", async () => {
		const results = await Promise.all(
			[1, 2, 3, 4, 5].map((n) =>
				bind({ code: "ALEXAGENCY", shopDomain: `c${n}.myshopify.com` })
			)
		);
		const granted = results.filter((r) => r.ok && r.offer !== null);
		expect(granted).toHaveLength(3);
	});
});

describe("freezing", () => {
	test("a replay returns the same frozen grant and consumes no second slot", async () => {
		const first = await bind({
			code: "ALEXAGENCY",
			shopDomain: "shop.myshopify.com",
			appSlug: "edge-subscription",
		});
		// The same store installing a second Edge app.
		const second = await bind({
			code: "ALEXAGENCY",
			shopDomain: "shop.myshopify.com",
			appSlug: "edge-bundles",
		});

		expect(second.ok && second.status).toBe("already_bound");
		expect(second.ok && second.offer).toEqual(first.ok ? first.offer : null);

		// One store, one slot — two more grants must still be available.
		await bind({ code: "ALEXAGENCY", shopDomain: "x2.myshopify.com" });
		await bind({ code: "ALEXAGENCY", shopDomain: "x3.myshopify.com" });
		const fourth = await bind({
			code: "ALEXAGENCY",
			shopDomain: "x4.myshopify.com",
		});
		expect(fourth.ok && fourth.offer).toBeNull();
	});

	test("editing a code does not alter an already-bound merchant's grant", async () => {
		await bind({ code: "ALEXAGENCY", shopDomain: "frozen.myshopify.com" });

		await harness.db
			.update(partnerCodes)
			.set({ discountBps: 2000, discountCycles: 1 })
			.where(eq(partnerCodes.code, "ALEXAGENCY"));

		const merchant = await merchantFor("frozen.myshopify.com");
		expect(merchant.discountBps).toBe(10_000);
		expect(merchant.discountCycles).toBe(6);

		// And a replay still reads the frozen terms, not the code's new ones.
		const replay = await bind({
			code: "ALEXAGENCY",
			shopDomain: "frozen.myshopify.com",
		});
		expect(replay.ok && replay.offer).toMatchObject({ bps: 10_000, cycles: 6 });
	});

	test("a code with no discount grants nothing and records nothing", async () => {
		const result = await bind({
			code: "NODISCOUNT",
			shopDomain: "plain.myshopify.com",
		});
		expect(result.ok && result.offer).toBeNull();
		const merchant = await merchantFor("plain.myshopify.com");
		expect(merchant.discountKind).toBe("none");
		expect(merchant.discountGrantedAt).toBe(null);
	});
});

describe("grandfathered apps", () => {
	test("the asking app gets no offer when the store already pays for it", async () => {
		const result = await bind({
			code: "ALEXAGENCY",
			shopDomain: "old.myshopify.com",
			appSlug: "edge-bundles",
			paidAppSlugs: ["edge-bundles"],
		});
		expect(result.ok && result.offer).toBeNull();
	});

	test("but the grant still stands for the apps that are new", async () => {
		await bind({
			code: "ALEXAGENCY",
			shopDomain: "mixed.myshopify.com",
			appSlug: "edge-bundles",
			paidAppSlugs: ["edge-bundles"],
		});
		// A different app on the same store: new business, so it may discount.
		const fresh = await bind({
			code: "ALEXAGENCY",
			shopDomain: "mixed.myshopify.com",
			appSlug: "edge-subscription",
		});
		expect(fresh.ok && fresh.offer).toMatchObject({ bps: 10_000 });
	});
});

describe("preview", () => {
	test("shows the offer a new store would receive", async () => {
		const preview = await previewCode(
			harness.db,
			{ code: "ALEXAGENCY", shopDomain: "new.myshopify.com" },
			NOW
		);
		expect(preview).toMatchObject({
			ok: true,
			valid: true,
			offer: { kind: "percentage", bps: 10_000, cycles: 6 },
		});
	});

	test("shows null once the allocation is spent", async () => {
		for (const n of [1, 2, 3]) {
			await bind({ code: "ALEXAGENCY", shopDomain: `s${n}.myshopify.com` });
		}
		const preview = await previewCode(
			harness.db,
			{ code: "ALEXAGENCY", shopDomain: "late.myshopify.com" },
			NOW
		);
		expect(preview).toMatchObject({ ok: true, valid: true, offer: null });
	});

	test("shows the frozen grant for a store already bound", async () => {
		await bind({ code: "ALEXAGENCY", shopDomain: "bound.myshopify.com" });
		await harness.db
			.update(partnerCodes)
			.set({ discountBps: 500 })
			.where(eq(partnerCodes.code, "ALEXAGENCY"));

		const preview = await previewCode(
			harness.db,
			{ code: "ALEXAGENCY", shopDomain: "bound.myshopify.com" },
			NOW
		);
		expect(preview).toMatchObject({ offer: { bps: 10_000 } });
	});

	test("promises nothing on another partner's store", async () => {
		await bind({ code: "RIVALAGENCY", shopDomain: "taken.myshopify.com" });
		const preview = await previewCode(
			harness.db,
			{ code: "ALEXAGENCY", shopDomain: "taken.myshopify.com" },
			NOW
		);
		expect(preview).toMatchObject({ ok: true, valid: true, offer: null });
	});
});
