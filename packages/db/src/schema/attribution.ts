import { relations } from "drizzle-orm";
import {
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { apps } from "./apps";
import { merchants } from "./merchants";

/**
 * Attribution plumbing: the shop-lifecycle event log an Edge app posts to, and
 * the redemption-attempt log that rate-limits code entry.
 *
 * Neither table holds money. They exist so an attribution can be PROVEN later —
 * a dropped lifecycle event is an unpaid commission, and an agency that stops
 * trusting our numbers. See docs/partner-attribution-codes.md.
 */

/**
 * SHOP EVENTS — append-only, the lifecycle stream from the Edge apps.
 *
 * Idempotent on `idempotencyKey` (unique, conflict-do-nothing), exactly like
 * `earning_events` is on the Shopify transaction id: an app that retries a
 * delivery, or a nightly sweep that re-sends, is a no-op.
 *
 * Never updated, never deleted. An `uninstalled` event does NOT unbind the
 * merchant — a store leaving does not transfer a partner's book, and a reinstall
 * keeps its original attribution (the unique on `merchants.shopDomain`
 * guarantees it).
 */
export const merchantEvents = pgTable(
	"merchant_events",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		// The app's own key for this delivery — the dedup rule.
		idempotencyKey: text("idempotency_key").notNull().unique(),
		// Normalized myshopify domain. Kept even when `merchantId` is null so an
		// event for a shop we don't track is still mirrored for audit.
		shopDomain: text("shop_domain").notNull(),
		// restrict: once an event references a merchant, that merchant cannot be
		// deleted out from under the log (matches the earnings FKs).
		merchantId: uuid("merchant_id").references(() => merchants.id, {
			onDelete: "restrict",
		}),
		// Which Edge app reported this. The shared HMAC secret does not identify
		// the caller, so the app declares itself in the body; `appSlug` is retained
		// raw even when it doesn't resolve to a catalog row.
		appSlug: text("app_slug").notNull(),
		appId: uuid("app_id").references(() => apps.id, { onDelete: "set null" }),
		// subscription.activated | plan.changed | uninstalled
		type: text("type").notNull(),
		// The app's plan handle at the time of the event, when it sent one.
		planHandle: text("plan_handle"),
		// When it happened per the app, not when we received it. Both are kept:
		// the gap between them is how a delivery backlog is spotted.
		occurredAt: timestamp("occurred_at").notNull(),
		receivedAt: timestamp("received_at").defaultNow().notNull(),
	},
	(table) => [
		index("merchant_events_merchant_idx").on(table.merchantId),
		index("merchant_events_shop_domain_idx").on(table.shopDomain),
		index("merchant_events_occurred_at_idx").on(table.occurredAt),
	]
);

export const codeAttemptOutcome = pgEnum("code_attempt_outcome", [
	// The code was accepted and a binding now exists.
	"bound",
	// This shop was already bound to the same partner — an idempotent replay.
	"already_bound",
	// The shop is already claimed by a DIFFERENT partner. One partner per shop,
	// permanent; this is the interesting row in an attribution dispute.
	"claimed_by_other",
	// Unknown, disabled, expired or exhausted code. The API answers with one
	// generic failure so codes can't be enumerated — `reason` records which it
	// actually was, for us.
	"invalid",
	// Turned away by the per-shop attempt limit.
	"rate_limited",
]);

/**
 * CODE REDEMPTION ATTEMPTS — the rate-limit window and the abuse log.
 *
 * There is no Redis in this repo, and a table is the better artefact anyway:
 * it is the audit trail for code-enumeration attempts, which a counter in
 * memory would throw away. The limiter counts rows in the trailing window for a
 * shop domain, so `(shop_domain, created_at)` is the hot index.
 *
 * `reason` carries the internal detail the API response deliberately withholds.
 * Read the two together: the merchant is told "that code isn't valid", we get
 * "expired 2026-07-01".
 */
export const codeRedemptionAttempts = pgTable(
	"code_redemption_attempts",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		// The code as submitted, after normalization. Deliberately NOT an FK — the
		// whole point is to record attempts on codes that don't exist.
		code: text("code").notNull(),
		shopDomain: text("shop_domain").notNull(),
		// Which app the attempt came through, when it said.
		appSlug: text("app_slug"),
		outcome: codeAttemptOutcome("outcome").notNull(),
		// Internal-only detail behind the outcome. Never returned to a caller.
		reason: text("reason"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		// The limiter's query: attempts for this shop since T.
		index("code_redemption_attempts_shop_idx").on(
			table.shopDomain,
			table.createdAt
		),
		// Enumeration analysis: who is guessing at which codes.
		index("code_redemption_attempts_code_idx").on(table.code),
	]
);

export const merchantEventsRelations = relations(merchantEvents, ({ one }) => ({
	merchant: one(merchants, {
		fields: [merchantEvents.merchantId],
		references: [merchants.id],
	}),
	app: one(apps, {
		fields: [merchantEvents.appId],
		references: [apps.id],
	}),
}));
