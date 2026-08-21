import { relations } from "drizzle-orm";
import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { timestamps } from "./_shared";
import { apps } from "./apps";
import { user } from "./auth";
import { merchants } from "./merchants";

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
		// Free-form payout instructions captured in settings (e.g. PayPal email).
		payoutMethod: text("payout_method"),
		payoutReference: text("payout_reference"),
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
		...timestamps,
	},
	(table) => [
		index("partner_codes_partner_idx").on(table.partnerId),
		index("partner_codes_status_idx").on(table.status),
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
