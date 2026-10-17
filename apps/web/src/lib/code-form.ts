/** Form helpers shared by the admin code pages (attribution and promo). */

const PERCENT_PATTERN = /^(\d{1,3})(?:\.(\d{1,2}))?$/;

/**
 * "12.5" -> 1250 basis points, without floating point.
 *
 * `whole * 100` and the two-digit fraction are both exact in float64, so the sum
 * is exact. Multiplying 12.5 by 100 directly is not, and this is a money field.
 */
export function percentToBps(raw: string): number | null {
	const match = PERCENT_PATTERN.exec(raw.trim());
	if (!match) {
		return null;
	}
	const whole = Number(match[1]);
	const fraction = Number((match[2] ?? "").padEnd(2, "0"));
	return whole * 100 + fraction;
}

/** Empty string from an optional number field means "not set", not zero. */
export function optionalInt(value: FormDataEntryValue | null): number | null {
	const raw = String(value ?? "").trim();
	if (raw === "") {
		return null;
	}
	const parsed = Number(raw);
	return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}

export function formatExpiry(expiresAt: string | Date | null): string {
	if (!expiresAt) {
		return "Never";
	}
	return new Date(expiresAt).toLocaleDateString(undefined, {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}
