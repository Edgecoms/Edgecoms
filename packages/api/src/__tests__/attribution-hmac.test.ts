import { describe, expect, test } from "bun:test";
import {
	MAX_CLOCK_SKEW_MS,
	signingString,
	signPayload,
	verifySignature,
} from "../attribution/hmac";

/**
 * Request signing for the attribution endpoints — an authorization boundary, so
 * every way it can fail open is pinned here.
 */

const SECRET = "a".repeat(32);
const NOW = new Date("2026-08-17T12:00:00Z");
const BODY = JSON.stringify({
	code: "ALEXAGENCY",
	shopDomain: "s.myshopify.com",
});

function unixSeconds(date: Date): string {
	return String(Math.floor(date.getTime() / 1000));
}

function signed(
	overrides: Partial<Parameters<typeof verifySignature>[0]> = {}
) {
	const timestamp = unixSeconds(NOW);
	return verifySignature({
		secret: SECRET,
		rawBody: BODY,
		timestamp,
		signature: signPayload(SECRET, timestamp, BODY),
		now: NOW,
		...overrides,
	});
}

describe("signing string", () => {
	test("binds the timestamp to the body", () => {
		expect(signingString("123", "{}")).toBe("123.{}");
	});

	test("a different timestamp produces a different digest", () => {
		// This is what stops a captured body from being replayed with a fresh
		// timestamp: the timestamp is inside the MAC, so it can't be moved.
		expect(signPayload(SECRET, "100", BODY)).not.toBe(
			signPayload(SECRET, "200", BODY)
		);
	});
});

describe("verifySignature", () => {
	test("accepts a correctly signed request", () => {
		expect(signed()).toEqual({ ok: true });
	});

	test("rejects a tampered body", () => {
		const timestamp = unixSeconds(NOW);
		const verdict = verifySignature({
			secret: SECRET,
			// Signed the real body, then swapped the shop for someone else's.
			rawBody: JSON.stringify({
				code: "ALEXAGENCY",
				shopDomain: "victim.myshopify.com",
			}),
			timestamp,
			signature: signPayload(SECRET, timestamp, BODY),
			now: NOW,
		});
		expect(verdict).toEqual({ ok: false, reason: "bad_signature" });
	});

	test("rejects a signature made with a different secret", () => {
		const timestamp = unixSeconds(NOW);
		expect(
			verifySignature({
				secret: SECRET,
				rawBody: BODY,
				timestamp,
				signature: signPayload("b".repeat(32), timestamp, BODY),
				now: NOW,
			})
		).toEqual({ ok: false, reason: "bad_signature" });
	});

	test("rejects a missing signature header", () => {
		expect(signed({ signature: null })).toEqual({
			ok: false,
			reason: "missing_signature",
		});
	});

	test("rejects a missing timestamp header", () => {
		expect(signed({ timestamp: null })).toEqual({
			ok: false,
			reason: "missing_timestamp",
		});
	});

	test("rejects a non-numeric timestamp", () => {
		expect(signed({ timestamp: "not-a-number" })).toEqual({
			ok: false,
			reason: "malformed_timestamp",
		});
	});

	test("rejects a millisecond timestamp", () => {
		// A caller sending Date.now() instead of unix seconds. Without the integer
		// + skew check this reads as the far future and could slip past a naive
		// "not older than 5 minutes" test.
		const millis = String(NOW.getTime());
		expect(
			verifySignature({
				secret: SECRET,
				rawBody: BODY,
				timestamp: millis,
				signature: signPayload(SECRET, millis, BODY),
				now: NOW,
			})
		).toEqual({ ok: false, reason: "stale_timestamp" });
	});

	test("rejects a stale timestamp", () => {
		const old = new Date(NOW.getTime() - MAX_CLOCK_SKEW_MS - 1000);
		const timestamp = unixSeconds(old);
		expect(
			verifySignature({
				secret: SECRET,
				rawBody: BODY,
				timestamp,
				signature: signPayload(SECRET, timestamp, BODY),
				now: NOW,
			})
		).toEqual({ ok: false, reason: "stale_timestamp" });
	});

	test("rejects a timestamp too far in the future", () => {
		// Skew is absolute. A future timestamp would otherwise extend the window a
		// captured signature stays replayable for.
		const ahead = new Date(NOW.getTime() + MAX_CLOCK_SKEW_MS + 1000);
		const timestamp = unixSeconds(ahead);
		expect(
			verifySignature({
				secret: SECRET,
				rawBody: BODY,
				timestamp,
				signature: signPayload(SECRET, timestamp, BODY),
				now: NOW,
			})
		).toEqual({ ok: false, reason: "stale_timestamp" });
	});

	test("accepts a timestamp inside the skew window", () => {
		const recent = new Date(NOW.getTime() - (MAX_CLOCK_SKEW_MS - 1000));
		const timestamp = unixSeconds(recent);
		expect(
			verifySignature({
				secret: SECRET,
				rawBody: BODY,
				timestamp,
				signature: signPayload(SECRET, timestamp, BODY),
				now: NOW,
			})
		).toEqual({ ok: true });
	});

	test("rejects a truncated signature", () => {
		const timestamp = unixSeconds(NOW);
		const full = signPayload(SECRET, timestamp, BODY);
		expect(signed({ signature: full.slice(0, 32) })).toEqual({
			ok: false,
			reason: "bad_signature",
		});
	});

	test("rejects a non-hex signature of the right length", () => {
		// Buffer.from(…, "hex") truncates invalid input rather than throwing, so
		// this is the case that would slip through a naive comparison.
		expect(signed({ signature: "z".repeat(64) })).toEqual({
			ok: false,
			reason: "bad_signature",
		});
	});

	test("accepts an upper-case signature", () => {
		const timestamp = unixSeconds(NOW);
		expect(
			signed({ signature: signPayload(SECRET, timestamp, BODY).toUpperCase() })
		).toEqual({ ok: true });
	});

	test("rejects an empty signature", () => {
		expect(signed({ signature: "" })).toEqual({
			ok: false,
			reason: "missing_signature",
		});
	});
});
