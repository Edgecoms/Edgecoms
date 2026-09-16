"use client";

import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import { PartnerCodeCard } from "@/components/portal/partner-code-card";
import {
	EmptyState,
	PortalHeader,
	StatusBadge,
	TableShell,
} from "@/components/portal/ui";
import { AppIcon } from "@/components/ui/app-icon";
import { formatMoney, formatPeriod } from "@/lib/money";
import { trpc } from "@/utils/trpc";

/**
 * THE PARTNER'S HOME. One screen, because there was never a second one worth
 * navigating to: a separate "Start here" meant the numbers lived on one page
 * and the reasons lived on another, and a partner had to guess which was the
 * real dashboard.
 *
 * Built around one idea: a partner does not want to be taught, they want to
 * know what they have, what it is worth, and what to do next. So every block
 * here is a live figure or an action, and the explanation sits behind a
 * disclosure instead of down the page as prose nobody reads twice.
 *
 * Nothing on this screen is estimated or projected. Every number is a count or
 * a sum of rows that exist, which is why the zero state is allowed to say zero
 * rather than dress itself up as a forecast.
 */

interface CatalogEntry {
	category: string;
	eyebrow: string;
	listingUrl: string | null;
	slug: string;
}

/** A figure that is also a link, because a partner's next question is "which?" */
function Figure({
	href,
	hint,
	label,
	loading,
	value,
}: {
	href: Route;
	hint?: string;
	label: string;
	loading: boolean;
	value: string;
}) {
	return (
		<Link
			className="group flex flex-col gap-1 rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:border-primary-foreground/30"
			href={href}
		>
			<span className="text-caption text-secondary-foreground uppercase tracking-wide">
				{label}
			</span>
			{loading ? (
				<Skeleton className="h-9 w-20" />
			) : (
				<span className="font-medium text-h2 text-primary-foreground tabular-nums">
					{value}
				</span>
			)}
			{hint ? (
				<span className="text-caption text-secondary-foreground">{hint}</span>
			) : null}
		</Link>
	);
}

/** The state of one app across this partner's stores, in their own terms. */
function appState(app: {
	earningStores: number;
	grandfatheredStores: number;
	liveStores: number;
}): { tone: "earning" | "live" | "idle"; text: string } {
	if (app.earningStores > 0) {
		return {
			text: `Earning on ${app.earningStores} ${app.earningStores === 1 ? "store" : "stores"}`,
			tone: "earning",
		};
	}
	if (app.liveStores > 0) {
		const never =
			app.grandfatheredStores > 0
				? `, ${app.grandfatheredStores} grandfathered`
				: "";
		return {
			text: `Installed on ${app.liveStores}${never}`,
			tone: "live",
		};
	}
	return { text: "Not on your stores yet", tone: "idle" };
}

const TONES = {
	earning: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
	idle: "bg-page text-secondary-foreground ring-border",
	live: "bg-sky-50 text-sky-700 ring-sky-600/20",
} as const;

/** One app's standing across the partner's stores, as `partner.apps` returns it. */
interface AppRow {
	earningStores: number;
	grandfatheredStores: number;
	id: string;
	liveStores: number;
	name: string;
	setupVideoUrl: string | null;
	slug: string;
}

/** One store's coverage of the suite. */
interface StoreRow {
	currency: string;
	earningApps: number;
	firstPeriod: string | null;
	grandfatheredApps: number;
	id: string;
	latestPeriod: string | null;
	lifetimeMinor: string;
	liveApps: number;
	missing: readonly { name: string; slug: string }[];
	monthsEarning: number;
	name: string;
	shopDomain: string;
}

/** One milestone as returned by the server: a count rung or a money rung. */
type Rung =
	| {
			current: number;
			key: string;
			label: string;
			reached: boolean;
			target: number;
	  }
	| {
			currentMinor: string;
			key: string;
			label: string;
			reached: boolean;
			targetMinor: string;
	  };

/**
 * The right-hand figure on a rung.
 *
 * The money rung arrives as two integers in minor units plus a currency, and
 * is formatted here rather than compared here -- the server already decided
 * whether it was reached. `formatMoney` output is display only.
 */
