import { renderEmail } from "@edgecoms/mail/render";
import type { OutboundEmail } from "@edgecoms/mail/types";

/**
 * THE TWO ACCOUNT EMAILS: proving an address, and getting back in.
 *
 * Neither existed before, because the mail transport lived in the web app and
 * this package could not reach it. That left a partner who forgot their
 * password locked out of their own earnings, and left an invite link claimable
 * by anybody who signed up with the invited address without owning the inbox.
 *
 * Deliberately short. Each one has exactly one job and one link.
 */

/** Sent on signup. Proving the address is what makes an invite claimable. */
export function renderVerifyEmail(input: {
	to: string;
	url: string;
}): OutboundEmail {
	return renderEmail(
		{
			blocks: [
				{
					kind: "paragraph",
					text: "Confirm this is your address and your Edge Partners account is ready. If you were invited, this also links your invitation to your account.",
				},
				{ kind: "button", label: "Confirm my email", url: input.url },
				{
					kind: "small",
					text: "Did not create an account? Ignore this and nothing happens.",
				},
			],
			heading: "Confirm your email",
			preheader: `One click to confirm ${input.to}.`,
			subject: "Confirm your email for Edge Partners",
		},
		input.to
	);
}

/** Sent on request. The link is single-use and expires. */
export function renderResetPasswordEmail(input: {
	to: string;
	url: string;
}): OutboundEmail {
	return renderEmail(
		{
			blocks: [
				{
					kind: "paragraph",
					text: "Somebody asked to reset the password on your Edge Partners account. If it was you, choose a new one.",
				},
				{ kind: "button", label: "Choose a new password", url: input.url },
				{
					kind: "small",
					text: "The link works once and expires in an hour. Did not ask for this? Ignore it: your password has not changed and your earnings are untouched.",
				},
			],
			heading: "Reset your password",
			preheader: "This link works once and expires in an hour.",
			subject: "Reset your Edge Partners password",
		},
		input.to
	);
}
