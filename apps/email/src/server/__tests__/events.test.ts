/// <reference types="bun" />
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createTestDb, type TestDb } from "@edgecoms/api/__tests__/db-harness";
import { signPayload } from "@edgecoms/api/attribution/hmac";
import { apps } from "@edgecoms/db/schema/apps";
import { merchantEvents } from "@edgecoms/db/schema/attribution";
import {
	mailContacts,
	mailEvents,
	mailInstallations,
	mailStores,
} from "@edgecoms/db/schema/mail";
import { eq } from "drizzle-orm";
import type { ResendSync, SyncEvent } from "../events/ingest";
import { eventsRoute } from "../events/route";

/**
 * POST /api/v1/events against real SQL. Two boundaries live here: WHO may
 * speak (per-app HMAC) and HOW OFTEN an event may count (idempotency).
 */

const CART_SECRET = "c".repeat(32);
const BUNDLES_SECRET = "b".repeat(32);
process.env.EDGE_MAIL_SECRET_EDGE_CART = CART_SECRET;
process.env.EDGE_MAIL_SECRET_EDGE_BUNDLES = BUNDLES_SECRET;

let testDb: TestDb;
let syncCalls: SyncEvent[];
let syncResult: Awaited<ReturnType<ResendSync>>;

const sync: ResendSync = (event) => {
	syncCalls.push(event);
	return Promise.resolve(syncResult);
};

beforeEach(async () => {
	testDb = await createTestDb();
	syncCalls = [];
	syncResult = "synced";
	await testDb.db.insert(apps).values([
		{ slug: "edge-cart", name: "Edge Cart", partnerApiGid: "gid://1" },
		{ slug: "edge-bundles", name: "Edge Bundles", partnerApiGid: "gid://2" },
		{ slug: "edge-timer", name: "Edge Timer", partnerApiGid: "gid://3" },
	]);
});

afterEach(async () => {
	await testDb.close();
});

let counter = 0;

function event(overrides: Record<string, unknown> = {}) {
	counter += 1;
	return {
		eventId: `evt-${counter}`,
		event: "app.installed",
		occurredAt: "2026-09-20T10:00:00Z",
		store: { domain: "Brand.myshopify.com", name: "Brand" },
		contact: { email: "Owner@Brand.com", firstName: "Jo" },
		properties: { plan: "free" },
		...overrides,
	};
}

interface SendOptions {
	appId?: string;
	secret?: string;
	timestamp?: string;
}

function send(body: unknown, options: SendOptions = {}) {
	const appId = options.appId ?? "edge-cart";
	const raw = JSON.stringify(body);
	const timestamp = options.timestamp ?? String(Math.floor(Date.now() / 1000));
	const secret = options.secret ?? CART_SECRET;
	return eventsRoute({ db: testDb.db, sync }).request("/", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			"x-edge-app-id": appId,
			"x-edge-signature": signPayload(secret, timestamp, raw),
			"x-edge-timestamp": timestamp,
		},
		body: raw,
	});
}

async function installation() {
	const rows = await testDb.db.select().from(mailInstallations);
	return rows[0];
}

describe("per-app signature", () => {
	test("accepts an app signing with its own secret", async () => {
		const response = await send(event());
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ ok: true, status: "recorded" });
	});

	test("refuses one app's secret presented as another app", async () => {
		const response = await send(event(), {
			appId: "edge-cart",
			secret: BUNDLES_SECRET,
		});
		expect(response.status).toBe(401);
		expect(await testDb.db.select().from(mailEvents)).toHaveLength(0);
	});

	test("refuses an app with no secret configured, like a bad signature", async () => {
		const response = await send(event(), {
			appId: "edge-timer",
			secret: "t".repeat(32),
		});
		expect(response.status).toBe(401);
		expect(await response.json()).toEqual({ error: "Invalid signature." });
	});

	test("refuses an unknown app id", async () => {
		const response = await send(event(), { appId: "not-an-app" });
		expect(response.status).toBe(401);
	});

	test("refuses a stale timestamp", async () => {
		const stale = String(Math.floor(Date.now() / 1000) - 60 * 60);
		const response = await send(event(), { timestamp: stale });
		expect(response.status).toBe(401);
	});

	test("rejects a body that fails validation, after the signature", async () => {
		const response = await send(event({ event: "app.exploded" }));
		expect(response.status).toBe(400);
	});
});

