import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./_shared";
import { merchants } from "./merchants";
import { partners } from "./partners";

/**
 * REFERRAL LINKS — the second way a partner brings a store, alongside the code.
 *
 * A code is typed by a merchant INSIDE an Edge app; a link is clicked on the
 * open web before the app is installed. Both end at the same place: a
 * `merchants` row bound to one partner, `pending` until approval. Nothing here
 * changes the code path, and nothing here binds a store by itself.
 *
 * What a link adds is everything that happens BEFORE the install, which the
 * code flow never sees: how many people clicked, from where, on what, and
 * through which channel the partner was working.
 */

/**
 * A link's address is its `slug`.
 *
 * Every approved partner reaches `/r/<their code>` without a row here: the
 * route falls back to resolving the code itself, so a partner has a working
 * link the moment they are approved. A row exists when somebody wants
 * something the bare code cannot express: a vanity slug, a link fixed to one
 * app, or a channel the partner wants counted separately.
 */
export const referralLinks = pgTable(
	"referral_links",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		partnerId: uuid("partner_id")
			.notNull()
			.references(() => partners.id, { onDelete: "restrict" }),
		/**
		 * The Edge app this link is for, or null for every app. Held as the slug
		 * rather than an `apps.id` because the route and the marketing catalog
		 * both key on the slug, and a link may name an app before that app has a
		 * catalog row.
		 */
		appSlug: text("app_slug"),
		/** The partner's own channel label, from `?s=`. Null for the main link. */
		subId: text("sub_id"),
		/** The path segment after `/r/`. Lower-cased, unique across all links. */
		slug: text("slug").notNull().unique(),
		/**
		 * Disabling stops new clicks being attributed to this link. It never
		 * unbinds a store the link already brought, for the same reason
		 * disabling a code does not: a partner loses the ability to acquire, not
		 * their book.
		 */
		isActive: boolean("is_active").default(true).notNull(),
		...timestamps,
	},
	(table) => [
		/**
		 * One link per (partner, app, channel). NULLS NOT DISTINCT because the
		 * default Postgres behaviour treats every NULL as unique, which would
		 * let a partner hold ten "all apps, no channel" links and split their own
		 * numbers ten ways.
		 */
		unique("referral_links_shape_uq")
			.on(table.partnerId, table.appSlug, table.subId)
			.nullsNotDistinct(),
		index("referral_links_partner_idx").on(table.partnerId),
	]
);

/** What the visitor was using, for the breakdown on the dashboard. */
export const referralDeviceType = pgEnum("referral_device_type", [
	"desktop",
	"mobile",
	"tablet",
	"unknown",
]);

/**
 * REFERRAL CLICKS — append-only, and never a raw IP address.
 *
 * `ipHash` is a salted SHA-256 of the caller's address, which is all the two
 * jobs here need: counting one visitor once a day, and rate-limiting a flood.
 * The address itself is never written, so this table cannot leak one, and the
 * salt lives in the environment rather than the schema.
 *
 * Rows are kept for bots too, with `isBot` set, because a partner whose clicks
 * are all crawlers should be able to see that rather than wonder where their
 * traffic went. A bot click is never `isUnique`, so it cannot inflate the
 * number the funnel reports.
 */
