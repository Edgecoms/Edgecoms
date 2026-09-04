import { describe, expect, test } from "bun:test";

import { buildMimeMessage, envelopeAddress } from "../dev-smtp";

/**
 * The local SMTP transport.
 *
 * Most of these came from actually sending: the envelope bug shipped a
 * malformed `MAIL FROM:<Anurag <anurag@edgecoms.app>>` that a real catcher
 * would refuse, and it was invisible until a socket was on the other end.
 */

describe("envelope address", () => {
	test("strips a display name, which the envelope may not carry", () => {
		expect(envelopeAddress("Anurag <anurag@edgecoms.app>")).toBe(
			"anurag@edgecoms.app"
		);
	});

	test("passes a bare address through untouched", () => {
		expect(envelopeAddress("anurag@edgecoms.app")).toBe("anurag@edgecoms.app");
	});

	test("trims incidental whitespace", () => {
		expect(envelopeAddress("  Anurag  < anurag@edgecoms.app >  ")).toBe(
			"anurag@edgecoms.app"
		);
	});
});

describe("mime message", () => {
	const message = {
		from: "Anurag <anurag@edgecoms.app>",
		html: "<p>Hello</p>",
		subject: "Your Edge Cart setup playbook",
		text: "Hello",
		to: "merchant@example.com",
	};
	const built = buildMimeMessage(message, "boundary-1", new Date(0));

	test("keeps the display name in the From header", () => {
		expect(built).toContain("From: Anurag <anurag@edgecoms.app>");
	});

	test("separates headers from the body with one blank line", () => {
		const [headers] = built.split("\r\n\r\n");
		expect(headers).toContain("Subject: Your Edge Cart setup playbook");
		/* A stray leading blank line collapses every header into the body. */
		expect(built.startsWith("From:")).toBe(true);
	});

	test("carries both renderings as multipart/alternative", () => {
		expect(built).toContain(
			'Content-Type: multipart/alternative; boundary="boundary-1alt"'
		);
		expect(built).toContain('Content-Type: text/plain; charset="utf-8"');
		expect(built).toContain('Content-Type: text/html; charset="utf-8"');
		expect(built.trimEnd().endsWith("--boundary-1alt--")).toBe(true);
	});

	test("base64 encodes the parts, so no body line can be a lone dot", () => {
		expect(built).toContain("Content-Transfer-Encoding: base64");
		const body = built.split("\r\n\r\n").slice(1).join("\r\n\r\n");
		expect(body.split("\r\n")).not.toContain(".");
		expect(built).toContain(Buffer.from("Hello", "utf8").toString("base64"));
	});

	test("wraps base64 at the 76 characters RFC 2045 allows", () => {
		const long = buildMimeMessage(
			{ ...message, text: "x".repeat(500) },
			"b",
			new Date(0)
		);
		for (const line of long.split("\r\n")) {
			expect(line.length).toBeLessThanOrEqual(78);
		}
	});
});

describe("inline image", () => {
	const base = {
		from: "a@edgecoms.app",
		html: '<img src="cid:logo" />',
		subject: "s",
		text: "t",
		to: "b@example.com",
	};

	test("wraps the alternative in multipart/related and attaches the image", () => {
		const built = buildMimeMessage(
			{
				...base,
				inlineImage: { base64: "AAAA", cid: "logo", filename: "logo.png" },
			},
			"b",
			new Date(0)
		);
		/* `related` is what makes a client treat the image as part of the HTML
		   rather than a download, and what makes `cid:` resolve. */
		expect(built).toContain('Content-Type: multipart/related; boundary="brel"');
		expect(built).toContain(
			'Content-Type: multipart/alternative; boundary="balt"'
		);
		expect(built).toContain("Content-ID: <logo>");
		expect(built).toContain('Content-Disposition: inline; filename="logo.png"');
		expect(built.trimEnd().endsWith("--brel--")).toBe(true);
	});

	test("stays a plain multipart/alternative with no image", () => {
		const built = buildMimeMessage(base, "b", new Date(0));
		expect(built).not.toContain("multipart/related");
		expect(built).toContain(
			'Content-Type: multipart/alternative; boundary="balt"'
		);
	});
});
