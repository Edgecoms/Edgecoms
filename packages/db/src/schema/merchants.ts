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
import { partnerCodes, partners } from "./partners";

export const merchantStatus = pgEnum("merchant_status", [
	"pending",
	"approved",
	"rejected",
	"suspended",
]);

/**
 * How the binding was created: an admin/partner filling the form, or a merchant
 * redeeming an attribution code inside an Edge app.
 */
export const merchantSource = pgEnum("merchant_source", ["manual", "code"]);

/**
 * A merchant store bound to a partner. Keyed by its canonical
 * `<store>.myshopify.com` domain, which is globally unique — the unique
 * constraint IS the dedup/attribution rule: two partners cannot both claim one
 * store (see CLAUDE.md "Attribution"). Normalize the domain before insert.
 *
 * Two ways a row gets here:
 *   1. `source: 'code'` — the merchant pasted a partner's attribution code into
 *      an Edge app, which bound it through /api/v1/attributions. The normal path.
 *   2. `source: 'manual'` — a partner registered the store by hand.
 *
 * Either way the row lands `pending` and an admin approves it: approval is the
 * money gate, and it is where the grandfathered set is frozen.
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
		source: merchantSource("source").default("manual").notNull(),
		// restrict: revoking or deleting a code must NEVER orphan a binding it
		// created. A partner keeps the stores a retired code referred.
		partnerCodeId: uuid("partner_code_id").references(() => partnerCodes.id, {
			onDelete: "restrict",
		}),
		// The code string as redeemed, denormalized so a row reads without a join
		// and survives as audit text independently of the code table.
		sourceCode: text("source_code"),
		// The Shopify shop GID reported by the app at bind time. Captured now
		// because `appCreditCreate` needs it, and it is free to collect here.
		shopifyGid: text("shopify_gid"),
		approvedAt: timestamp("approved_at"),
		approvedBy: text("approved_by").references(() => user.id, {
			onDelete: "set null",
		}),
		...timestamps,
	},
	(table) => [
		index("merchants_partner_idx").on(table.partnerId),
		index("merchants_status_idx").on(table.status),
		index("merchants_partner_code_idx").on(table.partnerCodeId),
	]
);

/**
 * Apps the store was already paying for when the partner acquired it — the
 * grandfathered set. These NEVER earn commission for this merchant, ever, even
 * on future charges for the same app (see CLAUDE.md "Eligibility").
 *
 * Capture point, in order of authority:
 *   1. At BIND, from what the app reports it was already charging this shop for.
 *      The app knows; an admin reconstructing it later is guessing.
 *   2. At APPROVAL, from the admin's explicit selection, which may amend (1).
 *
 * The set is FROZEN at approval and never revisited. Amending it before then is
 * safe because a `pending` merchant earns nothing.
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
	partnerCode: one(partnerCodes, {
		fields: [merchants.partnerCodeId],
		references: [partnerCodes.id],
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
