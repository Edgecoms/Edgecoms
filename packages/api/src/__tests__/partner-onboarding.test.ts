import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { user } from "@edgecoms/db/schema/auth";
import { merchants } from "@edgecoms/db/schema/merchants";
import {
	partnerCodes,
	partnerInvites,
	partners,
} from "@edgecoms/db/schema/partners";
import { eq } from "drizzle-orm";
import type { Context, EmailDelivery } from "../context";
import type { OutboundEmail } from "../email/partner-emails";
import {
	renderPartnerApprovedEmail,
	renderPartnerInviteEmail,
} from "../email/partner-emails";
import { createCallerFactory } from "../index";
import { appRouter } from "../routers/index";
import { hashInviteToken } from "../routers/invites";
import { createTestDb, type TestDb } from "./db-harness";

/**
 * PARTNER ONBOARDING: invitation, approval-issues-a-code, and the notification.
 *
 * Two boundaries under test, both the kind CLAUDE.md says not to skip:
 *
 *   • MONEY. Approval sets a rate and mints the code that binds stores to it.
 *     Anything that leaves a partner approved-without-a-code, or issues one
 *     partner's code to another, is a payout dispute later.
 *   • AUTHORIZATION. Inviting is an admin power. An invite must not become an
 *     approval, and a leaked invite link must not be redeemable by whoever
 *     happens to hold it.
 */

const createCaller = createCallerFactory(appRouter);

const NO_ACTIVE_CODE = /no active code/i;
const ALREADY_IN_USE = /already in use/i;
const ADMIN_REQUIRED = /admin/i;
const DIFFERENT_EMAIL = /different email/i;
/** Pulls the raw token out of the accept URL the invite email carried. */
const INVITE_TOKEN_IN_URL = /invite=([\w-]+)/;

const PARTNER = "aaaaaaaa-0000-0000-0000-000000000001";
const OTHER_PARTNER = "aaaaaaaa-0000-0000-0000-000000000002";

let harness: TestDb;
/** Every message the router tried to send during one test. */
let outbox: OutboundEmail[];
/** What the fake transport reports back. Flipped to test failure handling. */
let delivery: EmailDelivery;

const sendEmail = (email: OutboundEmail): Promise<EmailDelivery> => {
	outbox.push(email);
	return Promise.resolve(delivery);
};

const adminCaller = () =>
	createCaller({
		db: harness.db,
		sendEmail,
		session: { user: { id: "admin1", role: "admin", name: "Admin" } },
	} as unknown as Context);

/** An admin whose context has no transport at all, as a deployment without mail. */
const mutelAdminCaller = () =>
	createCaller({
		db: harness.db,
		session: { user: { id: "admin1", role: "admin", name: "Admin" } },
	} as unknown as Context);

const partnerCaller = (userId = "uP", email = "p@x.com") =>
	createCaller({
		db: harness.db,
		sendEmail,
		session: { user: { id: userId, role: "partner", email, name: "Partner" } },
	} as unknown as Context);

beforeEach(async () => {
	harness = await createTestDb();
	outbox = [];
	delivery = "sent";
	await harness.db.insert(user).values([
		{ id: "admin1", name: "Admin", email: "admin@x.com", role: "admin" },
		{ id: "uP", name: "Partner", email: "p@x.com", role: "partner" },
		{ id: "uQ", name: "Other", email: "q@x.com", role: "partner" },
	]);
	await harness.db.insert(partners).values([
		{ id: PARTNER, userId: "uP", status: "pending", defaultRateBps: 0 },
		{ id: OTHER_PARTNER, userId: "uQ", status: "pending", defaultRateBps: 0 },
	]);
});

afterEach(async () => {
	await harness.close();
});

