import { describe, expect, test } from "bun:test";
import { PARTNER_CONTACT_EMAIL } from "../contact";
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
			[
				"Heading",
				"Before the button.",
				"Confirm my email: https://edge.test/verify?token=a&b=c",
				`Questions? Email ${PARTNER_CONTACT_EMAIL}. Replies to this email are not received.`,
			].join("\n\n")
		);
	});

	test("never turns a non-web address into a link", () => {
		const html = renderHtml("Heading", [
			{ label: "Open", url: "javascript:alert(1)" },
		]);
		expect(html).not.toContain('href="javascript');
		/* The only link left is the contact line's mailto. */
		expect(html.match(/<a /g)).toHaveLength(1);
		expect(html).toContain('<a href="mailto:');
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

describe("every email", () => {
	test("ends with the address a person can write to", () => {
		const html = renderHtml("Heading", [{ text: "Body." }]);
		const text = renderText("Heading", [{ text: "Body." }]);
		expect(PARTNER_CONTACT_EMAIL).toBe("anurag@edgecoms.com");
		expect(html).toContain(`<a href="mailto:${PARTNER_CONTACT_EMAIL}"`);
		expect(html).toContain("Replies to this email are not received.");
		expect(
			text.endsWith(
				`Questions? Email ${PARTNER_CONTACT_EMAIL}. Replies to this email are not received.`
			)
		).toBe(true);
	});
});
