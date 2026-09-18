import type { Database } from "@edgecoms/db";
import { user } from "@edgecoms/db/schema/auth";
import { partnerCodes, partners } from "@edgecoms/db/schema/partners";
import { referralLinks } from "@edgecoms/db/schema/referrals";
import { and, eq, isNull } from "drizzle-orm";
import { normalizeCode, validateCode } from "../attribution/codes";

/**
 * RESOLVING `/r/<something>` TO A PARTNER.
 *
 * Two addresses reach the same partner. `/r/ACMEAGENCY` is the partner's code,
 * which works the moment they are approved and needs no row anywhere. A custom
 * slug (`/r/acme`) is a `referral_links` row somebody created deliberately.
 *
 * A click is not a binding, but it is the front of the funnel that ends in one,
 * so a link must never promise what a code would refuse: the code path runs
 * through the SAME `validateCode` the bind uses, which also covers the partner
 * being approved. A suspended partner's link stops working, exactly as their
 * code does.
 */

const SLUG_SHAPE = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;
const SLUG_STRIP = /[^a-z0-9-]+/g;
const SLUG_DASHES = /-{2,}/g;
const SLUG_EDGES = /^-+|-+$/g;
const SUB_ID_STRIP = /[^a-z0-9_-]+/g;

export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 40;
export const SUB_ID_MAX_LENGTH = 40;

/**
 * Paths the site itself owns, or may own. A link slug that shadowed one would
 * be unreachable, and `/r/admin` reads like a trap even though it is not one.
 */
export const RESERVED_SLUGS: readonly string[] = [
	"admin",
	"api",
	"app",
	"apps",
	"blog",
	"careers",
	"contact",
	"edge",
	"login",
	"partner",
	"partners",
	"pricing",
	"privacy",
	"products",
	"r",
	"register",
	"settings",
	"signup",
	"terms",
];

/** A slug as it is stored: lower-case, hyphen-separated, no edge hyphens. */
export function normalizeSlug(input: string): string {
	return input
		.trim()
		.toLowerCase()
		.replace(SLUG_STRIP, "-")
		.replace(SLUG_DASHES, "-")
		.replace(SLUG_EDGES, "")
		.slice(0, SLUG_MAX_LENGTH)
		.replace(SLUG_EDGES, "");
}

export function isUsableSlug(slug: string): boolean {
	return (
		slug.length >= SLUG_MIN_LENGTH &&
		SLUG_SHAPE.test(slug) &&
		!RESERVED_SLUGS.includes(slug)
	);
}

/**
 * A channel label, as a partner types it: `?s=IG Reel 12` becomes
 * `ig-reel-12`. Normalized rather than rejected, because the partner is
 * labelling their own traffic and a rejected link just loses the click.
 */
export function normalizeSubId(input: string): string | null {
	const subId = input
		.trim()
		.toLowerCase()
		.replace(SUB_ID_STRIP, "-")
		.replace(SLUG_DASHES, "-")
		.replace(SLUG_EDGES, "")
		.slice(0, SUB_ID_MAX_LENGTH)
		.replace(SLUG_EDGES, "");
	return subId === "" ? null : subId;
}

/** The link a click belongs to, when a row for its shape exists. */
export interface MatchedLink {
	appSlug: string | null;
	id: string;
	subId: string | null;
}

export interface ResolvedReferral {
	/** The app this click is for: from the path, or the link's own app. */
	appSlug: string | null;
	/** The partner's code, for the cookie and the UTM campaign. */
	code: string;
	link: MatchedLink | null;
	partnerId: string;
	/** What the landing page calls them: company name, else their own name. */
	partnerName: string;
	subId: string | null;
}

interface LinkRow {
	appSlug: string | null;
	id: string;
	partnerId: string;
	partnerName: string | null;
	slug: string;
	subId: string | null;
	userName: string;
}