export const referralClicks = pgTable(
	"referral_clicks",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		/** Null when the click resolved to a partner's bare code, with no row. */
		linkId: uuid("link_id").references(() => referralLinks.id, {
			onDelete: "restrict",
		}),
		partnerId: uuid("partner_id")
			.notNull()
			.references(() => partners.id, { onDelete: "restrict" }),
		appSlug: text("app_slug"),
		subId: text("sub_id"),
		/** Salted SHA-256. Null when no salt is configured or no address was sent. */
		ipHash: text("ip_hash"),
		userAgent: text("user_agent"),
		deviceType: referralDeviceType("device_type").default("unknown").notNull(),
		isBot: boolean("is_bot").default(false).notNull(),
		/** First click from this address on this link inside 24 hours. */
		isUnique: boolean("is_unique").default(false).notNull(),
		/** Two-letter country from the edge, when the platform provides one. */
		country: varchar("country", { length: 2 }),
		referrer: text("referrer"),
		utmSource: text("utm_source"),
		utmMedium: text("utm_medium"),
		utmCampaign: text("utm_campaign"),
		utmContent: text("utm_content"),
		utmTerm: text("utm_term"),
		/* No `updatedAt`: a click is a fact, and facts are not edited. */
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("referral_clicks_link_created_idx").on(table.linkId, table.createdAt),
		index("referral_clicks_ip_created_idx").on(table.ipHash, table.createdAt),
		index("referral_clicks_partner_created_idx").on(
			table.partnerId,
			table.createdAt
		),
	]
);

export const referralLinksRelations = relations(referralLinks, ({ one }) => ({
	partner: one(partners, {
		fields: [referralLinks.partnerId],
		references: [partners.id],
	}),
}));

export const referralClicksRelations = relations(referralClicks, ({ one }) => ({
	link: one(referralLinks, {
		fields: [referralClicks.linkId],
		references: [referralLinks.id],
	}),
	partner: one(partners, {
		fields: [referralClicks.partnerId],
		references: [partners.id],
	}),
}));

/**
 * What became of a claim. `suggested` is the one a visitor never made: the
 * resolve endpoint found a click from the same address within a week and wrote
 * it down for an admin to judge. It is never attributed automatically.
 */
export const referralClaimStatus = pgEnum("referral_claim_status", [
	"pending",
	"converted",
	"expired",
	"rejected",
	"suggested",
]);

/**
 * REFERRAL CLAIMS — "this store is coming, and this partner sent it".
 *
 * A merchant on a partner's landing page types their store address before they
 * install. That is a claim: an intent, with an expiry, and no money attached.
 * It becomes an attribution only when the app calls the resolve endpoint at
 * install time and the shop still has no partner (see
 * packages/api/src/referrals/resolve.ts).
 *
 * A claim CANNOT move a store that already belongs to a partner. One partner
 * per shop stays permanent, exactly as it is for codes, so the worst a bogus
 * claim can do is sit here until it expires.
 */
export const referralClaims = pgTable(
	"referral_claims",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		/** Canonical myshopify domain where one could be derived, else as typed. */
		shopDomain: text("shop_domain").notNull(),
		partnerId: uuid("partner_id")
			.notNull()
			.references(() => partners.id, { onDelete: "restrict" }),
		linkId: uuid("link_id").references(() => referralLinks.id, {
			onDelete: "restrict",
		}),
		appSlug: text("app_slug"),
		/** The click this claim came from, when it came from one. */
		clickId: uuid("click_id").references(() => referralClicks.id, {
			onDelete: "set null",
		}),
		status: referralClaimStatus("status").default("pending").notNull(),
		/** 30 days from the claim. A merchant who installs later is not referred. */
		expiresAt: timestamp("expires_at").notNull(),
		/** The store this claim turned into, once it converted. */
		convertedMerchantId: uuid("converted_merchant_id").references(
			() => merchants.id,
			{ onDelete: "restrict" }
		),
		convertedAt: timestamp("converted_at"),
		...timestamps,
	},
	(table) => [
		index("referral_claims_shop_status_idx").on(table.shopDomain, table.status),
		index("referral_claims_partner_created_idx").on(
			table.partnerId,
			table.createdAt
		),
		index("referral_claims_status_expires_idx").on(
			table.status,
			table.expiresAt
		),
	]
);

export const referralClaimsRelations = relations(referralClaims, ({ one }) => ({
	link: one(referralLinks, {
		fields: [referralClaims.linkId],
		references: [referralLinks.id],
	}),
	partner: one(partners, {
		fields: [referralClaims.partnerId],
		references: [partners.id],
	}),
}));
