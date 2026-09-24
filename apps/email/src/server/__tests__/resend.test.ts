/// <reference types="bun" />
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createHmac } from "node:crypto";
import { createTestDb, type TestDb } from "@edgecoms/api/__tests__/db-harness";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import {
	mailCampaigns,
	mailContactStores,
	mailContacts,
	mailEmailEvents,
	mailInstallations,
	mailStores,
} from "@edgecoms/db/schema/mail";
import { eq } from "drizzle-orm";
import {
	readPreferencesToken,
	signPreferencesToken,
} from "../preferences/token";
import {
	contactProperties,
	createResendSync,
	deliveryAddress,
	lifecycleAutomation,
} from "../resend";
import { resendWebhookRoute } from "../webhooks/route";

/**
 * The Resend boundary: where mail may go (test mode), what fails closed, and
 * the webhook that turns delivery news into suppression. No network: every
 * path under test either stops before Resend or only verifies a signature.
 */

const WEBHOOK_KEY = Buffer.from("k".repeat(32));
const WEBHOOK_SECRET = `whsec_${WEBHOOK_KEY.toString("base64")}`;

let testDb: TestDb;

function setEnv(values: Record<string, string | undefined>) {
	for (const [key, value] of Object.entries(values)) {
		if (value === undefined) {
			Reflect.deleteProperty(process.env, key);
		} else {
			process.env[key] = value;
		}
	}
}

beforeEach(async () => {
	testDb = await createTestDb();
	setEnv({
		EDGE_MAIL_TEST_MODE: undefined,
		EDGE_MAIL_TEST_RECIPIENT: undefined,
		RESEND_API_KEY: undefined,
		RESEND_WEBHOOK_SECRET: undefined,
	});
});

afterEach(async () => {
	await testDb.close();
});

async function seedContact(email = "owner@brand.com") {
	const [app] = await testDb.db
		.insert(apps)
		.values({ slug: "edge-cart", name: "Edge Cart", partnerApiGid: "gid://1" })
		.returning();
	const [store] = await testDb.db
		.insert(mailStores)
		.values({ shopDomain: "brand.myshopify.com" })
		.returning();
	const [contact] = await testDb.db
		.insert(mailContacts)
		.values({ email, marketing: true })
		.returning();
	if (!(app && store && contact)) {
		throw new Error("seed failed");
	}
	await testDb.db
		.insert(mailContactStores)
		.values({ contactId: contact.id, storeId: store.id });
	return { app, contact, store };
}

describe("test mode", () => {
	test("is ON by default and diverts to the test inbox", () => {
		setEnv({ EDGE_MAIL_TEST_RECIPIENT: "team@edgecoms.com" });
		expect(deliveryAddress("merchant@brand.com")).toBe("team@edgecoms.com");
	});

	test("with no test inbox, nothing is addressed at all", () => {
		expect(deliveryAddress("merchant@brand.com")).toBeNull();
	});

	test("only the literal 'off' reaches real merchants", () => {
		setEnv({ EDGE_MAIL_TEST_MODE: "false" });
		expect(deliveryAddress("merchant@brand.com")).toBeNull();
		setEnv({ EDGE_MAIL_TEST_MODE: "off" });
		expect(deliveryAddress("merchant@brand.com")).toBe("merchant@brand.com");
	});
});

describe("event sync", () => {
	const base = {
		appSlug: "edge-cart",
		eventId: "e1",
		occurredAt: new Date(),
		properties: {},
		shopDomain: "brand.myshopify.com",
		storeId: "unused",
		type: "app.installed" as const,
	};

	test("skips in test mode with no inbox, so nothing is replayed later", async () => {
		const { contact } = await seedContact();
		const sync = createResendSync(testDb.db);
		expect(await sync({ ...base, contactId: contact.id })).toBe("skipped");
	});

	test("FAILS live with no API key, so the app retries instead of losing it", async () => {
		const { contact } = await seedContact();
		setEnv({ EDGE_MAIL_TEST_MODE: "off" });
		const sync = createResendSync(testDb.db);
		expect(await sync({ ...base, contactId: contact.id })).toBe("failed");
	});

	test("skips an event with no person", async () => {
		const sync = createResendSync(testDb.db);
		expect(await sync({ ...base, contactId: null })).toBe("skipped");
	});
});

