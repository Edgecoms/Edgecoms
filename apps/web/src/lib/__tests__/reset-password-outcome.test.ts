import { describe, expect, test } from "bun:test";
import {
	describeResetFailure,
	EXPIRED_LINK_CODE,
	MAX_PASSWORD_LENGTH,
	MIN_PASSWORD_LENGTH,
} from "../reset-password-outcome";

const EM_DASH = "—";

describe("a refused password reset", () => {
	test("a link that ran out while the form was open goes to the expired screen", () => {
		expect(describeResetFailure(EXPIRED_LINK_CODE)).toEqual({
			kind: "expired",
		});
	});

	test("a password of the wrong length keeps the form and says the limit", () => {
		expect(describeResetFailure("PASSWORD_TOO_SHORT")).toEqual({
			kind: "retry",
			message: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
		});
		expect(describeResetFailure("PASSWORD_TOO_LONG")).toEqual({
			kind: "retry",
			message: `Use at most ${MAX_PASSWORD_LENGTH} characters.`,
		});
	});

	test("anything else keeps the form, and never shows the library's words", () => {
		for (const code of [
			undefined,
			"",
			"INTERNAL_SERVER_ERROR",
			"invalid_token",
		]) {
			const outcome = describeResetFailure(code);
			expect(outcome.kind).toBe("retry");
			if (outcome.kind === "retry") {
				expect(outcome.message).not.toContain("token");
				expect(outcome.message).not.toContain(EM_DASH);
			}
		}
	});
});
