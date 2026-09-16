import { describe, expect, test } from "bun:test";
import { resendMessage } from "../send";
import { buildMimeMessage } from "../smtp";

/**
 * The sending domain receives no mail, so a reply to the From address bounces.
 * These pin that a configured reply address reaches both transports.
 */

const EMAIL = {
	html: "<p>Hi</p>",
	subject: "Subject",
	text: "Hi",
	to: "alex@acme.com",
};
const FROM = "Edge Partners <partners@edge.test>";

describe("the reply address", () => {
	test("is sent to Resend when configured", () => {
		expect(resendMessage(EMAIL, FROM, "owner@edge.test")).toEqual({
			...EMAIL,
			from: FROM,
			replyTo: "owner@edge.test",
		});
	});

	test("is left off when not configured, so replies go to From", () => {
		expect(resendMessage(EMAIL, FROM, undefined)).not.toHaveProperty("replyTo");
		expect(resendMessage(EMAIL, FROM, "")).not.toHaveProperty("replyTo");
	});

	test("becomes a Reply-To header on the local SMTP path", () => {
		const date = new Date("2026-09-16T00:00:00Z");
		const withReply = buildMimeMessage(
			{ ...EMAIL, from: FROM, replyTo: "owner@edge.test" },
			"b",
			date
		);
		expect(withReply).toContain("\r\nReply-To: owner@edge.test\r\n");

		const without = buildMimeMessage({ ...EMAIL, from: FROM }, "b", date);
		expect(without).not.toContain("Reply-To:");
	});
});
