import {
	recordShopEvent,
	type ShopEventType,
} from "@edgecoms/api/attribution/events";
import { normalizeShopDomain } from "@edgecoms/billing/partner-api";
import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import {
	mailContactStores,
	mailContacts,
	mailEvents,
	mailInstallations,
	mailStores,
} from "@edgecoms/db/schema/mail";
import { and, eq, isNull, lt, or, sql } from "drizzle-orm";
import type { MailEventBody, MailEventType } from "./schema";

/**
 * INGEST one event from an Edge app.
 *
 * Idempotent on `eventId`: the event row is inserted with conflict-do-nothing,
 * and only the delivery that actually inserted it applies state. A redelivery
 * is a no-op, except that it retries the Resend sync if the first delivery
 * never got that far. The app retries on any non-2xx, so a Resend outage
 * resolves itself without a cron.
 *
 * Order, and why:
 *   1. One transaction: store, contact, the event row, installation state.
 *   2. Lifecycle events are recorded into `merchant_events` too, so partner
 *      attribution keeps its evidence while the apps call only this endpoint.
 *      Idempotent on the same key, so it is safe on every delivery.
 *   3. Resend last. Its failure answers 502, and the retry lands here again.
 */

/** A status move only happens for an event newer than the last one. */
const STATUS_FOR: Partial<
	Record<MailEventType, "installed" | "active" | "inactive" | "uninstalled">
> = {
	"app.installed": "installed",
	"app.activated": "active",
	"app.deactivated": "inactive",
	"app.uninstalled": "uninstalled",
};

/**
 * What the partner platform's `merchant_events` calls these. `plan.started`
 * → `subscription.activated` is the one interpretation here: both mean a paid
 * subscription began (see docs/edge-mail.md, Open questions).
 */
const SHOP_EVENT_FOR: Partial<Record<MailEventType, ShopEventType>> = {
	"app.uninstalled": "uninstalled",
	"plan.changed": "plan.changed",
	"plan.started": "subscription.activated",
};

/** Events that say the merchant is NOT using the app, so they don't count as activity. */
const INACTIVE_EVENTS = new Set<MailEventType>([
	"app.uninstalled",
	"app.deactivated",
]);

/** A row created by a non-status event must lose to any real status event. */
const NEVER = new Date(0);

export interface SyncEvent {
	appSlug: string;
	contactId: string | null;
	eventId: string;
	occurredAt: Date;
	properties: MailEventBody["properties"];
	shopDomain: string;
	storeId: string;
	type: MailEventType;
}

/**
 * Pushes one event to Resend. `skipped` (no contact, or test mode with no test
 * inbox) counts as done, so the event is never replayed later.
 */
export type ResendSync = (
	event: SyncEvent
) => Promise<"synced" | "skipped" | "failed">;

export type IngestOutcome =
	| { ok: true; status: "recorded" | "duplicate" }
	| { ok: false; status: "invalid_shop" | "unknown_app" | "sync_failed" };

type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];

function planFrom(body: MailEventBody): string | null | undefined {
	const plan = body.properties.plan;
	if (typeof plan === "string" && plan.trim() !== "") {
		return plan.trim();
	}
	// A cancellation with no plan named means "no paid plan".
	return body.event === "plan.cancelled" ? null : undefined;
}

async function upsertStore(tx: Tx, shopDomain: string, body: MailEventBody) {
	const store = body.store;
	const [row] = await tx
		.insert(mailStores)
		.values({
			shopDomain,
			name: store.name ?? null,
			country: store.country ?? null,
			currency: store.currency ?? null,
			timezone: store.timezone ?? null,
		})
		.onConflictDoUpdate({
			target: mailStores.shopDomain,
			// A field the app left out keeps what we had.
			set: {
				name: sql`coalesce(excluded.name, ${mailStores.name})`,
				country: sql`coalesce(excluded.country, ${mailStores.country})`,
				currency: sql`coalesce(excluded.currency, ${mailStores.currency})`,
				timezone: sql`coalesce(excluded.timezone, ${mailStores.timezone})`,
			},
		})
		.returning({ id: mailStores.id });
	if (!row) {
		throw new Error("Store upsert returned no row");
	}
	return row.id;
}

async function upsertContact(
	tx: Tx,
	contact: NonNullable<MailEventBody["contact"]>,
	storeId: string
) {
	const [row] = await tx
		.insert(mailContacts)
		.values({
			email: contact.email.trim().toLowerCase(),
			firstName: contact.firstName ?? null,
			lastName: contact.lastName ?? null,
		})
		.onConflictDoUpdate({
			target: mailContacts.email,
			set: {
				firstName: sql`coalesce(excluded.first_name, ${mailContacts.firstName})`,
				lastName: sql`coalesce(excluded.last_name, ${mailContacts.lastName})`,
			},
		})
		.returning({ id: mailContacts.id });
	if (!row) {
		throw new Error("Contact upsert returned no row");
	}
	await tx
		.insert(mailContactStores)
		.values({ contactId: row.id, storeId })
		.onConflictDoNothing();
	return row.id;
}

