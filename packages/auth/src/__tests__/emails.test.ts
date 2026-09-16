import { describe, expect, test } from "bun:test";
import { renderResetPasswordEmail, renderVerifyEmail } from "../emails";

/**
 * The two account emails. Each has one job and one link, so the tests pin that
 * the link is present in both renderings and that neither breaks house style.
 */

const LINK = "https://edge.test/api/auth/verify?token=abc";
const EM_DASH = "—";

describe("the account emails", () => {
	const verify = renderVerifyEmail({ to: "alex@acme.com", url: LINK });
	const reset = renderResetPasswordEmail({ to: "alex@acme.com", url: LINK });

	test("carry their link in both renderings", () => {
		for (const email of [verify, reset]) {
			expect(email.text).toContain(LINK);
			expect(email.html).toContain(LINK);
			expect(email.to).toBe("alex@acme.com");
		}
	});

	test("contain no em dash, in any part", () => {
		for (const email of [verify, reset]) {
			expect(email.subject).not.toContain(EM_DASH);
			expect(email.text).not.toContain(EM_DASH);
			expect(email.html).not.toContain(EM_DASH);
		}
	});

	test("the link is a button someone can press", () => {
		expect(verify.html).toContain(`<a href="${LINK}"`);
		expect(verify.html).toContain(">Confirm my email</a>");
		expect(reset.html).toContain(">Choose a new password</a>");
		expect(reset.text).toContain(`Choose a new password: ${LINK}`);
	});

	test("name who to write to, since replies are not received", () => {
		for (const email of [verify, reset]) {
			expect(email.text).toContain("Questions? Email anurag@edgecoms.com.");
			expect(email.text.toLowerCase()).not.toContain("reply to this email");
		}
	});

	test("the reset email says the link is short-lived and safe to ignore", () => {
		expect(reset.text).toContain("expires in an hour");
		expect(reset.text).toContain("your password has not changed");
	});

	test("the verify email says it is what links an invitation", () => {
		expect(verify.text).toContain("links your invitation");
	});

	test("a hostile link is escaped in the HTML", () => {
		const hostile = renderVerifyEmail({
			to: "alex@acme.com",
			url: 'https://edge.test/?q="><script>alert(1)</script>',
		});
		expect(hostile.html).not.toContain("<script>");
		expect(hostile.html).toContain("&lt;script&gt;");
	});
});
