import { readFileSync } from "node:fs";
import { join } from "node:path";

import { env } from "@edgecoms/env/server";
import { Resend } from "resend";
import { sendViaSmtp } from "./dev-smtp";
import { EDGE_CART_APP_STORE_URL } from "./edge-cart-lead";

/**
 * THE EDGE CART PLAYBOOK EMAIL.
 *
 * The landing page promises three specific things: "the four levers, the
 * threshold math, and the four upsell rules worth writing first", plus the
 * install link. This email delivers exactly those four blocks, in that order.
 * If the page's promise changes, change it here in the same commit, because a
 * lead-magnet that does not contain what was advertised is the fastest way to
 * teach somebody to ignore the next email.
 *
 * Written once as structured sections and rendered twice, to plain text and to
 * HTML, so the two can never drift. Plain text is the real payload: this is a
 * first email from a sender the recipient has never seen, and a heavy template
 * lands in Promotions more often than it impresses anybody.
 *
 * Deliberately absent, and both on purpose:
 *
 *   • **Any statistic, conversion rate or revenue claim.** Same rule as the
 *     landing page. The only number in here is the reader's own AOV example,
 *     and it is labelled as an example.
 *   • **Any discount or promotional offer.** This email's whole job is to
 *     deliver the playbook and send the reader to the app listing. Discount
 *     codes are issued by hand, one at a time, after a conversation. An
 *     automated email must never promise a price cut, because the moment it
 *     does, every recipient is owed one. See the test that enforces this.
 */

export const PLAYBOOK_SUBJECT = "Your Edge Cart setup playbook";

interface Section {
	/** Paragraphs before the list. */
	paragraphs?: readonly string[];
	/** Numbered list. Rendered as <ol> in HTML. */
	points?: readonly string[];
	title: string;
}

const SECTIONS: readonly Section[] = [
	{
		paragraphs: [
			"Set your free shipping threshold above your average order value. If your AOV is $62 and shipping unlocks at $50, you are paying for delivery on orders you had already won, all of them.",
			"Above AOV, the same bar stops being a discount and becomes a reason to add one more thing. This is the single highest-leverage setting in the app, and it is the one most stores get backwards.",
		],
		title: "The threshold math, first",
	},
	{
		points: [
			"Tiered rewards. A threshold above your AOV, with the bar filling as they add. Each tier creates a real Shopify automatic discount, so the reward the shopper sees in the drawer is the reward they get at checkout.",
			"Rule-based upsells. Trigger on every product, on named products, on a collection, or on a cart value. You write the rule, so you can explain why every recommendation appears.",
			"Add-ons. Gift wrap, shipping protection, a warranty, a rush option. Keep them separate from upsells so a gift wrap toggle never takes a slot an upsell was going to use.",
			"Urgency you control. A countdown in minutes with your own message, and an announcement line at the top of the drawer for a shipping cutoff or a sale.",
		],
		title: "The four levers",
	},
	{
		points: [
			"One named pairing for your best seller. The accessory you already know goes with it, not a guess.",
			"One collection rule for your largest category, so you get category logic without listing every SKU by hand.",
			"One cart value rule for the premium add-on that only makes sense on a larger basket.",
			"One catch-all, written last and given the lowest priority, so it only ever fills the gaps the three above leave.",
		],
		paragraphs: [
			"Write these four before you write anything else. Priority decides which one shows when two rules match the same cart, and you set the priority.",
		],
		title: "The four upsell rules worth writing first",
	},
	{
		paragraphs: [
			"Every edit saves to a draft, so nothing you try reaches a shopper until you press publish. Look at the draft on your own theme first. Publishing is one click, and so is going back.",
		],
		title: "Before you publish",
	},
] as const;

const OPENING =
	"Here is the playbook. Four levers, one piece of arithmetic, and the four upsell rules worth writing before any others.";

const INSTALL_CTA = "Install Edge Cart free";

const CLOSING = [
	"The free plan runs on a live store, so you can set the first reward tier up tonight and watch it on real traffic.",
	"If you sent your store URL, I will come back to you with a short teardown of your current cart. And if you would rather not do the setup alone, reply to this email and we will do it together on a call.",
] as const;

/**
 * The Edge Cart walkthrough.
 *
 * A LINKED THUMBNAIL, NOT AN EMBED, AND IT CANNOT BE AN EMBED.
 *
 * Gmail, Outlook, Apple Mail and Yahoo all strip `<iframe>`, `<script>` and
 * `<video>` from message bodies. A YouTube embed pasted in here does not
 * degrade to a player, it degrades to blank space. So the thumbnail is a plain
 * `<img>` wrapped in an `<a>`, which is the pattern every email client renders
 * and the one every ESP recommends.
 *
 * The image is served from YouTube's own CDN: it is public, permanent, and
 * derived from the video id, so it cannot fall out of sync with the video the
 * link points at. Images are blocked by default in a lot of clients, which is
 * why the text link underneath carries the message on its own.
 */
