import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apps } from "@edgecoms/db/schema/apps";
import { merchantEvents } from "@edgecoms/db/schema/attribution";
import { user } from "@edgecoms/db/schema/auth";
import { commissions, earningEvents } from "@edgecoms/db/schema/earnings";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { partners } from "@edgecoms/db/schema/partners";
import type { Context } from "../context";
import { createCallerFactory } from "../index";
import { appRouter } from "../routers/index";
import { createTestDb, type TestDb } from "./db-harness";

/**
 * `partner.apps` -- the suite as it stands on one partner's own stores.
 *
 * Three states are derived here and the whole screen depends on telling them
 * apart: what is RUNNING (the apps report it), what is EARNING (commission
 * rows exist), and what is GRANDFATHERED (installed, and never earns because
 * the store was already paying for it when the partner arrived).
 *
 * Confusing live with earning would have the portal promise a partner money on
 * an app that is structurally incapable of paying them, so each state is
 * pinned separately, and the tenant wall is pinned alongside them.
 */

const createCaller = createCallerFactory(appRouter);

const PARTNER = "aaaaaaaa-0000-0000-0000-000000000001";
const OTHER = "aaaaaaaa-0000-0000-0000-000000000002";
const STORE_A = "bbbbbbbb-0000-0000-0000-00000000000a";
const STORE_B = "bbbbbbbb-0000-0000-0000-00000000000b";
const STORE_C = "bbbbbbbb-0000-0000-0000-00000000000c";
const CART = "cccccccc-0000-0000-0000-000000000001";
const REVIEWS = "cccccccc-0000-0000-0000-000000000002";
const TIMER = "cccccccc-0000-0000-0000-000000000003";

let harness: TestDb;
let eventSeq = 0;

const partnerCaller = (userId = "uP") =>
	createCaller({
		db: harness.db,
		session: { user: { id: userId, role: "partner" } },
	} as unknown as Context);

/** One app lifecycle event, as an Edge app would report it. */
async function report(
	merchantId: string,
	appId: string,
	appSlug: string,
	type: "plan.changed" | "subscription.activated" | "uninstalled",
	day: number
) {
	eventSeq += 1;
	await harness.db.insert(merchantEvents).values({
		appId,
		appSlug,
		idempotencyKey: `evt-${eventSeq}`,
		merchantId,
		occurredAt: new Date(Date.UTC(2026, 0, day)),
		shopDomain: "store.myshopify.com",
		type,
	});
}

/**
 * A commission for one (store, app) pair.
 *
 * Written directly rather than through the generation engine: this suite is
 * about how `partner.apps` READS the ledger, and the engine that writes it has
 * its own tests. The earning event is still real because the FK requires it.
 */
async function earn(partnerId: string, merchantId: string, appId: string) {
	eventSeq += 1;
	const inserted = await harness.db
		.insert(earningEvents)
		.values({
			appPartnerApiGid: `gid://${appId}`,
			currency: "USD",
			grossAmount: 10_000n,
			netAmount: 10_000n,
			occurredAt: new Date(Date.UTC(2026, 0, 15)),
			shopDomain: `store-${eventSeq}.myshopify.com`,
			shopifyFeeAmount: 0n,
			shopifyTransactionId: `txn-${eventSeq}`,
			transactionType: "app_subscription",
		})
		.returning({ id: earningEvents.id });

	await harness.db.insert(commissions).values({
		appId,
		baseAmount: 10_000n,
		commissionAmount: 2000n,
		currency: "USD",
		earningEventId: inserted[0]?.id ?? "",
		merchantId,
		partnerId,
		periodMonth: "2026-01",
		rateBps: 2000,
	});
}

/** The row for one app out of the response, by slug. */
async function appRow(slug: string, userId = "uP") {
	const result = await partnerCaller(userId).partner.apps();
	const row = result.apps.find((entry) => entry.slug === slug);
	if (!row) {
		throw new Error(`no ${slug} in the catalog`);
	}
	return row;
}

