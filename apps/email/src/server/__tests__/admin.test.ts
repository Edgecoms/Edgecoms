/// <reference types="bun" />
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createCallerFactory } from "@edgecoms/api";
import { createTestDb, type TestDb } from "@edgecoms/api/__tests__/db-harness";
import type { Context } from "@edgecoms/api/context";
import { apps } from "@edgecoms/db/schema/apps";
import {
	mailAppSettings,
	mailContactStores,
	mailContacts,
	mailInstallations,
	mailStores,
} from "@edgecoms/db/schema/mail";
import { listAppsWithSettings } from "../apps/identity";
import { listContacts } from "../queries/contacts";
import { change, overview } from "../queries/dashboard";
import { mailRouter } from "../router";

const createCaller = createCallerFactory(mailRouter);

let testDb: TestDb;
let appId: string;

function callerAs(role: "admin" | "partner" | null) {
	const session =
		role === null
			? null
			: { user: { email: "a@edgecoms.app", name: "A", role } };
	return createCaller({ db: testDb.db, session } as unknown as Context);
}

beforeEach(async () => {
	testDb = await createTestDb();
	const [app] = await testDb.db
		.insert(apps)
		.values({ slug: "edge-cart", name: "Edge Cart", partnerApiGid: "gid://1" })
		.returning();
	appId = app?.id ?? "";
});

afterEach(async () => {
	await testDb.close();
});

const settings = () => ({
	appId,
	senderEmail: "updates@edgecoms.app",
	senderName: "Edge Cart",
});

describe("admin mutations are admin-only", () => {
	test("saving app settings refuses a partner and an anonymous caller", async () => {
		await expect(
			callerAs("partner").apps.saveSettings(settings())
		).rejects.toMatchObject({ code: "FORBIDDEN" });
		await expect(
			callerAs(null).apps.saveSettings(settings())
		).rejects.toMatchObject({ code: "UNAUTHORIZED" });
		expect(await testDb.db.select().from(mailAppSettings)).toHaveLength(0);
	});

	test("opting a contact out refuses a partner", async () => {
		await expect(
			callerAs("partner").contacts.optOut({
				contactId: "0b8e5c2a-1d2f-4c3b-9a8e-7f6d5c4b3a21",
			})
		).rejects.toMatchObject({ code: "FORBIDDEN" });
	});
});

describe("app settings", () => {
	test("save, then save again, updates the one row", async () => {
		await callerAs("admin").apps.saveSettings(settings());
		await callerAs("admin").apps.saveSettings({
			...settings(),
			senderName: "Edge Cart Team",
		});
		const rows = await testDb.db.select().from(mailAppSettings);
		expect(rows).toHaveLength(1);
		expect(rows[0]?.senderName).toBe("Edge Cart Team");
	});

	test("refuse a sender that is not an email address, or has no name", async () => {
		await expect(
			callerAs("admin").apps.saveSettings({
				...settings(),
				senderEmail: "Edge Cart <updates@edgecoms.app>",
			})
		).rejects.toMatchObject({ code: "BAD_REQUEST" });
		await expect(
			callerAs("admin").apps.saveSettings({ ...settings(), senderName: "  " })
		).rejects.toMatchObject({ code: "BAD_REQUEST" });
	});
});

describe("opt out", () => {
	test("switches every category off", async () => {
		const [contact] = await testDb.db
			.insert(mailContacts)
			.values({
				education: true,
				email: "owner@brand.com",
				marketing: true,
				productUpdates: true,
			})
			.returning();
		await callerAs("admin").contacts.optOut({ contactId: contact?.id ?? "" });
		const [row] = await testDb.db.select().from(mailContacts);
		expect(row?.marketing).toBe(false);
		expect(row?.productUpdates).toBe(false);
		expect(row?.education).toBe(false);
	});
});

describe("app list", () => {
	test("shows Edge Mail's apps only, not the rest of the catalog", async () => {
		await testDb.db.insert(apps).values({
			name: "Trackproof",
			partnerApiGid: "gid://7",
			slug: "trackproof",
		});
		const slugs = (await listAppsWithSettings(testDb.db)).map(
			(app) => app.slug
		);
		expect(slugs).toEqual(["edge-cart"]);
	});
});

