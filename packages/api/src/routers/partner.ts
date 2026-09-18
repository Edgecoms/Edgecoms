import { toPeriodMonth } from "@edgecoms/billing/commissions";
import { evaluatePartnerMilestones } from "@edgecoms/billing/milestones";
import { apps } from "@edgecoms/db/schema/apps";
import { merchantEvents } from "@edgecoms/db/schema/attribution";
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
import { partnerBonuses, payouts } from "@edgecoms/db/schema/payouts";
import { and, count, desc, eq, inArray, isNotNull, ne, sql } from "drizzle-orm";
import { z } from "zod";
import { partnerProcedure, router } from "../index";
import {
	payoutBlocker,
	payoutDetailsInput,
	payoutDetailsPatch,
} from "../payout-details";
import { partnerLinksRouter } from "./referrals";

const MONEY_SUM = (column: typeof commissions.commissionAmount) =>
	sql<string>`coalesce(sum(${column}), 0)`;

const profileInput = z.object({
	companyName: z.string().max(200).optional(),
	website: z.string().max(300).optional(),
});

/**
 * Partner-scoped router. `partnerProcedure` resolves `ctx.partner` from the
 * session; EVERY query below filters by `ctx.partner.id`. No procedure accepts
 * a partner id from input — the tenant-isolation wall (CLAUDE.md).
 */
/**
 * A money total, per currency.
 *
 * Every partner-facing total is a LIST, not a scalar. A partner may earn in
 * more than one currency, and the two wrong answers are both worse than a
 * list: summing them produces a number that means nothing, and showing only
 * the largest hides money the partner is owed. Sorted largest first, so a
 * caller that wants one headline figure can take the first entry and show the
 * rest beside it.
 */
export interface MoneyByCurrency {
	amountMinor: string;
	currency: string;
}

/** Rows of `{currency, total}` into a sorted list. */
function toMoneyList(
	rows: readonly { currency: string; total: string }[]
): MoneyByCurrency[] {
	return rows
		.map((row) => ({ amountMinor: row.total, currency: row.currency }))
		.filter((entry) => BigInt(entry.amountMinor) !== 0n)
		.sort((a, b) => (BigInt(b.amountMinor) > BigInt(a.amountMinor) ? 1 : -1));
}

/**
 * What currency to label a zero in.
 *
 * A partner with no commissions has no currency of their own yet, and a total
 * has to be labelled something. The programme's own currency is the honest
 * default: it is what milestone bonuses pay in, so it is the first money most
 * partners will see.
 */
const ZERO_CURRENCY = "USD";