describe("ingest", () => {
	test("normalizes and records store, contact and installation", async () => {
		await send(event());
		const [store] = await testDb.db.select().from(mailStores);
		const [contact] = await testDb.db.select().from(mailContacts);
		expect(store?.shopDomain).toBe("brand.myshopify.com");
		expect(contact?.email).toBe("owner@brand.com");
		// Installing is never consent to marketing.
		expect(contact?.marketing).toBe(false);
		expect(contact?.productUpdates).toBe(false);
		const install = await installation();
		expect(install?.status).toBe("installed");
		expect(install?.plan).toBe("free");
	});

	test("a redelivered event counts once", async () => {
		const body = event({ event: "app.uninstalled" });
		await send(body);
		const again = await send(body);
		expect(await again.json()).toEqual({ ok: true, status: "duplicate" });
		expect(await testDb.db.select().from(mailEvents)).toHaveLength(1);
		// Synced on the first delivery, so the retry does not re-trigger Resend.
		expect(syncCalls).toHaveLength(1);
	});

	test("a late older event cannot undo a newer uninstall", async () => {
		await send(
			event({ event: "app.uninstalled", occurredAt: "2026-09-21T10:00:00Z" })
		);
		await send(
			event({ event: "app.activated", occurredAt: "2026-09-20T10:00:00Z" })
		);
		expect((await installation())?.status).toBe("uninstalled");
	});

	test("an older plan change still lands after a newer activation", async () => {
		await send(
			event({
				event: "app.activated",
				occurredAt: "2026-09-21T10:00:00Z",
				properties: {},
			})
		);
		await send(
			event({
				event: "plan.changed",
				occurredAt: "2026-09-20T12:00:00Z",
				properties: { plan: "pro" },
			})
		);
		const install = await installation();
		expect(install?.status).toBe("active");
		expect(install?.plan).toBe("pro");
	});

	test("a reinstall clears the uninstall", async () => {
		await send(
			event({ event: "app.uninstalled", occurredAt: "2026-09-20T10:00:00Z" })
		);
		await send(
			event({ event: "app.installed", occurredAt: "2026-09-22T10:00:00Z" })
		);
		const install = await installation();
		expect(install?.status).toBe("installed");
		expect(install?.uninstalledAt).toBeNull();
	});
});

describe("attribution forwarding", () => {
	test("an uninstall lands in merchant_events exactly once", async () => {
		const body = event({ event: "app.uninstalled" });
		// The first delivery forwards, then fails at Resend; the retry forwards
		// AGAIN before finishing the sync, and must not add a second row.
		syncResult = "failed";
		await send(body);
		syncResult = "synced";
		await send(body);
		const rows = await testDb.db.select().from(merchantEvents);
		expect(rows).toHaveLength(1);
		expect(rows[0]?.type).toBe("uninstalled");
		expect(rows[0]?.idempotencyKey).toBe(body.eventId);
	});

	test("plan.started is recorded as subscription.activated with its plan", async () => {
		await send(event({ event: "plan.started", properties: { plan: "pro" } }));
		const [row] = await testDb.db.select().from(merchantEvents);
		expect(row?.type).toBe("subscription.activated");
		expect(row?.planHandle).toBe("pro");
	});

	test("usage events are not forwarded", async () => {
		await send(event({ event: "feature.used" }));
		expect(await testDb.db.select().from(merchantEvents)).toHaveLength(0);
	});
});

describe("resend sync", () => {
	test("a failed sync answers 502 and the retry finishes it", async () => {
		const body = event();
		syncResult = "failed";
		const first = await send(body);
		expect(first.status).toBe(502);

		syncResult = "synced";
		const retry = await send(body);
		expect(retry.status).toBe(200);
		expect(syncCalls).toHaveLength(2);

		const [row] = await testDb.db
			.select()
			.from(mailEvents)
			.where(eq(mailEvents.eventId, body.eventId));
		expect(row?.resendSyncedAt).not.toBeNull();
		// State was applied once, by the first delivery.
		expect(await testDb.db.select().from(mailInstallations)).toHaveLength(1);
	});
});
