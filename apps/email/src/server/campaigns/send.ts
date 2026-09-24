import type { Database } from "@edgecoms/db";
import {
	mailAppSettings,
	mailCampaignRecipients,
	mailCampaigns,
} from "@edgecoms/db/schema/mail";
import { renderMinimalHtml } from "@edgecoms/mail/minimal";
import { RESEND_UNSUBSCRIBE_URL, renderText } from "@edgecoms/mail/render";
import { and, eq, gte, isNull, lt, sql } from "drizzle-orm";
import { brandFor, campaignContent } from "@/emails/templates";
import {
	type AppWithSettings,
	fromHeader,
	identityOf,
	listAppsWithSettings,
} from "../apps/identity";
import type { ImportState } from "../resend";
import { type Category, resolveRecipients } from "./audience";

/**
 * SENDING A CAMPAIGN, as a small state machine:
 *
 *   draft ──start──▶ importing ──advance──▶ sent | scheduled
 *                        │                       │
 *                        └──────▶ failed ◀───────┘ (any Resend error)
 *
 * The rails, each enforced by a CONDITIONAL UPDATE rather than a read then a
 * write, so a double click or two pollers cannot slip between them:
 *   • start needs a test sent after the last content change;
 *   • start needs the admin to echo the recipient count they confirmed, and
 *     refuses if the audience moved since;
 *   • the broadcast is created at most once and sent at most once.
 */

export interface CampaignGateway {
	cancelBroadcast(broadcastId: string): Promise<void>;
	createBroadcast(input: {
		from: string;
		html: string;
		name: string;
		previewText: string;
		replyTo: string | null;
		segmentId: string;
		subject: string;
		text: string;
		topicId: string | null;
	}): Promise<string>;
	createSegment(name: string): Promise<string>;
	/** Test-mode aware: the address a message to `email` really goes to. */
	deliveryAddress(email: string): string | null;
	importContacts(input: {
		emails: string[];
		segmentId: string;
		topicId: string | null;
	}): Promise<string>;
	importState(importId: string): Promise<ImportState>;
	sendBroadcast(broadcastId: string, scheduledAt: Date | null): Promise<void>;
	testMode(): boolean;
	topicId(category: Category): Promise<string | null>;
}

type Campaign = typeof mailCampaigns.$inferSelect;

/** How long a broadcast may sit half-created before the send is called failed. */
const CREATING_TIMEOUT_MS = 10 * 60_000;
const CREATING = "creating";
const MIN_SCHEDULE_LEAD_MS = 60_000;

export type StartOutcome =
	| { ok: true; status: "importing" | "failed" }
	| {
			ok: false;
			reason:
				| "not_found"
				| "not_draft"
				| "needs_test"
				| "no_sender"
				| "no_recipients"
				| "count_changed"
				| "bad_schedule"
				| "no_test_inbox";
			count?: number;
	  };

async function loadCampaign(
	db: Database,
	id: string
): Promise<Campaign | undefined> {
	const [campaign] = await db
		.select()
		.from(mailCampaigns)
		.where(eq(mailCampaigns.id, id))
		.limit(1);
	return campaign;
}

async function markFailed(
	db: Database,
	id: string,
	error: unknown
): Promise<void> {
	await db
		.update(mailCampaigns)
		.set({ failureReason: String(error).slice(0, 500), status: "failed" })
		.where(eq(mailCampaigns.id, id));
}

function hasFreshTest(campaign: Campaign): boolean {
	return (
		campaign.testSentAt !== null &&
		campaign.testSentAt.getTime() >= campaign.contentUpdatedAt.getTime()
	);
}

/** The addresses Resend receives: real ones live, the one test inbox in test mode. */
function deliveryList(
	gateway: CampaignGateway,
	emails: string[]
): string[] | null {
	const addresses = new Set<string>();
	for (const email of emails) {
		const address = gateway.deliveryAddress(email);
		if (!address) {
			return null;
		}
		addresses.add(address);
	}
	return [...addresses];
}