export const partnerRouter = router({
	/** The partner's own referral links. See ./referrals.ts. */
	links: partnerLinksRouter,

	/**
	 * Who the caller is, PROJECTED rather than returned wholesale.
	 *
	 * This used to return `ctx.partner`, which is the entire row: `notes` and
	 * `approvedBy` included. `partners.notes` has no writer anywhere in the
	 * codebase and exists for exactly one thing, an admin's private note about a
	 * partner, so the first admin screen to use it would have shipped straight
	 * to the partner it was written about. `approvedBy` names the admin who
	 * approved them, which is ours and not theirs.
	 *
	 * Payout account details are deliberately absent too. A partner reads and
	 * writes those through `settings`, and an account number is not something to
	 * scatter across responses that do not need it.
	 */
	me: partnerProcedure.query(({ ctx }) => ({
		approvedAt: ctx.partner.approvedAt,
		companyName: ctx.partner.companyName,
		defaultRateBps: ctx.partner.defaultRateBps,
		id: ctx.partner.id,
		status: ctx.partner.status,
		userId: ctx.partner.userId,
		website: ctx.partner.website,
	})),

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

		/* Grouped by currency. Summing across them would produce a figure that
		   is not money in any currency. */
		const monthRows = await ctx.db
			.select({
				currency: commissions.currency,
				commission: MONEY_SUM(commissions.commissionAmount),
				revenue: MONEY_SUM(commissions.baseAmount),
			})
			.from(commissions)
			.where(
				and(
					eq(commissions.partnerId, partnerId),
					eq(commissions.periodMonth, period)
				)
			)
			.groupBy(commissions.currency);

		const lifetimeRows = await ctx.db
			.select({
				currency: commissions.currency,
				commission: MONEY_SUM(commissions.commissionAmount),
			})
			.from(commissions)
			.where(eq(commissions.partnerId, partnerId))
			.groupBy(commissions.currency);

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
			thisMonthCommission: toMoneyList(
				monthRows.map((row) => ({
					currency: row.currency,
					total: row.commission,
				}))
			),
			thisMonthRevenue: toMoneyList(
				monthRows.map((row) => ({ currency: row.currency, total: row.revenue }))
			),
			lifetimeCommission: toMoneyList(
				lifetimeRows.map((row) => ({
					currency: row.currency,
					total: row.commission,
				}))
			),
			/* What to label a zero with when they have earned nothing yet. */
			zeroCurrency: ZERO_CURRENCY,
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
		/* The same check the payout run makes, so the checklist cannot say ready
		   while a run would refuse them. */
		const payoutReady = payoutBlocker(ctx.partner) === null;

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

		/**
		 * The catalogue with THIS partner's effective rate on each app.
		 *
		 * `partner_app_rates` silently beats the default at generation time
		 * (commissions.ts), and nothing partner-facing read that table: three
		 * screens quoted the default as the rate for every app, so a partner
		 * with a 5% override on Edge Reviews was told 20% and then paid 5%.
		 * Resolved the same way the engine resolves it, so the number a partner
		 * reads is the number they will be paid.
		 */
		const catalog = await ctx.db
			.select({
				id: apps.id,
				slug: apps.slug,
				name: apps.name,
				setupVideoUrl: apps.setupVideoUrl,
				overrideRateBps: partnerAppRates.rateBps,
			})
			.from(apps)
			.leftJoin(
				partnerAppRates,
				and(
					eq(partnerAppRates.appId, apps.id),
					eq(partnerAppRates.partnerId, partnerId)
				)
			)
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
				apps: catalog.map(({ overrideRateBps, ...app }) => ({
					...app,
					earningStores: 0,
					grandfatheredStores: 0,
					liveStores: 0,
					rateBps: overrideRateBps ?? ctx.partner.defaultRateBps,
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

		/**
		 * COMPOUNDING, the raw material.
		 *
		 * Grouped by currency as well as month so a store's running total is
		 * never a sum of two currencies wearing one label -- the same rule the
		 * milestone ladder follows.
		 */
		const byStoreMonth = await ctx.db
			.select({
				currency: commissions.currency,
				merchantId: commissions.merchantId,
				periodMonth: commissions.periodMonth,
				total: MONEY_SUM(commissions.commissionAmount),
			})
			.from(commissions)
			.where(eq(commissions.partnerId, partnerId))
			.groupBy(
				commissions.merchantId,
				commissions.periodMonth,
				commissions.currency
			);

		const historyByStore = new Map<
			string,
			{ months: Set<string>; totals: Map<string, bigint> }
		>();
		for (const row of byStoreMonth) {
			const entry = historyByStore.get(row.merchantId) ?? {
				months: new Set<string>(),
				totals: new Map<string, bigint>(),
			};
			entry.months.add(row.periodMonth);
			entry.totals.set(
				row.currency,
				(entry.totals.get(row.currency) ?? 0n) + BigInt(row.total)
			);
			historyByStore.set(row.merchantId, entry);
		}

		return {
			apps: catalog.map(({ overrideRateBps, ...app }) => {
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
					rateBps: overrideRateBps ?? ctx.partner.defaultRateBps,
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

				/* The store's own run: how many months it has paid, and what it
				   has paid in total. This is the recurring half of the deal made
				   visible -- a partner watching one store's total climb is
				   watching the thing the program actually promises. */
				const history = historyByStore.get(merchant.id);
				const months = history ? [...history.months].sort() : [];
				/* Every currency the store has paid in, not just the biggest:
				   "to date" should be the whole story. */
				const lifetime = toMoneyList(
					[...(history?.totals ?? [])].map(([code, total]) => ({
						currency: code,
						total: total.toString(),
					}))
				);

				return {
					earningApps: earning.length,
					firstPeriod: months[0] ?? null,
					grandfatheredApps: grandfatheredOnStore.length,
					id: merchant.id,
					latestPeriod: months.at(-1) ?? null,
					lifetime,
					liveApps: live.length,
					missing,
					monthsEarning: months.length,
					name: merchant.name,
					shopDomain: merchant.shopDomain,
					status: merchant.status,
				};
			}),
			storeCount: myMerchants.length,
		};
	}),

	/**
	 * MILESTONES -- the ladder, and what each rung pays.
	 *
	 * Delegates to `evaluatePartnerMilestones` in @edgecoms/billing rather than
	 * computing the rungs here. The awarder that actually pays for a rung reads
	 * the same function, and a screen telling a partner a rung is reached while
	 * nothing was paid for it is a dispute, so there is exactly one definition
	 * of "reached" in the system.
	 */
	milestones: partnerProcedure.query(
		async ({ ctx }) => await evaluatePartnerMilestones(ctx.db, ctx.partner.id)
	),

	/**
	 * THE PARTNER'S OWN BONUSES.
	 *
	 * Visible because a payment a partner cannot see or explain is worse than
	 * no payment: it turns up in a payout total they cannot reconcile, and the
	 * reason is the whole point of it.
	 *
	 * Only what has actually been AWARDED. Nothing here forecasts a bonus or
	 * advertises one, because a bonus is discretionary -- an admin issues each
	 * one -- and a screen promising bonuses to come would make it a commitment
	 * to everybody who read it.
	 *
	 * Revoked bonuses are not returned. A partner who was never told about one
	 * should not learn of it by watching it disappear.
	 */
	bonuses: partnerProcedure.query(async ({ ctx }) => {
		const rows = await ctx.db
			.select({
				id: partnerBonuses.id,
				amount: partnerBonuses.amount,
				currency: partnerBonuses.currency,
				reason: partnerBonuses.reason,
				periodMonth: partnerBonuses.periodMonth,
				status: partnerBonuses.status,
				paidAt: partnerBonuses.paidAt,
				createdAt: partnerBonuses.createdAt,
			})
			.from(partnerBonuses)
			.where(
				and(
					eq(partnerBonuses.partnerId, ctx.partner.id),
					ne(partnerBonuses.status, "revoked")
				)
			)
			.orderBy(desc(partnerBonuses.createdAt));

		/* Grouped by currency, never summed across them. */
		const awaiting = new Map<string, bigint>();
		for (const row of rows) {
			if (row.status === "pending") {
				awaiting.set(
					row.currency,
					(awaiting.get(row.currency) ?? 0n) + row.amount
				);
			}
		}

		return {
			awaitingPayout: [...awaiting.entries()].map(([currency, total]) => ({
				currency,
				totalMinor: total.toString(),
			})),
			/* `amount` is destructured OUT, not spread through. A bigint cannot be
			   JSON-serialized, so leaving it on the response breaks the whole
			   query over HTTP -- which an in-process router test never sees. */
			bonuses: rows.map(({ amount, ...row }) => ({
				...row,
				amountMinor: amount.toString(),
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
					currency: commissions.currency,
					merchantId: commissions.merchantId,
					commission: MONEY_SUM(commissions.commissionAmount),
					revenue: MONEY_SUM(commissions.baseAmount),
				})
				.from(commissions)
				.where(eq(commissions.partnerId, partnerId))
				.groupBy(commissions.merchantId, commissions.currency);

			const byMerchant = new Map<
				string,
				{ currency: string; commission: string; revenue: string }[]
			>();
			for (const total of totals) {
				const forMerchant = byMerchant.get(total.merchantId) ?? [];
				forMerchant.push(total);
				byMerchant.set(total.merchantId, forMerchant);
			}

			return rows.map((merchant) => {
				const totalsFor = byMerchant.get(merchant.id) ?? [];
				return {
					...merchant,
					commission: toMoneyList(
						totalsFor.map((t) => ({
							currency: t.currency,
							total: t.commission,
						}))
					),
					revenue: toMoneyList(
						totalsFor.map((t) => ({ currency: t.currency, total: t.revenue }))
					),
					zeroCurrency: ZERO_CURRENCY,
				};
			});
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

		/* Currency joins the grouping key everywhere. A month's total across two
		   currencies is not a total, it is two. */
		const byMonth = await ctx.db
			.select({
				currency: commissions.currency,
				period: commissions.periodMonth,
				total: MONEY_SUM(commissions.commissionAmount),
				paid: sql<string>`coalesce(sum(${commissions.commissionAmount}) filter (where ${commissions.status} = 'paid'), 0)`,
				pending: sql<string>`coalesce(sum(${commissions.commissionAmount}) filter (where ${commissions.status} = 'pending'), 0)`,
			})
			.from(commissions)
			.where(eq(commissions.partnerId, partnerId))
			.groupBy(commissions.periodMonth, commissions.currency)
			.orderBy(desc(commissions.periodMonth));

		const lifetimeRows = await ctx.db
			.select({
				currency: commissions.currency,
				total: MONEY_SUM(commissions.commissionAmount),
			})
			.from(commissions)
			.where(eq(commissions.partnerId, partnerId))
			.groupBy(commissions.currency);

		const upcomingRows = await ctx.db
			.select({
				currency: commissions.currency,
				total: MONEY_SUM(commissions.commissionAmount),
			})
			.from(commissions)
			.where(
				and(
					eq(commissions.partnerId, partnerId),
					eq(commissions.status, "pending")
				)
			)
			.groupBy(commissions.currency);

		const payoutHistory = await ctx.db
			.select({
				id: payouts.id,
				periodMonth: payouts.periodMonth,
				/* Gross, withheld and net. Showing gross alone told a partner
				   they were paid $500 while $450 reached their bank, which is
				   precisely the dispute CLAUDE.md's withholding invariant exists
				   to prevent. The note explains the deduction in our words. */
				amount: payouts.totalAmount,
				withheld: payouts.withheldAmount,
				net: payouts.netAmount,
				withholdingNote: payouts.withholdingNote,
				settled: payouts.settledAmount,
				settledCurrency: payouts.settledCurrency,
				currency: payouts.currency,
				status: payouts.status,
				paidAt: payouts.paidAt,
				createdAt: payouts.createdAt,
			})
			.from(payouts)
			.where(eq(payouts.partnerId, partnerId))
			.orderBy(desc(payouts.createdAt));

		return {
			zeroCurrency: ZERO_CURRENCY,
			currentPeriod: period,
			/* Why nothing can be paid yet, if anything. This is the screen a
			   partner opens precisely when wondering where their money is, and it
			   used to show a growing "upcoming" figure while saying nothing about
			   the missing account details holding all of it. */
			payoutBlocker: payoutBlocker(ctx.partner),
			lifetime: toMoneyList(lifetimeRows),
			upcomingPayout: toMoneyList(upcomingRows),
			/* One row per (month, currency): a month a partner earned in two
			   currencies is two lines, which is what their payouts will be. */
			months: byMonth.map((m) => ({
				currency: m.currency,
				period: m.period,
				totalMinor: m.total,
				paidMinor: m.paid,
				pendingMinor: m.pending,
			})),
			payouts: payoutHistory.map((p) => ({
				id: p.id,
				periodMonth: p.periodMonth,
				amountMinor: p.amount.toString(),
				withheldMinor: p.withheld.toString(),
				netMinor: p.net.toString(),
				withholdingNote: p.withholdingNote,
				settledMinor: p.settled?.toString() ?? null,
				settledCurrency: p.settledCurrency,
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
			payoutAccountName: ctx.partner.payoutAccountName,
			payoutAccountNumber: ctx.partner.payoutAccountNumber,
			payoutCountry: ctx.partner.payoutCountry,
			payoutDestination: ctx.partner.payoutDestination,
			payoutIfsc: ctx.partner.payoutIfsc,
			/* Whatever stops them being paid today, in their own words. */
			payoutBlocker: payoutBlocker(ctx.partner),
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
					})
					.where(eq(partners.id, ctx.partner.id));
				return { ok: true };
			}),

		/**
		 * Set where payouts go.
		 *
		 * Separate from the profile update because it is a different kind of
		 * change: getting a company name wrong is cosmetic, getting an account
		 * number wrong sends money to a stranger. It is also why this writes a
		 * validated patch rather than coercing absent fields to null the way the
		 * profile update does -- a partial submission must never half-erase a
		 * destination and leave something unpayable but not obviously so.
		 */
		setPayoutDetails: partnerProcedure
			.input(payoutDetailsInput)
			.mutation(async ({ ctx, input }) => {
				await ctx.db
					.update(partners)
					.set(payoutDetailsPatch(input))
					.where(eq(partners.id, ctx.partner.id));
				return { ok: true };
			}),
	}),
});
