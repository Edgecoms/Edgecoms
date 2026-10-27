import {
	jsonResponse,
	parseJson,
	readSignedRequest,
} from "@edgecoms/api/attribution/http";
import { redeemPromo } from "@edgecoms/api/attribution/promos";
import { redeemPromoBody } from "@edgecoms/api/attribution/schemas";
import { db } from "@edgecoms/db";

/**
 * POST /api/v1/promos/redeem — redeem a promo code for one store in one app.
 *
 * Binds nothing (see docs/promo-codes.md). Idempotent per (code, shop, app).
 *
 *   200 — `{ ok: true, status, offer }`; `offer.appliesTo` is always "all"
 *   422 — the code is not usable: reason "expired", "other_code_used" (this
 *         store already redeemed a different promo code), or "invalid" for
 *         every other cause
 *   429 — too many attempts for this shop
 *
 * An app should ask /api/v1/codes/validate FIRST and only come here when that
 * says invalid: validate records nothing, while a miss here spends one of the
 * shop's attempts, so the other order would burn the budget on every partner
 * code a merchant pastes.
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

	const parsed = redeemPromoBody.safeParse(json.value);
	if (!parsed.success) {
		return jsonResponse({ error: "Invalid request body." }, 400);
	}

	const result = await redeemPromo(db, parsed.data);
	if (result.ok) {
		return jsonResponse(
			{ ok: true, status: result.status, offer: result.offer },
			200
		);
	}

	switch (result.status) {
		case "rate_limited":
			return jsonResponse(
				{ ok: false, reason: "rate_limited", message: "Too many attempts." },
				429
			);
		case "expired":
			return jsonResponse(
				{ ok: false, reason: "expired", message: "That code has expired." },
				422
			);
		case "other_code_used":
			return jsonResponse(
				{
					ok: false,
					reason: "other_code_used",
					message: "This store has already used a different code.",
				},
				422
			);
		case "invalid_shop":
			return jsonResponse({ error: "Invalid shop domain." }, 400);
		default:
			return jsonResponse(
				{ ok: false, reason: "invalid", message: "That code isn't valid." },
				422
			);
	}
}
