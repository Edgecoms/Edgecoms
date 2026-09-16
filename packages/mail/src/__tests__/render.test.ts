import { describe, expect, test } from "bun:test";
import { renderHtml, renderText } from "../render";

const EM_DASH = "—";

describe("a button block", () => {
	const blocks = [
		{ text: "Before the button." },
		{ label: "Confirm my email", url: "https://edge.test/verify?token=a&b=c" },
	];

	test("is a link in HTML, with the address written out beneath it", () => {
		const html = renderHtml("Heading", blocks);
		expect(html).toContain(
			'<a href="https://edge.test/verify?token=a&amp;b=c"'
		);
		expect(html).toContain(">Confirm my email</a>");
		expect(html).toContain("If the button does not work");
		expect(html).not.toContain(EM_DASH);
	});

	test("is the label and the address in plain text", () => {
		expect(renderText("Heading", blocks)).toBe(
			"Heading\n\nBefore the button.\n\nConfirm my email: https://edge.test/verify?token=a&b=c"
		);
	});

	test("never turns a non-web address into a link", () => {
		const html = renderHtml("Heading", [
			{ label: "Open", url: "javascript:alert(1)" },
		]);
		expect(html).not.toContain("<a ");
		expect(html).not.toContain("href=");
		expect(html).toContain("Open: javascript:alert(1)");
	});

	test("escapes a hostile address and label", () => {
		const html = renderHtml("Heading", [
			{ label: "<b>x</b>", url: 'https://edge.test/?q="><script>x</script>' },
		]);
		expect(html).not.toContain("<script>");
		expect(html).not.toContain("<b>");
		expect(html).toContain("&quot;&gt;&lt;script&gt;");
	});
});
