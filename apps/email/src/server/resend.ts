import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import {
	mailAppSettings,
	mailContactStores,
	mailContacts,
	mailInstallations,
	mailStores,
} from "@edgecoms/db/schema/mail";
import { isTestMode, env as mailEnv } from "@edgecoms/env/mail";
import { env } from "@edgecoms/env/server";
import { eq } from "drizzle-orm";
import { Resend, type WebhookEventPayload } from "resend";
import type { ResendSync, SyncEvent } from "./events/ingest";
import { preferencesUrl } from "./preferences/token";

/**
 * THE RESEND BOUNDARY. This is the only file that imports `resend`; the rest
 * of Edge Mail sees plain types, the same rule the Shopify adapter follows.
 *
 * TEST MODE lives here and only here. While it is on (the default), every
 * outbound address becomes EDGE_MAIL_TEST_RECIPIENT, and with no test inbox
 * set nothing reaches Resend at all. A real merchant is never created as a
 * Resend contact in test mode, so no automation can mail one by accident.
 */

export type MailCategory = "product_updates" | "marketing" | "education";

/** Resend topic names, one per opt-in category. Created by scripts/setup-resend.ts. */
export const TOPIC_NAMES: Record<MailCategory, string> = {
	product_updates: "edge_product_updates",
	marketing: "edge_marketing",
	education: "edge_education",
};

/** `edge-cart` → `edge_cart`, the prefix of that app's Resend contact properties. */
export function propertyPrefix(slug: string): string {
	return slug.replaceAll("-", "_");
}

/**
 * Where a message to `email` actually goes: the address itself in live mode,
 * the test inbox in test mode, or nowhere (null) in test mode with no inbox.
 */
export function deliveryAddress(email: string): string | null {
	if (isTestMode()) {
		return mailEnv.EDGE_MAIL_TEST_RECIPIENT ?? null;
	}
	return email;
}

function client(): Resend | null {
	return env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
}

let topicCache: Promise<Record<MailCategory, string | null>> | null = null;

/** Topic ids by category, looked up by name once per process. */
export function topicIds(): Promise<Record<MailCategory, string | null>> {
	const resend = client();
	if (!resend) {
		return Promise.resolve({
			education: null,
			marketing: null,
			product_updates: null,
		});
	}
	topicCache ??= resend.topics.list().then(({ data, error }) => {
		if (error || !data) {
			topicCache = null;
			throw new Error(`Resend topics.list failed: ${error?.message}`);
		}
		const byName = new Map(data.data.map((topic) => [topic.name, topic.id]));
		return {
			education: byName.get(TOPIC_NAMES.education) ?? null,
			marketing: byName.get(TOPIC_NAMES.marketing) ?? null,
			product_updates: byName.get(TOPIC_NAMES.product_updates) ?? null,
		};
	});
	return topicCache;
}

/**
 * The contact's properties as automations branch on them: per app, its status
 * and plan across every store the contact runs, plus how many Edge apps they
 * have live. Only what a condition step reads, nothing speculative.
 */
export async function contactProperties(
	db: Database,
	contactId: string
): Promise<Record<string, string | number>> {
	const rows = await db
		.select({
			plan: mailInstallations.plan,
			shopDomain: mailStores.shopDomain,
			slug: apps.slug,
			status: mailInstallations.status,
		})
		.from(mailContactStores)
		.innerJoin(mailStores, eq(mailStores.id, mailContactStores.storeId))
		.innerJoin(
			mailInstallations,
			eq(mailInstallations.storeId, mailContactStores.storeId)
		)
		.innerJoin(apps, eq(apps.id, mailInstallations.appId))
		.where(eq(mailContactStores.contactId, contactId));

	const properties: Record<string, string | number> = {};
	const liveApps = new Set<string>();
	for (const row of rows) {
		const prefix = propertyPrefix(row.slug);
		// A person with the app on two stores: "active" beats anything else.
		if (properties[`${prefix}_status`] !== "active") {
			properties[`${prefix}_status`] = row.status;
		}
		if (row.plan) {
			properties[`${prefix}_plan`] = row.plan;
		}
		if (row.status === "installed" || row.status === "active") {
			liveApps.add(row.slug);
		}
		properties.shop_domain ??= row.shopDomain;
	}
	properties.edge_app_count = liveApps.size;
	return properties;
}

