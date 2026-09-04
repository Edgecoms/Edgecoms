/**
 * IP rate limiting for the playbook endpoint.
 *
 * In memory, deliberately. The repo's only other limiter
 * (`@edgecoms/api/attribution/attempts`) is table-backed because it guards the
 * money system and its rows are the abuse trail somebody will later have to
 * read. This one guards a marketing form: nobody is going to audit it, and a
 * database round-trip per submission is a worse trade than the one thing this
 * approach costs.
 *
 * What it costs: the counter lives in the process. Two instances mean two
 * counters, and a restart forgets. The real ceiling on abuse here is Resend's
 * own sending quota, and this is the cheap first gate in front of it. If the
 * site ever runs more than one instance and this matters, move the window to
 * the database or to a shared store, not to a bigger number here.
 */

/** Requests allowed per IP per window. */
export const REQUEST_LIMIT = 5;

/** The trailing window the limit applies over. */
export const WINDOW_MS = 60 * 60_000;

/** Stop the map growing without bound when a crawler walks a /8. */
const MAX_TRACKED_IPS = 10_000;

/** Timestamps of recent requests, newest last, keyed by IP. */
const hits = new Map<string, number[]>();

function withinWindow(timestamps: number[], now: number): number[] {
	const since = now - WINDOW_MS;
	return timestamps.filter((at) => at > since);
}

/**
 * Drop every IP whose window has fully expired.
 *
 * Runs only when the map is at its ceiling, so the common path stays O(1).
 */
function evictExpired(now: number): void {
	for (const [ip, timestamps] of hits) {
		if (withinWindow(timestamps, now).length === 0) {
			hits.delete(ip);
		}
	}
}

/**
 * Record a request and say whether it is allowed.
 *
 * Refusals are NOT recorded. Counting them would make the block self-feeding:
 * every further click would push the window forward and the visitor would
 * never get out. Same reasoning as `COUNTED_OUTCOMES` in the attribution
 * limiter.
 */
export function allowRequest(ip: string, now: number = Date.now()): boolean {
	const recent = withinWindow(hits.get(ip) ?? [], now);

	if (recent.length >= REQUEST_LIMIT) {
		hits.set(ip, recent);
		return false;
	}

	if (!hits.has(ip) && hits.size >= MAX_TRACKED_IPS) {
		evictExpired(now);
	}

	recent.push(now);
	hits.set(ip, recent);
	return true;
}

/** Test seam. Never called by the route. */
export function resetRateLimit(): void {
	hits.clear();
}
