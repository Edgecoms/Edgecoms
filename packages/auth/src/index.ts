import { db } from "@edgecoms/db";
// biome-ignore lint/performance/noNamespaceImport: Better Auth's drizzle adapter needs the auth-table namespace.
import * as schema from "@edgecoms/db/schema/auth";
import { partners } from "@edgecoms/db/schema/partners";
import { env } from "@edgecoms/env/server";
import { sendEmail } from "@edgecoms/mail/send";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { renderResetPasswordEmail, renderVerifyEmail } from "./emails";

export function createAuth() {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",

			schema,
		}),
		trustedOrigins: [env.CORS_ORIGIN],
		emailAndPassword: {
			enabled: true,
			/**
			 * SELF-SERVE PASSWORD RESET.
			 *
			 * There was none, and no contact route either, so a partner who forgot
			 * their password was locked out of the only record of what they are
			 * owed. The sender never throws, so a mail outage cannot turn a reset
			 * request into an error page that leaks whether the address exists.
			 */
			sendResetPassword: async ({ user, url }) => {
				await sendEmail(renderResetPasswordEmail({ to: user.email, url }));
			},
			/* One hour, matching what the email tells the reader. */
			resetPasswordTokenExpiresIn: 60 * 60,
			/* A reset is what someone does when they think their login was taken.
			   Without this, whoever took it stays signed in to the payout
			   details after the password changes. */
			revokeSessionsOnPasswordReset: true,
		},
		/**
		 * EMAIL VERIFICATION, sent on signup.
		 *
		 * `requireEmailVerification` is deliberately NOT set. Nobody in production
		 * has ever verified an address, because verification did not exist, so
		 * requiring it would lock out every existing partner and the admin on the
		 * next deploy. Verification is instead what an INVITE depends on:
		 * `invites.accept` refuses an unverified account, so a stranger who signs
		 * up with an invited address without owning the inbox cannot claim the
		 * invitation or the rate it carries.
		 */
		emailVerification: {
			sendOnSignUp: true,
			autoSignInAfterVerification: true,
			sendVerificationEmail: async ({ user, url }) => {
				await sendEmail(renderVerifyEmail({ to: user.email, url }));
			},
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
