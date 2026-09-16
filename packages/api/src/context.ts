import { auth } from "@edgecoms/auth";
import { db } from "@edgecoms/db";
import type { EmailSender } from "@edgecoms/mail/types";
import type { NextRequest } from "next/server";

/* Re-exported so existing imports from this module keep working. */
export type {
	EmailDelivery,
	EmailSender,
	OutboundEmail,
} from "@edgecoms/mail/types";

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
