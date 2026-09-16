import type { EmailDelivery, EmailSender } from "@edgecoms/api/context";
import { env } from "@edgecoms/env/server";
import { Resend } from "resend";
import { sendViaSmtp } from "./dev-smtp";

/**
 * DELIVERY for partner lifecycle email.
 *
 * Same two-transport shape as the Edge Cart playbook email, and for the same
 * reason: production goes through Resend's HTTPS API, and no configuration of
 * Resend can point at a local MailHog or Mailpit, so inspecting the real
 * message during development needs an SMTP path. `sendViaSmtp` refuses to run
 * when NODE_ENV is production, so a stray variable on a deployed instance
 * cannot divert a partner's approval into a socket nobody reads.
 *
 * NEVER THROWS. A partner approval writes to the money system; the email is a
 * courtesy on top of it. If Resend is down, the approval still stands and the
 * admin is told the mail did not go out. Losing the notification is recoverable
 * (resend it), rolling back an approval because of a mail outage is not.
 *
 * With neither RESEND_API_KEY nor PARTNER_SMTP_URL set, this returns "skipped":
 * the behaviour a preview deploy wants, where approving a seeded partner should
 * not mail a real person.
 */

function resolveTransport():
	| { kind: "none" }
	| { kind: "resend"; apiKey: string }
	| { kind: "smtp"; url: string } {
	if (env.PARTNER_SMTP_URL) {
		return { kind: "smtp", url: env.PARTNER_SMTP_URL };
	}
	if (env.RESEND_API_KEY) {
		return { kind: "resend", apiKey: env.RESEND_API_KEY };
	}
	return { kind: "none" };
}

export const sendPartnerEmail: EmailSender = async (
	email
): Promise<EmailDelivery> => {
	const from = env.PARTNER_FROM_EMAIL;
	if (!from) {
		console.warn(
			"partner_mail: PARTNER_FROM_EMAIL is unset; not sending partner email."
		);
		return "skipped";
	}

	const transport = resolveTransport();
	if (transport.kind === "none") {
		console.warn(
			"partner_mail: no transport configured; not sending partner email."
		);
		return "skipped";
	}

	if (transport.kind === "smtp") {
		try {
			await sendViaSmtp(transport.url, {
				from,
				html: email.html,
				subject: email.subject,
				text: email.text,
				to: email.to,
			});
			return "sent";
		} catch (error) {
			console.warn(`partner_mail: SMTP send failed: ${String(error)}`);
			return "failed";
		}
	}

	try {
		const { error } = await new Resend(transport.apiKey).emails.send({
			from,
			html: email.html,
			subject: email.subject,
			text: email.text,
			to: email.to,
		});

		if (error) {
			/* Resend answers 200 with an error body for the usual production
			   failures: unverified sending domain, revoked key, suppressed
			   address. Those land here rather than in the catch. */
			console.warn(
				`partner_mail: Resend rejected the send: ${error.name}: ${error.message}`
			);
			return "failed";
		}
		return "sent";
	} catch (error) {
		console.warn(`partner_mail: Resend threw: ${String(error)}`);
		return "failed";
	}
};
