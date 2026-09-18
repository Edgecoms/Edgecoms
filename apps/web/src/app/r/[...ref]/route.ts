import {
	classifyUserAgent,
	hashIp,
	recordClick,
} from "@edgecoms/api/referrals/clicks";
import { normalizeSubId, resolveReferral } from "@edgecoms/api/referrals/links";
import { db } from "@edgecoms/db";
import { env } from "@edgecoms/env/server";
import { type NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";

/**
 * GET /r/<code or slug>[/<app slug>] — a partner's referral link.
 *
 * The front of the partner funnel. Every click is recorded (see
 * @edgecoms/api/referrals/clicks) and the visitor is sent on to the Shopify App
 * Store with our UTMs, so the App Store's own report agrees with ours.
 *
 * WHAT THIS ROUTE DOES NOT DO: bind anything. A click is not an attribution. A
 * store becomes a partner's when a code is entered in an Edge app, and the
 * install-time claim that Phase 2 adds is still checked against that same rule.
 * Nothing here can make a merchant somebody's.
 *
 * An address that resolves to nothing (unknown code, disabled link, a partner
 * who is no longer approved) records NO click and sends the visitor to the
 * product pages. A click that could never convert is noise, not data.
 *
 * Phase 2 puts the branded landing page in front of this redirect. Until then
 * the route behaves the way the "skip" link will: straight through, tracked.
 */

/** Never cached: every request must reach the recorder. */
export const dynamic = "force-dynamic";

const COOKIE_NAME = "ec_ref";
const COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
const PRODUCTS_PATH = "/products";

/** The caller's address, as the platform in front of us reports it. */
function clientIp(request: NextRequest): string | null {
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0]?.trim() ?? null;
	}
	return request.headers.get("x-real-ip");
}

function country(request: NextRequest): string | null {
	return (
		request.headers.get("x-vercel-ip-country") ??
		request.headers.get("cf-ipcountry")
	);
}

/**
 * Our own UTMs on the outgoing link, so a partner's traffic is identifiable in
 * the App Store's report as well as in ours. `utm_content` carries the channel
 * when there is one, because that is the field a partner filters on.
 */
function withUtms(destination: string, code: string, content: string): string {
	const url = new URL(destination);
	url.searchParams.set("utm_source", "edgecoms_partner");
	url.searchParams.set("utm_medium", "referral");
	url.searchParams.set("utm_campaign", code);
	url.searchParams.set("utm_content", content);
	return url.toString();
}

function destinationFor(appSlug: string | null, origin: string): string {
	const product = appSlug ? getProduct(appSlug) : undefined;
	return product?.appStoreUrl ?? new URL(PRODUCTS_PATH, origin).toString();
}

function noStore(response: NextResponse): NextResponse {
	response.headers.set("cache-control", "no-store, max-age=0");
	return response;
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ ref: string[] }> }
): Promise<NextResponse> {
	const { ref } = await params;
	const origin = request.nextUrl.origin;
	const first = ref[0] ?? "";
	/* A second segment is only an app when it names a real one. Anything else
	   is a typo, and a typo should still reach the partner's landing page. */
	const named = ref[1] ? getProduct(ref[1]) : undefined;
	const query = request.nextUrl.searchParams;
	const subId = normalizeSubId(query.get("s") ?? "");

	const resolved = await resolveReferral(db, {
		appSlug: named?.slug ?? null,
		ref: first,
		subId,
	});

	if (!resolved) {
		return noStore(
			NextResponse.redirect(new URL(PRODUCTS_PATH, origin), { status: 302 })
		);
	}

	const facts = classifyUserAgent(request.headers.get("user-agent"));
	const click = await recordClick(db, {
		appSlug: resolved.appSlug,
		country: country(request),
		deviceType: facts.deviceType,
		ipHash: hashIp(
			clientIp(request),
			env.REFERRAL_IP_SALT ?? env.BETTER_AUTH_SECRET ?? null
		),
		isBot: facts.isBot,
		linkId: resolved.link?.id ?? null,
		partnerId: resolved.partnerId,
		referrer: request.headers.get("referer"),
		subId: resolved.subId,
		userAgent: request.headers.get("user-agent"),
		utmCampaign: query.get("utm_campaign"),
		utmContent: query.get("utm_content"),
		utmMedium: query.get("utm_medium"),
		utmSource: query.get("utm_source"),
		utmTerm: query.get("utm_term"),
	});

	const response = NextResponse.redirect(
		withUtms(
			destinationFor(resolved.appSlug, origin),
			resolved.code,
			resolved.subId ?? resolved.appSlug ?? "all-apps"
		),
		{ status: 302 }
	);

	/**
	 * The referral, carried on the visitor's own browser for 30 days. Read at
	 * install time in Phase 2, alongside the store URL they type. It holds
	 * `code:linkId:clickId`: the code credits the partner, the link credits the
	 * channel, and the click is what a claim points back at. None of the three
	 * identifies a person.
	 */
	response.cookies.set({
		httpOnly: true,
		maxAge: COOKIE_MAX_AGE_SECONDS,
		name: COOKIE_NAME,
		path: "/",
		sameSite: "lax",
		secure: origin.startsWith("https://"),
		value: `${resolved.code}:${resolved.link?.id ?? ""}:${click.clickId ?? ""}`,
	});

	return noStore(response);
}
