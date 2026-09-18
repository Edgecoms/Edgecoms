import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import { referralLinks } from "@edgecoms/db/schema/referrals";
import { TRPCError } from "@trpc/server";
import { and, asc, count, eq, isNull } from "drizzle-orm";
import { clickTotals } from "./clicks";
import {
	activePartnerCode,
	isUsableSlug,
	normalizeSlug,
	normalizeSubId,
	SLUG_MAX_LENGTH,
	SLUG_MIN_LENGTH,
} from "./links";

/**
 * CREATING AND LISTING LINKS.
 *
 * Shared by the admin router and the partner router, because the rules are the
 * same either way and only the scope differs: a partner may create links for
 * themselves, an admin for anybody. Every write in here takes the partner id
 * from the caller's own scope, never from a client field.
 *
 * A partner always has a working link without a row here (`/r/<their code>`),
 * so what these create are the extras: one app, one channel, or a nicer slug.
 */

/** Enough for a channel per platform and a campaign per launch, not a farm. */
export const MAX_LINKS_PER_PARTNER = 50;

export interface LinkRow {
	appSlug: string | null;
	clicks: number;
	createdAt: Date;
	id: string;
	isActive: boolean;
	slug: string;
	subId: string | null;
	uniqueClicks: number;
}

export interface PartnerLinks {
	/** Null while the partner holds no active code, which also means no links. */
	code: string | null;
	links: LinkRow[];
}

export async function listPartnerLinks(
	db: Database,
	partnerId: string
): Promise<PartnerLinks> {
	const [code, rows, totals] = await Promise.all([
		activePartnerCode(db, partnerId),
		db
			.select({
				appSlug: referralLinks.appSlug,
				createdAt: referralLinks.createdAt,
				id: referralLinks.id,
				isActive: referralLinks.isActive,
				slug: referralLinks.slug,
				subId: referralLinks.subId,
			})
			.from(referralLinks)
			.where(eq(referralLinks.partnerId, partnerId))
			.orderBy(asc(referralLinks.createdAt)),
		clickTotals(db, partnerId),
	]);

	return {
		code,
		links: rows.map((row) => ({
			...row,
			clicks: totals.get(row.id)?.clicks ?? 0,
			uniqueClicks: totals.get(row.id)?.unique ?? 0,
		})),
	};
}

async function assertKnownApp(db: Database, appSlug: string): Promise<void> {
	const rows = await db
		.select({ slug: apps.slug })
		.from(apps)
		.where(eq(apps.slug, appSlug))
		.limit(1);
	if (rows.length === 0) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "That is not an Edge app.",
		});
	}
}

async function assertUnderCap(db: Database, partnerId: string): Promise<void> {
	const rows = await db
		.select({ value: count() })
		.from(referralLinks)
		.where(eq(referralLinks.partnerId, partnerId));
	if ((rows[0]?.value ?? 0) >= MAX_LINKS_PER_PARTNER) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: `A partner may hold ${MAX_LINKS_PER_PARTNER} links. Disable one you no longer use.`,
		});
	}
}

async function slugIsFree(db: Database, slug: string): Promise<boolean> {
	const rows = await db
		.select({ id: referralLinks.id })
		.from(referralLinks)
		.where(eq(referralLinks.slug, slug))
		.limit(1);
	return rows.length === 0;
}

/**
 * The address for a new link, built from the code and what makes it different:
 * `youragency-edge-cart`, `youragency-youtube`. A trailing number is added if
 * that is taken, because two partners can pick the same channel name and the
 * slug is global.
 */
async function deriveSlug(
	db: Database,
	code: string,
	appSlug: string | null,
	subId: string | null
): Promise<string> {
	const base = normalizeSlug(
		[code, subId, appSlug].filter((part) => part !== null).join("-")
	);
	if (isUsableSlug(base) && (await slugIsFree(db, base))) {
		return base;
	}
	for (let suffix = 2; suffix < 50; suffix++) {
		const candidate = `${base.slice(0, SLUG_MAX_LENGTH - 3)}-${suffix}`;
		if (isUsableSlug(candidate) && (await slugIsFree(db, candidate))) {
			return candidate;
		}
	}
	throw new TRPCError({
		code: "BAD_REQUEST",
		message: "Could not find a free address for that link. Try another name.",
	});
}

export interface CreateLinkInput {
	/** Null for a link that covers every Edge app. */
	appSlug?: string | null;
	partnerId: string;
	/** Admin only. Without one, an address is derived from the code. */
	slug?: string | null;
	subId?: string | null;
}

