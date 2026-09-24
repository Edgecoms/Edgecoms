import { adminProcedure, router } from "@edgecoms/api";
import { mailContacts } from "@edgecoms/db/schema/mail";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { syncContactTopics } from "../resend";

export const contactsRouter = router({
	/**
	 * Opt a contact out of everything, for a merchant who asked support to stop
	 * the email. Deliberately one-way: an admin can never opt anybody IN, because
	 * that would be manufacturing consent. Opting in is the merchant's, on the
	 * preferences page.
	 */
	optOut: adminProcedure
		.input(z.object({ contactId: z.uuid() }))
		.mutation(async ({ ctx, input }) => {
			const [contact] = await ctx.db
				.update(mailContacts)
				.set({ education: false, marketing: false, productUpdates: false })
				.where(eq(mailContacts.id, input.contactId))
				.returning();
			if (!contact) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Unknown contact" });
			}
			// DB first: the opt-out holds even if Resend is unreachable, and every
			// campaign reads the DB, not Resend, to pick recipients.
			const topics = await syncContactTopics(contact);
			return { ok: true, topics };
		}),
});
