import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { partnerCodes, partners } from "@edgecoms/db/schema/partners";
import { referralClaims, referralClicks } from "@edgecoms/db/schema/referrals";
import { eq } from "drizzle-orm";
import type { Context } from "../context";
import { createCallerFactory } from "../index";
import {
	CLAIM_TTL_DAYS,
	createClaim,
	listSuggestions,
	liveClaimFor,
	normalizeClaimDomain,
	suggestClaim,
} from "../referrals/claims";
import { approveClaim, resolveAttribution } from "../referrals/resolve";
import { appRouter } from "../routers/index";
import { createTestDb, type TestDb } from "./db-harness";

const createCaller = createCallerFactory(appRouter);

/**
 * Claims and install-time resolution.
 *
 * These are the rules that decide whose store a merchant becomes, so each one
 * is tested against the case it exists to refuse: a claim on somebody else's
 * store, a partner claiming their own, an expired claim, and an IP match that
 * must never attribute by itself.
 */

const ACME = "aaaaaaaa-0000-4000-8000-000000000001";
const BRIGHT = "aaaaaaaa-0000-4000-8000-000000000002";
const APP = "dddddddd-0000-4000-8000-000000000001";
const OWNED = "owned.myshopify.com";
const FRESH = "fresh.myshopify.com";
const NOW = new Date("2026-09-18T12:00:00Z");
const DAY_MS = 24 * 60 * 60 * 1000;

let harness: TestDb;

async function seed() {
	const { db } = harness;
	await db.insert(user).values([
		{
			email: "alex@acmeagency.com",
			id: "u-acme",
			name: "Alex",
			role: "partner",
		},
		{ email: "sam@brightco.io", id: "u-bright", name: "Sam", role: "partner" },
	]);
	await db.insert(partners).values([
		{
			companyName: "Acme Agency",
			defaultRateBps: 2000,
			id: ACME,
			status: "approved",
			userId: "u-acme",
		},
		{
			companyName: "Bright Commerce",
			defaultRateBps: 1500,
			id: BRIGHT,
			status: "approved",
			userId: "u-bright",
		},
	]);
	await db.insert(partnerCodes).values([
		{ code: "ACMEAGENCY", partnerId: ACME },
		{ code: "BRIGHTCO", partnerId: BRIGHT },
	]);
	await db.insert(apps).values([
		{
			id: APP,
			name: "Edge Cart",
			partnerApiGid: "gid://cart",
			slug: "edge-cart",
		},
		{
			id: "dddddddd-0000-4000-8000-000000000002",
			name: "Edge Bundles",
			partnerApiGid: "gid://bundles",
			slug: "edge-bundles",
		},
	]);
	/* A store that already belongs to Bright: rule 1's subject. */
	await db.insert(merchants).values({
		name: "owned",
		partnerId: BRIGHT,
		shopDomain: OWNED,
		source: "code",
		sourceCode: "BRIGHTCO",
		status: "approved",
	});
}

beforeEach(async () => {
	harness = await createTestDb();
	await seed();
});

afterEach(async () => {
	await harness.close();
});

function claimFor(shopDomain: string, partnerId: string) {
	return createClaim(
		harness.db,
		{
			appSlug: "edge-cart",
			clickId: null,
			linkId: null,
			partnerId,
			shopDomain,
		},
		NOW
	);
}

function resolve(shop: string, extra: { ipHash?: string } = {}) {
	return resolveAttribution(
		harness.db,
		{ appSlug: "edge-cart", ipHash: extra.ipHash ?? null, shop },
		NOW
	);
}

