import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import { mailContacts, mailInstallations } from "@edgecoms/db/schema/mail";
import { and, asc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { MAIL_APP_SLUGS } from "../apps/identity";

/**
 * THE DASHBOARD: what only Edge Mail knows, the merchants across every Edge
 * app. Delivery numbers (sent, opens, clicks, bounces) are Resend's, and its
 * dashboard shows them better, so they are not repeated here.
 */

const DAY_MS = 86_400_000;
export const WINDOW_DAYS = 30;

/** "YYYY-MM-DD" in UTC, the same day key Postgres produces below. */
function dayKey(date: Date): string {
	return date.toISOString().slice(0, 10);
}

/** Change against the previous window, or null when there is nothing to compare. */
export function change(current: number, previous: number): number | null {
	if (previous === 0) {
		return null;
	}
	return Math.round(((current - previous) / previous) * 100);
}

export async function overview(db: Database, now = new Date()) {
	// Whole UTC days: today and the 29 before it, so the headline and the
	// trend line count exactly the same contacts.
	const today = Date.UTC(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDate()
	);
	const start = new Date(today - (WINDOW_DAYS - 1) * DAY_MS);
	const previousStart = new Date(start.getTime() - WINDOW_DAYS * DAY_MS);
	// Timestamps are stored as UTC wall time, so to_char gives the UTC day.
	const day = sql<string>`to_char(${mailContacts.createdAt}, 'YYYY-MM-DD')`;

	const [daily, [previous], [totals], byApp] = await Promise.all([
		db
			.select({ count: sql<number>`count(*)::int`, day })
			.from(mailContacts)
			.where(gte(mailContacts.createdAt, start))
			.groupBy(day),
		db
			.select({ count: sql<number>`count(*)::int` })
			.from(mailContacts)
			.where(
				and(
					gte(mailContacts.createdAt, previousStart),
					lt(mailContacts.createdAt, start)
				)
			),
		db
			.select({
				contacts: sql<number>`count(*)::int`,
				reachable: sql<number>`count(*) filter (where ${mailContacts.marketing} and ${mailContacts.suppressedAt} is null)::int`,
			})
			.from(mailContacts),
		db
			.select({
				installs: sql<number>`count("mail_installations"."id") filter (where "mail_installations"."status" in ('installed', 'active'))::int`,
				name: apps.name,
			})
			.from(apps)
			.leftJoin(mailInstallations, eq(mailInstallations.appId, apps.id))
			.where(inArray(apps.slug, [...MAIL_APP_SLUGS]))
			.groupBy(apps.name)
			.orderBy(asc(apps.name)),
	]);

	const perDay = new Map(daily.map((row) => [row.day, row.count]));
	const series = Array.from(
		{ length: WINDOW_DAYS },
		(_, index) =>
			perDay.get(dayKey(new Date(start.getTime() + index * DAY_MS))) ?? 0
	);
	const newContacts = daily.reduce((sum, row) => sum + row.count, 0);

	return {
		byApp,
		contacts: totals?.contacts ?? 0,
		liveInstalls: byApp.reduce((sum, row) => sum + row.installs, 0),
		newContacts,
		previousNewContacts: previous?.count ?? 0,
		reachable: totals?.reachable ?? 0,
		series,
	};
}
