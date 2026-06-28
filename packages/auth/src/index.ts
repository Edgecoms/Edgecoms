import { db } from "@edgecoms/db";
// biome-ignore lint/performance/noNamespaceImport: Better Auth's drizzle adapter needs the auth-table namespace.
import * as schema from "@edgecoms/db/schema/auth";
import { partners } from "@edgecoms/db/schema/partners";
import { env } from "@edgecoms/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export function createAuth() {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",

			schema,
		}),
		trustedOrigins: [env.CORS_ORIGIN],
		emailAndPassword: {
			enabled: true,
		},
		user: {
			additionalFields: {
				role: {
					type: "string",
					required: false,
					// New sign-ups are partners by default. `input: false` means a
					// client CANNOT set this at sign-up — admins are minted by the
					// admin script only, never via self-registration.
					defaultValue: "partner",
					input: false,
				},
			},
		},
		databaseHooks: {
			user: {
				create: {
					// Every sign-up is a partner (role default + input:false). Provision
					// their pending partner profile atomically with the user, so the
					// partnerProcedure always finds a profile. Admins are minted by the
					// create-admin script, which removes this row after promotion.
					after: async (createdUser) => {
						await db
							.insert(partners)
							.values({ userId: createdUser.id, status: "pending" })
							.onConflictDoNothing({ target: partners.userId });
					},
				},
			},
		},
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		plugins: [nextCookies()],
	});
}

export const auth = createAuth();
