import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import {
	type MailAudience,
	mailContactStores,
	mailContacts,
	mailInstallations,
} from "@edgecoms/db/schema/mail";
import {
	and,
	eq,
	gte,
	inArray,
	isNull,
	notExists,
	type SQL,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";

/**
 * WHO A CAMPAIGN REACHES. One query, used for the live count, the confirm
 * step and the send, so the number an admin confirms is computed exactly the
 * way the recipients are.
 *
 * Always, whatever the audience says:
 *   • the contact opted in to the campaign's category (no category is exempt);
 *   • the contact is not suppressed (bounced or complained);
 *   • each person counts once, however many matching stores they run.
 */

const INSTALL_STATUSES = [
	"installed",
	"active",
	"inactive",
	"uninstalled",
] as const;

export const CATEGORIES = [
	"product_updates",
	"marketing",
	"education",
] as const;
export type Category = (typeof CATEGORIES)[number];

const DAYS = z.number().int().min(1).max(3650);

export const audienceSchema = z
	.object({
		activeWithinDays: DAYS.optional(),
		installStatuses: z.array(z.enum(INSTALL_STATUSES)).min(1).optional(),
		notInstalledAppSlugs: z.array(z.string().min(1).max(64)).max(20).optional(),
		plans: z.array(z.string().trim().min(1).max(120)).max(20).optional(),
		uninstalledWithinDays: DAYS.optional(),
	})
	.strict() satisfies z.ZodType<MailAudience>;

const DEFAULT_STATUSES: MailAudience["installStatuses"] = [
	"installed",
	"active",
];

const DAY_MS = 86_400_000;

function daysAgo(days: number, now: Date): Date {
	return new Date(now.getTime() - days * DAY_MS);
}

/** The opted-in column for a category. */
function optedIn(category: Category): SQL {
	switch (category) {
		case "product_updates":
			return eq(mailContacts.productUpdates, true);
		case "marketing":
			return eq(mailContacts.marketing, true);
		default:
			return eq(mailContacts.education, true);
	}
}

export interface Recipient {
	contactId: string;
	email: string;
}

export function resolveRecipients(
	db: Database,
	input: {
		appId: string;
		audience: MailAudience;
		category: Category;
		now?: Date;
	}
): Promise<Recipient[]> {
	const { audience } = input;
	const now = input.now ?? new Date();
	const statuses =
		audience.uninstalledWithinDays === undefined
			? (audience.installStatuses ?? DEFAULT_STATUSES)
			: ["uninstalled" as const];

	const conditions: (SQL | undefined)[] = [
		eq(mailInstallations.appId, input.appId),
		inArray(mailInstallations.status, statuses ?? []),
		optedIn(input.category),
		isNull(mailContacts.suppressedAt),
	];
	if (audience.plans && audience.plans.length > 0) {
		conditions.push(inArray(mailInstallations.plan, audience.plans));
	}
	if (audience.activeWithinDays !== undefined) {
		conditions.push(
			gte(
				mailInstallations.lastActiveAt,
				daysAgo(audience.activeWithinDays, now)
			)
		);
	}
	if (audience.uninstalledWithinDays !== undefined) {
		conditions.push(
			gte(
				mailInstallations.uninstalledAt,
				daysAgo(audience.uninstalledWithinDays, now)
			)
		);
	}
	if (
		audience.notInstalledAppSlugs &&
		audience.notInstalledAppSlugs.length > 0
	) {
		// Cross-sell: the SAME store must not already run the other app.
		const other = alias(mailInstallations, "other_install");
		conditions.push(
			notExists(
				db
					.select({ id: other.id })
					.from(other)
					.innerJoin(apps, eq(apps.id, other.appId))
					.where(
						and(
							eq(other.storeId, mailInstallations.storeId),
							inArray(apps.slug, audience.notInstalledAppSlugs),
							inArray(other.status, ["installed", "active"])
						)
					)
			)
		);
	}

	return db
		.selectDistinct({ contactId: mailContacts.id, email: mailContacts.email })
		.from(mailInstallations)
		.innerJoin(
			mailContactStores,
			eq(mailContactStores.storeId, mailInstallations.storeId)
		)
		.innerJoin(mailContacts, eq(mailContacts.id, mailContactStores.contactId))
		.where(and(...conditions))
		.orderBy(mailContacts.email);
}
