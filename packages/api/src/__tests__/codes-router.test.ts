import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { partnerCodes, partners } from "@edgecoms/db/schema/partners";
import { eq } from "drizzle-orm";
import { bindAttribution } from "../attribution/bind";
import type { Context } from "../context";
import { createCallerFactory } from "../index";
import { appRouter } from "../routers/index";
import { createTestDb, type TestDb } from "./db-harness";

/**
 * The codes surface over a real database: admin issuance, partner visibility
 * (tenant isolation), and the approval flow now that a code-bound merchant
 * arrives with a pre-filled grandfathered set.
 */

const P1 = "aaaaaaaa-0000-0000-0000-000000000001";
const P2 = "aaaaaaaa-0000-0000-0000-000000000002";
const APP_SUB = "cccccccc-0000-0000-0000-000000000001";
const APP_BUNDLES = "cccccccc-0000-0000-0000-000000000002";
const SHOP = "acme.myshopify.com";

let harness: TestDb;

const adminCaller = () =>
	createCallerFactory(appRouter)({
		db: harness.db,
		session: { user: { id: "admin1", role: "admin" }, session: {} },
	} as unknown as Context);

const partnerCaller = (userId: string) =>
	createCallerFactory(appRouter)({
		db: harness.db,
		session: { user: { id: userId, role: "partner" }, session: {} },
	} as unknown as Context);

beforeEach(async () => {
	harness = await createTestDb();
	const { db } = harness;
	await db.insert(user).values([
		{ id: "admin1", name: "Admin", email: "admin@x.com", role: "admin" },
		{ id: "u1", name: "Alex", email: "alex@x.com", role: "partner" },
		{ id: "u2", name: "Rival", email: "rival@x.com", role: "partner" },
	]);
	await db.insert(partners).values([
		{
			id: P1,
			userId: "u1",
			companyName: "Alex Agency Ltd",
			status: "approved",
			defaultRateBps: 2500,
		},
		{ id: P2, userId: "u2", status: "approved", defaultRateBps: 2000 },
	]);
	await db.insert(apps).values([
		{
			id: APP_SUB,
			slug: "edge-subscription",
			name: "Edge Subscription",
			partnerApiGid: "gid://sub",
		},
		{
			id: APP_BUNDLES,
			slug: "edge-bundles",
			name: "Edge Bundles",
			partnerApiGid: "gid://bundles",
		},
	]);
});

afterEach(async () => {
	await harness.close();
});

/** Resolves to the thrown tRPC error code, or "NO_ERROR" if it didn't throw. */
async function errorCode(promise: Promise<unknown>): Promise<string> {
	try {
		await promise;
		return "NO_ERROR";
	} catch (error) {
		return (error as { code?: string }).code ?? "UNKNOWN";
	}
}

describe("admin.codes.create", () => {
	test("normalizes the code before storing it", async () => {
		await adminCaller().admin.codes.create({
			partnerId: P1,
			code: " alex-agency ",
			label: "Alex 25%",
			perkUsageAllowanceUsd: 5000,
		});

		const row = await harness.db.query.partnerCodes.findFirst({
			where: eq(partnerCodes.partnerId, P1),
		});
		expect(row?.code).toBe("ALEX-AGENCY");
		expect(row?.perkUsageAllowanceUsd).toBe(5000);
		expect(row?.status).toBe("active");
	});

	test("refuses a duplicate code", async () => {
		await adminCaller().admin.codes.create({ partnerId: P1, code: "SHARED" });
		// A code must address exactly one partner or attribution is ambiguous.
		expect(
			await errorCode(
				adminCaller().admin.codes.create({ partnerId: P2, code: "shared" })
			)
		).toBe("CONFLICT");
	});

	test("refuses codes outside the allowed charset", async () => {
		for (const code of ["ab", "has spaces!", "a".repeat(33)]) {
			expect(
				await errorCode(
					adminCaller().admin.codes.create({ partnerId: P1, code })
				)
			).not.toBe("NO_ERROR");
		}
	});
});

describe("admin.codes.list", () => {
	test("counts redemptions from merchant rows", async () => {
		await adminCaller().admin.codes.create({
			partnerId: P1,
			code: "ALEXAGENCY",
		});
		await bindAttribution(harness.db, {
			code: "ALEXAGENCY",
			shopDomain: SHOP,
			appSlug: "edge-subscription",
		});

		const rows = await adminCaller().admin.codes.list();
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({
			code: "ALEXAGENCY",
			redemptions: 1,
			partnerCompany: "Alex Agency Ltd",
		});
	});

	test("reports zero for a code nobody has used", async () => {
		await adminCaller().admin.codes.create({ partnerId: P1, code: "UNUSED" });
		expect((await adminCaller().admin.codes.list())[0]?.redemptions).toBe(0);
	});
});

