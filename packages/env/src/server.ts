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
	},
	runtimeEnv: process.env,
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
