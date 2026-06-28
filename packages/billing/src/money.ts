/**
 * Integer money math. NO floating point ever touches money — every value is a
 * bigint in minor units, accompanied by a 3-char currency code (CLAUDE.md
 * "Money correctness"). This module is the only place currency conversion and
 * commission calculation are allowed to happen.
 */

/**
 * ISO-4217 minor-unit digits for currencies that are NOT the default of 2.
 * Used to convert a decimal amount string into integer minor units without
 * floating point.
 */
const MINOR_UNIT_DIGITS: Record<string, number> = {
	// Zero-decimal currencies
	BIF: 0,
	CLP: 0,
	DJF: 0,
	GNF: 0,
	ISK: 0,
	JPY: 0,
	KMF: 0,
	KRW: 0,
	PYG: 0,
	RWF: 0,
	UGX: 0,
	VND: 0,
	VUV: 0,
	XAF: 0,
	XOF: 0,
	XPF: 0,
	// Three-decimal currencies
	BHD: 3,
	IQD: 3,
	JOD: 3,
	KWD: 3,
	LYD: 3,
	OMR: 3,
	TND: 3,
};

const DEFAULT_MINOR_UNIT_DIGITS = 2;
const BASIS_POINTS_DIVISOR = 10_000n;
const DECIMAL_AMOUNT_PATTERN = /^(-?)(\d+)(?:\.(\d+))?$/;

/** The number of minor-unit digits for a currency (default 2). */
export function minorUnitDigits(currency: string): number {
	return MINOR_UNIT_DIGITS[currency.toUpperCase()] ?? DEFAULT_MINOR_UNIT_DIGITS;
}

/**
 * Converts a decimal amount string (e.g. "12.34", "-5", "0.001") for a given
 * currency into integer minor units — WITHOUT floating point. Throws on a
 * malformed amount or on more fractional digits than the currency supports
 * (silent truncation of money is never acceptable).
 */
export function decimalStringToMinorUnits(
	amount: string,
	currency: string
): bigint {
	const match = DECIMAL_AMOUNT_PATTERN.exec(amount.trim());
	if (!match) {
		throw new Error(`Invalid decimal amount: "${amount}"`);
	}

	// Groups: 1=sign ("-" or ""), 2=whole digits (always present), 3=fraction.
	const sign = match[1] ?? "";
	const whole = match[2] ?? "0";
	const fraction = match[3] ?? "";
	const digits = minorUnitDigits(currency);

	if (fraction.length > digits) {
		throw new Error(
			`Amount "${amount}" has more fractional digits than ${currency} supports (${digits})`
		);
	}

	const scaledWhole = BigInt(whole) * 10n ** BigInt(digits);
	const fractionMinor =
		fraction === "" ? 0n : BigInt(fraction.padEnd(digits, "0"));
	const magnitude = scaledWhole + fractionMinor;

	return sign === "-" ? -magnitude : magnitude;
}

/** Renders integer minor units back to a decimal string for display. */
export function minorUnitsToDecimalString(
	minor: bigint,
	currency: string
): string {
	const digits = minorUnitDigits(currency);
	if (digits === 0) {
		return minor.toString();
	}

	const negative = minor < 0n;
	const absolute = (negative ? -minor : minor)
		.toString()
		.padStart(digits + 1, "0");
	const splitAt = absolute.length - digits;
	const whole = absolute.slice(0, splitAt);
	const fraction = absolute.slice(splitAt);

	return `${negative ? "-" : ""}${whole}.${fraction}`;
}

/**
 * Computes a commission amount from a base amount and a rate in basis points,
 * using integer math only. Truncates toward zero (BigInt division), so a
 * negative base (a clawback) yields a negative commission of equal-or-smaller
 * magnitude. The result is in the same minor units / currency as the base.
 */
export function computeCommissionMinor(
	baseMinor: bigint,
	rateBps: number
): bigint {
	if (!Number.isInteger(rateBps)) {
		throw new Error(`rateBps must be an integer, got ${rateBps}`);
	}
	if (rateBps < 0) {
		throw new Error(`rateBps must be non-negative, got ${rateBps}`);
	}
	return (baseMinor * BigInt(rateBps)) / BASIS_POINTS_DIVISOR;
}

/** Sums a list of minor-unit amounts. */
export function sumMinor(values: Iterable<bigint>): bigint {
	let total = 0n;
	for (const value of values) {
		total += value;
	}
	return total;
}
