import { decimalStringToMinorUnits } from "@edgecoms/billing/money";
import { createPartnerApiSource } from "@edgecoms/billing/partner-api";
import { runBillingSync } from "@edgecoms/billing/run-sync";
import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { commissions } from "@edgecoms/db/schema/earnings";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import {
	partnerAppRates,
	partnerCodes,
	partnerInvites,
	partners,
} from "@edgecoms/db/schema/partners";
import { partnerBonuses, payouts } from "@edgecoms/db/schema/payouts";
import { syncState } from "@edgecoms/db/schema/sync";
import { env } from "@edgecoms/env/server";
import { TRPCError } from "@trpc/server";
import {
	and,
	count,
	desc,
	eq,
	inArray,
	isNotNull,
	ne,
	notInArray,
	sql,
} from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { z } from "zod";
import { normalizeCode } from "../attribution/codes";
import type { EmailDelivery, EmailSender } from "../context";
import {
	type OutboundEmail,
	renderPartnerApprovedEmail,
	renderPartnerInviteEmail,
} from "../email/partner-emails";
import { adminProcedure, router } from "../index";
import { payoutBlocker } from "../payout-details";
import { createInviteToken, INVITE_TTL_DAYS } from "./invites";

/**
 * Sum a money column to a string, never null.
 *
 * Takes any money column rather than only `commissions.commissionAmount`:
 * payouts now total commissions AND bonuses, and both are bigint minor units.
 * The `string` return is deliberate -- a bigint sum must not round-trip through
 * a JS number on its way out of the driver.
 */
const MONEY_SUM = (column: AnyPgColumn) =>
	sql<string>`coalesce(sum(${column}), 0)`;

/**
 * What a merchant-facing code may contain, AFTER normalization: letters, digits
 * and hyphens, 4–32 characters. Long enough not to be guessable by accident,
 * short enough that a merchant can retype it from an email.
 *
 * Digits are allowed because plenty of legitimate agency names contain them. The
 * thing to avoid — a code that encodes the commission rate, like `ALEX30` — is a
 * naming judgement, not something a regex can catch, so the guidance lives in
 * the admin UI and the rate is only ever read from the partner row.
 */
const CODE_PATTERN = /^[A-Z0-9-]{4,32}$/;
/**
 * Smallest payout worth making, in minor units. $50.
 *
 * Below this a transfer fee is a meaningful share of the payment, and holding
 * costs the partner nothing: their commissions stay `pending` and join the next
 * month's group, the same way a late charge already does.
 */
const MINIMUM_PAYOUT_MINOR = 5000n;
/** A payout period, as `YYYY-MM`. */
const PERIOD_MONTH = /^\d{4}-\d{2}$/;

/** Upper bound on one invite batch, so a paste cannot mail thousands. */
const MAX_INVITES_PER_BATCH = 50;
const MS_PER_DAY = 86_400_000;
/** Trailing slashes on the configured origin, so links do not double up. */
const TRAILING_SLASHES = /\/+$/;

/**
 * Sends one email without ever failing the operation that triggered it.
 *
 * Every caller here has already committed a write to the money system by the
 * time this runs. A partner approval that rolled back because Resend was
 * briefly unavailable would be a far worse bug than a notification that has to
 * be resent, so this swallows everything and reports what happened.
 *
 * A context with no sender (the router tests build one by hand) reports
 * "skipped", which is why adding mail did not change a single existing test.
 */
async function notify(
	ctx: { sendEmail?: EmailSender },
	email: OutboundEmail
): Promise<EmailDelivery> {
	if (!ctx.sendEmail) {
		return "skipped";
	}
	try {
		return await ctx.sendEmail(email);
	} catch (error) {
		console.warn(`admin_notify: sender threw: ${String(error)}`);
		return "failed";
	}
}

/**
 * The origin to build partner-facing links on.
 *
 * `BETTER_AUTH_URL` rather than a separate variable because it is already
 * required to equal the deployment's own origin. If it were wrong, sign-in
 * would be broken long before anybody noticed a bad link in an email.
 */
function siteOrigin(): string {
	/* Typed as a required URL, but SKIP_ENV_VALIDATION (which the test suite
	   sets) leaves every value undefined, so this must not assume a string. */
	const configured: string | undefined = env.BETTER_AUTH_URL;
	return (configured ?? "").replace(TRAILING_SLASHES, "");
}

/** Normalized, de-duplicated, order-preserving list of addresses. */
function normalizeEmails(values: readonly string[]): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const value of values) {
		const email = value.trim().toLowerCase();
		if (email && !seen.has(email)) {
			seen.add(email);
			out.push(email);
		}
	}
	return out;
}

/** Billing intervals a discount may span. Ten years is well past any real promo. */
const MAX_DISCOUNT_CYCLES = 120;
/** 10000 bps = 100%. A discount cannot exceed the price. */
const MAX_BPS = 10_000;
const DECIMAL_AMOUNT = /^\d+(?:\.\d+)?$/;

const codeTermsInput = {
	label: z.string().max(120).optional(),
	maxRedemptions: z.number().int().positive().max(100_000).nullish(),
	expiresAt: z.iso.datetime().nullish(),
	perkUsageAllowanceUsd: z
		.number()
		.int()
		.nonnegative()
		.max(10_000_000)
		.nullish(),

	/**
	 * PHASE 2 discount terms. Integers only, per CLAUDE.md "Money correctness" —
	 * `discountAmountMinor` crosses the wire as a decimal STRING because JSON has
	 * no bigint, and is parsed with `BigInt()` rather than `Number()` so a large
	 * amount cannot silently lose precision.
	 */
	discountKind: z
		.enum(["none", "percentage", "fixed", "free_cycles"])
		.optional(),
	discountBps: z.number().int().nonnegative().max(MAX_BPS).nullish(),
	/**
	 * A decimal amount as typed ("5.00"), converted to integer minor units by
	 * `decimalStringToMinorUnits` — string arithmetic, no float, and it throws
	 * rather than truncating an amount with too many decimal places.
	 */
	discountAmount: z.string().regex(DECIMAL_AMOUNT).max(24).nullish(),
	discountCurrency: z.string().length(3).nullish(),
	discountCycles: z
		.number()
		.int()
		.positive()
		.max(MAX_DISCOUNT_CYCLES)
		.nullish(),
	discountGrantLimit: z.number().int().positive().max(100_000).nullish(),
};