describe("approval issues the code it promises", () => {
	test("approving mints the code and mails it with the rate", async () => {
		const result = await adminCaller().admin.partners.approve({
			code: "acme-agency",
			defaultRateBps: 2000,
			partnerId: PARTNER,
		});

		/* Normalized on the way in, exactly as codes.create does it. */
		expect(result.code).toBe("ACME-AGENCY");
		expect(result.emailed).toBe("sent");

		const code = await harness.db.query.partnerCodes.findFirst({
			where: eq(partnerCodes.partnerId, PARTNER),
		});
		expect(code?.code).toBe("ACME-AGENCY");
		expect(code?.status).toBe("active");

		expect(outbox).toHaveLength(1);
		expect(outbox[0]?.to).toBe("p@x.com");
		expect(outbox[0]?.text).toContain("ACME-AGENCY");
		expect(outbox[0]?.text).toContain("20%");
	});

	test("refuses to approve a partner it cannot give a code to", async () => {
		await expect(
			adminCaller().admin.partners.approve({
				defaultRateBps: 2000,
				partnerId: PARTNER,
			})
		).rejects.toThrow(NO_ACTIVE_CODE);

		/* The whole approval rolls back: no half-approved partner who cannot
		   acquire a store but believes they are live. */
		const partner = await harness.db.query.partners.findFirst({
			where: eq(partners.id, PARTNER),
		});
		expect(partner?.status).toBe("pending");
		expect(partner?.defaultRateBps).toBe(0);
		expect(outbox).toHaveLength(0);
	});

	test("re-approving a suspended partner keeps their existing code", async () => {
		await adminCaller().admin.partners.approve({
			code: "ACMEAGENCY",
			defaultRateBps: 2000,
			partnerId: PARTNER,
		});
		await adminCaller().admin.partners.setStatus({
			partnerId: PARTNER,
			status: "suspended",
		});

		const again = await adminCaller().admin.partners.approve({
			defaultRateBps: 2500,
			partnerId: PARTNER,
		});

		expect(again.code).toBe("ACMEAGENCY");
		const codes = await harness.db
			.select()
			.from(partnerCodes)
			.where(eq(partnerCodes.partnerId, PARTNER));
		expect(codes).toHaveLength(1);
	});

	test("one code cannot be issued to two partners", async () => {
		await adminCaller().admin.partners.approve({
			code: "SHARED",
			defaultRateBps: 2000,
			partnerId: PARTNER,
		});

		await expect(
			adminCaller().admin.partners.approve({
				code: "SHARED",
				defaultRateBps: 1000,
				partnerId: OTHER_PARTNER,
			})
		).rejects.toThrow(ALREADY_IN_USE);

		const other = await harness.db.query.partners.findFirst({
			where: eq(partners.id, OTHER_PARTNER),
		});
		expect(other?.status).toBe("pending");
	});

	test("a failing mailer does not undo the approval", async () => {
		delivery = "failed";
		const result = await adminCaller().admin.partners.approve({
			code: "ACMEAGENCY",
			defaultRateBps: 2000,
			partnerId: PARTNER,
		});

		/* Reported, not thrown: losing a notification is recoverable, rolling
		   back an approval because Resend was down is not. */
		expect(result.emailed).toBe("failed");
		expect(result.ok).toBe(true);
		const partner = await harness.db.query.partners.findFirst({
			where: eq(partners.id, PARTNER),
		});
		expect(partner?.status).toBe("approved");
	});

	test("a context with no transport reports skipped, not an error", async () => {
		const result = await mutelAdminCaller().admin.partners.approve({
			code: "ACMEAGENCY",
			defaultRateBps: 2000,
			partnerId: PARTNER,
		});
		expect(result.emailed).toBe("skipped");
		expect(result.ok).toBe(true);
	});
});

