import { describe, expect, test } from "bun:test";
import { PARTNER_CONTACT_EMAIL } from "../contact";
import {
	type EmailContent,
	renderEmail,
	renderHtml,
	renderText,
} from "../render";

const EM_DASH = "—";
const CONTACT_LINE = `Questions? Email ${PARTNER_CONTACT_EMAIL}. Replies to this email are not received.`;

const EVERY_BLOCK: EmailContent = {
	blocks: [
		{ kind: "paragraph", text: "Before the button." },
		{ code: "ACMEAGENCY", kind: "code", label: "Your attribution code" },
		{ items: ["First.", "Second."], kind: "steps", title: "How it works" },
		{
			kind: "facts",
			note: "The note.",
			rows: [{ label: "Every store", value: "$5" }],
			title: "Bonuses on top",
		},
		{
			kind: "button",
			label: "Confirm my email",
			url: "https://edge.test/verify?token=a&b=c",
		},
		{ kind: "callout", text: "Email us.", title: "Was this not you?" },
		{ kind: "small", text: "Fine print." },
	],
	heading: "Heading",
	preheader: "The preview line.",
	subject: "The subject",
};

describe("the plain-text rendering", () => {
	test("is every block in order, one blank line apart, then the contact line", () => {
		expect(renderText(EVERY_BLOCK)).toBe(
			[
				"Heading",
				"Before the button.",
				"Your attribution code: ACMEAGENCY",
				"How it works\n1. First.\n2. Second.",
				"Bonuses on top\nEvery store: $5\nThe note.",
				"Confirm my email: https://edge.test/verify?token=a&b=c",
				"Was this not you? Email us.",
				"Fine print.",
				CONTACT_LINE,
			].join("\n\n")
		);
	});

	test("leaves out the preview line, which only the inbox shows", () => {
		expect(renderText(EVERY_BLOCK)).not.toContain("The preview line.");
	});
});

describe("the HTML rendering", () => {
	const html = renderHtml(EVERY_BLOCK);

	test("is a complete email document with a hidden preview line", () => {
		expect(html.startsWith("<!doctype html>")).toBe(true);
		expect(html).toContain('<html lang="en"');
		expect(html).toContain("<title>The subject</title>");
		expect(html).toContain('<meta name="color-scheme" content="light">');
		expect(html).toContain("display:none");
		expect(html).toContain("The preview line.");
	});

	test("makes the button a real link, with the address beneath it", () => {
		expect(html).toContain(
			'<a href="https://edge.test/verify?token=a&amp;b=c"'
		);
		expect(html).toContain(">Confirm my email</a>");
		expect(html).toContain("Button not working?");
	});

	test("shows every block's content", () => {
		for (const piece of [
			"ACMEAGENCY",
			"Your attribution code",
			"First.",
			"Every store",
			"$5",
			"The note.",
			"Was this not you?",
			"Fine print.",
		]) {
			expect(html).toContain(piece);
		}
	});

	test("ends with a working contact link", () => {
		expect(html).toContain(`<a href="mailto:${PARTNER_CONTACT_EMAIL}"`);
		expect(html).toContain("Replies to this email are not received.");
	});

	test("loads nothing and runs nothing", () => {
		expect(html).not.toContain("<script");
		expect(html).not.toContain("<img");
		expect(html).not.toContain("<link");
		expect(html).not.toContain("url(");
		expect(html).not.toContain(EM_DASH);
	});

	test("stays well under the size at which Gmail clips a message", () => {
		expect(new TextEncoder().encode(html).length).toBeLessThan(20_000);
	});
});

describe("hostile input", () => {
	test("a non-web address never becomes a link", () => {
		const html = renderHtml({
			...EVERY_BLOCK,
			blocks: [{ kind: "button", label: "Open", url: "javascript:alert(1)" }],
		});
		expect(html).not.toContain('href="javascript');
		/* The only link left is the contact line's mailto. */
		expect(html.match(/<a /g)).toHaveLength(1);
		expect(html).toContain("javascript:alert(1)");
	});

	test("every field is escaped", () => {
		const evil = '"><script>x</script>';
		const html = renderHtml({
			blocks: [
				{ kind: "paragraph", text: evil },
				{ code: evil, kind: "code", label: evil },
				{ items: [evil], kind: "steps", title: evil },
				{
					kind: "facts",
					note: evil,
					rows: [{ label: evil, value: evil }],
					title: evil,
				},
				{ kind: "button", label: evil, url: `https://edge.test/?q=${evil}` },
				{ kind: "callout", text: evil, title: evil },
				{ kind: "small", text: evil },
			],
			heading: evil,
			preheader: evil,
			subject: evil,
		});
		expect(html).not.toContain("<script>");
		expect(html).toContain("&quot;&gt;&lt;script&gt;");
	});
});

describe("renderEmail", () => {
	test("carries the subject and recipient with both renderings", () => {
		const email = renderEmail(EVERY_BLOCK, "alex@acme.com");
		expect(email.subject).toBe("The subject");
		expect(email.to).toBe("alex@acme.com");
		expect(email.html).toBe(renderHtml(EVERY_BLOCK));
		expect(email.text).toBe(renderText(EVERY_BLOCK));
	});
});
