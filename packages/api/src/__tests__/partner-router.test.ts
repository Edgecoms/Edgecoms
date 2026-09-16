import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { toPeriodMonth } from "@edgecoms/billing/commissions";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { commissions, earningEvents } from "@edgecoms/db/schema/earnings";
import { merchants } from "@edgecoms/db/schema/merchants";
import { partners } from "@edgecoms/db/schema/partners";
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
	status: "pending" | "paid",
	currency = "USD"
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
			currency,
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
		currency,
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
});

describe("partner.dashboard — metrics reconcile with the ledger", () => {
	test("reflects only the caller's commissions and earnings", async () => {
		const dashboard = await callerFor("uA").partner.dashboard();

		expect(dashboard.activeMerchants).toBe(1);
		expect(dashboard.pendingRegistrations).toBe(0);
		// Lifetime = 1000 + 500 (NOT partner B's 1499). One currency here, so
		// one entry -- the list is what makes two currencies expressible.
		expect(dashboard.lifetimeCommission).toEqual([
			{ amountMinor: "1500", currency: "USD" },
		]);
		// This month = the single current-period commission.
		expect(dashboard.thisMonthCommission).toEqual([
			{ amountMinor: "1000", currency: "USD" },
		]);
		expect(dashboard.thisMonthRevenue).toEqual([
			{ amountMinor: "10000", currency: "USD" },
		]);
		expect(dashboard.recentActivity).toHaveLength(2);
	});

	test("partner B's dashboard is independent", async () => {
		const dashboard = await callerFor("uB").partner.dashboard();
		expect(dashboard.lifetimeCommission).toEqual([
			{ amountMinor: "1499", currency: "USD" },
		]);
	});
});

describe("partner.earnings — totals reconcile", () => {
	test("lifetime and monthly breakdown match the seeded commissions", async () => {
		const earnings = await callerFor("uA").partner.earnings();
		expect(earnings.lifetime).toEqual([
			{ amountMinor: "1500", currency: "USD" },
		]);
		const current = earnings.months.find((m) => m.period === CURRENT);
		expect(current?.totalMinor).toBe("1000");
		expect(current?.pendingMinor).toBe("1000");
	});
});

describe("two currencies are never added together", () => {
	/**
	 * THE BUG THIS GUARDS.
	 *
	 * These totals used to be summed across currencies and labelled USD, so a
	 * partner earning in euros saw a number that was not money in any currency,
	 * next to a payout that would pay a different figure. There is no exchange
	 * rate anywhere in this system, so the only honest answer is both.
	 */
	test("the dashboard reports each currency, largest first", async () => {
		await seedCommission(
			PARTNER_A,
			MERCHANT_A,
			CURRENT,
			90_000n,
			9000n,
			"pending",
			"EUR"
		);

		const dashboard = await callerFor("uA").partner.dashboard();

		/* 1500 USD already seeded, plus 9000 EUR: two entries, not 10500 of
		   nothing. */
		expect(dashboard.lifetimeCommission).toEqual([
			{ amountMinor: "9000", currency: "EUR" },
			{ amountMinor: "1500", currency: "USD" },
		]);
		expect(dashboard.thisMonthCommission).toEqual([
			{ amountMinor: "9000", currency: "EUR" },
			{ amountMinor: "1000", currency: "USD" },
		]);
	});

	test("earnings reports each currency, and a month is one row per currency", async () => {
		await seedCommission(
			PARTNER_A,
			MERCHANT_A,
			CURRENT,
			90_000n,
			9000n,
			"pending",
			"EUR"
		);

		const earnings = await callerFor("uA").partner.earnings();

		expect(earnings.lifetime).toEqual([
			{ amountMinor: "9000", currency: "EUR" },
			{ amountMinor: "1500", currency: "USD" },
		]);
		/* The current month earned in both, so it is two lines: which is what
		   the partner's payouts will be, one per currency. */
		const current = earnings.months.filter((m) => m.period === CURRENT);
		expect(current).toHaveLength(2);
		expect(current.map((m) => [m.currency, m.totalMinor]).sort()).toEqual([
			["EUR", "9000"],
			["USD", "1000"],
		]);
	});

	test("a zero total still has a currency to be labelled in", async () => {
		/* Partner B has commissions; a partner with none has no currency of
		   their own, and a total has to be labelled something. */
		const dashboard = await callerFor("uB").partner.dashboard();
		expect(dashboard.zeroCurrency).toBe("USD");
	});

	test("the merchants list reports per currency too", async () => {
		await seedCommission(
			PARTNER_A,
			MERCHANT_A,
			CURRENT,
			90_000n,
			9000n,
			"pending",
			"EUR"
		);

		const rows = await callerFor("uA").partner.merchants.list();
		const merchant = rows.find((row) => row.id === MERCHANT_A);
		expect(merchant?.commission).toEqual([
			{ amountMinor: "9000", currency: "EUR" },
			{ amountMinor: "1500", currency: "USD" },
		]);
	});
});