function rungLabel(rung: Rung, currency: string | undefined): string {
	/* The money rung's target is an integer whose meaning depends on its
	   currency, so the label is composed here rather than hardcoded server-side
	   as "$100" -- which would be wrong the first time a partner earns in yen. */
	if ("targetMinor" in rung) {
		return `Your first ${formatMoney(rung.targetMinor, currency ?? "USD")} earned`;
	}
	return rung.label;
}

function rungDetail(rung: Rung, currency: string | undefined): string {
	if ("currentMinor" in rung) {
		return `${formatMoney(rung.currentMinor, currency ?? "USD")} of ${formatMoney(rung.targetMinor, currency ?? "USD")}`;
	}
	return `${rung.current} of ${rung.target}`;
}

/** Circumference of the coverage ring, for the dash offset. */
const RING_RADIUS = 22;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * How much of the suite is earning on one store.
 *
 * A ring rather than a bar because the number that matters is the gap, and a
 * ring shows an unfinished circle as unfinished at a glance.
 */
function CoverageRing({ earning, total }: { earning: number; total: number }) {
	const fraction = total > 0 ? earning / total : 0;
	return (
		<div className="relative shrink-0">
			<svg
				aria-hidden="true"
				className="-rotate-90"
				height="56"
				viewBox="0 0 56 56"
				width="56"
			>
				<circle
					className="stroke-border"
					cx="28"
					cy="28"
					fill="none"
					r={RING_RADIUS}
					strokeWidth="4"
				/>
				<circle
					className="stroke-primary-foreground transition-all"
					cx="28"
					cy="28"
					fill="none"
					r={RING_RADIUS}
					strokeDasharray={RING_CIRCUMFERENCE}
					strokeDashoffset={RING_CIRCUMFERENCE * (1 - fraction)}
					strokeLinecap="round"
					strokeWidth="4"
				/>
			</svg>
			<span className="absolute inset-0 flex items-center justify-center font-medium text-caption text-primary-foreground tabular-nums">
				{earning}/{total}
			</span>
		</div>
	);
}

/** One rung. Reached rungs are quiet; the next one is the only one shouting. */
function Rung({
	detail,
	label,
	next,
	reached,
}: {
	detail: string;
	label: string;
	next: boolean;
	reached: boolean;
}) {
	return (
		<li
			className={`flex items-center gap-3 px-5 py-3.5 ${next ? "bg-page" : "bg-surface"}`}
		>
			<span
				aria-hidden="true"
				className={
					reached
						? "flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-caption text-surface"
						: "size-5 shrink-0 rounded-full border border-border border-dashed"
				}
			>
				{reached ? "\u2713" : null}
			</span>
			<span
				className={`flex-1 text-body-sm ${reached ? "text-secondary-foreground" : "text-primary-foreground"}`}
			>
				{label}
				<span className="sr-only">{reached ? " (done)" : " (not yet)"}</span>
			</span>
			<span className="text-caption text-secondary-foreground tabular-nums">
				{detail}
			</span>
		</li>
	);
}

