import { createHash } from "node:crypto";
import type { Database } from "@edgecoms/db";
import { referralClicks } from "@edgecoms/db/schema/referrals";
import { and, count, eq, gte, isNull, sql } from "drizzle-orm";

/**
 * RECORDING A CLICK.
 *
 * Three rules, and every one of them is about not trusting the open web:
 *
 *   • NEVER THE RAW ADDRESS. The caller's IP is hashed with a salt from the
 *     environment before it reaches this module's insert, and the address
 *     itself is never a column. Everything the funnel needs (one visitor
 *     counted once, and a flood stopped) works on the hash.
 *
 *   • A BOT IS RECORDED, NOT COUNTED. Crawlers are kept with `isBot` set so a
 *     partner can see that their traffic was crawlers, and never marked
 *     `isUnique`, so they cannot inflate the funnel.
 *
 *   • A FLOOD IS DROPPED. Past the hourly ceiling for one address, nothing is
 *     written and the visitor is still redirected. The redirect is the
 *     merchant's business; the row is ours.
 */

/** A second click from the same address on the same link inside this window
 *  is the same visitor coming back, not a new one. */
const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;
/** The rate-limit window and its ceiling, per hashed address. */
const RATE_WINDOW_MS = 60 * 60 * 1000;
export const CLICKS_PER_IP_PER_HOUR = 60;

const BOT_PATTERN =
	/bot|crawl|spider|slurp|scrape|search|fetch|monitor|uptime|pingdom|preview|headless|phantom|puppeteer|playwright|selenium|curl|wget|python-requests|httpclient|go-http-client|axios|okhttp|java\/|libwww|lighthouse|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|gptbot|ccbot|claudebot|perplexity|facebookexternalhit|whatsapp|telegram|slackbot|discord|vkshare|skypeuripreview|embedly|quora link preview|nuzzel|bitlybot|applebot/i;
const TABLET_PATTERN = /ipad|tablet|kindle|silk|playbook|nexus (?:7|9|10)/i;
const MOBILE_PATTERN =
	/mobi|iphone|ipod|android|windows phone|blackberry|opera mini/i;

export type DeviceType = "desktop" | "mobile" | "tablet" | "unknown";

export interface UserAgentFacts {
	deviceType: DeviceType;
	isBot: boolean;
}

/**
 * What the User-Agent says. A missing header is `unknown` and treated as a
 * bot: every real browser sends one, and a request without it is a script.
 */
export function classifyUserAgent(userAgent: string | null): UserAgentFacts {
	if (!userAgent || userAgent.trim() === "") {
		return { deviceType: "unknown", isBot: true };
	}
	if (BOT_PATTERN.test(userAgent)) {
		return { deviceType: "unknown", isBot: true };
	}
	if (TABLET_PATTERN.test(userAgent)) {
		return { deviceType: "tablet", isBot: false };
	}
	if (MOBILE_PATTERN.test(userAgent)) {
		return { deviceType: "mobile", isBot: false };
	}
	return { deviceType: "desktop", isBot: false };
}

/**
 * The stored form of an address: `sha256(salt + ":" + ip)`, truncated to 32
 * characters. Truncation keeps the column small and the index fast; 128 bits
 * is far beyond what a dedupe key needs, and a shorter hash is no easier to
 * reverse than a longer one when the salt is secret.
 *
 * Null in, null out. No salt also means null: a hash with a known or empty
 * salt is a reversible record of who visited, which is the one thing this
 * column must never be.
 */
export function hashIp(ip: string | null, salt: string | null): string | null {
	const address = ip?.trim();
	if (!(address && salt)) {
		return null;
	}
	return createHash("sha256")
		.update(`${salt}:${address}`)
		.digest("hex")
		.slice(0, 32);
}

export interface ClickInput {
	appSlug: string | null;
	country: string | null;
	deviceType: DeviceType;
	ipHash: string | null;
	isBot: boolean;
	linkId: string | null;
	partnerId: string;
	referrer: string | null;
	subId: string | null;
	userAgent: string | null;
	utmCampaign: string | null;
	utmContent: string | null;
	utmMedium: string | null;
	utmSource: string | null;
	utmTerm: string | null;
}

