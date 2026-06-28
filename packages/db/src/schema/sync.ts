import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Checkpoint + ops state for the billing-sync job. One row per source (keyed by
 * a constant `id`, e.g. "partner-api-transactions"). The job resumes from
 * `cursor`, and records run/error metadata for the ops view (last run, last
 * error, cursor) described in Phase 7.
 */
export const syncState = pgTable("sync_state", {
	// Stable source key, e.g. "partner-api-transactions".
	id: text("id").primaryKey(),
	// Opaque Partner API pagination cursor to resume from.
	cursor: text("cursor"),
	// Time-based checkpoint: the occurredAt of the last ingested transaction.
	lastEventAt: timestamp("last_event_at"),
	// Run bookkeeping for observability.
	lastRunStartedAt: timestamp("last_run_started_at"),
	lastRunFinishedAt: timestamp("last_run_finished_at"),
	lastSuccessAt: timestamp("last_success_at"),
	lastError: text("last_error"),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});
