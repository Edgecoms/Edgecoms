import { db } from "@edgecoms/db";
import { marketingLeads } from "@edgecoms/db/schema/marketing";
import { eq } from "drizzle-orm";

/**
 * Writing a marketing lead down.
 *
 * Lives in `@edgecoms/api` rather than in the web app because this is the
 * package that owns `drizzle-orm`. The marketing site has no direct drizzle
 * dependency, and importing one into it resolves a second copy of the library
 * whose types are structurally identical but nominally incompatible.
 *
 * The address is the asset. The email is nice to receive but it can be resent
 * tomorrow, whereas a lead we failed to record is gone the moment the visitor
 * closes the tab. So the order in the route is: save, then send, then stamp
 * that we sent.
 *
 * Every function here reports failure rather than throwing. A landing page
 * taking paid traffic must not return a 500 because a pool was exhausted; the
 * caller falls back to writing the whole lead into the log, where it is at
 * least recoverable by hand.
 */

export interface LeadInput {
	email: string;
	product: string;
	source: string;
	storeUrl?: string;
}

/**
 * Insert the lead. Returns its id, or null if the write failed.
 *
 * Append-only: a repeat submission from the same address is a new row. See the
 * table comment for why that is deliberate.
 */
export async function saveLead(input: LeadInput): Promise<string | null> {
	try {
		const [row] = await db
			.insert(marketingLeads)
			.values({
				email: input.email.trim().toLowerCase(),
				product: input.product,
				source: input.source,
				storeUrl: input.storeUrl?.trim() || null,
			})
			.returning({ id: marketingLeads.id });

		return row?.id ?? null;
	} catch {
		/* The caller logs the full lead instead, so it is recoverable by hand. */
		return null;
	}
}

/**
 * Stamp the row once the playbook has actually left.
 *
 * Separate from the insert because it is only knowable afterwards, and because
 * a null here is the only thing that can tell "they ignored the email" apart
 * from "we never managed to send it".
 */
export async function markPlaybookSent(leadId: string): Promise<void> {
	try {
		await db
			.update(marketingLeads)
			.set({ playbookSentAt: new Date() })
			.where(eq(marketingLeads.id, leadId));
	} catch {
		/* The lead is saved and the email is sent; only the stamp is missing.
		   Not worth surfacing to a visitor who has already seen "check your
		   inbox", and the send is visible in Resend's own log either way. */
	}
}
