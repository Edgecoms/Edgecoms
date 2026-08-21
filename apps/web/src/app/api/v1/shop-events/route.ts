import { recordShopEvent } from "@edgecoms/api/attribution/events";
import {
	jsonResponse,
	parseJson,
	readSignedRequest,
} from "@edgecoms/api/attribution/http";
import { shopEventBody } from "@edgecoms/api/attribution/schemas";
import { db } from "@edgecoms/db";

/**
 * POST /api/v1/shop-events — the lifecycle stream from the Edge apps.
 *
 * `subscription.activated` | `plan.changed` | `uninstalled`, appended to
 * `merchant_events` and idempotent on the app's `idempotencyKey`.
 *
 * Records only. Nothing here mutates a merchant, a binding, or money —
 * `uninstalled` in particular does NOT unbind (see recordShopEvent). A duplicate
 * answers 200 with `status: "duplicate"` rather than an error, because the
 * correct client behaviour on a retry is to stop retrying, not to escalate.
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

	const parsed = shopEventBody.safeParse(json.value);
	if (!parsed.success) {
		return jsonResponse({ error: "Invalid request body." }, 400);
	}

	const result = await recordShopEvent(db, {
		idempotencyKey: parsed.data.idempotencyKey,
		shopDomain: parsed.data.shopDomain,
		appSlug: parsed.data.appSlug,
		type: parsed.data.type,
		planHandle: parsed.data.planHandle,
		occurredAt: new Date(parsed.data.occurredAt),
	});

	if (!result.ok) {
		return jsonResponse({ error: "Invalid shop domain." }, 400);
	}

	return jsonResponse(
		{
			ok: true,
			status: result.status,
			// null when the shop isn't a merchant we track. The event is still
			// recorded — that gap is exactly what the reconciliation sweep looks for.
			merchantId: result.merchantId,
		},
		200
	);
}
