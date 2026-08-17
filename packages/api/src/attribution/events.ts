import { normalizeShopDomain } from "@edgecoms/billing/partner-api";
import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import { merchantEvents } from "@edgecoms/db/schema/attribution";
import { merchants } from "@edgecoms/db/schema/merchants";
import { eq } from "drizzle-orm";

/**
 * SHOP LIFECYCLE EVENTS from the Edge apps.
 *
 * Append-only and idempotent on the app's own `idempotencyKey`, so a retried
 * delivery — or the nightly sweep re-asserting what it isn't sure landed — is a
 * no-op. Same discipline as `earning_events` on the Shopify transaction id.
 *
 * What this is FOR: an attribution that cannot be reconstructed later. A dropped
 * `subscription.activated` is an unpaid commission and an agency that stops
 * trusting our numbers, so the event is recorded even when the shop isn't a
 * merchant we track — `merchantId` is nullable and the domain is kept regardless.
 *
 * What this is NOT for: money, or state changes. Nothing here mutates a
 * merchant, a commission, or a binding. In particular `uninstalled` does NOT
 * unbind: a store leaving does not transfer a partner's book, and a reinstall
 * keeps its original attribution because the unique on `merchants.shop_domain`
 * still holds the row. Commission simply stops because no earning events arrive.
 */

export const SHOP_EVENT_TYPES = [
	"subscription.activated",
	"plan.changed",
	"uninstalled",
] as const;

export type ShopEventType = (typeof SHOP_EVENT_TYPES)[number];

export interface ShopEventInput {
	appSlug: string;
	/** The app's key for this delivery — the dedup rule. */
	idempotencyKey: string;
	occurredAt: Date;
	planHandle?: string | null;
	shopDomain: string;
	type: ShopEventType;
}

export type ShopEventOutcome =
	| {
			ok: true;
			/** `duplicate` = this key was already recorded; nothing changed. */
			status: "recorded" | "duplicate";
			merchantId: string | null;
	  }
	| { ok: false; status: "invalid_shop" };

export async function recordShopEvent(
	db: Database,
	input: ShopEventInput
): Promise<ShopEventOutcome> {
	let shopDomain: string;
	try {
		shopDomain = normalizeShopDomain(input.shopDomain);
	} catch {
		return { ok: false, status: "invalid_shop" };
	}

	const appSlug = input.appSlug.trim().toLowerCase();

	// Both lookups are best-effort: an event for a shop or app we don't track is
	// still worth mirroring, and refusing it would lose the only record that the
	// app tried to tell us something.
	const [merchantRows, appRows] = await Promise.all([
		db
			.select({ id: merchants.id })
			.from(merchants)
			.where(eq(merchants.shopDomain, shopDomain))
			.limit(1),
		db
			.select({ id: apps.id })
			.from(apps)
			.where(eq(apps.slug, appSlug))
			.limit(1),
	]);

	const merchantId = merchantRows[0]?.id ?? null;

	const inserted = await db
		.insert(merchantEvents)
		.values({
			idempotencyKey: input.idempotencyKey,
			shopDomain,
			merchantId,
			appSlug,
			appId: appRows[0]?.id ?? null,
			type: input.type,
			planHandle: input.planHandle?.trim() || null,
			occurredAt: input.occurredAt,
		})
		.onConflictDoNothing({ target: merchantEvents.idempotencyKey })
		.returning({ id: merchantEvents.id });

	return {
		ok: true,
		status: inserted[0] ? "recorded" : "duplicate",
		merchantId,
	};
}