describe("inviting partners", () => {
	test("a partner cannot invite anybody", async () => {
		/* The caller type exposes every route; the wall is enforced at runtime. */
		await expect(
			partnerCaller().admin.partners.invite({
				emails: ["new@agency.com"],
			})
		).rejects.toThrow(ADMIN_REQUIRED);
	});

	test("invites one row and one email per address, lower-cased", async () => {
		const result = await adminCaller().admin.partners.invite({
			companyName: "Acme Agency",
			emails: ["Alex@Acme.com", "sam@bright.co"],
			proposedRateBps: 2000,
		});

		expect(result.results).toHaveLength(2);
		expect(result.results.every((row) => row.outcome === "invited")).toBe(true);
		expect(outbox).toHaveLength(2);
		expect(outbox[0]?.to).toBe("alex@acme.com");

		const rows = await harness.db.select().from(partnerInvites);
		expect(rows).toHaveLength(2);
		expect(rows.every((row) => row.status === "sent")).toBe(true);
		expect(rows.every((row) => row.proposedRateBps === 2000)).toBe(true);
		/* The raw token is never stored, only its hash. */
		expect(rows.every((row) => row.tokenHash.length === 64)).toBe(true);
	});

	test("the proposed rate stays off the invite email", async () => {
		await adminCaller().admin.partners.invite({
			emails: ["alex@acme.com"],
			proposedRateBps: 2000,
		});

		/* An invite is not an approval and must not read like a rate quote. */
		expect(outbox[0]?.text).not.toContain("20%");
		expect(outbox[0]?.subject).not.toContain("20");
	});

	test("duplicate addresses in one batch collapse to one invite", async () => {
		const result = await adminCaller().admin.partners.invite({
			emails: ["alex@acme.com", "ALEX@acme.com", " alex@acme.com "],
		});
		expect(result.results).toHaveLength(1);
		expect(await harness.db.select().from(partnerInvites)).toHaveLength(1);
	});

	test("one malformed address does not fail the rest of the batch", async () => {
		const result = await adminCaller().admin.partners.invite({
			emails: ["alex@acme.com", "not-an-email", "sam@bright.co"],
		});

		expect(
			result.results.filter((entry) => entry.outcome === "invited")
		).toHaveLength(2);
		expect(
			result.results.find((entry) => entry.email === "not-an-email")?.outcome
		).toBe("invalid");
		expect(outbox).toHaveLength(2);
	});

	test("an address that already has an account is reported, not invited", async () => {
		const result = await adminCaller().admin.partners.invite({
			emails: ["p@x.com"],
		});

		expect(result.results[0]?.outcome).toBe("already_registered");
		expect(outbox).toHaveLength(0);
		expect(await harness.db.select().from(partnerInvites)).toHaveLength(0);
	});

	test("re-inviting revokes the old link so only the newest works", async () => {
		await adminCaller().admin.partners.invite({ emails: ["alex@acme.com"] });
		await adminCaller().admin.partners.invite({ emails: ["alex@acme.com"] });

		const rows = await harness.db
			.select()
			.from(partnerInvites)
			.where(eq(partnerInvites.email, "alex@acme.com"));
		expect(rows).toHaveLength(2);
		expect(rows.filter((row) => row.status === "sent")).toHaveLength(1);
		expect(rows.filter((row) => row.status === "revoked")).toHaveLength(1);
	});
});

/**
 * What signup does: a Better Auth user plus the pending partner row that
 * databaseHooks.after provisions alongside it. Invites go out BEFORE any of
 * this exists, which is the order the real flow runs in, so a test that seeds
 * the user first is testing a situation that cannot happen.
 */
async function signUp(id: string, email: string): Promise<string> {
	await harness.db
		.insert(user)
		.values({ id, name: "Invited", email, role: "partner" });
	const rows = await harness.db
		.insert(partners)
		.values({ userId: id, status: "pending", defaultRateBps: 0 })
		.returning({ id: partners.id });
	const partnerId = rows[0]?.id;
	if (!partnerId) {
		throw new Error("no partner row created");
	}
	return partnerId;
}

/** Pulls the token out of the accept URL the email carried. */
function tokenFromOutbox(index = 0): string {
	const match = INVITE_TOKEN_IN_URL.exec(outbox[index]?.text ?? "");
	if (!match?.[1]) {
		throw new Error("no invite token in the outbox");
	}
	return match[1];
}