beforeEach(async () => {
	harness = await createTestDb();
	eventSeq = 0;

	await harness.db.insert(user).values([
		{ id: "uP", name: "Partner", email: "p@x.com", role: "partner" },
		{ id: "uQ", name: "Other", email: "q@x.com", role: "partner" },
	]);
	await harness.db.insert(partners).values([
		{ id: PARTNER, userId: "uP", status: "approved", defaultRateBps: 2000 },
		{ id: OTHER, userId: "uQ", status: "approved", defaultRateBps: 1000 },
	]);
	await harness.db.insert(apps).values([
		{
			id: CART,
			slug: "edge-cart",
			name: "Edge Cart",
			partnerApiGid: "gid://cart",
		},
		{
			id: REVIEWS,
			slug: "edge-reviews",
			name: "Edge Reviews",
			partnerApiGid: "gid://reviews",
		},
		{
			id: TIMER,
			slug: "edge-timer",
			name: "Edge Timer",
			partnerApiGid: "gid://timer",
		},
	]);
});

afterEach(async () => {
	await harness.close();
});

/** Gives the caller stores. Kept out of beforeEach so the zero state is real. */
async function giveStores() {
	await harness.db.insert(merchants).values([
		{
			id: STORE_A,
			partnerId: PARTNER,
			shopDomain: "a.myshopify.com",
			name: "A",
			status: "approved",
		},
		{
			id: STORE_B,
			partnerId: PARTNER,
			shopDomain: "b.myshopify.com",
			name: "B",
			status: "approved",
		},
		{
			id: STORE_C,
			partnerId: OTHER,
			shopDomain: "c.myshopify.com",
			name: "C",
			status: "approved",
		},
	]);
}

describe("the zero state", () => {
	test("a partner with no stores still gets the whole catalog, zeroed", async () => {
		const result = await partnerCaller().partner.apps();

		expect(result.storeCount).toBe(0);
		expect(result.apps).toHaveLength(3);
		/* The screen sells the suite, so an app nobody has installed must still
		   be listed rather than filtered out of existence. */
		for (const row of result.apps) {
			expect(row.liveStores).toBe(0);
			expect(row.earningStores).toBe(0);
			expect(row.grandfatheredStores).toBe(0);
		}
	});

	test("the catalog comes back in name order", async () => {
		const result = await partnerCaller().partner.apps();
		expect(result.apps.map((row) => row.name)).toEqual([
			"Edge Cart",
			"Edge Reviews",
			"Edge Timer",
		]);
	});
});

describe("what is running", () => {
	test("an activation makes an app live", async () => {
		await giveStores();
		await report(STORE_A, CART, "edge-cart", "subscription.activated", 2);

		const row = await appRow("edge-cart");
		expect(row.liveStores).toBe(1);
		expect(row.earningStores).toBe(0);
	});

	test("a plan change counts as live, not as a second install", async () => {
		await giveStores();
		await report(STORE_A, CART, "edge-cart", "subscription.activated", 2);
		await report(STORE_A, CART, "edge-cart", "plan.changed", 4);

		expect((await appRow("edge-cart")).liveStores).toBe(1);
	});

	test("the newest event wins: an uninstall is not live", async () => {
		await giveStores();
		await report(STORE_A, CART, "edge-cart", "subscription.activated", 2);
		await report(STORE_A, CART, "edge-cart", "uninstalled", 9);

		expect((await appRow("edge-cart")).liveStores).toBe(0);
	});

	test("a reinstall after an uninstall is live again", async () => {
		await giveStores();
		await report(STORE_A, CART, "edge-cart", "subscription.activated", 2);
		await report(STORE_A, CART, "edge-cart", "uninstalled", 5);
		await report(STORE_A, CART, "edge-cart", "subscription.activated", 8);

		expect((await appRow("edge-cart")).liveStores).toBe(1);
	});

	test("one store uninstalling does not hide another store's install", async () => {
		await giveStores();
		await report(STORE_A, CART, "edge-cart", "subscription.activated", 2);
		await report(STORE_B, CART, "edge-cart", "subscription.activated", 2);
		await report(STORE_A, CART, "edge-cart", "uninstalled", 9);

		expect((await appRow("edge-cart")).liveStores).toBe(1);
	});

	test("events count per app, not per partner", async () => {
		await giveStores();
		await report(STORE_A, CART, "edge-cart", "subscription.activated", 2);
		await report(STORE_A, TIMER, "edge-timer", "subscription.activated", 2);

		expect((await appRow("edge-cart")).liveStores).toBe(1);
		expect((await appRow("edge-timer")).liveStores).toBe(1);
		expect((await appRow("edge-reviews")).liveStores).toBe(0);
	});
});

