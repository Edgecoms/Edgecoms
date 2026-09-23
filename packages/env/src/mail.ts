import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Edge Mail's own settings. Separate from ./server so the partner platform's
 * deploy never needs them, and so no mail setting can be read by accident from
 * a process that is not Edge Mail.
 *
 * Every one is optional so the app boots without them, and each feature that
 * needs one FAILS CLOSED while it is unset: no webhook secret means the
 * webhook answers 503, no preferences secret means preference links 404, and
 * test mode is on unless it is explicitly turned off.
 */
export const env = createEnv({
	server: {
		// Svix signing secret for POST /api/webhooks/resend (`whsec_...`).
		RESEND_WEBHOOK_SECRET: z.string().min(1).optional(),
		// TEST MODE is ON unless this is exactly "off". A deploy that forgot the
		// variable must mail the test inbox, never real merchants.
		EDGE_MAIL_TEST_MODE: z.string().optional(),
		// Where every message goes while test mode is on. Unset while test mode
		// is on means nothing is sent to Resend at all.
		EDGE_MAIL_TEST_RECIPIENT: z.email().optional(),
		// Signs the token in a preferences link. Separate from BETTER_AUTH_SECRET
		// so rotating one never invalidates the other.
		EDGE_MAIL_PREFERENCES_SECRET: z.string().min(32).optional(),
		// This app's public origin, for links written into emails.
		EDGE_MAIL_URL: z.url().optional(),
	},
	runtimeEnv: process.env,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});

/** Whether outbound mail is diverted to the test inbox. On unless "off". */
export function isTestMode(): boolean {
	return env.EDGE_MAIL_TEST_MODE !== "off";
}

const MIN_APP_SECRET_LENGTH = 32;

/**
 * The HMAC secret an Edge app signs its events with, from
 * `EDGE_MAIL_SECRET_<SLUG>` (slug upper-cased, `-` to `_`), the same shape as
 * `PARTNER_API_GID_<SLUG>`. One secret per app, so a leaked secret speaks for
 * one app only and can be rotated alone.
 *
 * Read per call rather than through createEnv because the key set follows the
 * app catalog. A secret shorter than 32 characters counts as unset: one that
 * "works" at six characters is worse than an app that is refused.
 */
export function appSecret(slug: string): string | null {
	const key = `EDGE_MAIL_SECRET_${slug.toUpperCase().replaceAll("-", "_")}`;
	const value = process.env[key];
	return value && value.length >= MIN_APP_SECRET_LENGTH ? value : null;
}
