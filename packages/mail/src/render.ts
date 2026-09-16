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

export interface Block {
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
export function renderHtml(heading: string, blocks: readonly Block[]): string {
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

export function renderText(heading: string, blocks: readonly Block[]): string {
	return [heading, "", ...blocks.map((block) => block.text)]
		.join("\n\n")
		.trim();
}
