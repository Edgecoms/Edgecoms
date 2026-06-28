import { relations } from "drizzle-orm";
import {
	index,
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
import { partners } from "./partners";

export const merchantStatus = pgEnum("merchant_status", [
	"pending",
	"approved",
	"rejected",
	"suspended",
]);

/**
 * A merchant store registered by a partner. Keyed by its canonical
 * `<store>.myshopify.com` domain, which is globally unique — the unique
 * constraint IS the dedup/attribution rule: two partners cannot both claim one
 * store (see CLAUDE.md "Attribution"). Normalize the domain before insert.
 *
 * A merchant only generates commissions once `status === 'approved'`.
 */
export const merchants = pgTable(
	"merchants",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		// restrict: a partner with merchants cannot be hard-deleted (fail-closed,
		// symmetric with the commissions FKs). Clean up dependents explicitly.
		partnerId: uuid("partner_id")
			.notNull()
			.references(() => partners.id, { onDelete: "restrict" }),
		// Canonical, normalized myshopify domain. Globally unique.
		shopDomain: text("shop_domain").notNull().unique(),
		name: text("name").notNull(),
		email: text("email"),
		notes: text("notes"),
		status: merchantStatus("status").default("pending").notNull(),
		approvedAt: timestamp("approved_at"),
		approvedBy: text("approved_by").references(() => user.id, {
			onDelete: "set null",
		}),
		...timestamps,
	},
	(table) => [
		index("merchants_partner_idx").on(table.partnerId),
		index("merchants_status_idx").on(table.status),
	]
);

/**
 * Apps the store was already paying for at the moment of approval — the
 * grandfathered set. These NEVER earn commission for this merchant, ever, even
 * on future charges for the same app (see CLAUDE.md "Eligibility"). Captured
 * once, in the admin approval flow.
 */
export const merchantGrandfatheredApps = pgTable(
	"merchant_grandfathered_apps",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		merchantId: uuid("merchant_id")
			.notNull()
			.references(() => merchants.id, { onDelete: "cascade" }),
		appId: uuid("app_id")
			.notNull()
			.references(() => apps.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		unique("merchant_grandfathered_apps_merchant_app_uq").on(
			table.merchantId,
			table.appId
		),
		index("merchant_grandfathered_apps_merchant_idx").on(table.merchantId),
	]
);

export const merchantsRelations = relations(merchants, ({ one, many }) => ({
	partner: one(partners, {
		fields: [merchants.partnerId],
		references: [partners.id],
	}),
	grandfatheredApps: many(merchantGrandfatheredApps),
}));

export const merchantGrandfatheredAppsRelations = relations(
	merchantGrandfatheredApps,
	({ one }) => ({
		merchant: one(merchants, {
			fields: [merchantGrandfatheredApps.merchantId],
			references: [merchants.id],
		}),
		app: one(apps, {
			fields: [merchantGrandfatheredApps.appId],
			references: [apps.id],
		}),
	})
);
