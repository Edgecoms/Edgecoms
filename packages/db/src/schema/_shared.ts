import { bigint, timestamp, varchar } from "drizzle-orm/pg-core";

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
