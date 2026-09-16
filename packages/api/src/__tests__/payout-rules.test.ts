import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { commissions, earningEvents } from "@edgecoms/db/schema/earnings";
import { merchants } from "@edgecoms/db/schema/merchants";
import { partners } from "@edgecoms/db/schema/partners";
import { payouts } from "@edgecoms/db/schema/payouts";
import { eq } from "drizzle-orm";
import type { Context } from "../context";
import { createCallerFactory } from "../index";
import { payoutBlocker } from "../payout-details";
import { appRouter } from "../routers/index";
import { createTestDb, type TestDb } from "./db-harness";

/**
 * THE RULES AROUND A PAYOUT: can we send it, is it worth sending, and does the
 * record say what actually left the building.
 *
 * All three exist because the first real payout run would otherwise have
 * discovered them the hard way — no account on file, a transfer fee eating a
 * fifteen dollar payment, and a ledger claiming a partner was paid in full
 * while their bank showed less.
 */

const createCaller = createCallerFactory(appRouter);

const PAYABLE = "aaaaaaaa-0000-0000-0000-000000000001";
const NO_DETAILS = "aaaaaaaa-0000-0000-0000-000000000002";
const STORE_A = "bbbbbbbb-0000-0000-0000-00000000000a";
const STORE_B = "bbbbbbbb-0000-0000-0000-00000000000b";
const APP = "cccccccc-0000-0000-0000-000000000001";
const PERIOD = "2026-03";

const NO_DETAILS_ON_FILE = /no payout details on file/i;
const BELOW_MINIMUM = /below the 50 minimum/i;
const OVER_WITHHELD = /withholding cannot exceed/i;
const MALFORMED_IFSC = /IFSC is malformed/i;

let harness: TestDb;
let seq = 0;

const admin = () =>
	createCaller({
		db: harness.db,
		session: { user: { id: "admin1", role: "admin" } },
	} as unknown as Context);

/** A commission of `amount` minor units, in `PERIOD` unless told otherwise. */
async function earn(partnerId: string, merchantId: string, amount: bigint) {
	await earnIn(partnerId, merchantId, amount, PERIOD);
}

/** As `earn`, in a named period, for the accumulate-and-sweep tests. */
async function earnIn(
	partnerId: string,
	merchantId: string,
	amount: bigint,
	period: string
) {
	seq += 1;
	const inserted = await harness.db
		.insert(earningEvents)
		.values({
			appPartnerApiGid: "gid://cart",
			currency: "USD",
			grossAmount: amount * 5n,
			netAmount: amount * 5n,
			occurredAt: new Date(Date.UTC(2026, 2, 10)),
			shopDomain: `e-${seq}.myshopify.com`,
			shopifyFeeAmount: 0n,
			shopifyTransactionId: `txn-${seq}`,
			transactionType: "app_subscription",
		})
		.returning({ id: earningEvents.id });

	await harness.db.insert(commissions).values({
		appId: APP,
		baseAmount: amount * 5n,
		commissionAmount: amount,
		currency: "USD",
		earningEventId: inserted[0]?.id ?? "",
		merchantId,
		partnerId,
		periodMonth: period,
		rateBps: 2000,
	});
}

beforeEach(async () => {
	harness = await createTestDb();
	seq = 0;
	await harness.db.insert(user).values([
		{ id: "admin1", name: "Admin", email: "a@x.com", role: "admin" },
		{ id: "uP", name: "Payable", email: "p@x.com", role: "partner" },
		{ id: "uQ", name: "No details", email: "q@x.com", role: "partner" },
	]);
	await harness.db.insert(partners).values([
		{
			defaultRateBps: 2000,
			id: PAYABLE,
			payoutAccountName: "Acme Agency",
			payoutAccountNumber: "123456789012",
			payoutCountry: "IN",
			payoutDestination: "bank_in",
			payoutIfsc: "HDFC0001234",
			status: "approved",
			userId: "uP",
		},
		{ id: NO_DETAILS, userId: "uQ", status: "approved", defaultRateBps: 2000 },
	]);
	await harness.db.insert(apps).values({
		id: APP,
		slug: "edge-cart",
		name: "Edge Cart",
		partnerApiGid: "gid://cart",
	});
	await harness.db.insert(merchants).values([
		{
			id: STORE_A,
			partnerId: PAYABLE,
			shopDomain: "a.myshopify.com",
			name: "A",
			status: "approved",
		},
		{
			id: STORE_B,
			partnerId: NO_DETAILS,
			shopDomain: "b.myshopify.com",
			name: "B",
			status: "approved",
		},
	]);
});

afterEach(async () => {
	await harness.close();
});

