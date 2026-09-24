import type { Database } from "@edgecoms/db";
import { mailContactStores, mailInstallations } from "@edgecoms/db/schema/mail";
import { eq, sql } from "drizzle-orm";

/** Live installs and distinct contacts per app. */
export async function appCounts(
	db: Database
): Promise<Map<string, { contacts: number; installs: number }>> {
	const rows = await db
		.select({
			appId: mailInstallations.appId,
			// Qualified by hand: drizzle renders columns in `sql` unqualified.
			contacts: sql<number>`count(distinct "mail_contact_stores"."contact_id")::int`,
			installs: sql<number>`count(distinct "mail_installations"."id") filter (where "mail_installations"."status" in ('installed', 'active'))::int`,
		})
		.from(mailInstallations)
		.leftJoin(
			mailContactStores,
			eq(mailContactStores.storeId, mailInstallations.storeId)
		)
		.groupBy(mailInstallations.appId);
	return new Map(
		rows.map((row) => [
			row.appId,
			{ contacts: row.contacts, installs: row.installs },
		])
	);
}
