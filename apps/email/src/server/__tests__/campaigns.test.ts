/// <reference types="bun" />
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createCallerFactory, router } from "@edgecoms/api";
import { createTestDb, type TestDb } from "@edgecoms/api/__tests__/db-harness";
import type { Context } from "@edgecoms/api/context";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import {
	type MailAudience,
	mailAppSettings,
	mailCampaignRecipients,
	mailCampaigns,
	mailContactStores,
	mailContacts,
	mailInstallations,
	mailStores,
} from "@edgecoms/db/schema/mail";
import { eq } from "drizzle-orm";
import { type Category, resolveRecipients } from "../campaigns/audience";
import {
	advanceSend,
	type CampaignGateway,
	cancelCampaign,
	startSend,
} from "../campaigns/send";
import type { ImportState } from "../resend";
import { CATEGORY_FOR_TYPE, createCampaignsRouter } from "../routers/campaigns";

/**
 * Campaigns: who receives one, and that one click can never send twice.
 * Resend is a stub that counts calls, so every rail is checked without a
 * network.
 */

const NOW = new Date("2026-09-23T12:00:00Z");
const DAY = 86_400_000;

let testDb: TestDb;
let cartId: string;

function stub(options: { testInbox?: string | null } = {}) {
	const calls = {
		cancel: 0,
		createBroadcast: 0,
		createSegment: 0,
		imported: [] as string[][],
		optIn: [] as (string | null)[],
		sent: [] as (Date | null)[],
	};
	let state: ImportState = "pending";
	let failSegment = false;
	const inbox = options.testInbox;
	const gateway: CampaignGateway = {
		cancelBroadcast: () => {
			calls.cancel += 1;
			return Promise.resolve();
		},
		createBroadcast: async () => {
			calls.createBroadcast += 1;
			// Yield, so two concurrent advances genuinely interleave.
			await new Promise((resolve) => setTimeout(resolve, 5));
			return `bc_${calls.createBroadcast}`;
		},
		createSegment: () => {
			calls.createSegment += 1;
			return failSegment
				? Promise.reject(new Error("Resend is down"))
				: Promise.resolve("seg_1");
		},
		deliveryAddress: (email) => (inbox === undefined ? email : inbox),
		importContacts: ({ emails, optInTopicId }) => {
			calls.imported.push(emails);
			calls.optIn.push(optInTopicId);
			return Promise.resolve("imp_1");
		},
		importState: () => Promise.resolve(state),
		sendBroadcast: (_id, scheduledAt) => {
			calls.sent.push(scheduledAt);
			return Promise.resolve();
		},
		testMode: () => inbox !== undefined,
		topicId: () => Promise.resolve("topic_1"),
	};
	return {
		calls,
		failSegment: () => {
			failSegment = true;
		},
		gateway,
		setImport: (next: ImportState) => {
			state = next;
		},
	};
}

async function person(input: {
	apps: {
		appId: string;
		plan?: string;
		status: "installed" | "active" | "uninstalled";
		uninstalledAt?: Date;
	}[];
	email: string;
	marketing?: boolean;
	productUpdates?: boolean;
	stores?: number;
	suppressed?: boolean;
}) {
	const [contact] = await testDb.db
		.insert(mailContacts)
		.values({
			email: input.email,
			marketing: input.marketing ?? false,
			productUpdates: input.productUpdates ?? false,
			suppressedAt: input.suppressed ? NOW : null,
		})
		.returning();
	for (let index = 0; index < (input.stores ?? 1); index += 1) {
		const [store] = await testDb.db
			.insert(mailStores)
			.values({
				shopDomain: `${input.email.split("@")[0]}-${index}.myshopify.com`,
			})
			.returning();
		await testDb.db
			.insert(mailContactStores)
			.values({ contactId: contact?.id ?? "", storeId: store?.id ?? "" });
		for (const install of input.apps) {
			await testDb.db.insert(mailInstallations).values({
				appId: install.appId,
				plan: install.plan ?? "free",
				status: install.status,
				statusChangedAt: NOW,
				storeId: store?.id ?? "",
				uninstalledAt: install.uninstalledAt ?? null,
			});
		}
	}
	return contact;
}

let bundlesId: string;

