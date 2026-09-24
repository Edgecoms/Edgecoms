const DATE_TIME = new Intl.DateTimeFormat("en", {
	dateStyle: "medium",
	timeStyle: "short",
	timeZone: "UTC",
});
const RELATIVE = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
	["day", 86_400_000],
	["hour", 3_600_000],
	["minute", 60_000],
];

/** A timestamp as UTC, so every admin reads the same moment. */
export function dateTime(value: Date | string | null): string {
	return value ? `${DATE_TIME.format(new Date(value))} UTC` : "-";
}

/** "2 hours ago", falling back to the date past a month. */
export function ago(value: Date | string | null, now = new Date()): string {
	if (!value) {
		return "-";
	}
	const diff = new Date(value).getTime() - now.getTime();
	if (Math.abs(diff) > 30 * 86_400_000) {
		return dateTime(value);
	}
	for (const [unit, size] of UNITS) {
		if (Math.abs(diff) >= size) {
			return RELATIVE.format(Math.round(diff / size), unit);
		}
	}
	return "just now";
}

export function count(value: number): string {
	return value.toLocaleString("en");
}
