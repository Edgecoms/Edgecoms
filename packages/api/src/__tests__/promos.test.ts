import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { BFCM_PROMO_EXPIRES_AT } from "@edgecoms/db/promo-seed-data";
import { apps } from "@edgecoms/db/schema/apps";
import { codeRedemptionAttempts } from "@edgecoms/db/schema/attribution";
import { user } from "@edgecoms/db/schema/auth";
import { earningEvents } from "@edgecoms/db/schema/earnings";
import { merchants } from "@edgecoms/db/schema/merchants";
import { partnerCodes, partners } from "@edgecoms/db/schema/partners";
import { promoCodes, promoRedemptions } from "@edgecoms/db/schema/promos";
import { eq } from "drizzle-orm";
import { bindAttribution } from "../attribution/bind";
import { redeemPromo } from "../attribution/promos";
import type { Context } from "../context";
import { createCallerFactory } from "../index";
import { appRouter } from "../routers/index";
import { createTestDb, type TestDb } from "./db-harness";

/**
 * Promo codes: a discount with no partner behind it. Protected here:
 *
 *   • It binds NOTHING — no merchant row, and a partner's store can redeem one.
 *   • The store cap counts STORES, so one store in four apps is one slot.
 *   • Rejections are written down inside. Outside, only "expired" and "store
 *     already used another code" are named; every other one looks the same.
 *   • One promo code per store, across every app.
 *   • Partner and promo codes never share a string.
 */

const P1 = "aaaaaaaa-0000-0000-0000-000000000001";
const SHOP = "acme.myshopify.com";
const OTHER_SHOP = "beta.myshopify.com";
const NOW = new Date("2026-10-17T12:00:00Z");

let harness: TestDb;

const adminCaller = () =>
	createCallerFactory(appRouter)({
		db: harness.db,
		session: { user: { id: "admin1", role: "admin" }, session: {} },
	} as unknown as Context);

const partnerCaller = () =>
	createCallerFactory(appRouter)({
		db: harness.db,
		session: { user: { id: "u1", role: "partner" }, session: {} },
	} as unknown as Context);

async function errorCode(promise: Promise<unknown>): Promise<string> {
	try {
		await promise;
		return "NO_ERROR";
	} catch (error) {
		return (error as { code?: string }).code ?? "UNKNOWN";
	}
}

async function issue(values: Partial<typeof promoCodes.$inferInsert> = {}) {
	await harness.db.insert(promoCodes).values({
		code: "FREE3",
		discountKind: "free_cycles",
		discountCycles: 3,
		expiresAt: new Date("2026-11-30T23:59:59Z"),
		...values,
	});
}

const redeem = (shopDomain = SHOP, appSlug = "edge-cart", code = "free3") =>
	redeemPromo(harness.db, { code, shopDomain, appSlug }, NOW);

beforeEach(async () => {
	harness = await createTestDb();
	await harness.db.insert(user).values([
		{ id: "admin1", name: "Admin", email: "admin@x.com", role: "admin" },
		{ id: "u1", name: "Alex", email: "alex@x.com", role: "partner" },
	]);
	await harness.db
		.insert(partners)
		.values({ id: P1, userId: "u1", status: "approved", defaultRateBps: 2500 });
});

afterEach(async () => {
	await harness.close();
});

