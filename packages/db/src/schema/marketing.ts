import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * MARKETING LEADS — people who asked for something from a marketing page.
 *
 * Deliberately separate from everything else in this schema. `merchants`,
 * `partners` and `earning_events` describe the money system: rows there have a
 * commission consequence and an authorization boundary. A row here is somebody
 * who typed an email address into a landing page. Mixing the two would put
 * unauthenticated public writes into the same tables the payout ledger reads,
 * and it would let a marketing form's uptime requirements leak into the
 * money system's.
 *
 * So: no foreign keys into the domain tables, no money columns, no status
 * anybody bills from. If a lead later becomes a merchant, that happens through
 * the ordinary attribution path and the two are matched on the shop domain by
 * whoever is doing the matching, not by a join this table pretends to support.
 *
 * **Append-only**, like `merchant_events` and `code_redemption_attempts`. A
 * second submission from the same address is a new row, not an update: someone
 * asking twice usually means the first email did not arrive, and that is a fact
 * worth keeping rather than one to overwrite. The mailing list is a
 * `SELECT DISTINCT`, not this table read raw.
 */
export const marketingLeads = pgTable(
	"marketing_leads",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		/**
		 * As submitted, lowercased and trimmed. NOT unique: see the append-only
		 * note above.
		 */
		email: text("email").notNull(),
		/** Which app page the form was on, e.g. `edge-cart`. */
		product: text("product").notNull(),
		/** Which button opened the dialog: `hero`, `setup-callout`, `final-cta`. */
		source: text("source").notNull(),
		/**
		 * Free text, exactly as the merchant typed it. Never normalized to a
		 * canonical `.myshopify.com` domain, because unlike `merchants.shopDomain`
		 * nothing is keyed on it and a normalizer that rejects "acme.com" would
		 * throw away the lead to enforce a shape no query needs.
		 */
		storeUrl: text("store_url"),
		/**
		 * When the playbook email actually left. Null means it did not: no Resend
		 * key configured, or the send failed. That distinction is the difference
		 * between "they ignored us" and "we never wrote to them", and only this
		 * column can answer it.
		 */
		playbookSentAt: timestamp("playbook_sent_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		/** The mailing list, and "did this person already ask?". */
		index("marketing_leads_email_idx").on(table.email),
		/** "How many leads did the Edge Cart page take last week, and from where?" */
		index("marketing_leads_product_idx").on(
			table.product,
			table.source,
			table.createdAt
		),
	]
);
