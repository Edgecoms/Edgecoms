import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { commissions, earningEvents } from "@edgecoms/db/schema/earnings";
import { merchants } from "@edgecoms/db/schema/merchants";
import { partners } from "@edgecoms/db/schema/partners";
import { partnerBonuses } from "@edgecoms/db/schema/payouts";
import { eq } from "drizzle-orm";
import { awardMilestoneBonuses } from "../award-milestones";
import { MILESTONE_BONUS_MINOR } from "../milestones";
import { createTestDb, type TestDb } from "./db-harness";

/**
 * MILESTONE AWARDS.
 *
 * These pay without anybody deciding, so the tests that matter are the ones
 * about paying ONCE. Everything else is arithmetic; a double award is money out
 * of the door that nobody authorised and nobody can see happening.
 */

const PARTNER = "11111111-1111-1111-1111-111111111111";
const PENDING_PARTNER = "11111111-1111-1111-1111-111111111112";
const STORE_A = "22222222-2222-2222-2222-22222222222a";
const STORE_B = "22222222-2222-2222-2222-22222222222b";
const APP1 = "33333333-3333-3333-3333-333333333331";
const APP2 = "33333333-3333-3333-3333-333333333332";
const APP3 = "33333333-3333-3333-3333-333333333333";

const NOW = new Date("2026-03-15T00:00:00Z");

let harness: TestDb;
let seq = 0;

const award = () => awardMilestoneBonuses(harness.db, { now: () => NOW });

const bonusFor = async (key: string) =>
	await harness.db.query.partnerBonuses.findFirst({
		where: eq(partnerBonuses.milestoneKey, key),
	});

async function addStore(id: string, partnerId = PARTNER) {
	seq += 1;
	await harness.db.insert(merchants).values({
		id,
		name: `Store ${seq}`,
		partnerId,
		shopDomain: `s-${seq}.myshopify.com`,
		status: "approved",
	});
}

async function earn(options: {
	amount?: bigint;
	appId?: string;
	currency?: string;
	merchantId?: string;
	partnerId?: string;
}) {
	seq += 1;
	const currency = options.currency ?? "USD";
	const inserted = await harness.db
		.insert(earningEvents)
		.values({
			appPartnerApiGid: `gid://${seq}`,
			currency,
			grossAmount: 10_000n,
			netAmount: 10_000n,
			occurredAt: NOW,
			shopDomain: `e-${seq}.myshopify.com`,
			shopifyFeeAmount: 0n,
			shopifyTransactionId: `txn-${seq}`,
			transactionType: "app_subscription",
		})
		.returning({ id: earningEvents.id });

	await harness.db.insert(commissions).values({
		appId: options.appId ?? APP1,
		baseAmount: 10_000n,
		commissionAmount: options.amount ?? 500n,
		currency,
		earningEventId: inserted[0]?.id ?? "",
		merchantId: options.merchantId ?? STORE_A,
		partnerId: options.partnerId ?? PARTNER,
		periodMonth: "2026-03",
		rateBps: 2000,
	});
}

beforeEach(async () => {
	harness = await createTestDb();
	seq = 0;
	await harness.db.insert(user).values([
		{ id: "uP", name: "Partner", email: "p@x.com", role: "partner" },
		{ id: "uR", name: "Waiting", email: "r@x.com", role: "partner" },
	]);
	await harness.db.insert(partners).values([
		{ id: PARTNER, userId: "uP", status: "approved", defaultRateBps: 2000 },
		{
			defaultRateBps: 0,
			id: PENDING_PARTNER,
			status: "pending",
			userId: "uR",
		},
	]);
	await harness.db.insert(apps).values([
		{ id: APP1, slug: "a1", name: "App One", partnerApiGid: "gid://a1" },
		{ id: APP2, slug: "a2", name: "App Two", partnerApiGid: "gid://a2" },
		{ id: APP3, slug: "a3", name: "App Three", partnerApiGid: "gid://a3" },
	]);
});

afterEach(async () => {
	await harness.close();
});

describe("paying once", () => {
	test("a second run over the same data awards nothing", async () => {
		await addStore(STORE_A);

		const first = await award();
		const second = await award();

		expect(first.awarded.map((row) => row.key)).toEqual(["first_store"]);
		/* The unique index refuses it, so a six-hourly cron is free to re-run. */
		expect(second.awarded).toEqual([]);
		expect(await harness.db.select().from(partnerBonuses)).toHaveLength(1);
	});

	test("a rung already awarded by hand is not awarded again", async () => {
		await addStore(STORE_A);
		await harness.db.insert(partnerBonuses).values({
			amount: 500n,
			currency: "USD",
			issuedBy: null,
			milestoneKey: "first_store",
			partnerId: PARTNER,
			periodMonth: "2026-01",
			reason: "Backfilled",
		});

		expect((await award()).awarded).toEqual([]);
		expect(await harness.db.select().from(partnerBonuses)).toHaveLength(1);
	});

	test("a discretionary bonus never blocks a milestone award", async () => {
		await addStore(STORE_A);
		await harness.db.insert(partnerBonuses).values({
			amount: 9999n,
			currency: "USD",
			issuedBy: "uP",
			milestoneKey: null,
			partnerId: PARTNER,
			periodMonth: "2026-03",
			reason: "Goodwill, unrelated",
		});

		/* The unique index is partial: discretionary rows are unconstrained. */
		expect((await award()).awarded.map((row) => row.key)).toEqual([
			"first_store",
		]);
		expect(await harness.db.select().from(partnerBonuses)).toHaveLength(2);
	});
});

