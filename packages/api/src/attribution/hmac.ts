import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Request signing for the app→platform attribution endpoints.
 *
 * Same shape as Shopify's own webhook signing, deliberately: an HMAC-SHA256 over
 * `<timestamp>.<raw body>` with a shared secret, sent as `X-Edge-Signature` /
 * `X-Edge-Timestamp`. Reusing a scheme the Edge apps already implement for
 * Shopify webhooks means one fewer novel thing to get wrong on either side.
 *
 * The signed string includes the timestamp so a captured body cannot be
 * replayed later under its original signature — the timestamp is covered by the
 * MAC, so an attacker can't move it forward.
 *
 * NOTE: the MAC is over the RAW BODY BYTES. A handler that parses JSON first and
 * re-serializes it will compute a different digest for a semantically identical
 * body (key order, whitespace, number formatting). Always read the raw text.
 */

/** Requests are rejected outside this window either side of now. */
export const MAX_CLOCK_SKEW_MS = 5 * 60_000;

export const SIGNATURE_HEADER = "x-edge-signature";
export const TIMESTAMP_HEADER = "x-edge-timestamp";

/**
 * The exact string that gets signed. Exported so a caller (or a test, or an app)
 * cannot drift from the verifier on this detail.
 */
export function signingString(timestamp: string, rawBody: string): string {
	return `${timestamp}.${rawBody}`;
}

/** Lower-case hex HMAC-SHA256. */
export function signPayload(
	secret: string,
	timestamp: string,
	rawBody: string
): string {
	return createHmac("sha256", secret)
		.update(signingString(timestamp, rawBody))
		.digest("hex");
}

export type SignatureFailure =
	| "missing_signature"
	| "missing_timestamp"
	| "malformed_timestamp"
	| "stale_timestamp"
	| "bad_signature";

export type SignatureVerdict =
	| { ok: true }
	| { ok: false; reason: SignatureFailure };

/**
 * Constant-time hex comparison.
 *
 * `timingSafeEqual` throws on length mismatch, which would itself leak length
 * through an exception path — so the length check happens first and returns a
 * plain false. Digest length is fixed and public anyway (64 hex chars for
 * SHA-256); it is the CONTENT that must not leak byte-by-byte.
 */
function hexEquals(a: string, b: string): boolean {
	if (a.length !== b.length) {
		return false;
	}
	try {
		return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
	} catch {
		// Non-hex input — `Buffer.from(…, "hex")` truncates silently rather than
		// throwing, so a length mismatch here means the string wasn't valid hex.
		return false;
	}
}

/**
 * Verify a signed request.
 *
 * Fails closed on every uncertainty: a missing header, an unparseable
 * timestamp, a stale one, or a digest that doesn't match. The caller maps any
 * failure to a 401 and must NOT tell the client which of these it was.
 */
export function verifySignature(args: {
	secret: string;
	rawBody: string;
	signature: string | null;
	timestamp: string | null;
	now?: Date;
}): SignatureVerdict {
	if (!args.signature) {
		return { ok: false, reason: "missing_signature" };
	}
	if (!args.timestamp) {
		return { ok: false, reason: "missing_timestamp" };
	}

	// Unix seconds. Anything else — including a millisecond timestamp, which
	// would otherwise read as the year 57000 and pass a naive future check — is
	// malformed.
	const seconds = Number(args.timestamp);
	if (!(Number.isFinite(seconds) && Number.isInteger(seconds))) {
		return { ok: false, reason: "malformed_timestamp" };
	}

	const now = (args.now ?? new Date()).getTime();
	// Absolute skew: a timestamp far in the FUTURE is as suspect as a stale one,
	// and accepting it would extend a captured signature's replay window.
	if (Math.abs(now - seconds * 1000) > MAX_CLOCK_SKEW_MS) {
		return { ok: false, reason: "stale_timestamp" };
	}

	const expected = signPayload(args.secret, args.timestamp, args.rawBody);
	if (!hexEquals(expected, args.signature.trim().toLowerCase())) {
		return { ok: false, reason: "bad_signature" };
	}
	return { ok: true };
}
