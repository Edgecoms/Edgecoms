import {
	jsonResponse,
	parseJson,
	readSignedRequest,
} from "@edgecoms/api/attribution/http";
import { resolveAttributionBody } from "@edgecoms/api/attribution/schemas";
import { resolveAttribution } from "@edgecoms/api/referrals/resolve";
import { db } from "@edgecoms/db";

/**
 * POST /api/v1/attributions/resolve — "does this shop belong to a partner?"
 *
 * Called by an Edge app when a shop installs it, with no code involved. The
 * answer comes from the rules in referrals/resolve.ts, in order: an existing
 * attribution stays, then a live claim from a referral landing page, then
 * nothing. A hashed address can only produce a SUGGESTION for an admin.
 *
 * Statuses an app can act on without reading prose:
 *   `existing`      the shop already belongs to a partner. Nothing changed.
 *   `attributed`    the claim was honoured; the store is now pending approval.
 *   `suggested`     recorded for an admin. Treat exactly like `none`.
 *   `none`          no partner. Show the code box as usual.
 *   `self_referral` the claim was the partner's own store, and was refused.
 *
 * Every one of them is a 200: none is an error, and an app that installed
 * successfully must not see a failure because nobody referred the store.
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

	const parsed = resolveAttributionBody.safeParse(json.value);
	if (!parsed.success) {
		return jsonResponse({ error: "Invalid request body." }, 400);
	}

	const outcome = await resolveAttribution(db, {
		appSlug: parsed.data.appSlug,
		ipHash: parsed.data.ipHash ?? null,
		paidAppSlugs: parsed.data.paidAppSlugs,
		shop: parsed.data.shop,
	});

	if (outcome.status === "invalid_shop") {
		return jsonResponse({ error: "Unusable shop domain." }, 400);
	}

	if (outcome.status === "none") {
		return jsonResponse({ ok: true, partner: null, status: "none" }, 200);
	}

	/* The partner's NAME reaches the app because the app shows it to the
	   merchant ("referred by ..."), the same field the bind response carries.
	   Nothing else about the partner does. */
	return jsonResponse(
		{
			merchantId: "merchantId" in outcome ? outcome.merchantId : null,
			ok: true,
			partner: { name: outcome.partner.name },
			status: outcome.status,
		},
		200
	);
}
