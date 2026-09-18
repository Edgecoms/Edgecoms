import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { partnerCodes, partners } from "@edgecoms/db/schema/partners";
import { referralClicks } from "@edgecoms/db/schema/referrals";
import { eq } from "drizzle-orm";
import type { Context } from "../context";
import { createCallerFactory } from "../index";
import {
	CLICKS_PER_IP_PER_HOUR,
	type ClickInput,
	classifyUserAgent,
	hashIp,
	recordClick,
} from "../referrals/clicks";
import {
	normalizeSlug,
	normalizeSubId,
	resolveReferral,
} from "../referrals/links";
import { createLink, setLinkActive } from "../referrals/manage";
import { appRouter } from "../routers/index";
import { createTestDb, type TestDb } from "./db-harness";

/**
 * Referral links and click tracking.
 *
 * The rules under test are the ones that decide whether a number on a
 * partner's dashboard is true: a click resolves to exactly one partner, a
 * visitor counts once a day, a crawler never counts, a flood is dropped, and
 * no raw IP address is ever written.
 */

const createCaller = createCallerFactory(appRouter);

const APPROVED = "aaaaaaaa-0000-4000-8000-000000000001";
const SUSPENDED = "aaaaaaaa-0000-4000-8000-000000000002";
const OTHER = "aaaaaaaa-0000-4000-8000-000000000003";
const SALT = "a-salt-of-at-least-16-chars";
const IP = "203.0.113.9";
const CHROME =
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";
const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-09-18T12:00:00Z");

let harness: TestDb;

const adminCaller = () =>
	createCaller({
		db: harness.db,
		session: { session: {}, user: { id: "u-admin", role: "admin" } },
	} as unknown as Context);

const partnerCaller = (userId: string) =>
	createCaller({
		db: harness.db,
		session: { session: {}, user: { id: userId, role: "partner" } },
	} as unknown as Context);

async function seed() {
	const { db } = harness;
	await db.insert(user).values([
		{ email: "admin@x.com", id: "u-admin", name: "Admin", role: "admin" },
		{ email: "alex@acme.com", id: "u-one", name: "Alex", role: "partner" },
		{ email: "sam@bright.co", id: "u-two", name: "Sam", role: "partner" },
		{ email: "kim@third.co", id: "u-three", name: "Kim", role: "partner" },
	]);
	await db.insert(partners).values([
		{
			companyName: "Acme Agency",
			defaultRateBps: 2000,
			id: APPROVED,
			status: "approved",
			userId: "u-one",
		},
		{
			defaultRateBps: 2000,
			id: SUSPENDED,
			status: "suspended",
			userId: "u-two",
		},
		{ defaultRateBps: 1000, id: OTHER, status: "approved", userId: "u-three" },
	]);
	await db.insert(partnerCodes).values([
		{ code: "ACMEAGENCY", partnerId: APPROVED },
		{ code: "SUSPENDEDCO", partnerId: SUSPENDED },
		{ code: "THIRDCO", partnerId: OTHER },
	]);
	await db.insert(apps).values({
		id: "dddddddd-0000-4000-8000-000000000001",
		name: "Edge Cart",
		partnerApiGid: "gid://cart",
		slug: "edge-cart",
	});
}

beforeEach(async () => {
	harness = await createTestDb();
	await seed();
});

afterEach(async () => {
	await harness.close();
});

function clickOn(
	overrides: Partial<ClickInput> & { partnerId: string }
): ClickInput {
	return {
		appSlug: null,
		country: "IN",
		deviceType: "desktop",
		ipHash: hashIp(IP, SALT),
		isBot: false,
		linkId: null,
		referrer: null,
		subId: null,
		userAgent: CHROME,
		utmCampaign: null,
		utmContent: null,
		utmMedium: null,
		utmSource: null,
		utmTerm: null,
		...overrides,
	};
}