describe("the destination check", () => {
	test("a partner with no details on file cannot be paid", async () => {
		await earn(NO_DETAILS, STORE_B, 20_000n);

		await expect(
			admin().admin.payouts.pay({
				currency: "USD",
				partnerId: NO_DETAILS,
				periodMonth: PERIOD,
			})
		).rejects.toThrow(NO_DETAILS_ON_FILE);

		/* Nothing written, and the commission stays payable for next time. */
		expect(await harness.db.select().from(payouts)).toHaveLength(0);
		const rows = await harness.db
			.select()
			.from(commissions)
			.where(eq(commissions.partnerId, NO_DETAILS));
		expect(rows[0]?.status).toBe("pending");
	});

	test("the stored row is re-checked, not the form", async () => {
		/* A malformed IFSC that got in before the validator existed. */
		await harness.db
			.update(partners)
			.set({ payoutIfsc: "NOPE" })
			.where(eq(partners.id, PAYABLE));
		await earn(PAYABLE, STORE_A, 20_000n);

		await expect(
			admin().admin.payouts.pay({
				currency: "USD",
				partnerId: PAYABLE,
				periodMonth: PERIOD,
			})
		).rejects.toThrow(MALFORMED_IFSC);
	});

	test("the blocker reads the same for the partner and the payout run", () => {
		/* One definition of payable, so a partner's settings screen cannot say
		   ready while a run would refuse them. */
		expect(
			payoutBlocker({
				payoutAccountName: "Acme",
				payoutAccountNumber: "123456789012",
				payoutCountry: "IN",
				payoutDestination: "bank_in",
				payoutIfsc: "HDFC0001234",
			})
		).toBeNull();
		expect(
			payoutBlocker({
				payoutAccountName: "Acme",
				payoutAccountNumber: "12",
				payoutCountry: "IN",
				payoutDestination: "bank_in",
				payoutIfsc: "HDFC0001234",
			})
		).toBe("account number is not 9 to 18 digits");
	});
});

describe("the minimum", () => {
	test("a small payout is held, and the money stays payable", async () => {
		await earn(PAYABLE, STORE_A, 1560n);

		await expect(
			admin().admin.payouts.pay({
				currency: "USD",
				partnerId: PAYABLE,
				periodMonth: PERIOD,
			})
		).rejects.toThrow(BELOW_MINIMUM);

		/* Held, not lost: it joins next month's group by staying pending. */
		const rows = await harness.db
			.select()
			.from(commissions)
			.where(eq(commissions.partnerId, PAYABLE));
		expect(rows[0]?.status).toBe("pending");
	});

	test("force pays it anyway, for a final balance", async () => {
		await earn(PAYABLE, STORE_A, 1560n);

		const result = await admin().admin.payouts.pay({
			currency: "USD",
			force: true,
			partnerId: PAYABLE,
			periodMonth: PERIOD,
		});
		expect(result.totalMinor).toBe("1560");
	});

	test("at the minimum exactly, it pays without forcing", async () => {
		await earn(PAYABLE, STORE_A, 5000n);

		const result = await admin().admin.payouts.pay({
			currency: "USD",
			partnerId: PAYABLE,
			periodMonth: PERIOD,
		});
		expect(result.totalMinor).toBe("5000");
	});

	test("small months accumulate until they clear the floor, then pay as one", async () => {
		/**
		 * THE BUG THIS REPLACES. The earlier version of this test seeded two
		 * commissions in the SAME period and called them "two small months", so
		 * it proved nothing about rolling forward. The period was part of the
		 * grouping key, which meant a partner earning $15 a month had a March
		 * group worth $15 for ever: it never reached the floor, April formed its
		 * own group that also never did, and the money was permanently unpayable
		 * while the error message promised it would roll over.
		 */
		await earnIn(PAYABLE, STORE_A, 2000n, "2026-01");
		await expect(
			admin().admin.payouts.pay({
				currency: "USD",
				partnerId: PAYABLE,
				periodMonth: "2026-01",
			})
		).rejects.toThrow(BELOW_MINIMUM);

		await earnIn(PAYABLE, STORE_A, 2000n, "2026-02");
		await expect(
			admin().admin.payouts.pay({
				currency: "USD",
				partnerId: PAYABLE,
				periodMonth: "2026-02",
			})
		).rejects.toThrow(BELOW_MINIMUM);

		/* Third month crosses $50 across all three, so one payout covers them. */
		await earnIn(PAYABLE, STORE_A, 2000n, "2026-03");
		const result = await admin().admin.payouts.pay({
			currency: "USD",
			partnerId: PAYABLE,
			periodMonth: "2026-03",
		});

		expect(result.totalMinor).toBe("6000");
		expect(result.items).toBe(3);
		expect(result.periodsCovered).toEqual(["2026-01", "2026-02", "2026-03"]);
	});

	test("a later run sweeps an earlier unpaid period", async () => {
		await earnIn(PAYABLE, STORE_A, 2000n, "2026-01");
		await earnIn(PAYABLE, STORE_A, 20_000n, "2026-02");

		const result = await admin().admin.payouts.pay({
			currency: "USD",
			partnerId: PAYABLE,
			periodMonth: "2026-02",
		});

		/* January was under the floor on its own and is picked up here, which is
		   what makes the held-money promise true. */
		expect(result.totalMinor).toBe("22000");
		expect(result.periodsCovered).toEqual(["2026-01", "2026-02"]);
	});

	test("a later period is not swept by an earlier run", async () => {
		await earnIn(PAYABLE, STORE_A, 20_000n, "2026-01");
		await earnIn(PAYABLE, STORE_A, 20_000n, "2026-02");

		const result = await admin().admin.payouts.pay({
			currency: "USD",
			partnerId: PAYABLE,
			periodMonth: "2026-01",
		});

		/* Through, not across: February is still to come. */
		expect(result.periodsCovered).toEqual(["2026-01"]);
		expect(result.totalMinor).toBe("20000");
	});

	test("the payout total equals exactly the rows it stamped", async () => {
		await earnIn(PAYABLE, STORE_A, 20_000n, "2026-01");
		await earnIn(PAYABLE, STORE_A, 30_000n, "2026-01");

		const result = await admin().admin.payouts.pay({
			currency: "USD",
			partnerId: PAYABLE,
			periodMonth: "2026-01",
		});

		/* The rows are locked and totalled, then stamped BY ID. Summing with an
		   aggregate and re-running the predicate in the UPDATE left a window
		   where money generated in between was marked paid but excluded from
		   the total the payout recorded. */
		const paid = await harness.db
			.select()
			.from(commissions)
			.where(eq(commissions.payoutId, result.payoutId));
		const stamped = paid.reduce((sum, row) => sum + row.commissionAmount, 0n);
		expect(stamped.toString()).toBe(result.totalMinor);
		expect(paid).toHaveLength(result.items);
	});
});

