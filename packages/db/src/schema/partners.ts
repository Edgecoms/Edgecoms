import { relations, sql } from "drizzle-orm";
import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { discountTerms, timestamps } from "./_shared";
import { apps } from "./apps";
import { user } from "./auth";
import { merchants } from "./merchants";

/**
 * Which remittance route a partner is paid by, and therefore which of their
 * payout columns carry meaning.
 *
 * `bank_in` is a domestic Indian transfer (IMPS/NEFT/RTGS) and is the cheap,
 * simple case. `bank_intl` is an outward remittance, which carries a bank's
 * purpose code and its own tax filing, so it is worth distinguishing in data
 * rather than inferring from whether an IFSC happens to be null.
 */
export const payoutDestinationKind = pgEnum("payout_destination_kind", [
	"bank_in",
	"bank_intl",
]);

export const partnerStatus = pgEnum("partner_status", [
	"pending",
	"approved",
	"suspended",
]);

/**
 * A partner (agency / consultant / freelancer). Maps 1:1 to a Better Auth user
 * with role `partner`. `defaultRateBps` is the partner's commission rate in
 * basis points, set by an admin at approval; per-app overrides live in
 * `partner_app_rates`. Renegotiating the rate changes future commissions only —
 * generated commission rows freeze their own rate (see CLAUDE.md "Commissions").
 */
export const partners = pgTable(
	"partners",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		// restrict: a user with a partner record cannot be hard-deleted — the
		// partner/merchant/earnings chain is audit history. Deletion must go
		// through an explicit archival path, never a cascade.
		userId: text("user_id")
			.notNull()
			.unique()
			.references(() => user.id, { onDelete: "restrict" }),
		companyName: text("company_name"),
		website: text("website"),
		notes: text("notes"),
		status: partnerStatus("status").default("pending").notNull(),
		// Commission rate in basis points (1% = 100 bps). 0 until approved.
		defaultRateBps: integer("default_rate_bps").default(0).notNull(),
		/**
		 * SUPERSEDED by the structured columns below, and kept only because this
		 * is a money system and a column that might hold a real instruction is
		 * not something to drop on an assumption. Nothing reads these any more.
		 * Confirm they are empty in production, then drop them.
		 */
		payoutMethod: text("payout_method"),
		payoutReference: text("payout_reference"),
		/**
		 * WHERE A PAYOUT ACTUALLY GOES.
		 *
		 * Free text could not be paid from: a batch file needs an account number
		 * and an IFSC in their own fields, validated before anybody presses send,
		 * because a transfer to a malformed account either bounces days later or
		 * reaches the wrong person.
		 *
		 * `payoutDestination` decides which of the rest are meaningful:
		 * `bank_in` reads name + account + IFSC, `bank_intl` reads name +
		 * account + country and leaves IFSC null.
		 */
		payoutDestination: payoutDestinationKind("payout_destination"),
		/** As it appears on the account, not as the partner styles their brand. */
		payoutAccountName: text("payout_account_name"),
		payoutAccountNumber: text("payout_account_number"),
		/** Indian accounts only. 11 characters, and the fifth is always a zero. */
		payoutIfsc: text("payout_ifsc"),
		/** ISO-3166 alpha-2. Drives which remittance route a payout takes. */
		payoutCountry: varchar("payout_country", { length: 2 }),
		approvedAt: timestamp("approved_at"),
		approvedBy: text("approved_by").references(() => user.id, {
			onDelete: "set null",
		}),
		...timestamps,
	},
	(table) => [index("partners_status_idx").on(table.status)]
);

/**
 * Per-app commission rate override for a partner. When present, its `rateBps`
 * supersedes the partner's `defaultRateBps` for that app at generation time.
 */