describe("the resolution order", () => {
	test("1. a store that already has a partner keeps it, claim or no claim", async () => {
		await claimFor(OWNED, ACME);

		const outcome = await resolve(OWNED);

		expect(outcome.status).toBe("existing");
		expect(outcome).toMatchObject({ partner: { name: "Bright Commerce" } });
		/* The claim is untouched: it did not convert, and it did not move the
		   store. One partner per shop is permanent. */
		const claim = await harness.db.query.referralClaims.findFirst({
			where: eq(referralClaims.partnerId, ACME),
		});
		expect(claim?.status).toBe("pending");
		const rows = await harness.db
			.select({ id: merchants.id })
			.from(merchants)
			.where(eq(merchants.shopDomain, OWNED));
		expect(rows).toHaveLength(1);
	});

	test("2. a live claim attributes the store, pending approval", async () => {
		const claim = await claimFor(FRESH, ACME);

		const outcome = await resolve(FRESH);

		expect(outcome).toMatchObject({
			partner: { name: "Acme Agency" },
			status: "attributed",
		});
		const merchant = await harness.db.query.merchants.findFirst({
			where: eq(merchants.shopDomain, FRESH),
		});
		expect(merchant).toMatchObject({
			partnerId: ACME,
			source: "link",
			sourceCode: "ACMEAGENCY",
			/* Nothing earns until an admin approves, exactly as a code bind. */
			status: "pending",
		});
		/* A link-referred partner earns from the install, not from the past. */
		expect(merchant?.earningsFromAt).toEqual(NOW);

		const converted = await harness.db.query.referralClaims.findFirst({
			where: eq(referralClaims.id, claim?.id ?? ""),
		});
		expect(converted?.status).toBe("converted");
		expect(converted?.convertedMerchantId).toBe(merchant?.id ?? "");
	});

	test("3. with no claim there is no partner, and the code box still applies", async () => {
		expect(await resolve(FRESH)).toEqual({ status: "none" });
		const rows = await harness.db.select({ id: merchants.id }).from(merchants);
		expect(rows).toHaveLength(1);
	});

	test("4. a recent click from the same address only SUGGESTS a match", async () => {
		await harness.db.insert(referralClicks).values({
			createdAt: new Date(NOW.getTime() - 2 * DAY_MS),
			ipHash: "hash-of-an-address",
			partnerId: ACME,
		});

		const outcome = await resolve(FRESH, { ipHash: "hash-of-an-address" });

		expect(outcome).toMatchObject({
			partner: { name: "Acme Agency" },
			status: "suggested",
		});
		/* Suggested, NOT attributed: an address is shared by an office. */
		const rows = await harness.db
			.select({ id: merchants.id })
			.from(merchants)
			.where(eq(merchants.shopDomain, FRESH));
		expect(rows).toEqual([]);
		const suggestion = await harness.db.query.referralClaims.findFirst({
			where: eq(referralClaims.shopDomain, FRESH),
		});
		expect(suggestion?.status).toBe("suggested");
	});

	test("an address that clicked too long ago suggests nothing", async () => {
		await harness.db.insert(referralClicks).values({
			createdAt: new Date(NOW.getTime() - 8 * DAY_MS),
			ipHash: "old-hash",
			partnerId: ACME,
		});
		expect(await resolve(FRESH, { ipHash: "old-hash" })).toEqual({
			status: "none",
		});
	});

	test("a crawler's click never suggests anything", async () => {
		await harness.db.insert(referralClicks).values({
			createdAt: NOW,
			ipHash: "bot-hash",
			isBot: true,
			partnerId: ACME,
		});
		expect(await resolve(FRESH, { ipHash: "bot-hash" })).toEqual({
			status: "none",
		});
	});

	test("an expired claim is not honoured", async () => {
		await harness.db.insert(referralClaims).values({
			expiresAt: new Date(NOW.getTime() - DAY_MS),
			partnerId: ACME,
			shopDomain: FRESH,
		});
		expect(await resolve(FRESH)).toEqual({ status: "none" });
	});

	test("an unusable shop address is refused before any write", async () => {
		expect(await resolve("   ")).toEqual({ status: "invalid_shop" });
		const rows = await harness.db.select({ id: merchants.id }).from(merchants);
		expect(rows).toHaveLength(1);
	});

	test("resolving twice does not create a second store", async () => {
		await claimFor(FRESH, ACME);
		const first = await resolve(FRESH);
		const second = await resolve(FRESH);

		expect(first.status).toBe("attributed");
		expect(second.status).toBe("existing");
		const rows = await harness.db
			.select({ id: merchants.id })
			.from(merchants)
			.where(eq(merchants.shopDomain, FRESH));
		expect(rows).toHaveLength(1);
	});

	test("apps the shop already paid for are recorded and never earn", async () => {
		await claimFor(FRESH, ACME);
		await resolveAttribution(
			harness.db,
			{
				appSlug: "edge-cart",
				paidAppSlugs: ["edge-bundles", "not-an-app"],
				shop: FRESH,
			},
			NOW
		);

		const merchant = await harness.db.query.merchants.findFirst({
			where: eq(merchants.shopDomain, FRESH),
		});
		const grandfathered = await harness.db
			.select({ appId: merchantGrandfatheredApps.appId })
			.from(merchantGrandfatheredApps)
			.where(eq(merchantGrandfatheredApps.merchantId, merchant?.id ?? ""));
		expect(grandfathered.map((row) => row.appId)).toEqual([
			"dddddddd-0000-4000-8000-000000000002",
		]);
	});
});

