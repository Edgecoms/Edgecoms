import { publicProcedure, router } from "@edgecoms/api";
import { mailContacts } from "@edgecoms/db/schema/mail";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { readPreferencesToken } from "../preferences/token";
import { syncContactTopics } from "../resend";

/**
 * The merchant's own preferences page. No session: the signed token IS the
 * credential, and it proves exactly one contact. Every failure is the same
 * NOT_FOUND, so a forged token learns nothing.
 */
export const preferencesRouter = router({
	save: publicProcedure
		.input(
			z.object({
				education: z.boolean(),
				marketing: z.boolean(),
				productUpdates: z.boolean(),
				token: z.string().min(1).max(200),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const contactId = readPreferencesToken(input.token);
			if (!contactId) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Link not valid." });
			}
			const [contact] = await ctx.db
				.update(mailContacts)
				.set({
					education: input.education,
					marketing: input.marketing,
					preferencesSetAt: new Date(),
					productUpdates: input.productUpdates,
				})
				.where(eq(mailContacts.id, contactId))
				.returning();
			if (!contact) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Link not valid." });
			}
			// The DB is what campaigns read, so the choice holds even if this sync
			// fails; the next campaign's import sets the topic again anyway.
			await syncContactTopics(contact);
			return { ok: true };
		}),
});
