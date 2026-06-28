import { relations } from "drizzle-orm";
import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { currencyCode, moneyMinor, timestamps } from "./_shared";
import { apps } from "./apps";
import { merchants } from "./merchants";
import { partners } from "./partners";
import { payouts } from "./payouts";

/**
 * EARNING EVENTS — append-only ledger, a faithful mirror of the Shopify Partner
 * API `transactions` stream. See CLAUDE.md "The earnings ledger".
 *
 * - Idempotent on `shopifyTransactionId` (unique). Re-pulling a charge is a
 *   no-op (insert ... on conflict do nothing).
 * - Never updated, never deleted. Corrections arrive as new (possibly negative)
 *   transactions, exactly as Shopify emits them.
 * - `netAmount` is what Edge receives after Shopify's revenue share, and is the
 *   commission base — NOT gross. All amounts are integer minor units.
 * - `merchantId` / `appId` are resolved at ingest from `shopDomain` /
 *   `appPartnerApiGid`; they are nullable so a transaction for a shop/app Edge
 *   does not (yet) track is still mirrored for audit. Commission generation
 *   only considers rows whose merchant + app resolved.
 */
export const earningEvents = pgTable(
	"earning_events",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		// The Shopify Partner API transaction id — the idempotency key.
		shopifyTransactionId: text("shopify_transaction_id").notNull().unique(),
		// Normalized myshopify domain as reported by the transaction.
		shopDomain: text("shop_domain").notNull(),
		// Nullable so an unmatched-at-ingest transaction is still mirrored, but
		// restrict on delete: once an earning references a merchant, that merchant
		// cannot be deleted out from under the ledger (matches commissions FKs).
		merchantId: uuid("merchant_id").references(() => merchants.id, {
			onDelete: "restrict",
		}),
		// Raw Partner API app GID, retained for audit even if the app is unmatched.
		appPartnerApiGid: text("app_partner_api_gid"),
		appId: uuid("app_id").references(() => apps.id, { onDelete: "set null" }),
		// Money: minor units, integer. Net is the commission base.
		grossAmount: moneyMinor("gross_amount"),
		shopifyFeeAmount: moneyMinor("shopify_fee_amount"),
		netAmount: moneyMinor("net_amount"),
		currency: currencyCode(),
		// e.g. app_subscription, app_sale_credit (negative), app_usage, app_one_time
		transactionType: text("transaction_type").notNull(),
		// When the charge occurred per Shopify (drives the commission period).
		occurredAt: timestamp("occurred_at").notNull(),
		ingestedAt: timestamp("ingested_at").defaultNow().notNull(),
	},
	(table) => [
		index("earning_events_merchant_idx").on(table.merchantId),
		index("earning_events_app_idx").on(table.appId),
		index("earning_events_shop_domain_idx").on(table.shopDomain),
		index("earning_events_occurred_at_idx").on(table.occurredAt),
	]
);

export const commissionStatus = pgEnum("commission_status", [
	"pending",
	"paid",
	"void",
]);

/**
 * COMMISSIONS — immutable financial facts. See CLAUDE.md "Commissions".
 *
 * - EXACTLY ONE commission per earning event (unique FK + conflict-do-nothing),
 *   so generation can run any number of times and never double-pays.
 * - `rateBps`, `baseAmount`, `commissionAmount`, `currency` are FROZEN at
 *   generation time and never recomputed. Renegotiating a partner's rate does
 *   not rewrite existing rows.
 * - A negative earning yields a negative commission (clawback), preserving the
 *   ledger's integrity.
 * - `status` / `payoutId` / `paidAt` are the payout lifecycle and are the ONLY
 *   mutable columns; the money figures are write-once.
 */
export const commissions = pgTable(
	"commissions",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		// One commission per earning event — the dedup/no-double-pay guarantee.
		earningEventId: uuid("earning_event_id")
			.notNull()
			.unique()
			.references(() => earningEvents.id, { onDelete: "restrict" }),
		partnerId: uuid("partner_id")
			.notNull()
			.references(() => partners.id, { onDelete: "restrict" }),
		merchantId: uuid("merchant_id")
			.notNull()
			.references(() => merchants.id, { onDelete: "restrict" }),
		appId: uuid("app_id")
			.notNull()
			.references(() => apps.id, { onDelete: "restrict" }),
		// Frozen rate (basis points) used for THIS row. Never read live.
		rateBps: integer("rate_bps").notNull(),
		// Commission base = the earning's net amount at generation time.
		baseAmount: moneyMinor("base_amount"),
		// = baseAmount * rateBps / 10000, computed with integer math only.
		commissionAmount: moneyMinor("commission_amount"),
		currency: currencyCode(),
		// 'YYYY-MM' derived from the earning's occurredAt — the payout period.
		periodMonth: text("period_month").notNull(),
		status: commissionStatus("status").default("pending").notNull(),
		payoutId: uuid("payout_id").references(() => payouts.id, {
			onDelete: "set null",
		}),
		paidAt: timestamp("paid_at"),
		...timestamps,
	},
	(table) => [
		index("commissions_partner_idx").on(table.partnerId),
		index("commissions_merchant_idx").on(table.merchantId),
		index("commissions_status_idx").on(table.status),
		index("commissions_payout_idx").on(table.payoutId),
		index("commissions_period_idx").on(table.periodMonth),
	]
);

export const earningEventsRelations = relations(earningEvents, ({ one }) => ({
	merchant: one(merchants, {
		fields: [earningEvents.merchantId],
		references: [merchants.id],
	}),
	app: one(apps, {
		fields: [earningEvents.appId],
		references: [apps.id],
	}),
	commission: one(commissions, {
		fields: [earningEvents.id],
		references: [commissions.earningEventId],
	}),
}));

export const commissionsRelations = relations(commissions, ({ one }) => ({
	earningEvent: one(earningEvents, {
		fields: [commissions.earningEventId],
		references: [earningEvents.id],
	}),
	partner: one(partners, {
		fields: [commissions.partnerId],
		references: [partners.id],
	}),
	merchant: one(merchants, {
		fields: [commissions.merchantId],
		references: [merchants.id],
	}),
	app: one(apps, {
		fields: [commissions.appId],
		references: [apps.id],
	}),
	payout: one(payouts, {
		fields: [commissions.payoutId],
		references: [payouts.id],
	}),
}));
