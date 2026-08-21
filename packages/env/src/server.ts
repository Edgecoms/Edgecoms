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
	},
	runtimeEnv: process.env,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