beforeEach(async () => {
	testDb = await createTestDb();
	const [cart, bundles] = await testDb.db
		.insert(apps)
		.values([
			{ slug: "edge-cart", name: "Edge Cart", partnerApiGid: "gid://1" },
			{ slug: "edge-bundles", name: "Edge Bundles", partnerApiGid: "gid://2" },
		])
		.returning();
	cartId = cart?.id ?? "";
	bundlesId = bundles?.id ?? "";
	await testDb.db.insert(user).values({
		email: "admin@edgecoms.app",
		emailVerified: true,
		id: "admin-1",
		name: "Admin",
	});
	await testDb.db.insert(mailAppSettings).values({
		appId: cartId,
		senderEmail: "updates@edgecoms.app",
		senderName: "Edge Cart",
	});

	const cartActive = { appId: cartId, status: "active" as const };
	await person({
		apps: [cartActive],
		email: "a@a.com",
		marketing: true,
		productUpdates: true,
	});
	await person({
		apps: [{ appId: cartId, plan: "pro", status: "installed" }],
		email: "b@b.com",
		productUpdates: true,
	});
	await person({
		apps: [cartActive],
		email: "c@c.com",
		marketing: true,
		suppressed: true,
	});
	await person({
		apps: [cartActive, { appId: bundlesId, status: "active" }],
		email: "d@d.com",
		marketing: true,
	});
	await person({
		apps: [cartActive],
		email: "e@e.com",
		marketing: true,
		stores: 2,
	});
	await person({
		apps: [
			{
				appId: cartId,
				status: "uninstalled",
				uninstalledAt: new Date(NOW.getTime() - 5 * DAY),
			},
		],
		email: "f@f.com",
		marketing: true,
	});
	await person({
		apps: [
			{
				appId: cartId,
				status: "uninstalled",
				uninstalledAt: new Date(NOW.getTime() - 30 * DAY),
			},
		],
		email: "g@g.com",
		marketing: true,
	});
});

afterEach(async () => {
	await testDb.close();
});

async function emails(category: Category, audience: MailAudience) {
	const rows = await resolveRecipients(testDb.db, {
		appId: cartId,
		audience,
		category,
		now: NOW,
	});
	return rows.map((row) => row.email);
}

describe("audience", () => {
	test("only opted-in, unsuppressed, current installs, each person once", async () => {
		expect(await emails("marketing", {})).toEqual([
			"a@a.com",
			"d@d.com",
			"e@e.com",
		]);
	});

	test("cross-sell leaves out stores that already run the other app", async () => {
		expect(
			await emails("marketing", { notInstalledAppSlugs: ["edge-bundles"] })
		).toEqual(["a@a.com", "e@e.com"]);
	});

	test("plan filter, in the category they opted into", async () => {
		expect(await emails("product_updates", { plans: ["pro"] })).toEqual([
			"b@b.com",
		]);
	});

	test("winback reaches recent uninstalls only", async () => {
		expect(await emails("marketing", { uninstalledWithinDays: 14 })).toEqual([
			"f@f.com",
		]);
	});

	test("the category follows from the type: a discount is marketing", () => {
		expect(CATEGORY_FOR_TYPE.discount).toBe("marketing");
		expect(CATEGORY_FOR_TYPE.cross_sell).toBe("marketing");
		expect(CATEGORY_FOR_TYPE.product_update).toBe("product_updates");
	});
});

const EMAIL_HTML =
	'<!doctype html><html><body><p>Save 30%</p><a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a></body></html>';

async function draft(
	overrides: Partial<typeof mailCampaigns.$inferInsert> = {}
) {
	const [row] = await testDb.db
		.insert(mailCampaigns)
		.values({
			appId: cartId,
			audience: {},
			category: "marketing",
			createdBy: "admin-1",
			html: EMAIL_HTML,
			name: "September offer",
			preheader: "p",
			subject: "Save 30% on Edge Cart",
			type: "discount",
			...overrides,
		})
		.returning();
	return row?.id ?? "";
}

async function markTested(id: string) {
	await testDb.db
		.update(mailCampaigns)
		.set({ testSentAt: new Date() })
		.where(eq(mailCampaigns.id, id));
}

async function campaign(id: string) {
	const [row] = await testDb.db
		.select()
		.from(mailCampaigns)
		.where(eq(mailCampaigns.id, id));
	return row;
}

