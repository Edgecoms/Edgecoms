import { getProduct } from "@/lib/products";

/**
 * What the landing page, its form action and the skip link all agree on: where
 * a referred merchant is sent, and what the cookie is called.
 */

export const REF_COOKIE = "ec_ref";
export const REF_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;
export const PRODUCTS_PATH = "/products";

/**
 * Our own UTMs on the outgoing link, so a partner's traffic is identifiable in
 * the App Store's report as well as in ours. `utm_content` carries the channel
 * when there is one, because that is the field a partner filters on.
 */
export function withUtms(
	destination: string,
	code: string,
	content: string
): string {
	/* A path stays a path. Resolving `/products` against a hard-coded origin
	   would send a visitor on localhost or a preview deploy to production. */
	const relative = destination.startsWith("/");
	const url = new URL(destination, "https://relative.invalid");
	url.searchParams.set("utm_source", "edgecoms_partner");
	url.searchParams.set("utm_medium", "referral");
	url.searchParams.set("utm_campaign", code);
	url.searchParams.set("utm_content", content);
	return relative ? `${url.pathname}${url.search}` : url.toString();
}

/**
 * The App Store listing for one app, or our own product index when the link
 * covers every app and the merchant has not chosen one yet.
 */
export function appStoreUrlFor(appSlug: string | null): string {
	const product = appSlug ? getProduct(appSlug) : undefined;
	return product?.appStoreUrl ?? PRODUCTS_PATH;
}