async function upsertResendContact(
	resend: Resend,
	contact: { email: string; firstName: string | null; lastName: string | null },
	properties: Record<string, string | number>
): Promise<string | null> {
	const updated = await resend.contacts.update({
		email: contact.email,
		firstName: contact.firstName,
		lastName: contact.lastName,
		properties,
	});
	if (!updated.error) {
		return updated.data?.id ?? null;
	}
	const created = await resend.contacts.create({
		email: contact.email,
		firstName: contact.firstName ?? undefined,
		lastName: contact.lastName ?? undefined,
		properties,
	});
	if (created.error) {
		throw new Error(`Resend contact upsert failed: ${created.error.message}`);
	}
	return created.data?.id ?? null;
}

/** The app's name and branding, as the automation templates read them. */
export async function appBranding(db: Database, slug: string) {
	const [app] = await db
		.select({
			app_name: apps.name,
			app_url: mailAppSettings.appUrl,
			brand_color: mailAppSettings.brandColor,
			logo_url: mailAppSettings.logoUrl,
			review_url: mailAppSettings.reviewUrl,
			support_url: mailAppSettings.supportUrl,
		})
		.from(apps)
		.leftJoin(mailAppSettings, eq(mailAppSettings.appId, apps.id))
		.where(eq(apps.slug, slug))
		.limit(1);
	return { app_slug: slug, ...app, app_name: app?.app_name ?? slug };
}

type Contact = typeof mailContacts.$inferSelect;

async function pushEvent(
	db: Database,
	resend: Resend,
	contact: Contact,
	address: string,
	event: SyncEvent
): Promise<void> {
	const [properties, branding] = await Promise.all([
		contactProperties(db, contact.id),
		appBranding(db, event.appSlug),
	]);
	const resendContactId = await upsertResendContact(
		resend,
		{ ...contact, email: address },
		properties
	);
	const { error } = await resend.events.send({
		event: event.type,
		email: address,
		payload: {
			...event.properties,
			...branding,
			// Left out when unknown, so the template's fallback ("there") applies.
			...(contact.firstName ? { first_name: contact.firstName } : {}),
			preferences_url: preferencesUrl(contact.id),
			shop_domain: event.shopDomain,
		},
	});
	if (error) {
		throw new Error(`Resend events.send failed: ${error.message}`);
	}
	// In test mode the id belongs to the test inbox, not this person.
	if (!isTestMode() && resendContactId) {
		await db
			.update(mailContacts)
			.set({ resendContactId })
			.where(eq(mailContacts.id, contact.id));
	}
}

/**
 * The event sync the ingest calls. `skipped` for an event with no person, or
 * test mode with no inbox. With test mode OFF and no API key it FAILS, so a
 * live deploy missing its key answers 502 and the apps retry, rather than
 * marking automation triggers done that never fired.
 */
export function createResendSync(db: Database): ResendSync {
	return async (event) => {
		const [contact] = event.contactId
			? await db
					.select()
					.from(mailContacts)
					.where(eq(mailContacts.id, event.contactId))
					.limit(1)
			: [];
		const address = contact ? deliveryAddress(contact.email) : null;
		if (!(contact && address)) {
			return "skipped";
		}
		const resend = client();
		if (!resend) {
			return isTestMode() ? "skipped" : "failed";
		}
		try {
			await pushEvent(db, resend, contact, address, event);
			return "synced";
		} catch (error) {
			console.warn(`edge-mail: Resend sync failed: ${String(error)}`);
			return "failed";
		}
	};
}

/** Mirrors a contact's opt-ins onto their Resend topics. */
export async function syncContactTopics(contact: {
	education: boolean;
	email: string;
	marketing: boolean;
	productUpdates: boolean;
}): Promise<"synced" | "skipped" | "failed"> {
	const address = deliveryAddress(contact.email);
	const resend = client();
	if (!(address && resend)) {
		return "skipped";
	}
	try {
		const ids = await topicIds();
		const wanted: [string | null, boolean][] = [
			[ids.product_updates, contact.productUpdates],
			[ids.marketing, contact.marketing],
			[ids.education, contact.education],
		];
		const topics = wanted.flatMap(([id, on]) =>
			id
				? [
						{
							id,
							subscription: on ? ("opt_in" as const) : ("opt_out" as const),
						},
					]
				: []
		);
		if (topics.length === 0) {
			return "skipped";
		}
		const { error } = await resend.contacts.topics.update({
			email: address,
			topics,
		});
		if (error) {
			throw new Error(error.message);
		}
		return "synced";
	} catch (error) {
		console.warn(`edge-mail: topic sync failed: ${String(error)}`);
		return "failed";
	}
}

