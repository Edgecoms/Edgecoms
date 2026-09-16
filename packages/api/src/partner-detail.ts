import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import { commissions } from "@edgecoms/db/schema/earnings";
import { merchants } from "@edgecoms/db/schema/merchants";
import { partnerCodes } from "@edgecoms/db/schema/partners";
import { partnerBonuses, payouts } from "@edgecoms/db/schema/payouts";
import { count, desc, eq, inArray } from "drizzle-orm";

/**
 * EVERYTHING ONE PARTNER HAS, read by their id.
 *
 * The admin partner page used to fetch every admin list and keep the rows whose
 * partner NAME matched. Two partners with the same name (a person with a second
 * account, or two agencies with no company set) then saw each other's stores,
 * commission, bonuses and payouts. Commission was also capped at the 200 newest
 * rows across ALL partners, so a partner's older earnings silently fell off
 * their own page.
 *
 * Every query here filters on the partner's id, and none is capped: it is one
 * partner's book. Money leaves as strings, because a bigint cannot cross HTTP.
 */

function readCodes(db: Database, partnerId: string) {
	return db
		.select({
			code: partnerCodes.code,
			expiresAt: partnerCodes.expiresAt,
			id: partnerCodes.id,
			label: partnerCodes.label,
			maxRedemptions: partnerCodes.maxRedemptions,
			status: partnerCodes.status,
		})
		.from(partnerCodes)
		.where(eq(partnerCodes.partnerId, partnerId))
		.orderBy(desc(partnerCodes.createdAt));
}

/**
 * Stores bound through each code. Counted from merchant rows, as the codes
 * index does, so the number can never disagree with the stores it refers to.
 */
async function countRedemptions(
	db: Database,
	codeIds: readonly string[]
): Promise<Map<string | null, number>> {
	if (codeIds.length === 0) {
		return new Map();
	}
	const rows = await db
		.select({ codeId: merchants.partnerCodeId, value: count() })
		.from(merchants)
		.where(inArray(merchants.partnerCodeId, [...codeIds]))
		.groupBy(merchants.partnerCodeId);
	return new Map(rows.map((row) => [row.codeId, row.value]));
}

function readStores(db: Database, partnerId: string) {
	return db
		.select({
			createdAt: merchants.createdAt,
			id: merchants.id,
			name: merchants.name,
			shopDomain: merchants.shopDomain,
			source: merchants.source,
			sourceCode: merchants.sourceCode,
			status: merchants.status,
		})
		.from(merchants)
		.where(eq(merchants.partnerId, partnerId))
		.orderBy(desc(merchants.createdAt));
}

async function readCommissions(db: Database, partnerId: string) {
	const rows = await db
		.select({
			amount: commissions.commissionAmount,
			appName: apps.name,
			currency: commissions.currency,
			id: commissions.id,
			merchantName: merchants.name,
			period: commissions.periodMonth,
			rateBps: commissions.rateBps,
			status: commissions.status,
		})
		.from(commissions)
		.innerJoin(merchants, eq(merchants.id, commissions.merchantId))
		.innerJoin(apps, eq(apps.id, commissions.appId))
		.where(eq(commissions.partnerId, partnerId))
		.orderBy(desc(commissions.createdAt));
	return rows.map(({ amount, ...row }) => ({
		...row,
		amountMinor: amount.toString(),
	}));
}

async function readBonuses(db: Database, partnerId: string) {
	const rows = await db
		.select({
			amount: partnerBonuses.amount,
			currency: partnerBonuses.currency,
			id: partnerBonuses.id,
			milestoneKey: partnerBonuses.milestoneKey,
			periodMonth: partnerBonuses.periodMonth,
			reason: partnerBonuses.reason,
			status: partnerBonuses.status,
		})
		.from(partnerBonuses)
		.where(eq(partnerBonuses.partnerId, partnerId))
		.orderBy(desc(partnerBonuses.createdAt));
	return rows.map(({ amount, ...row }) => ({
		...row,
		amountMinor: amount.toString(),
	}));
}

async function readPayouts(db: Database, partnerId: string) {
	const rows = await db
		.select({
			currency: payouts.currency,
			id: payouts.id,
			method: payouts.method,
			net: payouts.netAmount,
			paidAt: payouts.paidAt,
			periodMonth: payouts.periodMonth,
			reference: payouts.reference,
			status: payouts.status,
			total: payouts.totalAmount,
		})
		.from(payouts)
		.where(eq(payouts.partnerId, partnerId))
		.orderBy(desc(payouts.createdAt));
	return rows.map(({ net, total, ...row }) => ({
		...row,
		amountMinor: total.toString(),
		netMinor: net.toString(),
	}));
}

export async function readPartnerDetail(db: Database, partnerId: string) {
	const [codeRows, stores, commissionRows, bonuses, payoutRows] =
		await Promise.all([
			readCodes(db, partnerId),
			readStores(db, partnerId),
			readCommissions(db, partnerId),
			readBonuses(db, partnerId),
			readPayouts(db, partnerId),
		]);
	const redemptions = await countRedemptions(
		db,
		codeRows.map((row) => row.id)
	);
	return {
		bonuses,
		codes: codeRows.map((row) => ({
			...row,
			redemptions: redemptions.get(row.id) ?? 0,
		})),
		commissions: commissionRows,
		payouts: payoutRows,
		stores,
	};
}