async function findLinkBySlug(
	db: Database,
	slug: string
): Promise<LinkRow | null> {
	const rows = await db
		.select({
			appSlug: referralLinks.appSlug,
			id: referralLinks.id,
			partnerId: referralLinks.partnerId,
			partnerName: partners.companyName,
			slug: referralLinks.slug,
			subId: referralLinks.subId,
			userName: user.name,
		})
		.from(referralLinks)
		.innerJoin(partners, eq(partners.id, referralLinks.partnerId))
		.innerJoin(user, eq(user.id, partners.userId))
		.where(
			and(
				eq(referralLinks.slug, slug),
				eq(referralLinks.isActive, true),
				eq(partners.status, "approved")
			)
		)
		.limit(1);
	return rows[0] ?? null;
}

/** The partner's first active code, for a link addressed by its custom slug. */
async function codeForPartner(
	db: Database,
	partnerId: string
): Promise<string | null> {
	const rows = await db
		.select({ code: partnerCodes.code })
		.from(partnerCodes)
		.where(
			and(
				eq(partnerCodes.partnerId, partnerId),
				eq(partnerCodes.status, "active")
			)
		)
		.orderBy(partnerCodes.createdAt)
		.limit(1);
	return rows[0]?.code ?? null;
}

/**
 * The row a click should be counted against, given a partner and the shape the
 * URL asked for. An exact (app, channel) match only: a `?s=youtube` click with
 * no row for that channel still counts, against the partner, with the channel
 * kept on the click itself. That is deliberate, because creating a row per
 * unseen `?s=` would let anybody fill the table from the open web.
 */
async function matchLink(
	db: Database,
	partnerId: string,
	appSlug: string | null,
	subId: string | null
): Promise<MatchedLink | null> {
	const rows = await db
		.select({
			appSlug: referralLinks.appSlug,
			id: referralLinks.id,
			subId: referralLinks.subId,
		})
		.from(referralLinks)
		.where(
			and(
				eq(referralLinks.partnerId, partnerId),
				eq(referralLinks.isActive, true),
				appSlug === null
					? isNull(referralLinks.appSlug)
					: eq(referralLinks.appSlug, appSlug),
				subId === null
					? isNull(referralLinks.subId)
					: eq(referralLinks.subId, subId)
			)
		)
		.limit(1);
	return rows[0] ?? null;
}

async function partnerDisplayName(
	db: Database,
	partnerId: string,
	fallback: string
): Promise<string> {
	const rows = await db
		.select({ company: partners.companyName, name: user.name })
		.from(partners)
		.innerJoin(user, eq(user.id, partners.userId))
		.where(eq(partners.id, partnerId))
		.limit(1);
	const row = rows[0];
	return row?.company ?? row?.name ?? fallback;
}

export interface ResolveInput {
	/** The Edge app named in the path, already checked against the catalog. */
	appSlug: string | null;
	/** The first path segment: a custom slug or a partner code. */
	ref: string;
	/** The `?s=` channel, already normalized. */
	subId: string | null;
}

/**
 * Resolve a referral address. Null means "nothing here": an unknown code, a
 * disabled link, or a partner who cannot acquire stores. The route sends those
 * visitors to the product pages with no click recorded, because a click that
 * can never convert is not data, it is noise.
 */
export async function resolveReferral(
	db: Database,
	input: ResolveInput
): Promise<ResolvedReferral | null> {
	const slug = normalizeSlug(input.ref);
	const bySlug = slug === "" ? null : await findLinkBySlug(db, slug);

	if (bySlug) {
		const code = await codeForPartner(db, bySlug.partnerId);
		if (!code) {
			return null;
		}
		return {
			appSlug: input.appSlug ?? bySlug.appSlug,
			code,
			link: { appSlug: bySlug.appSlug, id: bySlug.id, subId: bySlug.subId },
			partnerId: bySlug.partnerId,
			partnerName: bySlug.partnerName ?? bySlug.userName,
			subId: input.subId ?? bySlug.subId,
		};
	}

	const validation = await validateCode(db, input.ref);
	if (!validation.valid) {
		return null;
	}

	const { code } = validation;
	return {
		appSlug: input.appSlug,
		code: normalizeCode(code.code),
		link: await matchLink(db, code.partnerId, input.appSlug, input.subId),
		partnerId: code.partnerId,
		partnerName: await partnerDisplayName(db, code.partnerId, code.partnerName),
		subId: input.subId,
	};
}