describe("contact search", () => {
	test("treats % and _ as literal characters", async () => {
		await testDb.db
			.insert(mailContacts)
			.values([{ email: "a_b@brand.com" }, { email: "axb@brand.com" }]);
		const rows = await listContacts(testDb.db, "a_b");
		expect(rows.map((row) => row.email)).toEqual(["a_b@brand.com"]);
	});
});

describe("contact list", () => {
	test("counts each contact's own live apps and store, not a neighbour's", async () => {
		const [store] = await testDb.db
			.insert(mailStores)
			.values({ shopDomain: "brand.myshopify.com" })
			.returning();
		const [owner, other] = await testDb.db
			.insert(mailContacts)
			.values([{ email: "owner@brand.com" }, { email: "other@else.com" }])
			.returning();
		await testDb.db
			.insert(mailContactStores)
			.values({ contactId: owner?.id ?? "", storeId: store?.id ?? "" });
		await testDb.db.insert(mailInstallations).values({
			appId,
			lastActiveAt: new Date("2026-09-20T10:00:00Z"),
			status: "active",
			statusChangedAt: new Date(),
			storeId: store?.id ?? "",
		});

		const rows = await listContacts(testDb.db, "");
		const byEmail = new Map(rows.map((row) => [row.email, row]));
		expect(byEmail.get("owner@brand.com")?.appCount).toBe(1);
		expect(byEmail.get("owner@brand.com")?.shopDomain).toBe(
			"brand.myshopify.com"
		);
		expect(byEmail.get("other@else.com")?.appCount).toBe(0);
		expect(byEmail.get("other@else.com")?.shopDomain).toBeNull();
		expect(await listContacts(testDb.db, "brand.my")).toHaveLength(1);
		expect(other).toBeDefined();
	});
});

describe("dashboard", () => {
	const NOW = new Date("2026-09-24T15:00:00Z");
	const daysAgo = (days: number) => new Date(NOW.getTime() - days * 86_400_000);

	test("counts new contacts per day, against the 30 days before", async () => {
		await testDb.db.insert(mailContacts).values([
			{ createdAt: daysAgo(0), email: "today@a.com" },
			{ createdAt: daysAgo(0), email: "today2@a.com" },
			{ createdAt: daysAgo(29), email: "first-day@a.com" },
			{ createdAt: daysAgo(45), email: "previous@a.com" },
			{ createdAt: daysAgo(90), email: "old@a.com" },
		]);
		const stats = await overview(testDb.db, NOW);
		expect(stats.newContacts).toBe(3);
		expect(stats.previousNewContacts).toBe(1);
		expect(stats.series).toHaveLength(30);
		expect(stats.series.at(-1)).toBe(2);
		expect(stats.series[0]).toBe(1);
		// The line and the headline count the same people.
		expect(stats.series.reduce((sum, n) => sum + n, 0)).toBe(stats.newContacts);
		expect(stats.contacts).toBe(5);
		expect(change(3, 1)).toBe(200);
		expect(change(3, 0)).toBeNull();
	});

	test("reachable means opted in to marketing and not suppressed", async () => {
		await testDb.db.insert(mailContacts).values([
			{ email: "yes@a.com", marketing: true },
			{ email: "bounced@a.com", marketing: true, suppressedAt: NOW },
			{ email: "no@a.com", marketing: false },
		]);
		expect((await overview(testDb.db, NOW)).reachable).toBe(1);
	});

	test("live installs count installed and active, per Edge Mail app", async () => {
		const [store] = await testDb.db
			.insert(mailStores)
			.values({ shopDomain: "brand.myshopify.com" })
			.returning();
		const [other] = await testDb.db
			.insert(mailStores)
			.values({ shopDomain: "other.myshopify.com" })
			.returning();
		await testDb.db.insert(mailInstallations).values([
			{
				appId,
				status: "active",
				statusChangedAt: NOW,
				storeId: store?.id ?? "",
			},
			{
				appId,
				status: "uninstalled",
				statusChangedAt: NOW,
				storeId: other?.id ?? "",
			},
		]);
		const stats = await overview(testDb.db, NOW);
		expect(stats.liveInstalls).toBe(1);
		expect(stats.byApp).toEqual([{ installs: 1, name: "Edge Cart" }]);
	});
});
