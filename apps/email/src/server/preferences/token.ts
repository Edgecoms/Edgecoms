import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@edgecoms/env/mail";

/**
 * The token in a preferences link: `<contactId>.<hmac>`.
 *
 * Stateless on purpose: no table, and a link in a year-old email still works.
 * The HMAC is what stops one merchant from editing another's preferences by
 * changing the id in the URL. No secret configured means no token and no
 * page (see `readPreferencesToken`), never an unsigned one.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function mac(secret: string, contactId: string): string {
	return createHmac("sha256", secret)
		.update(`preferences:${contactId}`)
		.digest("base64url");
}

export function signPreferencesToken(
	contactId: string,
	secret = env.EDGE_MAIL_PREFERENCES_SECRET
): string | null {
	return secret ? `${contactId}.${mac(secret, contactId)}` : null;
}

/** The contact id a token proves, or null for anything forged or malformed. */
export function readPreferencesToken(
	token: string,
	secret = env.EDGE_MAIL_PREFERENCES_SECRET
): string | null {
	if (!secret) {
		return null;
	}
	const [contactId, given, ...rest] = token.split(".");
	if (!(contactId && given) || rest.length > 0 || !UUID.test(contactId)) {
		return null;
	}
	const expected = Buffer.from(mac(secret, contactId));
	const actual = Buffer.from(given);
	if (expected.length !== actual.length) {
		return null;
	}
	return timingSafeEqual(expected, actual) ? contactId : null;
}

/** The full link, or null while the secret or the public URL is unset. */
export function preferencesUrl(contactId: string): string | null {
	const token = signPreferencesToken(contactId);
	if (!(token && env.EDGE_MAIL_URL)) {
		return null;
	}
	return new URL(`/preferences/${token}`, env.EDGE_MAIL_URL).toString();
}
