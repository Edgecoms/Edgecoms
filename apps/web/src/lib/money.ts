/**
 * Display-only money formatting. The API returns amounts as integer minor-unit
 * STRINGS (bigint-safe); this converts them for human display. Never use the
 * result for further math — the server owns all money arithmetic.
 */
const MINOR_DIGITS: Record<string, number> = {
	JPY: 0,
	KRW: 0,
	VND: 0,
	CLP: 0,
	ISK: 0,
	BHD: 3,
	KWD: 3,
	OMR: 3,
	TND: 3,
};

export function formatMoney(minorUnits: string, currency = "USD"): string {
	const digits = MINOR_DIGITS[currency] ?? 2;
	const value = Number(minorUnits) / 10 ** digits;
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	}).format(value);
}

/** Formats a `YYYY-MM` period as e.g. "March 2026". */
export function formatPeriod(period: string): string {
	const [year, month] = period.split("-");
	if (!(year && month)) {
		return period;
	}
	const date = new Date(Number(year), Number(month) - 1, 1);
	return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
