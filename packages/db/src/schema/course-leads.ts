import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "./_shared";

/**
 * MARKETING LEADS FROM THE COURSE SITE. NOT PART OF THE MONEY SYSTEM.
 *
 * Deliberately standalone: no foreign key to `partners`, `merchants`, or
 * anything else in the domain schema. A row here is a stranger who typed their
 * details into a landing page on another domain — it must never be mistaken for
 * an approved partner or a merchant, and nothing in the commission pipeline
 * reads this table.
 *
 * Idempotent on the normalised email. Someone who submits the form twice (or
 * double-clicks) updates their own row rather than creating a duplicate, so the
 * list stays a list of people rather than a list of submissions.
 *
 * PERSONAL DATA. Name, email and phone are personal data under GDPR/UK GDPR:
 * they are collected on consent, for the stated purpose of sending course
 * access, and a deletion request must actually delete the row. Do not start
 * joining this table to anything else without revisiting the notice shown on
 * the form.
 */
export const courseLeads = pgTable(
	"course_leads",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		/**
		 * Lowercased and trimmed before insert — the unique constraint is only a
		 * dedup rule if the value is normalised first, exactly like merchant
		 * domains elsewhere in this schema.
		 */
		email: text("email").notNull().unique(),
		name: text("name").notNull(),
		/** Stored as typed. Not normalised to E.164 — we do not know the country. */
		phone: text("phone").notNull(),
		/** Which page or campaign produced the lead, for attribution later. */
		source: text("source").default("course-landing").notNull(),
		/**
		 * Set when access has actually been delivered. Null means the person is
		 * still waiting — this column is the difference between "we captured a
		 * lead" and "we kept our promise", and it is the one to alert on.
		 */
		accessSentAt: timestamp("access_sent_at"),
		...timestamps,
	},
	(table) => [
		index("course_leads_created_at_idx").on(table.createdAt),
		index("course_leads_access_sent_at_idx").on(table.accessSentAt),
	]
);
