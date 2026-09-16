/**
 * One transactional email, rendered and ready to send.
 *
 * Lives in the mail package rather than beside the templates so that every
 * package that sends mail -- auth for verification and password reset, the API
 * for partner lifecycle messages -- shares one shape without depending on each
 * other.
 */
export interface OutboundEmail {
	html: string;
	subject: string;
	text: string;
	to: string;
}

/** What became of one message. A sender resolves to one of these; it never throws. */
export type EmailDelivery = "failed" | "sent" | "skipped";

/**
 * Delivers one message.
 *
 * Contract: RESOLVES on failure rather than throwing. Mail is never allowed to
 * fail the operation that triggered it -- an approval, a payout, a signup --
 * because losing a notification is recoverable and rolling back the write that
 * caused it is not.
 */
export type EmailSender = (email: OutboundEmail) => Promise<EmailDelivery>;
