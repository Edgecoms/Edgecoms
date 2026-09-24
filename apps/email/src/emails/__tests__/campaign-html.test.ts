/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import {
	claudePrompt,
	htmlProblem,
	htmlToText,
	withoutPlaceholders,
} from "../campaign-html";

const UNSUBSCRIBE = "{{{RESEND_UNSUBSCRIBE_URL}}}";

describe("pasted campaign HTML", () => {
	test("needs the unsubscribe placeholder and no scripts", () => {
		expect(htmlProblem("")).toContain("Paste");
		expect(htmlProblem("<p>Hi</p>")).toContain("unsubscribe");
		expect(
			htmlProblem(`<a href="${UNSUBSCRIBE}">x</a><SCRIPT>alert(1)</SCRIPT>`)
		).toContain("script");
		expect(htmlProblem(`<a href="${UNSUBSCRIBE}">Unsubscribe</a>`)).toBeNull();
	});

	test("the preview and a test email neutralise the placeholder", () => {
		expect(withoutPlaceholders(`<a href="${UNSUBSCRIBE}">u</a>`)).toBe(
			'<a href="#">u</a>'
		);
	});

	test("becomes readable plain text: links keep their address, head is dropped", () => {
		const html = `<!doctype html><html><head><title>T</title><style>p{color:red}</style></head><body>
			<table><tr><td><h1>Smart Upsells are here</h1></td></tr>
			<tr><td><p>Your cart can now choose&nbsp;the upsell &amp; more.</p>
			<p>Line one<br>Line two</p>
			<a href="https://edgecoms.app/x" style="x">Try it &rarr;</a>
			<a href="${UNSUBSCRIBE}">Unsubscribe</a></td></tr></table><!-- hidden --></body></html>`;
		expect(htmlToText(html)).toBe(
			[
				"Smart Upsells are here",
				"",
				"Your cart can now choose the upsell & more.",
				"",
				"Line one",
				"Line two",
				"",
				"Try it &rarr; (https://edgecoms.app/x)",
				`Unsubscribe (${UNSUBSCRIBE})`,
			].join("\n")
		);
	});

	test("the Claude brief carries the unsubscribe rule and the icon", () => {
		const prompt = claudePrompt(
			"Edge Cart",
			"https://email.edgecoms.app/app-icons/edge-cart.png"
		);
		expect(prompt).toContain(`href="${UNSUBSCRIBE}"`);
		expect(prompt).toContain("app-icons/edge-cart.png");
		expect(prompt).not.toContain("—");
	});
});
