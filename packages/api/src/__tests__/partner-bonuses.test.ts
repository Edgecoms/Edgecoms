import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { commissions, earningEvents } from "@edgecoms/db/schema/earnings";
import { merchants } from "@edgecoms/db/schema/merchants";
import { partners } from "@edgecoms/db/schema/partners";
import { partnerBonuses, payouts } from "@edgecoms/db/schema/payouts";
import { eq } from "drizzle-orm";
import type { Context } from "../context";
import { createCallerFactory } from "../index";
import { appRouter } from "../routers/index";
import { createTestDb, type TestDb } from "./db-harness";

/**
 * DISCRETIONARY BONUSES, and the payout they ride.
 *
 * A bonus is money leaving the business with no earning event behind it, so
 * the tests worth having are about the seams: that it cannot be issued to
 * somebody with no agreed rate, that it reaches the partner's payout exactly
 * once, that it never crosses a currency, and that a partner can only ever see
 * their own.
 */

const createCaller = createCallerFactory(appRouter);

const PARTNER = "aaaaaaaa-0000-0000-0000-000000000001";
const OTHER = "aaaaaaaa-0000-0000-0000-000000000002";
const PENDING_PARTNER = "aaaaaaaa-0000-0000-0000-000000000003";
const STORE = "bbbbbbbb-0000-0000-0000-00000000000a";
const APP = "cccccccc-0000-0000-0000-000000000001";
const PERIOD = "2026-03";

const NOT_APPROVED = /approve the partner/i;
const ALREADY_SETTLED = /already paid or revoked/i;
const NOTHING_PAYABLE = /nothing payable/i;
const ADMIN_ONLY = /admin/i;

let harness: TestDb;
let seq = 0;

const admin = () =>
	createCaller({
		db: harness.db,
		session: { user: { id: "admin1", role: "admin" } },
	} as unknown as Context);

const partnerCaller = (userId = "uP") =>
	createCaller({
		db: harness.db,
		session: { user: { id: userId, role: "partner" } },
	} as unknown as Context);

/** A real commission, so payouts can be tested with both kinds of money. */
async function earn(amount: bigint, currency = "USD") {
	seq += 1;
	const inserted = await harness.db
		.insert(earningEvents)
		.values({
			appPartnerApiGid: "gid://cart",
			currency,
			grossAmount: amount * 5n,
			netAmount: amount * 5n,
			occurredAt: new Date(Date.UTC(2026, 2, 10)),
			shopDomain: `s-${seq}.myshopify.com`,
			shopifyFeeAmount: 0n,
			shopifyTransactionId: `txn-${seq}`,
			transactionType: "app_subscription",
		})
		.returning({ id: earningEvents.id });

	await harness.db.insert(commissions).values({
		appId: APP,
		baseAmount: amount * 5n,
		commissionAmount: amount,
		currency,
		earningEventId: inserted[0]?.id ?? "",
		merchantId: STORE,
		partnerId: PARTNER,
		periodMonth: PERIOD,
		rateBps: 2000,
	});
}

beforeEach(async () => {
	harness = await createTestDb();
	seq = 0;
	await harness.db.insert(user).values([
		{ id: "admin1", name: "Admin", email: "a@x.com", role: "admin" },
		{ id: "uP", name: "Partner", email: "p@x.com", role: "partner" },
		{ id: "uQ", name: "Other", email: "q@x.com", role: "partner" },
		{ id: "uR", name: "Waiting", email: "r@x.com", role: "partner" },
	]);
	await harness.db.insert(partners).values([
		{ id: PARTNER, userId: "uP", status: "approved", defaultRateBps: 2000 },
		{ id: OTHER, userId: "uQ", status: "approved", defaultRateBps: 1000 },
		{
			defaultRateBps: 0,
			id: PENDING_PARTNER,
			status: "pending",
			userId: "uR",
		},
	]);
	await harness.db.insert(apps).values({
		id: APP,
		slug: "edge-cart",
		name: "Edge Cart",
		partnerApiGid: "gid://cart",
	});
	await harness.db.insert(merchants).values({
		id: STORE,
		partnerId: PARTNER,
		shopDomain: "store.myshopify.com",
		name: "Store",
		status: "approved",
	});
});

afterEach(async () => {
	await harness.close();
});