export async function createLink(
	db: Database,
	input: CreateLinkInput
): Promise<LinkRow> {
	const code = await activePartnerCode(db, input.partnerId);
	if (!code) {
		throw new TRPCError({
			code: "PRECONDITION_FAILED",
			message:
				"This partner has no active code, so a link would resolve to nothing. Issue a code first.",
		});
	}

	const appSlug = input.appSlug ?? null;
	if (appSlug) {
		await assertKnownApp(db, appSlug);
	}
	const subId = input.subId ? normalizeSubId(input.subId) : null;

	/**
	 * A link with no app and no channel IS the main link, which every partner
	 * already has at `/r/<code>` without a row. Creating one derives the code
	 * as its address and quietly takes over those clicks, so it is refused
	 * unless somebody is deliberately giving the main link a nicer address.
	 */
	if (appSlug === null && subId === null && !input.slug) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: `This partner already has that link at /r/${code}. Give this one an app, a channel, or a custom address.`,
		});
	}
	await assertUnderCap(db, input.partnerId);

	let slug: string;
	if (input.slug) {
		slug = normalizeSlug(input.slug);
		if (!isUsableSlug(slug)) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: `Use ${SLUG_MIN_LENGTH} to ${SLUG_MAX_LENGTH} letters, digits or hyphens, and not a word the site already uses.`,
			});
		}
		if (slug === normalizeSlug(code)) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: `/r/${code} is already this partner's main link. Pick a different address.`,
			});
		}
		if (!(await slugIsFree(db, slug))) {
			throw new TRPCError({
				code: "CONFLICT",
				message: "That address is taken. Pick another.",
			});
		}
	} else {
		slug = await deriveSlug(db, code, appSlug, subId);
	}

	const existing = await db
		.select({ id: referralLinks.id })
		.from(referralLinks)
		.where(
			and(
				eq(referralLinks.partnerId, input.partnerId),
				appSlug === null
					? isNull(referralLinks.appSlug)
					: eq(referralLinks.appSlug, appSlug),
				subId === null
					? isNull(referralLinks.subId)
					: eq(referralLinks.subId, subId)
			)
		)
		.limit(1);
	if (existing.length > 0) {
		throw new TRPCError({
			code: "CONFLICT",
			message:
				"A link for that app and channel already exists. Use it, or give this one a different channel.",
		});
	}

	const rows = await db
		.insert(referralLinks)
		.values({ appSlug, partnerId: input.partnerId, slug, subId })
		.returning({
			appSlug: referralLinks.appSlug,
			createdAt: referralLinks.createdAt,
			id: referralLinks.id,
			isActive: referralLinks.isActive,
			slug: referralLinks.slug,
			subId: referralLinks.subId,
		});
	const created = rows[0];
	if (!created) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "The link was not created.",
		});
	}
	return { ...created, clicks: 0, uniqueClicks: 0 };
}

/**
 * Turn a link on or off. Disabling stops new clicks resolving to it and never
 * touches the stores it already brought, the same rule a disabled code follows.
 */
export async function setLinkActive(
	db: Database,
	linkId: string,
	isActive: boolean,
	partnerId?: string
): Promise<void> {
	const scope = partnerId
		? and(eq(referralLinks.id, linkId), eq(referralLinks.partnerId, partnerId))
		: eq(referralLinks.id, linkId);
	const rows = await db
		.update(referralLinks)
		.set({ isActive })
		.where(scope)
		.returning({ id: referralLinks.id });
	if (rows.length === 0) {
		throw new TRPCError({ code: "NOT_FOUND", message: "No such link." });
	}
}

/** Admin only: give a partner's link a memorable address. */
export async function setLinkSlug(
	db: Database,
	linkId: string,
	rawSlug: string
): Promise<string> {
	const slug = normalizeSlug(rawSlug);
	if (!isUsableSlug(slug)) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message:
				"Use 3 to 40 letters, digits or hyphens, and not a word the site already uses.",
		});
	}
	if (!(await slugIsFree(db, slug))) {
		throw new TRPCError({
			code: "CONFLICT",
			message: "That address is taken. Pick another.",
		});
	}
	const rows = await db
		.update(referralLinks)
		.set({ slug })
		.where(eq(referralLinks.id, linkId))
		.returning({ slug: referralLinks.slug });
	const updated = rows[0];
	if (!updated) {
		throw new TRPCError({ code: "NOT_FOUND", message: "No such link." });
	}
	return updated.slug;
}