describe("a partner's own store", () => {
	test("is refused, and the claim is marked rejected", async () => {
		/* Acme's sign-up address is alex@acmeagency.com. */
		const claim = await claimFor("acmeagency.myshopify.com", ACME);

		const outcome = await resolve("acmeagency.myshopify.com");

		expect(outcome).toMatchObject({ status: "self_referral" });
		const rows = await harness.db
			.select({ id: merchants.id })
			.from(merchants)
			.where(eq(merchants.shopDomain, "acmeagency.myshopify.com"));
		expect(rows).toEqual([]);
		const rejected = await harness.db.query.referralClaims.findFirst({
			where: eq(referralClaims.id, claim?.id ?? ""),
		});
		expect(rejected?.status).toBe("rejected");
	});

	test("is refused on the website they gave us too", async () => {
		await harness.db
			.update(partners)
			.set({ website: "https://www.brightco-store.com/about" })
			.where(eq(partners.id, BRIGHT));
		await claimFor("brightco-store.myshopify.com", BRIGHT);

		expect((await resolve("brightco-store.myshopify.com")).status).toBe(
			"self_referral"
		);
	});

	test("a mailbox provider address does not make a store theirs", async () => {
		/* A partner who signed up with gmail.com has not thereby claimed every
		   store called "gmail": the name comparison skips mailbox providers. */
		await harness.db
			.update(user)
			.set({ email: "alex@gmail.com" })
			.where(eq(user.id, "u-acme"));
		await claimFor("gmail.myshopify.com", ACME);

		expect((await resolve("gmail.myshopify.com")).status).toBe("attributed");
	});
});

