import { relations } from "drizzle-orm";
import {
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { currencyCode, moneyMinor, timestamps } from "./_shared";
import { commissions } from "./earnings";
import { partners } from "./partners";

export const payoutStatus = pgEnum("payout_status", ["pending", "paid"]);

/**
 * A payout groups a partner's payable commissions for a period into one paid
 * batch. `totalAmount` is the sum of the grouped commissions' amounts in a
 * single currency — commissions are grouped by partner + period + currency, so
 * a payout never mixes currencies. There is intentionally no unique constraint
 * on (partner, period): a late-arriving transaction for an already-paid period
 * forms a follow-up payout rather than mutating a settled one.
 */
export const payouts = pgTable(
	"payouts",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		partnerId: uuid("partner_id")
			.notNull()
			.references(() => partners.id, { onDelete: "restrict" }),
		periodMonth: text("period_month").notNull(),
		totalAmount: moneyMinor("total_amount"),
		currency: currencyCode(),
		status: payoutStatus("status").default("pending").notNull(),
		reference: text("reference"),
		notes: text("notes"),
		paidAt: timestamp("paid_at"),
		...timestamps,
	},
	(table) => [
		index("payouts_partner_idx").on(table.partnerId),
		index("payouts_status_idx").on(table.status),
		index("payouts_period_idx").on(table.periodMonth),
	]
);

export const payoutsRelations = relations(payouts, ({ one, many }) => ({
	partner: one(partners, {
		fields: [payouts.partnerId],
		references: [partners.id],
	}),
	commissions: many(commissions),
}));