describe("withholding and the record", () => {
	test("gross, withheld and net are all recorded", async () => {
		await earn(PAYABLE, STORE_A, 20_000n);

		const result = await admin().admin.payouts.pay({
			currency: "USD",
			method: "bank_transfer",
			partnerId: PAYABLE,
			periodMonth: PERIOD,
			reference: "UTR123456",
			withheld: "4.00",
			withholdingNote: "TDS 194H @2%",
		});

		expect(result.totalMinor).toBe("20000");
		expect(result.withheldMinor).toBe("400");
		expect(result.netMinor).toBe("19600");

		const payout = await harness.db.query.payouts.findFirst();
		expect(payout?.totalAmount).toBe(20_000n);
		expect(payout?.withheldAmount).toBe(400n);
		/* What actually left the building. */
		expect(payout?.netAmount).toBe(19_600n);
		expect(payout?.method).toBe("bank_transfer");
		expect(payout?.reference).toBe("UTR123456");
		expect(payout?.withholdingNote).toBe("TDS 194H @2%");
	});

	test("withholding nothing leaves net equal to gross", async () => {
		await earn(PAYABLE, STORE_A, 20_000n);

		const result = await admin().admin.payouts.pay({
			currency: "USD",
			partnerId: PAYABLE,
			periodMonth: PERIOD,
		});

		expect(result.withheldMinor).toBe("0");
		expect(result.netMinor).toBe(result.totalMinor);
		const payout = await harness.db.query.payouts.findFirst();
		/* The default, so an existing caller that knows nothing about
		   withholding still records a coherent row. */
		expect(payout?.withheldAmount).toBe(0n);
		expect(payout?.method).toBe("bank_transfer");
	});

	test("withholding more than was earned is refused", async () => {
		await earn(PAYABLE, STORE_A, 20_000n);

		await expect(
			admin().admin.payouts.pay({
				currency: "USD",
				partnerId: PAYABLE,
				periodMonth: PERIOD,
				withheld: "500.00",
			})
		).rejects.toThrow(OVER_WITHHELD);

		expect(await harness.db.select().from(payouts)).toHaveLength(0);
	});

	test("a link payment is recorded as one", async () => {
		await earn(PAYABLE, STORE_A, 20_000n);

		await admin().admin.payouts.pay({
			currency: "USD",
			method: "payment_link",
			partnerId: PAYABLE,
			periodMonth: PERIOD,
			reference: "plink_abc123",
		});

		const payout = await harness.db.query.payouts.findFirst();
		/* Six months on, this row says how the money moved rather than leaving
		   somebody to guess from the amount. */
		expect(payout?.method).toBe("payment_link");
		expect(payout?.reference).toBe("plink_abc123");
	});
});
