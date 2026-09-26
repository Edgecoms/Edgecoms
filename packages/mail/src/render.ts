import { PARTNER_CONTACT_EMAIL } from "./contact";
import type { OutboundEmail } from "./types";

/**
 * ONE LAYOUT for every transactional email.
 *
 * Partner lifecycle messages, email verification and password reset all render
 * through this, so they look like one product. Each email is written once as
 * data (a heading, an inbox preview line and a list of blocks) and rendered
 * twice, to HTML and to plain text, so the two cannot drift.
 *
 * The HTML is built for email clients, not browsers: tables with inline styles,
 * so it survives clients that strip `<style>`; no images, web fonts or scripts,
 * because those are what send a note to the Promotions tab. A black band
 * carries the wordmark; Edge orange appears only where it carries no text,
 * since white on #ff5e1f is 3.06:1 and fails for body-size type.
 *
 * Every piece of text passes through `escapeHtml`, and only an http(s) address
 * ever becomes an href.
 */

export interface FactRow {
	label: string;
	value: string;
}

export type Block =
	/** The action. A button, with the address written out beneath it. */
	| { kind: "button"; label: string; url: string }
	/** Something the reader must notice, like "was this not you?". */
	| { kind: "callout"; text: string; title: string }
	/** The partner's attribution code, set large enough to read and copy. */
	| { code: string; kind: "code"; label: string }
	/** A short label and value table, such as the bonus amounts. */
	| { kind: "facts"; note?: string; rows: readonly FactRow[]; title: string }
	| { kind: "paragraph"; text: string }
	/** A quiet secondary action: an underlined link, not a second button. */
	| { kind: "link"; label: string; url: string }
	/** Fine print, set apart below a hairline. */
	| { kind: "small"; text: string }
	/** A numbered "how it works". */
	| { items: readonly string[]; kind: "steps"; title: string };

export interface EmailContent {
	blocks: readonly Block[];
	/** A short label above the heading, like "NEW FEATURE". */
	eyebrow?: string;
	heading: string;
	/** The line an inbox shows next to the subject. HTML only. */
	preheader: string;
	subject: string;
}

type BlockOf<K extends Block["kind"]> = Extract<Block, { kind: K }>;

export const FONT =
	"-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const COLOR = {
	band: "#111111",
	bandMuted: "#a1a1aa",
	body: "#3f3f46",
	brand: "#ff5e1f",
	button: "#111111",
	buttonText: "#ffffff",
	calloutBorder: "#fed7aa",
	calloutTint: "#fff7ed",
	calloutTitle: "#9a3412",
	card: "#ffffff",
	codeBorder: "#ffdccd",
	codeLabel: "#9a3412",
	codeText: "#c2410c",
	codeTint: "#fff1eb",
	hairline: "#e4e4e7",
	heading: "#111111",
	linkBox: "#fafafa",
	muted: "#71717a",
	/** #71717a is only 4.4:1 on the page grey, so text there is darker. */
	mutedOnPage: "#52525b",
	page: "#f4f4f5",
	panel: "#f4f4f5",
} as const;

const CARD_WIDTH = 560;
const GUTTER = 40;
const FIRST_BLOCK_GAP = 20;

/**
 * The room each block wants around it. The gap between two blocks is the
 * larger of their two values, like collapsing margins, so the rhythm stays even
 * without spacer rows.
 */
const BLOCK_SPACE: Record<Block["kind"], number> = {
	button: 28,
	callout: 24,
	code: 24,
	facts: 28,
	link: 16,
	paragraph: 16,
	small: 32,
	steps: 28,
};