describe("recording a claim", () => {
	test("normalizes whatever the merchant typed", () => {
		expect(normalizeClaimDomain("MyStore")).toBe("mystore.myshopify.com");
		expect(normalizeClaimDomain("https://mystore.myshopify.com/admin")).toBe(
			"mystore.myshopify.com"
		);
		expect(normalizeClaimDomain("www.brand.com")).toBe("brand.com");
		expect(normalizeClaimDomain("   ")).toBeNull();
	});

	test("lasts 30 days", async () => {
		const claim = await claimFor(FRESH, ACME);
		expect(claim?.expiresAt).toEqual(
			new Date(NOW.getTime() + CLAIM_TTL_DAYS * DAY_MS)
		);
	});

	test("submitting twice refreshes one claim instead of making two", async () => {
		const first = await claimFor(FRESH, ACME);
		const again = await createClaim(
			harness.db,
			{
				appSlug: "edge-bundles",
				clickId: null,
				linkId: null,
				partnerId: ACME,
				shopDomain: "  https://FRESH.myshopify.com  ",
			},
			new Date(NOW.getTime() + 60_000)
		);

		expect(again?.id).toBe(first?.id ?? "");
		const rows = await harness.db
			.select({ id: referralClaims.id })
			.from(referralClaims);
		expect(rows).toHaveLength(1);
	});

	test("the newest claim wins when two partners both hold one", async () => {
		await claimFor(FRESH, BRIGHT);
		await createClaim(
			harness.db,
			{
				appSlug: null,
				clickId: null,
				linkId: null,
				partnerId: ACME,
				shopDomain: FRESH,
			},
			new Date(NOW.getTime() + 60_000)
		);

		const live = await liveClaimFor(harness.db, FRESH, NOW);
		expect(live?.partnerId).toBe(ACME);
	});
});

describe("an admin judging a suggestion", () => {
	function suggestion(shopDomain: string, partnerId: string) {
		return suggestClaim(
			harness.db,
			{
				appSlug: "edge-cart",
				clickId: null,
				linkId: null,
				partnerId,
				shopDomain,
			},
			NOW
		);
	}

	test("approving attributes the store, pending approval, earning from today", async () => {
		const suggested = await suggestion(FRESH, ACME);

		const outcome = await approveClaim(harness.db, suggested?.id ?? "", NOW);

		expect(outcome).toMatchObject({
			partner: { name: "Acme Agency" },
			status: "attributed",
		});
		const merchant = await harness.db.query.merchants.findFirst({
			where: eq(merchants.shopDomain, FRESH),
		});
		expect(merchant).toMatchObject({
			partnerId: ACME,
			source: "link",
			status: "pending",
		});
		expect(merchant?.earningsFromAt).toEqual(NOW);
	});

	test("approving never moves a store that already has a partner", async () => {
		const suggested = await suggestion(OWNED, ACME);

		const outcome = await approveClaim(harness.db, suggested?.id ?? "", NOW);

		expect(outcome).toMatchObject({
			partner: { name: "Bright Commerce" },
			status: "existing",
		});
		const owner = await harness.db.query.merchants.findFirst({
			where: eq(merchants.shopDomain, OWNED),
		});
		expect(owner?.partnerId).toBe(BRIGHT);
	});

	test("approving a partner's own store is still refused", async () => {
		const suggested = await suggestion("acmeagency.myshopify.com", ACME);

		expect(
			(await approveClaim(harness.db, suggested?.id ?? "", NOW)).status
		).toBe("self_referral");
	});

	test("a suggestion already handled does nothing the second time", async () => {
		const suggested = await suggestion(FRESH, ACME);
		await approveClaim(harness.db, suggested?.id ?? "", NOW);

		/* The claim converted, so there is nothing left to approve. The store
		   it created is untouched: no second row, no change of partner. */
		expect(
			(await approveClaim(harness.db, suggested?.id ?? "", NOW)).status
		).toBe("none");
		const rows = await harness.db
			.select({ partnerId: merchants.partnerId })
			.from(merchants)
			.where(eq(merchants.shopDomain, FRESH));
		expect(rows).toEqual([{ partnerId: ACME }]);
	});

	test("the queue names the partner and the store", async () => {
		await suggestion(FRESH, ACME);
		const rows = await listSuggestions(harness.db);
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({
			partnerName: "Acme Agency",
			shopDomain: FRESH,
		});
	});

	test("only an admin may see or act on the queue", async () => {
		const partnerCaller = createCaller({
			db: harness.db,
			session: { session: {}, user: { id: "u-acme", role: "partner" } },
		} as unknown as Context);

		await expect(
			partnerCaller.admin.referrals.suggestions.list()
		).rejects.toMatchObject({ code: "FORBIDDEN" });
	});
});
