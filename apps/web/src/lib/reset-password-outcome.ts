/** Better Auth's defaults, restated so the form can say them before submit. */
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

/** The code Better Auth returns for a reset link that was used or ran out. */
export const EXPIRED_LINK_CODE = "INVALID_TOKEN";

export type ResetFailure =
	| { kind: "expired" }
	| { kind: "retry"; message: string };

/**
 * What a refused reset means for the person holding the form.
 *
 * A dead link is not something they can fix by typing again, so it goes to the
 * same screen as arriving on a dead link. Everything else keeps the form, with
 * a sentence they can act on instead of the library's own message.
 */
export function describeResetFailure(code: string | undefined): ResetFailure {
	if (code === EXPIRED_LINK_CODE) {
		return { kind: "expired" };
	}
	if (code === "PASSWORD_TOO_SHORT") {
		return {
			kind: "retry",
			message: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
		};
	}
	if (code === "PASSWORD_TOO_LONG") {
		return {
			kind: "retry",
			message: `Use at most ${MAX_PASSWORD_LENGTH} characters.`,
		};
	}
	return {
		kind: "retry",
		message: "The password was not saved. Try again in a moment.",
	};
}
