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

export const partnersRelations = relations(partners, ({ one, many }) => ({
	user: one(user, {
		fields: [partners.userId],
		references: [user.id],
	}),
	merchants: many(merchants),
	appRates: many(partnerAppRates),
}));

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
