import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apps } from "@edgecoms/db/schema/apps";
import {
	codeRedemptionAttempts,
	merchantEvents,
} from "@edgecoms/db/schema/attribution";
import { user } from "@edgecoms/db/schema/auth";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { partnerCodes, partners } from "@edgecoms/db/schema/partners";
import { eq } from "drizzle-orm";
import { ATTEMPT_LIMIT } from "../attribution/attempts";
import { bindAttribution } from "../attribution/bind";
import { normalizeCode } from "../attribution/codes";
import { recordShopEvent } from "../attribution/events";
import { previewCode } from "../attribution/preview";
import { createTestDb, type TestDb } from "./db-harness";

/**
 * The attribution rail. Two things are being protected here:
 *
 *   • ONE PARTNER PER SHOP, PERMANENT — a store cannot be moved between
 *     partners, and a replay must not create a second claim.
 *   • Codes cannot be enumerated — every rejection looks identical from outside
 *     while the real reason is still written down for us.
 */

const P1 = "aaaaaaaa-0000-0000-0000-000000000001";
const P2 = "aaaaaaaa-0000-0000-0000-000000000002";
const P_PENDING = "aaaaaaaa-0000-0000-0000-000000000003";
const APP_SUB = "cccccccc-0000-0000-0000-000000000001";
const APP_BUNDLES = "cccccccc-0000-0000-0000-000000000002";

const SHOP = "acme.myshopify.com";
const OTHER_SHOP = "beta.myshopify.com";

const NOW = new Date("2026-08-17T12:00:00Z");

let harness: TestDb;

beforeEach(async () => {
	harness = await createTestDb();
	await seed();
});

afterEach(async () => {
	await harness.close();
});

