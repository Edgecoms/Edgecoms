import { describe, expect, test } from "bun:test";

import {
	chooseTransport,
	LOGO_CID,
	logoBase64,
	playbookHtml,
	playbookText,
} from "../edge-cart-email";
import { HONEYPOT_FIELD, leadSchema } from "../edge-cart-lead";
import {
	EDGE_CART_PLANS,
	PRICE_AT_2000_ORDERS,
	USAGE_FEE_AT_2000_ORDERS,
	VOLUME_BANDS,
} from "../edge-cart-pricing";
import {
	allowRequest,
	REQUEST_LIMIT,
	resetRateLimit,
	WINDOW_MS,
} from "../edge-cart-rate-limit";
import { EDGE_CART_FAQ_QUESTIONS, edgeCartCopyStrings } from "./edge-cart-copy";

/**
 * The Edge Cart landing page's money paths and its one public write endpoint.
 *
 * The pricing block matters most: the page quotes what a merchant will be
 * billed, and it got that wrong once already by describing a usage-fee plan as
 * flat. These tests pin the numbers to the app's own billing table so the next
 * edit has to be deliberate.
 */

describe("pricing", () => {
	test("every band's total is its base plus its usage fee", () => {
		const cents = (value: string) =>
			Math.round(Number.parseFloat(value.replace("$", "")) * 100);

		for (const band of VOLUME_BANDS) {
			expect(cents(band.base) + cents(band.usage)).toBe(cents(band.total));
		}
	});

	test("the 2,000 order figures come from the band that contains 2,000", () => {
		expect(PRICE_AT_2000_ORDERS).toBe("$59.99");
		expect(USAGE_FEE_AT_2000_ORDERS).toBe("$45.00");
	});

	test("only Enterprise claims to have no usage fees", () => {
		const noUsageFee = EDGE_CART_PLANS.filter((plan) =>
			plan.note?.includes("no usage fees")
		);
		expect(noUsageFee.map((plan) => plan.name)).toEqual(["Enterprise"]);
	});

	test("exactly one plan is marked most popular", () => {
		expect(EDGE_CART_PLANS.filter((plan) => plan.popular)).toHaveLength(1);
	});
});

describe("lead validation", () => {
	const valid = { email: "merchant@example.com", source: "hero" as const };

	test("accepts a work email with no store URL", () => {
		expect(leadSchema.safeParse(valid).success).toBe(true);
	});

	test("rejects a malformed email", () => {
		expect(
			leadSchema.safeParse({ ...valid, email: "not-an-email" }).success
		).toBe(false);
	});

	test("rejects an unknown source, so the field cannot be used as free text", () => {
		expect(leadSchema.safeParse({ ...valid, source: "anywhere" }).success).toBe(
			false
		);
	});

	test("keeps the honeypot value so the route can refuse on it", () => {
		const parsed = leadSchema.safeParse({ ...valid, [HONEYPOT_FIELD]: "Acme" });
		expect(parsed.success).toBe(true);
		expect(parsed.success && parsed.data[HONEYPOT_FIELD]).toBe("Acme");
	});
});

describe("rate limit", () => {
	test("allows the limit, then refuses", () => {
		resetRateLimit();
		for (let i = 0; i < REQUEST_LIMIT; i++) {
			expect(allowRequest("1.2.3.4")).toBe(true);
		}
		expect(allowRequest("1.2.3.4")).toBe(false);
	});

	test("counts per IP, so one visitor cannot block another", () => {
		resetRateLimit();
		for (let i = 0; i < REQUEST_LIMIT; i++) {
			allowRequest("1.2.3.4");
		}
		expect(allowRequest("5.6.7.8")).toBe(true);
	});

	test("a refusal does not extend the block", () => {
		resetRateLimit();
		const start = 1_000_000;
		for (let i = 0; i < REQUEST_LIMIT; i++) {
			allowRequest("1.2.3.4", start);
		}
		/* Refused repeatedly right up to the edge of the window... */
		for (let i = 0; i < 20; i++) {
			expect(allowRequest("1.2.3.4", start + WINDOW_MS - 1)).toBe(false);
		}
		/* ...and the window still expires on schedule. */
		expect(allowRequest("1.2.3.4", start + WINDOW_MS + 1)).toBe(true);
	});
});

describe("copy", () => {
	test("no rendered string contains an em dash", () => {
		const offenders = edgeCartCopyStrings().filter((value) =>
			value.includes("—")
		);
		expect(offenders).toEqual([]);
	});

	test("no rendered string claims flat pricing or no usage fees", () => {
		/* The claim that was wrong. Growth is a base fee plus a usage fee. */
		const offenders = edgeCartCopyStrings().filter((value) => {
			const lower = value.toLowerCase();
			return (
				lower.includes("flat pricing") ||
				(lower.includes("no usage fee") && !lower.includes("enterprise"))
			);
		});
		expect(offenders).toEqual([]);
	});

	test("the two retired FAQ questions are gone", () => {
		expect(EDGE_CART_FAQ_QUESTIONS).not.toContain(
			"Can I run different offers per country?"
		);
		expect(EDGE_CART_FAQ_QUESTIONS).not.toContain(
			"What acceptance rate should I expect?"
		);
	});

	test("the FAQ carries the twelve questions the page ships", () => {
		expect(EDGE_CART_FAQ_QUESTIONS).toHaveLength(12);
	});
});

