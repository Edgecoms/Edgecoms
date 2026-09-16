import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { commissions, earningEvents } from "@edgecoms/db/schema/earnings";
import { merchants } from "@edgecoms/db/schema/merchants";
import { partnerCodes, partners } from "@edgecoms/db/schema/partners";
import { partnerBonuses, payouts } from "@edgecoms/db/schema/payouts";
import type { Context } from "../context";
import { createCallerFactory } from "../index";
import { appRouter } from "../routers/index";
import { createTestDb, type TestDb } from "./db-harness";

/**
 * The admin partner page, found broken in production: it matched rows on the
 * partner's display NAME, so a second partner called "Anurag Chandra" showed
 * the first one's stores. These fixtures reproduce that exactly: two partners,
 * same name, no company, and every row belonging to only one of them.
 */

const createCaller = createCallerFactory(appRouter);

const EMPTY = "aaaaaaaa-0000-0000-0000-000000000001";
const BUSY = "aaaaaaaa-0000-0000-0000-000000000002";
const EMPTY_CODE = "cccccccc-0000-0000-0000-000000000001";
const BUSY_CODE = "cccccccc-0000-0000-0000-000000000002";
const APP = "dddddddd-0000-0000-0000-000000000001";
const STORE_ONE = "bbbbbbbb-0000-0000-0000-000000000001";
const STORE_TWO = "bbbbbbbb-0000-0000-0000-000000000002";
const SHARED_NAME = "Anurag Chandra";
/** More than the 200 the commissions index is capped at. */
const MANY_COMMISSIONS = 205;

let harness: TestDb;

const caller = (role: "admin" | "partner") =>
	createCaller({
		db: harness.db,
		session: { session: {}, user: { id: `u-${role}`, role } },
	} as unknown as Context);

async function seed() {
	const { db } = harness;
	await db.insert(user).values([
		{ email: "admin@x.com", id: "u-admin", name: "Admin", role: "admin" },
		{ email: "one@x.com", id: "u-one", name: SHARED_NAME, role: "partner" },
		{ email: "two@x.com", id: "u-two", name: SHARED_NAME, role: "partner" },
	]);
	await db.insert(partners).values([
		{ defaultRateBps: 3000, id: EMPTY, status: "approved", userId: "u-one" },
		{ defaultRateBps: 2000, id: BUSY, status: "approved", userId: "u-two" },
	]);
	await db.insert(partnerCodes).values([
		{ code: "ANURAGCHANDRA", id: EMPTY_CODE, partnerId: EMPTY },
		{ code: "ANURAPARTNER", id: BUSY_CODE, partnerId: BUSY },
	]);
	await db.insert(apps).values({
		id: APP,
		name: "Edge Cart",
		partnerApiGid: "gid://cart",
		slug: "edge-cart",
	});
	await db.insert(merchants).values(
		[
			[STORE_ONE, "Iliora", "fbdajq-90.myshopify.com"],
			[STORE_TWO, "HAPPSTA", "67an00-ra.myshopify.com"],
		].map(([id, name, shopDomain]) => ({
			id: id as string,
			name: name as string,
			partnerCodeId: BUSY_CODE,
			partnerId: BUSY,
			shopDomain: shopDomain as string,
			source: "code" as const,
			sourceCode: "ANURAPARTNER",
			status: "approved" as const,
		}))
	);

	const events = await db
		.insert(earningEvents)
		.values(
			Array.from({ length: MANY_COMMISSIONS }, (_, index) => ({
				appPartnerApiGid: "gid://cart",
				currency: "USD",
				grossAmount: 1000n,
				netAmount: 1000n,
				occurredAt: new Date("2026-08-10T00:00:00Z"),
				shopDomain: "fbdajq-90.myshopify.com",
				shopifyFeeAmount: 0n,
				shopifyTransactionId: `txn-${index}`,
				transactionType: "app_subscription",
			}))
		)
		.returning({ id: earningEvents.id });
	await db.insert(commissions).values(
		events.map((event) => ({
			appId: APP,
			baseAmount: 1000n,
			commissionAmount: 200n,
			currency: "USD",
			earningEventId: event.id,
			merchantId: STORE_ONE,
			partnerId: BUSY,
			periodMonth: "2026-08",
			rateBps: 2000,
		}))
	);
	await db.insert(partnerBonuses).values({
		amount: 500n,
		currency: "USD",
		partnerId: BUSY,
		periodMonth: "2026-08",
		reason: "Store bounty",
	});
	await db.insert(payouts).values({
		currency: "USD",
		netAmount: 4000n,
		partnerId: BUSY,
		periodMonth: "2026-07",
		totalAmount: 4000n,
	});
}

beforeEach(async () => {
	harness = await createTestDb();
	await seed();
});

afterEach(async () => {
	await harness.close();
});

describe("admin.partners.detail", () => {
	test("a partner sharing a name sees none of the other's rows", async () => {
		const detail = await caller("admin").admin.partners.detail({
			partnerId: EMPTY,
		});

		expect(detail.codes.map((row) => row.code)).toEqual(["ANURAGCHANDRA"]);
		expect(detail.codes[0]?.redemptions).toBe(0);
		expect(detail.stores).toEqual([]);
		expect(detail.commissions).toEqual([]);
		expect(detail.bonuses).toEqual([]);
		expect(detail.payouts).toEqual([]);
	});

	test("the partner who owns the rows sees all of them", async () => {
		const detail = await caller("admin").admin.partners.detail({
			partnerId: BUSY,
		});

		expect(detail.codes.map((row) => row.code)).toEqual(["ANURAPARTNER"]);
		expect(detail.codes[0]?.redemptions).toBe(2);
		expect(detail.stores.map((row) => row.name).sort()).toEqual([
			"HAPPSTA",
			"Iliora",
		]);
		expect(
			detail.stores.every((row) => row.sourceCode === "ANURAPARTNER")
		).toBe(true);
		expect(detail.bonuses).toHaveLength(1);
		expect(detail.bonuses[0]?.amountMinor).toBe("500");
		expect(detail.payouts).toHaveLength(1);
		expect(detail.payouts[0]?.amountMinor).toBe("4000");
		expect(detail.payouts[0]?.netMinor).toBe("4000");
	});

	test("commission is not cut at the index's 200 rows", async () => {
		const detail = await caller("admin").admin.partners.detail({
			partnerId: BUSY,
		});
		expect(detail.commissions).toHaveLength(MANY_COMMISSIONS);
		expect(detail.commissions[0]).toMatchObject({
			amountMinor: "200",
			appName: "Edge Cart",
			merchantName: "Iliora",
			period: "2026-08",
			rateBps: 2000,
		});
	});

	test("the response survives JSON, so no bigint reaches the wire", async () => {
		const detail = await caller("admin").admin.partners.detail({
			partnerId: BUSY,
		});
		expect(() => JSON.stringify(detail)).not.toThrow();
	});

	test("only an admin may read it", async () => {
		await expect(
			caller("partner").admin.partners.detail({ partnerId: BUSY })
		).rejects.toMatchObject({ code: "FORBIDDEN" });
	});

	test("a malformed id is refused before it reaches the database", async () => {
		await expect(
			caller("admin").admin.partners.detail({ partnerId: "not-an-id" })
		).rejects.toMatchObject({ code: "BAD_REQUEST" });
	});
});
