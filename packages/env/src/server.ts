import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		// Shopify Partner API credentials for the billing-sync job. Optional so
		// the app/db boot without them; the worker and admin "Run sync" assert
		// their presence at call time.
		PARTNER_API_ORGANIZATION_ID: z.string().optional(),
		PARTNER_API_ACCESS_TOKEN: z.string().optional(),
		PARTNER_API_VERSION: z.string().optional(),
		// Shared secret the Edge apps sign attribution requests with (HMAC-SHA256
		// over `<timestamp>.<raw body>`). Optional so the site boots without it;
		// the /api/v1 endpoints answer 503 while it is unset, which is the
		// fail-closed behaviour — an unsigned write must never be accepted.
		// Length is asserted here rather than at call time: a 6-character secret
		// that "works" is worse than a deploy that refuses to start.
		EDGE_PARTNERS_SECRET: z.string().min(32).optional(),
		// Meta Conversions API — the server-side half of ad attribution. The
		// browser pixel and this endpoint report the same events under the same
		// event_id; Meta collapses the pair, so the numbers do not double.
		//
		// Optional, and a *soft* failure unlike EDGE_PARTNERS_SECRET above. That
		// one guards a write to the money system and must fail closed; this only
		// reports to an ad platform. Losing analytics is not worth a 503 on a
		// marketing page, so no token simply means the browser pixel runs alone.
		META_CAPI_ACCESS_TOKEN: z.string().min(1).optional(),
		// Graph API version. Meta supports each for roughly two years; v26.0 was
		// current as of September 2026. Pinned rather than floating so a Meta
		// release never silently changes the payload shape underneath us.
		META_GRAPH_API_VERSION: z
			.string()
			.regex(/^v\d+\.\d+$/, "Expected a Graph API version like v26.0")
			.default("v26.0"),
		// Set temporarily to route events to Events Manager → Test Events instead
		// of the live dataset. Verifying the wiring should never cost real data.
		META_CAPI_TEST_EVENT_CODE: z.string().optional(),
		// Resend — the transactional sender behind the Edge Cart playbook form.
		// Optional so the site boots without it, and a soft failure like the Meta
		// token above rather than a hard one like EDGE_PARTNERS_SECRET: this sends
		// a marketing PDF, it does not guard a write to the money system. Unset
		// means the endpoint accepts the lead, logs it, and sends nothing, which
		// is the behaviour a preview deploy wants.
		RESEND_API_KEY: z.string().min(1).optional(),
		// The From address on the playbook email, e.g. `Anurag
		// <anurag@edgecoms.app>`. The domain must be the site's own sending
		// domain (edgecoms.app) AND verified in Resend, which refuses to send
		// from a domain it has no DKIM/SPF records for. Separate from the key so
		// the sending identity can change without rotating credentials.
		//
		// A display name is allowed here because this is the `From:` HEADER. The
		// SMTP envelope may not carry one; see `envelopeAddress` in dev-smtp.ts.
		EDGE_CART_FROM_EMAIL: z.string().min(1).optional(),
		// Local mail catcher (MailHog, Mailpit) as `smtp://localhost:1025`. When
		// set, the playbook email goes here instead of to Resend, so the real
		// message can be inspected without sending anything to a real inbox.
		// A DEVELOPMENT TOOL: `sendViaSmtp` refuses to run when NODE_ENV is
		// production, so setting this on a deployed instance cannot silently
		// divert merchant email into a socket nobody reads.
		EDGE_CART_SMTP_URL: z
			.string()
			.regex(/^smtp:\/\//, "Expected an smtp:// URL")
			.optional(),
		// The From address on partner lifecycle email (invite, approval), e.g.
		// `Edge Partners <partners@edgecoms.app>`. Separate from
		// EDGE_CART_FROM_EMAIL because these are different conversations from
		// different senders: one is a marketing lead magnet, this one tells an
		// agency what commission rate they are on. Unset means partner email is
		// skipped and the admin is told so, and approval itself still succeeds.
		PARTNER_FROM_EMAIL: z.string().min(1).optional(),
		// Optional Reply-To for partner email. Unset in production: every email
		// names the contact address in its text instead (packages/mail/src/
		// contact.ts). Unset means replies go to PARTNER_FROM_EMAIL, which
		// receives no mail.
		PARTNER_REPLY_TO: z.string().min(1).optional(),
		// The salt for hashing a referral click's IP address. The raw address is
		// never stored; the hash is what counts one visitor once a day and stops
		// a flood. Unset means clicks are recorded with NO hash at all rather
		// than with a guessable one: an unsalted hash of an IP is a reversible
		// record of who visited. Falls back to BETTER_AUTH_SECRET so a deploy
		// that has not set it still hashes, rather than storing nothing.
		REFERRAL_IP_SALT: z.string().min(16).optional(),
		// Local mail catcher for partner email, as `smtp://localhost:1025`. When
		// set it WINS over Resend, so a developer cannot accidentally mail a real
		// agency while testing an approval. `sendViaSmtp` refuses to run when
		// NODE_ENV is production.
		PARTNER_SMTP_URL: z
			.string()
			.regex(/^smtp:\/\//, "Expected an smtp:// URL")
			.optional(),
	},
	runtimeEnv: process.env,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
