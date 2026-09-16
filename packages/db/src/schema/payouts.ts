import { relations, sql } from "drizzle-orm";
import {
	bigint,
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { currencyCode, moneyMinor, timestamps } from "./_shared";
import { user } from "./auth";
import { commissions } from "./earnings";
import { merchants } from "./merchants";
import { partners } from "./partners";

export const payoutStatus = pgEnum("payout_status", ["pending", "paid"]);

/**
 * How the money actually moved.
 *
 * Worth recording rather than inferring: six months later a payout row should
 * say whether it was a domestic transfer, an outward remittance, or an invoice
 * link somebody paid by hand, because those reconcile against completely
 * different evidence.
 */
export const payoutMethod = pgEnum("payout_method", [
	"bank_transfer",
	"upi",
	"wire",
	"payment_link",
	"other",
]);

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
		/** GROSS: the whole of what the partner earned for this group. */
		totalAmount: moneyMinor("total_amount"),
		currency: currencyCode(),
		/**
		 * Tax withheld at source, in the same currency as `totalAmount`.
		 *
		 * India requires it — commission to a resident under 194H, to a
		 * non-resident under 195 — which means the amount transferred is not the
		 * amount earned. Without this column the ledger claims a partner was
		 * paid in full while their bank shows less, and that gap is the dispute
		 * CLAUDE.md opens by warning about. Zero when nothing is withheld.
		 */
		// `sql` rather than `0n`: drizzle-kit serializes the default into its
		// snapshot as JSON, and JSON has no bigint.
		withheldAmount: bigint("withheld_amount", { mode: "bigint" })
			.default(sql`0`)
			.notNull(),
		/** What was actually sent: `totalAmount - withheldAmount`. */
		netAmount: moneyMinor("net_amount"),
		status: payoutStatus("status").default("pending").notNull(),
		method: payoutMethod("method"),
		/**
		 * WHAT LANDED, when the partner is paid in a different currency from the
		 * one they earned in.
		 *
		 * No FX RATE column on purpose. A rate is a ratio, and storing one either
		 * invites a float into the money path or forces a precision decision
		 * nobody will remember. The pair (netAmount, settledAmount) says exactly
		 * the same thing — "we owed $328, we sent ₹27,400" — in integers, and the
		 * rate is derivable from it whenever anybody actually wants it.
		 */
		settledAmount: bigint("settled_amount", { mode: "bigint" }),
		settledCurrency: varchar("settled_currency", { length: 3 }),
		/** The bank UTR, wire reference, or the id of a link that was paid. */
		reference: text("reference"),
		/** Free text for the withholding: section, rate, certificate number. */
		withholdingNote: text("withholding_note"),
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

export const partnerBonusStatus = pgEnum("partner_bonus_status", [
	"pending",
	"paid",
	"revoked",
]);

/**
 * A DISCRETIONARY BONUS -- money for a partner with no earning event behind it.
 *
 * Every other payment in this system traces to a Shopify charge: an earning
 * event, one commission, a frozen rate. A bonus has none of that, which is
 * exactly why it is a separate table rather than a commission row with the
 * lineage nulled out. `commissions.earning_event_id` is NOT NULL and there is
 * one commission per event; a bonus would break both, and the append-only
 * ledger that mirrors the Partner API must keep mirroring only that.
 *
 * ISSUED BY A PERSON, ALWAYS. There is no rule that mints these. Nothing is
 * owed to a partner who has not been given one, which is what keeps a bonus
 * discretionary instead of a published promise the business has to honour for
 * everybody who hits the same number.
 *
 * It RIDES THE MONTHLY PAYOUT. `periodMonth` says which one, and `payouts.pay`
 * sums bonuses alongside commissions for the same (partner, period, currency),
 * so a partner gets one payment and the payout total is the whole of what they
 * were paid. A bonus in another currency waits for that currency's payout
 * rather than being converted.
 *
 * `reason` is shown to the partner. A payment nobody can explain is worse than
 * no payment, so it is not nullable.
 *
 * Amounts are immutable once issued: there is no update path. A bonus given in
 * error is `revoked` while still pending, and a paid bonus is history.
 */
export const partnerBonuses = pgTable(
	"partner_bonuses",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		// restrict, like every other money row: a partner with payment history
		// cannot be deleted out from under it.
		partnerId: uuid("partner_id")
			.notNull()
			.references(() => partners.id, { onDelete: "restrict" }),
		amount: moneyMinor("amount"),
		currency: currencyCode(),
		/** Why, in words the partner will read on their own screen. */
		reason: text("reason").notNull(),
		/** Which monthly payout this rides. */
		periodMonth: text("period_month").notNull(),
		status: partnerBonusStatus("status").default("pending").notNull(),
		payoutId: uuid("payout_id").references(() => payouts.id, {
			onDelete: "set null",
		}),
		paidAt: timestamp("paid_at"),
		/**
		 * Which rung of the milestone ladder this pays for, or null for a
		 * discretionary bonus an admin chose to give.
		 *
		 * The unique index below is what makes a milestone pay ONCE per partner,
		 * ever. It is a database guarantee rather than a query the awarder runs
		 * first, so two concurrent sweeps cannot both decide a rung is unpaid.
		 */
		milestoneKey: text("milestone_key"),
		/**
		 * The store a per-store bounty was paid for, so the ledger can name it
		 * rather than parsing it back out of `milestoneKey`. Null for a rung
		 * award or a discretionary bonus.
		 *
		 * restrict, like every money row: a store that earned somebody a bounty
		 * is history.
		 */
		merchantId: uuid("merchant_id").references(() => merchants.id, {
			onDelete: "restrict",
		}),
		/**
		 * Who authorised money leaving the business. NULL for a milestone award:
		 * the programme owed it, nobody chose it. Paired with `milestoneKey`
		 * being non-null, so the two cases are never ambiguous.
		 */
		// restrict: an issuer is audit history and cannot be deleted away.
		issuedBy: text("issued_by").references(() => user.id, {
			onDelete: "restrict",
		}),
		...timestamps,
	},
	(table) => [
		index("partner_bonuses_partner_idx").on(table.partnerId),
		// Serves the payout grouping, which reads
		// (partner, period, currency, status) on every run.
		index("partner_bonuses_payable_idx").on(
			table.partnerId,
			table.periodMonth,
			table.currency,
			table.status
		),
		// One award per rung per partner, forever.
		//
		// NOT partial. Postgres treats NULLs as distinct in a unique index, so
		// discretionary bonuses (milestone_key null) never conflict with each
		// other and an admin may give as many as they like -- the same behaviour
		// a `WHERE milestone_key is not null` predicate would buy, without the
		// cost: ON CONFLICT cannot infer a conflict target from a partial index
		// unless the statement repeats the predicate, and getting that wrong
		// fails at runtime with 42P10 rather than at compile time.
		uniqueIndex("partner_bonuses_milestone_uq").on(
			table.partnerId,
			table.milestoneKey
		),
	]
);

export const partnerBonusesRelations = relations(partnerBonuses, ({ one }) => ({
	partner: one(partners, {
		fields: [partnerBonuses.partnerId],
		references: [partners.id],
	}),
	payout: one(payouts, {
		fields: [partnerBonuses.payoutId],
		references: [payouts.id],
	}),
	issuer: one(user, {
		fields: [partnerBonuses.issuedBy],
		references: [user.id],
	}),
}));

export const payoutsRelations = relations(payouts, ({ one, many }) => ({
	partner: one(partners, {
		fields: [payouts.partnerId],
		references: [partners.id],
	}),
	commissions: many(commissions),
	bonuses: many(partnerBonuses),
}));
