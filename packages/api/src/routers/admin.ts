import { createPartnerApiSource } from "@edgecoms/billing/partner-api";
import { runBillingSync } from "@edgecoms/billing/run-sync";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { commissions } from "@edgecoms/db/schema/earnings";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { partnerAppRates, partners } from "@edgecoms/db/schema/partners";
import { payouts } from "@edgecoms/db/schema/payouts";
import { syncState } from "@edgecoms/db/schema/sync";
import { env } from "@edgecoms/env/server";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, router } from "../index";

const MONEY_SUM = (column: typeof commissions.commissionAmount) =>
	sql<string>`coalesce(sum(${column}), 0)`;

/**
 * Admin-scoped router. Every procedure asserts the admin role via
 * `adminProcedure`. Admins operate across all partners — they are not
 * tenant-scoped. This is where the engine's inputs are set: partner rates,
 * merchant approvals, and the grandfathered sets.
 */
export const adminRouter = router({
	dashboard: adminProcedure.query(async ({ ctx }) => {
		const period = currentPeriod();

		const totalPartners = await ctx.db
			.select({ value: count() })
			.from(partners);
		const pendingPartners = await ctx.db
			.select({ value: count() })
			.from(partners)
			.where(eq(partners.status, "pending"));
		const activeMerchants = await ctx.db
			.select({ value: count() })
			.from(merchants)
			.where(eq(merchants.status, "approved"));
		const pendingMerchants = await ctx.db
			.select({ value: count() })
			.from(merchants)
			.where(eq(merchants.status, "pending"));
		const monthCommission = await ctx.db
			.select({ total: MONEY_SUM(commissions.commissionAmount) })
			.from(commissions)
			.where(eq(commissions.periodMonth, period));
		const payable = await ctx.db
			.select({ total: MONEY_SUM(commissions.commissionAmount) })
			.from(commissions)
			.where(eq(commissions.status, "pending"));

		return {
			currency: "USD",
			totalPartners: totalPartners[0]?.value ?? 0,
			pendingPartners: pendingPartners[0]?.value ?? 0,
			activeMerchants: activeMerchants[0]?.value ?? 0,
			pendingMerchants: pendingMerchants[0]?.value ?? 0,
			monthlyCommissionsMinor: monthCommission[0]?.total ?? "0",
			pendingPayoutsMinor: payable[0]?.total ?? "0",
		};
	}),

	apps: router({
		list: adminProcedure.query(({ ctx }) =>
			ctx.db
				.select({ id: apps.id, slug: apps.slug, name: apps.name })
				.from(apps)
				.orderBy(apps.name)
		),
	}),

	partners: router({
		list: adminProcedure.query(async ({ ctx }) => {
			const rows = await ctx.db
				.select({
					id: partners.id,
					companyName: partners.companyName,
					website: partners.website,
					status: partners.status,
					defaultRateBps: partners.defaultRateBps,
					createdAt: partners.createdAt,
					name: user.name,
					email: user.email,
				})
				.from(partners)
				.innerJoin(user, eq(user.id, partners.userId))
				.orderBy(desc(partners.createdAt));

			const merchantCounts = await ctx.db
				.select({ partnerId: merchants.partnerId, value: count() })
				.from(merchants)
				.groupBy(merchants.partnerId);
			const countByPartner = new Map(
				merchantCounts.map((row) => [row.partnerId, row.value])
			);

			return rows.map((row) => ({
				...row,
				merchantCount: countByPartner.get(row.id) ?? 0,
			}));
		}),

		/** Approve a partner: set status + default rate + optional per-app rates. */
		approve: adminProcedure
			.input(
				z.object({
					partnerId: z.string(),
					defaultRateBps: z.number().int().min(0).max(10_000),
					appRates: z
						.array(
							z.object({
								appId: z.string(),
								rateBps: z.number().int().min(0).max(10_000),
							})
						)
						.optional(),
				})
			)
			.mutation(async ({ ctx, input }) => {
				await ctx.db.transaction(async (tx) => {
					await tx
						.update(partners)
						.set({
							status: "approved",
							defaultRateBps: input.defaultRateBps,
							approvedAt: new Date(),
							approvedBy: ctx.session.user.id,
						})
						.where(eq(partners.id, input.partnerId));

					for (const rate of input.appRates ?? []) {
						await tx
							.insert(partnerAppRates)
							.values({
								partnerId: input.partnerId,
								appId: rate.appId,
								rateBps: rate.rateBps,
							})
							.onConflictDoUpdate({
								target: [partnerAppRates.partnerId, partnerAppRates.appId],
								set: { rateBps: rate.rateBps },
							});
					}
				});
				return { ok: true };
			}),

		setStatus: adminProcedure
			.input(
				z.object({
					partnerId: z.string(),
					status: z.enum(["approved", "suspended"]),
				})
			)
			.mutation(async ({ ctx, input }) => {
				await ctx.db
					.update(partners)
					.set({ status: input.status })
					.where(eq(partners.id, input.partnerId));
				return { ok: true };
			}),
	}),

	merchants: router({
		list: adminProcedure.query(({ ctx }) =>
			ctx.db
				.select({
					id: merchants.id,
					name: merchants.name,
					shopDomain: merchants.shopDomain,
					email: merchants.email,
					notes: merchants.notes,
					status: merchants.status,
					createdAt: merchants.createdAt,
					partnerCompany: partners.companyName,
					partnerName: user.name,
				})
				.from(merchants)
				.innerJoin(partners, eq(partners.id, merchants.partnerId))
				.innerJoin(user, eq(user.id, partners.userId))
				.orderBy(desc(merchants.createdAt))
		),

		/**
		 * Approve a merchant AND capture its grandfathered apps in one transaction.
		 * Grandfathered apps (those the store already paid for at approval) NEVER
		 * earn — captured once, here (CLAUDE.md "Eligibility"). The set may be empty
		 * but the choice is explicit.
		 */
		approve: adminProcedure
			.input(
				z.object({
					merchantId: z.string(),
					grandfatheredAppIds: z.array(z.string()),
				})
			)
			.mutation(async ({ ctx, input }) => {
				await ctx.db.transaction(async (tx) => {
					await tx
						.update(merchants)
						.set({
							status: "approved",
							approvedAt: new Date(),
							approvedBy: ctx.session.user.id,
						})
						.where(eq(merchants.id, input.merchantId));

					for (const appId of input.grandfatheredAppIds) {
						await tx
							.insert(merchantGrandfatheredApps)
							.values({ merchantId: input.merchantId, appId })
							.onConflictDoNothing({
								target: [
									merchantGrandfatheredApps.merchantId,
									merchantGrandfatheredApps.appId,
								],
							});
					}
				});
				return { ok: true };
			}),

		reject: adminProcedure
			.input(z.object({ merchantId: z.string() }))
			.mutation(async ({ ctx, input }) => {
				await ctx.db
					.update(merchants)
					.set({ status: "rejected" })
					.where(eq(merchants.id, input.merchantId));
				return { ok: true };
			}),
	}),

	commissions: router({
		list: adminProcedure
			.input(
				z
					.object({ status: z.enum(["pending", "paid", "void"]).optional() })
					.optional()
			)
			.query(async ({ ctx, input }) => {
				const where = input?.status
					? eq(commissions.status, input.status)
					: undefined;
				const rows = await ctx.db
					.select({
						id: commissions.id,
						amount: commissions.commissionAmount,
						currency: commissions.currency,
						rateBps: commissions.rateBps,
						period: commissions.periodMonth,
						status: commissions.status,
						createdAt: commissions.createdAt,
						partnerCompany: partners.companyName,
						partnerName: user.name,
						merchantName: merchants.name,
						appName: apps.name,
					})
					.from(commissions)
					.innerJoin(partners, eq(partners.id, commissions.partnerId))
					.innerJoin(user, eq(user.id, partners.userId))
					.innerJoin(merchants, eq(merchants.id, commissions.merchantId))
					.innerJoin(apps, eq(apps.id, commissions.appId))
					.where(where)
					.orderBy(desc(commissions.createdAt))
					.limit(200);

				return rows.map((row) => ({
					id: row.id,
					amountMinor: row.amount.toString(),
					currency: row.currency,
					rateBps: row.rateBps,
					period: row.period,
					status: row.status,
					partner: row.partnerCompany ?? row.partnerName,
					merchantName: row.merchantName,
					appName: row.appName,
				}));
			}),

		/** Mark a single commission paid. The money figures stay immutable. */
		markPaid: adminProcedure
			.input(z.object({ commissionId: z.string() }))
			.mutation(async ({ ctx, input }) => {
				await ctx.db
					.update(commissions)
					.set({ status: "paid", paidAt: new Date() })
					.where(eq(commissions.id, input.commissionId));
				return { ok: true };
			}),
	}),

	payouts: router({
		/** Payable commission groups (partner + period + currency) not yet paid. */
		groupable: adminProcedure.query(async ({ ctx }) => {
			const rows = await ctx.db
				.select({
					partnerId: commissions.partnerId,
					periodMonth: commissions.periodMonth,
					currency: commissions.currency,
					total: MONEY_SUM(commissions.commissionAmount),
					items: count(),
					partnerCompany: partners.companyName,
					partnerName: user.name,
				})
				.from(commissions)
				.innerJoin(partners, eq(partners.id, commissions.partnerId))
				.innerJoin(user, eq(user.id, partners.userId))
				.where(eq(commissions.status, "pending"))
				.groupBy(
					commissions.partnerId,
					commissions.periodMonth,
					commissions.currency,
					partners.companyName,
					user.name
				)
				.orderBy(desc(commissions.periodMonth));

			return rows.map((row) => ({
				partnerId: row.partnerId,
				periodMonth: row.periodMonth,
				currency: row.currency,
				totalMinor: row.total,
				items: row.items,
				partner: row.partnerCompany ?? row.partnerName,
			}));
		}),

		list: adminProcedure.query(async ({ ctx }) => {
			const rows = await ctx.db
				.select({
					id: payouts.id,
					periodMonth: payouts.periodMonth,
					amount: payouts.totalAmount,
					currency: payouts.currency,
					status: payouts.status,
					paidAt: payouts.paidAt,
					createdAt: payouts.createdAt,
					partnerCompany: partners.companyName,
					partnerName: user.name,
				})
				.from(payouts)
				.innerJoin(partners, eq(partners.id, payouts.partnerId))
				.innerJoin(user, eq(user.id, partners.userId))
				.orderBy(desc(payouts.createdAt));

			return rows.map((row) => ({
				id: row.id,
				periodMonth: row.periodMonth,
				amountMinor: row.amount.toString(),
				currency: row.currency,
				status: row.status,
				partner: row.partnerCompany ?? row.partnerName,
			}));
		}),

		/**
		 * Group a partner/period/currency's pending commissions into a single
		 * paid payout. Atomic: create the payout, then mark exactly those
		 * commissions paid and link them. The per-row amounts stay immutable.
		 */
		pay: adminProcedure
			.input(
				z.object({
					partnerId: z.string(),
					periodMonth: z.string(),
					currency: z.string().length(3),
				})
			)
			.mutation(
				async ({ ctx, input }) =>
					await ctx.db.transaction(async (tx) => {
						const groupWhere = and(
							eq(commissions.partnerId, input.partnerId),
							eq(commissions.periodMonth, input.periodMonth),
							eq(commissions.currency, input.currency),
							eq(commissions.status, "pending")
						);

						const totals = await tx
							.select({
								total: MONEY_SUM(commissions.commissionAmount),
								items: count(),
							})
							.from(commissions)
							.where(groupWhere);

						const total = totals[0]?.total ?? "0";
						const items = totals[0]?.items ?? 0;
						if (items === 0) {
							throw new TRPCError({
								code: "PRECONDITION_FAILED",
								message: "No payable commissions for this group.",
							});
						}

						const inserted = await tx
							.insert(payouts)
							.values({
								partnerId: input.partnerId,
								periodMonth: input.periodMonth,
								totalAmount: BigInt(total),
								currency: input.currency,
								status: "paid",
								paidAt: new Date(),
							})
							.returning({ id: payouts.id });

						const payoutId = inserted[0]?.id;
						if (!payoutId) {
							throw new TRPCError({
								code: "INTERNAL_SERVER_ERROR",
								message: "Failed to create payout",
							});
						}

						await tx
							.update(commissions)
							.set({ status: "paid", paidAt: new Date(), payoutId })
							.where(groupWhere);

						return { payoutId, totalMinor: total, items };
					})
			),
	}),

	/** Ops view of the billing-sync checkpoint: last run, last error, cursor. */
	syncState: adminProcedure.query(({ ctx }) =>
		ctx.db.select().from(syncState).orderBy(syncState.id)
	),

	/**
	 * Run a billing sync on demand — the exact same `runBillingSync` the worker
	 * cron calls. Requires Partner API credentials.
	 */
	runSync: adminProcedure.mutation(async ({ ctx }) => {
		if (!(env.PARTNER_API_ORGANIZATION_ID && env.PARTNER_API_ACCESS_TOKEN)) {
			throw new TRPCError({
				code: "PRECONDITION_FAILED",
				message: "Partner API credentials are not configured",
			});
		}

		const source = createPartnerApiSource({
			organizationId: env.PARTNER_API_ORGANIZATION_ID,
			accessToken: env.PARTNER_API_ACCESS_TOKEN,
			apiVersion: env.PARTNER_API_VERSION,
		});

		const summary = await runBillingSync({ db: ctx.db, source });
		return {
			startedAt: summary.startedAt,
			finishedAt: summary.finishedAt,
			reconcile: summary.reconcile,
			commissions: summary.commissions,
		};
	}),

	/** Cheap authenticated-admin probe used by the authorization tests. */
	ping: adminProcedure.query(() => "admin-ok" as const),
});

function currentPeriod(): string {
	const now = new Date();
	const year = now.getUTCFullYear();
	const month = String(now.getUTCMonth() + 1).padStart(2, "0");
	return `${year}-${month}`;
}
