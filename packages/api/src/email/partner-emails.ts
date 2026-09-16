/**
 * PARTNER LIFECYCLE EMAIL: the two messages a partner actually needs.
 *
 * Before this existed, approval was silent: a partner applied, and the only way
 * to learn the outcome was to log in and guess. These cover the two moments
 * where the program asks somebody to wait on us.
 *
 * Rendered here as pure functions and delivered by a sender injected into the
 * tRPC context (see ../context.ts), for two reasons. The routers live in a
 * package that must not depend on the Next app, and a money-path test needs to
 * assert that approving a partner mails them WITHOUT sending anything.
 *
 * Written once as data and rendered twice, to text and to HTML, so the two
 * cannot drift. Plain text is the real payload, the same rule as the Edge Cart
 * playbook email.
 *
 * Deliberately absent, and all on purpose:
 *
 *   • **Any statistic or earnings claim.** No "partners earn on average", no
 *     totals paid out. A first email that quotes a number invites the reader to
 *     hold us to it.
 *   • **Any promise the product cannot keep.** No customer-facing discount
 *     codes, no sub-partner tiers, no content bounties. The marketing site
 *     currently offers several of these; the product does not have them, and
 *     an email that repeats them is a support ticket with a delay on it.
 *     The partner BONUSES are the exception because they are real: the
 *     per-store bonus and the milestone ladder are published promises the
 *     billing pass pays automatically (CLAUDE.md, "Bonuses"). The approval
 *     email names them, with amounts read from the same constants the awarder
 *     pays from, so the email cannot promise a figure the ledger does not.
 *   • **The commission rate, in the invite.** An invite is not an approval and
 *     must not read like one. The rate appears only once it is real, in the
 *     approval email, read off the partner row.
 */

import {
	MERCHANT_BOUNTY_MINOR,
	MILESTONE_BONUS_CURRENCY,
	MILESTONE_BONUS_MINOR,
} from "@edgecoms/billing/milestones";
import { PARTNER_CONTACT_EMAIL } from "@edgecoms/mail/contact";
import {
	type Block,
	formatRate,
	renderHtml,
	renderText,
} from "@edgecoms/mail/render";
import type { OutboundEmail } from "@edgecoms/mail/types";

const MINOR_PER_MAJOR = 100n;

/**
 * A bonus amount as a person would write it: `$5`, `$240`, `$12.50`.
 *
 * Integer arithmetic only, like everything else that touches money here. The
 * bonus currency is USD today; anything else is written with its code rather
 * than borrowing a dollar sign.
 */
export function formatBonus(amountMinor: bigint): string {
	const whole = amountMinor / MINOR_PER_MAJOR;
	const cents = amountMinor % MINOR_PER_MAJOR;
	const figure =
		cents === 0n ? `${whole}` : `${whole}.${cents.toString().padStart(2, "0")}`;
	return MILESTONE_BONUS_CURRENCY === "USD"
		? `$${figure}`
		: `${figure} ${MILESTONE_BONUS_CURRENCY}`;
}

/** Everything the milestone ladder pays, if a partner reaches every rung. */
function milestoneTotalMinor(): bigint {
	let total = 0n;
	for (const amount of Object.values(MILESTONE_BONUS_MINOR)) {
		total += amount;
	}
	return total;
}

function pluralDays(days: number): string {
	return days === 1 ? "1 day" : `${days} days`;
}

/**
 * THE INVITE. Sent when an admin adds an email address by hand.
 *
 * Says who it is from, what the program is, and what the one next action is.
 * It does not say "you have been accepted", because accepting the invite only
 * creates a pending application. Approval is a separate, human decision.
 */
