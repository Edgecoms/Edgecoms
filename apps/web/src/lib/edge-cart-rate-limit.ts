/**
 * IP rate limiting for the playbook endpoint.
 *
 * ⚠️ ON VERCEL THIS IS BEST-EFFORT ONLY, NOT A REAL LIMIT.
 *
 * The counter lives in the process. On a long-lived server that is one counter
 * and the limit means what it says. This app deploys to Vercel, where the route
 * is a serverless function: instances are created and destroyed per traffic,
 * several run concurrently, and each gets its own empty map. The effective
 * limit is "5 per instance per hour", which under load is not a limit at all,
 * and a cold start resets it to zero.
 *
 * So this stops a person leaning on the button and a single-threaded script. It
 * does NOT stop a determined sender from burning the Resend quota, and it must
 * not be relied on as though it does.
 *
 * To make it real, the window has to live somewhere shared. The repo's own
 * precedent is `@edgecoms/api/attribution/attempts`, which is table-backed for
 * exactly this reason. That needs a decision first: a new table or a column on
 * `marketing_leads`, whether the IP is hashed (it is personal data), and how
 * long rows are kept. Until then Resend's own sending quota is the real ceiling.
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