export const partnerAppRates = pgTable(
	"partner_app_rates",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		partnerId: uuid("partner_id")
			.notNull()
			.references(() => partners.id, { onDelete: "cascade" }),
		appId: uuid("app_id")
			.notNull()
			.references(() => apps.id, { onDelete: "cascade" }),
		rateBps: integer("rate_bps").notNull(),
		...timestamps,
	},
	(table) => [
		unique("partner_app_rates_partner_app_uq").on(table.partnerId, table.appId),
		index("partner_app_rates_partner_idx").on(table.partnerId),
	]
);

export const partnerCodeStatus = pgEnum("partner_code_status", [
	"active",
	"disabled",
]);

/**
 * ATTRIBUTION CODES — how a merchant is bound to a partner.
 *
 * A partner hands their code to a merchant, who pastes it into the Edge app
 * they're installing. That binds the store to the partner (see
 * `merchants.partnerCodeId`). Shopify never sees this code: it is a row here,
 * not a Shopify object, and entering one records a fact rather than applying a
 * discount. See docs/partner-attribution-codes.md.
 *
 * `code` is merchant-facing and must be RATE-FREE (`ALEXAGENCY`, not `ALEX30`).
 * A rate in the string reads to merchants as "30% off", leaks one partner's rate
 * to another, and goes stale the moment the rate is renegotiated. The rate is
 * ALWAYS read from the `partners` row (or `partner_app_rates`), never parsed out
 * of the code — `label` exists so the team can still call it `Alex30` internally.
 *
 * Redemption count is `count(merchants where partner_code_id = id)`. There is
 * deliberately no redemptions table: the merchant row IS the redemption, so
 * there is exactly one source of truth for who redeemed what.
 *
 * Disabling a code stops NEW bindings only. It never unbinds stores already
 * referred — a partner loses the ability to acquire, not their existing book,
 * which is why `partnerId` and the FK from `merchants` are both `restrict`.
 *
 * Phase 1 carries no discount terms. `perkUsageAllowanceUsd` is the only offer
 * on the code, and it is a benefit an app applies to its own metering. Discount
 * terms arrive with credit issuance (Phase 2) as INTEGERS — basis points for a
 * percentage, minor units + currency for a fixed amount — never a float.
 */
export const partnerCodes = pgTable(
	"partner_codes",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		// restrict: a code that has referred stores is audit history for every
		// commission traced through it. Symmetric with the merchants/earnings FKs.
		partnerId: uuid("partner_id")
			.notNull()
			.references(() => partners.id, { onDelete: "restrict" }),
		// Normalized upper-case. Globally unique — the code IS the lookup key.
		code: text("code").notNull().unique(),
		// Internal-only label. NEVER rendered to a merchant.
		label: text("label"),
		status: partnerCodeStatus("status").default("active").notNull(),
		// null = unlimited redemptions.
		maxRedemptions: integer("max_redemptions"),
		// null = never expires.
		expiresAt: timestamp("expires_at"),
		// The instant benefit a referred store gets: a raised fee-free usage
		// allowance, in whole USD. Served to apps by /api/v1/codes/validate and
		// applied by the app to its own metering — no money is computed here.
		perkUsageAllowanceUsd: integer("perk_usage_allowance_usd"),
		// PHASE 2 — the discount this code grants on the Enterprise plan.
		...discountTerms,
		/**
		 * How many of the PARTNER's merchants receive the discount. Null =
		 * unlimited, matching `maxRedemptions` and `expiresAt`.
		 *
		 * Deliberately NOT `maxRedemptions`. That caps one code; a partner may
		 * hold several, and three codes must not yield three times the grants.
		 * The counter resolves against `merchants.partnerId` — see
		 * packages/api/src/attribution/grants.ts.
		 */
		discountGrantLimit: integer("discount_grant_limit"),
		...timestamps,
	},
	(table) => [
		index("partner_codes_partner_idx").on(table.partnerId),
		index("partner_codes_status_idx").on(table.status),
	]
);

export const partnerInviteStatus = pgEnum("partner_invite_status", [
	"sent",
	"accepted",
	"revoked",
]);