describe("resolving a referral address", () => {
	test("a partner's bare code needs no link row", async () => {
		const resolved = await resolveReferral(harness.db, {
			appSlug: null,
			ref: "acmeagency",
			subId: null,
		});
		expect(resolved).toMatchObject({
			appSlug: null,
			code: "ACMEAGENCY",
			link: null,
			partnerId: APPROVED,
			partnerName: "Acme Agency",
		});
	});

	test("a channel with no link of its own still credits the partner", async () => {
		const resolved = await resolveReferral(harness.db, {
			appSlug: null,
			ref: "ACMEAGENCY",
			subId: normalizeSubId("IG Reel 12"),
		});
		expect(resolved?.link).toBeNull();
		expect(resolved?.subId).toBe("ig-reel-12");
	});

	test("a channel that has a link resolves to it", async () => {
		const link = await createLink(harness.db, {
			partnerId: APPROVED,
			subId: "youtube",
		});
		const resolved = await resolveReferral(harness.db, {
			appSlug: null,
			ref: "ACMEAGENCY",
			subId: "youtube",
		});
		expect(resolved?.link?.id).toBe(link.id);
	});

	test("a custom address resolves to the link and its partner's code", async () => {
		const link = await createLink(harness.db, {
			appSlug: "edge-cart",
			partnerId: APPROVED,
			slug: "acme-cart",
		});
		const resolved = await resolveReferral(harness.db, {
			appSlug: null,
			ref: "acme-cart",
			subId: null,
		});
		expect(resolved).toMatchObject({
			appSlug: "edge-cart",
			code: "ACMEAGENCY",
			partnerId: APPROVED,
		});
		expect(resolved?.link?.id).toBe(link.id);
	});

	test("an app named in the path wins over the link's own app", async () => {
		await createLink(harness.db, { partnerId: APPROVED, slug: "acme-all" });
		const resolved = await resolveReferral(harness.db, {
			appSlug: "edge-cart",
			ref: "acme-all",
			subId: null,
		});
		expect(resolved?.appSlug).toBe("edge-cart");
	});

	test("a disabled link resolves to nothing", async () => {
		const link = await createLink(harness.db, {
			partnerId: APPROVED,
			slug: "acme-off",
		});
		await setLinkActive(harness.db, link.id, false);
		expect(
			await resolveReferral(harness.db, {
				appSlug: null,
				ref: "acme-off",
				subId: null,
			})
		).toBeNull();
	});

	test("a partner who cannot acquire stores has no working link", async () => {
		/* Same rule as the code path: a suspended partner binds nothing, so
		   their link must not collect clicks against a promise. */
		expect(
			await resolveReferral(harness.db, {
				appSlug: null,
				ref: "SUSPENDEDCO",
				subId: null,
			})
		).toBeNull();
	});

	test("an unknown address resolves to nothing", async () => {
		for (const ref of ["nobody", "", "../admin", "ACME AGENCY X"]) {
			expect(
				await resolveReferral(harness.db, { appSlug: null, ref, subId: null })
			).toBeNull();
		}
	});
});

