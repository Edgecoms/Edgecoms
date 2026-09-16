"use client";

import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import { PartnerCodeCard } from "@/components/portal/partner-code-card";
import { PortalHeader, StatusBadge } from "@/components/portal/ui";
import { AppIcon } from "@/components/ui/app-icon";
import { formatMoney } from "@/lib/money";
import { trpc } from "@/utils/trpc";

/**
 * WHAT A PARTNER SEES FIRST.
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

export function PartnerWelcome({
	catalog,
	firstName,
}: {
	catalog: readonly CatalogEntry[];
	firstName: string | null;
}) {
	const onboarding = useQuery(trpc.partner.onboarding.queryOptions());
	const dashboard = useQuery(trpc.partner.dashboard.queryOptions());
	const appsQuery = useQuery(trpc.partner.apps.queryOptions());

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
					href={"/partner/welcome" as Route}
					label="Apps earning"
					loading={appsQuery.isLoading}
					value={String(earningApps)}
				/>
			</div>

			<PartnerCodeCard />

			{todo.length > 0 ? (
				<section className="flex flex-col gap-3">
					<div className="flex items-baseline justify-between gap-4">
						<h2 className="font-medium text-h3 text-primary-foreground">
							Next
						</h2>
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
						{todo.map((step) => (
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
			) : null}

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

				{appsQuery.isLoading ? (
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
