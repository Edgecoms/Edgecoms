/**
 * The Black Friday 2026 promo codes: one per marketing platform, so installs
 * and revenue can be read per platform on /admin/promo-codes. Each is 3 billing
 * cycles free on any paid plan of any Edge app.
 *
 * Redeemable through the last second of 30 November 2026 UTC: `expiresAt` is
 * exclusive (a code is expired once now >= expiresAt).
 */
export const BFCM_PROMO_EXPIRES_AT = new Date("2026-12-01T00:00:00Z");

export const BFCM_PROMO_CYCLES = 3;

export const BFCM_PROMO_CODES: readonly string[] = [
	"COMMUNITY90",
	"PRACTICAL90",
	"DIGI90",
	"ECOMAI90",
	"DROPSHIP90",
	"LETS90",
	"PH90",
	"G290",
	"DTC90",
	"CWILL90",
	"LIBAU90",
	"SAASHUB90",
	"OUTBOUND90",
	"YT90",
	"ACADEMY90",
];