export interface ClickOutcome {
	/** Null when nothing was written: over the hourly ceiling for this address. */
	clickId: string | null;
	isUnique: boolean;
	rateLimited: boolean;
}

/** Text columns are trimmed to keep one long header from filling a row. */
const MAX_TEXT = 512;

function clip(value: string | null): string | null {
	if (value === null) {
		return null;
	}
	const trimmed = value.trim();
	return trimmed === "" ? null : trimmed.slice(0, MAX_TEXT);
}

async function countRecent(
	db: Database,
	ipHash: string,
	since: Date
): Promise<number> {
	const rows = await db
		.select({ value: count() })
		.from(referralClicks)
		.where(
			and(
				eq(referralClicks.ipHash, ipHash),
				gte(referralClicks.createdAt, since)
			)
		);
	return rows[0]?.value ?? 0;
}

/**
 * Has this address already been counted for this link today?
 *
 * Keyed on the LINK when the click resolved to one and on the partner
 * otherwise, so the two addresses of the same partner (their bare code and a
 * custom slug) each dedupe within themselves. A bot never reaches this: it is
 * not unique by definition.
 */
async function alreadySeen(
	db: Database,
	input: ClickInput,
	ipHash: string,
	since: Date
): Promise<boolean> {
	const rows = await db
		.select({ value: count() })
		.from(referralClicks)
		.where(
			and(
				eq(referralClicks.ipHash, ipHash),
				gte(referralClicks.createdAt, since),
				input.linkId === null
					? and(
							isNull(referralClicks.linkId),
							eq(referralClicks.partnerId, input.partnerId)
						)
					: eq(referralClicks.linkId, input.linkId)
			)
		);
	return (rows[0]?.value ?? 0) > 0;
}

export async function recordClick(
	db: Database,
	input: ClickInput,
	now: Date = new Date()
): Promise<ClickOutcome> {
	if (input.ipHash) {
		const flooding =
			(await countRecent(
				db,
				input.ipHash,
				new Date(now.getTime() - RATE_WINDOW_MS)
			)) >= CLICKS_PER_IP_PER_HOUR;
		if (flooding) {
			return { clickId: null, isUnique: false, rateLimited: true };
		}
	}

	/* No hash means no way to tell one visitor from another, so the click is
	   recorded and left out of the unique count rather than guessed at. */
	const isUnique =
		!input.isBot &&
		input.ipHash !== null &&
		!(await alreadySeen(
			db,
			input,
			input.ipHash,
			new Date(now.getTime() - DEDUPE_WINDOW_MS)
		));

	const rows = await db
		.insert(referralClicks)
		.values({
			appSlug: input.appSlug,
			country: input.country?.slice(0, 2).toUpperCase() ?? null,
			createdAt: now,
			deviceType: input.deviceType,
			ipHash: input.ipHash,
			isBot: input.isBot,
			isUnique,
			linkId: input.linkId,
			partnerId: input.partnerId,
			referrer: clip(input.referrer),
			subId: input.subId,
			userAgent: clip(input.userAgent),
			utmCampaign: clip(input.utmCampaign),
			utmContent: clip(input.utmContent),
			utmMedium: clip(input.utmMedium),
			utmSource: clip(input.utmSource),
			utmTerm: clip(input.utmTerm),
		})
		.returning({ id: referralClicks.id });

	return { clickId: rows[0]?.id ?? null, isUnique, rateLimited: false };
}

/** Clicks and unique clicks for one partner, used by the links list. */
export async function clickTotals(
	db: Database,
	partnerId: string
): Promise<Map<string | null, { clicks: number; unique: number }>> {
	const rows = await db
		.select({
			clicks: count(),
			linkId: referralClicks.linkId,
			uniques: sql<number>`count(*) filter (where ${referralClicks.isUnique})`,
		})
		.from(referralClicks)
		.where(
			and(
				eq(referralClicks.partnerId, partnerId),
				eq(referralClicks.isBot, false)
			)
		)
		.groupBy(referralClicks.linkId);
	return new Map(
		rows.map((row) => [
			row.linkId,
			{ clicks: Number(row.clicks), unique: Number(row.uniques) },
		])
	);
}
