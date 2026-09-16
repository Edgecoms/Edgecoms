import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { partners } from "@edgecoms/db/schema/partners";
import { eq } from "drizzle-orm";
import { autoApproveSettledMerchants } from "../auto-approve";
import { createTestDb, type TestDb } from "./db-harness";

/**
 * THE SETTLING SWEEP.
 *
 * The sweep decides when a store starts earning without a person looking at
 * it, so the tests that matter are the ones about what it REFUSES. An
 * over-eager sweep pays a partner for revenue that predates them, and that is
 * money out of the door with no way to claw it back.
 */

const PARTNER = "11111111-1111-1111-1111-111111111111";
const SUSPENDED_PARTNER = "11111111-1111-1111-1111-111111111112";
const APP = "33333333-3333-3333-3333-333333333333";

/** Now, and a creation time comfortably outside the settling window. */
const NOW = new Date("2026-03-10T00:00:00Z");
const SETTLED = new Date("2026-03-01T00:00:00Z");
const FRESH = new Date("2026-03-09T23:00:00Z");

let harness: TestDb;
let shopSeq = 0;

const sweep = () => autoApproveSettledMerchants(harness.db, { now: () => NOW });

async function addStore(options: {
	createdAt?: Date;
	partnerId?: string;
	source?: "code" | "manual";
	status?: "approved" | "pending" | "rejected";
}) {
	shopSeq += 1;
	const inserted = await harness.db
		.insert(merchants)
		.values({
			createdAt: options.createdAt ?? SETTLED,
			name: `Store ${shopSeq}`,
			partnerId: options.partnerId ?? PARTNER,
			shopDomain: `store-${shopSeq}.myshopify.com`,
			source: options.source ?? "code",
			status: options.status ?? "pending",
		})
		.returning({ id: merchants.id });
	const id = inserted[0]?.id;
	if (!id) {
		throw new Error("no merchant inserted");
	}
	return id;
}

const statusOf = async (id: string) =>
	await harness.db.query.merchants.findFirst({ where: eq(merchants.id, id) });

beforeEach(async () => {
	harness = await createTestDb();
	shopSeq = 0;
	await harness.db.insert(user).values([
		{ id: "uP", name: "Partner", email: "p@x.com", role: "partner" },
		{ id: "uQ", name: "Suspended", email: "q@x.com", role: "partner" },
	]);
	await harness.db.insert(partners).values([
		{ id: PARTNER, userId: "uP", status: "approved", defaultRateBps: 2000 },
		{
			defaultRateBps: 2000,
			id: SUSPENDED_PARTNER,
			status: "suspended",
			userId: "uQ",
		},
	]);
	await harness.db.insert(apps).values({
		id: APP,
		slug: "edge-cart",
		name: "Edge Cart",
		partnerApiGid: "gid://cart",
	});
});

afterEach(async () => {
	await harness.close();
});

describe("what the sweep approves", () => {
	test("a settled store with nothing grandfathered is approved and marked as automatic", async () => {
		const id = await addStore({});

		const summary = await sweep();

		expect(summary.approved).toEqual([id]);
		const row = await statusOf(id);
		expect(row?.status).toBe("approved");
		expect(row?.autoApproved).toBe(true);
		expect(row?.approvedAt).toEqual(NOW);
		/* No person did this, and the column above is what says so -- null
		   `approvedBy` is also what a deleted admin leaves behind. */
		expect(row?.approvedBy).toBeNull();
	});

	test("running twice approves once and does not touch the store again", async () => {
		const id = await addStore({});
		const first = await sweep();
		const second = await sweep();

		expect(first.approved).toEqual([id]);
		expect(second.approved).toEqual([]);
		expect(second.held).toEqual([]);
	});
});

describe("what the sweep refuses", () => {
	test("a store with a grandfathered app waits for a person", async () => {
		const id = await addStore({});
		await harness.db
			.insert(merchantGrandfatheredApps)
			.values({ appId: APP, merchantId: id });

		const summary = await sweep();

		expect(summary.approved).toEqual([]);
		expect(summary.held[0]?.merchantId).toBe(id);
		expect((await statusOf(id))?.status).toBe("pending");
	});

	test("a store still inside the settling window is not considered", async () => {
		const id = await addStore({ createdAt: FRESH });

		const summary = await sweep();

		/* Not held either: it is not a decision yet, it is simply too early,
		   and the next pass will look again. */
		expect(summary.approved).toEqual([]);
		expect(summary.held).toEqual([]);
		expect((await statusOf(id))?.status).toBe("pending");
	});

	test("the window is the reason, and widening it lets the same store through", async () => {
		const id = await addStore({ createdAt: FRESH });

		expect((await sweep()).approved).toEqual([]);
		const later = await autoApproveSettledMerchants(harness.db, {
			now: () => NOW,
			settlingHours: 1,
		});
		expect(later.approved).toEqual([id]);
	});

	test("a suspended partner's store is held, not approved", async () => {
		const id = await addStore({ partnerId: SUSPENDED_PARTNER });

		const summary = await sweep();

		/* validateCode refuses a bind for an unapproved partner, but a partner
		   can be suspended AFTER their store bound, and the sweep must not open
		   new earning for somebody we stopped working with. */
		expect(summary.approved).toEqual([]);
		expect(summary.held[0]).toEqual({
			merchantId: id,
			reason: "partner is suspended",
		});
		expect((await statusOf(id))?.status).toBe("pending");
	});

	test("an already approved store is left alone", async () => {
		const id = await addStore({ status: "approved" });

		const summary = await sweep();

		expect(summary.approved).toEqual([]);
		const row = await statusOf(id);
		/* Still not marked automatic: a person approved this one. */
		expect(row?.autoApproved).toBe(false);
	});

	test("a rejected store is never revived", async () => {
		const id = await addStore({ status: "rejected" });

		const summary = await sweep();

		expect(summary.approved).toEqual([]);
		expect((await statusOf(id))?.status).toBe("rejected");
	});

	test("a hand-registered store is out of scope", async () => {
		const id = await addStore({ source: "manual" });

		const summary = await sweep();

		/* The sweep's whole argument is that a code redemption carries the app's
		   own report of what the shop already paid for. A row created some other
		   way has no such report behind it, so nothing has been established. */
		expect(summary.approved).toEqual([]);
		expect((await statusOf(id))?.status).toBe("pending");
	});
});

describe("many stores at once", () => {
	test("each store is judged on its own", async () => {
		const clean = await addStore({});
		const grandfathered = await addStore({});
		const tooFresh = await addStore({ createdAt: FRESH });
		const suspended = await addStore({ partnerId: SUSPENDED_PARTNER });
		await harness.db
			.insert(merchantGrandfatheredApps)
			.values({ appId: APP, merchantId: grandfathered });

		const summary = await sweep();

		expect(summary.approved).toEqual([clean]);
		expect(summary.held.map((row) => row.merchantId).sort()).toEqual(
			[grandfathered, suspended].sort()
		);
		expect((await statusOf(tooFresh))?.status).toBe("pending");
	});
});