describe("the amounts, and when they are owed", () => {
	test("a first store pays five dollars, with no issuer", async () => {
		await addStore(STORE_A);
		await award();

		const bonus = await bonusFor("first_store");
		expect(bonus?.amount).toBe(MILESTONE_BONUS_MINOR.first_store);
		expect(bonus?.amount).toBe(500n);
		expect(bonus?.currency).toBe("USD");
		expect(bonus?.status).toBe("pending");
		expect(bonus?.reason).toBe("First store on your code");
		/* Nobody chose this, and a null issuer is how that is recorded. */
		expect(bonus?.issuedBy).toBeNull();
		/* It rides the payout for the month the sweep ran. */
		expect(bonus?.periodMonth).toBe("2026-03");
	});

	test("a first commission pays ten", async () => {
		await addStore(STORE_A);
		await earn({});
		await award();

		expect((await bonusFor("first_commission"))?.amount).toBe(1000n);
	});

	test("the hundred-earned rung pays a hundred, and only once it is earned", async () => {
		await addStore(STORE_A);
		await earn({ amount: 9999n });
		await award();
		expect(await bonusFor("money")).toBeUndefined();

		await earn({ amount: 1n });
		await award();
		expect((await bonusFor("money"))?.amount).toBe(10_000n);
	});

	test("three apps on ONE store pays ten; the same three spread out does not", async () => {
		await addStore(STORE_A);
		await addStore(STORE_B);
		await earn({ appId: APP1, merchantId: STORE_A });
		await earn({ appId: APP2, merchantId: STORE_A });
		await earn({ appId: APP3, merchantId: STORE_B });

		await award();
		/* Two on A, one on B: depth is 2, so the rung is not owed. */
		expect(await bonusFor("three_apps")).toBeUndefined();

		await earn({ appId: APP3, merchantId: STORE_A });
		await award();
		expect((await bonusFor("three_apps"))?.amount).toBe(1000n);
	});

	test("five stores pays fifty, at five and not at four", async () => {
		for (let index = 0; index < 4; index += 1) {
			await addStore(`22222222-2222-2222-2222-00000000000${index}`);
		}
		await award();
		expect(await bonusFor("five_stores")).toBeUndefined();

		await addStore("22222222-2222-2222-2222-000000000004");
		await award();
		expect((await bonusFor("five_stores"))?.amount).toBe(5000n);
	});

	test("the whole suite pays seventy, counting every app in the catalogue", async () => {
		await addStore(STORE_A);
		await earn({ appId: APP1 });
		await earn({ appId: APP2 });
		await award();
		expect(await bonusFor("whole_suite")).toBeUndefined();

		await earn({ appId: APP3 });
		await award();
		expect((await bonusFor("whole_suite"))?.amount).toBe(7000n);
	});

	test("the full ladder is worth two hundred and forty five dollars", () => {
		const total = Object.values(MILESTONE_BONUS_MINOR).reduce(
			(sum, amount) => sum + amount,
			0n
		);
		expect(total).toBe(24_500n);
	});
});

describe("who accrues", () => {
	test("a partner who is not approved accrues nothing", async () => {
		await addStore(STORE_A, PENDING_PARTNER);

		const summary = await award();

		expect(summary.partnersChecked).toBe(1);
		expect(summary.awarded).toEqual([]);
		expect(await harness.db.select().from(partnerBonuses)).toHaveLength(0);
	});

	test("one partner's progress never awards another", async () => {
		await addStore(STORE_A);
		await award();

		const rows = await harness.db.select().from(partnerBonuses);
		expect(rows).toHaveLength(1);
		expect(rows[0]?.partnerId).toBe(PARTNER);
	});

	test("bonuses are paid in dollars even when the partner earns elsewhere", async () => {
		await addStore(STORE_A);
		await earn({ amount: 20_000n, currency: "EUR" });
		await award();

		/* The money rung is MEASURED in the partner's largest currency and PAID
		   in the programme's. A euro-earning partner still gets a dollar bonus,
		   which rides the dollar payout. */
		const money = await bonusFor("money");
		expect(money?.currency).toBe("USD");
		expect(money?.amount).toBe(10_000n);
	});
});
