import { describe, expect, test } from "bun:test";
import { renderMinimalHtml } from "../minimal";
import { type EmailContent, renderHtml, renderText } from "../render";

const EM_DASH = "—";

const CONTENT: EmailContent = {
	blocks: [
		{ kind: "paragraph", text: "Hi {{{GREETING_NAME}}}," },
		{ kind: "paragraph", text: "Body copy." },
		{ kind: "button", label: "Finish setup →", url: "https://edgecoms.app/x" },
		{ kind: "link", label: "Get setup help", url: "https://edgecoms.app/help" },
		{ kind: "paragraph", text: "Warmly,\nThe Edge Cart team" },
	],
	heading: "Welcome to Edge Cart",
	preheader: "The preview line.",
	subject: "Welcome to Edge Cart",
};

const BRAND = {
	accent: "#2255ff",
	contact: "https://edgecoms.app/support",
	footer: "Edge Cart by Edge, edgecoms.app",
	manageUrl: "{{{PREFERENCES_URL}}}",
	name: "Edge Cart",
};

describe("minimal layout", () => {
	const html = renderMinimalHtml(CONTENT, BRAND);

	test("carries the wordmark, heading, button, link and footer", () => {
		expect(html).toContain("Edge<br>Cart");
		expect(html).toContain("Welcome to Edge Cart</h1>");
		expect(html).toContain('href="https://edgecoms.app/x"');
		expect(html).toContain(">Get setup help</a>");
		expect(html).toContain("Warmly,<br>The Edge Cart team");
		expect(html).toContain("Replies to this email are not received.");
	});

	test("keeps Resend placeholders for the greeting and the manage link", () => {
		expect(html).toContain("Hi {{{GREETING_NAME}}},");
		expect(html).toContain('href="{{{PREFERENCES_URL}}}"');
	});

	test("a manage link that is neither https nor an UPPER_CASE placeholder is dropped", () => {
		for (const manageUrl of [
			"{{{x}}}",
			'{{{A}}}" onclick="x',
			"javascript:alert(1)",
		]) {
			expect(renderMinimalHtml(CONTENT, { ...BRAND, manageUrl })).not.toContain(
				"Manage email preferences"
			);
		}
	});

	test("escapes every field, and a hostile accent never reaches a style", () => {
		const hostile = renderMinimalHtml(
			{
				...CONTENT,
				blocks: [{ kind: "callout", text: "<b>x</b>", title: "t" }],
				heading: '"><script>alert(1)</script>',
			},
			{ ...BRAND, accent: 'red;" onmouseover="alert(1)', name: "<img src=x>" }
		);
		expect(hostile).not.toContain("<script>");
		expect(hostile).not.toContain("<img");
		expect(hostile).not.toContain("onmouseover");
		expect(hostile).toContain("&lt;b&gt;x&lt;/b&gt;");
	});

	test("loads nothing, has no em dash, and stays under Gmail's clip size", () => {
		expect(html).not.toContain("<script");
		expect(html).not.toContain("<img");
		expect(html).not.toContain(EM_DASH);
		expect(new TextEncoder().encode(html).length).toBeLessThan(20_000);
	});
});

describe("button and link targets", () => {
	const withTarget = (url: string) =>
		renderMinimalHtml(
			{
				...CONTENT,
				blocks: [
					{ kind: "button", label: "Open Edge Cart", url },
					{ kind: "link", label: "Open it here", url },
				],
			},
			BRAND
		);

	test("an UPPER_CASE Resend placeholder becomes the href, filled per recipient", () => {
		const html = withTarget("{{{ADMIN_URL}}}");
		expect(html.match(/href="\{\{\{ADMIN_URL\}\}\}"/g)).toHaveLength(2);
	});

	test("anything that is neither https nor such a placeholder is shown, never linked", () => {
		for (const url of ["{{{admin_url}}}", '{{{A}}}"x', "javascript:alert(1)"]) {
			const html = withTarget(url);
			expect(html).not.toContain(`href="${url}"`);
			expect(html).toContain("Open Edge Cart</p>");
		}
	});
});

describe("the app icon", () => {
	test("replaces the wordmark when it is a web address, with the name as alt text", () => {
		const html = renderMinimalHtml(CONTENT, {
			...BRAND,
			logoUrl: "https://email.edgecoms.app/app-icons/edge-cart.png",
		});
		expect(html).toContain(
			'<img src="https://email.edgecoms.app/app-icons/edge-cart.png" width="48" height="48" alt="Edge Cart"'
		);
		expect(html).not.toContain("Edge<br>Cart");
	});

	test("anything else never becomes an image", () => {
		for (const logoUrl of [
			"javascript:alert(1)",
			'" onerror="alert(1)',
			"icon.png",
		]) {
			const html = renderMinimalHtml(CONTENT, { ...BRAND, logoUrl });
			expect(html).not.toContain("<img");
			expect(html).toContain("Edge<br>Cart");
		}
	});
});

describe("the link block", () => {
	test("renders in the card layout too, and in plain text", () => {
		expect(renderHtml(CONTENT)).toContain(">Get setup help</a>");
		expect(renderText(CONTENT)).toContain(
			"Get setup help: https://edgecoms.app/help"
		);
	});
});
