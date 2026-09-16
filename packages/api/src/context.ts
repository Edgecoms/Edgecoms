import { auth } from "@edgecoms/auth";
import { db } from "@edgecoms/db";
import type { NextRequest } from "next/server";
import type { OutboundEmail } from "./email/partner-emails";

/** What became of one message. Never throws: see `EmailSender`. */
export type EmailDelivery = "failed" | "sent" | "skipped";

/**
 * Delivers one transactional email.
 *
 * INJECTED rather than imported, because this package must not depend on the
 * Next app that owns the Resend client, and because a test of a money path has
 * to be able to assert "this approval mails the partner" without a network.
 *
 * Contract: it RESOLVES on failure rather than throwing, returning "failed".
 * Mail is never allowed to fail an approval or a payout. See `notify` in
 * routers/admin.ts, which also runs every send after the transaction commits.
 */
export type EmailSender = (email: OutboundEmail) => Promise<EmailDelivery>;

/**
 * Per-request tRPC context. `session` is resolved from the Better Auth cookies;
 * `db` is the shared Drizzle client. Authorization (role checks, tenant scoping)
 * is layered on top of this in the procedure hierarchy — see ./index.ts.
 *
 * `sendEmail` is optional: unset means this context cannot send, and every
 * caller treats that as "skipped" rather than an error. That is what keeps the
 * existing router tests, which build a context by hand, working unchanged.
 */
export async function createContext(req: NextRequest, sendEmail?: EmailSender) {
	const session = await auth.api.getSession({
		headers: req.headers,
	});

	return {
		db,
		sendEmail,
		session,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