type CodeTermsInput = z.infer<z.ZodObject<typeof codeTermsInput>>;

interface DiscountShape {
	discountAmount?: string | null;
	discountBps?: number | null;
	discountCurrency?: string | null;
	discountCycles?: number | null;
	discountKind?: "none" | "percentage" | "fixed" | "free_cycles";
}

/**
 * A discount kind decides which fields must be present. Enforced here rather
 * than left to the UI, because a `percentage` code with a null `bps` would reach
 * an Edge app as a discount with no size and either crash it or, worse, be
 * silently read as zero.
 */
function assertCoherentDiscount(input: DiscountShape): void {
	const kind = input.discountKind;
	if (!kind || kind === "none") {
		return;
	}
	const fail = (message: string): never => {
		throw new TRPCError({ code: "BAD_REQUEST", message });
	};
	if (kind === "percentage" && (input.discountBps ?? 0) <= 0) {
		fail("A percentage discount needs a rate above zero (10000 = 100%).");
	}
	if (kind === "fixed") {
		if (!input.discountCurrency) {
			fail("A fixed discount needs a currency.");
		}
		if (!input.discountAmount) {
			fail("A fixed discount needs an amount above zero.");
		}
	}
	if (kind === "free_cycles" && !input.discountCycles) {
		fail("A free-cycles discount needs a number of cycles.");
	}
}

/**
 * Decimal amount to integer minor units, or null. Currency is required to know
 * how many minor-unit digits apply — a JPY "5" is 5, a USD "5" is 500.
 */
function toMinor(
	amount: string | null | undefined,
	currency: string | null | undefined
): bigint | null {
	if (!(amount && currency)) {
		return null;
	}
	try {
		return decimalStringToMinorUnits(amount, currency);
	} catch (error) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: error instanceof Error ? error.message : "Invalid amount.",
		});
	}
}

/**
 * A partial update of a code's terms.
 *
 * `undefined` means "leave alone" and `null` means "clear" — the distinction
 * matters because clearing an expiry and not mentioning it are different
 * intentions, and a naive spread would conflate them.
 */
function codeTermsPatch(input: CodeTermsInput) {
	const set: Record<string, unknown> = {};
	if (input.label !== undefined) {
		set.label = input.label.trim() || null;
	}
	if (input.maxRedemptions !== undefined) {
		set.maxRedemptions = input.maxRedemptions ?? null;
	}
	if (input.expiresAt !== undefined) {
		set.expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
	}
	if (input.perkUsageAllowanceUsd !== undefined) {
		set.perkUsageAllowanceUsd = input.perkUsageAllowanceUsd ?? null;
	}
	if (input.discountKind !== undefined) {
		set.discountKind = input.discountKind;
	}
	if (input.discountBps !== undefined) {
		set.discountBps = input.discountBps ?? null;
	}
	if (input.discountAmount !== undefined) {
		set.discountAmountMinor = toMinor(
			input.discountAmount,
			input.discountCurrency
		);
	}
	if (input.discountCurrency !== undefined) {
		set.discountCurrency = input.discountCurrency ?? null;
	}
	if (input.discountCycles !== undefined) {
		set.discountCycles = input.discountCycles ?? null;
	}
	if (input.discountGrantLimit !== undefined) {
		set.discountGrantLimit = input.discountGrantLimit ?? null;
	}
	return set;
}

/** The transaction handle Drizzle hands a `db.transaction` callback. */
type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];

/**
 * ISSUE a merchant-facing code onto a partner, inside the caller's transaction.
 *
 * Shares `CODE_PATTERN` and the global-unique conflict handling with
 * codes.create, because "approve issues a code" and "issue a code" must not be
 * able to disagree about what a valid code is.
 */
async function issueCodeInTx(
	tx: Tx,
	partnerId: string,
	rawCode: string
): Promise<string> {
	const code = normalizeCode(rawCode);
	if (!CODE_PATTERN.test(code)) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message:
				"Use 4\u201332 letters, digits or hyphens. Keep the commission rate out of the code.",
		});
	}

	const inserted = await tx
		.insert(partnerCodes)
		.values({ partnerId, code })
		.onConflictDoNothing({ target: partnerCodes.code })
		.returning({ id: partnerCodes.id });

	if (!inserted[0]) {
		throw new TRPCError({
			code: "CONFLICT",
			message: "That code is already in use.",
		});
	}
	return code;
}

/**
 * Admin-scoped router. Every procedure asserts the admin role via
 * `adminProcedure`. Admins operate across all partners — they are not
 * tenant-scoped. This is where the engine's inputs are set: partner rates,
 * merchant approvals, and the grandfathered sets.
 */
/**
 * Refuse to pay a partner we could not actually send money to.
 *
 * Reads the STORED destination rather than trusting the caller: this is the
 * last point before money moves, and a row may predate the validator that now
 * guards the form.
 */
async function assertPayable(tx: Tx, partnerId: string): Promise<void> {
	const rows = await tx
		.select({
			payoutAccountName: partners.payoutAccountName,
			payoutAccountNumber: partners.payoutAccountNumber,
			payoutCountry: partners.payoutCountry,
			payoutDestination: partners.payoutDestination,
			payoutIfsc: partners.payoutIfsc,
		})
		.from(partners)
		.where(eq(partners.id, partnerId))
		.limit(1);

	const row = rows[0];
	if (!row) {
		throw new TRPCError({ code: "NOT_FOUND", message: "No such partner." });
	}
	const blocker = payoutBlocker(row);
	if (blocker) {
		throw new TRPCError({
			code: "PRECONDITION_FAILED",
			message: `Cannot pay this partner: ${blocker}.`,
		});
	}
}

/** Withholding as integer minor units, refused if it exceeds what was earned. */
function resolveWithholding(
	amount: string,
	currency: string,
	total: bigint
): bigint {
	const withheld = decimalStringToMinorUnits(amount, currency);
	if (withheld < 0n || withheld > total) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Withholding cannot exceed the amount earned.",
		});
	}
	return withheld;
}

