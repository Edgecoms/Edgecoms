import { toPeriodMonth } from "@edgecoms/billing/commissions";
import { apps } from "@edgecoms/db/schema/apps";
import { commissions } from "@edgecoms/db/schema/earnings";
import { merchants } from "@edgecoms/db/schema/merchants";
import { partnerCodes, partners } from "@edgecoms/db/schema/partners";
import { payouts } from "@edgecoms/db/schema/payouts";
import { and, count, desc, eq, isNotNull, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { partnerProcedure, router } from "../index";

const MONEY_SUM = (column: typeof commissions.commissionAmount) =>
	sql<string>`coalesce(sum(${column}), 0)`;

const profileInput = z.object({
	companyName: z.string().max(200).optional(),
	website: z.string().max(300).optional(),
	payoutMethod: z.string().max(100).optional(),
	payoutReference: z.string().max(200).optional(),
});

/**
 * Partner-scoped router. `partnerProcedure` resolves `ctx.partner` from the
 * session; EVERY query below filters by `ctx.partner.id`. No procedure accepts
 * a partner id from input — the tenant-isolation wall (CLAUDE.md).
 */
export const partnerRouter = router({
	me: partnerProcedure.query(({ ctx }) => ctx.partner),

	/**
	 * Diagnostic: proves the resolved scope is the SESSION's partner id and that
	 * any client-supplied id is ignored. Exercised by the authorization tests.
	 */
	scope: partnerProcedure
		.input(z.object({ partnerId: z.string().optional() }).optional())
		.query(({ ctx, input }) => ({
			resolvedPartnerId: ctx.partner.id,
			ignoredInputPartnerId: input?.partnerId ?? null,
		})),

	/** Headline metrics for the dashboard, derived from the partner's own rows. */
	dashboard: partnerProcedure.query(async ({ ctx }) => {
		const partnerId = ctx.partner.id;
		const period = toPeriodMonth(new Date());

		const activeRows = await ctx.db
			.select({ value: count() })
			.from(merchants)
			.where(
				and(
					eq(merchants.partnerId, partnerId),
					eq(merchants.status, "approved")
				)
			);
		const pendingRows = await ctx.db
			.select({ value: count() })
			.from(merchants)
			.where(
				and(eq(merchants.partnerId, partnerId), eq(merchants.status, "pending"))
			);

		const monthRows = await ctx.db
			.select({
				commission: MONEY_SUM(commissions.commissionAmount),
				revenue: MONEY_SUM(commissions.baseAmount),
			})
			.from(commissions)
			.where(
				and(
					eq(commissions.partnerId, partnerId),
					eq(commissions.periodMonth, period)
				)
			);

		const lifetimeRows = await ctx.db
			.select({ commission: MONEY_SUM(commissions.commissionAmount) })
			.from(commissions)
			.where(eq(commissions.partnerId, partnerId));

		const recent = await ctx.db
			.select({
				id: commissions.id,
				amount: commissions.commissionAmount,
				currency: commissions.currency,
				period: commissions.periodMonth,
				status: commissions.status,
				createdAt: commissions.createdAt,
				merchantName: merchants.name,
				appName: apps.name,
			})
			.from(commissions)
			.innerJoin(merchants, eq(merchants.id, commissions.merchantId))
			.innerJoin(apps, eq(apps.id, commissions.appId))
			.where(eq(commissions.partnerId, partnerId))
			.orderBy(desc(commissions.createdAt))
			.limit(8);

		return {
			status: ctx.partner.status,
			defaultRateBps: ctx.partner.defaultRateBps,
			activeMerchants: activeRows[0]?.value ?? 0,
			pendingRegistrations: pendingRows[0]?.value ?? 0,
			thisMonthCommissionMinor: monthRows[0]?.commission ?? "0",
			monthlyRevenueMinor: monthRows[0]?.revenue ?? "0",
			lifetimeEarningsMinor: lifetimeRows[0]?.commission ?? "0",
			currency: "USD",
			recentActivity: recent.map((row) => ({
				id: row.id,
				amountMinor: row.amount.toString(),
				currency: row.currency,
				period: row.period,
				status: row.status,
				merchantName: row.merchantName,
				appName: row.appName,
			})),
		};
	}),

	merchants: router({
		/** The caller's merchants with per-merchant commission/revenue totals. */
		list: partnerProcedure.query(async ({ ctx }) => {
			const partnerId = ctx.partner.id;

			const rows = await ctx.db
				.select({
					id: merchants.id,
					name: merchants.name,
					shopDomain: merchants.shopDomain,
					email: merchants.email,
					status: merchants.status,
					createdAt: merchants.createdAt,
				})
				.from(merchants)
				.where(eq(merchants.partnerId, partnerId))
				.orderBy(desc(merchants.createdAt));

			const totals = await ctx.db
				.select({
					merchantId: commissions.merchantId,
					commission: MONEY_SUM(commissions.commissionAmount),
					revenue: MONEY_SUM(commissions.baseAmount),
				})
				.from(commissions)
				.where(eq(commissions.partnerId, partnerId))
				.groupBy(commissions.merchantId);

			const byMerchant = new Map(totals.map((t) => [t.merchantId, t]));

			return rows.map((merchant) => ({
				...merchant,
				commissionMinor: byMerchant.get(merchant.id)?.commission ?? "0",
				revenueMinor: byMerchant.get(merchant.id)?.revenue ?? "0",
				currency: "USD",
			}));
		}),

		/** Registers a merchant the partner manages. New rows are `pending`. */
	}),

	/**
	 * The partner's attribution codes — what they hand to a merchant.
	 *
	 * Read-only: codes are issued by an admin, because a code carries acquisition
	 * rights and a self-serve one would let a partner mint unlimited claims.
	 */
	codes: router({
		list: partnerProcedure.query(async ({ ctx }) => {
			const partnerId = ctx.partner.id;

			const rows = await ctx.db
				.select({
					id: partnerCodes.id,
					code: partnerCodes.code,
					status: partnerCodes.status,
					maxRedemptions: partnerCodes.maxRedemptions,
					expiresAt: partnerCodes.expiresAt,
					perkUsageAllowanceUsd: partnerCodes.perkUsageAllowanceUsd,
					// The discount terms are the partner's own selling point, so
					// unlike `label` they ARE theirs to see.
					discountKind: partnerCodes.discountKind,
					discountBps: partnerCodes.discountBps,
					discountAmountMinor: partnerCodes.discountAmountMinor,
					discountCurrency: partnerCodes.discountCurrency,
					discountCycles: partnerCodes.discountCycles,
					discountGrantLimit: partnerCodes.discountGrantLimit,
					createdAt: partnerCodes.createdAt,
				})
				.from(partnerCodes)
				// Scoped to the session's partner. `label` is deliberately NOT selected:
				// it is an internal note that may name the commission rate.
				.where(eq(partnerCodes.partnerId, partnerId))
				.orderBy(desc(partnerCodes.createdAt));

			const redemptions = await ctx.db
				.select({ partnerCodeId: merchants.partnerCodeId, value: count() })
				.from(merchants)
				.where(eq(merchants.partnerId, partnerId))
				.groupBy(merchants.partnerCodeId);

			const byCode = new Map(
				redemptions.map((row) => [row.partnerCodeId, row.value])
			);

			// One allocation per partner, shared across all their codes.
			const grantRows = await ctx.db
				.select({ value: count() })
				.from(merchants)
				.where(
					and(
						eq(merchants.partnerId, partnerId),
						isNotNull(merchants.discountGrantedAt),
						ne(merchants.status, "rejected")
					)
				);
			const grantsUsed = grantRows[0]?.value ?? 0;

			return rows.map((row) => ({
				...row,
				discountAmountMinor: row.discountAmountMinor?.toString() ?? null,
				redemptions: byCode.get(row.id) ?? 0,
				grantsUsed,
			}));
		}),
	}),

	/** Earnings: monthly breakdown, lifetime totals, and payout history. */
	earnings: partnerProcedure.query(async ({ ctx }) => {
		const partnerId = ctx.partner.id;
		const period = toPeriodMonth(new Date());

		const byMonth = await ctx.db
			.select({
				period: commissions.periodMonth,
				total: MONEY_SUM(commissions.commissionAmount),
				paid: sql<string>`coalesce(sum(${commissions.commissionAmount}) filter (where ${commissions.status} = 'paid'), 0)`,
				pending: sql<string>`coalesce(sum(${commissions.commissionAmount}) filter (where ${commissions.status} = 'pending'), 0)`,
			})
			.from(commissions)
			.where(eq(commissions.partnerId, partnerId))
			.groupBy(commissions.periodMonth)
			.orderBy(desc(commissions.periodMonth));

		const lifetimeRows = await ctx.db
			.select({ total: MONEY_SUM(commissions.commissionAmount) })
			.from(commissions)
			.where(eq(commissions.partnerId, partnerId));

		const upcomingRows = await ctx.db
			.select({ total: MONEY_SUM(commissions.commissionAmount) })
			.from(commissions)
			.where(
				and(
					eq(commissions.partnerId, partnerId),
					eq(commissions.status, "pending")
				)
			);

		const payoutHistory = await ctx.db
			.select({
				id: payouts.id,
				periodMonth: payouts.periodMonth,
				amount: payouts.totalAmount,
				currency: payouts.currency,
				status: payouts.status,
				paidAt: payouts.paidAt,
				createdAt: payouts.createdAt,
			})
			.from(payouts)
			.where(eq(payouts.partnerId, partnerId))
			.orderBy(desc(payouts.createdAt));

		return {
			currency: "USD",
			currentPeriod: period,
			lifetimeMinor: lifetimeRows[0]?.total ?? "0",
			upcomingPayoutMinor: upcomingRows[0]?.total ?? "0",
			months: byMonth.map((m) => ({
				period: m.period,
				totalMinor: m.total,
				paidMinor: m.paid,
				pendingMinor: m.pending,
			})),
			payouts: payoutHistory.map((p) => ({
				id: p.id,
				periodMonth: p.periodMonth,
				amountMinor: p.amount.toString(),
				currency: p.currency,
				status: p.status,
				paidAt: p.paidAt,
				createdAt: p.createdAt,
			})),
		};
	}),

	settings: router({
		get: partnerProcedure.query(({ ctx }) => ({
			companyName: ctx.partner.companyName,
			website: ctx.partner.website,
			payoutMethod: ctx.partner.payoutMethod,
			payoutReference: ctx.partner.payoutReference,
			status: ctx.partner.status,
			defaultRateBps: ctx.partner.defaultRateBps,
		})),

		update: partnerProcedure
			.input(profileInput)
			.mutation(async ({ ctx, input }) => {
				await ctx.db
					.update(partners)
					.set({
						companyName: input.companyName ?? null,
						website: input.website ?? null,
						payoutMethod: input.payoutMethod ?? null,
						payoutReference: input.payoutReference ?? null,
					})
					.where(eq(partners.id, ctx.partner.id));
				return { ok: true };
			}),
	}),
});