describe("contact properties", () => {
	test("report status and plan per app, and count live apps", async () => {
		const { app, contact, store } = await seedContact();
		const [bundles] = await testDb.db
			.insert(apps)
			.values({
				slug: "edge-bundles",
				name: "Edge Bundles",
				partnerApiGid: "gid://2",
			})
			.returning();
		await testDb.db.insert(mailInstallations).values([
			{
				appId: app.id,
				plan: "pro",
				status: "active",
				statusChangedAt: new Date(),
				storeId: store.id,
			},
			{
				appId: bundles?.id ?? "",
				status: "uninstalled",
				statusChangedAt: new Date(),
				storeId: store.id,
			},
		]);
		expect(await contactProperties(testDb.db, contact.id)).toEqual({
			edge_app_count: 1,
			edge_bundles_status: "uninstalled",
			edge_cart_plan: "pro",
			edge_cart_status: "active",
			shop_domain: "brand.myshopify.com",
		});
	});
});

describe("preferences token", () => {
	const secret = "p".repeat(32);
	const id = "0b8e5c2a-1d2f-4c3b-9a8e-7f6d5c4b3a21";
	const other = "1c9f6d3b-2e3a-4d4c-8b9f-8a7e6d5c4b32";

	test("round-trips", () => {
		const token = signPreferencesToken(id, secret);
		expect(token && readPreferencesToken(token, secret)).toBe(id);
	});

	test("refuses one contact's signature on another contact's id", () => {
		const token = signPreferencesToken(id, secret) ?? "";
		const forged = `${other}.${token.split(".")[1]}`;
		expect(readPreferencesToken(forged, secret)).toBeNull();
	});

	test("refuses a token signed with another secret, and any token with no secret", () => {
		const token = signPreferencesToken(id, "x".repeat(32)) ?? "";
		expect(readPreferencesToken(token, secret)).toBeNull();
		expect(readPreferencesToken(token, undefined)).toBeNull();
		expect(signPreferencesToken(id, undefined)).toBeNull();
	});
});