describe("starting a send", () => {
	test("refuses without a test sent after the last change", async () => {
		const { gateway } = stub();
		const id = await draft();
		expect(
			await startSend(testDb.db, gateway, {
				campaignId: id,
				confirmCount: 3,
				scheduledAt: null,
			})
		).toEqual({ ok: false, reason: "needs_test" });
	});

	test("an edit after the test needs a new test", async () => {
		const { gateway } = stub();
		const id = await draft();
		await markTested(id);
		const caller = createCallerFactory(
			router({ campaigns: createCampaignsRouter(gateway) })
		)({
			db: testDb.db,
			session: {
				user: { email: "admin@edgecoms.app", id: "admin-1", role: "admin" },
			},
		} as unknown as Context);
		const row = await campaign(id);
		await caller.campaigns.update({
			appId: cartId,
			audience: {},
			html: EMAIL_HTML.replace("Save 30%", "Save 40%"),
			id,
			name: row?.name ?? "",
			preheader: "p",
			subject: row?.subject ?? "",
			type: "discount",
		});
		expect(
			await startSend(testDb.db, gateway, {
				campaignId: id,
				confirmCount: 3,
				scheduledAt: null,
			})
		).toEqual({ ok: false, reason: "needs_test" });
	});

	test("refuses when the confirmed count no longer matches, and changes nothing", async () => {
		const { calls, gateway } = stub();
		const id = await draft();
		await markTested(id);
		expect(
			await startSend(testDb.db, gateway, {
				campaignId: id,
				confirmCount: 2,
				scheduledAt: null,
			})
		).toEqual({ count: 3, ok: false, reason: "count_changed" });
		expect((await campaign(id))?.status).toBe("draft");
		expect(await testDb.db.select().from(mailCampaignRecipients)).toHaveLength(
			0
		);
		expect(calls.createSegment).toBe(0);
	});

	test("snapshots the recipients and loads them once, even on a double click", async () => {
		const { calls, gateway } = stub();
		const id = await draft();
		await markTested(id);
		const input = { campaignId: id, confirmCount: 3, scheduledAt: null };
		const [first, second] = await Promise.all([
			startSend(testDb.db, gateway, input),
			startSend(testDb.db, gateway, input),
		]);
		expect([first, second]).toContainEqual({ ok: true, status: "importing" });
		expect([first, second]).toContainEqual({ ok: false, reason: "not_draft" });
		expect(calls.createSegment).toBe(1);
		expect(calls.imported).toEqual([["a@a.com", "d@d.com", "e@e.com"]]);
		// Live, nobody is opted in by a send: Resend's own opt-outs stand.
		expect(calls.optIn).toEqual([null]);
		expect(await testDb.db.select().from(mailCampaignRecipients)).toHaveLength(
			3
		);
		expect((await campaign(id))?.sentInTestMode).toBe(false);
	});

	test("in test mode, Resend only ever sees the test inbox", async () => {
		const { calls, gateway } = stub({ testInbox: "team@edgecoms.com" });
		const id = await draft();
		await markTested(id);
		await startSend(testDb.db, gateway, {
			campaignId: id,
			confirmCount: 3,
			scheduledAt: null,
		});
		expect(calls.imported).toEqual([["team@edgecoms.com"]]);
		expect(calls.optIn).toEqual(["topic_1"]);
		expect((await campaign(id))?.sentInTestMode).toBe(true);
	});

	test("in test mode with no inbox, nothing starts", async () => {
		const { calls, gateway } = stub({ testInbox: null });
		const id = await draft();
		await markTested(id);
		expect(
			await startSend(testDb.db, gateway, {
				campaignId: id,
				confirmCount: 3,
				scheduledAt: null,
			})
		).toEqual({ ok: false, reason: "no_test_inbox" });
		expect(calls.createSegment).toBe(0);
	});

	test("a Resend failure marks the campaign failed", async () => {
		const resend = stub();
		resend.failSegment();
		const id = await draft();
		await markTested(id);
		await startSend(testDb.db, resend.gateway, {
			campaignId: id,
			confirmCount: 3,
			scheduledAt: null,
		});
		const row = await campaign(id);
		expect(row?.status).toBe("failed");
		expect(row?.failureReason).toContain("Resend is down");
	});
});