describe("admin.codes.update", () => {
	test("disabling a code does not unbind the stores it referred", async () => {
		await adminCaller().admin.codes.create({
			partnerId: P1,
			code: "ALEXAGENCY",
		});
		await bindAttribution(harness.db, {
			code: "ALEXAGENCY",
			shopDomain: SHOP,
			appSlug: "edge-subscription",
		});

		const code = await harness.db.query.partnerCodes.findFirst({
			where: eq(partnerCodes.code, "ALEXAGENCY"),
		});
		if (!code) {
			throw new Error("expected the code to exist");
		}
		await adminCaller().admin.codes.update({
			codeId: code.id,
			status: "disabled",
		});

		// A partner loses the ability to ACQUIRE, not their existing book.
		const merchant = await harness.db.query.merchants.findFirst({
			where: eq(merchants.shopDomain, SHOP),
		});
		expect(merchant?.partnerId).toBe(P1);
		expect(merchant?.partnerCodeId).toBe(code.id);

		// ...and no new store can redeem it.
		expect(
			await bindAttribution(harness.db, {
				code: "ALEXAGENCY",
				shopDomain: "beta.myshopify.com",
				appSlug: "edge-subscription",
			})
		).toEqual({ ok: false, status: "invalid_code" });
	});

	test("clears a term when passed null", async () => {
		await adminCaller().admin.codes.create({
			partnerId: P1,
			code: "ALEXAGENCY",
			maxRedemptions: 5,
		});
		const code = await harness.db.query.partnerCodes.findFirst({
			where: eq(partnerCodes.code, "ALEXAGENCY"),
		});
		if (!code) {
			throw new Error("expected the code to exist");
		}

		await adminCaller().admin.codes.update({
			codeId: code.id,
			maxRedemptions: null,
		});
		const updated = await harness.db.query.partnerCodes.findFirst({
			where: eq(partnerCodes.id, code.id),
		});
		expect(updated?.maxRedemptions).toBeNull();
	});

	test("rejects an unknown code id", async () => {
		expect(
			await errorCode(
				adminCaller().admin.codes.update({
					codeId: "eeeeeeee-0000-0000-0000-000000000009",
					status: "disabled",
				})
			)
		).toBe("NOT_FOUND");
	});
});

describe("partner.codes.list — tenant isolation", () => {
	beforeEach(async () => {
		await adminCaller().admin.codes.create({
			partnerId: P1,
			code: "ALEXAGENCY",
			label: "Alex 25%",
			perkUsageAllowanceUsd: 5000,
		});
		await adminCaller().admin.codes.create({
			partnerId: P2,
			code: "RIVALAGENCY",
			label: "Rival 20%",
		});
	});

	test("a partner sees only their own codes", async () => {
		const mine = await partnerCaller("u1").partner.codes.list();
		expect(mine.map((row) => row.code)).toEqual(["ALEXAGENCY"]);

		const theirs = await partnerCaller("u2").partner.codes.list();
		expect(theirs.map((row) => row.code)).toEqual(["RIVALAGENCY"]);
	});

	test("the internal label is never returned to a partner", async () => {
		// `label` may name the commission rate. One partner reading another's rate
		// is how a programme gets renegotiated from the outside.
		const [mine] = await partnerCaller("u1").partner.codes.list();
		expect(mine).not.toHaveProperty("label");
	});

	test("redemption counts are scoped to the caller", async () => {
		await bindAttribution(harness.db, {
			code: "RIVALAGENCY",
			shopDomain: SHOP,
			appSlug: "edge-subscription",
		});

		expect(
			(await partnerCaller("u1").partner.codes.list())[0]?.redemptions
		).toBe(0);
		expect(
			(await partnerCaller("u2").partner.codes.list())[0]?.redemptions
		).toBe(1);
	});
});

describe("admin.merchants — code-bound approval", () => {
	async function boundMerchantId(paidAppSlugs: string[]): Promise<string> {
		await adminCaller().admin.codes.create({
			partnerId: P1,
			code: "ALEXAGENCY",
		});
		const result = await bindAttribution(harness.db, {
			code: "ALEXAGENCY",
			shopDomain: SHOP,
			appSlug: "edge-subscription",
			paidAppSlugs,
		});
		if (!result.ok) {
			throw new Error("expected the bind to succeed");
		}
		return result.merchantId;
	}

	async function grandfathered(merchantId: string): Promise<string[]> {
		const rows = await harness.db
			.select({ appId: merchantGrandfatheredApps.appId })
			.from(merchantGrandfatheredApps)
			.where(eq(merchantGrandfatheredApps.merchantId, merchantId));
		return rows.map((row) => row.appId).sort();
	}

	test("the list exposes the code and the pre-filled grandfathered set", async () => {
		const merchantId = await boundMerchantId(["edge-subscription"]);
		const [row] = await adminCaller().admin.merchants.list();
		expect(row).toMatchObject({
			id: merchantId,
			source: "code",
			sourceCode: "ALEXAGENCY",
			status: "pending",
			grandfatheredAppIds: [APP_SUB],
		});
	});

	test("approving with the pre-filled set keeps it", async () => {
		const merchantId = await boundMerchantId(["edge-subscription"]);
		await adminCaller().admin.merchants.approve({
			merchantId,
			grandfatheredAppIds: [APP_SUB],
		});
		expect(await grandfathered(merchantId)).toEqual([APP_SUB]);
	});

	test("unchecking an over-reported app removes it", async () => {
		const merchantId = await boundMerchantId([
			"edge-subscription",
			"edge-bundles",
		]);
		expect(await grandfathered(merchantId)).toEqual(
			[APP_SUB, APP_BUNDLES].sort()
		);

		// The admin decides Bundles was reported in error. The submitted list
		// REPLACES the proposal — failing to re-add is not the same as removing.
		await adminCaller().admin.merchants.approve({
			merchantId,
			grandfatheredAppIds: [APP_SUB],
		});
		expect(await grandfathered(merchantId)).toEqual([APP_SUB]);
	});

	test("approving with an empty selection clears the set", async () => {
		const merchantId = await boundMerchantId(["edge-subscription"]);
		await adminCaller().admin.merchants.approve({
			merchantId,
			grandfatheredAppIds: [],
		});
		expect(await grandfathered(merchantId)).toEqual([]);
	});

	test("approval flips the merchant to approved", async () => {
		const merchantId = await boundMerchantId([]);
		await adminCaller().admin.merchants.approve({
			merchantId,
			grandfatheredAppIds: [],
		});
		const merchant = await harness.db.query.merchants.findFirst({
			where: eq(merchants.id, merchantId),
		});
		expect(merchant?.status).toBe("approved");
		expect(merchant?.approvedBy).toBe("admin1");
	});
});