describe("redeemPromo", () => {
	test("grants the offer on every plan and binds nothing", async () => {
		await issue();
		const result = await redeem();

		expect(result).toEqual({
			ok: true,
			status: "redeemed",
			offer: {
				kind: "free_cycles",
				bps: null,
				amountMinor: null,
				currency: null,
				cycles: 3,
				appliesTo: "all",
			},
		});
		expect(await harness.db.select().from(merchants)).toHaveLength(0);
	});

	test("a replay from the same app is a no-op", async () => {
		await issue();
		await redeem();
		const again = await redeem();

		expect(again.ok && again.status).toBe("already_redeemed");
		expect(await harness.db.select().from(promoRedemptions)).toHaveLength(1);
	});

	test("one store in several apps takes one slot of the cap", async () => {
		await issue({ maxRedemptions: 1 });

		expect((await redeem(SHOP, "edge-cart")).ok).toBe(true);
		expect((await redeem(SHOP, "edge-bundles")).ok).toBe(true);
		expect(await redeem(OTHER_SHOP, "edge-cart")).toEqual({
			ok: false,
			status: "invalid_code",
		});
	});

	test("a store a partner referred can still redeem", async () => {
		await harness.db
			.insert(partnerCodes)
			.values({ partnerId: P1, code: "ALEX-AGENCY" });
		await bindAttribution(
			harness.db,
			{ code: "ALEX-AGENCY", shopDomain: SHOP, appSlug: "edge-cart" },
			NOW
		);
		await issue();

		expect((await redeem()).ok).toBe(true);
		const [merchant] = await harness.db.select().from(merchants);
		expect(merchant?.partnerId).toBe(P1);
	});

	test("disabled and unknown codes fail the same way; expired says so", async () => {
		await issue({ code: "OLD1", expiresAt: new Date("2026-10-01T00:00:00Z") });
		await issue({ code: "OFF1", status: "disabled" });

		expect(await redeem(SHOP, "edge-cart", "old1")).toEqual({
			ok: false,
			status: "expired",
		});
		for (const code of ["off1", "nope"]) {
			expect(await redeem(SHOP, "edge-cart", code)).toEqual({
				ok: false,
				status: "invalid_code",
			});
		}
		const reasons = (
			await harness.db.select().from(codeRedemptionAttempts)
		).map((row) => row.reason);
		expect(reasons).toEqual([
			expect.stringContaining("expired"),
			expect.stringContaining("disabled"),
			"unknown promo code",
		]);
	});

	test("the Black Friday cut-off is the end of 30 November UTC", async () => {
		await issue({ expiresAt: BFCM_PROMO_EXPIRES_AT });
		const at = (iso: string) =>
			redeemPromo(
				harness.db,
				{ code: " free3 ", shopDomain: SHOP, appSlug: "edge-cart" },
				new Date(iso)
			);

		expect((await at("2026-11-30T23:59:59.999Z")).ok).toBe(true);
		expect(
			await redeemPromo(
				harness.db,
				{ code: "FREE3", shopDomain: OTHER_SHOP, appSlug: "edge-cart" },
				new Date("2026-12-01T00:00:00Z")
			)
		).toEqual({ ok: false, status: "expired" });
	});

	test("one promo code per store, across every app", async () => {
		await issue();
		await issue({ code: "OTHER3" });

		expect((await redeem(SHOP, "edge-cart", "free3")).ok).toBe(true);
		expect((await redeem(SHOP, "edge-bundles", "free3")).ok).toBe(true);
		expect(await redeem(SHOP, "edge-timer", "other3")).toEqual({
			ok: false,
			status: "other_code_used",
		});
		// Another store is unaffected.
		expect((await redeem(OTHER_SHOP, "edge-timer", "other3")).ok).toBe(true);
	});

	test("a store that redeemed before expiry keeps its offer on replay", async () => {
		await issue({ expiresAt: new Date("2026-10-18T00:00:00Z") });
		await redeem();

		const later = await redeemPromo(
			harness.db,
			{ code: "FREE3", shopDomain: SHOP, appSlug: "edge-cart" },
			new Date("2026-12-01T00:00:00Z")
		);
		expect(later.ok && later.status).toBe("already_redeemed");
	});

	test("misses spend the shop's attempt budget", async () => {
		for (let i = 0; i < 5; i += 1) {
			await redeem(SHOP, "edge-cart", `WRONG${i}`);
		}
		await issue();
		expect(await redeem()).toEqual({ ok: false, status: "rate_limited" });
	});
});