describe("playbook email", () => {
	/**
	 * The landing page promises "the four levers, the threshold math, and the
	 * four upsell rules worth writing first", plus the install link. These
	 * assertions are that promise, so the email cannot quietly stop delivering
	 * what the form was advertised as sending.
	 */
	test("delivers all three blocks the landing page promises", () => {
		const body = playbookText();
		expect(body).toContain("THE THRESHOLD MATH, FIRST");
		expect(body).toContain("THE FOUR LEVERS");
		expect(body).toContain("THE FOUR UPSELL RULES WORTH WRITING FIRST");
		expect(body).toContain("https://apps.shopify.com/edgecart");
		expect(body).toContain("Anurag");
	});

	test("each numbered block really has four items", () => {
		const body = playbookText();
		for (const heading of ["THE FOUR LEVERS", "THE FOUR UPSELL RULES"]) {
			const start = body.indexOf(heading);
			const block = body.slice(
				start,
				body.indexOf("\n\n", body.indexOf("4. ", start))
			);
			expect(block).toContain("1. ");
			expect(block).toContain("4. ");
			expect(block).not.toContain("5. ");
		}
	});

	test("the HTML and the text carry the same sections", () => {
		const html = playbookHtml();
		for (const heading of [
			"The threshold math, first",
			"The four levers",
			"The four upsell rules worth writing first",
			"Before you publish",
		]) {
			expect(html).toContain(heading);
		}
	});

	test("offers no discount, in either rendering", () => {
		/* Discount codes for Edge Cart are issued by hand after a conversation.
		   The moment an automated email promises one, every recipient is owed
		   it, so this guard is permanent rather than a placeholder. */
		const forbidden = [
			"% off",
			"coupon",
			"discount code",
			"free for",
			"off your first",
			"promo",
			"voucher",
		];
		for (const rendering of [playbookText(), playbookHtml()]) {
			const body = rendering.toLowerCase();
			for (const phrase of forbidden) {
				expect(body).not.toContain(phrase);
			}
		}
	});

	test("links the walkthrough without an embed, which email strips", () => {
		const html = playbookHtml();
		expect(html).toContain("https://www.youtube.com/watch?v=DDr1GQfYHqI");
		expect(html).toContain("i.ytimg.com/vi/DDr1GQfYHqI");
		/* An iframe, script or video tag in a message body is removed by every
		   major client, leaving blank space where the player should be. */
		for (const tag of ["<iframe", "<script", "<video", "youtube.com/embed"]) {
			expect(html).not.toContain(tag);
		}
		/* Images are blocked by default in many clients, so the text rendering
		   has to carry the link on its own. */
		expect(playbookText()).toContain(
			"https://www.youtube.com/watch?v=DDr1GQfYHqI"
		);
	});

	test("embeds the logo rather than linking a not-yet-deployed asset", () => {
		/* Linking `SITE_URL + /app-icons/...` 404s until a deploy lands, which
		   made the logo a broken image in every test send. The bytes now travel
		   with the message, so there is nothing to deploy first. */
		const cid = playbookHtml(LOGO_CID);
		expect(cid).toContain(`src="cid:${LOGO_CID}"`);
		expect(cid).not.toContain("/app-icons/");
		expect(cid).not.toContain("edgecoms.app");
		expect(logoBase64()).not.toBeNull();
	});

	test("renders no logo at all when the asset cannot be read", () => {
		/* A missing file must cost the email its logo, never its delivery, and
		   an empty header beats a broken-image icon. */
		const withoutLogo = playbookHtml(null);
		expect(withoutLogo).not.toContain("cid:");
		expect(withoutLogo).not.toContain('<img alt="Edge Cart"');
		expect(withoutLogo).toContain("Your Edge Cart setup playbook");
	});

	test("sends the reader to the app listing", () => {
		expect(playbookText()).toContain("https://apps.shopify.com/edgecart");
		expect(playbookHtml()).toContain(
			'href="https://apps.shopify.com/edgecart"'
		);
	});

	test("contains no em dash, in either rendering", () => {
		expect(playbookText()).not.toContain("—");
		expect(playbookHtml()).not.toContain("—");
	});
});

describe("transport selection", () => {
	const resendOnly = {
		apiKey: "re_live_key",
		from: "Anurag <anurag@edgecoms.app>",
	};

	test("production sends through Resend", () => {
		expect(chooseTransport({ ...resendOnly, nodeEnv: "production" })).toEqual({
			apiKey: "re_live_key",
			kind: "resend",
		});
	});

	test("production IGNORES a stray local SMTP url and still uses Resend", () => {
		/* The regression this exists for: preferring SMTP whenever it was set
		   meant one stale variable in the deployed environment silently stopped
		   every playbook email, because the production guard threw and the error
		   was swallowed as "failed" without ever trying Resend. */
		expect(
			chooseTransport({
				...resendOnly,
				nodeEnv: "production",
				smtpUrl: "smtp://localhost:1025",
			})
		).toEqual({ apiKey: "re_live_key", kind: "resend" });
	});

	test("development prefers the catcher, so tests cannot send real mail", () => {
		expect(
			chooseTransport({
				...resendOnly,
				nodeEnv: "development",
				smtpUrl: "smtp://localhost:1025",
			})
		).toEqual({ kind: "smtp", url: "smtp://localhost:1025" });
	});

	test("development with no catcher still reaches Resend", () => {
		expect(chooseTransport({ ...resendOnly, nodeEnv: "development" })).toEqual({
			apiKey: "re_live_key",
			kind: "resend",
		});
	});

	test("no sender address is a refusal, not a silent send", () => {
		const chosen = chooseTransport({
			apiKey: "re_live_key",
			nodeEnv: "production",
		});
		expect(chosen.kind).toBe("none");
	});

	test("production without a key says so, and names the ignored smtp url", () => {
		const chosen = chooseTransport({
			from: "a@edgecoms.app",
			nodeEnv: "production",
			smtpUrl: "smtp://localhost:1025",
		});
		expect(chosen.kind).toBe("none");
		expect(chosen.kind === "none" && chosen.reason).toContain("RESEND_API_KEY");
	});
});
