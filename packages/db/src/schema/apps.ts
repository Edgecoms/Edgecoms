import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "./_shared";
import { partnerAppRates } from "./partners";

/**
 * The Edge app catalog. `partnerApiGid` is the Shopify Partner API app GID and
 * is how an incoming `transactions` row is mapped back to an Edge app — it is
 * the Shopify-side identity, kept stable and unique. Seeded, not user-created.
 */
export const apps = pgTable("apps", {
	id: uuid("id").primaryKey().defaultRandom(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	partnerApiGid: text("partner_api_gid").notNull().unique(),
	...timestamps,
});

export const appsRelations = relations(apps, ({ many }) => ({
	partnerRates: many(partnerAppRates),
}));
