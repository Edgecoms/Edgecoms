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
	/**
	 * A walkthrough for partners setting this app up on a merchant's store.
	 *
	 * Nullable on purpose: the recordings do not exist for every app yet, and a
	 * partner portal that links a video which 404s is worse than one that says
	 * the walkthrough is coming. The partner screen renders the honest empty
	 * state until an admin pastes a URL.
	 *
	 * Only the URL lives here. Everything else a partner reads about an app --
	 * what it does, the metric it moves, the icon -- comes from the marketing
	 * catalog in `apps/web/src/lib/products.ts`, keyed by `slug`, so the portal
	 * and the public site cannot describe the same app differently.
	 */
	setupVideoUrl: text("setup_video_url"),
	...timestamps,
});

export const appsRelations = relations(apps, ({ many }) => ({
	partnerRates: many(partnerAppRates),
}));