describe("what a click records", () => {
	test("the first visit counts, the same visitor again today does not", async () => {
		const first = await recordClick(
			harness.db,
			clickOn({ partnerId: APPROVED }),
			NOW
		);
		expect(first.isUnique).toBe(true);

		const again = await recordClick(
			harness.db,
			clickOn({ partnerId: APPROVED }),
			new Date(NOW.getTime() + 60_000)
		);
		expect(again.isUnique).toBe(false);
		expect(again.clickId).not.toBeNull();
	});

	test("the same visitor counts again after a day", async () => {
		await recordClick(harness.db, clickOn({ partnerId: APPROVED }), NOW);
		const later = await recordClick(
			harness.db,
			clickOn({ partnerId: APPROVED }),
			new Date(NOW.getTime() + DAY_MS + 1000)
		);
		expect(later.isUnique).toBe(true);
	});

	test("two different links dedupe separately", async () => {
		const link = await createLink(harness.db, {
			partnerId: APPROVED,
			subId: "youtube",
		});
		await recordClick(harness.db, clickOn({ partnerId: APPROVED }), NOW);
		const onLink = await recordClick(
			harness.db,
			clickOn({ linkId: link.id, partnerId: APPROVED, subId: "youtube" }),
			NOW
		);
		expect(onLink.isUnique).toBe(true);
	});

	test("a crawler is kept but never counted", async () => {
		const outcome = await recordClick(
			harness.db,
			clickOn({ isBot: true, partnerId: APPROVED }),
			NOW
		);
		expect(outcome.clickId).not.toBeNull();
		expect(outcome.isUnique).toBe(false);
	});

	test("a flood from one address is dropped, not recorded", async () => {
		for (let i = 0; i < CLICKS_PER_IP_PER_HOUR; i++) {
			await recordClick(harness.db, clickOn({ partnerId: APPROVED }), NOW);
		}
		const blocked = await recordClick(
			harness.db,
			clickOn({ partnerId: APPROVED }),
			NOW
		);
		expect(blocked).toEqual({
			clickId: null,
			isUnique: false,
			rateLimited: true,
		});

		const rows = await harness.db
			.select({ id: referralClicks.id })
			.from(referralClicks);
		expect(rows).toHaveLength(CLICKS_PER_IP_PER_HOUR);
	});

	test("the row carries the channel, country and referrer, and no raw address", async () => {
		await recordClick(
			harness.db,
			clickOn({
				appSlug: "edge-cart",
				country: "in",
				partnerId: APPROVED,
				referrer: "https://youtube.com/watch?v=1",
				subId: "youtube",
				utmSource: "newsletter",
			}),
			NOW
		);
		const row = await harness.db.query.referralClicks.findFirst({
			where: eq(referralClicks.partnerId, APPROVED),
		});
		expect(row).toMatchObject({
			appSlug: "edge-cart",
			country: "IN",
			isBot: false,
			isUnique: true,
			referrer: "https://youtube.com/watch?v=1",
			subId: "youtube",
			utmSource: "newsletter",
		});
		expect(row?.ipHash).not.toContain(IP);
		expect(row?.ipHash).toHaveLength(32);
	});

	test("with no address there is no hash, and no unique count", async () => {
		const outcome = await recordClick(
			harness.db,
			clickOn({ ipHash: null, partnerId: APPROVED }),
			NOW
		);
		expect(outcome.isUnique).toBe(false);
		expect(outcome.clickId).not.toBeNull();
	});
});

describe("hashing an address", () => {
	test("is stable, salted, and never the address itself", () => {
		const hash = hashIp(IP, SALT);
		expect(hash).toBe(hashIp(IP, SALT));
		expect(hash).not.toContain(IP);
		expect(hash).not.toBe(hashIp(IP, "a-different-salt-16chars"));
		expect(hash).not.toBe(hashIp("203.0.113.10", SALT));
	});

	test("without a salt nothing is stored, rather than a guessable hash", () => {
		expect(hashIp(IP, null)).toBeNull();
		expect(hashIp(IP, "")).toBeNull();
		expect(hashIp(null, SALT)).toBeNull();
		expect(hashIp("  ", SALT)).toBeNull();
	});
});

describe("reading a user agent", () => {
	test("tells a phone from a tablet from a desktop", () => {
		expect(
			classifyUserAgent(
				"Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1"
			)
		).toEqual({ deviceType: "mobile", isBot: false });
		expect(
			classifyUserAgent("Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)")
		).toEqual({ deviceType: "tablet", isBot: false });
		expect(classifyUserAgent(CHROME)).toEqual({
			deviceType: "desktop",
			isBot: false,
		});
	});

	test("flags crawlers, previewers and scripts", () => {
		for (const agent of [
			"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
			"facebookexternalhit/1.1",
			"curl/8.4.0",
			"python-requests/2.32",
			"Slackbot-LinkExpanding 1.0",
			"GPTBot/1.0",
			"",
			null,
		]) {
			expect(classifyUserAgent(agent).isBot).toBe(true);
		}
	});
});

