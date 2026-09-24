import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import {
	mailCampaigns,
	mailContacts,
	mailEmailEvents,
	mailStores,
} from "@edgecoms/db/schema/mail";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";

/**
 * Delivery analytics from Resend's webhooks. Counts are per EMAIL (distinct
 * Resend email id), so a merchant opening one email five times is one open.
 * Rates are for display only; nothing here is money.
 */

export const TRACKED_TYPES = [
	"email.sent",
	"email.delivered",
	"email.opened",
	"email.clicked",
	"email.bounced",
	"email.complained",
] as const;

export type TrackedType = (typeof TRACKED_TYPES)[number];
export type Counts = Record<TrackedType, number>;

function emptyCounts(): Counts {
	return Object.fromEntries(TRACKED_TYPES.map((type) => [type, 0])) as Counts;
}

/** `part / whole` as a percentage with one decimal, or null with no base. */
export function rate(part: number, whole: number): string | null {
	return whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : null;
}

export async function deliveryStats(db: Database, since: Date) {
	const rows = await db
		.select({
			appName: apps.name,
			count: sql<number>`count(distinct coalesce(${mailEmailEvents.resendEmailId}, ${mailEmailEvents.svixId}))::int`,
			type: mailEmailEvents.type,
		})
		.from(mailEmailEvents)
		.leftJoin(apps, eq(apps.id, mailEmailEvents.appId))
		.where(
			and(
				gte(mailEmailEvents.occurredAt, since),
				inArray(mailEmailEvents.type, [...TRACKED_TYPES])
			)
		)
		.groupBy(mailEmailEvents.type, apps.name);

	const totals = emptyCounts();
	const byApp = new Map<string, Counts>();
	for (const row of rows) {
		const type = row.type as TrackedType;
		totals[type] += row.count;
		const name = row.appName ?? "Unattributed";
		const counts = byApp.get(name) ?? emptyCounts();
		counts[type] += row.count;
		byApp.set(name, counts);
	}

	const [unsubscribes] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(mailEmailEvents)
		.where(
			and(
				gte(mailEmailEvents.occurredAt, since),
				eq(mailEmailEvents.type, "contact.updated"),
				sql`${mailEmailEvents.payload}->>'unsubscribed' = 'true'`
			)
		);

	return {
		byApp: [...byApp.entries()]
			.map(([name, counts]) => ({ counts, name }))
			.sort((a, b) => b.counts["email.sent"] - a.counts["email.sent"]),
		totals,
		unsubscribes: unsubscribes?.count ?? 0,
	};
}

export async function audienceTotals(db: Database) {
	const [contacts] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(mailContacts);
	const [stores] = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(mailStores);
	return { contacts: contacts?.count ?? 0, stores: stores?.count ?? 0 };
}

export function recentCampaigns(db: Database, limit = 8) {
	return db
		.select({
			appName: apps.name,
			id: mailCampaigns.id,
			name: mailCampaigns.name,
			recipientCount: mailCampaigns.recipientCount,
			scheduledAt: mailCampaigns.scheduledAt,
			sentAt: mailCampaigns.sentAt,
			status: mailCampaigns.status,
			updatedAt: mailCampaigns.updatedAt,
		})
		.from(mailCampaigns)
		.innerJoin(apps, eq(apps.id, mailCampaigns.appId))
		.orderBy(desc(mailCampaigns.updatedAt))
		.limit(limit);
}
