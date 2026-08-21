import { z } from "zod";
import { SHOP_EVENT_TYPES } from "./events";

/**
 * Request shapes for the app→platform attribution endpoints.
 *
 * Bounded on every string. These are the only unauthenticated-by-session
 * endpoints in the platform — HMAC proves the caller holds the shared secret,
 * but it does not make the body trustworthy — so nothing here is open-ended.
 */

const CODE = z.string().min(1).max(64);
const SHOP = z.string().min(1).max(255);
const APP_SLUG = z.string().min(1).max(64);
const GID = z.string().max(255).nullish();
const IDEMPOTENCY_KEY = z.string().min(1).max(128);

export const validateCodeBody = z.object({
	code: CODE,
	shopDomain: SHOP,
	shopifyGid: GID,
	/** Which app is asking. Optional here; recorded for context only. */
	appSlug: APP_SLUG.optional(),
});

export type ValidateCodeBody = z.infer<typeof validateCodeBody>;

export const createAttributionBody = z.object({
	code: CODE,
	shopDomain: SHOP,
	shopifyGid: GID,
	shopName: z.string().max(255).nullish(),
	boundByEmail: z.string().max(320).nullish(),
	/**
	 * Required on a write: the shared secret does not identify WHICH Edge app is
	 * calling, and "this shop was already paying for something" is meaningless
	 * without knowing who reported it.
	 */
	appSlug: APP_SLUG,
	/**
	 * Edge app slugs the shop was already paying for. These become the merchant's
	 * grandfathered set and never earn. Capped: a shop cannot be paying for more
	 * apps than the catalogue holds, so a long list is a malformed caller.
	 */
	paidAppSlugs: z.array(z.string().max(64)).max(50).optional(),
	/**
	 * Accepted for contract compatibility with the app-side plan, and ignored on
	 * purpose. The real idempotency key is the shop domain: its unique constraint
	 * is what makes a replay a no-op, and it holds even across a caller that
	 * generates a fresh key on every retry.
	 */
	idempotencyKey: IDEMPOTENCY_KEY.optional(),
	boundAt: z.iso.datetime().optional(),
});

export type CreateAttributionBody = z.infer<typeof createAttributionBody>;

export const shopEventBody = z.object({
	shopDomain: SHOP,
	appSlug: APP_SLUG,
	type: z.enum(SHOP_EVENT_TYPES),
	planHandle: z.string().max(120).nullish(),
	occurredAt: z.iso.datetime(),
	/** Required: this IS the dedup key for the event log. */
	idempotencyKey: IDEMPOTENCY_KEY,
});

export type ShopEventBody = z.infer<typeof shopEventBody>;