describe("resend webhook", () => {
	let counter = 0;

	function signed(body: unknown, secret = WEBHOOK_KEY) {
		counter += 1;
		const id = `msg_${counter}`;
		const timestamp = String(Math.floor(Date.now() / 1000));
		const raw = JSON.stringify(body);
		const signature = createHmac("sha256", secret)
			.update(`${id}.${timestamp}.${raw}`)
			.digest("base64");
		return {
			body: raw,
			headers: {
				"svix-id": id,
				"svix-signature": `v1,${signature}`,
				"svix-timestamp": timestamp,
			},
			id,
		};
	}

	function post(request: { body: string; headers: Record<string, string> }) {
		return resendWebhookRoute({ db: testDb.db }).request("/", {
			method: "POST",
			...request,
		});
	}

	function configure() {
		setEnv({
			RESEND_API_KEY: "re_test",
			RESEND_WEBHOOK_SECRET: WEBHOOK_SECRET,
		});
	}

	const complaint = (email: string) => ({
		type: "email.complained",
		created_at: "2026-09-23T10:00:00.000Z",
		data: { email_id: "em_1", to: [email], subject: "Hi" },
	});

	test("is 503 while unconfigured", async () => {
		const response = await post(signed(complaint("owner@brand.com")));
		expect(response.status).toBe(503);
	});

	test("is 503, not 401, with a secret but no API key to verify it", async () => {
		setEnv({ RESEND_WEBHOOK_SECRET: WEBHOOK_SECRET });
		const response = await post(signed(complaint("owner@brand.com")));
		expect(response.status).toBe(503);
	});

	test("refuses a bad signature", async () => {
		configure();
		const response = await post(
			signed(complaint("owner@brand.com"), Buffer.from("z".repeat(32)))
		);
		expect(response.status).toBe(401);
		expect(await testDb.db.select().from(mailEmailEvents)).toHaveLength(0);
	});

	test("a complaint suppresses the contact, once", async () => {
		configure();
		const { contact } = await seedContact();
		const request = signed(complaint("Owner@Brand.com"));
		expect((await post(request)).status).toBe(200);
		const again = await post(request);
		expect(await again.json()).toEqual({ ok: true, status: "duplicate" });

		const [row] = await testDb.db
			.select()
			.from(mailContacts)
			.where(eq(mailContacts.id, contact.id));
		expect(row?.suppressedAt).not.toBeNull();
		expect(row?.suppressionReason).toBe("complained");
		expect(await testDb.db.select().from(mailEmailEvents)).toHaveLength(1);
	});

	test("an unsubscribe on Resend's page opts out of everything", async () => {
		configure();
		const { contact } = await seedContact();
		await post(
			signed({
				type: "contact.updated",
				created_at: "2026-09-23T10:00:00.000Z",
				data: { email: "owner@brand.com", unsubscribed: true },
			})
		);
		const [row] = await testDb.db
			.select()
			.from(mailContacts)
			.where(eq(mailContacts.id, contact.id));
		expect(row?.marketing).toBe(false);
		expect(row?.productUpdates).toBe(false);
	});

	test("a broadcast's delivery is attributed to its campaign and app", async () => {
		configure();
		const { app, contact } = await seedContact();
		await testDb.db.insert(user).values({
			id: "u1",
			email: "admin@edgecoms.app",
			emailVerified: true,
			name: "Admin",
		});
		const [campaign] = await testDb.db
			.insert(mailCampaigns)
			.values({
				appId: app.id,
				audience: {},
				category: "product_updates",
				createdBy: "u1",
				html: "<p>Launch</p>",
				name: "Launch",
				preheader: "p",
				resendBroadcastId: "bc_1",
				subject: "s",
				type: "product_update",
			})
			.returning();
		await post(
			signed({
				type: "email.opened",
				created_at: "2026-09-23T10:00:00.000Z",
				data: { broadcast_id: "bc_1", email_id: "em_2", to: [contact.email] },
			})
		);
		const [row] = await testDb.db.select().from(mailEmailEvents);
		expect(row?.campaignId).toBe(campaign?.id ?? "");
		expect(row?.appId).toBe(app.id);
		expect(row?.contactId).toBe(contact.id);
	});
});

describe("lifecycle automations", () => {
	const FROM = "Edge Cart <updates@edgecoms.app>";
	const onlyCart = {
		field: "event.app_slug",
		operator: "eq",
		type: "rule",
		value: "edge-cart",
	} as const;

	test("welcome sends straight after the app filter, with the variables mapped", () => {
		const { connections, steps } = lifecycleAutomation(
			"edge-cart",
			"welcome",
			FROM
		);
		expect(steps.map((step) => step.config)).toEqual([
			{ eventName: "app.installed" },
			onlyCart,
			{
				from: FROM,
				template: {
					id: "edge-cart-welcome",
					variables: {
						GREETING_NAME: { var: "event.first_name" },
						PREFERENCES_URL: { var: "event.preferences_url" },
					},
				},
			},
		]);
		// Another app's install ends at the filter: there is no not-met path.
		expect(connections).toEqual([
			{ from: "start", to: "this_app" },
			{ from: "this_app", to: "send", type: "condition_met" },
		]);
	});

	test("the setup reminder sends only if the same app never reports setup", () => {
		const { connections, steps } = lifecycleAutomation(
			"edge-cart",
			"setup-reminder",
			FROM
		);
		expect(steps.find((step) => step.key === "wait")?.config).toEqual({
			eventName: "setup.completed",
			filterRule: onlyCart,
			timeout: "24 hours",
		});
		expect(connections).toContainEqual({
			from: "wait",
			to: "send",
			type: "timeout",
		});
		expect(connections.some((c) => c.type === "event_received")).toBe(false);
	});
});