const VIDEO_ID = "DDr1GQfYHqI";
const VIDEO_WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;
const VIDEO_THUMBNAIL_URL = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;
/** Deliberately states no duration: nothing here has verified how long it is. */
const VIDEO_CTA = "Watch the walkthrough";
const VIDEO_ALT = "Watch the Edge Cart walkthrough on YouTube";

/**
 * Inbox preview text. Shown next to the subject line before anything is opened,
 * so it gets the promise rather than a repeat of the subject. Hidden in the
 * body by the zero-height div that carries it.
 */
const PREHEADER =
	"The four levers, the threshold math, and the four upsell rules worth writing first.";

export function playbookText(): string {
	const blocks: string[] = ["Hi,", OPENING, `${VIDEO_CTA}: ${VIDEO_WATCH_URL}`];

	for (const section of SECTIONS) {
		blocks.push(section.title.toUpperCase());
		if (section.paragraphs) {
			blocks.push(...section.paragraphs);
		}
		if (section.points) {
			blocks.push(
				section.points
					.map((point, index) => `${index + 1}. ${point}`)
					.join("\n\n")
			);
		}
	}

	blocks.push(
		`${INSTALL_CTA}: ${EDGE_CART_APP_STORE_URL}`,
		...CLOSING,
		"Warmly,\nAnurag\nEdgecoms",
		"Questions? Just reply to this email, or write to support@edgecoms.com."
	);

	return blocks.join("\n\n");
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

/**
 * ── The HTML email ──────────────────────────────────────────────────────────
 *
 * Table-based, inline styles only, 500px column. Not a stylistic choice: Outlook
 * renders through Word's HTML engine, which ignores flexbox, grid and most
 * external CSS, so a `<div>` layout that looks right in a browser collapses
 * there. Every value below is lifted from the house template rather than
 * invented, so this email sits next to the others in the inbox and looks like
 * the same sender.
 *
 * The pill button carries MSO conditional spacers around its label. Outlook
 * ignores horizontal padding on an anchor, so without them the button renders
 * as bare underlined text; the hidden `<i>` elements fake the padding there and
 * are invisible everywhere else.
 */
const COLOR_INK = "#18181b";
const COLOR_MUTED = "#737373";
const COLOR_RULE = "#e5e5e5";
const FONT_STACK =
	"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const P_STYLE = `margin:0 0 16px;font-size:14px;line-height:1.7;color:${COLOR_INK}`;
/** Section headings, kept quieter than the H1 so the page still has one voice. */
const H2_STYLE = `margin:28px 0 12px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${COLOR_MUTED}`;
const OL_STYLE = `margin:0 0 16px;padding-left:20px;font-size:14px;line-height:1.7;color:${COLOR_INK}`;

/**
 * The Edge Cart app icon, on its own.
 *
 * EMBEDDED IN THE MESSAGE, NOT LINKED TO THE SITE.
 *
 * It was linked at first, to `SITE_URL + /app-icons/...`, and it rendered as a
 * broken image in every test send: the file ships in the same commit as this
 * code, so the URL 404s until a deploy happens. That is not a bug you fix once,
 * it is a permanent race between the email and the deploy, and it also breaks
 * on any preview deploy or renamed domain.
 *
 * So the PNG travels with the message as an inline attachment and the HTML
 * points at `cid:`. Nothing external to fetch, nothing to deploy first, and no
 * dependence on the recipient's client being willing to load remote images.
 *
 * PNG rather than the site's `.webp` because Outlook on Windows cannot decode
 * WebP. Displayed at 44px from a 200px source so it stays sharp on retina,
 * with width/height attributes as well as CSS because Outlook ignores the style
 * block when reserving space.
 */
export const LOGO_CID = "edge-cart-logo";
export const LOGO_FILENAME = "edge-cart-email.png";

/**
 * `process.cwd()` is the Next.js app root at runtime, so `public/` sits here in
 * dev and in a built server alike.
 */
const LOGO_PATH = join(process.cwd(), "public", "app-icons", LOGO_FILENAME);

/** Read once. `null` means unreadable, and the header renders without a logo. */
let cachedLogo: string | null | undefined;

export function logoBase64(): string | null {
	if (cachedLogo === undefined) {
		try {
			cachedLogo = readFileSync(LOGO_PATH).toString("base64");
		} catch {
			/* A missing asset costs the email its logo, never its delivery. */
			cachedLogo = null;
		}
	}
	return cachedLogo;
}

function logoBlock(cid: string | null): string {
	if (!cid) {
		/* No logo beats a broken-image icon. */
		return "";
	}
	return `<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto 28px"><tr>
<td align="center"><img alt="Edge Cart" height="44" src="cid:${cid}" style="display:block;border:0;width:44px;height:44px" width="44" /></td>
</tr></table>`;
}

/**
 * The video, as a linked thumbnail.
 *
 * No caption link underneath any more. The image is still wrapped in the
 * anchor, so a client with images turned off renders `VIDEO_ALT` as clickable
 * link text and the video stays reachable; that alt string is doing the work
 * the caption used to, which is why it reads as an instruction rather than a
 * filename.
 *
 * The plain-text rendering keeps its own `Watch the walkthrough: <url>` line.
 * That is not a duplicate of this: a text-only client has no image to click.
 */
function videoBlock(): string {
	return `<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin:0 0 24px"><tr><td align="center">
<a href="${VIDEO_WATCH_URL}" style="text-decoration:none" target="_blank"><img alt="${VIDEO_ALT}" height="281" src="${VIDEO_THUMBNAIL_URL}" style="display:block;width:100%;max-width:500px;height:auto;border:0;border-radius:8px;outline:none;text-decoration:none" width="500" /></a>
</td></tr></table>`;
}

/**
 * The install button. Rendered twice: once under the video for a reader who is
 * already sold, once at the end for the one who read the whole playbook first.
 * `margin` is a parameter because the top instance sits tighter to the block
 * above it than the closing one does.
 */
function ctaButton(margin: string): string {
	return `<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin:${margin}"><tr><td align="center">
<a href="${EDGE_CART_APP_STORE_URL}" style="display:inline-block;background:${COLOR_INK};color:#ffffff;font-size:13px;font-weight:600;line-height:100%;text-decoration:none;padding:13px 26px;border-radius:9999px;mso-padding-alt:0px" target="_blank"><span><!--[if mso]><i style="mso-font-width:400%;mso-text-raise:20" hidden>&#8202;&#8202;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">${escapeHtml(INSTALL_CTA)} &rarr;</span><span><!--[if mso]><i style="mso-font-width:400%" hidden>&#8202;&#8202;&#8203;</i><![endif]--></span></a>
</td></tr></table>`;
}

function sectionsHtml(): string {
	const parts: string[] = [];

	for (const section of SECTIONS) {
		parts.push(`<h2 style="${H2_STYLE}">${escapeHtml(section.title)}</h2>`);

		for (const paragraph of section.paragraphs ?? []) {
			parts.push(`<p style="${P_STYLE}">${escapeHtml(paragraph)}</p>`);
		}

		if (section.points) {
			const items = section.points
				.map(
					(point) => `<li style="margin-bottom:10px">${escapeHtml(point)}</li>`
				)
				.join("");
			parts.push(`<ol style="${OL_STYLE}">${items}</ol>`);
		}
	}

	return parts.join("");
}

export function playbookHtml(logoCid: string | null = null): string {
	return `<!doctype html>
<html dir="ltr" lang="en">
<head>
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
<meta content="width=device-width, initial-scale=1" name="viewport" />
<meta name="x-apple-disable-message-reformatting" />
<title>${escapeHtml(PLAYBOOK_SUBJECT)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:${FONT_STACK};color:${COLOR_INK};-webkit-font-smoothing:antialiased">
<div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">${escapeHtml(PREHEADER)}</div>
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="background:#ffffff">
<tr><td align="center" style="padding:48px 20px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="max-width:500px">
<tr><td>
${logoBlock(logoCid)}
<h1 style="margin:0 0 32px;font-size:22px;font-weight:600;line-height:1.3;letter-spacing:-0.02em;text-align:center;color:${COLOR_INK}">${escapeHtml(PLAYBOOK_SUBJECT)}</h1>
<p style="${P_STYLE}">Hi,</p>
<p style="${P_STYLE}">${escapeHtml(OPENING)}</p>
${videoBlock()}
${ctaButton("0 0 8px")}
${sectionsHtml()}
${ctaButton("32px 0")}
${CLOSING.map((line) => `<p style="${P_STYLE}">${escapeHtml(line)}</p>`).join("")}
<p style="margin:0;font-size:14px;line-height:1.7;color:${COLOR_INK}">Warmly,<br />Anurag<br />Edgecoms</p>
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin:32px 0 0">
<tr><td style="border-top:1px solid ${COLOR_RULE};padding-top:20px">
<p style="margin:0;font-size:12px;line-height:1.6;color:${COLOR_MUTED}">Questions? Just reply to this email, or write to <a href="mailto:support@edgecoms.com" style="color:${COLOR_MUTED};text-decoration:underline" target="_blank">support@edgecoms.com</a>.</p>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</body>
</html>`;
}

export type SendOutcome = "sent" | "not_configured" | "failed";

/** Which way a message goes out, decided once and testable on its own. */
export type Transport =
	| { kind: "smtp"; url: string }
	| { kind: "resend"; apiKey: string }
	| { kind: "none"; reason: string };

export interface TransportConfig {
	apiKey?: string;
	from?: string;
	nodeEnv: string;
	smtpUrl?: string;
}

/**
 * Pick the transport.
 *
 * The production rule is the important one and it is why this is a function
 * rather than a chain of ifs inside the sender. `EDGE_CART_SMTP_URL` is a local
 * mail-catcher pointer, and it is exactly the kind of variable that gets copied
 * into a deployed environment by accident. An earlier version preferred SMTP
 * whenever it was set, anywhere: in production `sendViaSmtp` then threw on its
 * own guard, the error was swallowed, and the function returned "failed"
 * WITHOUT falling through to Resend. One stale variable would have silently
 * stopped every playbook email, and nothing would have looked broken.
 *
 * So the catcher is only ever consulted outside production. In production there
 * is one path: Resend, or an explicit "not configured".
 */
export function chooseTransport(config: TransportConfig): Transport {
	if (!config.from) {
		return { kind: "none", reason: "EDGE_CART_FROM_EMAIL is not set" };
	}

	const isProduction = config.nodeEnv === "production";

	if (config.smtpUrl && !isProduction) {
		/* Outside production a configured catcher wins, so a developer with both
		   set cannot accidentally send real mail while testing. */
		return { kind: "smtp", url: config.smtpUrl };
	}

	if (config.apiKey) {
		return { kind: "resend", apiKey: config.apiKey };
	}

	return {
		kind: "none",
		reason: config.smtpUrl
			? "RESEND_API_KEY is not set (EDGE_CART_SMTP_URL is ignored in production)"
			: "RESEND_API_KEY is not set",
	};
}

/**
 * Send the playbook.
 *
 * Never throws: the caller has already saved the lead, so a mail outage costs
 * the visitor a delayed email rather than an error page on a paid-traffic
 * landing page. Every failure is logged with the reason the provider gave,
 * because "no emails are arriving" is otherwise undiagnosable from the outside,
 * and `marketing_leads.playbook_sent_at` stays null so the rows are findable.
 */
export async function sendPlaybook(to: string): Promise<SendOutcome> {
	const transport = chooseTransport({
		apiKey: env.RESEND_API_KEY,
		from: env.EDGE_CART_FROM_EMAIL,
		nodeEnv: env.NODE_ENV,
		smtpUrl: env.EDGE_CART_SMTP_URL,
	});

	if (transport.kind === "none") {
		console.warn(`edge_cart_email: not sent, ${transport.reason}`);
		return "not_configured";
	}

	const from = env.EDGE_CART_FROM_EMAIL as string;
	const logo = logoBase64();
	const subject = PLAYBOOK_SUBJECT;
	const text = playbookText();
	/* The `cid:` in the HTML and the attachment below have to agree, so both
	   come from LOGO_CID and neither is spelled out twice. */
	const html = playbookHtml(logo ? LOGO_CID : null);
	const inlineImage = logo
		? { base64: logo, cid: LOGO_CID, filename: LOGO_FILENAME }
		: undefined;

	if (transport.kind === "smtp") {
		try {
			await sendViaSmtp(transport.url, {
				from,
				html,
				inlineImage,
				subject,
				text,
				to,
			});
			return "sent";
		} catch (error) {
			console.warn(`edge_cart_email: SMTP send failed: ${String(error)}`);
			return "failed";
		}
	}

	try {
		const { error } = await new Resend(transport.apiKey).emails.send({
			attachments: inlineImage
				? [
						{
							/* `contentId` is what makes Resend attach this inline and
							   resolve the `cid:` reference, rather than hanging it off the
							   bottom of the message as a download. */
							content: inlineImage.base64,
							contentId: inlineImage.cid,
							/* Explicit rather than derived from the filename, so a rename
							   cannot turn the logo into an octet-stream nothing renders. */
							contentType: "image/png",
							filename: inlineImage.filename,
						},
					]
				: undefined,
			from,
			html,
			subject,
			text,
			to,
		});

		if (error) {
			/* The usual production failures land here rather than in the catch:
			   an unverified sending domain, a revoked key, a suppressed address.
			   Resend answers 200 with an error body for those. */
			console.warn(
				`edge_cart_email: Resend rejected the send: ${error.name}: ${error.message}`
			);
			return "failed";
		}

		return "sent";
	} catch (error) {
		console.warn(`edge_cart_email: Resend threw: ${String(error)}`);
		return "failed";
	}
}
