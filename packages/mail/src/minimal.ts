import {
	accentOf,
	type Block,
	contactHtml,
	type EmailBrand,
	type EmailContent,
	escapeHtml,
	FONT,
	linkHref,
	manageHref,
	renderHead,
	renderPreheader,
	webAddress,
} from "./render";

/**
 * THE MINIMAL LAYOUT: white page, a bordered wordmark, a centred heading, a
 * narrow column of left-aligned text, one black pill button, a hairline and a
 * small footer. For Edge Mail's merchant email; partner email keeps the card
 * layout in ./render.
 *
 * Same content model, same escaping and the same link rules as the card:
 * every value passes through `escapeHtml`, and only an http(s) address (or,
 * for the manage link, a Resend placeholder) ever becomes an href. The
 * plain-text part is layout-free, so `renderText` serves both.
 *
 * Monochrome on purpose. The one place the app's accent shows is the
 * callout's edge, where it carries no text and so cannot fail contrast.
 */

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const COLUMN = 480;

const INK = {
	body: "#27272a",
	hairline: "#e4e4e7",
	heading: "#111111",
	muted: "#71717a",
	page: "#ffffff",
	panel: "#fafafa",
} as const;

const TABLE = 'role="presentation" cellpadding="0" cellspacing="0" border="0"';
const WHITESPACE = /\s+/;

/** Gap above a block, the larger of the two neighbours' wants. */
const SPACE: Record<Block["kind"], number> = {
	button: 28,
	callout: 24,
	code: 24,
	facts: 24,
	link: 16,
	paragraph: 16,
	small: 24,
	steps: 24,
};

const HEAD_STYLE = [
	":root{color-scheme:light;supported-color-schemes:light}",
	"a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}",
	"@media only screen and (max-width:600px){",
	".outer{padding:28px 18px 36px!important}",
	".h1{font-size:20px!important;line-height:28px!important}",
	"}",
].join("");

function type(
	size: number,
	lineHeight: number,
	color: string,
	extra = ""
): string {
	return `margin:0;font-family:${FONT};font-size:${size}px;line-height:${lineHeight}px;color:${color};${extra}`;
}

/** Escaped, with the writer's line breaks kept (a sign-off is two lines). */
function lines(value: string): string {
	return escapeHtml(value).replaceAll("\n", "<br>");
}

function paragraph(value: string): string {
	return `<p style="${type(14, 23, INK.body, "text-wrap:pretty;")}">${lines(value)}</p>`;
}

function button(block: Extract<Block, { kind: "button" }>): string {
	const href = linkHref(block.url);
	if (!href) {
		return `<p style="${type(14, 22, INK.heading, "font-weight:600;text-align:center;")}">${escapeHtml(block.label)}</p>`;
	}
	const link = `display:inline-block;padding:12px 26px;${type(14, 20, "#ffffff", "font-weight:600;text-decoration:none;border-radius:999px;")}`;
	return `<table ${TABLE} align="center" style="margin:0 auto;border-collapse:separate;"><tr><td align="center" bgcolor="${INK.heading}" style="background-color:${INK.heading};border-radius:999px;mso-padding-alt:12px 26px;"><a href="${escapeHtml(href)}" style="${link}">${escapeHtml(block.label)}</a></td></tr></table>`;
}

function link(block: Extract<Block, { kind: "link" }>): string {
	const href = linkHref(block.url);
	const style = type(14, 23, INK.body);
	if (!href) {
		return `<p style="${style}">${escapeHtml(block.label)}</p>`;
	}
	return `<p style="${style}"><a href="${escapeHtml(href)}" style="color:${INK.heading};font-weight:600;text-decoration:underline;">${escapeHtml(block.label)}</a></p>`;
}

function callout(
	block: Extract<Block, { kind: "callout" }>,
	accent: string
): string {
	const box = `background-color:${INK.panel};border:1px solid ${INK.hairline};border-left:3px solid ${accent};border-radius:6px;padding:14px 16px;`;
	return `<table ${TABLE} width="100%" style="border-collapse:separate;"><tr><td style="${box}"><p style="${type(14, 22, INK.heading, "font-weight:600;padding-bottom:2px;")}">${escapeHtml(block.title)}</p><p style="${type(14, 22, INK.body)}">${lines(block.text)}</p></td></tr></table>`;
}

function code(block: Extract<Block, { kind: "code" }>): string {
	const box = `border:1px solid ${INK.heading};border-radius:6px;padding:14px 12px;text-align:center;`;
	return `<table ${TABLE} width="100%" style="border-collapse:separate;"><tr><td style="${box}"><p style="${type(11, 16, INK.muted, "letter-spacing:1.2px;text-transform:uppercase;")}">${escapeHtml(block.label)}</p><p style="margin:6px 0 0;font-family:${MONO};font-size:22px;line-height:30px;font-weight:700;letter-spacing:3px;color:${INK.heading};word-break:break-all;">${escapeHtml(block.code)}</p></td></tr></table>`;
}

function steps(block: Extract<Block, { kind: "steps" }>): string {
	const items = block.items
		.map(
			(item, index) =>
				`<p style="${type(14, 23, INK.body, "padding-top:6px;")}">${index + 1}. ${escapeHtml(item)}</p>`
		)
		.join("");
	return `<p style="${type(14, 23, INK.heading, "font-weight:600;")}">${escapeHtml(block.title)}</p>${items}`;
}