const WEB_ADDRESS = /^https?:\/\/\S+$/i;
const PLAIN_EMAIL = /^[^\s@<>"'&]+@[^\s@<>"'&]+$/;
const ESCAPES: Record<string, string> = {
	'"': "&quot;",
	"&": "&amp;",
	"'": "&#39;",
	"<": "&lt;",
	">": "&gt;",
};
const NEEDS_ESCAPE = /[&<>"']/g;

const TABLE = 'role="presentation" cellpadding="0" cellspacing="0" border="0"';
const FULL_TABLE = `${TABLE} width="100%"`;

/** Pads the hidden preview so body text does not leak into the inbox line. */
const PREHEADER_PADDING = "&#847;&zwnj;&nbsp;".repeat(80);
const HIDDEN =
	"display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;";

const HEAD_STYLE = [
	":root{color-scheme:light;supported-color-schemes:light}",
	"a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}",
	"@media only screen and (max-width:600px){",
	".outer{padding:16px 10px 28px!important}",
	".px{padding-left:24px!important;padding-right:24px!important}",
	".h1{font-size:24px!important;line-height:31px!important}",
	".btn-t{width:100%!important}",
	".btn-t a{display:block!important}",
	".code{font-size:26px!important;line-height:34px!important;letter-spacing:3px!important;padding-left:3px!important}",
	"}",
].join("");

/**
 * WHO an email is from. Partner mail uses the default; Edge Mail passes each
 * Edge app's own, so a merchant's email says "Edge Cart", not "Edge Partners".
 * Only the wordmark, the accent and the footer change: the layout is one.
 */
export interface EmailBrand {
	/**
	 * `#rrggbb`, for the mark and the callout bar only. It never sits behind
	 * text, so an app's colour cannot fail contrast. Anything else is ignored.
	 */
	accent: string;
	/** Where a reader goes with a question: an email address or a web address. */
	contact: string;
	/** The second footer line, like "Edge Partners, edgecoms.app". */
	footer: string;
	/**
	 * The app's icon: a web address of a PNG, shown at 48px. Minimal layout
	 * only (the card shows the wordmark), and never a WebP: Outlook cannot
	 * display one.
	 */
	logoUrl?: string;
	/** An unsubscribe or preferences link: a web address, or Resend's placeholder. */
	manageUrl?: string;
	name: string;
	/** Set muted after the name in the band, like "Partners". */
	nameSuffix?: string;
}

/** Resend swaps this for each recipient's unsubscribe link in a broadcast. */
export const RESEND_UNSUBSCRIBE_URL = "{{{RESEND_UNSUBSCRIBE_URL}}}";

export const PARTNER_BRAND: EmailBrand = {
	accent: COLOR.brand,
	contact: PARTNER_CONTACT_EMAIL,
	footer: "Edge Partners, edgecoms.app",
	name: "Edge",
	nameSuffix: "Partners",
};

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/** The accent, or Edge orange if it is not a plain hex colour. It lands in a style attribute. */
export function accentOf(brand: EmailBrand): string {
	return HEX_COLOR.test(brand.accent) ? brand.accent : COLOR.brand;
}

export function contactLine(brand: EmailBrand): string {
	const verb = PLAIN_EMAIL.test(brand.contact) ? "Email" : "Visit";
	return `Questions? ${verb} ${brand.contact}. Replies to this email are not received.`;
}

/**
 * A Resend template variable, like `{{{PREFERENCES_URL}}}`: Resend fills it
 * per recipient. Upper-case letters, digits and underscores only, so it can
 * carry nothing that would break out of an attribute.
 */
const TEMPLATE_VARIABLE = /^\{\{\{[A-Z][A-Z0-9_]*\}\}\}$/;

/**
 * A web address, or a Resend placeholder that Resend fills per recipient.
 * For layouts whose links are template variables (Edge Mail's lifecycle
 * templates); anything else is shown, never followed.
 */
export function linkHref(url: string): string | null {
	return TEMPLATE_VARIABLE.test(url) ? url : webAddress(url);
}

/** Only a web address, or a Resend placeholder, becomes the manage link. */
export function manageHref(brand: EmailBrand): string | null {
	return brand.manageUrl ? linkHref(brand.manageUrl) : null;
}

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

/** Only a web address becomes a link. Anything else is shown, never followed. */
export function webAddress(url: string): string | null {
	const trimmed = url.trim();
	return WEB_ADDRESS.test(trimmed) ? trimmed : null;
}

function text(
	size: number,
	lineHeight: number,
	color: string,
	extra = ""
): string {
	return `margin:0;font-family:${FONT};font-size:${size}px;line-height:${lineHeight}px;color:${color};${extra}`;
}

function subheading(title: string): string {
	return `<p style="${text(16, 24, COLOR.heading, "font-weight:700;padding-bottom:14px;")}">${escapeHtml(title)}</p>`;
}

function renderParagraph(block: BlockOf<"paragraph">): string {
	return `<p style="${text(16, 26, COLOR.body, "text-wrap:pretty;")}">${escapeHtml(block.text)}</p>`;
}

function buttonTable(label: string, href: string): string {
	const link = `display:inline-block;padding:14px 28px;${text(15, 20, COLOR.buttonText, "font-weight:700;text-decoration:none;border-radius:6px;text-align:center;")}`;
	return `<table ${TABLE} class="btn-t" style="border-collapse:separate;"><tr><td align="center" bgcolor="${COLOR.button}" style="background-color:${COLOR.button};border-radius:6px;mso-padding-alt:14px 28px;"><a href="${escapeHtml(href)}" style="${link}">${escapeHtml(label)}</a></td></tr></table>`;
}

/**
 * The address under the button, for clients that strip links. A reset or
 * verification address runs to 350 characters, so it sits small and muted in
 * its own box rather than as a wall of text.
 */
function linkFallback(url: string, href: string | null): string {
	const shown = escapeHtml(url);
	const content = href
		? `<a href="${escapeHtml(href)}" style="color:${COLOR.muted};text-decoration:none;">${shown}</a>`
		: shown;
	const box = `background-color:${COLOR.linkBox};border:1px solid ${COLOR.hairline};border-radius:6px;padding:10px 12px;${text(12, 18, COLOR.muted, "word-break:break-all;overflow-wrap:anywhere;")}`;
	return `<p style="${text(13, 20, COLOR.muted, "padding:20px 0 8px;")}">Button not working? Paste this link into your browser:</p><table ${FULL_TABLE} style="table-layout:fixed;border-collapse:separate;"><tr><td bgcolor="${COLOR.linkBox}" style="${box}">${content}</td></tr></table>`;
}

function renderButton(block: BlockOf<"button">): string {
	const href = webAddress(block.url);
	if (!href) {
		const label = `<p style="${text(15, 22, COLOR.heading, "font-weight:700;")}">${escapeHtml(block.label)}</p>`;
		return `${label}${linkFallback(block.url, null)}`;
	}
	return `${buttonTable(block.label, href)}${linkFallback(block.url, href)}`;
}

function renderCode(block: BlockOf<"code">): string {
	const label = text(
		12,
		16,
		COLOR.codeLabel,
		"font-weight:700;letter-spacing:1.5px;text-transform:uppercase;"
	);
	const code = `margin:0;padding:8px 0 0 4px;font-family:${MONO};font-size:30px;line-height:38px;font-weight:700;letter-spacing:4px;color:${COLOR.codeText};word-break:break-all;-webkit-user-select:all;user-select:all;`;
	return `<table ${FULL_TABLE} bgcolor="${COLOR.codeTint}" style="background-color:${COLOR.codeTint};border:1px solid ${COLOR.codeBorder};border-radius:10px;border-collapse:separate;"><tr><td align="center" style="padding:22px 12px 24px;text-align:center;"><p style="${label}">${escapeHtml(block.label)}</p><p class="code" style="${code}">${escapeHtml(block.code)}</p></td></tr></table>`;
}

function numberBadge(step: number): string {
	const badge = `width:24px;height:24px;border-radius:12px;background-color:${COLOR.panel};${text(12, 24, COLOR.body, "font-weight:700;text-align:center;")}`;
	return `<table ${TABLE} style="border-collapse:separate;"><tr><td width="24" height="24" align="center" valign="middle" bgcolor="${COLOR.panel}" style="${badge}">${step}</td></tr></table>`;
}

function stepRow(item: string, step: number, isLast: boolean): string {
	const bottom = isLast ? 0 : 14;
	return `<tr><td width="24" valign="top" style="width:24px;padding:0 0 ${bottom}px 0;">${numberBadge(step)}</td><td valign="top" style="padding:0 0 ${bottom}px 14px;${text(15, 24, COLOR.body)}">${escapeHtml(item)}</td></tr>`;
}

function renderSteps(block: BlockOf<"steps">): string {
	const last = block.items.length - 1;
	const rows = block.items
		.map((item, index) => stepRow(item, index + 1, index === last))
		.join("");
	return `${subheading(block.title)}<table ${FULL_TABLE}>${rows}</table>`;
}

function factRow(row: FactRow): string {
	const cell = `border-top:1px solid ${COLOR.hairline};padding:12px 0;`;
	const label = `${cell}padding-right:16px;${text(15, 22, COLOR.body)}`;
	const value = `${cell}${text(15, 22, COLOR.heading, "font-weight:700;text-align:right;white-space:nowrap;")}`;
	return `<tr><td valign="top" style="${label}">${escapeHtml(row.label)}</td><td align="right" valign="top" style="${value}">${escapeHtml(row.value)}</td></tr>`;
}

function factNote(note: string | undefined): string {
	if (!note) {
		return "";
	}
	return `<p style="${text(13, 20, COLOR.mutedOnPage, `border-top:1px solid ${COLOR.hairline};padding-top:12px;`)}">${escapeHtml(note)}</p>`;
}

function renderFacts(block: BlockOf<"facts">): string {
	const rows = block.rows.map(factRow).join("");
	const title = `<p style="${text(16, 24, COLOR.heading, "font-weight:700;padding-bottom:6px;")}">${escapeHtml(block.title)}</p>`;
	return `<table ${FULL_TABLE} bgcolor="${COLOR.panel}" style="background-color:${COLOR.panel};border-radius:10px;border-collapse:separate;"><tr><td style="padding:18px 20px 16px;">${title}<table ${FULL_TABLE}>${rows}</table>${factNote(block.note)}</td></tr></table>`;
}

function renderCallout(block: BlockOf<"callout">, accent: string): string {
	const bar = `width:4px;background-color:${accent};border-radius:8px 0 0 8px;font-size:0;line-height:0;`;
	const box = `background-color:${COLOR.calloutTint};border:1px solid ${COLOR.calloutBorder};border-left:0;border-radius:0 8px 8px 0;padding:16px 20px 18px;`;
	const title = `<p style="${text(15, 22, COLOR.calloutTitle, "font-weight:700;padding-bottom:4px;")}">${escapeHtml(block.title)}</p>`;
	const body = `<p style="${text(15, 24, COLOR.body)}">${escapeHtml(block.text)}</p>`;
	return `<table ${FULL_TABLE} style="border-collapse:separate;"><tr><td width="4" bgcolor="${accent}" style="${bar}">&nbsp;</td><td bgcolor="${COLOR.calloutTint}" style="${box}">${title}${body}</td></tr></table>`;
}

function renderLink(block: BlockOf<"link">): string {
	const href = webAddress(block.url);
	const style = text(15, 24, COLOR.body);
	if (!href) {
		return `<p style="${style}">${escapeHtml(block.label)}</p>`;
	}
	return `<p style="${style}"><a href="${escapeHtml(href)}" style="color:${COLOR.heading};text-decoration:underline;">${escapeHtml(block.label)}</a></p>`;
}

function renderSmall(block: BlockOf<"small">): string {
	const rule = `border-top:1px solid ${COLOR.hairline};padding-top:20px;`;
	return `<table ${FULL_TABLE}><tr><td style="${rule}${text(13, 20, COLOR.muted, "text-wrap:pretty;")}">${escapeHtml(block.text)}</td></tr></table>`;
}

function renderBlock(block: Block, accent: string): string {
	switch (block.kind) {
		case "button":
			return renderButton(block);
		case "callout":
			return renderCallout(block, accent);
		case "code":
			return renderCode(block);
		case "facts":
			return renderFacts(block);
		case "link":
			return renderLink(block);
		case "paragraph":
			return renderParagraph(block);
		case "small":
			return renderSmall(block);
		case "steps":
			return renderSteps(block);
		default: {
			const unknown: never = block;
			throw new Error(`Unknown email block: ${JSON.stringify(unknown)}`);
		}
	}
}

function renderBlockRows(blocks: readonly Block[], accent: string): string {
	let previous: Block | undefined;
	let rows = "";
	for (const block of blocks) {
		const top = previous
			? Math.max(BLOCK_SPACE[previous.kind], BLOCK_SPACE[block.kind])
			: FIRST_BLOCK_GAP;
		rows += `<tr><td class="px" style="padding:${top}px ${GUTTER}px 0 ${GUTTER}px;text-align:left;">${renderBlock(block, accent)}</td></tr>`;
		previous = block;
	}
	return rows;
}

function renderBand(brand: EmailBrand): string {
	const accent = accentOf(brand);
	const mark = `width:12px;height:12px;background-color:${accent};font-size:0;line-height:0;`;
	const word = text(
		16,
		20,
		COLOR.buttonText,
		"font-weight:700;padding-left:10px;letter-spacing:-0.2px;"
	);
	const square = `<table ${TABLE}><tr><td width="12" height="12" bgcolor="${accent}" style="${mark}">&nbsp;</td></tr></table>`;
	const suffix = brand.nameSuffix
		? ` <span style="color:${COLOR.bandMuted};font-weight:500;">${escapeHtml(brand.nameSuffix)}</span>`
		: "";
	const wordmark = `<table ${TABLE}><tr><td valign="middle" style="width:12px;">${square}</td><td valign="middle" style="${word}">${escapeHtml(brand.name)}${suffix}</td></tr></table>`;
	return `<tr><td class="px" bgcolor="${COLOR.band}" style="background-color:${COLOR.band};border-radius:11px 11px 0 0;padding:22px ${GUTTER}px;">${wordmark}</td></tr>`;
}

function renderEyebrow(eyebrow: string | undefined): string {
	if (!eyebrow) {
		return "";
	}
	const style = text(
		12,
		16,
		COLOR.muted,
		"font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding-bottom:10px;"
	);
	return `<p style="${style}">${escapeHtml(eyebrow)}</p>`;
}

function renderHeading(heading: string, eyebrow?: string): string {
	const style = text(
		28,
		35,
		COLOR.heading,
		"font-weight:700;letter-spacing:-0.4px;text-wrap:balance;"
	);
	return `<tr><td class="px" style="padding:36px ${GUTTER}px 0 ${GUTTER}px;text-align:left;">${renderEyebrow(eyebrow)}<h1 class="h1" style="${style}">${escapeHtml(heading)}</h1></td></tr>`;
}

function renderCard(content: EmailContent, brand: EmailBrand): string {
	const card = `width:100%;background-color:${COLOR.card};border:1px solid ${COLOR.hairline};border-radius:12px;border-collapse:separate;text-align:left;`;
	const end = `<tr><td style="height:40px;font-size:0;line-height:0;">&nbsp;</td></tr>`;
	return `<table ${FULL_TABLE} bgcolor="${COLOR.card}" style="${card}">${renderBand(brand)}${renderHeading(content.heading, content.eyebrow)}${renderBlockRows(content.blocks, accentOf(brand))}${end}</table>`;
}

/** "Email <link>" or "Visit <link>". `color` is a fixed palette value, never input. */
export function contactHtml(
	contact: string,
	color: string = COLOR.heading
): string {
	const shown = escapeHtml(contact);
	const linkStyle = `color:${color};text-decoration:underline;`;
	if (PLAIN_EMAIL.test(contact)) {
		return `Email <a href="mailto:${shown}" style="${linkStyle}">${shown}</a>`;
	}
	const href = webAddress(contact);
	return href
		? `Visit <a href="${escapeHtml(href)}" style="${linkStyle}">${shown}</a>`
		: `Visit ${shown}`;
}

function renderManage(brand: EmailBrand): string {
	const href = manageHref(brand);
	if (!href) {
		return "";
	}
	const style = text(
		12,
		18,
		COLOR.mutedOnPage,
		"text-align:center;padding-top:6px;"
	);
	return `<p style="${style}"><a href="${escapeHtml(href)}" style="color:${COLOR.mutedOnPage};text-decoration:underline;">Manage email preferences</a></p>`;
}

function renderFooter(brand: EmailBrand): string {
	const first = text(13, 20, COLOR.mutedOnPage, "text-align:center;");
	const second = text(
		12,
		18,
		COLOR.mutedOnPage,
		"text-align:center;padding-top:6px;"
	);
	return `<tr><td align="center" style="padding:24px 16px 0;"><p style="${first}">Questions? ${contactHtml(brand.contact)}. Replies to this email are not received.</p><p style="${second}">${escapeHtml(brand.footer)}</p>${renderManage(brand)}</td></tr>`;
}

function renderFrame(content: EmailContent, brand: EmailBrand): string {
	const column = `width:100%;max-width:${CARD_WIDTH}px;margin:0 auto;`;
	const msoOpen = `<!--[if mso]><table ${TABLE} width="${CARD_WIDTH}" align="center"><tr><td><![endif]-->`;
	const msoClose = "<!--[if mso]></td></tr></table><![endif]-->";
	const inner = `<table ${FULL_TABLE} align="center" style="${column}"><tr><td>${renderCard(content, brand)}</td></tr>${renderFooter(brand)}</table>`;
	return `<table ${FULL_TABLE} bgcolor="${COLOR.page}" style="width:100%;background-color:${COLOR.page};"><tr><td align="center" class="outer" style="padding:32px 16px 40px;">${msoOpen}${inner}${msoClose}</td></tr></table>`;
}

export function renderPreheader(preheader: string): string {
	return `<div style="${HIDDEN}color:${COLOR.page};">${escapeHtml(preheader)}</div><div style="${HIDDEN}">${PREHEADER_PADDING}</div>`;
}

export function renderHead(subject: string, style = HEAD_STYLE): string {
	return [
		"<head>",
		'<meta charset="utf-8">',
		'<meta name="viewport" content="width=device-width, initial-scale=1">',
		'<meta name="x-apple-disable-message-reformatting">',
		'<meta name="color-scheme" content="light">',
		'<meta name="supported-color-schemes" content="light">',
		`<title>${escapeHtml(subject)}</title>`,
		`<style>${style}</style>`,
		"</head>",
	].join("\n");
}

export function renderHtml(
	content: EmailContent,
	brand: EmailBrand = PARTNER_BRAND
): string {
	const body = `background-color:${COLOR.page};margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;`;
	return [
		"<!doctype html>",
		'<html lang="en" xmlns="http://www.w3.org/1999/xhtml">',
		renderHead(content.subject),
		`<body style="${body}">`,
		renderPreheader(content.preheader),
		renderFrame(content, brand),
		"</body>",
		"</html>",
		"",
	].join("\n");
}

function blockText(block: Block): string {
	switch (block.kind) {
		case "button":
		case "link":
			return `${block.label}: ${block.url}`;
		case "callout":
			return `${block.title} ${block.text}`;
		case "code":
			return `${block.label}: ${block.code}`;
		case "facts":
			return [
				block.title,
				...block.rows.map((row) => `${row.label}: ${row.value}`),
				...(block.note ? [block.note] : []),
			].join("\n");
		case "paragraph":
		case "small":
			return block.text;
		case "steps":
			return [
				block.title,
				...block.items.map((item, index) => `${index + 1}. ${item}`),
			].join("\n");
		default: {
			const unknown: never = block;
			throw new Error(`Unknown email block: ${JSON.stringify(unknown)}`);
		}
	}
}

/**
 * The plain-text part: the heading, each block, and the contact line, with one
 * blank line between them. The preheader is left out, because it is a preview
 * of the body rather than part of it.
 */
export function renderText(
	content: EmailContent,
	brand: EmailBrand = PARTNER_BRAND
): string {
	const manage = manageHref(brand);
	return [
		...(content.eyebrow ? [content.eyebrow] : []),
		content.heading,
		...content.blocks.map(blockText),
		contactLine(brand),
		...(manage ? [`Manage email preferences: ${manage}`] : []),
	]
		.join("\n\n")
		.trim();
}

export function renderEmail(
	content: EmailContent,
	to: string,
	brand: EmailBrand = PARTNER_BRAND
): OutboundEmail {
	return {
		html: renderHtml(content, brand),
		subject: content.subject,
		text: renderText(content, brand),
		to,
	};
}