describe("creating links", () => {
	test("an address is derived from the code and the channel", async () => {
		const link = await createLink(harness.db, {
			partnerId: APPROVED,
			subId: "YouTube",
		});
		expect(link.slug).toBe("acmeagency-youtube");
		expect(link.subId).toBe("youtube");
	});

	test("the same app and channel cannot be created twice", async () => {
		await createLink(harness.db, { appSlug: "edge-cart", partnerId: APPROVED });
		await expect(
			createLink(harness.db, { appSlug: "edge-cart", partnerId: APPROVED })
		).rejects.toMatchObject({ code: "CONFLICT" });
	});

	test("an address the site owns is refused", async () => {
		await expect(
			createLink(harness.db, { partnerId: APPROVED, slug: "admin" })
		).rejects.toMatchObject({ code: "BAD_REQUEST" });
	});

	test("a taken address is refused", async () => {
		await createLink(harness.db, { partnerId: APPROVED, slug: "shared-name" });
		await expect(
			createLink(harness.db, { partnerId: OTHER, slug: "shared-name" })
		).rejects.toMatchObject({ code: "CONFLICT" });
	});

	test("an app that does not exist is refused", async () => {
		await expect(
			createLink(harness.db, { appSlug: "edge-nothing", partnerId: APPROVED })
		).rejects.toMatchObject({ code: "BAD_REQUEST" });
	});

	test("a partner with no active code gets no link", async () => {
		await harness.db
			.update(partnerCodes)
			.set({ status: "disabled" })
			.where(eq(partnerCodes.partnerId, APPROVED));
		await expect(
			createLink(harness.db, { partnerId: APPROVED, subId: "x" })
		).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
	});
});

describe("who may manage a link", () => {
	test("a partner creates and lists only their own", async () => {
		await partnerCaller("u-one").partner.links.create({ subId: "discord" });
		const mine = await partnerCaller("u-one").partner.links.list();
		const theirs = await partnerCaller("u-three").partner.links.list();

		expect(mine.code).toBe("ACMEAGENCY");
		expect(mine.links.map((row) => row.subId)).toEqual(["discord"]);
		expect(theirs.links).toEqual([]);
	});

	test("a partner cannot disable somebody else's link", async () => {
		const link = await createLink(harness.db, {
			partnerId: APPROVED,
			subId: "youtube",
		});
		await expect(
			partnerCaller("u-three").partner.links.setActive({
				isActive: false,
				linkId: link.id,
			})
		).rejects.toMatchObject({ code: "NOT_FOUND" });
	});

	test("an admin manages any partner's links, and may set the address", async () => {
		const created = await adminCaller().admin.referrals.links.create({
			partnerId: APPROVED,
			slug: "acme-newsletter",
			subId: "newsletter",
		});
		expect(created.slug).toBe("acme-newsletter");

		const renamed = await adminCaller().admin.referrals.links.setSlug({
			linkId: created.id,
			slug: "Acme Emails",
		});
		expect(renamed.slug).toBe("acme-emails");

		await adminCaller().admin.referrals.links.setActive({
			isActive: false,
			linkId: created.id,
		});
		const listed = await adminCaller().admin.referrals.links.list({
			partnerId: APPROVED,
		});
		expect(listed.links[0]?.isActive).toBe(false);
	});

	test("a partner cannot reach the admin link router", async () => {
		await expect(
			partnerCaller("u-one").admin.referrals.links.list({ partnerId: OTHER })
		).rejects.toMatchObject({ code: "FORBIDDEN" });
	});
});

describe("normalizing what a partner types", () => {
	test("slugs and channels become one predictable form", () => {
		expect(normalizeSlug("  Acme Agency!!  ")).toBe("acme-agency");
		expect(normalizeSlug("--acme--cart--")).toBe("acme-cart");
		expect(normalizeSubId("IG Reel #12")).toBe("ig-reel-12");
		expect(normalizeSubId("   ")).toBeNull();
	});
});
