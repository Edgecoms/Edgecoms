import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { commissions, earningEvents } from "@edgecoms/db/schema/earnings";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { partnerAppRates, partners } from "@edgecoms/db/schema/partners";
import { eq } from "drizzle-orm";
import { generateCommissions } from "../commissions";
import { computeCommissionMinor } from "../money";
import { reconcile } from "../reconcile";
import type { EarningSource, NormalizedEarning } from "../types";
import { createTestDb, type TestDb } from "./db-harness";

const PARTNER_ID = "11111111-1111-1111-1111-111111111111";
const MERCHANT_ID = "22222222-2222-2222-2222-222222222222";
const APP1_ID = "33333333-3333-3333-3333-333333333333";
const APP2_ID = "44444444-4444-4444-4444-444444444444";
const APP1_GID = "gid://partners/App/1";
const APP2_GID = "gid://partners/App/2";
const SHOP_DOMAIN = "acme.myshopify.com";
const DEFAULT_RATE_BPS = 1000; // 10%

let harness: TestDb;
let txnCounter = 0;

beforeEach(async () => {
	harness = await createTestDb();
	txnCounter = 0;
});

afterEach(async () => {
	await harness.close();
});

/** Seeds a user, an approved partner (10% default), two apps, and an approved merchant. */
async function seedBase(): Promise<void> {
	const { db } = harness;
	await db.insert(user).values({
		id: "user-1",
		name: "Partner One",
		email: "partner1@example.com",
		role: "partner",
	});
	await db.insert(partners).values({
		id: PARTNER_ID,
		userId: "user-1",
		status: "approved",
		defaultRateBps: DEFAULT_RATE_BPS,
	});
	await db.insert(apps).values([
		{
			id: APP1_ID,
			slug: "edge-one",
			name: "Edge One",
			partnerApiGid: APP1_GID,
		},
		{
			id: APP2_ID,
			slug: "edge-two",
			name: "Edge Two",
			partnerApiGid: APP2_GID,
		},
	]);
	await db.insert(merchants).values({
		id: MERCHANT_ID,
		partnerId: PARTNER_ID,
		shopDomain: SHOP_DOMAIN,
		name: "Acme",
		status: "approved",
	});
}

function earning(
	overrides: Partial<NormalizedEarning> & { appPartnerApiGid: string }
): NormalizedEarning {
	txnCounter++;
	return {
		shopifyTransactionId: overrides.shopifyTransactionId ?? `txn-${txnCounter}`,
		shopDomain: overrides.shopDomain ?? SHOP_DOMAIN,
		appPartnerApiGid: overrides.appPartnerApiGid,
		grossAmountMinor: overrides.grossAmountMinor ?? 10_000n,
		shopifyFeeAmountMinor: overrides.shopifyFeeAmountMinor ?? 2_000n,
		netAmountMinor: overrides.netAmountMinor ?? 8_000n,
		currency: overrides.currency ?? "USD",
		transactionType: overrides.transactionType ?? "app_subscription",
		occurredAt: overrides.occurredAt ?? new Date("2026-03-15T00:00:00Z"),
	};
}

/** A source that serves a single fixed page (cursor ignored — models re-fetch). */
function singlePageSource(earnings: NormalizedEarning[]): EarningSource {
	return {
		fetchPage: () =>
			Promise.resolve({ earnings, nextCursor: "c1", hasNextPage: false }),
	};
}