function facts(block: Extract<Block, { kind: "facts" }>): string {
	const cell = `border-top:1px solid ${INK.hairline};padding:9px 0;`;
	const rows = block.rows
		.map(
			(row) =>
				`<tr><td style="${cell}${type(14, 22, INK.body)}">${escapeHtml(row.label)}</td><td align="right" style="${cell}${type(14, 22, INK.heading, "font-weight:600;text-align:right;white-space:nowrap;")}">${escapeHtml(row.value)}</td></tr>`
		)
		.join("");
	const note = block.note
		? `<p style="${type(12, 18, INK.muted, "padding-top:8px;")}">${escapeHtml(block.note)}</p>`
		: "";
	return `<p style="${type(14, 23, INK.heading, "font-weight:600;padding-bottom:6px;")}">${escapeHtml(block.title)}</p><table ${TABLE} width="100%">${rows}</table>${note}`;
}

function renderBlock(block: Block, accent: string): string {
	switch (block.kind) {
		case "button":
			return button(block);
		case "callout":
			return callout(block, accent);
		case "code":
			return code(block);
		case "facts":
			return facts(block);
		case "link":
			return link(block);
		case "paragraph":
			return paragraph(block.text);
		case "small":
			return `<p style="${type(12, 18, INK.muted)}">${lines(block.text)}</p>`;
		case "steps":
			return steps(block);
		default: {
			const unknown: never = block;
			throw new Error(`Unknown email block: ${JSON.stringify(unknown)}`);
		}
	}
}

function blockRows(blocks: readonly Block[], accent: string): string {
	let previous: Block | undefined;
	let rows = "";
	for (const block of blocks) {
		const top = previous
			? Math.max(SPACE[previous.kind], SPACE[block.kind])
			: 0;
		rows += `<tr><td style="padding-top:${top}px;text-align:left;">${renderBlock(block, accent)}</td></tr>`;
		previous = block;
	}
	return rows;
}

const LOGO_SIZE = 48;

/**
 * The app icon when there is one, else the name as a small bordered mark,
 * one word per line. The icon carries the name as alt text, which is what
 * shows when a client blocks images.
 */
function mark(brand: EmailBrand): string {
	const src = brand.logoUrl ? webAddress(brand.logoUrl) : null;
	if (!src) {
		return wordmark(brand.name);
	}
	const style = `display:block;border:0;outline:none;text-decoration:none;width:${LOGO_SIZE}px;height:${LOGO_SIZE}px;border-radius:12px;`;
	return `<img src="${escapeHtml(src)}" width="${LOGO_SIZE}" height="${LOGO_SIZE}" alt="${escapeHtml(brand.name)}" style="${style}">`;
}

function wordmark(name: string): string {
	const words = name.trim().split(WHITESPACE).map(escapeHtml).join("<br>");
	const style = `padding:6px 9px;font-family:${MONO};font-size:10px;line-height:13px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${INK.heading};text-align:center;`;
	return `<table ${TABLE} align="center" style="margin:0 auto;border:1px solid ${INK.heading};border-collapse:separate;"><tr><td style="${style}">${words}</td></tr></table>`;
}

function header(content: EmailContent, brand: EmailBrand): string {
	const eyebrow = content.eyebrow
		? `<tr><td align="center" style="padding-top:28px;"><p style="${type(11, 16, INK.muted, "font-weight:600;letter-spacing:1.4px;text-transform:uppercase;text-align:center;")}">${escapeHtml(content.eyebrow)}</p></td></tr>`
		: "";
	const headingTop = content.eyebrow ? 8 : 28;
	const heading = `<tr><td align="center" style="padding-top:${headingTop}px;"><h1 class="h1" style="${type(22, 30, INK.heading, "font-weight:600;letter-spacing:-0.3px;text-align:center;text-wrap:balance;")}">${escapeHtml(content.heading)}</h1></td></tr>`;
	return `<tr><td align="center">${mark(brand)}</td></tr>${eyebrow}${heading}`;
}

function footer(brand: EmailBrand): string {
	const small = type(12, 18, INK.muted);
	const href = manageHref(brand);
	const manage = href
		? `<p style="${small}padding-top:6px;"><a href="${escapeHtml(href)}" style="color:${INK.muted};text-decoration:underline;">Manage email preferences</a></p>`
		: "";
	const contact = contactHtml(brand.contact, INK.muted);
	return `<tr><td style="padding-top:32px;"><table ${TABLE} width="100%"><tr><td style="border-top:1px solid ${INK.hairline};padding-top:20px;"><p style="${small}">Questions? ${contact}. Replies to this email are not received.</p>${manage}<p style="${small}padding-top:6px;">${escapeHtml(brand.footer)}</p></td></tr></table></td></tr>`;
}

export function renderMinimalHtml(
	content: EmailContent,
	brand: EmailBrand
): string {
	const column = `width:100%;max-width:${COLUMN}px;margin:0 auto;`;
	const msoOpen = `<!--[if mso]><table ${TABLE} width="${COLUMN}" align="center"><tr><td><![endif]-->`;
	const msoClose = "<!--[if mso]></td></tr></table><![endif]-->";
	const body = `<tr><td style="padding-top:28px;"><table ${TABLE} width="100%">${blockRows(content.blocks, accentOf(brand))}</table></td></tr>`;
	const inner = `<table ${TABLE} width="100%" align="center" style="${column}">${header(content, brand)}${body}${footer(brand)}</table>`;
	const page = `<table ${TABLE} width="100%" bgcolor="${INK.page}" style="width:100%;background-color:${INK.page};"><tr><td align="center" class="outer" style="padding:40px 20px 48px;">${msoOpen}${inner}${msoClose}</td></tr></table>`;
	return [
		"<!doctype html>",
		'<html lang="en" xmlns="http://www.w3.org/1999/xhtml">',
		renderHead(content.subject, HEAD_STYLE),
		`<body style="background-color:${INK.page};margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">`,
		renderPreheader(content.preheader),
		page,
		"</body>",
		"</html>",
		"",
	].join("\n");
}
