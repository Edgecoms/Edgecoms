/**
 * ONE LAYOUT for every transactional email.
 *
 * Partner lifecycle messages, email verification and password reset all render
 * through this, so they look like one product rather than three. Written once
 * as data and rendered twice, to text and to HTML, so the two cannot drift, and
 * plain text is the real payload.
 *
 * No images, no columns, no web fonts. These are transactional notes, and a
 * heavy template lands in Promotions more often than it impresses anybody.
 */

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
export function escapeHtml(value: string): string {
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

/** A paragraph. `emphasis` sets it as a bare bold line, used for the code. */
export interface TextBlock {
	emphasis?: boolean;
	text: string;
}

/**
 * The one thing the reader should click.
 *
 * A button in HTML, with the address written out under it for clients that
 * strip links. In plain text, the label and the address. Before this, every
 * link was a bare line of text, and a verification URL ran to four lines of
 * characters that read as broken rather than as something to press.
 */
export interface ButtonBlock {
	label: string;
	url: string;
}

export type Block = ButtonBlock | TextBlock;

/** Only a web address becomes a link. Anything else is shown, never followed. */
const WEB_ADDRESS = /^https?:\/\//i;

function isButton(block: Block): block is ButtonBlock {
	return "url" in block;
}

function renderButtonHtml(block: ButtonBlock): string {
	const label = escapeHtml(block.label);
	const url = escapeHtml(block.url);
	if (!WEB_ADDRESS.test(block.url)) {
		return `<p style="margin:0 0 14px">${label}: ${url}</p>`;
	}
	return [
		`<p style="margin:6px 0 16px"><a href="${url}" style="display:inline-block;padding:12px 22px;background:#151a22;border-radius:4px;color:#ffffff;font-size:15px;font-weight:600;line-height:1.2;text-decoration:none">${label}</a></p>`,
		`<p style="margin:0 0 18px;font-size:12px;line-height:1.5;color:#8b95a4;word-break:break-all">If the button does not work, paste this into your browser: <a href="${url}" style="color:#5a6472">${url}</a></p>`,
	].join("\n      ");
}

function renderBlockHtml(block: Block): string {
	if (isButton(block)) {
		return renderButtonHtml(block);
	}
	return block.emphasis
		? `<p style="margin:0 0 18px;font-size:16px;font-weight:600;color:#151a22">${escapeHtml(block.text)}</p>`
		: `<p style="margin:0 0 14px">${escapeHtml(block.text)}</p>`;
}

function renderBlockText(block: Block): string {
	return isButton(block) ? `${block.label}: ${block.url}` : block.text;
}

/**
 * One plain HTML shell for every message.
 *
 * No images, no columns, no web fonts. These are transactional notes from a
 * sender the recipient may never have heard from, and a heavy template lands in
 * Promotions more often than it impresses anybody.
 */
export function renderHtml(heading: string, blocks: readonly Block[]): string {
	const body = blocks.map(renderBlockHtml).join("\n      ");

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

export function renderText(heading: string, blocks: readonly Block[]): string {
	/* One blank line between every part, the heading included. */
	return [heading, ...blocks.map(renderBlockText)].join("\n\n").trim();
}