export interface WebhookHeaders {
	id: string | null;
	signature: string | null;
	timestamp: string | null;
}

/**
 * Verifies a Resend webhook (Svix signing) and returns its payload, or null
 * for anything unsigned, forged or stale. Callers answer 401 on null and must
 * not say why.
 */
export function verifyResendWebhook(
	payload: string,
	headers: WebhookHeaders,
	webhookSecret: string
): WebhookEventPayload | null {
	const resend = client();
	if (!(resend && headers.id && headers.signature && headers.timestamp)) {
		return null;
	}
	try {
		return resend.webhooks.verify({
			payload,
			headers: {
				id: headers.id,
				signature: headers.signature,
				timestamp: headers.timestamp,
			},
			webhookSecret,
		});
	} catch {
		return null;
	}
}

/**
 * One-time (and re-runnable) Resend setup: the three topics, the contact
 * properties automations branch on, and the event names apps send. Creates
 * only what is missing. Topics default to OPT-OUT: nobody is subscribed to
 * anything until they, or a recorded consent, say so.
 */
export async function ensureResendSetup(input: {
	appSlugs: readonly string[];
	eventNames: readonly string[];
}): Promise<string[]> {
	const resend = client();
	if (!resend) {
		throw new Error("RESEND_API_KEY is not set.");
	}
	const created: string[] = [];

	const topics = await resend.topics.list();
	const haveTopics = new Set(topics.data?.data.map((topic) => topic.name));
	for (const name of Object.values(TOPIC_NAMES)) {
		if (!haveTopics.has(name)) {
			const { error } = await resend.topics.create({
				name,
				defaultSubscription: "opt_out",
			});
			if (error) {
				throw new Error(`topic ${name}: ${error.message}`);
			}
			created.push(`topic ${name}`);
		}
	}

	const properties = await resend.contactProperties.list();
	const haveProperties = new Set(
		properties.data?.data.map((property) => property.key)
	);
	const wanted: [string, "string" | "number"][] = [
		["shop_domain", "string"],
		["edge_app_count", "number"],
		...input.appSlugs.flatMap((slug): [string, "string"][] => [
			[`${propertyPrefix(slug)}_status`, "string"],
			[`${propertyPrefix(slug)}_plan`, "string"],
		]),
	];
	for (const [key, type] of wanted) {
		if (!haveProperties.has(key)) {
			const { error } = await resend.contactProperties.create({ key, type });
			if (error) {
				throw new Error(`property ${key}: ${error.message}`);
			}
			created.push(`property ${key}`);
		}
	}

	const events = await resend.events.list();
	const haveEvents = new Set(events.data?.data.map((event) => event.name));
	for (const name of input.eventNames) {
		if (!haveEvents.has(name)) {
			const { error } = await resend.events.create({ name });
			if (error) {
				throw new Error(`event ${name}: ${error.message}`);
			}
			created.push(`event ${name}`);
		}
	}
	return created;
}

/**
 * Creates or updates one Resend template by its alias, then publishes it, so
 * a re-run of the push is an update and never a duplicate. Automations pick
 * templates by these aliases (`<app-slug>-<template>`).
 */