describe("admin.promoCodes", () => {
	test("create normalizes the code and keeps only the kind's fields", async () => {
		await adminCaller().admin.promoCodes.create({
			code: " free-3 ",
			discountKind: "free_cycles",
			discountCycles: 3,
			discountBps: 5000,
			expiresAt: "2026-11-30T23:59:59.000Z",
		});
		const row = await harness.db.query.promoCodes.findFirst({
			where: eq(promoCodes.code, "FREE-3"),
		});
		expect(row?.discountKind).toBe("free_cycles");
		expect(row?.discountCycles).toBe(3);
		expect(row?.discountBps).toBeNull();
	});

	test("a promo code can't reuse a partner code, and vice versa", async () => {
		await harness.db
			.insert(partnerCodes)
			.values({ partnerId: P1, code: "ALEX-AGENCY" });
		expect(
			await errorCode(
				adminCaller().admin.promoCodes.create({
					code: "alex-agency",
					discountKind: "free_cycles",
					discountCycles: 3,
				})
			)
		).toBe("CONFLICT");

		await issue();
		expect(
			await errorCode(
				adminCaller().admin.codes.create({ partnerId: P1, code: "free3" })
			)
		).toBe("CONFLICT");
	});

	test("refuses an incoherent discount", async () => {
		expect(
			await errorCode(
				adminCaller().admin.promoCodes.create({
					code: "FREE3",
					discountKind: "free_cycles",
				})
			)
		).toBe("BAD_REQUEST");
	});

	test("list counts stores and app redemptions separately", async () => {
		await issue();
		await redeem(SHOP, "edge-cart");
		await redeem(SHOP, "edge-bundles");
		await redeem(OTHER_SHOP, "edge-cart");

		const [row] = await adminCaller().admin.promoCodes.list();
		expect(row?.stores).toBe(2);
		expect(row?.redemptions).toBe(3);
	});

	test("list sums net revenue from the redeeming app, from redemption on", async () => {
		const CART = "bbbbbbbb-0000-0000-0000-000000000001";
		const BUNDLES = "bbbbbbbb-0000-0000-0000-000000000002";
		await harness.db.insert(apps).values([
			{
				id: CART,
				slug: "edge-cart",
				name: "Edge Cart",
				partnerApiGid: "gid://partners/App/1",
			},
			{
				id: BUNDLES,
				slug: "edge-bundles",
				name: "Edge Bundles",
				partnerApiGid: "gid://partners/App/2",
			},
		]);
		await issue();
		await redeem(SHOP, "edge-cart");

		let seq = 0;
		const charge = (appId: string, netAmount: bigint, occurredAt: string) => {
			seq += 1;
			return {
				shopifyTransactionId: `txn-${seq}`,
				shopDomain: SHOP,
				appId,
				grossAmount: netAmount,
				shopifyFeeAmount: 0n,
				netAmount,
				currency: "USD",
				transactionType: "app_subscription",
				occurredAt: new Date(occurredAt),
			};
		};
		await harness.db.insert(earningEvents).values([
			charge(CART, 1999n, "2027-02-01T00:00:00Z"), // counted
			charge(CART, 1999n, "2027-03-01T00:00:00Z"), // counted
			charge(CART, 500n, "2026-10-01T00:00:00Z"), // before redemption
			charge(BUNDLES, 900n, "2027-02-01T00:00:00Z"), // app never redeemed
		]);

		const [row] = await adminCaller().admin.promoCodes.list();
		expect(row?.revenue).toEqual([{ currency: "USD", netMinor: "3998" }]);
	});

	test("disabling stops new redemptions", async () => {
		await issue();
		const [row] = await adminCaller().admin.promoCodes.list();
		await adminCaller().admin.promoCodes.update({
			promoCodeId: row?.id ?? "",
			status: "disabled",
		});
		expect((await redeem()).ok).toBe(false);
	});

	test("partners can't reach it", async () => {
		expect(await errorCode(partnerCaller().admin.promoCodes.list())).toBe(
			"FORBIDDEN"
		);
	});
});
