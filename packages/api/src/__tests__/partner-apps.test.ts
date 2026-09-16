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
	await earnIn(partnerId, merchantId, appId, "USD", 2000n);
}

/** As `earn`, in a named currency and amount, for the multi-currency rung. */
async function earnIn(
	partnerId: string,
	merchantId: string,
	appId: string,
	currency: string,
	commissionAmount: bigint,
	period = "2026-01"
) {
	eventSeq += 1;
	const inserted = await harness.db
		.insert(earningEvents)
		.values({
			appPartnerApiGid: `gid://${appId}`,
			currency,
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
		commissionAmount,
		currency,
		earningEventId: inserted[0]?.id ?? "",
		merchantId,
		partnerId,
		periodMonth: period,
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

describe("coverage, per store", () => {
	test("a store with nothing installed is all gap", async () => {
		await giveStores();
		const result = await partnerCaller().partner.apps();

		expect(result.catalogSize).toBe(3);
		const store = result.stores.find((row) => row.id === STORE_A);
		expect(store?.liveApps).toBe(0);
		expect(store?.earningApps).toBe(0);
		/* `missing` is the whole point of the ring: the cheapest next move. */
		expect(store?.missing.map((app) => app.slug)).toEqual([
			"edge-cart",
			"edge-reviews",
			"edge-timer",
		]);
	});

	test("installing removes an app from the gap without earning yet", async () => {
		await giveStores();
		await report(STORE_A, CART, "edge-cart", "subscription.activated", 2);

		const result = await partnerCaller().partner.apps();
		const store = result.stores.find((row) => row.id === STORE_A);
		expect(store?.liveApps).toBe(1);
		expect(store?.earningApps).toBe(0);
		expect(store?.missing.map((app) => app.slug)).toEqual([
			"edge-reviews",
			"edge-timer",
		]);
	});

	test("a grandfathered app counts as installed, not as coverage that earns", async () => {
		await giveStores();
		await report(STORE_A, REVIEWS, "edge-reviews", "subscription.activated", 2);
		await harness.db
			.insert(merchantGrandfatheredApps)
			.values({ appId: REVIEWS, merchantId: STORE_A });

		const store = (await partnerCaller().partner.apps()).stores.find(
			(row) => row.id === STORE_A
		);
		expect(store?.liveApps).toBe(1);
		expect(store?.grandfatheredApps).toBe(1);
		expect(store?.earningApps).toBe(0);
		/* Installed, so not offered again as the next move. */
		expect(store?.missing.map((app) => app.slug)).not.toContain("edge-reviews");
	});

	test("an uninstalled app returns to the gap", async () => {
		await giveStores();
		await report(STORE_A, CART, "edge-cart", "subscription.activated", 2);
		await report(STORE_A, CART, "edge-cart", "uninstalled", 9);

		const store = (await partnerCaller().partner.apps()).stores.find(
			(row) => row.id === STORE_A
		);
		expect(store?.liveApps).toBe(0);
		expect(store?.missing.map((app) => app.slug)).toContain("edge-cart");
	});

	test("coverage is per store, not shared between them", async () => {
		await giveStores();
		await report(STORE_A, CART, "edge-cart", "subscription.activated", 2);
		await earn(PARTNER, STORE_A, CART);

		const result = await partnerCaller().partner.apps();
		expect(result.stores.find((row) => row.id === STORE_A)?.earningApps).toBe(
			1
		);
		expect(result.stores.find((row) => row.id === STORE_B)?.earningApps).toBe(
			0
		);
		/* And another partner's store is not in the list at all. */
		expect(result.stores.some((row) => row.id === STORE_C)).toBe(false);
	});
});

describe("milestones", () => {
	test("a partner with nothing has reached nothing, and is told the targets", async () => {
		const result = await partnerCaller().partner.milestones();

		expect(result.milestones.every((rung) => !rung.reached)).toBe(true);
		const suite = result.milestones.find((rung) => rung.key === "whole_suite");
		expect(suite && "target" in suite ? suite.target : null).toBe(3);
		const money = result.milestones.find((rung) => rung.key === "money");
		expect(money && "currentMinor" in money ? money.currentMinor : null).toBe(
			"0"
		);
	});

	test("the first rung falls to one commission, and the bounty reports the store", async () => {
		await giveStores();
		await earn(PARTNER, STORE_A, CART);

		const result = await partnerCaller().partner.milestones();
		const byKey = new Map(result.milestones.map((rung) => [rung.key, rung]));
		expect(byKey.get("first_commission")?.reached).toBe(true);
		expect(byKey.get("five_stores")?.reached).toBe(false);
		/* Bringing a store is paid per store now, not as a one-off rung. */
		expect(result.merchantBounty.earningStores).toBe(1);
		expect(result.merchantBounty.amountMinor).toBe("500");
	});

	test("the money rung is an integer comparison, not a formatted one", async () => {
		await giveStores();
		/* Each `earn` is 2000 minor units, so five of them is exactly the
		   10,000-minor target -- the boundary, which is where an off-by-one
		   would hide. */
		for (let index = 0; index < 4; index += 1) {
			await earn(PARTNER, STORE_A, CART);
		}
		const before = await partnerCaller().partner.milestones();
		const beforeRung = before.milestones.find((rung) => rung.key === "money");
		expect(
			beforeRung && "currentMinor" in beforeRung
				? beforeRung.currentMinor
				: null
		).toBe("8000");
		expect(beforeRung?.reached).toBe(false);

		await earn(PARTNER, STORE_A, CART);
		const after = await partnerCaller().partner.milestones();
		const afterRung = after.milestones.find((rung) => rung.key === "money");
		expect(
			afterRung && "currentMinor" in afterRung ? afterRung.currentMinor : null
		).toBe("10000");
		expect(afterRung?.reached).toBe(true);
	});

	test("currencies are measured separately, never added together", async () => {
		await giveStores();
		await earn(PARTNER, STORE_A, CART);
		await earnIn(PARTNER, STORE_B, TIMER, "EUR", 9000n);

		const result = await partnerCaller().partner.milestones();
		const money = result.milestones.find((rung) => rung.key === "money");

		/* The largest single currency wins the rung. 2000 USD + 9000 EUR must
		   not become 11000 of anything, which would cross the target on a sum
		   that means nothing. */
		expect(result.currency).toBe("EUR");
		expect(money && "currentMinor" in money ? money.currentMinor : null).toBe(
			"9000"
		);
		expect(money?.reached).toBe(false);
	});

	test("depth counts apps on one store; breadth counts apps anywhere", async () => {
		await giveStores();
		await earn(PARTNER, STORE_A, CART);
		await earn(PARTNER, STORE_A, REVIEWS);
		await earn(PARTNER, STORE_B, TIMER);

		const byKey = new Map(
			(await partnerCaller().partner.milestones()).milestones.map((rung) => [
				rung.key,
				rung,
			])
		);

		const depth = byKey.get("three_apps");
		expect(depth && "current" in depth ? depth.current : null).toBe(2);
		expect(depth?.reached).toBe(false);

		/* Three distinct apps earning, spread over two stores. */
		const breadth = byKey.get("whole_suite");
		expect(breadth && "current" in breadth ? breadth.current : null).toBe(3);
		expect(breadth?.reached).toBe(true);
	});

	test("another partner's earnings never advance my ladder", async () => {
		await giveStores();
		await earn(OTHER, STORE_C, CART);
		await earn(OTHER, STORE_C, REVIEWS);

		const byKey = new Map(
			(await partnerCaller().partner.milestones()).milestones.map((rung) => [
				rung.key,
				rung,
			])
		);
		expect(byKey.get("first_commission")?.reached).toBe(false);
		const depth = byKey.get("three_apps");
		expect(depth && "current" in depth ? depth.current : null).toBe(0);
	});
});

describe("compounding, per store", () => {
	test("a store that has never been billed shows no run", async () => {
		await giveStores();
		const store = (await partnerCaller().partner.apps()).stores.find(
			(row) => row.id === STORE_A
		);

		expect(store?.monthsEarning).toBe(0);
		expect(store?.lifetimeMinor).toBe("0");
		expect(store?.firstPeriod).toBeNull();
		expect(store?.latestPeriod).toBeNull();
	});

	test("one charge is month one", async () => {
		await giveStores();
		await earn(PARTNER, STORE_A, CART);

		const store = (await partnerCaller().partner.apps()).stores.find(
			(row) => row.id === STORE_A
		);
		expect(store?.monthsEarning).toBe(1);
		expect(store?.lifetimeMinor).toBe("2000");
		expect(store?.firstPeriod).toBe("2026-01");
		expect(store?.latestPeriod).toBe("2026-01");
	});

	test("two apps billed in the same month is still month one", async () => {
		await giveStores();
		await earn(PARTNER, STORE_A, CART);
		await earn(PARTNER, STORE_A, TIMER);

		const store = (await partnerCaller().partner.apps()).stores.find(
			(row) => row.id === STORE_A
		);
		/* The run counts MONTHS the store has paid, not commissions. Two apps
		   billed in January is one month of a recurring relationship. */
		expect(store?.monthsEarning).toBe(1);
		expect(store?.lifetimeMinor).toBe("4000");
	});

	test("a run across months counts the months and totals the money", async () => {
		await giveStores();
		await earnIn(PARTNER, STORE_A, CART, "USD", 2000n, "2026-01");
		await earnIn(PARTNER, STORE_A, CART, "USD", 2200n, "2026-02");
		await earnIn(PARTNER, STORE_A, CART, "USD", 2400n, "2026-03");

		const store = (await partnerCaller().partner.apps()).stores.find(
			(row) => row.id === STORE_A
		);
		expect(store?.monthsEarning).toBe(3);
		expect(store?.lifetimeMinor).toBe("6600");
		expect(store?.firstPeriod).toBe("2026-01");
		expect(store?.latestPeriod).toBe("2026-03");
	});

	test("a gap in the middle is counted honestly, not smoothed over", async () => {
		await giveStores();
		await earnIn(PARTNER, STORE_A, CART, "USD", 2000n, "2026-01");
		await earnIn(PARTNER, STORE_A, CART, "USD", 2000n, "2026-03");

		const store = (await partnerCaller().partner.apps()).stores.find(
			(row) => row.id === STORE_A
		);
		/* Two months paid, three months spanned. The store paused, and saying
		   "month 3" would claim a run that did not happen. */
		expect(store?.monthsEarning).toBe(2);
		expect(store?.firstPeriod).toBe("2026-01");
		expect(store?.latestPeriod).toBe("2026-03");
	});

	test("a store's run is its own, not the partner's", async () => {
		await giveStores();
		await earnIn(PARTNER, STORE_A, CART, "USD", 2000n, "2026-01");
		await earnIn(PARTNER, STORE_B, TIMER, "USD", 5000n, "2026-02");

		const result = await partnerCaller().partner.apps();
		const a = result.stores.find((row) => row.id === STORE_A);
		const b = result.stores.find((row) => row.id === STORE_B);
		expect(a?.lifetimeMinor).toBe("2000");
		expect(b?.lifetimeMinor).toBe("5000");
		expect(a?.monthsEarning).toBe(1);
		expect(b?.monthsEarning).toBe(1);
	});

	test("a store's currencies are not added together", async () => {
		await giveStores();
		await earnIn(PARTNER, STORE_A, CART, "USD", 2000n, "2026-01");
		await earnIn(PARTNER, STORE_A, TIMER, "EUR", 7000n, "2026-01");

		const store = (await partnerCaller().partner.apps()).stores.find(
			(row) => row.id === STORE_A
		);
		/* The larger single currency is reported with its own code, rather than
		   9000 of something that does not exist. */
		expect(store?.currency).toBe("EUR");
		expect(store?.lifetimeMinor).toBe("7000");
	});

	test("another partner's run never lands on my store", async () => {
		await giveStores();
		await earnIn(OTHER, STORE_C, CART, "USD", 9000n, "2026-01");

		const result = await partnerCaller().partner.apps();
		expect(result.stores.some((row) => row.id === STORE_C)).toBe(false);
		for (const store of result.stores) {
			expect(store.lifetimeMinor).toBe("0");
			expect(store.monthsEarning).toBe(0);
		}
	});
});
