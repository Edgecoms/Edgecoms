import type { Database } from "@edgecoms/db";
import { mailEmailEvents, mailEvents } from "@edgecoms/db/schema/mail";
import { sql } from "drizzle-orm";

/** When each inbound stream last delivered, to spot one that went quiet. */
export async function lastReceived(db: Database) {
	const [webhook] = await db
		.select({ at: sql<Date | null>`max(${mailEmailEvents.receivedAt})` })
		.from(mailEmailEvents);
	const [event] = await db
		.select({ at: sql<Date | null>`max(${mailEvents.receivedAt})` })
		.from(mailEvents);
	return { event: event?.at ?? null, webhook: webhook?.at ?? null };
}
