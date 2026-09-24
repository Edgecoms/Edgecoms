import { RESEND_UNSUBSCRIBE_URL } from "@edgecoms/mail/render";

/**
 * A CAMPAIGN IS PASTED HTML: written elsewhere (with Claude), pasted whole,
 * sent as-is. This module is what Edge Mail still insists on, shared by the
 * composer (live warnings) and the server (the same checks, enforced).
 */

/** Gmail hides everything past this behind "View entire message". */
export const GMAIL_CLIP_BYTES = 102_000;
/** A hard ceiling; nothing sensible comes near it. */
export const MAX_HTML_LENGTH = 500_000;

const SCRIPT = /<script\b/i;

export function hasUnsubscribeLink(html: string): boolean {
	return html.includes(RESEND_UNSUBSCRIBE_URL);
}

export function hasScript(html: string): boolean {
	return SCRIPT.test(html);
}

export function byteSize(html: string): number {
	return new TextEncoder().encode(html).length;
}

/** Why this HTML cannot be saved, or null when it can. */
export function htmlProblem(html: string): string | null {
	if (html.trim() === "") {
		return "Paste the email's HTML.";
	}
	if (!hasUnsubscribeLink(html)) {
		return `Add an unsubscribe link: href="${RESEND_UNSUBSCRIBE_URL}". Resend fills in each recipient's own.`;
	}
	if (hasScript(html)) {
		return "Remove the <script> tags. Email clients strip them.";
	}
	return null;
}

/** What the preview and a test email show: Resend fills the link only in a broadcast. */
export function withoutPlaceholders(html: string): string {
	return html.replaceAll(RESEND_UNSUBSCRIBE_URL, "#");
}

const HIDDEN_BLOCK = /<(head|style|script|title)\b[\s\S]*?<\/\1>/gi;
const COMMENT = /<!--[\s\S]*?-->/g;
const LINK = /<a\b[^>]*\bhref\s*=\s*"([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
const LINE_BREAK = /<br\s*\/?>/gi;
const BLOCK_END = /<\/(p|div|h[1-6]|li|tr|table|blockquote)>/gi;
const TAG = /<[^>]+>/g;
const SPACES = /[ \t\f\v ]+/g;
const BLANK_LINES = /\n\s*\n\s*\n+/g;
const ENTITY = /&(amp|lt|gt|quot|#39|apos|nbsp);/g;
const ENTITIES: Record<string, string> = {
	"#39": "'",
	amp: "&",
	apos: "'",
	gt: ">",
	lt: "<",
	nbsp: " ",
	quot: '"',
};

/**
 * The plain-text part, derived from the HTML: links keep their address, block
 * ends become paragraph breaks, and everything invisible is dropped.
 */
export function htmlToText(html: string): string {
	return html
		.replace(HIDDEN_BLOCK, "")
		.replace(COMMENT, "")
		.replace(LINK, (_match, href: string, label: string) => {
			const text = label.replace(TAG, "").trim();
			return text && text !== href ? `${text} (${href})` : href;
		})
		.replace(LINE_BREAK, "\n")
		.replace(BLOCK_END, "\n\n")
		.replace(TAG, "")
		.replace(ENTITY, (_match, name: string) => ENTITIES[name] ?? "")
		.split("\n")
		.map((line) => line.replace(SPACES, " ").trim())
		.join("\n")
		.replace(BLANK_LINES, "\n\n")
		.trim();
}

/** The brief to give Claude, so what it writes pastes in and sends cleanly. */
export function claudePrompt(appName: string, iconUrl: string | null): string {
	return [
		`Write a marketing email for ${appName}, a Shopify app, as ONE complete HTML document for email clients.`,
		"",
		"Rules:",
		"- Tables for layout and inline styles only. No <style> dependencies for layout, no JavaScript, no web fonts, no external CSS.",
		"- 600px max width, centred, white background, mobile friendly.",
		"- Clean and minimal, like dub.co emails: small logo on top, a clear headline, short paragraphs, one black pill button.",
		iconUrl
			? `- Logo: <img src="${iconUrl}" width="48" height="48" alt="${appName}">`
			: "- No logo image.",
		"- Images only as absolute https URLs, each with alt text.",
		`- In the footer, an unsubscribe link with exactly href="${RESEND_UNSUBSCRIBE_URL}" (keep the braces).`,
		"- Do not ask readers to reply: replies to this address are not received.",
		"- Keep it under 100 KB. No em dashes.",
		"",
		"The email is about:",
	].join("\n");
}
