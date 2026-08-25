import { z } from "zod";

/**
 * What the form accepts. Shared by the client (for inline errors) and the
 * server action (which re-validates, because a client check is a convenience
 * and never a control).
 *
 * Kept deliberately permissive on `phone`. Phone formats vary by country far
 * more than most regexes admit, and this form is for people worldwide — a
 * strict pattern here rejects real customers to catch typos that a human will
 * spot anyway. We check it plausibly contains enough digits and stop there.
 */
export const leadSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Enter your email address")
		.max(254, "That email address is too long")
		.email("That does not look like an email address")
		.transform((value) => value.toLowerCase()),
	name: z
		.string()
		.trim()
		.min(1, "Enter your name")
		.max(120, "That name is too long"),
	phone: z
		.string()
		.trim()
		.min(1, "Enter your phone number")
		.max(32, "That phone number is too long")
		.refine(
			(value) => (value.match(/\d/g) ?? []).length >= 6,
			"Enter a phone number we can reach you on"
		),
	/** Honeypot. Real people never see this field, so a filled one is a bot. */
	website: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type LeadFieldErrors = Partial<
	Record<"email" | "name" | "phone", string>
>;

/**
 * What the visitor typed, echoed back on failure.
 *
 * Required, not a nicety. React 19 calls `requestFormReset` on every
 * `<form action={fn}>` submission regardless of outcome, so an uncontrolled
 * form is emptied even when the action rejects it — leaving field errors
 * pointing at blank inputs. The action returns these so the fields can be
 * re-populated via `defaultValue`. The honeypot is deliberately never echoed.
 */
export interface LeadValues {
	email: string;
	name: string;
	phone: string;
}

export type LeadState =
	| { status: "idle" }
	| {
			status: "error";
			message: string;
			fieldErrors?: LeadFieldErrors;
			values: LeadValues;
	  }
	| { status: "success"; message: string };