describe("redeeming an invite", () => {
	test("peek returns only the address, and null once revoked", async () => {
		await adminCaller().admin.partners.invite({
			companyName: "Acme Agency",
			emails: ["alex@acme.com"],
			proposedRateBps: 2000,
		});
		const token = tokenFromOutbox();

		const peeked = await createCaller({
			db: harness.db,
			session: null,
		} as unknown as Context).invites.peek({ token });

		expect(peeked).toEqual({
			companyName: "Acme Agency",
			email: "alex@acme.com",
		});
		/* No rate, no inviter, no id: a forwarded link discloses none of it. */
		expect(Object.keys(peeked ?? {}).sort()).toEqual(["companyName", "email"]);

		const rows = await harness.db.select().from(partnerInvites);
		await adminCaller().admin.partners.revokeInvite({
			inviteId: rows[0]?.id ?? "",
		});

		const afterRevoke = await createCaller({
			db: harness.db,
			session: null,
		} as unknown as Context).invites.peek({ token });
		expect(afterRevoke).toBeNull();
	});

	test("an unknown token is indistinguishable from a revoked one", async () => {
		const peeked = await createCaller({
			db: harness.db,
			session: null,
		} as unknown as Context).invites.peek({
			token: "x".repeat(43),
		});
		expect(peeked).toBeNull();
	});

	test("accepting links the invite to the caller's pending partner row", async () => {
		await adminCaller().admin.partners.invite({
			companyName: "Acme Agency",
			emails: ["alex@acme.com"],
			proposedRateBps: 2000,
		});
		const token = tokenFromOutbox();

		/* Only now does the agency sign up. That is the real order: you cannot
		   invite somebody who already has an account. */
		const invitedPartner = await signUp("uR", "alex@acme.com");

		const result = await partnerCaller("uR", "alex@acme.com").invites.accept({
			token,
		});
		expect(result.claimed).toBe(true);

		const invite = await harness.db.query.partnerInvites.findFirst({
			where: eq(partnerInvites.tokenHash, hashInviteToken(token)),
		});
		expect(invite?.status).toBe("accepted");
		expect(invite?.acceptedPartnerId).toBe(invitedPartner);

		/* Accepting is NOT an approval. CLAUDE.md's money gate. */
		const partner = await harness.db.query.partners.findFirst({
			where: eq(partners.id, invitedPartner),
		});
		expect(partner?.status).toBe("pending");
		expect(partner?.defaultRateBps).toBe(0);
		/* The admin's proposal is carried, but only as a pre-fill. */
		expect(partner?.companyName).toBe("Acme Agency");

		const listed = await adminCaller().admin.partners.list();
		const row = listed.find((entry) => entry.id === invitedPartner);
		expect(row?.proposedRateBps).toBe(2000);
		expect(row?.defaultRateBps).toBe(0);
	});

	test("a leaked link cannot be redeemed by a different address", async () => {
		await adminCaller().admin.partners.invite({ emails: ["alex@acme.com"] });
		const token = tokenFromOutbox();

		/* q@x.com holds the link, but it was issued to alex@acme.com. */
		await expect(
			partnerCaller("uQ", "q@x.com").invites.accept({ token })
		).rejects.toThrow(DIFFERENT_EMAIL);

		const invite = await harness.db.query.partnerInvites.findFirst({
			where: eq(partnerInvites.tokenHash, hashInviteToken(token)),
		});
		expect(invite?.status).toBe("sent");
		expect(invite?.acceptedPartnerId).toBeNull();
	});

	test("accepting twice is harmless", async () => {
		await adminCaller().admin.partners.invite({ emails: ["alex@acme.com"] });
		const token = tokenFromOutbox();
		await signUp("uR", "alex@acme.com");
		const caller = partnerCaller("uR", "alex@acme.com");

		expect((await caller.invites.accept({ token })).claimed).toBe(true);
		/* Second call reports nothing to claim rather than failing a signup that
		   already succeeded. */
		expect((await caller.invites.accept({ token })).claimed).toBe(false);
	});
});

