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
 *     codes, no sub-partner tiers, no bounties. The marketing site currently
 *     offers several of these; the product does not have them, and an email
 *     that repeats them is a support ticket with a delay on it.
 *   • **The commission rate, in the invite.** An invite is not an approval and
 *     must not read like one. The rate appears only once it is real, in the
 *     approval email, read off the partner row.
 */

export interface OutboundEmail {
	html: string;
	subject: string;
	text: string;
	to: string;
}

const ESCAPES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

const NEEDS_ESCAPE = /[&<>"']/g;

/**
 * Escapes a value interpolated into the HTML rendering.
 *
 * Every dynamic value in these templates is attacker-influenced somewhere: a
 * company name is typed by the partner, and an email address is typed by an
 * admin reading it off a spreadsheet.
 */
function escapeHtml(value: string): string {
	return value.replace(
		NEEDS_ESCAPE,
		(character) => ESCAPES[character] ?? character
	);
}

/** A rate in basis points, as a person would say it. 2000 -> "20%". */
export function formatRate(rateBps: number): string {
	const percent = rateBps / 100;
	return `${Number.isInteger(percent) ? percent : percent.toFixed(2)}%`;
}

interface Block {
	/** Rendered as a bare line, not a paragraph. Used for the code and links. */
	emphasis?: boolean;
	text: string;
}

/**
 * One plain HTML shell for both messages.
 *
 * No images, no columns, no web fonts. These are transactional notes from a
 * sender the recipient may never have heard from, and a heavy template lands in
 * Promotions more often than it impresses anybody.
 */
function renderHtml(heading: string, blocks: readonly Block[]): string {
	const body = blocks
		.map((block) =>
			block.emphasis
				? `<p style="margin:0 0 18px;font-size:16px;font-weight:600;color:#151a22">${escapeHtml(block.text)}</p>`
				: `<p style="margin:0 0 14px">${escapeHtml(block.text)}</p>`
		)
		.join("\n      ");

	return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f6f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#5a6472">
    <div style="max-width:520px;margin:0 auto;padding:28px 26px;background:#ffffff;border:1px solid #dde1e9;border-radius:4px">
      <p style="margin:0 0 20px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#8b95a4">Edge Partners</p>
      <h1 style="margin:0 0 18px;font-size:21px;line-height:1.25;color:#151a22;font-weight:600">${escapeHtml(heading)}</h1>
      ${body}
    </div>
  </body>
</html>`;
}

function renderText(heading: string, blocks: readonly Block[]): string {
	return [heading, "", ...blocks.map((block) => block.text)]
		.join("\n\n")
		.trim();
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
	inviterName: string | null;
	to: string;
}): OutboundEmail {
	const greeting = input.companyName
		? `${input.companyName} has been invited to the Edge Partner Program.`
		: "You have been invited to the Edge Partner Program.";
	const from = input.inviterName
		? `${input.inviterName} at Edge invited you.`
		: "Someone at Edge invited you.";

	const blocks: Block[] = [
		{ text: `${greeting} ${from}` },
		{
			text: "Edge Partners pays agencies a share of what the Shopify stores they manage spend on Edge apps. There is no referral link to share: you get a code, you give it to a store you already manage, and once we approve that store every Edge app it pays for earns you commission for as long as it stays.",
		},
		{ text: "Create your account here:" },
		{ emphasis: true, text: input.acceptUrl },
		{
			text: "This creates an application, not an account with money attached. We review it, set your commission rate, and email you your code, usually the same day.",
		},
		{
			text: "The link is tied to this email address and expires in 14 days. If you were not expecting this, ignore it and nothing happens.",
		},
	];

	return {
		html: renderHtml(greeting, blocks),
		subject: "You're invited to the Edge Partner Program",
		text: renderText(greeting, blocks),
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
			text: "Give it to a Shopify store you manage. They paste it into any Edge app while installing, and the store arrives in your dashboard bound to you, waiting for our approval.",
		},
		{
			text: `After that it is automatic. When Shopify bills that store for an Edge app, you earn ${rate} of what Edge receives, again every month, for as long as the store stays on Edge. Nothing expires and there is no clawback window.`,
		},
		{ text: "Your dashboard, and the two things left to set up:" },
		{ emphasis: true, text: input.welcomeUrl },
		{
			text: "One of those is your payout details. We cannot pay you without them, so it is worth two minutes now rather than at the end of the month.",
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
			text: "If it was NOT you, reply to this email straight away. The account cannot earn anything until we approve it, so telling us now costs you nothing.",
		},
	];
	return {
		html: renderHtml(heading, blocks),
		subject: heading,
		text: renderText(heading, blocks),
		to: input.to,
	};
}