describe("advancing a send", () => {
	async function started(
		gateway: CampaignGateway,
		scheduledAt: Date | null = null
	) {
		const id = await draft();
		await markTested(id);
		await startSend(testDb.db, gateway, {
			campaignId: id,
			confirmCount: 3,
			scheduledAt,
		});
		return id;
	}

	test("waits for the import, then creates and sends the broadcast exactly once", async () => {
		const resend = stub();
		const id = await started(resend.gateway);

		expect(await advanceSend(testDb.db, resend.gateway, id)).toBe("importing");
		expect(resend.calls.createBroadcast).toBe(0);

		resend.setImport("completed");
		const results = await Promise.all([
			advanceSend(testDb.db, resend.gateway, id),
			advanceSend(testDb.db, resend.gateway, id),
			advanceSend(testDb.db, resend.gateway, id),
		]);
		await advanceSend(testDb.db, resend.gateway, id);

		expect(results).toContain("sent");
		expect(resend.calls.createBroadcast).toBe(1);
		expect(resend.calls.sent).toHaveLength(1);
		const row = await campaign(id);
		expect(row?.status).toBe("sent");
		expect(row?.resendBroadcastId).toBe("bc_1");
	});

	test("a failed import fails the campaign", async () => {
		const resend = stub();
		const id = await started(resend.gateway);
		resend.setImport("failed");
		expect(await advanceSend(testDb.db, resend.gateway, id)).toBe("failed");
		expect(resend.calls.createBroadcast).toBe(0);
	});

	test("a schedule that passed while loading fails instead of sending late", async () => {
		const resend = stub();
		const at = new Date(Date.now() + 2 * 60_000);
		const id = await started(resend.gateway, at);
		resend.setImport("completed");
		const later = new Date(at.getTime() + 60_000);
		expect(await advanceSend(testDb.db, resend.gateway, id, later)).toBe(
			"failed"
		);
		expect(resend.calls.sent).toHaveLength(0);
		expect((await campaign(id))?.failureReason).toContain("scheduled time");
	});

	test("a scheduled send can be cancelled before it goes", async () => {
		const resend = stub();
		const at = new Date(Date.now() + 2 * DAY);
		const id = await started(resend.gateway, at);
		resend.setImport("completed");
		expect(await advanceSend(testDb.db, resend.gateway, id)).toBe("scheduled");
		expect(resend.calls.sent).toEqual([at]);

		expect(await cancelCampaign(testDb.db, resend.gateway, id)).toBe(
			"cancelled"
		);
		expect(resend.calls.cancel).toBe(1);
		expect((await campaign(id))?.status).toBe("cancelled");
		expect(await cancelCampaign(testDb.db, resend.gateway, id)).toBe(
			"not_cancellable"
		);
	});
});

describe("pasted HTML", () => {
	function admin() {
		return createCallerFactory(
			router({ campaigns: createCampaignsRouter(stub().gateway) })
		)({
			db: testDb.db,
			session: {
				user: { email: "admin@edgecoms.app", id: "admin-1", role: "admin" },
			},
		} as unknown as Context);
	}
	const fields = {
		appId: "",
		audience: {},
		name: "Launch",
		preheader: "p",
		subject: "s",
		type: "product_update" as const,
	};

	test("is refused without Resend's unsubscribe link", async () => {
		await expect(
			admin().campaigns.create({
				...fields,
				appId: cartId,
				html: "<p>No way out</p>",
			})
		).rejects.toMatchObject({ code: "BAD_REQUEST" });
	});

	test("is refused with a script in it", async () => {
		await expect(
			admin().campaigns.create({
				...fields,
				appId: cartId,
				html: `${EMAIL_HTML}<script>alert(1)</script>`,
			})
		).rejects.toMatchObject({ code: "BAD_REQUEST" });
	});

	test("is stored and sent exactly as pasted", async () => {
		const { id } = await admin().campaigns.create({
			...fields,
			appId: cartId,
			html: EMAIL_HTML,
		});
		expect((await campaign(id))?.html).toBe(EMAIL_HTML);
	});
});

describe("authorization", () => {
	test("a partner cannot send a campaign", async () => {
		const { gateway } = stub();
		const caller = createCallerFactory(
			router({ campaigns: createCampaignsRouter(gateway) })
		)({
			db: testDb.db,
			session: { user: { email: "p@agency.com", id: "p1", role: "partner" } },
		} as unknown as Context);
		await expect(
			caller.campaigns.send({
				confirmCount: 1,
				id: "0b8e5c2a-1d2f-4c3b-9a8e-7f6d5c4b3a21",
				scheduledAt: null,
			})
		).rejects.toMatchObject({ code: "FORBIDDEN" });
	});
});