describe("partner.onboarding", () => {
	test("reports each step off the rows that prove it", async () => {
		const before = await partnerCaller().partner.onboarding();
		expect(before.status).toBe("pending");
		expect(before.steps).toEqual({
			codeIssued: false,
			firstCommission: false,
			firstStore: false,
			payoutReady: false,
		});

		await adminCaller().admin.partners.approve({
			code: "ACMEAGENCY",
			defaultRateBps: 2000,
			partnerId: PARTNER,
		});
		await partnerCaller().partner.settings.update({
			payoutMethod: "PayPal",
			payoutReference: "alex@acme.com",
		});
		await harness.db.insert(merchants).values({
			name: "Store",
			partnerId: PARTNER,
			shopDomain: "store.myshopify.com",
			status: "pending",
		});

		const after = await partnerCaller().partner.onboarding();
		expect(after.status).toBe("approved");
		expect(after.code).toBe("ACMEAGENCY");
		expect(after.defaultRateBps).toBe(2000);
		expect(after.steps.codeIssued).toBe(true);
		expect(after.steps.payoutReady).toBe(true);
		expect(after.steps.firstStore).toBe(true);
		/* No earning event, so no commission. The honest answer. */
		expect(after.steps.firstCommission).toBe(false);
	});

	test("a partner sees only their own onboarding state", async () => {
		await adminCaller().admin.partners.approve({
			code: "ACMEAGENCY",
			defaultRateBps: 2000,
			partnerId: PARTNER,
		});

		const other = await partnerCaller("uQ", "q@x.com").partner.onboarding();
		expect(other.code).toBeNull();
		expect(other.status).toBe("pending");
		expect(other.defaultRateBps).toBe(0);
	});
});

/**
 * The rendered messages themselves, with no database in the way.
 *
 * Mirrors the guards on the Edge Cart playbook email: house style forbids em
 * dashes in copy, and an automated email must never promise something the
 * product cannot honour. The marketing site currently offers dual-sided
 * discount codes, sub-partner tiers and content bounties; none of them exist,
 * so none of them may appear in a message we send.
 */
describe("the rendered emails", () => {
	const invite = renderPartnerInviteEmail({
		acceptUrl: "https://edge.test/register?invite=abc",
		companyName: "Acme Agency",
		inviterName: "Anurag",
		to: "alex@acme.com",
	});
	const approved = renderPartnerApprovedEmail({
		code: "ACMEAGENCY",
		rateBps: 2000,
		to: "alex@acme.com",
		welcomeUrl: "https://edge.test/partner",
	});

	test("contain no em dash, in either rendering", () => {
		for (const email of [invite, approved]) {
			expect(email.subject).not.toContain("—");
			expect(email.text).not.toContain("—");
			expect(email.html).not.toContain("—");
		}
	});

	test("promise nothing the product does not have", () => {
		for (const email of [invite, approved]) {
			const copy = `${email.subject} ${email.text}`.toLowerCase();
			for (const claim of [
				"discount",
				"% off",
				"sub-partner",
				"bounty",
				"per click",
				"per lead",
			]) {
				expect(copy).not.toContain(claim);
			}
		}
	});

	test("quote no earnings figures or averages", () => {
		const copy = `${invite.text} ${approved.text}`;
		/* The only percentage allowed anywhere is the reader's own rate. */
		expect(copy.match(/\d+%/g)).toEqual(["20%", "20%"]);
	});

	test("the approval carries the code and the rate; the invite carries neither", () => {
		expect(approved.subject).toContain("ACMEAGENCY");
		expect(approved.text).toContain("ACMEAGENCY");
		expect(approved.text).toContain("20%");
		expect(approved.text).toContain("https://edge.test/partner");

		expect(invite.text).not.toContain("ACMEAGENCY");
		expect(invite.text).not.toContain("20%");
		expect(invite.text).toContain("https://edge.test/register?invite=abc");
	});

	test("escape a company name into the HTML rendering", () => {
		const hostile = renderPartnerInviteEmail({
			acceptUrl: "https://edge.test/register?invite=abc",
			companyName: '<script>alert("x")</script>',
			inviterName: null,
			to: "alex@acme.com",
		});
		expect(hostile.html).not.toContain("<script>");
		expect(hostile.html).toContain("&lt;script&gt;");
	});
});