/**
 * AN OUTBOUND INVITATION to join the partner program.
 *
 * The program is otherwise self-serve: an agency finds /register and applies.
 * This table exists for the other direction: an admin who already knows who
 * they want and has nothing but an email address. The invite carries a signup
 * link, so the partner lands on a form that already knows who they are.
 *
 * AN INVITE IS NOT AN APPROVAL. Accepting one creates the same `pending`
 * partner row that a cold signup creates, and commission still waits on an
 * admin pressing approve. CLAUDE.md: "A code never bypasses admin approval …
 * approval remains the money gate." `proposedRateBps` is the rate the inviting
 * admin had in mind; it is a NOTE THAT PRE-FILLS THE APPROVE DIALOG and is
 * never read when commission is generated. The live rate is always the
 * `partners` row.
 *
 * `tokenHash` not `token`: the raw token is a bearer credential that grants the
 * right to claim this email address. It is generated once, put in the mail, and
 * never stored, so a database leak cannot be replayed into signups. Lookup
 * hashes the presented token and matches on that.
 */
export const partnerInvites = pgTable(
	"partner_invites",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		/** Lower-cased at the boundary. The address the invite was sent to. */
		email: text("email").notNull(),
		/** SHA-256 of the raw token. The raw token exists only in the email. */
		tokenHash: text("token_hash").notNull().unique(),
		/** What the admin means to pay them. A proposal, never a live rate. */
		proposedRateBps: integer("proposed_rate_bps"),
		/** Known up front when the admin is inviting a named agency. */
		companyName: text("company_name"),
		status: partnerInviteStatus("status").default("sent").notNull(),
		/** Invites expire. An unbounded signup link is a permanent back door. */
		expiresAt: timestamp("expires_at").notNull(),
		// restrict: who invited whom is audit history for how a partner entered
		// the program, and survives the inviting admin being deactivated.
		invitedBy: text("invited_by")
			.notNull()
			.references(() => user.id, { onDelete: "restrict" }),
		acceptedAt: timestamp("accepted_at"),
		acceptedPartnerId: uuid("accepted_partner_id").references(
			() => partners.id,
			{ onDelete: "set null" }
		),
		...timestamps,
	},
	(table) => [
		// At most one LIVE invite per address, so two admins inviting the same
		// agency cannot mint two tokens that both claim it. Re-inviting revokes
		// the old one first (see admin.partners.invite), which is what makes
		// "resend" safe. Accepted and revoked rows stay for the audit trail,
		// which is why this is partial rather than a plain unique.
		uniqueIndex("partner_invites_live_email_uq")
			.on(table.email)
			.where(sql`status = 'sent'`),
		index("partner_invites_email_idx").on(table.email),
		index("partner_invites_status_idx").on(table.status),
	]
);

export const partnersRelations = relations(partners, ({ one, many }) => ({
	user: one(user, {
		fields: [partners.userId],
		references: [user.id],
	}),
	merchants: many(merchants),
	appRates: many(partnerAppRates),
	codes: many(partnerCodes),
}));

export const partnerCodesRelations = relations(
	partnerCodes,
	({ one, many }) => ({
		partner: one(partners, {
			fields: [partnerCodes.partnerId],
			references: [partners.id],
		}),
		merchants: many(merchants),
	})
);

export const partnerAppRatesRelations = relations(
	partnerAppRates,
	({ one }) => ({
		partner: one(partners, {
			fields: [partnerAppRates.partnerId],
			references: [partners.id],
		}),
		app: one(apps, {
			fields: [partnerAppRates.appId],
			references: [apps.id],
		}),
	})
);

export const partnerInvitesRelations = relations(partnerInvites, ({ one }) => ({
	acceptedPartner: one(partners, {
		fields: [partnerInvites.acceptedPartnerId],
		references: [partners.id],
	}),
	invitedByUser: one(user, {
		fields: [partnerInvites.invitedBy],
		references: [user.id],
	}),
}));