async function seed() {
	const { db } = harness;
	await db.insert(user).values([
		{ id: "u1", name: "Alex Agency", email: "alex@x.com", role: "partner" },
		{ id: "u2", name: "Rival Agency", email: "rival@x.com", role: "partner" },
		{ id: "u3", name: "New Agency", email: "new@x.com", role: "partner" },
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
		{ id: P_PENDING, userId: "u3", status: "pending", defaultRateBps: 0 },
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
	await db.insert(partnerCodes).values([
		{
			partnerId: P1,
			code: "ALEXAGENCY",
			label: "Alex 25%",
			perkUsageAllowanceUsd: 5000,
		},
		{ partnerId: P1, code: "DISABLEDCODE", status: "disabled" },
		{
			partnerId: P1,
			code: "EXPIREDCODE",
			expiresAt: new Date("2026-07-01T00:00:00Z"),
		},
		{ partnerId: P1, code: "CAPPEDCODE", maxRedemptions: 1 },
		{ partnerId: P2, code: "RIVALAGENCY" },
		{ partnerId: P_PENDING, code: "NOTAPPROVED" },
	]);
}

function bind(input: {
	code: string;
	shopDomain: string;
	paidAppSlugs?: string[];
	shopifyGid?: string | null;
	shopName?: string | null;
}) {
	return bindAttribution(
		harness.db,
		{ appSlug: "edge-subscription", ...input },
		NOW
	);
}

async function merchantFor(shopDomain: string) {
	return (
		(await harness.db.query.merchants.findFirst({
			where: eq(merchants.shopDomain, shopDomain),
		})) ?? null
	);
}

async function grandfatheredAppIds(merchantId: string): Promise<string[]> {
	const rows = await harness.db
		.select({ appId: merchantGrandfatheredApps.appId })
		.from(merchantGrandfatheredApps)
		.where(eq(merchantGrandfatheredApps.merchantId, merchantId));
	return rows.map((row) => row.appId).sort();
}

function attempts() {
	return harness.db.select().from(codeRedemptionAttempts);
}

describe("normalizeCode", () => {
	test("upper-cases and strips whitespace but keeps hyphens", () => {
		// A merchant retypes what an agency emailed them; copy-paste adds spaces.
		expect(normalizeCode("  acme-partner ")).toBe("ACME-PARTNER");
		expect(normalizeCode("alex agency")).toBe("ALEXAGENCY");
	});
});

describe("bindAttribution — the happy path", () => {
	test("creates a pending merchant bound to the code's partner", async () => {
		const result = await bind({
			code: "ALEXAGENCY",
			shopDomain: SHOP,
			shopifyGid: "gid://shopify/Shop/123",
			shopName: "Acme Store",
		});

		expect(result).toMatchObject({
			ok: true,
			status: "bound",
			partner: { id: P1, name: "Alex Agency Ltd" },
			perk: { usageAllowanceUsd: 5000 },
		});

		const merchant = await merchantFor(SHOP);
		expect(merchant).toMatchObject({
			partnerId: P1,
			// Pending, NOT approved: approval is the money gate (CLAUDE.md
			// "Eligibility") and a code must not bypass it.
			status: "pending",
			source: "code",
			sourceCode: "ALEXAGENCY",
			shopifyGid: "gid://shopify/Shop/123",
			name: "Acme Store",
		});
	});

	test("falls back to the store handle when no name is reported", async () => {
		await bind({ code: "ALEXAGENCY", shopDomain: SHOP });
		expect((await merchantFor(SHOP))?.name).toBe("acme");
	});

	test("normalizes the code and the shop reference", async () => {
		const result = await bind({
			code: " alexagency ",
			shopDomain: "https://Acme.myshopify.com/admin",
		});
		expect(result.ok).toBe(true);
		// Canonical domain is the dedup key — it must be what lands in the row.
		expect(await merchantFor(SHOP)).not.toBeNull();
	});

	test("prefers the partner's user name when no company is set", async () => {
		const result = await bind({ code: "RIVALAGENCY", shopDomain: SHOP });
		expect(result).toMatchObject({
			ok: true,
			partner: { name: "Rival Agency" },
		});
	});
});

describe("bindAttribution — one partner per shop, permanent", () => {
	test("a replay of the same code returns the existing binding", async () => {
		const first = await bind({ code: "ALEXAGENCY", shopDomain: SHOP });
		const second = await bind({ code: "ALEXAGENCY", shopDomain: SHOP });

		expect(first).toMatchObject({ ok: true, status: "bound" });
		expect(second).toMatchObject({ ok: true, status: "already_bound" });
		if (first.ok && second.ok) {
			expect(second.merchantId).toBe(first.merchantId);
		}

		const rows = await harness.db
			.select()
			.from(merchants)
			.where(eq(merchants.shopDomain, SHOP));
		expect(rows).toHaveLength(1);
	});

	test("another partner's code on a claimed store is refused", async () => {
		await bind({ code: "ALEXAGENCY", shopDomain: SHOP });
		const stolen = await bind({ code: "RIVALAGENCY", shopDomain: SHOP });

		expect(stolen).toEqual({ ok: false, status: "claimed_by_other" });
		// The original attribution is untouched — this is the money-relevant part.
		expect((await merchantFor(SHOP))?.partnerId).toBe(P1);
		expect((await merchantFor(SHOP))?.sourceCode).toBe("ALEXAGENCY");
	});

	test("a refused takeover is recorded as claimed_by_other", async () => {
		await bind({ code: "ALEXAGENCY", shopDomain: SHOP });
		await bind({ code: "RIVALAGENCY", shopDomain: SHOP });

		const rows = await attempts();
		const refused = rows.find((row) => row.outcome === "claimed_by_other");
		expect(refused?.code).toBe("RIVALAGENCY");
		expect(refused?.reason).toContain("already bound to another partner");
	});

	test("a manually registered store cannot be re-bound by a code", async () => {
		// The store was registered by hand under P2 before codes existed.
		await harness.db.insert(merchants).values({
			partnerId: P2,
			shopDomain: SHOP,
			name: "Acme",
			status: "approved",
		});
		expect(await bind({ code: "ALEXAGENCY", shopDomain: SHOP })).toEqual({
			ok: false,
			status: "claimed_by_other",
		});
		expect((await merchantFor(SHOP))?.partnerId).toBe(P2);
	});

	test("a replay backfills a shop GID the first call did not carry", async () => {
		await bind({ code: "ALEXAGENCY", shopDomain: SHOP });
		expect((await merchantFor(SHOP))?.shopifyGid).toBeNull();

		await bind({
			code: "ALEXAGENCY",
			shopDomain: SHOP,
			shopifyGid: "gid://shopify/Shop/999",
		});
		expect((await merchantFor(SHOP))?.shopifyGid).toBe(
			"gid://shopify/Shop/999"
		);
	});
});

describe("bindAttribution — rejections are indistinguishable", () => {
	const cases: [string, string][] = [
		["an unknown code", "NOSUCHCODE"],
		["a disabled code", "DISABLEDCODE"],
		["an expired code", "EXPIREDCODE"],
		["a code whose partner is not approved", "NOTAPPROVED"],
	];

	for (const [label, code] of cases) {
		test(`${label} returns the same generic failure`, async () => {
			expect(await bind({ code, shopDomain: SHOP })).toEqual({
				ok: false,
				status: "invalid_code",
			});
			expect(await merchantFor(SHOP)).toBeNull();
		});
	}

	test("an exhausted code is refused once its cap is reached", async () => {
		expect(await bind({ code: "CAPPEDCODE", shopDomain: SHOP })).toMatchObject({
			ok: true,
			status: "bound",
		});
		// maxRedemptions is 1, and the redemption count is derived from merchant
		// rows — so the second store gets nothing.
		expect(await bind({ code: "CAPPEDCODE", shopDomain: OTHER_SHOP })).toEqual({
			ok: false,
			status: "invalid_code",
		});
		expect(await merchantFor(OTHER_SHOP)).toBeNull();
	});

	test("the real reason is written down even though it is never returned", async () => {
		await bind({ code: "EXPIREDCODE", shopDomain: SHOP });
		await bind({ code: "DISABLEDCODE", shopDomain: OTHER_SHOP });

		const rows = await attempts();
		expect(rows.every((row) => row.outcome === "invalid")).toBe(true);
		// Distinct internal detail behind an identical outward answer.
		expect(rows.map((row) => row.reason).sort()).toEqual([
			"code expired at 2026-07-01T00:00:00.000Z",
			"code status disabled",
		]);
	});

	test("an unusable shop reference is refused before any write", async () => {
		expect(await bind({ code: "ALEXAGENCY", shopDomain: "   " })).toEqual({
			ok: false,
			status: "invalid_shop",
		});
		// Nothing to rate-limit against means nothing recorded either.
		expect(await attempts()).toHaveLength(0);
	});
});

describe("bindAttribution — grandfathered apps", () => {
	test("apps the shop already paid for are captured at bind", async () => {
		const result = await bind({
			code: "ALEXAGENCY",
			shopDomain: SHOP,
			paidAppSlugs: ["edge-subscription"],
		});
		if (!result.ok) {
			throw new Error("expected the bind to succeed");
		}
		// Edge Subscription never earns for this merchant — the partner did not
		// bring us that revenue.
		expect(await grandfatheredAppIds(result.merchantId)).toEqual([APP_SUB]);
	});

	test("unknown app slugs are dropped rather than failing the bind", async () => {
		const result = await bind({
			code: "ALEXAGENCY",
			shopDomain: SHOP,
			paidAppSlugs: ["edge-subscription", "edge-nonexistent"],
		});
		if (!result.ok) {
			throw new Error("expected the bind to succeed");
		}
		expect(await grandfatheredAppIds(result.merchantId)).toEqual([APP_SUB]);
	});

	test("a replay may add an app the first report missed, while pending", async () => {
		const first = await bind({
			code: "ALEXAGENCY",
			shopDomain: SHOP,
			paidAppSlugs: ["edge-subscription"],
		});
		if (!first.ok) {
			throw new Error("expected the bind to succeed");
		}
		await bind({
			code: "ALEXAGENCY",
			shopDomain: SHOP,
			paidAppSlugs: ["edge-bundles"],
		});
		expect(await grandfatheredAppIds(first.merchantId)).toEqual(
			[APP_SUB, APP_BUNDLES].sort()
		);
	});

	test("the set is frozen once the merchant is approved", async () => {
		const first = await bind({
			code: "ALEXAGENCY",
			shopDomain: SHOP,
			paidAppSlugs: ["edge-subscription"],
		});
		if (!first.ok) {
			throw new Error("expected the bind to succeed");
		}
		await harness.db
			.update(merchants)
			.set({ status: "approved", approvedAt: NOW })
			.where(eq(merchants.id, first.merchantId));

		// A late report must NOT widen the set: doing so would retroactively delete
		// commission the partner had already been told they were earning.
		await bind({
			code: "ALEXAGENCY",
			shopDomain: SHOP,
			paidAppSlugs: ["edge-bundles"],
		});
		expect(await grandfatheredAppIds(first.merchantId)).toEqual([APP_SUB]);
	});

	test("reporting no paid apps leaves the set empty", async () => {
		const result = await bind({ code: "ALEXAGENCY", shopDomain: SHOP });
		if (!result.ok) {
			throw new Error("expected the bind to succeed");
		}
		expect(await grandfatheredAppIds(result.merchantId)).toEqual([]);
	});
});

describe("code entry rate limiting", () => {
	test(`turns a shop away after ${ATTEMPT_LIMIT} attempts`, async () => {
		for (let i = 0; i < ATTEMPT_LIMIT; i++) {
			expect(await bind({ code: `WRONG${i}`, shopDomain: SHOP })).toEqual({
				ok: false,
				status: "invalid_code",
			});
		}
		expect(await bind({ code: "ALEXAGENCY", shopDomain: SHOP })).toEqual({
			ok: false,
			status: "rate_limited",
		});
		expect(await merchantFor(SHOP)).toBeNull();
	});

	test("the limit is per shop, not global", async () => {
		for (let i = 0; i < ATTEMPT_LIMIT; i++) {
			await bind({ code: `WRONG${i}`, shopDomain: SHOP });
		}
		// A different store is unaffected — one merchant fat-fingering their code
		// must not lock out everyone else's onboarding.
		expect(
			await bind({ code: "ALEXAGENCY", shopDomain: OTHER_SHOP })
		).toMatchObject({ ok: true, status: "bound" });
	});

	test("refused attempts are logged but do not deepen the block", async () => {
		for (let i = 0; i < ATTEMPT_LIMIT; i++) {
			await bind({ code: `WRONG${i}`, shopDomain: SHOP });
		}
		await bind({ code: "ALEXAGENCY", shopDomain: SHOP });
		await bind({ code: "ALEXAGENCY", shopDomain: SHOP });

		const rows = await attempts();
		// The rate_limited rows exist for the abuse trail...
		expect(rows.filter((row) => row.outcome === "rate_limited")).toHaveLength(
			2
		);
		// ...but the window still counts only the five real attempts, so the block
		// expires an hour after those rather than being pushed forward forever.
		expect(rows.filter((row) => row.outcome === "invalid")).toHaveLength(
			ATTEMPT_LIMIT
		);
	});

	test("the window is trailing, so an old burst does not block a new attempt", async () => {
		for (let i = 0; i < ATTEMPT_LIMIT; i++) {
			await bind({ code: `WRONG${i}`, shopDomain: SHOP });
		}
		const laterStill = new Date(NOW.getTime() + 2 * 60 * 60_000);
		expect(
			await bindAttribution(
				harness.db,
				{ code: "ALEXAGENCY", shopDomain: SHOP, appSlug: "edge-subscription" },
				laterStill
			)
		).toMatchObject({ ok: true, status: "bound" });
	});
});

describe("previewCode", () => {
	test("returns the partner and perk without recording anything", async () => {
		const preview = await previewCode(
			harness.db,
			{ code: "alexagency", shopDomain: SHOP },
			NOW
		);
		expect(preview).toEqual({
			ok: true,
			valid: true,
			partner: { id: P1, name: "Alex Agency Ltd" },
			// Phase 1 carries no discount terms — a code must not imply a price cut
			// nothing can honour yet.
			offer: null,
			perk: { usageAllowanceUsd: 5000 },
		});
		// A preview must not spend one of the merchant's five real tries.
		expect(await attempts()).toHaveLength(0);
	});

	test("reports an unusable code without saying why", async () => {
		expect(
			await previewCode(
				harness.db,
				{ code: "EXPIREDCODE", shopDomain: SHOP },
				NOW
			)
		).toEqual({ ok: true, valid: false });
	});

	test("is still subject to the attempt limit", async () => {
		for (let i = 0; i < ATTEMPT_LIMIT; i++) {
			await bind({ code: `WRONG${i}`, shopDomain: SHOP });
		}
		// Otherwise the preview would be a free oracle for enumerating codes.
		expect(
			await previewCode(
				harness.db,
				{ code: "ALEXAGENCY", shopDomain: SHOP },
				NOW
			)
		).toEqual({ ok: false, status: "rate_limited" });
	});
});

describe("recordShopEvent", () => {
	const event = {
		idempotencyKey: "sub-activated-1",
		shopDomain: SHOP,
		appSlug: "edge-subscription",
		type: "subscription.activated" as const,
		planHandle: "growth",
		occurredAt: NOW,
	};

	test("records an event and links it to the merchant", async () => {
		const bound = await bind({ code: "ALEXAGENCY", shopDomain: SHOP });
		if (!bound.ok) {
			throw new Error("expected the bind to succeed");
		}

		expect(await recordShopEvent(harness.db, event)).toEqual({
			ok: true,
			status: "recorded",
			merchantId: bound.merchantId,
		});

		const rows = await harness.db.select().from(merchantEvents);
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({
			type: "subscription.activated",
			planHandle: "growth",
			appId: APP_SUB,
			merchantId: bound.merchantId,
		});
	});

	test("a redelivery of the same key changes nothing", async () => {
		await bind({ code: "ALEXAGENCY", shopDomain: SHOP });
		await recordShopEvent(harness.db, event);

		expect(await recordShopEvent(harness.db, event)).toMatchObject({
			ok: true,
			status: "duplicate",
		});
		expect(await harness.db.select().from(merchantEvents)).toHaveLength(1);
	});

	test("an event for an untracked shop is still recorded", async () => {
		// The gap between a recorded event and a missing merchant is precisely what
		// a reconciliation sweep looks for — dropping it would hide the problem.
		expect(await recordShopEvent(harness.db, event)).toEqual({
			ok: true,
			status: "recorded",
			merchantId: null,
		});
		expect(
			(await harness.db.select().from(merchantEvents))[0]?.shopDomain
		).toBe(SHOP);
	});

	test("uninstalling does not unbind the merchant", async () => {
		const bound = await bind({ code: "ALEXAGENCY", shopDomain: SHOP });
		if (!bound.ok) {
			throw new Error("expected the bind to succeed");
		}
		await recordShopEvent(harness.db, {
			...event,
			idempotencyKey: "uninstalled-1",
			type: "uninstalled",
		});

		// A store leaving does not transfer a partner's book, and a reinstall keeps
		// its original attribution.
		expect(await merchantFor(SHOP)).toMatchObject({
			partnerId: P1,
			partnerCodeId: expect.any(String),
		});
	});

	test("an unusable shop reference is refused", async () => {
		expect(
			await recordShopEvent(harness.db, { ...event, shopDomain: "  " })
		).toEqual({ ok: false, status: "invalid_shop" });
		expect(await harness.db.select().from(merchantEvents)).toHaveLength(0);
	});
});