async function commissionForTxn(txnId: string) {
	const event = await harness.db.query.earningEvents.findFirst({
		where: eq(earningEvents.shopifyTransactionId, txnId),
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

describe("reconcile — append-only, idempotent ingestion", () => {
	test("running ingestion twice inserts zero duplicate earning rows", async () => {
		await seedBase();
		const earnings = [
			earning({ shopifyTransactionId: "txn-a", appPartnerApiGid: APP1_GID }),
			earning({ shopifyTransactionId: "txn-b", appPartnerApiGid: APP1_GID }),
		];

		const first = await reconcile(harness.db, {
			source: singlePageSource(earnings),
		});
		const second = await reconcile(harness.db, {
			source: singlePageSource(earnings),
		});

		expect(first.earningsInserted).toBe(2);
		expect(second.earningsInserted).toBe(0);

		const rows = await harness.db.select().from(earningEvents);
		expect(rows).toHaveLength(2);
	});

	test("stores money as bigint minor units and resolves merchant/app", async () => {
		await seedBase();
		await reconcile(harness.db, {
			source: singlePageSource([
				earning({ shopifyTransactionId: "txn-x", appPartnerApiGid: APP1_GID }),
			]),
		});

		const row = await harness.db.query.earningEvents.findFirst({
			where: eq(earningEvents.shopifyTransactionId, "txn-x"),
		});
		expect(row?.netAmount).toBe(8000n);
		expect(typeof row?.netAmount).toBe("bigint");
		expect(row?.merchantId).toBe(MERCHANT_ID);
		expect(row?.appId).toBe(APP1_ID);
	});
});

describe("generateCommissions — eligibility & money", () => {
	test("grandfathered app earns nothing; non-grandfathered earns", async () => {
		await seedBase();
		// App1 is grandfathered for this merchant; App2 is not.
		await harness.db.insert(merchantGrandfatheredApps).values({
			merchantId: MERCHANT_ID,
			appId: APP1_ID,
		});

		await reconcile(harness.db, {
			source: singlePageSource([
				earning({ shopifyTransactionId: "gf", appPartnerApiGid: APP1_GID }),
				earning({ shopifyTransactionId: "ok", appPartnerApiGid: APP2_GID }),
			]),
		});
		await generateCommissions(harness.db);

		expect(await commissionForTxn("gf")).toBeNull();
		expect(await commissionForTxn("ok")).not.toBeNull();
	});

	test("a negative earning produces a negative commission", async () => {
		await seedBase();
		await reconcile(harness.db, {
			source: singlePageSource([
				earning({
					shopifyTransactionId: "credit",
					appPartnerApiGid: APP2_GID,
					netAmountMinor: -8000n,
				}),
			]),
		});
		await generateCommissions(harness.db);

		const commission = await commissionForTxn("credit");
		expect(commission?.commissionAmount).toBe(
			computeCommissionMinor(-8000n, DEFAULT_RATE_BPS)
		);
		expect(commission?.commissionAmount).toBe(-800n);
	});

	test("freezes the resolved rate: per-app override beats default", async () => {
		await seedBase();
		// Override App2 to 25%; App1 uses the 10% default.
		await harness.db.insert(partnerAppRates).values({
			partnerId: PARTNER_ID,
			appId: APP2_ID,
			rateBps: 2500,
		});

		await reconcile(harness.db, {
			source: singlePageSource([
				earning({ shopifyTransactionId: "def", appPartnerApiGid: APP1_GID }),
				earning({ shopifyTransactionId: "ovr", appPartnerApiGid: APP2_GID }),
			]),
		});
		await generateCommissions(harness.db);

		const defaultCommission = await commissionForTxn("def");
		const overrideCommission = await commissionForTxn("ovr");

		expect(defaultCommission?.rateBps).toBe(DEFAULT_RATE_BPS);
		expect(defaultCommission?.commissionAmount).toBe(
			computeCommissionMinor(8000n, DEFAULT_RATE_BPS)
		);
		expect(overrideCommission?.rateBps).toBe(2500);
		expect(overrideCommission?.commissionAmount).toBe(
			computeCommissionMinor(8000n, 2500)
		);
	});

	test("a non-approved merchant generates no commission", async () => {
		await seedBase();
		// Flip the merchant to pending after seeding.
		await harness.db
			.update(merchants)
			.set({ status: "pending" })
			.where(eq(merchants.id, MERCHANT_ID));

		await reconcile(harness.db, {
			source: singlePageSource([
				earning({
					shopifyTransactionId: "pending",
					appPartnerApiGid: APP2_GID,
				}),
			]),
		});
		await generateCommissions(harness.db);

		expect(await commissionForTxn("pending")).toBeNull();
	});

	test("generation is idempotent: running twice never double-pays", async () => {
		await seedBase();
		await reconcile(harness.db, {
			source: singlePageSource([
				earning({ shopifyTransactionId: "once", appPartnerApiGid: APP2_GID }),
			]),
		});

		const first = await generateCommissions(harness.db);
		const second = await generateCommissions(harness.db);

		expect(first.commissionsCreated).toBe(1);
		expect(second.commissionsCreated).toBe(0);

		const all = await harness.db.select().from(commissions);
		expect(all).toHaveLength(1);
	});

	test("lifetime: each recurring earning yields its own commission", async () => {
		await seedBase();
		await reconcile(harness.db, {
			source: singlePageSource([
				earning({
					shopifyTransactionId: "m1",
					appPartnerApiGid: APP2_GID,
					occurredAt: new Date("2026-01-15T00:00:00Z"),
				}),
				earning({
					shopifyTransactionId: "m2",
					appPartnerApiGid: APP2_GID,
					occurredAt: new Date("2026-02-15T00:00:00Z"),
				}),
			]),
		});
		await generateCommissions(harness.db);

		const jan = await commissionForTxn("m1");
		const feb = await commissionForTxn("m2");
		expect(jan?.periodMonth).toBe("2026-01");
		expect(feb?.periodMonth).toBe("2026-02");
	});
});
