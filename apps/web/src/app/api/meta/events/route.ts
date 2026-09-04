import { env as webEnv } from "@edgecoms/env/web";
import { cookies, headers } from "next/headers";

import {
	capiRequestBody,
	clientIp,
	deriveFbc,
	isSameOrigin,
	sendToConversionsApi,
} from "@/lib/meta-capi";

/**
 * POST /api/meta/events — the server-side leg of the Meta Pixel.
 *
 * The browser reports each event twice: once through `fbevents.js` and once
 * here. Both carry the same `event_id`, so Meta collapses them into one. The
 * point of the second copy is the visitors whose browsers drop the first --
 * iOS, Safari's ITP and ad blockers between them hide a large slice of real
 * conversions, and this path is first-party, so none of them touch it.
 *
 * Three deliberate choices:
 *
 * - **It always answers 204.** This is an analytics beacon fired with
 *   `keepalive` from a page that is usually mid-navigation. Nobody reads the
 *   response, and a body would only ever leak what the endpoint knows. The
 *   flip side is that a refusal is indistinguishable from a success from out
 *   here, which is why the guards are unit-tested in `lib/meta-capi.ts` and
 *   why Events Manager, not this response, is where you confirm it works.
 * - **It fails soft.** Unlike `/api/v1/*`, which guards the money system and
 *   fails closed, a missing token or an unreachable Meta means the browser
 *   pixel simply runs alone. An ad report is not worth an error page.
 * - **It is not a general relay.** The route is public, so an open one would
 *   let a stranger post invented conversions into the dataset the ad spend is
 *   judged on. Same-origin only, and only the events the site actually fires.
 */

const NO_CONTENT = 204;

function noContent(): Response {
	return new Response(null, { status: NO_CONTENT });
}

export async function POST(request: Request): Promise<Response> {
	const pixelId = webEnv.NEXT_PUBLIC_META_PIXEL_ID;
	if (!pixelId) {
		return noContent();
	}

	const headerList = await headers();
	if (!isSameOrigin(headerList.get("origin"), headerList.get("host"))) {
		return noContent();
	}

	let json: unknown;
	try {
		json = await request.json();
	} catch {
		return noContent();
	}

	const parsed = capiRequestBody.safeParse(json);
	if (!parsed.success) {
		return noContent();
	}

	const cookieStore = await cookies();
	const now = Date.now();

	await sendToConversionsApi(
		{
			name: parsed.data.name,
			eventId: parsed.data.eventId,
			sourceUrl: parsed.data.sourceUrl,
			customData: parsed.data.params,
			userData: {
				fbp: cookieStore.get("_fbp")?.value,
				/**
				 * The cookie when `fbevents.js` has had a chance to set it, and the
				 * `fbclid` fallback when it has not -- which is exactly the case on
				 * the landing page view of an ad click, the one that matters most.
				 */
				fbc:
					cookieStore.get("_fbc")?.value ??
					deriveFbc(parsed.data.sourceUrl, now),
				clientIpAddress: clientIp(
					headerList.get("x-forwarded-for"),
					headerList.get("x-real-ip")
				),
				clientUserAgent: headerList.get("user-agent") ?? undefined,
			},
		},
		pixelId,
		now
	);

	return noContent();
}
