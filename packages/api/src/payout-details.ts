import { z } from "zod";

/**
 * WHERE A PARTNER GETS PAID, validated.
 *
 * These were two free-text fields nobody was asked to fill in, which meant the
 * first payout run would have discovered them empty. A batch file needs an
 * account number and an IFSC in their own fields, checked before anybody
 * presses send: a transfer to a malformed account bounces days later or reaches
 * the wrong person, and neither is recoverable by apologising.
 *
 * Validation lives here rather than inline so the partner's form, the payout
 * precondition and the tests cannot disagree about what "payable" means.
 */

/**
 * An Indian IFSC: four letters for the bank, a zero, then six for the branch.
 * The fifth character is reserved and always `0`, which is what makes this
 * worth checking rather than just measuring the length.
 */
export const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;

/** Indian account numbers run 9 to 18 digits depending on the bank. */
export const IN_ACCOUNT_PATTERN = /^\d{9,18}$/;

/** Loose on purpose: IBAN and other national formats vary far too much. */
export const INTL_ACCOUNT_PATTERN = /^[A-Z0-9][A-Z0-9 -]{6,33}$/;

const COUNTRY = /^[A-Z]{2}$/;

/**
 * What a partner submits. `destination` decides which fields matter, so the
 * shape is a discriminated union rather than a bag of optionals -- an Indian
 * account with no IFSC is not a valid thing to accept and then reject later.
 */
export const payoutDetailsInput = z.discriminatedUnion("destination", [
	z.object({
		accountName: z.string().min(2).max(140),
		accountNumber: z.string().regex(IN_ACCOUNT_PATTERN, "9 to 18 digits"),
		destination: z.literal("bank_in"),
		ifsc: z
			.string()
			.trim()
			.toUpperCase()
			.regex(IFSC_PATTERN, "An IFSC is 11 characters, e.g. HDFC0001234"),
	}),
	z.object({
		accountName: z.string().min(2).max(140),
		accountNumber: z
			.string()
			.trim()
			.toUpperCase()
			.regex(INTL_ACCOUNT_PATTERN, "Use the IBAN or account number"),
		country: z
			.string()
			.trim()
			.toUpperCase()
			.regex(COUNTRY, "A two-letter country code, e.g. DE"),
		destination: z.literal("bank_intl"),
	}),
]);

export type PayoutDetailsInput = z.infer<typeof payoutDetailsInput>;

/** The columns a validated submission writes. */
export function payoutDetailsPatch(input: PayoutDetailsInput) {
	if (input.destination === "bank_in") {
		return {
			payoutAccountName: input.accountName.trim(),
			payoutAccountNumber: input.accountNumber,
			payoutCountry: "IN",
			payoutDestination: "bank_in" as const,
			payoutIfsc: input.ifsc,
		};
	}
	return {
		payoutAccountName: input.accountName.trim(),
		payoutAccountNumber: input.accountNumber,
		payoutCountry: input.country,
		payoutDestination: "bank_intl" as const,
		/* Not an Indian account, so an IFSC would be meaningless here. */
		payoutIfsc: null,
	};
}

/** What a payout run needs on file. */
export interface PayoutDestinationRow {
	payoutAccountName: string | null;
	payoutAccountNumber: string | null;
	payoutCountry: string | null;
	payoutDestination: "bank_in" | "bank_intl" | null;
	payoutIfsc: string | null;
}

/**
 * Can this partner actually be paid?
 *
 * Re-checks the STORED values rather than trusting that they were validated on
 * the way in. Rows predate validators, and a payout run is the last place that
 * should assume.
 */
export function payoutBlocker(row: PayoutDestinationRow): string | null {
	if (!row.payoutDestination) {
		return "no payout details on file";
	}
	if (!row.payoutAccountName?.trim()) {
		return "no account holder name";
	}
	const account = row.payoutAccountNumber?.trim() ?? "";
	if (row.payoutDestination === "bank_in") {
		if (!IN_ACCOUNT_PATTERN.test(account)) {
			return "account number is not 9 to 18 digits";
		}
		if (!IFSC_PATTERN.test(row.payoutIfsc?.trim().toUpperCase() ?? "")) {
			return "IFSC is malformed";
		}
		return null;
	}
	if (!INTL_ACCOUNT_PATTERN.test(account)) {
		return "account number is malformed";
	}
	if (!COUNTRY.test(row.payoutCountry?.trim().toUpperCase() ?? "")) {
		return "no country on file";
	}
	return null;
}
