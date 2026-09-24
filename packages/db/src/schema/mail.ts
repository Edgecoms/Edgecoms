import {
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { timestamps } from "./_shared";
import { apps } from "./apps";
import { user } from "./auth";

/**
 * EDGE MAIL: the merchant email platform (apps/email). See docs/edge-mail.md.
 *
 * Every table is prefixed `mail_` so the boundary shows in SQL. None of these
 * holds money, and Edge Mail never writes to a money table: its stores are NOT
 * `merchants`, which exist only for partner-attributed shops and require a
 * partner. Edge Mail tracks every store that installs any Edge app.
 */

export const mailInstallStatus = pgEnum("mail_install_status", [
	"installed",
	"active",
	"inactive",
	"uninstalled",
]);

/**
 * What a merchant can opt in to. There is deliberately no `essential` here: a
 * campaign always belongs to one of these, so no campaign can ever go to a
 * merchant who opted out by calling itself essential.
 */
export const mailCategory = pgEnum("mail_category", [
	"product_updates",
	"marketing",
	"education",
]);

export const mailCampaignType = pgEnum("mail_campaign_type", [
	"product_update",
	"announcement",
	"education",
	"marketing",
	"discount",
	"cross_sell",
	"winback",
]);

/**
 * draft → importing (recipients being loaded into the Resend segment)
 *       → scheduled | sent; failed and cancelled are terminal.
 */
export const mailCampaignStatus = pgEnum("mail_campaign_status", [
	"draft",
	"importing",
	"scheduled",
	"sent",
	"failed",
	"cancelled",
]);

export const mailSuppressionReason = pgEnum("mail_suppression_reason", [
	"bounced",
	"complained",
]);

/**
 * Per-app sending identity: who an app's email is FROM. One row per app,
 * created from the Apps page; an app without a row still accepts events (its
 * secret is the gate) but cannot send a campaign until it has a sender. The
 * app's links (App Store listing, reviews, support) and icon are derived in
 * code, not stored (apps/email/src/server/apps/identity.ts).
 */
export const mailAppSettings = pgTable("mail_app_settings", {
	appId: uuid("app_id")
		.primaryKey()
		.references(() => apps.id, { onDelete: "restrict" }),
	senderName: text("sender_name").notNull(),
	senderEmail: text("sender_email").notNull(),
	...timestamps,
});

/**
 * One row per email address. Opt-ins default to FALSE: installing an app is
 * not consent to marketing, and nothing here may assume otherwise.
 */
export const mailContacts = pgTable("mail_contacts", {
	id: uuid("id").primaryKey().defaultRandom(),
	/** Lower-cased and trimmed before insert; the unique is the dedup rule. */
	email: text("email").notNull().unique(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	resendContactId: text("resend_contact_id"),
	productUpdates: boolean("product_updates").default(false).notNull(),
	marketing: boolean("marketing").default(false).notNull(),
	education: boolean("education").default(false).notNull(),
	/**
	 * When the MERCHANT last set their opt-ins on the preferences page: the
	 * evidence behind every `true` above. Null means they never have, so any
	 * opt-in on such a row did not come from this app.
	 */
	preferencesSetAt: timestamp("preferences_set_at"),
	/** Set by a bounce or complaint webhook. A suppressed contact is never a campaign recipient. */
	suppressedAt: timestamp("suppressed_at"),
	suppressionReason: mailSuppressionReason("suppression_reason"),
	...timestamps,
});

export const mailStores = pgTable("mail_stores", {
	id: uuid("id").primaryKey().defaultRandom(),
	/** Normalized with `normalizeShopDomain`, like `merchants.shop_domain`. */
	shopDomain: text("shop_domain").notNull().unique(),
	name: text("name"),
	country: text("country"),
	currency: text("currency"),
	timezone: text("timezone"),
	...timestamps,
});

/** A person may run several stores, and a store may have several people. */
export const mailContactStores = pgTable(
	"mail_contact_stores",
	{
		contactId: uuid("contact_id")
			.notNull()
			.references(() => mailContacts.id, { onDelete: "restrict" }),
		storeId: uuid("store_id")
			.notNull()
			.references(() => mailStores.id, { onDelete: "restrict" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.contactId, table.storeId] }),
		index("mail_contact_stores_store_idx").on(table.storeId),
	]
);

export const mailInstallations = pgTable(
	"mail_installations",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		storeId: uuid("store_id")
			.notNull()
			.references(() => mailStores.id, { onDelete: "restrict" }),
		appId: uuid("app_id")
			.notNull()
			.references(() => apps.id, { onDelete: "restrict" }),
		status: mailInstallStatus("status").notNull(),
		plan: text("plan"),
		installedAt: timestamp("installed_at"),
		activatedAt: timestamp("activated_at"),
		setupCompletedAt: timestamp("setup_completed_at"),
		uninstalledAt: timestamp("uninstalled_at"),
		lastActiveAt: timestamp("last_active_at"),
		/**
		 * `occurredAt` of the event that last set `status` / `plan`. Each only
		 * moves for a NEWER event, so a late or retried delivery cannot undo a
		 * later uninstall or a later plan change. Separate clocks, because an
		 * old plan change is still news after a newer activation.
		 */
		statusChangedAt: timestamp("status_changed_at").notNull(),
		planChangedAt: timestamp("plan_changed_at"),
		...timestamps,
	},
	(table) => [
		unique("mail_installations_store_app_unique").on(
			table.storeId,
			table.appId
		),
		index("mail_installations_app_status_idx").on(table.appId, table.status),
	]
);