async function applyInstallation(
	tx: Tx,
	ids: { appId: string; storeId: string },
	body: MailEventBody,
	occurredAt: Date
) {
	const pair = and(
		eq(mailInstallations.storeId, ids.storeId),
		eq(mailInstallations.appId, ids.appId)
	);

	// The row exists from the first event of any kind, at a status any real
	// status event will overwrite.
	await tx
		.insert(mailInstallations)
		.values({
			storeId: ids.storeId,
			appId: ids.appId,
			status: "installed",
			statusChangedAt: NEVER,
		})
		.onConflictDoNothing();

	const status = STATUS_FOR[body.event];
	if (status) {
		await tx
			.update(mailInstallations)
			.set({
				status,
				statusChangedAt: occurredAt,
				...(status === "installed"
					? { installedAt: occurredAt, uninstalledAt: null }
					: {}),
				...(status === "active" ? { activatedAt: occurredAt } : {}),
				...(status === "uninstalled" ? { uninstalledAt: occurredAt } : {}),
			})
			.where(and(pair, lt(mailInstallations.statusChangedAt, occurredAt)));
	}

	const plan = planFrom(body);
	if (plan !== undefined) {
		await tx
			.update(mailInstallations)
			.set({ plan, planChangedAt: occurredAt })
			.where(
				and(
					pair,
					or(
						isNull(mailInstallations.planChangedAt),
						lt(mailInstallations.planChangedAt, occurredAt)
					)
				)
			);
	}

	// Raw SQL skips drizzle's Date mapping, so pass the same UTC wall time the
	// timestamp columns store.
	const at = sql`${occurredAt.toISOString()}::timestamp`;

	if (body.event === "setup.completed") {
		await tx
			.update(mailInstallations)
			.set({
				setupCompletedAt: sql`least(coalesce(${mailInstallations.setupCompletedAt}, ${at}), ${at})`,
			})
			.where(pair);
	}

	if (!INACTIVE_EVENTS.has(body.event)) {
		await tx
			.update(mailInstallations)
			.set({
				lastActiveAt: sql`greatest(coalesce(${mailInstallations.lastActiveAt}, ${at}), ${at})`,
			})
			.where(pair);
	}
}

export async function ingestEvent(
	db: Database,
	input: { appSlug: string; body: MailEventBody },
	sync: ResendSync
): Promise<IngestOutcome> {
	const { body } = input;
	let shopDomain: string;
	try {
		shopDomain = normalizeShopDomain(body.store.domain);
	} catch {
		return { ok: false, status: "invalid_shop" };
	}

	const [app] = await db
		.select({ id: apps.id })
		.from(apps)
		.where(eq(apps.slug, input.appSlug))
		.limit(1);
	if (!app) {
		return { ok: false, status: "unknown_app" };
	}

	const occurredAt = new Date(body.occurredAt);

	const recorded = await db.transaction(async (tx) => {
		const storeId = await upsertStore(tx, shopDomain, body);
		const contactId = body.contact
			? await upsertContact(tx, body.contact, storeId)
			: null;

		const inserted = await tx
			.insert(mailEvents)
			.values({
				eventId: body.eventId,
				appId: app.id,
				storeId,
				contactId,
				type: body.event,
				payload: body.properties,
				occurredAt,
			})
			.onConflictDoNothing({ target: mailEvents.eventId })
			.returning({ id: mailEvents.id });

		if (inserted[0]) {
			await applyInstallation(tx, { appId: app.id, storeId }, body, occurredAt);
		}
		return { isNew: Boolean(inserted[0]), storeId, contactId };
	});

	if (!recorded.isNew) {
		const [existing] = await db
			.select({ resendSyncedAt: mailEvents.resendSyncedAt })
			.from(mailEvents)
			.where(eq(mailEvents.eventId, body.eventId))
			.limit(1);
		if (existing?.resendSyncedAt) {
			return { ok: true, status: "duplicate" };
		}
	}

	const shopEventType = SHOP_EVENT_FOR[body.event];
	if (shopEventType) {
		const plan = planFrom(body);
		await recordShopEvent(db, {
			appSlug: input.appSlug,
			idempotencyKey: body.eventId,
			occurredAt,
			planHandle: plan ?? null,
			shopDomain,
			type: shopEventType,
		});
	}

	const result = await sync({
		appSlug: input.appSlug,
		contactId: recorded.contactId,
		eventId: body.eventId,
		occurredAt,
		properties: body.properties,
		shopDomain,
		storeId: recorded.storeId,
		type: body.event,
	});
	if (result === "failed") {
		return { ok: false, status: "sync_failed" };
	}

	await db
		.update(mailEvents)
		.set({ resendSyncedAt: new Date() })
		.where(eq(mailEvents.eventId, body.eventId));

	return { ok: true, status: recorded.isNew ? "recorded" : "duplicate" };
}
