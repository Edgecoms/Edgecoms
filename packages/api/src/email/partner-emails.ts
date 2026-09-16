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
import { formatRate, renderEmail } from "@edgecoms/mail/render";
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
	const inviter = input.inviterName
		? `${input.inviterName} at Edge`
		: "Someone at Edge";
	const lifetime = pluralDays(input.expiresInDays);

	return renderEmail(
		{
			blocks: [
				{
					kind: "paragraph",
					text: `${inviter} invited you to join the Edge Partner Program. Edge pays agencies a share of what the Shopify stores they manage spend on Edge apps.`,
				},
				{
					items: [
						"We approve your application and email you a code.",
						"You give the code to a Shopify store you manage.",
						"Every Edge app that store starts paying for earns you commission, every month it stays.",
					],
					kind: "steps",
					title: "How it works",
				},
				{ kind: "button", label: "Create your account", url: input.acceptUrl },
				{
					kind: "paragraph",
					text: "Signing up creates an application, not an account with money attached. We send a short email to confirm your address, then review the application and email you your code, usually the same day.",
				},
				{
					kind: "small",
					text: `This link works only for ${input.to} and expires in ${lifetime}. Not expecting this? Ignore it and nothing happens.`,
				},
			],
			heading: input.companyName
				? `${input.companyName} is invited to Edge Partners`
				: "You're invited to Edge Partners",
			preheader: `${inviter} invited ${input.companyName ?? "you"}. The link works for ${lifetime}.`,
			subject: "You're invited to the Edge Partner Program",
		},
		input.to
	);
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
	const rate = formatRate(input.rateBps);

	return renderEmail(
		{
			blocks: [
				{
					kind: "paragraph",
					text: `Welcome to Edge Partners. Your commission rate is ${rate}, and this is the code you give to the stores you manage.`,
				},
				{ code: input.code, kind: "code", label: "Your attribution code" },
				{
					items: [
						"Give the code to a Shopify store you manage. They paste it into any Edge app while installing.",
						"The store appears in your dashboard. Most are approved automatically within a day. A store that was already paying for an Edge app is checked by us first.",
						`You earn ${rate} of what Edge receives for every Edge app the store starts paying for, every month, for as long as it stays. Nothing expires and there is no clawback.`,
					],
					kind: "steps",
					title: "How it works",
				},
				{
					kind: "facts",
					note: "Your dashboard shows each milestone and what it pays.",
					rows: [
						{
							label: "Every store that starts earning you commission",
							value: formatBonus(MERCHANT_BOUNTY_MINOR),
						},
						{
							label: "Milestones as you grow",
							value: `Up to ${formatBonus(milestoneTotalMinor())}`,
						},
					],
					title: "Bonuses on top",
				},
				{ kind: "button", label: "Open your dashboard", url: input.welcomeUrl },
				{
					kind: "small",
					text: "Next step: add your payout details in the dashboard. We cannot pay you without them.",
				},
			],
			heading: "You're approved",
			preheader: `Your code is ${input.code}. You earn ${rate} of what Edge receives from your stores.`,
			subject: `You're approved as an Edge partner. Your code is ${input.code}`,
		},
		input.to
	);
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
	const forCompany = input.companyName ? ` for ${input.companyName}` : "";
	return renderEmail(
		{
			blocks: [
				{
					kind: "paragraph",
					text: `An account was just created from the invitation we sent to ${input.to}${forCompany}.`,
				},
				{
					kind: "paragraph",
					text: "If that was you, there is nothing to do. We review the application, set your commission rate, and email you your code.",
				},
				{
					kind: "callout",
					text: `Email ${PARTNER_CONTACT_EMAIL} straight away. The account cannot earn anything until we approve it, so telling us now costs you nothing.`,
					title: "Was this not you?",
				},
			],
			heading: "Your invitation was just used",
			preheader: "An account was just created from your invitation.",
			subject: "Your Edge Partners invitation was just used",
		},
		input.to
	);
}
