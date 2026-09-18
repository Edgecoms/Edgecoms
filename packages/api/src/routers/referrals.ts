import { z } from "zod";
import { adminProcedure, partnerProcedure, router } from "../index";
import { listSuggestions, rejectClaim } from "../referrals/claims";
import {
	createLink,
	listPartnerLinks,
	setLinkActive,
	setLinkSlug,
} from "../referrals/manage";
import { approveClaim } from "../referrals/resolve";

/**
 * REFERRAL LINK MANAGEMENT.
 *
 * Two routers over the same rules (see ../referrals/manage.ts). The difference
 * is scope and one field: an admin names the partner and may set a custom
 * address, a partner is always themselves and gets a derived one. `partnerId`
 * for a partner comes from `ctx.partner`, resolved from the session, so a
 * client cannot create or disable a link for somebody else.
 */

const APP_SLUG_MAX = 60;
const SUB_ID_MAX = 60;
const SLUG_INPUT_MAX = 60;

const appSlugInput = z.string().min(2).max(APP_SLUG_MAX).nullish();
const subIdInput = z.string().max(SUB_ID_MAX).nullish();

export const adminReferralsRouter = router({
	/**
	 * Matches found by hashed address and never acted on. Approving one lands
	 * the store exactly as an honoured claim does: pending, earning from today,
	 * and refused outright if the shop already belongs to somebody.
	 */
	suggestions: router({
		approve: adminProcedure
			.input(z.object({ claimId: z.guid() }))
			.mutation(async ({ ctx, input }) => {
				const outcome = await approveClaim(ctx.db, input.claimId);
				return { status: outcome.status };
			}),

		dismiss: adminProcedure
			.input(z.object({ claimId: z.guid() }))
			.mutation(async ({ ctx, input }) => {
				await rejectClaim(ctx.db, input.claimId);
				return { ok: true };
			}),

		list: adminProcedure.query(({ ctx }) => listSuggestions(ctx.db)),
	}),

	links: router({
		create: adminProcedure
			.input(
				z.object({
					appSlug: appSlugInput,
					partnerId: z.guid(),
					/** Admin only: the vanity address for this link. */
					slug: z.string().max(SLUG_INPUT_MAX).nullish(),
					subId: subIdInput,
				})
			)
			.mutation(({ ctx, input }) =>
				createLink(ctx.db, {
					appSlug: input.appSlug ?? null,
					partnerId: input.partnerId,
					slug: input.slug ?? null,
					subId: input.subId ?? null,
				})
			),

		list: adminProcedure
			.input(z.object({ partnerId: z.guid() }))
			.query(({ ctx, input }) => listPartnerLinks(ctx.db, input.partnerId)),

		setActive: adminProcedure
			.input(z.object({ isActive: z.boolean(), linkId: z.guid() }))
			.mutation(async ({ ctx, input }) => {
				await setLinkActive(ctx.db, input.linkId, input.isActive);
				return { ok: true };
			}),

		setSlug: adminProcedure
			.input(
				z.object({
					linkId: z.guid(),
					slug: z.string().min(1).max(SLUG_INPUT_MAX),
				})
			)
			.mutation(async ({ ctx, input }) => ({
				slug: await setLinkSlug(ctx.db, input.linkId, input.slug),
			})),
	}),
});

export const partnerLinksRouter = router({
	create: partnerProcedure
		.input(z.object({ appSlug: appSlugInput, subId: subIdInput }))
		.mutation(({ ctx, input }) =>
			createLink(ctx.db, {
				appSlug: input.appSlug ?? null,
				partnerId: ctx.partner.id,
				subId: input.subId ?? null,
			})
		),

	list: partnerProcedure.query(({ ctx }) =>
		listPartnerLinks(ctx.db, ctx.partner.id)
	),

	setActive: partnerProcedure
		.input(z.object({ isActive: z.boolean(), linkId: z.guid() }))
		.mutation(async ({ ctx, input }) => {
			await setLinkActive(ctx.db, input.linkId, input.isActive, ctx.partner.id);
			return { ok: true };
		}),
});