export function renderPartnerInviteEmail(input: {
	acceptUrl: string;
	companyName: string | null;
	/** How long the link lives. Passed in, so the email cannot drift from it. */
	expiresInDays: number;
	inviterName: string | null;
	to: string;
}): OutboundEmail {
	const heading = input.companyName
		? `${input.companyName} is invited to Edge Partners`
		: "You're invited to Edge Partners";
	const inviter = input.inviterName
		? `${input.inviterName} at Edge`
		: "Someone at Edge";

	const blocks: Block[] = [
		{ text: `${inviter} invited you to join the Edge Partner Program.` },
		{
			text: "Edge Partners pays agencies a share of what the Shopify stores they manage spend on Edge apps. There is no referral link to share: you get a code, you give it to a store you already manage, and every Edge app that store starts paying for earns you commission for as long as it stays.",
		},
		{ label: "Create your account", url: input.acceptUrl },
		{
			text: "Signing up creates an application, not an account with money attached. We send a short email to confirm your address, then review the application, set your commission rate, and email you your code, usually the same day.",
		},
		{
			text: `The link works only with this email address and expires in ${pluralDays(input.expiresInDays)}. If you were not expecting this, ignore it and nothing happens.`,
		},
	];

	return {
		html: renderHtml(heading, blocks),
		subject: "You're invited to the Edge Partner Program",
		text: renderText(heading, blocks),
		to: input.to,
	};
}

/**
 * THE APPROVAL. Sent when an admin approves a partner.
 *
 * Carries the code, because the code is the entire point and a partner who has
 * to go hunting for it is a partner who does nothing. Carries the rate, because
 * it is now a real commitment they are entitled to see in writing.
 */
export function renderPartnerApprovedEmail(input: {
	code: string;
	rateBps: number;
	to: string;
	welcomeUrl: string;
}): OutboundEmail {
	const heading = "You're approved. Here is your code";
	const rate = formatRate(input.rateBps);

	const blocks: Block[] = [
		{
			text: `Your Edge Partners application is approved at ${rate} commission. Here is your attribution code:`,
		},
		{ emphasis: true, text: input.code },
		{
			text: "Give it to a Shopify store you manage. They paste it into any Edge app while installing, and the store arrives in your dashboard bound to you. Most stores are approved automatically within a day. A store that was already paying for an Edge app is checked by us first.",
		},
		{
			text: `After that it is automatic. When Shopify bills that store for an Edge app it started paying for after joining you, you earn ${rate} of what Edge receives, every month, for as long as the store stays on Edge. Nothing expires and there is no clawback window.`,
		},
		{
			text: `On top of commission, you get a ${formatBonus(MERCHANT_BOUNTY_MINOR)} bonus for every store that starts earning you commission, and up to ${formatBonus(milestoneTotalMinor())} more in milestone bonuses as you grow. Your dashboard shows each milestone and what it pays.`,
		},
		{ label: "Open your dashboard", url: input.welcomeUrl },
		{
			text: "Your dashboard also shows what is left to set up. The one that matters most is your payout details: we cannot pay you without them, so it is worth two minutes now rather than at the end of the month.",
		},
	];

	return {
		html: renderHtml(heading, blocks),
		subject: `You're approved as an Edge partner. Your code is ${input.code}`,
		text: renderText(heading, blocks),
		to: input.to,
	};
}

/**
 * SENT TO THE INVITED ADDRESS THE MOMENT THE INVITE IS CLAIMED.
 *
 * The invite is bound to this address server-side, so somebody who signs up
 * with their own email cannot claim it. What nothing can prove is that the
 * person who signed up WITH this address actually controls this inbox: the
 * token travels in a URL, and a forwarded or leaked URL plus a guessable
 * address is enough.
 *
 * So the real recipient is told immediately. If it was not them, they can say
 * so while the account is still `pending` and has earned nothing, because
 * approval is a separate human decision. That does not make the link secret
 * again; it makes a misuse of one visible to the one person certain to care.
 */
export function renderInviteClaimedEmail(input: {
	companyName: string | null;
	to: string;
}): OutboundEmail {
	const heading = "Your Edge Partners invitation was just used";
	const blocks: Block[] = [
		{
			text: `An account has just been created from the invitation we sent to ${input.to}${input.companyName ? ` for ${input.companyName}` : ""}.`,
		},
		{
			text: "If that was you, nothing further is needed. We review the application, set your commission rate, and email you your code.",
		},
		{
			text: `If it was NOT you, email ${PARTNER_CONTACT_EMAIL} straight away. The account cannot earn anything until we approve it, so telling us now costs you nothing.`,
		},
	];
	return {
		html: renderHtml(heading, blocks),
		subject: heading,
		text: renderText(heading, blocks),
		to: input.to,
	};
}