/**
 * THE EVENT LOG: append-only, idempotent on the app's `eventId`, exactly like
 * `merchant_events` on its idempotency key. `resendSyncedAt` is the one field
 * that changes: null means the Resend side has not landed yet, and a redelivery
 * of the same event retries it instead of being dropped as a duplicate.
 */
export const mailEvents = pgTable(
	"mail_events",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		eventId: text("event_id").notNull().unique(),
		appId: uuid("app_id")
			.notNull()
			.references(() => apps.id, { onDelete: "restrict" }),
		storeId: uuid("store_id")
			.notNull()
			.references(() => mailStores.id, { onDelete: "restrict" }),
		contactId: uuid("contact_id").references(() => mailContacts.id, {
			onDelete: "restrict",
		}),
		type: text("type").notNull(),
		payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
		occurredAt: timestamp("occurred_at").notNull(),
		receivedAt: timestamp("received_at").defaultNow().notNull(),
		resendSyncedAt: timestamp("resend_synced_at"),
	},
	(table) => [
		index("mail_events_contact_idx").on(table.contactId),
		index("mail_events_store_idx").on(table.storeId),
	]
);

/**
 * Who a campaign goes to, as data. Every field narrows; an empty audience is
 * "everyone with this app installed". Validated with zod at the router.
 */
export interface MailAudience {
	/** Active within the last N days (by `last_active_at`). */
	activeWithinDays?: number;
	/** Install statuses to include. Default: installed and active. */
	installStatuses?: ("installed" | "active" | "inactive" | "uninstalled")[];
	/** Exclude stores that have any of these app slugs installed (cross-sell). */
	notInstalledAppSlugs?: string[];
	/** Plan handles to include. Empty or absent = any plan. */
	plans?: string[];
	/** Uninstalled within the last N days (winback). */
	uninstalledWithinDays?: number;
}

export const mailCampaigns = pgTable(
	"mail_campaigns",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: text("name").notNull(),
		type: mailCampaignType("type").notNull(),
		category: mailCategory("category").notNull(),
		appId: uuid("app_id")
			.notNull()
			.references(() => apps.id, { onDelete: "restrict" }),
		subject: text("subject").notNull(),
		preheader: text("preheader").notNull(),
		/**
		 * The whole email, as pasted by the admin: sent as-is. It must carry
		 * Resend's unsubscribe placeholder (checked on save).
		 */
		html: text("html").notNull().default(""),
		audience: jsonb("audience").$type<MailAudience>().notNull(),
		status: mailCampaignStatus("status").default("draft").notNull(),
		/** A send requires a test sent AFTER the last content change. */
		contentUpdatedAt: timestamp("content_updated_at").defaultNow().notNull(),
		testSentAt: timestamp("test_sent_at"),
		recipientCount: integer("recipient_count"),
		resendSegmentId: text("resend_segment_id"),
		resendImportId: text("resend_import_id"),
		resendBroadcastId: text("resend_broadcast_id"),
		scheduledAt: timestamp("scheduled_at"),
		sentAt: timestamp("sent_at"),
		/**
		 * Set when the send starts. True means test mode diverted it to the test
		 * inbox and no merchant received it. Kept so the record says so forever.
		 */
		sentInTestMode: boolean("sent_in_test_mode"),
		failureReason: text("failure_reason"),
		createdBy: text("created_by")
			.notNull()
			.references(() => user.id, { onDelete: "restrict" }),
		...timestamps,
	},
	(table) => [index("mail_campaigns_status_idx").on(table.status)]
);

/** Exactly who a campaign was sent to. One row per person, however many stores they run. */
export const mailCampaignRecipients = pgTable(
	"mail_campaign_recipients",
	{
		campaignId: uuid("campaign_id")
			.notNull()
			.references(() => mailCampaigns.id, { onDelete: "restrict" }),
		contactId: uuid("contact_id")
			.notNull()
			.references(() => mailContacts.id, { onDelete: "restrict" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [primaryKey({ columns: [table.campaignId, table.contactId] })]
);

/**
 * Resend's delivery webhooks, append-only. Idempotent on the Svix message id,
 * so Resend redelivering a webhook is a no-op.
 */
export const mailEmailEvents = pgTable(
	"mail_email_events",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		svixId: text("svix_id").notNull().unique(),
		resendEmailId: text("resend_email_id"),
		/** `email.delivered`, `email.opened`, ... as Resend names them. */
		type: text("type").notNull(),
		email: text("email"),
		contactId: uuid("contact_id").references(() => mailContacts.id, {
			onDelete: "restrict",
		}),
		campaignId: uuid("campaign_id").references(() => mailCampaigns.id, {
			onDelete: "restrict",
		}),
		appId: uuid("app_id").references(() => apps.id, {
			onDelete: "restrict",
		}),
		payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
		occurredAt: timestamp("occurred_at").notNull(),
		receivedAt: timestamp("received_at").defaultNow().notNull(),
	},
	(table) => [
		index("mail_email_events_campaign_idx").on(table.campaignId),
		index("mail_email_events_type_occurred_idx").on(
			table.type,
			table.occurredAt
		),
		index("mail_email_events_contact_idx").on(table.contactId),
	]
);