export const adminRouter = router({
	dashboard: adminProcedure.query(async ({ ctx }) => {
		const period = currentPeriod();

		const totalPartners = await ctx.db
			.select({ value: count() })
			.from(partners);
		const pendingPartners = await ctx.db
			.select({ value: count() })
			.from(partners)
			.where(eq(partners.status, "pending"));
		const activeMerchants = await ctx.db
			.select({ value: count() })
			.from(merchants)
			.where(eq(merchants.status, "approved"));
		const pendingMerchants = await ctx.db
			.select({ value: count() })
			.from(merchants)
			.where(eq(merchants.status, "pending"));
		const monthCommission = await ctx.db
			.select({ total: MONEY_SUM(commissions.commissionAmount) })
			.from(commissions)
			.where(eq(commissions.periodMonth, period));
		const payable = await ctx.db
			.select({ total: MONEY_SUM(commissions.commissionAmount) })
			.from(commissions)
			.where(eq(commissions.status, "pending"));

		return {
			currency: "USD",
			totalPartners: totalPartners[0]?.value ?? 0,
			pendingPartners: pendingPartners[0]?.value ?? 0,
			activeMerchants: activeMerchants[0]?.value ?? 0,
			pendingMerchants: pendingMerchants[0]?.value ?? 0,
			monthlyCommissionsMinor: monthCommission[0]?.total ?? "0",
			pendingPayoutsMinor: payable[0]?.total ?? "0",
		};
	}),

	apps: router({
		list: adminProcedure.query(({ ctx }) =>
			ctx.db
				.select({ id: apps.id, slug: apps.slug, name: apps.name })
				.from(apps)
				.orderBy(apps.name)
		),
	}),

	partners: router({
		list: adminProcedure.query(async ({ ctx }) => {
			const rows = await ctx.db
				.select({
					id: partners.id,
					companyName: partners.companyName,
					website: partners.website,
					status: partners.status,
					defaultRateBps: partners.defaultRateBps,
					createdAt: partners.createdAt,
					name: user.name,
					email: user.email,
				})
				.from(partners)
				.innerJoin(user, eq(user.id, partners.userId))
				.orderBy(desc(partners.createdAt));

			const merchantCounts = await ctx.db
				.select({ partnerId: merchants.partnerId, value: count() })
				.from(merchants)
				.groupBy(merchants.partnerId);
			const countByPartner = new Map(
				merchantCounts.map((row) => [row.partnerId, row.value])
			);

			/* The rate the inviting admin had in mind, carried off the accepted
			   invite so the approve dialog opens on it instead of a guess. A
			   PROPOSAL and nothing more: commission generation never reads this,
			   only `partners.defaultRateBps`. */
			const proposals = await ctx.db
				.select({
					partnerId: partnerInvites.acceptedPartnerId,
					proposedRateBps: partnerInvites.proposedRateBps,
				})
				.from(partnerInvites)
				.where(
					and(
						isNotNull(partnerInvites.acceptedPartnerId),
						isNotNull(partnerInvites.proposedRateBps)
					)
				);
			const proposedByPartner = new Map(
				proposals.map((row) => [row.partnerId, row.proposedRateBps])
			);

			return rows.map((row) => ({
				...row,
				merchantCount: countByPartner.get(row.id) ?? 0,
				proposedRateBps: proposedByPartner.get(row.id) ?? null,
			}));
		}),

		/**
		 * APPROVE a partner: status, default rate, optional per-app rates, and,
		 * in the same transaction, the attribution code they are about to be told
		 * they have.
		 *
		 * The code used to be a separate trip to /admin/codes that an admin had to
		 * remember, while the partner's dashboard told them "we issue one when your
		 * account is approved". Approving without issuing produced a partner
		 * staring at a promise nothing kept, so the two are now one action.
		 *
		 * `code` is optional ONLY because re-approving a suspended partner must not
		 * demand a second code: if the partner already holds an active one, that is
		 * the code they keep. With no active code and no `code` supplied, this
		 * refuses rather than approving somebody who cannot acquire a store.
		 *
		 * Mail goes out AFTER the transaction commits, and cannot fail it. The
		 * return value reports what happened so the admin sees "approved, but the
		 * email did not go out" rather than silently assuming the partner was told.
		 */
		approve: adminProcedure
			.input(
				z.object({
					partnerId: z.string(),
					defaultRateBps: z.number().int().min(0).max(10_000),
					code: z.string().min(4).max(32).optional(),
					appRates: z
						.array(
							z.object({
								appId: z.string(),
								rateBps: z.number().int().min(0).max(10_000),
							})
						)
						.optional(),
				})
			)
			.mutation(async ({ ctx, input }) => {
				const approved = await ctx.db.transaction(async (tx) => {
					const rows = await tx
						.select({ email: user.email, name: user.name })
						.from(partners)
						.innerJoin(user, eq(user.id, partners.userId))
						.where(eq(partners.id, input.partnerId))
						.limit(1);

					const recipient = rows[0];
					if (!recipient) {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: "No such partner.",
						});
					}

					await tx
						.update(partners)
						.set({
							status: "approved",
							defaultRateBps: input.defaultRateBps,
							approvedAt: new Date(),
							approvedBy: ctx.session.user.id,
						})
						.where(eq(partners.id, input.partnerId));

					for (const rate of input.appRates ?? []) {
						await tx
							.insert(partnerAppRates)
							.values({
								partnerId: input.partnerId,
								appId: rate.appId,
								rateBps: rate.rateBps,
							})
							.onConflictDoUpdate({
								target: [partnerAppRates.partnerId, partnerAppRates.appId],
								set: { rateBps: rate.rateBps },
							});
					}

					const existing = await tx
						.select({ code: partnerCodes.code })
						.from(partnerCodes)
						.where(
							and(
								eq(partnerCodes.partnerId, input.partnerId),
								eq(partnerCodes.status, "active")
							)
						)
						.limit(1);

					let code = existing[0]?.code ?? null;
					if (!code) {
						if (!input.code) {
							throw new TRPCError({
								code: "BAD_REQUEST",
								message:
									"This partner has no active code. Supply one to issue with the approval.",
							});
						}
						code = await issueCodeInTx(tx, input.partnerId, input.code);
					}

					return { code, email: recipient.email };
				});

				const delivery = await notify(
					ctx,
					renderPartnerApprovedEmail({
						code: approved.code,
						rateBps: input.defaultRateBps,
						to: approved.email,
						welcomeUrl: `${siteOrigin()}/partner`,
					})
				);

				return { code: approved.code, emailed: delivery, ok: true };
			}),

		/**
		 * INVITE agencies by email address.
		 *
		 * The outbound half of partner acquisition: an admin who already knows who
		 * they want, and has nothing but a list of addresses. Each address gets a
		 * signup link tied to it.
		 *
		 * AN INVITE IS NOT AN APPROVAL. `proposedRateBps` is recorded on the invite
		 * and pre-fills the approve dialog once they sign up; it is never read when
		 * commission is generated. The money gate stays exactly where CLAUDE.md
		 * puts it.
		 *
		 * Per-address results rather than one pass/fail, because a batch pasted
		 * from a spreadsheet will contain an address that already has an account
		 * and that must not stop the other nine from going out. Re-inviting a live
		 * address revokes the old token and issues a new one, which is what makes
		 * the button safe to press twice.
		 */
		invite: adminProcedure
			.input(
				z.object({
					/* Raw strings, validated per address in the handler. `z.email()`
					   here would reject the entire batch because one pasted row has
					   a stray space or a typo, which is every real batch. */
					emails: z
						.array(z.string().min(1).max(320))
						.min(1)
						.max(MAX_INVITES_PER_BATCH),
					companyName: z.string().max(200).optional(),
					proposedRateBps: z.number().int().min(0).max(10_000).optional(),
				})
			)
			.mutation(async ({ ctx, input }) => {
				const emails = normalizeEmails(input.emails);
				const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * MS_PER_DAY);
				const results: {
					email: string;
					outcome: "already_registered" | "invalid" | "invited";
					emailed?: EmailDelivery;
				}[] = [];

				for (const email of emails) {
					if (!z.email().safeParse(email).success) {
						results.push({ email, outcome: "invalid" });
						continue;
					}

					const existing = await ctx.db
						.select({ id: user.id })
						.from(user)
						.where(eq(user.email, email))
						.limit(1);

					/* They can already sign in; an invite would only confuse them. */
					if (existing[0]) {
						results.push({ email, outcome: "already_registered" });
						continue;
					}

					const { hash, token } = createInviteToken();

					await ctx.db.transaction(async (tx) => {
						/* Supersede any live invite for this address, so the partial
               unique index holds and only the newest link works. */
						await tx
							.update(partnerInvites)
							.set({ status: "revoked" })
							.where(
								and(
									eq(partnerInvites.email, email),
									eq(partnerInvites.status, "sent")
								)
							);

						await tx.insert(partnerInvites).values({
							email,
							tokenHash: hash,
							companyName: input.companyName?.trim() || null,
							proposedRateBps: input.proposedRateBps ?? null,
							expiresAt,
							invitedBy: ctx.session.user.id,
						});
					});

					const delivery = await notify(
						ctx,
						renderPartnerInviteEmail({
							acceptUrl: `${siteOrigin()}/register?invite=${encodeURIComponent(token)}`,
							companyName: input.companyName?.trim() || null,
							inviterName: ctx.session.user.name ?? null,
							to: email,
						})
					);

					results.push({ email, emailed: delivery, outcome: "invited" });
				}

				return { results };
			}),

		/** Outstanding and historical invitations, newest first. */
		invites: adminProcedure.query(async ({ ctx }) => {
			const rows = await ctx.db
				.select({
					id: partnerInvites.id,
					email: partnerInvites.email,
					companyName: partnerInvites.companyName,
					proposedRateBps: partnerInvites.proposedRateBps,
					status: partnerInvites.status,
					expiresAt: partnerInvites.expiresAt,
					acceptedAt: partnerInvites.acceptedAt,
					createdAt: partnerInvites.createdAt,
				})
				.from(partnerInvites)
				.orderBy(desc(partnerInvites.createdAt));

			const now = new Date();
			return rows.map((row) => ({
				...row,
				/* Expiry is a fact about time, not a status anybody writes, so it is
           derived here rather than by a job that has to keep up. */
				expired: row.status === "sent" && row.expiresAt <= now,
			}));
		}),

		/** Kill a live invitation's link. Accepted invites are history and stay. */
		revokeInvite: adminProcedure
			.input(z.object({ inviteId: z.string() }))
			.mutation(async ({ ctx, input }) => {
				await ctx.db
					.update(partnerInvites)
					.set({ status: "revoked" })
					.where(
						and(
							eq(partnerInvites.id, input.inviteId),
							eq(partnerInvites.status, "sent")
						)
					);
				return { ok: true };
			}),

		/**
		 * ISSUE A BONUS -- money with no earning event behind it.
		 *
		 * Discretionary by design: nothing mints these, so nothing is owed to a
		 * partner who has not been given one. That is what keeps a bonus from
		 * becoming a published promise the business owes everybody who reaches
		 * the same number.
		 *
		 * The amount arrives as a DECIMAL STRING and is converted with the same
		 * integer conversion the rest of the money system uses. A float never
		 * touches it (CLAUDE.md "Money correctness").
		 *
		 * `periodMonth` decides which payout it rides, so a bonus issued for a
		 * period already paid forms part of the next payout for that period
		 * rather than mutating a settled one -- the same rule as a late
		 * commission.
		 */
		issueBonus: adminProcedure
			.input(
				z.object({
					partnerId: z.string(),
					amount: z.string().regex(DECIMAL_AMOUNT, "Use a decimal amount"),
					currency: z.string().length(3),
					reason: z.string().min(3).max(300),
					periodMonth: z.string().regex(PERIOD_MONTH, "Use YYYY-MM"),
				})
			)
			.mutation(async ({ ctx, input }) => {
				const currency = input.currency.toUpperCase();
				const amountMinor = decimalStringToMinorUnits(input.amount, currency);
				if (amountMinor <= 0n) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "A bonus must be more than zero.",
					});
				}

				const partner = await ctx.db.query.partners.findFirst({
					where: eq(partners.id, input.partnerId),
					columns: { id: true, status: true },
				});
				if (!partner) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "No such partner.",
					});
				}
				if (partner.status !== "approved") {
					/* An unapproved partner has no agreed rate and no payout details;
					   paying one is a decision to make after approving them. */
					throw new TRPCError({
						code: "PRECONDITION_FAILED",
						message: "Approve the partner before issuing a bonus.",
					});
				}

				const inserted = await ctx.db
					.insert(partnerBonuses)
					.values({
						amount: amountMinor,
						currency,
						issuedBy: ctx.session.user.id,
						partnerId: input.partnerId,
						periodMonth: input.periodMonth,
						reason: input.reason.trim(),
					})
					.returning({ id: partnerBonuses.id });

				return { id: inserted[0]?.id ?? null, ok: true };
			}),

		/** Withdraw a bonus that has not been paid. Paid bonuses are history. */
		revokeBonus: adminProcedure
			.input(z.object({ bonusId: z.string() }))
			.mutation(async ({ ctx, input }) => {
				const updated = await ctx.db
					.update(partnerBonuses)
					.set({ status: "revoked" })
					.where(
						and(
							eq(partnerBonuses.id, input.bonusId),
							eq(partnerBonuses.status, "pending")
						)
					)
					.returning({ id: partnerBonuses.id });

				if (!updated[0]) {
					throw new TRPCError({
						code: "PRECONDITION_FAILED",
						message: "That bonus is already paid or revoked.",
					});
				}
				return { ok: true };
			}),

		/** Every bonus, newest first, for the admin ledger. */
		bonuses: adminProcedure.query(
			async ({ ctx }) =>
				await ctx.db
					.select({
						id: partnerBonuses.id,
						amount: partnerBonuses.amount,
						currency: partnerBonuses.currency,
						reason: partnerBonuses.reason,
						periodMonth: partnerBonuses.periodMonth,
						status: partnerBonuses.status,
						paidAt: partnerBonuses.paidAt,
						createdAt: partnerBonuses.createdAt,
						partnerCompany: partners.companyName,
						partnerName: user.name,
					})
					.from(partnerBonuses)
					.innerJoin(partners, eq(partners.id, partnerBonuses.partnerId))
					.innerJoin(user, eq(user.id, partners.userId))
					.orderBy(desc(partnerBonuses.createdAt))
					.then((rows) =>
						/* `amount` destructured OUT, not spread through: a bigint
						   cannot be JSON-serialized, so leaving it on the response
						   breaks the query over HTTP -- which an in-process router
						   test never exercises. */
						rows.map(({ amount, ...row }) => ({
							...row,
							amountMinor: amount.toString(),
							partner: row.partnerCompany ?? row.partnerName,
						}))
					)
		),

		setStatus: adminProcedure
			.input(
				z.object({
					partnerId: z.string(),
					status: z.enum(["approved", "suspended"]),
				})
			)
			.mutation(async ({ ctx, input }) => {
				await ctx.db
					.update(partners)
					.set({ status: input.status })
					.where(eq(partners.id, input.partnerId));
				return { ok: true };
			}),
	}),

	merchants: router({
		list: adminProcedure.query(async ({ ctx }) => {
			const rows = await ctx.db
				.select({
					id: merchants.id,
					name: merchants.name,
					shopDomain: merchants.shopDomain,
					email: merchants.email,
					notes: merchants.notes,
					status: merchants.status,
					source: merchants.source,
					sourceCode: merchants.sourceCode,
					createdAt: merchants.createdAt,
					partnerCompany: partners.companyName,
					partnerName: user.name,
				})
				.from(merchants)
				.innerJoin(partners, eq(partners.id, merchants.partnerId))
				.innerJoin(user, eq(user.id, partners.userId))
				.orderBy(desc(merchants.createdAt));

			if (rows.length === 0) {
				return [];
			}

			// The grandfathered set already proposed for each merchant — for a
			// code-bound store this is what the APP reported it was already paying
			// for. The approval dialog pre-checks these so the admin confirms real
			// data instead of reconstructing it from memory.
			const proposed = await ctx.db
				.select({
					merchantId: merchantGrandfatheredApps.merchantId,
					appId: merchantGrandfatheredApps.appId,
				})
				.from(merchantGrandfatheredApps)
				.where(
					inArray(
						merchantGrandfatheredApps.merchantId,
						rows.map((row) => row.id)
					)
				);

			const byMerchant = new Map<string, string[]>();
			for (const row of proposed) {
				const existing = byMerchant.get(row.merchantId);
				if (existing) {
					existing.push(row.appId);
				} else {
					byMerchant.set(row.merchantId, [row.appId]);
				}
			}

			return rows.map((row) => ({
				...row,
				grandfatheredAppIds: byMerchant.get(row.id) ?? [],
			}));
		}),

		/**
		 * Approve a merchant AND freeze its grandfathered apps in one transaction.
		 * Grandfathered apps (those the store already paid for) NEVER earn — see
		 * CLAUDE.md "Eligibility". The set may be empty but the choice is explicit.
		 *
		 * The submitted list REPLACES whatever was proposed at bind time. That
		 * matters now that a code-bound merchant arrives with a pre-filled set: an
		 * admin who unchecks an app the app over-reported must actually remove it,
		 * not merely fail to re-add it. This is the last point at which the set can
		 * change — after approval it is frozen, because widening it later would
		 * retroactively delete commission the partner was already told they earned.
		 */
		approve: adminProcedure
			.input(
				z.object({
					merchantId: z.string(),
					grandfatheredAppIds: z.array(z.string()),
				})
			)
			.mutation(async ({ ctx, input }) => {
				const keep = [...new Set(input.grandfatheredAppIds)];

				await ctx.db.transaction(async (tx) => {
					await tx
						.update(merchants)
						.set({
							status: "approved",
							approvedAt: new Date(),
							approvedBy: ctx.session.user.id,
						})
						.where(eq(merchants.id, input.merchantId));

					// Drop anything the admin unchecked. `notInArray` against an empty
					// list is not valid SQL, so an empty selection clears the set with a
					// plain delete instead.
					const stale =
						keep.length > 0
							? and(
									eq(merchantGrandfatheredApps.merchantId, input.merchantId),
									notInArray(merchantGrandfatheredApps.appId, keep)
								)
							: eq(merchantGrandfatheredApps.merchantId, input.merchantId);
					await tx.delete(merchantGrandfatheredApps).where(stale);

					for (const appId of keep) {
						await tx
							.insert(merchantGrandfatheredApps)
							.values({ merchantId: input.merchantId, appId })
							.onConflictDoNothing({
								target: [
									merchantGrandfatheredApps.merchantId,
									merchantGrandfatheredApps.appId,
								],
							});
					}
				});
				return { ok: true };
			}),

		reject: adminProcedure
			.input(z.object({ merchantId: z.string() }))
			.mutation(async ({ ctx, input }) => {
				await ctx.db
					.update(merchants)
					.set({ status: "rejected" })
					.where(eq(merchants.id, input.merchantId));
				return { ok: true };
			}),
	}),

	/**
	 * Attribution codes. An admin issues a code to a partner; the partner hands it
	 * to a merchant, who pastes it into an Edge app. See
	 * docs/partner-attribution-codes.md.
	 */
	codes: router({
		list: adminProcedure.query(async ({ ctx }) => {
			const rows = await ctx.db
				.select({
					id: partnerCodes.id,
					code: partnerCodes.code,
					label: partnerCodes.label,
					status: partnerCodes.status,
					maxRedemptions: partnerCodes.maxRedemptions,
					expiresAt: partnerCodes.expiresAt,
					perkUsageAllowanceUsd: partnerCodes.perkUsageAllowanceUsd,
					discountKind: partnerCodes.discountKind,
					discountBps: partnerCodes.discountBps,
					discountAmountMinor: partnerCodes.discountAmountMinor,
					discountCurrency: partnerCodes.discountCurrency,
					discountCycles: partnerCodes.discountCycles,
					discountGrantLimit: partnerCodes.discountGrantLimit,
					createdAt: partnerCodes.createdAt,
					partnerId: partners.id,
					partnerStatus: partners.status,
					partnerCompany: partners.companyName,
					partnerName: user.name,
				})
				.from(partnerCodes)
				.innerJoin(partners, eq(partners.id, partnerCodes.partnerId))
				.innerJoin(user, eq(user.id, partners.userId))
				.orderBy(desc(partnerCodes.createdAt));

			// Redemptions are counted from merchant rows rather than stored, so the
			// number can never disagree with the stores it refers to.
			const redemptions = await ctx.db
				.select({
					partnerCodeId: merchants.partnerCodeId,
					value: count(),
				})
				.from(merchants)
				.groupBy(merchants.partnerCodeId);

			const byCode = new Map(
				redemptions.map((row) => [row.partnerCodeId, row.value])
			);

			// Discount grants are counted per PARTNER, not per code: a partner may
			// hold several codes and they share one allocation. Mirrors
			// countGrantsUsed() in attribution/grants.ts — a rejected merchant
			// releases its slot.
			const grants = await ctx.db
				.select({ partnerId: merchants.partnerId, value: count() })
				.from(merchants)
				.where(
					and(
						isNotNull(merchants.discountGrantedAt),
						ne(merchants.status, "rejected")
					)
				)
				.groupBy(merchants.partnerId);
			const grantsByPartner = new Map(
				grants.map((row) => [row.partnerId, row.value])
			);

			return rows.map((row) => ({
				...row,
				discountAmountMinor: row.discountAmountMinor?.toString() ?? null,
				redemptions: byCode.get(row.id) ?? 0,
				grantsUsed: grantsByPartner.get(row.partnerId) ?? 0,
			}));
		}),

		create: adminProcedure
			.input(
				z.object({
					partnerId: z.string(),
					code: z.string().min(4).max(32),
					...codeTermsInput,
				})
			)
			.mutation(async ({ ctx, input }) => {
				const code = normalizeCode(input.code);
				if (!CODE_PATTERN.test(code)) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message:
							"Use 4–32 letters, digits or hyphens. Keep the commission rate out of the code.",
					});
				}
				assertCoherentDiscount(input);

				const inserted = await ctx.db
					.insert(partnerCodes)
					.values({
						partnerId: input.partnerId,
						code,
						label: input.label?.trim() || null,
						maxRedemptions: input.maxRedemptions ?? null,
						expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
						perkUsageAllowanceUsd: input.perkUsageAllowanceUsd ?? null,
						discountKind: input.discountKind ?? "none",
						discountBps: input.discountBps ?? null,
						discountAmountMinor: toMinor(
							input.discountAmount,
							input.discountCurrency
						),
						discountCurrency: input.discountCurrency ?? null,
						discountCycles: input.discountCycles ?? null,
						discountGrantLimit: input.discountGrantLimit ?? null,
					})
					.onConflictDoNothing({ target: partnerCodes.code })
					.returning({ id: partnerCodes.id });

				const row = inserted[0];
				if (!row) {
					// The global unique on `code` is the rule: a code addresses exactly
					// one partner, or attribution is ambiguous.
					throw new TRPCError({
						code: "CONFLICT",
						message: "That code is already in use.",
					});
				}
				return { id: row.id, code };
			}),

		/**
		 * Change a code's terms.
		 *
		 * `partnerId` and `code` are deliberately NOT updatable. Repointing a live
		 * code at another partner would silently reassign every store that redeems
		 * it afterwards while leaving the ones already bound behind — two different
		 * meanings for one string. Issue a new code instead.
		 *
		 * Disabling stops NEW redemptions only; stores already referred stay with
		 * the partner (enforced by the `restrict` FK from `merchants`).
		 */
		update: adminProcedure
			.input(
				z.object({
					codeId: z.string(),
					status: z.enum(["active", "disabled"]).optional(),
					...codeTermsInput,
				})
			)
			.mutation(async ({ ctx, input }) => {
				assertCoherentDiscount(input);
				const updated = await ctx.db
					.update(partnerCodes)
					.set({
						...(input.status ? { status: input.status } : {}),
						...codeTermsPatch(input),
					})
					.where(eq(partnerCodes.id, input.codeId))
					.returning({ id: partnerCodes.id });

				if (!updated[0]) {
					throw new TRPCError({ code: "NOT_FOUND", message: "Unknown code." });
				}
				return { ok: true };
			}),
	}),

	commissions: router({
		list: adminProcedure
			.input(
				z
					.object({ status: z.enum(["pending", "paid", "void"]).optional() })
					.optional()
			)
			.query(async ({ ctx, input }) => {
				const where = input?.status
					? eq(commissions.status, input.status)
					: undefined;
				const rows = await ctx.db
					.select({
						id: commissions.id,
						amount: commissions.commissionAmount,
						currency: commissions.currency,
						rateBps: commissions.rateBps,
						period: commissions.periodMonth,
						status: commissions.status,
						createdAt: commissions.createdAt,
						partnerCompany: partners.companyName,
						partnerName: user.name,
						merchantName: merchants.name,
						appName: apps.name,
					})
					.from(commissions)
					.innerJoin(partners, eq(partners.id, commissions.partnerId))
					.innerJoin(user, eq(user.id, partners.userId))
					.innerJoin(merchants, eq(merchants.id, commissions.merchantId))
					.innerJoin(apps, eq(apps.id, commissions.appId))
					.where(where)
					.orderBy(desc(commissions.createdAt))
					.limit(200);

				return rows.map((row) => ({
					id: row.id,
					amountMinor: row.amount.toString(),
					currency: row.currency,
					rateBps: row.rateBps,
					period: row.period,
					status: row.status,
					partner: row.partnerCompany ?? row.partnerName,
					merchantName: row.merchantName,
					appName: row.appName,
				}));
			}),

		/** Mark a single commission paid. The money figures stay immutable. */
		markPaid: adminProcedure
			.input(z.object({ commissionId: z.string() }))
			.mutation(async ({ ctx, input }) => {
				await ctx.db
					.update(commissions)
					.set({ status: "paid", paidAt: new Date() })
					.where(eq(commissions.id, input.commissionId));
				return { ok: true };
			}),
	}),

	payouts: router({
		/** Payable commission groups (partner + period + currency) not yet paid. */
		groupable: adminProcedure.query(async ({ ctx }) => {
			const rows = await ctx.db
				.select({
					partnerId: commissions.partnerId,
					periodMonth: commissions.periodMonth,
					currency: commissions.currency,
					total: MONEY_SUM(commissions.commissionAmount),
					items: count(),
					partnerCompany: partners.companyName,
					partnerName: user.name,
				})
				.from(commissions)
				.innerJoin(partners, eq(partners.id, commissions.partnerId))
				.innerJoin(user, eq(user.id, partners.userId))
				.where(eq(commissions.status, "pending"))
				.groupBy(
					commissions.partnerId,
					commissions.periodMonth,
					commissions.currency,
					partners.companyName,
					user.name
				)
				.orderBy(desc(commissions.periodMonth));

			/**
			 * Bonuses form payable groups too, and a bonus-only group has no
			 * commission rows to be found by the query above -- so without this
			 * it would be invisible here and therefore impossible to pay.
			 */
			const bonusRows = await ctx.db
				.select({
					partnerId: partnerBonuses.partnerId,
					periodMonth: partnerBonuses.periodMonth,
					currency: partnerBonuses.currency,
					total: MONEY_SUM(partnerBonuses.amount),
					items: count(),
					partnerCompany: partners.companyName,
					partnerName: user.name,
				})
				.from(partnerBonuses)
				.innerJoin(partners, eq(partners.id, partnerBonuses.partnerId))
				.innerJoin(user, eq(user.id, partners.userId))
				.where(eq(partnerBonuses.status, "pending"))
				.groupBy(
					partnerBonuses.partnerId,
					partnerBonuses.periodMonth,
					partnerBonuses.currency,
					partners.companyName,
					user.name
				);

			const groups = new Map<
				string,
				{
					bonusCount: number;
					bonusesMinor: bigint;
					commissionsMinor: bigint;
					currency: string;
					items: number;
					partner: string;
					partnerId: string;
					periodMonth: string;
				}
			>();

			const keyOf = (row: {
				currency: string;
				partnerId: string;
				periodMonth: string;
			}) => `${row.partnerId}:${row.periodMonth}:${row.currency}`;

			for (const row of rows) {
				groups.set(keyOf(row), {
					bonusCount: 0,
					bonusesMinor: 0n,
					commissionsMinor: BigInt(row.total),
					currency: row.currency,
					items: row.items,
					partner: row.partnerCompany ?? row.partnerName,
					partnerId: row.partnerId,
					periodMonth: row.periodMonth,
				});
			}

			for (const row of bonusRows) {
				const key = keyOf(row);
				const existing = groups.get(key);
				if (existing) {
					existing.bonusesMinor = BigInt(row.total);
					existing.bonusCount = row.items;
				} else {
					groups.set(key, {
						bonusCount: row.items,
						bonusesMinor: BigInt(row.total),
						commissionsMinor: 0n,
						currency: row.currency,
						items: 0,
						partner: row.partnerCompany ?? row.partnerName,
						partnerId: row.partnerId,
						periodMonth: row.periodMonth,
					});
				}
			}

			return [...groups.values()]
				.map((group) => ({
					bonusCount: group.bonusCount,
					bonusesMinor: group.bonusesMinor.toString(),
					commissionsMinor: group.commissionsMinor.toString(),
					currency: group.currency,
					items: group.items,
					partner: group.partner,
					partnerId: group.partnerId,
					periodMonth: group.periodMonth,
					/* What the payout will actually be. */
					totalMinor: (group.commissionsMinor + group.bonusesMinor).toString(),
				}))
				.sort((a, b) => b.periodMonth.localeCompare(a.periodMonth));
		}),

		list: adminProcedure.query(async ({ ctx }) => {
			const rows = await ctx.db
				.select({
					id: payouts.id,
					periodMonth: payouts.periodMonth,
					amount: payouts.totalAmount,
					currency: payouts.currency,
					status: payouts.status,
					paidAt: payouts.paidAt,
					createdAt: payouts.createdAt,
					partnerCompany: partners.companyName,
					partnerName: user.name,
				})
				.from(payouts)
				.innerJoin(partners, eq(partners.id, payouts.partnerId))
				.innerJoin(user, eq(user.id, partners.userId))
				.orderBy(desc(payouts.createdAt));

			return rows.map((row) => ({
				id: row.id,
				periodMonth: row.periodMonth,
				amountMinor: row.amount.toString(),
				currency: row.currency,
				status: row.status,
				partner: row.partnerCompany ?? row.partnerName,
			}));
		}),

		/**
		 * Group a partner/period/currency's pending commissions into a single
		 * paid payout. Atomic: create the payout, then mark exactly those
		 * commissions paid and link them. The per-row amounts stay immutable.
		 */
		pay: adminProcedure
			.input(
				z.object({
					partnerId: z.string(),
					periodMonth: z.string(),
					currency: z.string().length(3),
					/** How the money moved. Recorded, not inferred. */
					method: z
						.enum(["bank_transfer", "upi", "wire", "payment_link", "other"])
						.default("bank_transfer"),
					/** Tax withheld at source, as a decimal string. "0" if none. */
					withheld: z.string().regex(DECIMAL_AMOUNT).default("0"),
					/** Section, rate, certificate number -- whatever explains it. */
					withholdingNote: z.string().max(300).optional(),
					/** UTR, wire reference, or the id of a link that was paid. */
					reference: z.string().max(200).optional(),
					/**
					 * Pay a group below the minimum anyway. Small payouts are held
					 * so a transfer fee does not eat them, but sometimes you are
					 * settling a partner's final balance and want it gone.
					 */
					force: z.boolean().default(false),
				})
			)
			.mutation(
				async ({ ctx, input }) =>
					await ctx.db.transaction(async (tx) => {
						const groupWhere = and(
							eq(commissions.partnerId, input.partnerId),
							eq(commissions.periodMonth, input.periodMonth),
							eq(commissions.currency, input.currency),
							eq(commissions.status, "pending")
						);

						const totals = await tx
							.select({
								total: MONEY_SUM(commissions.commissionAmount),
								items: count(),
							})
							.from(commissions)
							.where(groupWhere);

						/**
						 * Bonuses ride the same payout, keyed identically. Scoped
						 * to the SAME currency, so a EUR bonus waits for the EUR
						 * payout instead of being converted into this one.
						 */
						const bonusWhere = and(
							eq(partnerBonuses.partnerId, input.partnerId),
							eq(partnerBonuses.periodMonth, input.periodMonth),
							eq(partnerBonuses.currency, input.currency),
							eq(partnerBonuses.status, "pending")
						);

						const bonusTotals = await tx
							.select({
								total: MONEY_SUM(partnerBonuses.amount),
								items: count(),
							})
							.from(partnerBonuses)
							.where(bonusWhere);

						await assertPayable(tx, input.partnerId);

						const commissionTotal = BigInt(totals[0]?.total ?? "0");
						const commissionItems = totals[0]?.items ?? 0;
						const bonusTotal = BigInt(bonusTotals[0]?.total ?? "0");
						const bonusItems = bonusTotals[0]?.items ?? 0;

						/* Integers, added as integers. */
						const total = commissionTotal + bonusTotal;

						if (commissionItems + bonusItems === 0) {
							throw new TRPCError({
								code: "PRECONDITION_FAILED",
								message: "Nothing payable for this group.",
							});
						}

						/**
						 * A MINIMUM, so a transfer fee cannot eat the payout.
						 *
						 * Nothing is lost by holding: the commissions stay
						 * `pending` and join next month's group, which is the same
						 * mechanism a late charge already uses.
						 */
						if (!input.force && total < MINIMUM_PAYOUT_MINOR) {
							throw new TRPCError({
								code: "PRECONDITION_FAILED",
								message: `Below the ${MINIMUM_PAYOUT_MINOR / 100n} minimum; it rolls into next month. Use force to pay it anyway.`,
							});
						}

						const withheld = resolveWithholding(
							input.withheld,
							input.currency,
							total
						);
						const net = total - withheld;

						const inserted = await tx
							.insert(payouts)
							.values({
								partnerId: input.partnerId,
								periodMonth: input.periodMonth,
								totalAmount: total,
								withheldAmount: withheld,
								netAmount: net,
								currency: input.currency,
								method: input.method,
								reference: input.reference?.trim() || null,
								withholdingNote: input.withholdingNote?.trim() || null,
								status: "paid",
								paidAt: new Date(),
							})
							.returning({ id: payouts.id });

						const payoutId = inserted[0]?.id;
						if (!payoutId) {
							throw new TRPCError({
								code: "INTERNAL_SERVER_ERROR",
								message: "Failed to create payout",
							});
						}

						const paidAt = new Date();
						if (commissionItems > 0) {
							await tx
								.update(commissions)
								.set({ status: "paid", paidAt, payoutId })
								.where(groupWhere);
						}
						if (bonusItems > 0) {
							/* Same predicate as the sum, inside the same transaction, so
							   a bonus issued mid-payout is either counted and paid or
							   left entirely for the next one. */
							await tx
								.update(partnerBonuses)
								.set({ status: "paid", paidAt, payoutId })
								.where(bonusWhere);
						}

						return {
							bonusCount: bonusItems,
							bonusesMinor: bonusTotal.toString(),
							commissionsMinor: commissionTotal.toString(),
							items: commissionItems,
							netMinor: net.toString(),
							payoutId,
							totalMinor: total.toString(),
							withheldMinor: withheld.toString(),
						};
					})
			),
	}),

	/** Ops view of the billing-sync checkpoint: last run, last error, cursor. */
	syncState: adminProcedure.query(({ ctx }) =>
		ctx.db.select().from(syncState).orderBy(syncState.id)
	),

	/**
	 * Run a billing sync on demand — the exact same `runBillingSync` the worker
	 * cron calls. Requires Partner API credentials.
	 */
	runSync: adminProcedure.mutation(async ({ ctx }) => {
		if (!(env.PARTNER_API_ORGANIZATION_ID && env.PARTNER_API_ACCESS_TOKEN)) {
			throw new TRPCError({
				code: "PRECONDITION_FAILED",
				message: "Partner API credentials are not configured",
			});
		}

		const source = createPartnerApiSource({
			organizationId: env.PARTNER_API_ORGANIZATION_ID,
			accessToken: env.PARTNER_API_ACCESS_TOKEN,
			apiVersion: env.PARTNER_API_VERSION,
		});

		const summary = await runBillingSync({ db: ctx.db, source });
		return {
			startedAt: summary.startedAt,
			finishedAt: summary.finishedAt,
			reconcile: summary.reconcile,
			commissions: summary.commissions,
		};
	}),

	/** Cheap authenticated-admin probe used by the authorization tests. */
	ping: adminProcedure.query(() => "admin-ok" as const),
});

function currentPeriod(): string {
	const now = new Date();
	const year = now.getUTCFullYear();
	const month = String(now.getUTCMonth() + 1).padStart(2, "0");
	return `${year}-${month}`;
}
