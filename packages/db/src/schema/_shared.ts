import {
	bigint,
	integer,
	pgEnum,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

/**
 * Shared column builders for the domain schema.
 *
 * Money is ALWAYS stored as an integer in minor units (bigint), never a float,
 * and every amount is accompanied by a 3-char ISO currency code. See CLAUDE.md
 * "Money correctness".
 */

/** A monetary amount in minor units (e.g. cents). Never a float. */
export const moneyMinor = (name: string) =>
	bigint(name, { mode: "bigint" }).notNull();

/** A 3-char ISO-4217 currency code that accompanies a money amount. */
export const currencyCode = (name = "currency") =>
	varchar(name, { length: 3 }).notNull();

/** Standard created/updated timestamps applied to every mutable domain row. */
export const timestamps = {
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
};

/**
 * What kind of price cut a code grants on the Enterprise plan.
 *
 * `free_cycles` is distinct from `percentage` at 10000 bps on purpose: Shopify
 * documents no maximum discount percentage, so a true 100% may have to ship as
 * `trialDays` rather than a discount line. Those are different API calls
 * app-side, so they are different kinds here rather than one kind the app has
 * to reinterpret. See docs/partner-plan-discounts.md "Step 0".
 *
 * `none` is the default and the Phase 1 behaviour: a code that grants nothing.
 */
export const discountKind = pgEnum("discount_kind", [
	"none",
	"percentage",
	"fixed",
	"free_cycles",
]);

/**
 * Discount terms, shared by the code that offers them and the merchant row that
 * freezes them. Integers only, per CLAUDE.md "Money correctness" — basis points
 * for a percentage, minor units for a fixed amount. Shopify wants a decimal
 * (0.2 for 20%); that conversion happens app-side at the Shopify boundary and
 * never in this database.
 *
 * Nullable throughout because `kind` decides which fields are meaningful:
 * `percentage` reads `bps`, `fixed` reads `amountMinor` + `currency`,
 * `free_cycles` reads only `cycles`.
 *
 * Lives here rather than in partners.ts because merchants.ts needs it too, and
 * those two modules already import each other for their relations.
 */
export const discountTerms = {
	discountKind: discountKind("discount_kind").default("none").notNull(),
	/** 10000 = 100%. Integer basis points, never a float. */
	discountBps: integer("discount_bps"),
	/** Fixed reduction in minor units, with its currency. */
	discountAmountMinor: bigint("discount_amount_minor", { mode: "bigint" }),
	discountCurrency: varchar("discount_currency", { length: 3 }),
	/** Billing intervals the discount survives. Null = indefinite. */
	discountCycles: integer("discount_cycles"),
};
