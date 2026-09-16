import { type Block, renderHtml, renderText } from "@edgecoms/mail/render";
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
	const heading = "Confirm your email for Edge Partners";
	const blocks: Block[] = [
		{
			text: "Confirm this is your address and your Edge Partners account is ready. If you were invited, this is also what links your invitation to your account.",
		},
		{ label: "Confirm my email", url: input.url },
		{
			text: "If you did not create an account, ignore this and nothing happens.",
		},
	];
	return {
		html: renderHtml(heading, blocks),
		subject: heading,
		text: renderText(heading, blocks),
		to: input.to,
	};
}

/** Sent on request. The link is single-use and expires. */
export function renderResetPasswordEmail(input: {
	to: string;
	url: string;
}): OutboundEmail {
	const heading = "Reset your Edge Partners password";
	const blocks: Block[] = [
		{
			text: "Somebody asked to reset the password on this account. If it was you, choose a new one here.",
		},
		{ label: "Choose a new password", url: input.url },
		{
			text: "The link works once and expires in an hour. If you did not ask for this, ignore it: your password has not changed and your earnings are untouched.",
		},
	];
	return {
		html: renderHtml(heading, blocks),
		subject: heading,
		text: renderText(heading, blocks),
		to: input.to,
	};
}