describe("issuing", () => {
	test("a decimal amount becomes integer minor units", async () => {
		await admin().admin.partners.issueBonus({
			amount: "250.50",
			currency: "usd",
			partnerId: PARTNER,
			periodMonth: PERIOD,
			reason: "Brought three stores in a month",
		});

		const row = await harness.db.query.partnerBonuses.findFirst();
		expect(row?.amount).toBe(25_050n);
		/* Upper-cased at the boundary, like every other currency in the system. */
		expect(row?.currency).toBe("USD");
		expect(row?.status).toBe("pending");
		expect(row?.issuedBy).toBe("admin1");
		expect(row?.reason).toBe("Brought three stores in a month");
	});

	test("a partner who is not approved cannot be paid a bonus", async () => {
		await expect(
			admin().admin.partners.issueBonus({
				amount: "100.00",
				currency: "USD",
				partnerId: PENDING_PARTNER,
				periodMonth: PERIOD,
				reason: "Too early",
			})
		).rejects.toThrow(NOT_APPROVED);

		expect(await harness.db.select().from(partnerBonuses)).toHaveLength(0);
	});

	test("zero is not a bonus", async () => {
		await expect(
			admin().admin.partners.issueBonus({
				amount: "0.00",
				currency: "USD",
				partnerId: PARTNER,
				periodMonth: PERIOD,
				reason: "Nothing",
			})
		).rejects.toThrow();
	});

	test("a partner cannot issue themselves a bonus", async () => {
		await expect(
			partnerCaller().admin.partners.issueBonus({
				amount: "5000.00",
				currency: "USD",
				partnerId: PARTNER,
				periodMonth: PERIOD,
				reason: "Self-serve",
			})
		).rejects.toThrow(ADMIN_ONLY);
	});

	test("revoking works while pending and never after paying", async () => {
		await admin().admin.partners.issueBonus({
			amount: "100.00",
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
			reason: "Issued in error",
		});
		const row = await harness.db.query.partnerBonuses.findFirst();
		const bonusId = row?.id ?? "";

		await admin().admin.partners.revokeBonus({ bonusId });
		expect(
			(
				await harness.db.query.partnerBonuses.findFirst({
					where: eq(partnerBonuses.id, bonusId),
				})
			)?.status
		).toBe("revoked");

		/* Twice is refused rather than silently repeated. */
		await expect(
			admin().admin.partners.revokeBonus({ bonusId })
		).rejects.toThrow(ALREADY_SETTLED);
	});
});

describe("the payout carries it", () => {
	test("the total is commissions plus bonuses, and both are marked paid", async () => {
		await earn(1560n);
		await admin().admin.partners.issueBonus({
			amount: "100.00",
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
			reason: "Five stores",
		});

		const result = await admin().admin.payouts.pay({
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
		});

		expect(result.commissionsMinor).toBe("1560");
		expect(result.bonusesMinor).toBe("10000");
		expect(result.totalMinor).toBe("11560");
		expect(result.items).toBe(1);
		expect(result.bonusCount).toBe(1);

		const payout = await harness.db.query.payouts.findFirst();
		expect(payout?.totalAmount).toBe(11_560n);

		const bonus = await harness.db.query.partnerBonuses.findFirst();
		expect(bonus?.status).toBe("paid");
		expect(bonus?.payoutId).toBe(result.payoutId);
		expect(bonus?.paidAt).not.toBeNull();
	});

	test("a bonus with no commissions still pays", async () => {
		await admin().admin.partners.issueBonus({
			amount: "75.00",
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
			reason: "Goodwill",
		});

		const result = await admin().admin.payouts.pay({
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
		});

		expect(result.items).toBe(0);
		expect(result.totalMinor).toBe("7500");
		expect((await harness.db.query.payouts.findFirst())?.totalAmount).toBe(
			7500n
		);
	});

	test("an empty group is still refused", async () => {
		await expect(
			admin().admin.payouts.pay({
				currency: "USD",
				partnerId: PARTNER,
				periodMonth: PERIOD,
			})
		).rejects.toThrow(NOTHING_PAYABLE);

		expect(await harness.db.select().from(payouts)).toHaveLength(0);
	});

	test("paying twice does not pay a bonus twice", async () => {
		await admin().admin.partners.issueBonus({
			amount: "100.00",
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
			reason: "Once",
		});
		await admin().admin.payouts.pay({
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
		});

		/* The bonus is no longer pending, so the group is empty again. */
		await expect(
			admin().admin.payouts.pay({
				currency: "USD",
				partnerId: PARTNER,
				periodMonth: PERIOD,
			})
		).rejects.toThrow(NOTHING_PAYABLE);
		expect(await harness.db.select().from(payouts)).toHaveLength(1);
	});

	test("a revoked bonus is not payable", async () => {
		await admin().admin.partners.issueBonus({
			amount: "100.00",
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
			reason: "Withdrawn",
		});
		const row = await harness.db.query.partnerBonuses.findFirst();
		await admin().admin.partners.revokeBonus({ bonusId: row?.id ?? "" });

		await expect(
			admin().admin.payouts.pay({
				currency: "USD",
				partnerId: PARTNER,
				periodMonth: PERIOD,
			})
		).rejects.toThrow(NOTHING_PAYABLE);
	});

	test("a bonus never crosses a currency", async () => {
		await earn(1000n, "USD");
		await admin().admin.partners.issueBonus({
			amount: "90.00",
			currency: "EUR",
			partnerId: PARTNER,
			periodMonth: PERIOD,
			reason: "Paid in euros",
		});

		const usd = await admin().admin.payouts.pay({
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
		});

		/* The EUR bonus waits for the EUR payout rather than being converted. */
		expect(usd.totalMinor).toBe("1000");
		expect(usd.bonusCount).toBe(0);
		expect((await harness.db.query.partnerBonuses.findFirst())?.status).toBe(
			"pending"
		);

		const eur = await admin().admin.payouts.pay({
			currency: "EUR",
			partnerId: PARTNER,
			periodMonth: PERIOD,
		});
		expect(eur.totalMinor).toBe("9000");
	});

	test("a bonus for another period waits for that period", async () => {
		await admin().admin.partners.issueBonus({
			amount: "50.00",
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: "2026-04",
			reason: "Next month",
		});

		await expect(
			admin().admin.payouts.pay({
				currency: "USD",
				partnerId: PARTNER,
				periodMonth: PERIOD,
			})
		).rejects.toThrow(NOTHING_PAYABLE);
	});

	test("a bonus-only group is visible to the payout screen", async () => {
		await admin().admin.partners.issueBonus({
			amount: "60.00",
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
			reason: "Goodwill",
		});

		const groups = await admin().admin.payouts.groupable();
		const group = groups.find((row) => row.partnerId === PARTNER);

		/* Without this the group could never be paid: nothing else would list it. */
		expect(group?.totalMinor).toBe("6000");
		expect(group?.bonusesMinor).toBe("6000");
		expect(group?.commissionsMinor).toBe("0");
		expect(group?.items).toBe(0);
		expect(group?.bonusCount).toBe(1);
	});

	test("a mixed group reports both halves", async () => {
		await earn(1560n);
		await admin().admin.partners.issueBonus({
			amount: "40.00",
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
			reason: "Both",
		});

		const groups = await admin().admin.payouts.groupable();
		const group = groups.find((row) => row.partnerId === PARTNER);
		expect(group?.commissionsMinor).toBe("1560");
		expect(group?.bonusesMinor).toBe("4000");
		expect(group?.totalMinor).toBe("5560");
	});
});

