import { createHash, randomBytes } from "node:crypto";
import { partnerInvites, partners } from "@edgecoms/db/schema/partners";
import { TRPCError } from "@trpc/server";
import { and, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { renderInviteClaimedEmail } from "../email/partner-emails";
import { protectedProcedure, publicProcedure, router } from "../index";

/**
 * PARTNER INVITE REDEMPTION: the two endpoints the signup link needs.
 *
 * Issuing invites is an admin operation and lives in routers/admin.ts. This
 * file is the other end: an invited agency clicking the link in their email.
 *
 * `peek` is PUBLIC because it runs before the account exists. The register
 * page uses it to pre-fill the address so the partner cannot accidentally sign
 * up as somebody else. It therefore returns the bare minimum and returns the
 * SAME null for every failure (unknown token, expired, revoked, already
 * accepted), so the endpoint cannot be used to enumerate invite tokens or
 * confirm which agencies we are talking to.
 *
 * `accept` is authenticated, and the acceptance does NOT grant anything: it
 * links the invite to the pending partner row that signup already created.
 * Commission still waits on an admin pressing approve. CLAUDE.md: "approval
 * remains the money gate."
 */

/**
 * How long a signup link stays usable.
 *
 * Seven rather than fourteen: the token is the only secret protecting an
 * invite, it travels in a URL that can be forwarded, and a shorter window is
 * the one mitigation available without verifying the address itself.
 */
export const INVITE_TTL_DAYS = 7;

/** Bytes of entropy in a raw invite token. */
const INVITE_TOKEN_BYTES = 32;

/**
 * Hashes a raw token for storage and lookup.
 *
 * SHA-256 with no salt, deliberately: the token is 256 bits of CSPRNG output,
 * not a human-chosen password, so there is no dictionary to defend against and
 * lookup has to be by exact hash. Salting would make it unsearchable.
 */
export function hashInviteToken(token: string): string {
	return createHash("sha256").update(token).digest("hex");
}

/** A fresh token: the raw form for the email, the hash for the row. */
export function createInviteToken(): { hash: string; token: string } {
	const token = randomBytes(INVITE_TOKEN_BYTES).toString("base64url");
	return { hash: hashInviteToken(token), token };
}

export const invitesRouter = router({
	/**
	 * What address is this signup link for? Null for anything not live.
	 *
	 * Returns no rate, no inviter, no invite id. A link that leaks out must not
	 * disclose what we intend to pay anybody.
	 */
	peek: publicProcedure
		.input(z.object({ token: z.string().min(16).max(400) }))
		.query(async ({ ctx, input }) => {
			const invite = await ctx.db.query.partnerInvites.findFirst({
				columns: { companyName: true, email: true },
				where: and(
					eq(partnerInvites.tokenHash, hashInviteToken(input.token)),
					eq(partnerInvites.status, "sent"),
					gt(partnerInvites.expiresAt, new Date())
				),
			});

			return invite ?? null;
		}),

	/**
	 * Link a live invite to the caller's freshly created partner row.
	 *
	 * Called by the register page immediately after signup. Idempotent from the
	 * caller's point of view: a second call with a spent token reports
	 * `claimed: false` rather than failing the signup that already succeeded.
	 *
	 * The invite is bound to its EMAIL as well as its token. A forwarded link
	 * cannot be redeemed by a third party who signed up with their own address,
	 * which matters because the invite carries a rate an admin proposed for a
	 * specific agency.
	 */
	accept: protectedProcedure
		.input(z.object({ token: z.string().min(16).max(400) }))
		.mutation(async ({ ctx, input }) => {
			/**
			 * THE ADDRESS HAS TO BE PROVEN FIRST.
			 *
			 * The invite is bound to its address, so signing up with a different
			 * email cannot claim it. What that binding could not establish is that
			 * the person signing up with the invited address actually owns that
			 * inbox: the token travels in a URL that can be forwarded, and the
			 * address is not a secret. Verification is the proof. Until then the
			 * invitation, and the rate it carries, stays unclaimed.
			 */
			if (!ctx.session.user.emailVerified) {
				throw new TRPCError({
					code: "PRECONDITION_FAILED",
					message:
						"Confirm your email address first. We sent you a link when you signed up.",
				});
			}

			const tokenHash = hashInviteToken(input.token);

			const partner = await ctx.db.query.partners.findFirst({
				where: eq(partners.userId, ctx.session.user.id),
			});
			if (!partner) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "No partner profile for this account",
				});
			}

			const outcome = await ctx.db.transaction(async (tx) => {
				const invite = await tx.query.partnerInvites.findFirst({
					where: and(
						eq(partnerInvites.tokenHash, tokenHash),
						eq(partnerInvites.status, "sent"),
						gt(partnerInvites.expiresAt, new Date())
					),
				});

				/* Not an error: the account exists either way, and failing here
				   would strand a partner who double-submitted or refreshed. */
				if (!invite) {
					return { claimed: false };
				}

				if (
					invite.email.toLowerCase() !== ctx.session.user.email.toLowerCase()
				) {
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "This invitation was sent to a different email address.",
					});
				}

				await tx
					.update(partnerInvites)
					.set({
						status: "accepted",
						acceptedAt: new Date(),
						acceptedPartnerId: partner.id,
					})
					.where(
						and(
							eq(partnerInvites.id, invite.id),
							/* Re-assert liveness inside the write so two concurrent
							   accepts cannot both claim one invite. */
							eq(partnerInvites.status, "sent")
						)
					);

				/* The admin knew the agency name before the partner typed one.
				   Only fills a blank, never overwriting what the partner set. */
				if (invite.companyName && !partner.companyName) {
					await tx
						.update(partners)
						.set({ companyName: invite.companyName })
						.where(
							and(
								eq(partners.id, partner.id),
								sql`${partners.companyName} is null`
							)
						);
				}

				return {
					claimed: true,
					company: invite.companyName,
					notify: invite.email,
				};
			});

			/**
			 * Tell the invited address that its invitation was used.
			 *
			 * After the commit, and it can never fail the claim: the account
			 * exists either way, and a lost notification is recoverable where a
			 * rolled-back signup is just broken. See `renderInviteClaimedEmail`
			 * for why this exists at all.
			 */
			if (outcome.claimed && outcome.notify && ctx.sendEmail) {
				try {
					await ctx.sendEmail(
						renderInviteClaimedEmail({
							companyName: outcome.company ?? null,
							to: outcome.notify,
						})
					);
				} catch {
					/* Swallowed on purpose. */
				}
			}

			return { claimed: outcome.claimed };
		}),
});