/** The quest board: one ring per store, and the cheapest next move on it. */
function StoreCoverage({
	catalogSize,
	stores,
}: {
	catalogSize: number;
	stores: readonly StoreRow[];
}) {
	if (stores.length === 0) {
		return null;
	}
	return (
		<section className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<h2 className="font-medium text-h3 text-primary-foreground">
					Your stores
				</h2>
				<p className="text-body-sm text-secondary-foreground">
					Another Edge app on a store you already hold needs no new pitch and
					earns at the same rate. It is the cheapest move you have.
				</p>
			</div>
			<ul className="grid gap-4 sm:grid-cols-2">
				{stores.map((store) => (
					<li
						className="flex items-start gap-4 rounded-xl border border-border bg-surface px-5 py-4"
						key={store.id}
					>
						<CoverageRing earning={store.earningApps} total={catalogSize} />
						<div className="flex flex-col gap-1">
							<span className="font-medium text-body-sm text-primary-foreground">
								{store.name}
							</span>
							<span className="text-caption text-secondary-foreground">
								{store.shopDomain}
							</span>
							{store.monthsEarning > 0 ? (
								<span className="text-body-sm text-primary-foreground tabular-nums">
									Month {store.monthsEarning} ·{" "}
									{formatMoney(store.lifetimeMinor, store.currency)} to date
								</span>
							) : (
								<span className="text-caption text-secondary-foreground">
									Earns from the first charge Shopify records
								</span>
							)}
							{store.grandfatheredApps > 0 ? (
								<span className="text-caption text-secondary-foreground">
									{store.grandfatheredApps} grandfathered, never earns
								</span>
							) : null}
							{store.missing.length > 0 ? (
								<span className="text-caption text-primary-foreground">
									Next:{" "}
									{store.missing
										.slice(0, 2)
										.map((app) => app.name)
										.join(", ")}
								</span>
							) : (
								<span className="text-caption text-primary-foreground">
									Whole suite installed
								</span>
							)}
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}

/** The whole catalog, with each app's standing on this partner's stores. */
function SuiteGrid({
	copyBySlug,
	loading,
	rate,
	rows,
}: {
	copyBySlug: Map<string, CatalogEntry>;
	loading: boolean;
	rate: string | null;
	rows: readonly AppRow[];
}) {
	return (
		<section className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<h2 className="font-medium text-h3 text-primary-foreground">
					The suite, on your stores
				</h2>
				<p className="text-body-sm text-secondary-foreground">
					Every Edge app a store you manage can install. Each one it starts
					paying for earns you {rate ?? "your"}
					{rate ? "%" : " share"}.
				</p>
			</div>

			{loading ? (
				<Skeleton className="h-64 w-full rounded-xl" />
			) : (
				<ul className="grid gap-4 sm:grid-cols-2">
					{rows.map((app) => {
						const copy = copyBySlug.get(app.slug);
						const state = appState(app);
						return (
							<li
								className="flex flex-col gap-3 rounded-xl border border-border bg-surface px-5 py-4"
								key={app.id}
							>
								<div className="flex items-start gap-3">
									<AppIcon product={{ slug: app.slug }} size="lg" />
									<div className="flex flex-col gap-0.5">
										<span className="font-medium text-body text-primary-foreground">
											{app.name}
										</span>
										<span className="text-caption text-secondary-foreground">
											{copy?.eyebrow ?? ""}
										</span>
									</div>
								</div>

								<div className="flex flex-wrap items-center gap-2">
									<span
										className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium text-[11px] ring-1 ring-inset ${TONES[state.tone]}`}
									>
										{state.text}
									</span>
									{copy ? (
										<span className="text-caption text-secondary-foreground">
											Moves {copy.category.toLowerCase()}
										</span>
									) : null}
								</div>

								<div className="mt-auto flex items-center gap-4 pt-1">
									{app.setupVideoUrl ? (
										<a
											className="text-caption text-primary-foreground underline underline-offset-4"
											href={app.setupVideoUrl}
											rel="noopener noreferrer"
											target="_blank"
										>
											Watch the setup
										</a>
									) : (
										<span className="text-caption text-secondary-foreground">
											Setup walkthrough coming
										</span>
									)}
									{copy?.listingUrl ? (
										<a
											className="text-caption text-secondary-foreground underline underline-offset-4"
											href={copy.listingUrl}
											rel="noopener noreferrer"
											target="_blank"
										>
											App Store
										</a>
									) : null}
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
}

/** One commission per row, newest first. The ledger, not a summary of it. */
function RecentActivity({
	loading,
	rows,
}: {
	loading: boolean;
	rows: readonly {
		amountMinor: string;
		appName: string;
		currency: string;
		id: string;
		merchantName: string;
		period: string;
		status: string;
	}[];
}) {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="font-medium text-h3 text-primary-foreground">
				Recent commission
			</h2>
			{!loading && rows.length === 0 ? (
				<EmptyState
					description="Every charge Shopify records against an approved store of yours lands here, once, at the rate in force when you earned it."
					title="Nothing yet"
				/>
			) : (
				<TableShell
					head={
						<>
							<th>Store</th>
							<th>App</th>
							<th>Period</th>
							<th>Status</th>
							<th className="text-right">Commission</th>
						</>
					}
				>
					{rows.map((row) => (
						<tr key={row.id}>
							<td className="text-primary-foreground">{row.merchantName}</td>
							<td className="text-secondary-foreground">{row.appName}</td>
							<td className="text-secondary-foreground">
								{formatPeriod(row.period)}
							</td>
							<td>
								<StatusBadge status={row.status} />
							</td>
							<td className="text-right text-primary-foreground tabular-nums">
								{formatMoney(row.amountMinor, row.currency)}
							</td>
						</tr>
					))}
				</TableShell>
			)}
		</section>
	);
}

/** One step at a time, with the bar as the reward for clearing one. */
function NextSteps({
	done,
	steps,
}: {
	done: number;
	steps: readonly { href: Route; label: string; title: string }[];
}) {
	if (steps.length === 0) {
		return null;
	}
	return (
		<section className="flex flex-col gap-3">
			<div className="flex items-baseline justify-between gap-4">
				<h2 className="font-medium text-h3 text-primary-foreground">Next</h2>
				<span className="text-caption text-secondary-foreground tabular-nums">
					{done} of 4 done
				</span>
			</div>
			<div
				aria-hidden="true"
				className="h-1 w-full overflow-hidden rounded-full bg-border"
			>
				<div
					className="h-full rounded-full bg-primary-foreground transition-all"
					style={{ width: `${(done / 4) * 100}%` }}
				/>
			</div>
			<ul className="flex flex-col gap-px overflow-hidden rounded-xl border border-border bg-border">
				{steps.map((step) => (
					<li
						className="flex items-center justify-between gap-4 bg-surface px-5 py-3.5"
						key={step.title}
					>
						<span className="text-body-sm text-primary-foreground">
							{step.title}
						</span>
						<Link
							className="text-caption text-primary-foreground underline underline-offset-4"
							href={step.href}
						>
							{step.label}
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}

export function PartnerHome({
	catalog,
	firstName,
}: {
	catalog: readonly CatalogEntry[];
	firstName: string | null;
}) {
	const onboarding = useQuery(trpc.partner.onboarding.queryOptions());
	const dashboard = useQuery(trpc.partner.dashboard.queryOptions());
	const appsQuery = useQuery(trpc.partner.apps.queryOptions());
	const milestonesQuery = useQuery(trpc.partner.milestones.queryOptions());

	const data = onboarding.data;
	const approved = data?.status === "approved";
	const rate = data ? (data.defaultRateBps / 100).toFixed(1) : null;

	const steps = data?.steps;
	const done = steps
		? [
				steps.codeIssued,
				steps.payoutReady,
				steps.firstStore,
				steps.firstCommission,
			].filter(Boolean).length
		: 0;

	const copyBySlug = new Map(catalog.map((entry) => [entry.slug, entry]));
	const rows = appsQuery.data?.apps ?? [];
	const earningApps = rows.filter((app) => app.earningStores > 0).length;
	const stores = appsQuery.data?.stores ?? [];
	const catalogSize = appsQuery.data?.catalogSize ?? rows.length;

	const rungs = milestonesQuery.data?.milestones ?? [];
	const reachedCount = rungs.filter((rung) => rung.reached).length;
	/* Only the first unreached rung is highlighted, so the ladder reads as one
	   next action rather than a wall of things not done. */
	const firstUnreached = rungs.findIndex((rung) => !rung.reached);

	const todo = steps
		? [
				{
					done: steps.payoutReady,
					href: "/partner/settings" as Route,
					label: "Add payout details",
					title: "Payout details",
				},
				{
					done: steps.firstStore,
					href: "/partner/merchants" as Route,
					label: "See your merchants",
					title: "First store on your code",
				},
				{
					done: steps.firstCommission,
					href: "/partner/earnings" as Route,
					label: "See your earnings",
					title: "First commission",
				},
			].filter((step) => !step.done)
		: [];

	return (
		<div className="flex flex-col gap-10">
			<PortalHeader
				description={
					approved && rate
						? `You keep ${rate}% of the net revenue of every store you bring to Edge, every month it stays.`
						: "Your application is with us. Nothing is needed from you yet."
				}
				title={firstName ? `Welcome, ${firstName}` : "Welcome"}
			/>

			{data && !approved ? (
				<div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
					<div className="flex items-center gap-2 text-body-sm">
						<span className="font-medium">Your application is</span>
						<StatusBadge status={data.status} />
					</div>
					<p className="text-body-sm">
						We review by hand, set your rate, and email you your code. Usually
						the same day.
					</p>
				</div>
			) : null}

			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				<Figure
					href={"/partner/merchants" as Route}
					label="Your stores"
					loading={dashboard.isLoading}
					value={String(dashboard.data?.activeMerchants ?? 0)}
				/>
				<Figure
					hint="Commission"
					href={"/partner/earnings" as Route}
					label="This month"
					loading={dashboard.isLoading}
					value={formatMoney(
						dashboard.data?.thisMonthCommissionMinor ?? "0",
						dashboard.data?.currency ?? "USD"
					)}
				/>
				<Figure
					hint="All time"
					href={"/partner/earnings" as Route}
					label="Lifetime"
					loading={dashboard.isLoading}
					value={formatMoney(
						dashboard.data?.lifetimeEarningsMinor ?? "0",
						dashboard.data?.currency ?? "USD"
					)}
				/>
				<Figure
					hint={`of ${rows.length || 7} Edge apps`}
					href={"/partner" as Route}
					label="Apps earning"
					loading={appsQuery.isLoading}
					value={String(earningApps)}
				/>
			</div>

			<PartnerCodeCard />

			<NextSteps done={done} steps={todo} />

			<StoreCoverage catalogSize={catalogSize} stores={stores} />

			{rungs.length > 0 ? (
				<section className="flex flex-col gap-3">
					<div className="flex items-baseline justify-between gap-4">
						<h2 className="font-medium text-h3 text-primary-foreground">
							Milestones
						</h2>
						<span className="text-caption text-secondary-foreground tabular-nums">
							{reachedCount} of {rungs.length}
						</span>
					</div>
					<ul className="flex flex-col gap-px overflow-hidden rounded-xl border border-border bg-border">
						{rungs.map((rung, index) => (
							<Rung
								detail={rungDetail(rung, milestonesQuery.data?.currency)}
								key={rung.key}
								label={rungLabel(rung, milestonesQuery.data?.currency)}
								next={!rung.reached && index === firstUnreached}
								reached={rung.reached}
							/>
						))}
					</ul>
				</section>
			) : null}

			<RecentActivity
				loading={dashboard.isLoading}
				rows={dashboard.data?.recentActivity ?? []}
			/>

			<SuiteGrid
				copyBySlug={copyBySlug}
				loading={appsQuery.isLoading}
				rate={rate}
				rows={rows}
			/>

			<details className="rounded-xl border border-border bg-surface px-5 py-4">
				<summary className="cursor-pointer font-medium text-body-sm text-primary-foreground">
					How the money works
				</summary>
				<div className="flex flex-col gap-3 pt-3 text-body-sm text-secondary-foreground">
					<p>
						You hand your code to a Shopify store you already manage. They paste
						it into any Edge app while installing, and the store arrives in your
						Merchants list attributed to you.
					</p>
					<p>
						We approve the store, then Shopify bills it as normal. Every charge
						Shopify records generates one commission for you, at the rate in
						force when you earned it, so renegotiating a rate never rewrites
						what you are already owed.
					</p>
					<p>
						It repeats every month the store stays on Edge. Nothing expires and
						there is no clawback window. A store that was already paying for an
						Edge app before you brought it keeps that app out of your
						commission, which is what &ldquo;grandfathered&rdquo; means on the
						cards above.
					</p>
				</div>
			</details>
		</div>
	);
}
