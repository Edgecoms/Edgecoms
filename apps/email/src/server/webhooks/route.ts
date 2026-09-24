import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import {
	mailCampaigns,
	mailContacts,
	mailEmailEvents,
} from "@edgecoms/db/schema/mail";
import { env as mailEnv } from "@edgecoms/env/mail";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { verifyResendWebhook } from "../resend";

/**
 * POST /api/webhooks/resend: delivery events into `mail_email_events`.
 *
 * Fails closed: no webhook secret (or no API key, which the SDK needs to
 * verify) is 503, and any signature problem is one uniform 401. Idempotent on
 * the Svix message id, so a redelivery records nothing twice and repeats no
 * side effect.
 *
 * Side effects, all DB-only (this never calls Resend back, so no loop):
 *   • a complaint, or Resend adding the address to its suppression list,
 *     suppresses the contact: they are never a campaign recipient again;
 *   • a contact unsubscribed on Resend's own page opts out of everything.
 */

const NO_STORE = { "Cache-Control": "no-store" };

type Suppression = "bounced" | "complained";

interface Fields {
	broadcastId: string | null;
	email: string | null;
	suppress: Suppression | null;
	tags: Record<string, string>;
	unsubscribed: boolean;
}

/** The parts of a webhook this app acts on. Everything else is kept in `payload`. */
function fieldsOf(payload: {
	type: string;
	data: Record<string, unknown>;
}): Fields {
	const data = payload.data;
	const to = Array.isArray(data.to) ? data.to : [];
	const firstTo = typeof to[0] === "string" ? to[0] : null;
	const direct = typeof data.email === "string" ? data.email : null;
	const email = (direct ?? firstTo)?.trim().toLowerCase() ?? null;

	let suppress: Suppression | null = null;
	if (payload.type === "email.complained") {
		suppress = "complained";
	} else if (payload.type === "suppression.added") {
		// Resend suppresses on a hard bounce or a complaint; a manual entry is
		// Resend's to enforce and is not ours to label.
		if (data.origin === "complaint") {
			suppress = "complained";
		} else if (data.origin === "bounce") {
			suppress = "bounced";
		}
	}

	const tags =
		data.tags && typeof data.tags === "object"
			? (data.tags as Record<string, string>)
			: {};

	return {
		broadcastId:
			typeof data.broadcast_id === "string" ? data.broadcast_id : null,
		email,
		suppress,
		tags,
		unsubscribed:
			payload.type === "contact.updated" && data.unsubscribed === true,
	};
}

interface WebhookEvent {
	created_at: string;
	data: Record<string, unknown>;
	type: string;
}

/** Which campaign, contact and app a webhook row belongs to, where known. */
async function attribute(db: Database, fields: Fields) {
	const [campaign] = fields.broadcastId
		? await db
				.select({ appId: mailCampaigns.appId, id: mailCampaigns.id })
				.from(mailCampaigns)
				.where(eq(mailCampaigns.resendBroadcastId, fields.broadcastId))
				.limit(1)
		: [];
	const [contact] = fields.email
		? await db
				.select({ id: mailContacts.id })
				.from(mailContacts)
				.where(eq(mailContacts.email, fields.email))
				.limit(1)
		: [];
	const tagApp = fields.tags.app;
	const [taggedApp] =
		!campaign && tagApp
			? await db
					.select({ id: apps.id })
					.from(apps)
					.where(eq(apps.slug, tagApp))
					.limit(1)
			: [];
	return {
		appId: campaign?.appId ?? taggedApp?.id ?? null,
		campaignId: campaign?.id ?? null,
		contactId: contact?.id ?? null,
	};
}

async function applySideEffects(
	db: Database,
	contactId: string,
	fields: Fields
): Promise<void> {
	if (fields.suppress) {
		await db
			.update(mailContacts)
			.set({ suppressedAt: new Date(), suppressionReason: fields.suppress })
			.where(eq(mailContacts.id, contactId));
	}
	if (fields.unsubscribed) {
		await db
			.update(mailContacts)
			.set({ education: false, marketing: false, productUpdates: false })
			.where(eq(mailContacts.id, contactId));
	}
}

/** Records one verified webhook. False when this Svix message was already recorded. */
async function record(
	db: Database,
	svixId: string,
	event: WebhookEvent
): Promise<boolean> {
	const fields = fieldsOf(event);
	const owner = await attribute(db, fields);
	const occurredAt = new Date(event.created_at);
	const inserted = await db
		.insert(mailEmailEvents)
		.values({
			svixId,
			resendEmailId:
				typeof event.data.email_id === "string" ? event.data.email_id : null,
			type: event.type,
			email: fields.email,
			...owner,
			payload: event.data,
			occurredAt: Number.isNaN(occurredAt.getTime()) ? new Date() : occurredAt,
		})
		.onConflictDoNothing({ target: mailEmailEvents.svixId })
		.returning({ id: mailEmailEvents.id });
	if (!inserted[0]) {
		return false;
	}
	if (owner.contactId) {
		await applySideEffects(db, owner.contactId, fields);
	}
	return true;
}

export function resendWebhookRoute(deps: { db: Database }) {
	return new Hono().post("/", async (c) => {
		const secret = mailEnv.RESEND_WEBHOOK_SECRET;
		if (!secret) {
			return c.json({ error: "Webhook is not configured." }, 503, NO_STORE);
		}

		const raw = await c.req.text();
		const header = (name: string) =>
			c.req.header(`svix-${name}`) ?? c.req.header(`webhook-${name}`) ?? null;
		const svixId = header("id");
		const payload = verifyResendWebhook(
			raw,
			{
				id: svixId,
				signature: header("signature"),
				timestamp: header("timestamp"),
			},
			secret
		);
		if (!(payload && svixId)) {
			return c.json({ error: "Invalid signature." }, 401, NO_STORE);
		}

		const isNew = await record(
			deps.db,
			svixId,
			payload as unknown as WebhookEvent
		);
		return c.json(
			{ ok: true, status: isNew ? "recorded" : "duplicate" },
			200,
			NO_STORE
		);
	});
}
