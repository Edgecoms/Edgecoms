import { bindAttribution } from "@edgecoms/api/attribution/bind";
import {
	jsonResponse,
	parseJson,
	readSignedRequest,
} from "@edgecoms/api/attribution/http";
import { createAttributionBody } from "@edgecoms/api/attribution/schemas";
import { db } from "@edgecoms/db";

/**
 * POST /api/v1/attributions — bind a store to a partner.
 *
 * The write. A merchant pasted a code into an Edge app; this is what records it.
 * See bindAttribution() for the invariants (one partner per shop permanent,
 * replays free, row lands `pending`, grandfathered apps captured from the app's
 * report).
 *
 * Status codes are chosen so an app can act on them without parsing prose:
 *   200 — bound, or already bound to this same partner (a replay)
 *   409 — the store is already claimed by a DIFFERENT partner
 *   422 — the code is not usable (one generic reason, always)
 *   429 — too many attempts for this shop
 *
 * 409 is distinguishable from 422 on purpose. It is not an enumeration leak: the
 * merchant owns the store and is entitled to know it is already registered,
 * which is also the only message that leads them anywhere useful.
 */
export async function POST(request: Request): Promise<Response> {
	const signed = await readSignedRequest(request);
	if (!signed.ok) {
		return signed.response;
	}

	const json = parseJson(signed.rawBody);
	if (!json.ok) {
		return json.response;
	}

	const parsed = createAttributionBody.safeParse(json.value);
	if (!parsed.success) {
		return jsonResponse({ error: "Invalid request body." }, 400);
	}

	const result = await bindAttribution(db, {
		code: parsed.data.code,
		shopDomain: parsed.data.shopDomain,
		shopifyGid: parsed.data.shopifyGid,
		shopName: parsed.data.shopName,
		boundByEmail: parsed.data.boundByEmail,
		appSlug: parsed.data.appSlug,
		paidAppSlugs: parsed.data.paidAppSlugs,
	});

	if (result.ok) {
		return jsonResponse(
			{
				ok: true,
				status: result.status,
				merchantId: result.merchantId,
				partner: result.partner,
				perk: result.perk,
				// The merchant earns nothing until an admin approves the row. Said
				// explicitly so an app can set the merchant's expectations honestly
				// rather than implying the link is already earning.
				merchantStatus: "pending",
			},
			200
		);
	}

	switch (result.status) {
		case "claimed_by_other":
			return jsonResponse(
				{
					ok: false,
					reason: "already_claimed",
					message: "This store is already registered to a partner.",
				},
				409
			);
		case "rate_limited":
			return jsonResponse(
				{ ok: false, reason: "rate_limited", message: "Too many attempts." },
				429
			);
		case "invalid_shop":
			return jsonResponse({ error: "Invalid shop domain." }, 400);
		default:
			return jsonResponse(
				{
					ok: false,
					reason: "invalid",
					message: "That code isn't valid.",
				},
				422
			);
	}
}