export async function startSend(
	db: Database,
	gateway: CampaignGateway,
	input: {
		campaignId: string;
		confirmCount: number;
		now?: Date;
		scheduledAt: Date | null;
	}
): Promise<StartOutcome> {
	const now = input.now ?? new Date();
	const campaign = await loadCampaign(db, input.campaignId);
	if (!campaign) {
		return { ok: false, reason: "not_found" };
	}
	if (campaign.status !== "draft") {
		return { ok: false, reason: "not_draft" };
	}
	if (!hasFreshTest(campaign)) {
		return { ok: false, reason: "needs_test" };
	}
	if (
		input.scheduledAt &&
		input.scheduledAt.getTime() < now.getTime() + MIN_SCHEDULE_LEAD_MS
	) {
		return { ok: false, reason: "bad_schedule" };
	}
	const [settings] = await db
		.select({ appId: mailAppSettings.appId })
		.from(mailAppSettings)
		.where(eq(mailAppSettings.appId, campaign.appId))
		.limit(1);
	if (!settings) {
		return { ok: false, reason: "no_sender" };
	}

	const recipients = await resolveRecipients(db, {
		appId: campaign.appId,
		audience: campaign.audience,
		category: campaign.category,
		now,
	});
	if (recipients.length === 0) {
		return { ok: false, reason: "no_recipients" };
	}
	if (recipients.length !== input.confirmCount) {
		return { count: recipients.length, ok: false, reason: "count_changed" };
	}
	const addresses = deliveryList(
		gateway,
		recipients.map((recipient) => recipient.email)
	);
	if (!addresses) {
		return { ok: false, reason: "no_test_inbox" };
	}

	const claimed = await db.transaction(async (tx) => {
		const rows = await tx
			.update(mailCampaigns)
			.set({
				recipientCount: recipients.length,
				scheduledAt: input.scheduledAt,
				sentInTestMode: gateway.testMode(),
				status: "importing",
			})
			.where(
				and(
					eq(mailCampaigns.id, campaign.id),
					eq(mailCampaigns.status, "draft"),
					gte(mailCampaigns.testSentAt, mailCampaigns.contentUpdatedAt)
				)
			)
			.returning({ id: mailCampaigns.id });
		if (!rows[0]) {
			return false;
		}
		await tx.insert(mailCampaignRecipients).values(
			recipients.map((recipient) => ({
				campaignId: campaign.id,
				contactId: recipient.contactId,
			}))
		);
		return true;
	});
	if (!claimed) {
		return { ok: false, reason: "not_draft" };
	}

	try {
		const segmentId = await gateway.createSegment(`Campaign: ${campaign.name}`);
		await db
			.update(mailCampaigns)
			.set({ resendSegmentId: segmentId })
			.where(eq(mailCampaigns.id, campaign.id));
		const importId = await gateway.importContacts({
			emails: addresses,
			segmentId,
			topicId: await gateway.topicId(campaign.category),
		});
		await db
			.update(mailCampaigns)
			.set({ resendImportId: importId })
			.where(eq(mailCampaigns.id, campaign.id));
		return { ok: true, status: "importing" };
	} catch (error) {
		await markFailed(db, campaign.id, error);
		return { ok: true, status: "failed" };
	}
}

/** The broadcast's HTML and text: the same render the composer previews. */
export function renderCampaign(campaign: Campaign, app: AppWithSettings) {
	const content = campaignContent(campaign, app.name);
	const brand = brandFor(identityOf(app), RESEND_UNSUBSCRIBE_URL);
	return {
		html: renderMinimalHtml(content, brand),
		text: renderText(content, brand),
	};
}

async function createBroadcastOnce(
	db: Database,
	gateway: CampaignGateway,
	campaign: Campaign
): Promise<void> {
	if (!(campaign.resendImportId && campaign.resendSegmentId)) {
		return;
	}
	const state = await gateway.importState(campaign.resendImportId);
	if (state === "failed") {
		await markFailed(db, campaign.id, "Resend contact import failed");
		return;
	}
	if (state !== "completed") {
		return;
	}
	const claimed = await db
		.update(mailCampaigns)
		.set({ resendBroadcastId: CREATING })
		.where(
			and(
				eq(mailCampaigns.id, campaign.id),
				eq(mailCampaigns.status, "importing"),
				isNull(mailCampaigns.resendBroadcastId)
			)
		)
		.returning({ id: mailCampaigns.id });
	if (!claimed[0]) {
		return;
	}
	const app = (await listAppsWithSettings(db)).find(
		(row) => row.appId === campaign.appId
	);
	try {
		if (!app?.settings) {
			throw new Error("The app has no sender configured.");
		}
		const { html, text } = renderCampaign(campaign, app);
		const broadcastId = await gateway.createBroadcast({
			from: fromHeader(app.settings),
			html,
			name: campaign.name,
			previewText: campaign.preheader,
			replyTo: app.settings.replyTo,
			segmentId: campaign.resendSegmentId,
			subject: campaign.subject,
			text,
			topicId: await gateway.topicId(campaign.category),
		});
		await db
			.update(mailCampaigns)
			.set({ resendBroadcastId: broadcastId })
			.where(eq(mailCampaigns.id, campaign.id));
	} catch (error) {
		await markFailed(db, campaign.id, error);
	}
}

