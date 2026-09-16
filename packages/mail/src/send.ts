import { env } from "@edgecoms/env/server";
import { Resend } from "resend";
import { sendViaSmtp } from "./smtp";
import type { EmailDelivery, EmailSender } from "./types";

/**
 * DELIVERY for every transactional email the platform sends: partner lifecycle
 * messages, email verification, and password reset.
 *
 * It lives in its own package because `@edgecoms/auth` needs to send mail too,
 * and auth cannot depend on the Next app or on the API. Before this, the
 * transport sat in apps/web, which is why there was no password reset and no
 * way to verify an address: the one package that owns those flows could not
 * reach a sender.
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

export const sendEmail: EmailSender = async (email): Promise<EmailDelivery> => {
	const from = env.PARTNER_FROM_EMAIL;
	if (!from) {
		console.warn("mail: PARTNER_FROM_EMAIL is unset; not sending.");
		return "skipped";
	}

	const transport = resolveTransport();
	if (transport.kind === "none") {
		console.warn("mail: no transport configured; not sending.");
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
			console.warn(`mail: SMTP send failed: ${String(error)}`);
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
				`mail: Resend rejected the send: ${error.name}: ${error.message}`
			);
			return "failed";
		}
		return "sent";
	} catch (error) {
		console.warn(`mail: Resend threw: ${String(error)}`);
		return "failed";
	}
};
