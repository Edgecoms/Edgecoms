import { relations } from "drizzle-orm";
import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { discountTerms, timestamps } from "./_shared";
import { partnerCodeStatus } from "./partners";

/**
 * A PROMO CODE: a discount Edge hands out itself, with no partner behind it.
 *
 * Deliberately a different table from `partner_codes`, because it is a
 * different thing. A partner code ATTRIBUTES a store (one partner per shop,
 * permanent, commission follows). A promo code only grants a price cut: it never
 * creates a `merchants` row, never binds, never earns anybody commission, and a
 * store already referred by a partner can still redeem one. Sharing a table
 * would put a nullable `partnerId` under every attribution invariant.
 *
 * Codes share one namespace with `partner_codes` (enforced at issue time in the
 * admin router), because a merchant pastes both into the same box.
 *
 * The discount terms are IMMUTABLE once issued. Redemptions don't freeze a copy,
 * so editing the terms would change what every store that already redeemed was
 * promised. To change an offer, disable the code and issue a new one.
 *
 * The offer applies to ANY paid plan of ANY Edge app (`appliesTo: "all"` on the
 * wire), unlike a partner grant, which is Enterprise-only.
 */
export const promoCodes = pgTable("promo_codes", {
	id: uuid("id").primaryKey().defaultRandom(),
	// Normalized upper-case. Unique here AND across partner_codes.
	code: text("code").notNull().unique(),
	// Internal-only label. Never sent to an app.
	label: text("label"),
	status: partnerCodeStatus("status").default("active").notNull(),
	// How many STORES may redeem it. A store redeeming in several apps counts
	// once. Null = unlimited.
	maxRedemptions: integer("max_redemptions"),
	// Redeem-by instant, checked on every app's redemption. Null = never.
	expiresAt: timestamp("expires_at"),
	...discountTerms,
	...timestamps,
});

/**
 * One store redeeming a promo code in one Edge app.
 *
 * Unique on (code, shop, app): a replay from the same app is a no-op that
 * returns the same offer, and the same store pasting the code into a second app
 * is a second row that consumes no extra slot of `maxRedemptions`.
 *
 * `appSlug` is free text rather than an FK to `apps`: an app not yet in the
 * catalogue must still be able to redeem, and the HMAC already proves the
 * caller is an Edge app.
 */
export const promoRedemptions = pgTable(
	"promo_redemptions",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		// restrict: a code with redemptions is history; it is disabled, never deleted.
		promoCodeId: uuid("promo_code_id")
			.notNull()
			.references(() => promoCodes.id, { onDelete: "restrict" }),
		shopDomain: text("shop_domain").notNull(),
		appSlug: text("app_slug").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		unique("promo_redemptions_code_shop_app_uq").on(
			table.promoCodeId,
			table.shopDomain,
			table.appSlug
		),
		index("promo_redemptions_shop_idx").on(table.shopDomain),
	]
);

export const promoCodesRelations = relations(promoCodes, ({ many }) => ({
	redemptions: many(promoRedemptions),
}));

export const promoRedemptionsRelations = relations(
	promoRedemptions,
	({ one }) => ({
		promoCode: one(promoCodes, {
			fields: [promoRedemptions.promoCodeId],
			references: [promoCodes.id],
		}),
	})
);
