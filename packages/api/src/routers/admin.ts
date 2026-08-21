import { createPartnerApiSource } from "@edgecoms/billing/partner-api";
import { runBillingSync } from "@edgecoms/billing/run-sync";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import { commissions } from "@edgecoms/db/schema/earnings";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import {
	partnerAppRates,
	partnerCodes,
	partners,
} from "@edgecoms/db/schema/partners";
import { payouts } from "@edgecoms/db/schema/payouts";
import { syncState } from "@edgecoms/db/schema/sync";
import { env } from "@edgecoms/env/server";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, inArray, notInArray, sql } from "drizzle-orm";
import { z } from "zod";
import { normalizeCode } from "../attribution/codes";
import { adminProcedure, router } from "../index";

const MONEY_SUM = (column: typeof commissions.commissionAmount) =>
	sql<string>`coalesce(sum(${column}), 0)`;

/**
 * What a merchant-facing code may contain, AFTER normalization: letters, digits
 * and hyphens, 4–32 characters. Long enough not to be guessable by accident,
 * short enough that a merchant can retype it from an email.
 *
 * Digits are allowed because plenty of legitimate agency names contain them. The
 * thing to avoid — a code that encodes the commission rate, like `ALEX30` — is a
 * naming judgement, not something a regex can catch, so the guidance lives in
 * the admin UI and the rate is only ever read from the partner row.
 */
const CODE_PATTERN = /^[A-Z0-9-]{4,32}$/;