describe("what is earning, and what never will", () => {
	test("earning is read off the commission ledger", async () => {
		await giveStores();
		await report(STORE_A, CART, "edge-cart", "subscription.activated", 2);
		await earn(PARTNER, STORE_A, CART);

		const row = await appRow("edge-cart");
		expect(row.liveStores).toBe(1);
		expect(row.earningStores).toBe(1);
	});

	test("two commissions on one store count that store once", async () => {
		await giveStores();
		await earn(PARTNER, STORE_A, CART);
		await earn(PARTNER, STORE_A, CART);

		expect((await appRow("edge-cart")).earningStores).toBe(1);
	});

	test("a grandfathered app is installed and earns nothing", async () => {
		await giveStores();
		await report(STORE_A, REVIEWS, "edge-reviews", "subscription.activated", 2);
		await harness.db
			.insert(merchantGrandfatheredApps)
			.values({ appId: REVIEWS, merchantId: STORE_A });

		const row = await appRow("edge-reviews");
		expect(row.liveStores).toBe(1);
		expect(row.grandfatheredStores).toBe(1);
		/* The screen says "installed on 1, 1 grandfathered" off exactly this:
		   running, and structurally unable to pay the partner. */
		expect(row.earningStores).toBe(0);
	});

	test("counts aggregate across the partner's stores", async () => {
		await giveStores();
		await report(STORE_A, CART, "edge-cart", "subscription.activated", 2);
		await report(STORE_B, CART, "edge-cart", "subscription.activated", 3);
		await earn(PARTNER, STORE_A, CART);
		await harness.db
			.insert(merchantGrandfatheredApps)
			.values({ appId: CART, merchantId: STORE_B });

		const row = await appRow("edge-cart");
		expect(row.liveStores).toBe(2);
		expect(row.earningStores).toBe(1);
		expect(row.grandfatheredStores).toBe(1);
		expect((await partnerCaller().partner.apps()).storeCount).toBe(2);
	});
});

describe("the tenant wall", () => {
	test("another partner's installs, earnings and grandfathering never leak", async () => {
		await giveStores();
		await report(STORE_C, CART, "edge-cart", "subscription.activated", 2);
		await earn(OTHER, STORE_C, CART);
		await harness.db
			.insert(merchantGrandfatheredApps)
			.values({ appId: CART, merchantId: STORE_C });

		const mine = await appRow("edge-cart");
		expect(mine.liveStores).toBe(0);
		expect(mine.earningStores).toBe(0);
		expect(mine.grandfatheredStores).toBe(0);
		expect((await partnerCaller().partner.apps()).storeCount).toBe(2);

		/* And the other partner sees their own, so the wall is a filter rather
		   than a query that silently returns nothing for everybody. */
		const theirs = await appRow("edge-cart", "uQ");
		expect(theirs.liveStores).toBe(1);
		expect(theirs.earningStores).toBe(1);
		expect((await partnerCaller("uQ").partner.apps()).storeCount).toBe(1);
	});

	test("a commission of mine on another partner's store is not counted", async () => {
		await giveStores();
		/* Defensive: the pair key is (store, app), so a row naming my partner id
		   against a store that is not mine must still be excluded by the store
		   filter rather than inflating my count. */
		await earn(PARTNER, STORE_C, CART);

		expect((await appRow("edge-cart")).earningStores).toBe(0);
	});
});
