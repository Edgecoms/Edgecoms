import type { Database } from "@edgecoms/db";
import { user } from "@edgecoms/db/schema/auth";
import { merchants } from "@edgecoms/db/schema/merchants";
import { partnerCodes, partners } from "@edgecoms/db/schema/partners";
import { count, eq } from "drizzle-orm";

/**
 * Attribution code lookup and validation.
 *
 * The one rule that shapes this file: every rejection returns the SAME outward
 * reason. Unknown, disabled, expired, exhausted, and "the partner isn't approved"
 * are indistinguishable to a caller, so a script cannot walk the code space by
 * reading error messages. The real reason travels in `detail`, which is written
 * to `code_redemption_attempts.reason` and never returned over HTTP.
 */

const WHITESPACE = /\s+/g;

/**
 * Canonical form of a code: no whitespace, upper-case.
 *
 * Codes are matched case-insensitively because a merchant retypes what an agency
 * emailed them, and whitespace is stripped because copy-paste adds it. Nothing
 * else is normalized — a hyphen in `ACME-PARTNER` is part of the code.
 */
export function normalizeCode(input: string): string {
	return input.replace(WHITESPACE, "").toUpperCase();
}

/** A validated code, with everything the bind and the response need. */
export interface ResolvedCode {
	code: string;
	id: string;
	partnerId: string;
	/** Display name for the merchant-facing "you're linked to …" line. */
	partnerName: string;
	perkUsageAllowanceUsd: number | null;
	redemptions: number;
}

export type CodeValidation =
	| { valid: true; code: ResolvedCode }
	| { valid: false; detail: string };

/**
 * Resolve and validate a code.
 *
 * Checks, in order — all of them collapse to the same outward failure:
 *   1. the code exists;
 *   2. it is `active` (disabling stops NEW bindings; it never unbinds);
 *   3. it has not expired;
 *   4. it has redemptions left;
 *   5. its partner is `approved` — a pending or suspended partner cannot
 *      acquire stores, which is the check a code-based flow would otherwise
 *      skip entirely now that nobody reviews each registration.
 */
export async function validateCode(
	db: Database,
	rawCode: string,
	now: Date = new Date()
): Promise<CodeValidation> {
	const code = normalizeCode(rawCode);
	if (code === "") {
		return { valid: false, detail: "empty code" };
	}

	const rows = await db
		.select({
			id: partnerCodes.id,
			code: partnerCodes.code,
			status: partnerCodes.status,
			maxRedemptions: partnerCodes.maxRedemptions,
			expiresAt: partnerCodes.expiresAt,
			perkUsageAllowanceUsd: partnerCodes.perkUsageAllowanceUsd,
			partnerId: partners.id,
			partnerStatus: partners.status,
			partnerCompany: partners.companyName,
			partnerUserName: user.name,
		})
		.from(partnerCodes)
		.innerJoin(partners, eq(partners.id, partnerCodes.partnerId))
		.innerJoin(user, eq(user.id, partners.userId))
		.where(eq(partnerCodes.code, code))
		.limit(1);

	const row = rows[0];
	if (!row) {
		return { valid: false, detail: "unknown code" };
	}
	if (row.status !== "active") {
		return { valid: false, detail: `code status ${row.status}` };
	}
	if (row.expiresAt && row.expiresAt.getTime() <= now.getTime()) {
		return {
			valid: false,
			detail: `code expired at ${row.expiresAt.toISOString()}`,
		};
	}
	if (row.partnerStatus !== "approved") {
		return { valid: false, detail: `partner status ${row.partnerStatus}` };
	}

	// Counted rather than stored: the merchant row IS the redemption, so there is
	// no second number that can disagree with it.
	const redemptionRows = await db
		.select({ value: count() })
		.from(merchants)
		.where(eq(merchants.partnerCodeId, row.id));
	const redemptions = redemptionRows[0]?.value ?? 0;

	if (row.maxRedemptions !== null && redemptions >= row.maxRedemptions) {
		return {
			valid: false,
			detail: `code exhausted (${redemptions}/${row.maxRedemptions})`,
		};
	}

	return {
		valid: true,
		code: {
			id: row.id,
			code: row.code,
			partnerId: row.partnerId,
			partnerName: row.partnerCompany?.trim() || row.partnerUserName,
			perkUsageAllowanceUsd: row.perkUsageAllowanceUsd,
			redemptions,
		},
	};
}
