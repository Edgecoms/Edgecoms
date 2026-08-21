import {
	jsonResponse,
	parseJson,
	readSignedRequest,
} from "@edgecoms/api/attribution/http";
import { previewCode } from "@edgecoms/api/attribution/preview";
import { validateCodeBody } from "@edgecoms/api/attribution/schemas";
import { db } from "@edgecoms/db";

/**
 * POST /api/v1/codes/validate — read-only code check.
 *
 * Split from the bind so an app can show the merchant who they're about to be
 * linked to BEFORE they commit, and so this path can be rate-limited hard
 * without touching the write. See previewCode() for why it records nothing.
 *
 * Every rejection answers `{ valid: false, reason: "invalid" }`. Unknown,
 * disabled, expired, exhausted and "partner not approved" are indistinguishable
 * from outside.
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

	const parsed = validateCodeBody.safeParse(json.value);
	if (!parsed.success) {
		return jsonResponse({ error: "Invalid request body." }, 400);
	}

	const preview = await previewCode(db, {
		code: parsed.data.code,
		shopDomain: parsed.data.shopDomain,
		appSlug: parsed.data.appSlug,
	});

	if (!preview.ok) {
		return preview.status === "rate_limited"
			? jsonResponse({ error: "Too many attempts." }, 429)
			: jsonResponse({ error: "Invalid shop domain." }, 400);
	}

	if (!preview.valid) {
		return jsonResponse({ valid: false, reason: "invalid" }, 200);
	}

	return jsonResponse(
		{
			valid: true,
			partner: preview.partner,
			// Phase 1 codes carry no discount terms. Credit issuance (Phase 2) is
			// what will populate this; until then a code must not imply a price cut
			// nothing can honour. See docs/partner-attribution-codes.md.
			offer: preview.offer,
			perk: preview.perk,
		},
		200
	);
}
