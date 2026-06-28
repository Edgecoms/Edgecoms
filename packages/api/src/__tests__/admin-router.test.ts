import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { generateCommissions } from "@edgecoms/billing/commissions";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { commissions, earningEvents } from "@edgecoms/db/schema/earnings";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { partnerAppRates, partners } from "@edgecoms/db/schema/partners";
import { eq } from "drizzle-orm";
import type { Context } from "../context";
import { createCallerFactory } from "../index";
import { appRouter } from "../routers/index";
import { createTestDb, type TestDb } from "./db-harness";

const createCaller = createCallerFactory(appRouter);

const PARTNER = "aaaaaaaa-0000-0000-0000-000000000001";
const MERCHANT = "bbbbbbbb-0000-0000-0000-000000000001";
const APP_X = "cccccccc-0000-0000-0000-000000000001"; // grandfathered
const APP_Y = "dddddddd-0000-0000-0000-000000000001"; // not grandfathered
const SHOP = "store.myshopify.com";

let harness: TestDb;

const adminCaller = () => {
	const ctx = {
		db: harness.db,
		session: { user: { id: "admin1", role: "admin" }, session: {} },
	} as unknown as Context;
	return createCaller(ctx);
};

beforeEach(async () => {
	harness = await createTestDb();
	await seed();
});

afterEach(async () => {
	await harness.close();
});

async function seedEarning(
	txn: string,
	gid: string,
	net: bigint,
	occurredAt: string
) {
	await harness.db.insert(earningEvents).values({
		shopifyTransactionId: txn,
		shopDomain: SHOP,
		appPartnerApiGid: gid,
		grossAmount: net,
		shopifyFeeAmount: 0n,
		netAmount: net,
		currency: "USD",
		transactionType: "app_subscription",
		occurredAt: new Date(occurredAt),
	});
}

async function seed() {
	const { db } = harness;
	await db.insert(user).values([
		{ id: "admin1", name: "Admin", email: "admin@x.com", role: "admin" },
		{ id: "uP", name: "Partner", email: "p@x.com", role: "partner" },
	]);
	await db.insert(partners).values({
		id: PARTNER,
		userId: "uP",
		status: "pending",
		defaultRateBps: 0,
	});
	await db.insert(apps).values([
		{ id: APP_X, slug: "edge-x", name: "Edge X", partnerApiGid: "gid://x" },
		{ id: APP_Y, slug: "edge-y", name: "Edge Y", partnerApiGid: "gid://y" },
	]);
	await db.insert(merchants).values({
		id: MERCHANT,
		partnerId: PARTNER,
		shopDomain: SHOP,
		name: "Store",
		status: "pending",
	});
	// Grandfathered app X earning + two app Y earnings (different months).
	await seedEarning("ex", "gid://x", 5000n, "2026-06-10T00:00:00Z");
	await seedEarning("ey1", "gid://y", 10_000n, "2026-05-10T00:00:00Z");
	await seedEarning("ey2", "gid://y", 10_000n, "2026-06-10T00:00:00Z");
}

async function commissionFor(txn: string) {
	const event = await harness.db.query.earningEvents.findFirst({
		where: eq(earningEvents.shopifyTransactionId, txn),
	});
	if (!event) {
		return null;
	}
	return (
		(await harness.db.query.commissions.findFirst({
			where: eq(commissions.earningEventId, event.id),
		})) ?? null
	);
}

describe("admin.partners.approve", () => {
	test("sets status, default rate, and per-app overrides", async () => {
		await adminCaller().admin.partners.approve({
			partnerId: PARTNER,
			defaultRateBps: 1000,
			appRates: [{ appId: APP_Y, rateBps: 2000 }],
		});

		const partner = await harness.db.query.partners.findFirst({
			where: eq(partners.id, PARTNER),
		});
		expect(partner?.status).toBe("approved");
		expect(partner?.defaultRateBps).toBe(1000);

		const override = await harness.db.query.partnerAppRates.findFirst({
			where: eq(partnerAppRates.partnerId, PARTNER),
		});
		expect(override?.appId).toBe(APP_Y);
		expect(override?.rateBps).toBe(2000);
	});
});

describe("admin.merchants.approve + grandfathering + generation", () => {
	test("grandfathered app earns nothing; non-grandfathered earns at the frozen rate", async () => {
		await adminCaller().admin.partners.approve({
			partnerId: PARTNER,
			defaultRateBps: 1000,
			appRates: [{ appId: APP_Y, rateBps: 2000 }],
		});
		await adminCaller().admin.merchants.approve({
			merchantId: MERCHANT,
			grandfatheredAppIds: [APP_X],
		});

		// Capture is recorded.
		const grandfathered = await harness.db
			.select()
			.from(merchantGrandfatheredApps)
			.where(eq(merchantGrandfatheredApps.merchantId, MERCHANT));
		expect(grandfathered).toHaveLength(1);
		expect(grandfathered[0]?.appId).toBe(APP_X);

		await generateCommissions(harness.db);

		expect(await commissionFor("ex")).toBeNull();
		const cy = await commissionFor("ey1");
		expect(cy?.rateBps).toBe(2000);
		expect(cy?.commissionAmount).toBe(2000n);
	});
});

describe("admin.commissions.markPaid — immutable amounts", () => {
	test("marking paid flips status but never rewrites the money", async () => {
		await adminCaller().admin.partners.approve({
			partnerId: PARTNER,
			defaultRateBps: 1000,
		});
		await adminCaller().admin.merchants.approve({
			merchantId: MERCHANT,
			grandfatheredAppIds: [],
		});
		await generateCommissions(harness.db);

		const before = await commissionFor("ey1");
		await adminCaller().admin.commissions.markPaid({
			commissionId: before?.id ?? "",
		});
		const after = await commissionFor("ey1");

		expect(after?.status).toBe("paid");
		expect(after?.paidAt).not.toBeNull();
		// Money figures unchanged.
		expect(after?.commissionAmount).toBe(before?.commissionAmount ?? -1n);
		expect(after?.rateBps).toBe(before?.rateBps ?? -1);
		expect(after?.baseAmount).toBe(before?.baseAmount ?? -1n);
	});
});

describe("admin.payouts.pay — grouping", () => {
	test("groups a partner/period's pending commissions into one paid payout", async () => {
		await adminCaller().admin.partners.approve({
			partnerId: PARTNER,
			defaultRateBps: 1000,
		});
		await adminCaller().admin.merchants.approve({
			merchantId: MERCHANT,
			grandfatheredAppIds: [],
		});
		await generateCommissions(harness.db);

		// Period 2026-06 groups two commissions (ex = 500, ey2 = 1000) → 1500.
		const result = await adminCaller().admin.payouts.pay({
			partnerId: PARTNER,
			periodMonth: "2026-06",
			currency: "USD",
		});
		expect(result.items).toBe(2);
		expect(result.totalMinor).toBe("1500");

		const cy2 = await commissionFor("ey2");
		expect(cy2?.status).toBe("paid");
		expect(cy2?.payoutId).toBe(result.payoutId);

		// The 2026-05 commission is in a different period — still pending.
		const cy1 = await commissionFor("ey1");
		expect(cy1?.status).toBe("pending");

		// Re-paying the same group now has nothing to pay.
		await expect(
			adminCaller().admin.payouts.pay({
				partnerId: PARTNER,
				periodMonth: "2026-06",
				currency: "USD",
			})
		).rejects.toThrow();
	});
});
