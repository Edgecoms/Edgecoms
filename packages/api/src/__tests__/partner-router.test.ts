import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { toPeriodMonth } from "@edgecoms/billing/commissions";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { commissions, earningEvents } from "@edgecoms/db/schema/earnings";
import { merchants } from "@edgecoms/db/schema/merchants";
import { partners } from "@edgecoms/db/schema/partners";
import { eq } from "drizzle-orm";
import type { Context } from "../context";
import { createCallerFactory } from "../index";
import { appRouter } from "../routers/index";
import { createTestDb, type TestDb } from "./db-harness";

const createCaller = createCallerFactory(appRouter);

const APP_ID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const PARTNER_A = "a0000000-0000-0000-0000-000000000001";
const PARTNER_B = "b0000000-0000-0000-0000-000000000002";
const MERCHANT_A = "a0000000-0000-0000-0000-0000000000a1";
const MERCHANT_B = "b0000000-0000-0000-0000-0000000000b1";
const CURRENT = toPeriodMonth(new Date());
const ALREADY_REGISTERED = /already registered/i;

let harness: TestDb;

beforeEach(async () => {
	harness = await createTestDb();
	await seed();
});

afterEach(async () => {
	await harness.close();
});

function callerFor(userId: string) {
	const ctx = {
		db: harness.db,
		session: { user: { id: userId, role: "partner" }, session: { userId } },
	} as unknown as Context;
	return createCaller(ctx);
}

let txnSeq = 0;
async function seedCommission(
	partnerId: string,
	merchantId: string,
	period: string,
	baseMinor: bigint,
	commissionMinor: bigint,
	status: "pending" | "paid"
) {
	txnSeq++;
	const eventRows = await harness.db
		.insert(earningEvents)
		.values({
			shopifyTransactionId: `txn-${txnSeq}`,
			shopDomain: `seed-${txnSeq}.myshopify.com`,
			grossAmount: baseMinor,
			shopifyFeeAmount: 0n,
			netAmount: baseMinor,
			currency: "USD",
			transactionType: "app_subscription",
			occurredAt: new Date(`${period}-15T00:00:00Z`),
		})
		.returning({ id: earningEvents.id });
	const eventId = eventRows[0]?.id;
	if (!eventId) {
		throw new Error("failed to seed earning event");
	}
	await harness.db.insert(commissions).values({
		earningEventId: eventId,
		partnerId,
		merchantId,
		appId: APP_ID,
		rateBps: 1000,
		baseAmount: baseMinor,
		commissionAmount: commissionMinor,
		currency: "USD",
		periodMonth: period,
		status,
	});
}

async function seed() {
	const { db } = harness;
	await db.insert(user).values([
		{ id: "uA", name: "A", email: "a@x.com", role: "partner" },
		{ id: "uB", name: "B", email: "b@x.com", role: "partner" },
	]);
	await db.insert(partners).values([
		{ id: PARTNER_A, userId: "uA", status: "approved", defaultRateBps: 1000 },
		{ id: PARTNER_B, userId: "uB", status: "approved", defaultRateBps: 1500 },
	]);
	await db.insert(apps).values({
		id: APP_ID,
		slug: "edge-x",
		name: "Edge X",
		partnerApiGid: "gid://partners/App/1",
	});
	await db.insert(merchants).values([
		{
			id: MERCHANT_A,
			partnerId: PARTNER_A,
			shopDomain: "alpha.myshopify.com",
			name: "Alpha",
			status: "approved",
		},
		{
			id: MERCHANT_B,
			partnerId: PARTNER_B,
			shopDomain: "beta.myshopify.com",
			name: "Beta",
			status: "approved",
		},
	]);

	// Partner A: 1000 this month + 500 in a past month = 1500 lifetime.
	await seedCommission(
		PARTNER_A,
		MERCHANT_A,
		CURRENT,
		10_000n,
		1000n,
		"pending"
	);
	await seedCommission(PARTNER_A, MERCHANT_A, "2026-01", 5000n, 500n, "paid");
	// Partner B has its own commission — must never appear for A.
	await seedCommission(PARTNER_B, MERCHANT_B, CURRENT, 9999n, 1499n, "pending");
}

describe("partner.merchants — tenant isolation", () => {
	test("a partner sees only their own merchants", async () => {
		const a = await callerFor("uA").partner.merchants.list();
		expect(a).toHaveLength(1);
		expect(a[0]?.name).toBe("Alpha");

		const b = await callerFor("uB").partner.merchants.list();
		expect(b).toHaveLength(1);
		expect(b[0]?.name).toBe("Beta");
	});

	test("registering a merchant creates a pending record owned by the caller", async () => {
		const result = await callerFor("uA").partner.merchants.register({
			name: "Gamma",
			storeUrl: "https://Gamma.myshopify.com/admin",
		});
		expect(result.shopDomain).toBe("gamma.myshopify.com");

		const row = await harness.db.query.merchants.findFirst({
			where: eq(merchants.id, result.id),
		});
		expect(row?.status).toBe("pending");
		expect(row?.partnerId).toBe(PARTNER_A);
	});

	test("a globally-claimed store cannot be registered by another partner", async () => {
		// Partner B already owns beta.myshopify.com; partner A cannot claim it.
		await expect(
			callerFor("uA").partner.merchants.register({
				name: "Steal",
				storeUrl: "beta.myshopify.com",
			})
		).rejects.toThrow(ALREADY_REGISTERED);
	});
});

describe("partner.dashboard — metrics reconcile with the ledger", () => {
	test("reflects only the caller's commissions and earnings", async () => {
		const dashboard = await callerFor("uA").partner.dashboard();

		expect(dashboard.activeMerchants).toBe(1);
		expect(dashboard.pendingRegistrations).toBe(0);
		// Lifetime = 1000 + 500 (NOT partner B's 1499).
		expect(dashboard.lifetimeEarningsMinor).toBe("1500");
		// This month = the single current-period commission.
		expect(dashboard.thisMonthCommissionMinor).toBe("1000");
		expect(dashboard.monthlyRevenueMinor).toBe("10000");
		expect(dashboard.recentActivity).toHaveLength(2);
	});

	test("partner B's dashboard is independent", async () => {
		const dashboard = await callerFor("uB").partner.dashboard();
		expect(dashboard.lifetimeEarningsMinor).toBe("1499");
	});
});

describe("partner.earnings — totals reconcile", () => {
	test("lifetime and monthly breakdown match the seeded commissions", async () => {
		const earnings = await callerFor("uA").partner.earnings();
		expect(earnings.lifetimeMinor).toBe("1500");
		const current = earnings.months.find((m) => m.period === CURRENT);
		expect(current?.totalMinor).toBe("1000");
		expect(current?.pendingMinor).toBe("1000");
	});
});
