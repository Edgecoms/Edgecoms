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
	},
	runtimeEnv: process.env,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
