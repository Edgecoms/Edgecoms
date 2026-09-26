import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import {
	mailCampaigns,
	mailContactStores,
	mailContacts,
	mailEmailEvents,
	mailEvents,
	mailInstallations,
	mailStores,
} from "@edgecoms/db/schema/mail";
import { desc, eq, ilike, or, sql } from "drizzle-orm";

/** `%` and `_` typed into search are literal characters, not wildcards. */
function likePattern(search: string): string {
	return `%${search.replace(/[\\%_]/g, (character) => `\\${character}`)}%`;
}

/*
 * Correlated subqueries as literal SQL. Drizzle renders a column inside `sql`
 * UNQUALIFIED, which is ambiguous across a join and, worse, would silently
 * bind the outer contact's "id" to an inner table's. Every identifier here is
 * a fixed name; the search pattern is the only value, and it is a parameter.
 */
const APP_COUNT = sql<number>`(
	select count(distinct i.app_id)::int
	from mail_contact_stores cs
	join mail_installations i on i.store_id = cs.store_id
	where cs.contact_id = "mail_contacts"."id"
	and i.status in ('installed', 'active')
)`;

const LAST_ACTIVE = sql<Date | null>`(
	select max(i.last_active_at)
	from mail_contact_stores cs
	join mail_installations i on i.store_id = cs.store_id
	where cs.contact_id = "mail_contacts"."id"
)`;

/** The store the contact was most recently active on; the profile lists them all. */
const LATEST_STORE = sql<string | null>`(
	select s.shop_domain
	from mail_contact_stores cs
	join mail_stores s on s.id = cs.store_id
	where cs.contact_id = "mail_contacts"."id"
	order by (
		select max(i.last_active_at)
		from mail_installations i
		where i.store_id = cs.store_id
	) desc nulls last, cs.created_at desc
	limit 1
)`;

export function listContacts(db: Database, search: string, limit = 50) {
	const pattern = likePattern(search.trim());
	const matchesStore = sql`exists (
		select 1 from mail_contact_stores cs
		join mail_stores s on s.id = cs.store_id
		where cs.contact_id = "mail_contacts"."id"
		and s.shop_domain ilike ${pattern}
	)`;
	return db
		.select({
			appCount: APP_COUNT,
			email: mailContacts.email,
			firstName: mailContacts.firstName,
			id: mailContacts.id,
			lastActiveAt: LAST_ACTIVE.mapWith((value) =>
				value === null ? null : new Date(value)
			),
			lastName: mailContacts.lastName,
			marketing: mailContacts.marketing,
			productUpdates: mailContacts.productUpdates,
			shopDomain: LATEST_STORE,
			suppressedAt: mailContacts.suppressedAt,
		})
		.from(mailContacts)
		.where(
			search.trim() === ""
				? undefined
				: or(ilike(mailContacts.email, pattern), matchesStore)
		)
		.orderBy(desc(mailContacts.createdAt))
		.limit(limit);
}

export interface TimelineItem {
	at: Date;
	detail: string | null;
	kind: "app" | "email";
	type: string;
}

export async function contactProfile(db: Database, contactId: string) {
	const [contact] = await db
		.select()
		.from(mailContacts)
		.where(eq(mailContacts.id, contactId))
		.limit(1);
	if (!contact) {
		return null;
	}

	const installs = await db
		.select({
			appName: apps.name,
			plan: mailInstallations.plan,
			setupCompletedAt: mailInstallations.setupCompletedAt,
			shopDomain: mailStores.shopDomain,
			status: mailInstallations.status,
		})
		.from(mailContactStores)
		.innerJoin(mailStores, eq(mailStores.id, mailContactStores.storeId))
		.leftJoin(
			mailInstallations,
			eq(mailInstallations.storeId, mailContactStores.storeId)
		)
		.leftJoin(apps, eq(apps.id, mailInstallations.appId))
		.where(eq(mailContactStores.contactId, contactId))
		.orderBy(mailStores.shopDomain, apps.name);

	const appEvents = await db
		.select({
			appName: apps.name,
			at: mailEvents.occurredAt,
			type: mailEvents.type,
		})
		.from(mailEvents)
		.innerJoin(apps, eq(apps.id, mailEvents.appId))
		.where(eq(mailEvents.contactId, contactId))
		.orderBy(desc(mailEvents.occurredAt))
		.limit(50);

	const emailEvents = await db
		.select({
			at: mailEmailEvents.occurredAt,
			campaign: mailCampaigns.name,
			type: mailEmailEvents.type,
		})
		.from(mailEmailEvents)
		.leftJoin(mailCampaigns, eq(mailCampaigns.id, mailEmailEvents.campaignId))
		.where(eq(mailEmailEvents.contactId, contactId))
		.orderBy(desc(mailEmailEvents.occurredAt))
		.limit(50);

	const timeline: TimelineItem[] = [
		...appEvents.map(
			(event): TimelineItem => ({
				at: event.at,
				detail: event.appName,
				kind: "app",
				type: event.type,
			})
		),
		...emailEvents.map(
			(event): TimelineItem => ({
				at: event.at,
				detail: event.campaign,
				kind: "email",
				type: event.type,
			})
		),
	]
		.sort((a, b) => b.at.getTime() - a.at.getTime())
		.slice(0, 50);

	return { contact, installs, timeline };
}
