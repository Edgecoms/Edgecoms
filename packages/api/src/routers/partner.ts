import { toPeriodMonth } from "@edgecoms/billing/commissions";
import { apps } from "@edgecoms/db/schema/apps";
import { merchantEvents } from "@edgecoms/db/schema/attribution";
import { commissions } from "@edgecoms/db/schema/earnings";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { partnerCodes, partners } from "@edgecoms/db/schema/partners";
import { payouts } from "@edgecoms/db/schema/payouts";
import { and, count, desc, eq, inArray, isNotNull, ne, sql } from "drizzle-orm";
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

	/**
	 * FIRST-RUN STATE for the welcome screen.
	 *
	 * Four facts, in the order a partner actually reaches them, each answerable
	 * by one count. The screen uses them to show what is done and what is next;
	 * it is deliberately not stored as a "progress" column, because every step
	 * is already recorded somewhere truer: a code row, a payout field, a
	 * merchant row, a commission row. A stored flag could disagree with them.
	 */
	onboarding: partnerProcedure.query(async ({ ctx }) => {
		const partnerId = ctx.partner.id;

		const codeRows = await ctx.db
			.select({ code: partnerCodes.code })
			.from(partnerCodes)
			.where(
				and(
					eq(partnerCodes.partnerId, partnerId),
					eq(partnerCodes.status, "active")
				)
			)
			.orderBy(desc(partnerCodes.createdAt))
			.limit(1);

		const merchantRows = await ctx.db
			.select({ value: count() })
			.from(merchants)
			.where(eq(merchants.partnerId, partnerId));

		const commissionRows = await ctx.db
			.select({ value: count() })
			.from(commissions)
			.where(eq(commissions.partnerId, partnerId));

		const code = codeRows[0]?.code ?? null;
		const payoutReady = Boolean(
			ctx.partner.payoutMethod?.trim() && ctx.partner.payoutReference?.trim()
		);

		return {
			code,
			defaultRateBps: ctx.partner.defaultRateBps,
			status: ctx.partner.status,
			steps: {
				codeIssued: code !== null,
				firstCommission: (commissionRows[0]?.value ?? 0) > 0,
				firstStore: (merchantRows[0]?.value ?? 0) > 0,
				payoutReady,
			},
		};
	}),

	/**
	 * THE APP CATALOG, as it stands on this partner's own stores.
	 *
	 * Answers the two questions a partner actually has about the suite: which of
	 * these is already running on a store I manage, and which one should I put
	 * on the next one. Everything here is derived from rows that exist:
	 *
	 *   • `live`  -- the newest `merchant_events` row for that (store, app) is an
	 *                activation or a plan change rather than an uninstall. The
	 *                apps report these themselves, so this is the truest signal
	 *                of what is running right now.
	 *   • `earning` -- commission rows exist for that (store, app) pair. Live and
	 *                earning are NOT the same thing, which is the whole point of
	 *                the next field.
	 *   • `grandfathered` -- the store was already paying for this app when the
	 *                partner acquired it, so it never earns. A partner seeing
	 *                "installed on 3, earning on 2" deserves to know why, and
	 *                this is the honest answer rather than a silent gap.
	 *
	 * No copy lives here. Names, descriptions and icons come from the marketing
	 * catalog keyed by `slug`, so the portal cannot describe an app differently
	 * from the public site.
	 */
	apps: partnerProcedure.query(async ({ ctx }) => {
		const partnerId = ctx.partner.id;

		const catalog = await ctx.db
			.select({
				id: apps.id,
				slug: apps.slug,
				name: apps.name,
				setupVideoUrl: apps.setupVideoUrl,
			})
			.from(apps)
			.orderBy(apps.name);

		const myMerchants = await ctx.db
			.select({
				id: merchants.id,
				name: merchants.name,
				shopDomain: merchants.shopDomain,
				status: merchants.status,
			})
			.from(merchants)
			.where(eq(merchants.partnerId, partnerId));

		/* No stores yet: every app is an opportunity and nothing is installed.
		   Returning early keeps the `inArray` calls below off an empty list,
		   which Postgres accepts but which reads as a bug waiting to happen. */
		if (myMerchants.length === 0) {
			return {
				apps: catalog.map((app) => ({
					...app,
					earningStores: 0,
					grandfatheredStores: 0,
					liveStores: 0,
				})),
				catalogSize: catalog.length,
				stores: [],
				storeCount: 0,
			};
		}

		const merchantIds = myMerchants.map((row) => row.id);

		/* Oldest first, so the last write per (store, app) wins the reduce. */
		const events = await ctx.db
			.select({
				appId: merchantEvents.appId,
				merchantId: merchantEvents.merchantId,
				occurredAt: merchantEvents.occurredAt,
				type: merchantEvents.type,
			})
			.from(merchantEvents)
			.where(inArray(merchantEvents.merchantId, merchantIds))
			.orderBy(merchantEvents.occurredAt);

		const latestByPair = new Map<string, string>();
		for (const event of events) {
			if (event.appId && event.merchantId) {
				latestByPair.set(`${event.merchantId}:${event.appId}`, event.type);
			}
		}

		const grandfathered = await ctx.db
			.select({
				appId: merchantGrandfatheredApps.appId,
				merchantId: merchantGrandfatheredApps.merchantId,
			})
			.from(merchantGrandfatheredApps)
			.where(inArray(merchantGrandfatheredApps.merchantId, merchantIds));
		const grandfatheredPairs = new Set(
			grandfathered.map((row) => `${row.merchantId}:${row.appId}`)
		);

		const earning = await ctx.db
			.selectDistinct({
				appId: commissions.appId,
				merchantId: commissions.merchantId,
			})
			.from(commissions)
			.where(eq(commissions.partnerId, partnerId));
		const earningPairs = new Set(
			earning.map((row) => `${row.merchantId}:${row.appId}`)
		);

		return {
			apps: catalog.map((app) => {
				let liveStores = 0;
				let earningStores = 0;
				let grandfatheredStores = 0;

				for (const merchant of myMerchants) {
					const pair = `${merchant.id}:${app.id}`;
					const latest = latestByPair.get(pair);
					if (latest && latest !== "uninstalled") {
						liveStores += 1;
					}
					if (earningPairs.has(pair)) {
						earningStores += 1;
					}
					if (grandfatheredPairs.has(pair)) {
						grandfatheredStores += 1;
					}
				}

				return {
					...app,
					earningStores,
					grandfatheredStores,
					liveStores,
				};
			}),
			catalogSize: catalog.length,
			/**
			 * COVERAGE, per store.
			 *
			 * The same three maps read the other way round. It is here rather than
			 * in its own query because the expensive part -- the events, the
			 * grandfathered set and the earning pairs -- is already loaded, and
			 * because the two views must never disagree about one pair.
			 *
			 * `missing` is the point of the whole thing: getting another app onto
			 * a store the partner already holds needs no new relationship and
			 * earns at the same rate, so it is the cheapest move available to
			 * them and the one worth naming.
			 */
			stores: myMerchants.map((merchant) => {
				const live: string[] = [];
				const earning: string[] = [];
				const grandfatheredOnStore: string[] = [];
				const missing: { name: string; slug: string }[] = [];

				for (const app of catalog) {
					const pair = `${merchant.id}:${app.id}`;
					const latest = latestByPair.get(pair);
					const isLive = Boolean(latest && latest !== "uninstalled");

					if (isLive) {
						live.push(app.slug);
					} else {
						missing.push({ name: app.name, slug: app.slug });
					}
					if (earningPairs.has(pair)) {
						earning.push(app.slug);
					}
					if (grandfatheredPairs.has(pair)) {
						grandfatheredOnStore.push(app.slug);
					}
				}

				return {
					earningApps: earning.length,
					grandfatheredApps: grandfatheredOnStore.length,
					id: merchant.id,
					liveApps: live.length,
					missing,
					name: merchant.name,
					shopDomain: merchant.shopDomain,
					status: merchant.status,
				};
			}),
			storeCount: myMerchants.length,
		};
	}),

	/**
	 * MILESTONES -- the ladder, measured against rows that exist.
	 *
	 * Every rung is a count or a sum the partner can verify on another screen,
	 * so nothing here can congratulate somebody for something that did not
	 * happen. A milestone is `reached` or it is not; there is no partial credit
	 * and no projection.
	 *
	 * The money rung is compared as a BIGINT in minor units on the server, and
	 * the client is handed the integer plus its currency to format. Deciding
	 * "have they earned a hundred" by parsing a formatted string is exactly the
	 * float-touches-money path CLAUDE.md forbids.
	 *
	 * Multi-currency is handled by picking the partner's largest single-currency
	 * lifetime total and measuring that, rather than adding currencies together.
	 * A partner earning in USD and EUR gets a truthful USD rung instead of a
	 * meaningless sum labelled USD.
	 */
	milestones: partnerProcedure.query(async ({ ctx }) => {
		const partnerId = ctx.partner.id;

		const storeRows = await ctx.db
			.select({ value: count() })
			.from(merchants)
			.where(eq(merchants.partnerId, partnerId));
		const storeCount = storeRows[0]?.value ?? 0;

		const commissionRows = await ctx.db
			.select({ value: count() })
			.from(commissions)
			.where(eq(commissions.partnerId, partnerId));
		const commissionCount = commissionRows[0]?.value ?? 0;

		/* Grouped, never summed across currencies. */
		const byCurrency = await ctx.db
			.select({
				currency: commissions.currency,
				total: MONEY_SUM(commissions.commissionAmount),
			})
			.from(commissions)
			.where(eq(commissions.partnerId, partnerId))
			.groupBy(commissions.currency);

		let bestCurrency = "USD";
		let bestTotal = 0n;
		for (const row of byCurrency) {
			const total = BigInt(row.total);
			if (total > bestTotal) {
				bestTotal = total;
				bestCurrency = row.currency;
			}
		}

		const earningPairs = await ctx.db
			.selectDistinct({
				appId: commissions.appId,
				merchantId: commissions.merchantId,
			})
			.from(commissions)
			.where(eq(commissions.partnerId, partnerId));

		const appsPerStore = new Map<string, Set<string>>();
		const appsAnywhere = new Set<string>();
		for (const pair of earningPairs) {
			appsAnywhere.add(pair.appId);
			const forStore = appsPerStore.get(pair.merchantId) ?? new Set<string>();
			forStore.add(pair.appId);
			appsPerStore.set(pair.merchantId, forStore);
		}
		const deepestStore = Math.max(
			0,
			...[...appsPerStore.values()].map((set) => set.size)
		);

		const catalogRows = await ctx.db.select({ value: count() }).from(apps);
		const catalogSize = catalogRows[0]?.value ?? 0;

		/** 10,000 minor units: $100.00, and rendered in its own currency. */
		const MONEY_TARGET = 10_000n;

		return {
			currency: bestCurrency,
			milestones: [
				{
					current: storeCount,
					key: "first_store",
					label: "First store on your code",
					reached: storeCount >= 1,
					target: 1,
				},
				{
					current: commissionCount,
					key: "first_commission",
					label: "First commission earned",
					reached: commissionCount >= 1,
					target: 1,
				},
				{
					currentMinor: bestTotal.toString(),
					key: "money",
					/* A fallback only: the client composes this label from
					   `targetMinor` and the currency, because the same integer
					   means different money in different currencies. */
					label: "Your first hundred earned",
					reached: bestTotal >= MONEY_TARGET,
					targetMinor: MONEY_TARGET.toString(),
				},
				{
					current: deepestStore,
					key: "three_apps",
					label: "Three Edge apps earning on one store",
					reached: deepestStore >= 3,
					target: 3,
				},
				{
					current: storeCount,
					key: "five_stores",
					label: "Five stores on your code",
					reached: storeCount >= 5,
					target: 5,
				},
				{
					current: appsAnywhere.size,
					key: "whole_suite",
					label: "Every Edge app earning somewhere",
					reached: catalogSize > 0 && appsAnywhere.size >= catalogSize,
					target: catalogSize,
				},
			],
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
