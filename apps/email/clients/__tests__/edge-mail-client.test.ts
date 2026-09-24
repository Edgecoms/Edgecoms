/// <reference types="bun" />
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createTestDb, type TestDb } from "@edgecoms/api/__tests__/db-harness";
import { apps } from "@edgecoms/db/schema/apps";
import { mailEvents } from "@edgecoms/db/schema/mail";
import type { ResendSync } from "../../src/server/events/ingest";
import { eventsRoute } from "../../src/server/events/route";
import { EdgeMail } from "../edge-mail-client";

/**
 * The file the Shopify apps copy, against the real endpoint: if the client
 * and the server ever disagree on signing, this fails here and not in an app.
 */

const SECRET = "c".repeat(32);
process.env.EDGE_MAIL_SECRET_EDGE_CART = SECRET;

let testDb: TestDb;
let syncResults: Awaited<ReturnType<ResendSync>>[];
let requests: number;

function client(secret = SECRET) {
	const sync: ResendSync = () =>
		Promise.resolve(syncResults.shift() ?? "synced");
	const route = eventsRoute({ db: testDb.db, sync });
	return new EdgeMail({
		appId: "edge-cart",
		endpoint: "https://email.edgecoms.app",
		fetch: (url, init) => {
			requests += 1;
			return Promise.resolve(
				route.request(
					new URL(String(url)).pathname.replace("/api/v1/events", "/"),
					init
				)
			);
		},
		secret,
	});
}

beforeEach(async () => {
	testDb = await createTestDb();
	syncResults = [];
	requests = 0;
	await testDb.db
		.insert(apps)
		.values({ slug: "edge-cart", name: "Edge Cart", partnerApiGid: "gid://1" });
});

afterEach(async () => {
	await testDb.close();
});

const install = {
	contact: { email: "owner@brand.com" },
	event: "app.installed" as const,
	eventId: "installed:1",
	properties: { plan: "free" },
	store: { domain: "brand.myshopify.com" },
};

describe("edge mail client", () => {
	test("signs requests the endpoint accepts, and a resend is a duplicate", async () => {
		expect(await client().track(install)).toEqual({
			ok: true,
			status: "recorded",
		});
		expect(await client().track(install)).toEqual({
			ok: true,
			status: "duplicate",
		});
		expect(await testDb.db.select().from(mailEvents)).toHaveLength(1);
	});

	test("a wrong secret is refused once, not retried", async () => {
		const result = await client("x".repeat(32)).track(install);
		expect(result).toMatchObject({ httpStatus: 401, ok: false });
		expect(requests).toBe(1);
	});

	test("a 502 is retried with the same event id until it lands", async () => {
		syncResults = ["failed"];
		expect(await client().track(install)).toEqual({
			ok: true,
			status: "duplicate",
		});
		expect(requests).toBe(2);
		expect(await testDb.db.select().from(mailEvents)).toHaveLength(1);
	});
});