export async function upsertTemplate(template: {
	alias: string;
	from: string;
	html: string;
	name: string;
	replyTo: string | null;
	subject: string;
	text: string;
	/** Filled per recipient by the automation; each needs a fallback or a value. */
	variables: { fallbackValue: string | null; key: string }[];
}): Promise<"created" | "updated"> {
	const resend = client();
	if (!resend) {
		throw new Error("RESEND_API_KEY is not set.");
	}
	const fields = {
		from: template.from,
		html: template.html,
		name: template.name,
		subject: template.subject,
		text: template.text,
		variables: template.variables.map((variable) => ({
			fallbackValue: variable.fallbackValue,
			key: variable.key,
			type: "string" as const,
		})),
		...(template.replyTo ? { replyTo: template.replyTo } : {}),
	};
	const existing = await resend.templates.get(template.alias);
	const outcome = existing.data ? "updated" : "created";
	const { error } = existing.data
		? await resend.templates.update(template.alias, fields)
		: await resend.templates.create({ ...fields, alias: template.alias });
	if (error) {
		throw new Error(`template ${template.alias}: ${error.message}`);
	}
	const published = await resend.templates.publish(template.alias);
	if (published.error) {
		throw new Error(`publish ${template.alias}: ${published.error.message}`);
	}
	return outcome;
}

function requireClient(): Resend {
	const resend = client();
	if (!resend) {
		throw new Error("RESEND_API_KEY is not set.");
	}
	return resend;
}

function unwrap<T>(
	result: { data: T | null; error: { message: string } | null },
	what: string
): T {
	if (result.error || result.data === null) {
		throw new Error(`${what}: ${result.error?.message ?? "no data"}`);
	}
	return result.data;
}

/** A segment of its own for one campaign, so its audience is exactly its snapshot. */
export async function createCampaignSegment(name: string): Promise<string> {
	const resend = requireClient();
	return unwrap(await resend.segments.create({ name }), "segments.create").id;
}

/**
 * Loads the recipients into the campaign's segment with ONE import instead of
 * one call per contact, opting each into the campaign's topic: every one of
 * them opted in on our side, which is how they were chosen.
 */
export async function importSegmentContacts(input: {
	emails: string[];
	segmentId: string;
	topicId: string | null;
}): Promise<string> {
	const resend = requireClient();
	const csv = ["email", ...input.emails].join("\n");
	const result = await resend.contacts.imports.create({
		columnMap: { email: "email" },
		file: new Blob([csv], { type: "text/csv" }),
		onConflict: "upsert",
		segments: [{ id: input.segmentId }],
		...(input.topicId
			? { topics: [{ id: input.topicId, subscription: "opt_in" as const }] }
			: {}),
	});
	return unwrap(result, "contacts.imports.create").id;
}

export type ImportState = "pending" | "completed" | "failed";

export async function importState(importId: string): Promise<ImportState> {
	const resend = requireClient();
	const status = unwrap(
		await resend.contacts.imports.get(importId),
		"contacts.imports.get"
	).status;
	if (status === "completed") {
		return "completed";
	}
	return status === "failed" ? "failed" : "pending";
}

export async function createBroadcast(input: {
	from: string;
	html: string;
	name: string;
	previewText: string;
	replyTo: string | null;
	segmentId: string;
	subject: string;
	text: string;
	topicId: string | null;
}): Promise<string> {
	const resend = requireClient();
	const result = await resend.broadcasts.create({
		from: input.from,
		html: input.html,
		name: input.name,
		previewText: input.previewText,
		segmentId: input.segmentId,
		subject: input.subject,
		text: input.text,
		topicId: input.topicId,
		...(input.replyTo ? { replyTo: input.replyTo } : {}),
	});
	return unwrap(result, "broadcasts.create").id;
}

export async function sendBroadcast(
	broadcastId: string,
	scheduledAt: Date | null
): Promise<void> {
	const resend = requireClient();
	unwrap(
		await resend.broadcasts.send(
			broadcastId,
			scheduledAt ? { scheduledAt: scheduledAt.toISOString() } : undefined
		),
		"broadcasts.send"
	);
}

export async function cancelBroadcast(broadcastId: string): Promise<void> {
	const resend = requireClient();
	unwrap(await resend.broadcasts.cancel(broadcastId), "broadcasts.cancel");
}

/** A single email, for "Send test". The recipient is the admin, never a merchant. */
export async function sendTestEmail(input: {
	from: string;
	html: string;
	replyTo: string | null;
	subject: string;
	text: string;
	to: string;
}): Promise<void> {
	const resend = requireClient();
	unwrap(
		await resend.emails.send({
			from: input.from,
			html: input.html,
			subject: input.subject,
			text: input.text,
			to: input.to,
			...(input.replyTo ? { replyTo: input.replyTo } : {}),
		}),
		"emails.send"
	);
}