const codeTermsInput = {
	label: z.string().max(120).optional(),
	maxRedemptions: z.number().int().positive().max(100_000).nullish(),
	expiresAt: z.iso.datetime().nullish(),
	perkUsageAllowanceUsd: z
		.number()
		.int()
		.nonnegative()
		.max(10_000_000)
		.nullish(),
};

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
		list: adminProcedure.query(async ({ ctx }) => {
			const rows = await ctx.db
				.select({
					id: merchants.id,
					name: merchants.name,
					shopDomain: merchants.shopDomain,
					email: merchants.email,
					notes: merchants.notes,
					status: merchants.status,
					source: merchants.source,
					sourceCode: merchants.sourceCode,
					createdAt: merchants.createdAt,
					partnerCompany: partners.companyName,
					partnerName: user.name,
				})
				.from(merchants)
				.innerJoin(partners, eq(partners.id, merchants.partnerId))
				.innerJoin(user, eq(user.id, partners.userId))
				.orderBy(desc(merchants.createdAt));

			if (rows.length === 0) {
				return [];
			}

			// The grandfathered set already proposed for each merchant — for a
			// code-bound store this is what the APP reported it was already paying
			// for. The approval dialog pre-checks these so the admin confirms real
			// data instead of reconstructing it from memory.
			const proposed = await ctx.db
				.select({
					merchantId: merchantGrandfatheredApps.merchantId,
					appId: merchantGrandfatheredApps.appId,
				})
				.from(merchantGrandfatheredApps)
				.where(
					inArray(
						merchantGrandfatheredApps.merchantId,
						rows.map((row) => row.id)
					)
				);

			const byMerchant = new Map<string, string[]>();
			for (const row of proposed) {
				const existing = byMerchant.get(row.merchantId);
				if (existing) {
					existing.push(row.appId);
				} else {
					byMerchant.set(row.merchantId, [row.appId]);
				}
			}

			return rows.map((row) => ({
				...row,
				grandfatheredAppIds: byMerchant.get(row.id) ?? [],
			}));
		}),

		/**
		 * Approve a merchant AND freeze its grandfathered apps in one transaction.
		 * Grandfathered apps (those the store already paid for) NEVER earn — see
		 * CLAUDE.md "Eligibility". The set may be empty but the choice is explicit.
		 *
		 * The submitted list REPLACES whatever was proposed at bind time. That
		 * matters now that a code-bound merchant arrives with a pre-filled set: an
		 * admin who unchecks an app the app over-reported must actually remove it,
		 * not merely fail to re-add it. This is the last point at which the set can
		 * change — after approval it is frozen, because widening it later would
		 * retroactively delete commission the partner was already told they earned.
		 */
		approve: adminProcedure
			.input(
				z.object({
					merchantId: z.string(),
					grandfatheredAppIds: z.array(z.string()),
				})
			)
			.mutation(async ({ ctx, input }) => {
				const keep = [...new Set(input.grandfatheredAppIds)];

				await ctx.db.transaction(async (tx) => {
					await tx
						.update(merchants)
						.set({
							status: "approved",
							approvedAt: new Date(),
							approvedBy: ctx.session.user.id,
						})
						.where(eq(merchants.id, input.merchantId));

					// Drop anything the admin unchecked. `notInArray` against an empty
					// list is not valid SQL, so an empty selection clears the set with a
					// plain delete instead.
					const stale =
						keep.length > 0
							? and(
									eq(merchantGrandfatheredApps.merchantId, input.merchantId),
									notInArray(merchantGrandfatheredApps.appId, keep)
								)
							: eq(merchantGrandfatheredApps.merchantId, input.merchantId);
					await tx.delete(merchantGrandfatheredApps).where(stale);

					for (const appId of keep) {
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

	/**
	 * Attribution codes. An admin issues a code to a partner; the partner hands it
	 * to a merchant, who pastes it into an Edge app. See
	 * docs/partner-attribution-codes.md.
	 */
	codes: router({
		list: adminProcedure.query(async ({ ctx }) => {
			const rows = await ctx.db
				.select({
					id: partnerCodes.id,
					code: partnerCodes.code,
					label: partnerCodes.label,
					status: partnerCodes.status,
					maxRedemptions: partnerCodes.maxRedemptions,
					expiresAt: partnerCodes.expiresAt,
					perkUsageAllowanceUsd: partnerCodes.perkUsageAllowanceUsd,
					createdAt: partnerCodes.createdAt,
					partnerId: partners.id,
					partnerStatus: partners.status,
					partnerCompany: partners.companyName,
					partnerName: user.name,
				})
				.from(partnerCodes)
				.innerJoin(partners, eq(partners.id, partnerCodes.partnerId))
				.innerJoin(user, eq(user.id, partners.userId))
				.orderBy(desc(partnerCodes.createdAt));

			// Redemptions are counted from merchant rows rather than stored, so the
			// number can never disagree with the stores it refers to.
			const redemptions = await ctx.db
				.select({
					partnerCodeId: merchants.partnerCodeId,
					value: count(),
				})
				.from(merchants)
				.groupBy(merchants.partnerCodeId);

			const byCode = new Map(
				redemptions.map((row) => [row.partnerCodeId, row.value])
			);

			return rows.map((row) => ({
				...row,
				redemptions: byCode.get(row.id) ?? 0,
			}));
		}),

		create: adminProcedure
			.input(
				z.object({
					partnerId: z.string(),
					code: z.string().min(4).max(32),
					...codeTermsInput,
				})
			)
			.mutation(async ({ ctx, input }) => {
				const code = normalizeCode(input.code);
				if (!CODE_PATTERN.test(code)) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message:
							"Use 4–32 letters, digits or hyphens. Keep the commission rate out of the code.",
					});
				}

				const inserted = await ctx.db
					.insert(partnerCodes)
					.values({
						partnerId: input.partnerId,
						code,
						label: input.label?.trim() || null,
						maxRedemptions: input.maxRedemptions ?? null,
						expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
						perkUsageAllowanceUsd: input.perkUsageAllowanceUsd ?? null,
					})
					.onConflictDoNothing({ target: partnerCodes.code })
					.returning({ id: partnerCodes.id });

				const row = inserted[0];
				if (!row) {
					// The global unique on `code` is the rule: a code addresses exactly
					// one partner, or attribution is ambiguous.
					throw new TRPCError({
						code: "CONFLICT",
						message: "That code is already in use.",
					});
				}
				return { id: row.id, code };
			}),

		/**
		 * Change a code's terms.
		 *
		 * `partnerId` and `code` are deliberately NOT updatable. Repointing a live
		 * code at another partner would silently reassign every store that redeems
		 * it afterwards while leaving the ones already bound behind — two different
		 * meanings for one string. Issue a new code instead.
		 *
		 * Disabling stops NEW redemptions only; stores already referred stay with
		 * the partner (enforced by the `restrict` FK from `merchants`).
		 */
		update: adminProcedure
			.input(
				z.object({
					codeId: z.string(),
					status: z.enum(["active", "disabled"]).optional(),
					...codeTermsInput,
				})
			)
			.mutation(async ({ ctx, input }) => {
				const updated = await ctx.db
					.update(partnerCodes)
					.set({
						...(input.status ? { status: input.status } : {}),
						...(input.label === undefined
							? {}
							: { label: input.label.trim() || null }),
						...(input.maxRedemptions === undefined
							? {}
							: { maxRedemptions: input.maxRedemptions ?? null }),
						...(input.expiresAt === undefined
							? {}
							: {
									expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
								}),
						...(input.perkUsageAllowanceUsd === undefined
							? {}
							: { perkUsageAllowanceUsd: input.perkUsageAllowanceUsd ?? null }),
					})
					.where(eq(partnerCodes.id, input.codeId))
					.returning({ id: partnerCodes.id });

				if (!updated[0]) {
					throw new TRPCError({ code: "NOT_FOUND", message: "Unknown code." });
				}
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