describe("what the partner sees", () => {
	test("their own bonuses, with the reason and what is awaiting payout", async () => {
		await admin().admin.partners.issueBonus({
			amount: "100.00",
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
			reason: "Five stores in a month",
		});

		const result = await partnerCaller().partner.bonuses();

		expect(result.bonuses).toHaveLength(1);
		expect(result.bonuses[0]?.amountMinor).toBe("10000");
		expect(result.bonuses[0]?.reason).toBe("Five stores in a month");
		expect(result.bonuses[0]?.status).toBe("pending");
		expect(result.awaitingPayout).toEqual([
			{ currency: "USD", totalMinor: "10000" },
		]);
	});

	test("a revoked bonus is never shown", async () => {
		await admin().admin.partners.issueBonus({
			amount: "100.00",
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
			reason: "Withdrawn before anyone saw it",
		});
		const row = await harness.db.query.partnerBonuses.findFirst();
		await admin().admin.partners.revokeBonus({ bonusId: row?.id ?? "" });

		const result = await partnerCaller().partner.bonuses();
		/* Learning of a bonus by watching it vanish is worse than never knowing. */
		expect(result.bonuses).toHaveLength(0);
		expect(result.awaitingPayout).toEqual([]);
	});

	test("awaiting payout is grouped by currency, never summed across", async () => {
		for (const [amount, currency] of [
			["100.00", "USD"],
			["90.00", "EUR"],
		] as const) {
			await admin().admin.partners.issueBonus({
				amount,
				currency,
				partnerId: PARTNER,
				periodMonth: PERIOD,
				reason: `Paid in ${currency}`,
			});
		}

		const result = await partnerCaller().partner.bonuses();
		expect(
			result.awaitingPayout.sort((a, b) => a.currency.localeCompare(b.currency))
		).toEqual([
			{ currency: "EUR", totalMinor: "9000" },
			{ currency: "USD", totalMinor: "10000" },
		]);
	});

	test("a partner never sees another partner's bonus", async () => {
		await admin().admin.partners.issueBonus({
			amount: "500.00",
			currency: "USD",
			partnerId: OTHER,
			periodMonth: PERIOD,
			reason: "Not yours",
		});

		expect((await partnerCaller().partner.bonuses()).bonuses).toHaveLength(0);
		expect((await partnerCaller("uQ").partner.bonuses()).bonuses).toHaveLength(
			1
		);
	});

	test("a paid bonus stays visible, as history", async () => {
		await admin().admin.partners.issueBonus({
			amount: "100.00",
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
			reason: "Paid already",
		});
		await admin().admin.payouts.pay({
			currency: "USD",
			partnerId: PARTNER,
			periodMonth: PERIOD,
		});

		const result = await partnerCaller().partner.bonuses();
		expect(result.bonuses[0]?.status).toBe("paid");
		/* Paid is no longer awaiting. */
		expect(result.awaitingPayout).toEqual([]);
	});
});