async function sendOnce(
	db: Database,
	gateway: CampaignGateway,
	campaign: Campaign,
	now: Date
): Promise<void> {
	const broadcastId = campaign.resendBroadcastId;
	if (!broadcastId || broadcastId === CREATING) {
		return;
	}
	// Claim the send BEFORE calling Resend: two pollers, one broadcast send.
	const claimed = await db
		.update(mailCampaigns)
		.set(
			campaign.scheduledAt
				? { status: "scheduled" }
				: { sentAt: now, status: "sent" }
		)
		.where(
			and(
				eq(mailCampaigns.id, campaign.id),
				eq(mailCampaigns.status, "importing")
			)
		)
		.returning({ id: mailCampaigns.id });
	if (!claimed[0]) {
		return;
	}
	try {
		await gateway.sendBroadcast(broadcastId, campaign.scheduledAt);
	} catch (error) {
		await markFailed(db, campaign.id, error);
	}
}

/**
 * Moves an importing campaign on. Idempotent and safe to call from any number
 * of browser tabs: the admin UI polls it while the import runs.
 */
export async function advanceSend(
	db: Database,
	gateway: CampaignGateway,
	campaignId: string,
	now = new Date()
): Promise<Campaign["status"] | null> {
	let campaign = await loadCampaign(db, campaignId);
	if (!campaign) {
		return null;
	}
	if (campaign.status !== "importing") {
		return campaign.status;
	}

	// A process that died mid-create leaves the claim behind. Past the timeout
	// the send is called failed, rather than stuck for ever.
	await db
		.update(mailCampaigns)
		.set({
			failureReason: "Broadcast creation was interrupted.",
			status: "failed",
		})
		.where(
			and(
				eq(mailCampaigns.id, campaignId),
				eq(mailCampaigns.status, "importing"),
				eq(mailCampaigns.resendBroadcastId, CREATING),
				lt(
					mailCampaigns.updatedAt,
					sql`${new Date(now.getTime() - CREATING_TIMEOUT_MS).toISOString()}::timestamp`
				)
			)
		);

	if (!campaign.resendBroadcastId) {
		await createBroadcastOnce(db, gateway, campaign);
		campaign = await loadCampaign(db, campaignId);
	}
	if (campaign?.status === "importing") {
		await sendOnce(db, gateway, campaign, now);
	}
	return (await loadCampaign(db, campaignId))?.status ?? null;
}

export type CancelOutcome = "cancelled" | "not_cancellable" | "failed";

/** A draft is discarded; a scheduled broadcast is cancelled in Resend first. */
export async function cancelCampaign(
	db: Database,
	gateway: CampaignGateway,
	campaignId: string
): Promise<CancelOutcome> {
	const campaign = await loadCampaign(db, campaignId);
	if (campaign?.status === "draft") {
		await db
			.update(mailCampaigns)
			.set({ status: "cancelled" })
			.where(
				and(eq(mailCampaigns.id, campaignId), eq(mailCampaigns.status, "draft"))
			);
		return "cancelled";
	}
	if (campaign?.status !== "scheduled" || !campaign.resendBroadcastId) {
		return "not_cancellable";
	}
	try {
		await gateway.cancelBroadcast(campaign.resendBroadcastId);
	} catch {
		return "failed";
	}
	await db
		.update(mailCampaigns)
		.set({ status: "cancelled" })
		.where(eq(mailCampaigns.id, campaignId));
	return "cancelled";
}
