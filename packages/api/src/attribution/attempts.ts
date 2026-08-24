import type { Database } from "@edgecoms/db";
import { codeRedemptionAttempts } from "@edgecoms/db/schema/attribution";
import { and, count, eq, gte, inArray } from "drizzle-orm";

/**
 * Code-entry rate limiting and the attempt log.
 *
 * Both jobs, one table. The limiter needs a count of recent attempts per shop;
 * the abuse investigation needs the attempts themselves. Keeping the counter in
 * memory (or Redis, which this repo doesn't run) would satisfy the first and
 * throw away the second — and the second is the one that answers "did somebody
 * try to guess their way into a partner's book".
 */

/** Attempts allowed per shop per window. */
export const ATTEMPT_LIMIT = 5;

/** The trailing window the limit applies over. */
export const ATTEMPT_WINDOW_MS = 60 * 60_000;

export type AttemptOutcome =
	| "bound"
	| "already_bound"
	| "claimed_by_other"
	| "invalid"
	| "rate_limited";

/**
 * Outcomes that count toward the limit: the ENUMERATION signals.
 *
 * The limiter exists to stop someone walking the code space for a shop, so it
 * counts the two outcomes that mean "that guess did not land" — a bad code, and
 * a probe at a store somebody else already owns.
 *
 * Deliberately NOT counted:
 *
 *   • `bound` and `already_bound` — the intended flow, not abuse. A merchant
 *     taking the whole Edge suite pastes the same code into every app they
 *     install, which is one call per app for one shop. Counting successes made
 *     that self-limiting: with a 7-app catalog and a limit of 5, the last two
 *     apps were refused and charged full price despite a valid discount code.
 *     `bound` can only happen once per shop anyway (the domain is unique), and
 *     a replay is idempotent, so neither can be inflated into anything.
 *
 *   • `rate_limited` — counting a refusal would make the block self-feeding:
 *     each further click would push the window forward and the merchant would
 *     never get out. The rows are still written; the abuse trail wants them.
 */
const COUNTED_OUTCOMES = ["invalid", "claimed_by_other"] as const;

/**
 * Failed attempts recorded for this shop inside the window.
 */
export async function recentAttemptCount(
	db: Database,
	shopDomain: string,
	now: Date = new Date()
): Promise<number> {
	const since = new Date(now.getTime() - ATTEMPT_WINDOW_MS);
	const rows = await db
		.select({ value: count() })
		.from(codeRedemptionAttempts)
		.where(
			and(
				eq(codeRedemptionAttempts.shopDomain, shopDomain),
				gte(codeRedemptionAttempts.createdAt, since),
				inArray(codeRedemptionAttempts.outcome, COUNTED_OUTCOMES)
			)
		);
	return rows[0]?.value ?? 0;
}

/**
 * Append one attempt.
 *
 * `reason` is internal detail — the real rejection behind a generic response.
 * Never surface it to a caller.
 *
 * `now` is threaded through rather than left to the column default so the write
 * and the window read share ONE clock. They agree in production either way, but
 * a counter whose rows are stamped by the database while its window is measured
 * from a caller-supplied instant is two clocks doing one job.
 */
export async function recordAttempt(
	db: Database,
	input: {
		code: string;
		shopDomain: string;
		appSlug?: string | null;
		outcome: AttemptOutcome;
		reason?: string | null;
	},
	now: Date = new Date()
): Promise<void> {
	await db.insert(codeRedemptionAttempts).values({
		code: input.code,
		shopDomain: input.shopDomain,
		appSlug: input.appSlug ?? null,
		outcome: input.outcome,
		reason: input.reason ?? null,
		createdAt: now,
	});
}
