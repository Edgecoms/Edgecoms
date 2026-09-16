import { minorUnitDigits } from "@edgecoms/billing/money";

/**
 * Display-only money formatting. The API returns amounts as integer minor-unit
 * STRINGS (bigint-safe); this converts them for human display. Never use the
 * result for further math: the server owns all money arithmetic.
 *
 * The minor-unit digits come from `@edgecoms/billing/money`, the same table the
 * server converts with. This file used to keep its own shorter copy: nine
 * currencies against billing's twenty-odd, so a partner paid in UGX, XOF or
 * IQD saw an amount a hundred or a thousand times wrong. That module is pure
 * integer math with no imports of its own, so it is safe in a browser bundle.
 */
export function formatMoney(minorUnits: string, currency = "USD"): string {
	const digits = minorUnitDigits(currency);
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

/** A total in one currency, as the partner router returns them. */
export interface MoneyEntry {
	amountMinor: string;
	currency: string;
}

/**
 * The headline figure from a per-currency list.
 *
 * A partner earning in one currency — almost all of them — sees exactly what
 * they saw before. The list exists so the second currency is expressible at
 * all: summing two currencies produces a number that is not money, and showing
 * only the larger hides money the partner is owed.
 *
 * Largest first is guaranteed by the server, so this takes the front.
 */
export function primaryMoney(
	entries: readonly MoneyEntry[],
	zeroCurrency = "USD"
): string {
	const first = entries[0];
	if (!first) {
		return formatMoney("0", zeroCurrency);
	}
	return formatMoney(first.amountMinor, first.currency);
}

/**
 * Everything the headline figure left out, or null when there is nothing.
 *
 * Rendered beside the headline rather than added to it, because there is no
 * exchange rate in this system and inventing one to make a single number would
 * be inventing money.
 */
export function secondaryMoney(entries: readonly MoneyEntry[]): string | null {
	if (entries.length < 2) {
		return null;
	}
	return entries
		.slice(1)
		.map((entry) => formatMoney(entry.amountMinor, entry.currency))
		.join(" + ");
}

/** Every currency in one line, for a table cell. */
export function allMoney(
	entries: readonly MoneyEntry[],
	zeroCurrency = "USD"
): string {
	if (entries.length === 0) {
		return formatMoney("0", zeroCurrency);
	}
	return entries
		.map((entry) => formatMoney(entry.amountMinor, entry.currency))
		.join(" + ");
}
