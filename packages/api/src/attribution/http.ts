import { env } from "@edgecoms/env/server";
import { SIGNATURE_HEADER, TIMESTAMP_HEADER, verifySignature } from "./hmac";

/**
 * The HTTP edge for the attribution endpoints.
 *
 * These are the platform's only session-less write paths, so the shape of every
 * refusal matters more than usual:
 *
 *   • No secret configured → 503, not "allow". A deploy missing the secret must
 *     not quietly accept unsigned writes.
 *   • Any signature problem → one 401 with one message. Which header was wrong,
 *     whether the timestamp was stale, whether the digest merely mismatched —
 *     none of that goes back over the wire.
 *   • The raw body is read as TEXT and handed on. Callers must not re-serialize
 *     before verifying: the MAC covers the exact bytes, and JSON round-tripping
 *     changes them.
 */

export function jsonResponse(body: unknown, status: number): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
			// These endpoints are machine-to-machine and must never be cached by
			// anything between the app and us.
			"Cache-Control": "no-store",
		},
	});
}

export type SignedRequest =
	| { ok: true; rawBody: string }
	| { ok: false; response: Response };

/**
 * Verify the shared-secret signature and return the raw body on success.
 *
 * The returned `rawBody` is the exact text that was signed — parse it after
 * this call, never before.
 */
export async function readSignedRequest(
	request: Request
): Promise<SignedRequest> {
	const secret = env.EDGE_PARTNERS_SECRET;
	if (!secret) {
		return {
			ok: false,
			response: jsonResponse(
				{ error: "Attribution endpoints are not configured." },
				503
			),
		};
	}

	const rawBody = await request.text();
	const verdict = verifySignature({
		secret,
		rawBody,
		signature: request.headers.get(SIGNATURE_HEADER),
		timestamp: request.headers.get(TIMESTAMP_HEADER),
	});

	if (!verdict.ok) {
		// Deliberately uniform. `verdict.reason` is for our logs, not the caller's.
		return {
			ok: false,
			response: jsonResponse({ error: "Invalid signature." }, 401),
		};
	}

	return { ok: true, rawBody };
}

/** Parse the verified body as JSON, or hand back a 400. */
export function parseJson(
	rawBody: string
): { ok: true; value: unknown } | { ok: false; response: Response } {
	try {
		return { ok: true, value: JSON.parse(rawBody) };
	} catch {
		return {
			ok: false,
			response: jsonResponse({ error: "Malformed JSON body." }, 400),
		};
	}
}
