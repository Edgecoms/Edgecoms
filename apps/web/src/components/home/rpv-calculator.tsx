"use client";

import { useId, useState } from "react";
import { Highlight } from "@/components/ui/highlight";

/**
 * The maths block. It converts better than any testimonial, because the
 * merchant does the arithmetic themselves and arrives at the conclusion without
 * being told it.
 *
 * House rule from CLAUDE.md holds here even though this is not the ledger:
 * money is integer minor units and no floating-point math touches it. Every
 * figure below is whole cents with integer division, and the only division by
 * 100 happens at the formatting boundary.
 */

/** A ten percent lift on one lever. */
const LIFT_PERCENT = 10;
/** Both levers at once: 1.1 × 1.1 = 1.21, so twenty-one percent, not twenty. */
const BOTH_LIFT_PERCENT = 21;
const PERCENT_BASIS = 100;
const BPS_BASIS = 10_000;
const MONTHS_PER_YEAR = 12;

const DEFAULTS = {
	aov: "45",
	cvr: "2",
	revenue: "50000",
} as const;

const wholeCurrency = new Intl.NumberFormat("en-US", {
	currency: "USD",
	maximumFractionDigits: 0,
	style: "currency",
});

const preciseCurrency = new Intl.NumberFormat("en-US", {
	currency: "USD",
	maximumFractionDigits: 2,
	minimumFractionDigits: 2,
	style: "currency",
});

const wholeNumber = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 0,
});

/** Parse at the boundary, then never touch a float again. */
function toCents(input: string): number {
	const parsed = Number.parseFloat(input);
	if (!Number.isFinite(parsed) || parsed <= 0) {
		return 0;
	}
	return Math.round(parsed * 100);
}

/** A percentage becomes basis points, so conversion rate is an integer too. */
function toBps(input: string): number {
	const parsed = Number.parseFloat(input);
	if (!Number.isFinite(parsed) || parsed <= 0) {
		return 0;
	}
	return Math.round(parsed * 100);
}

function formatCents(cents: number): string {
	return wholeCurrency.format(cents / 100);
}

function NumberField({
	hint,
	label,
	onChange,
	prefix,
	suffix,
	value,
}: {
	hint: string;
	label: string;
	onChange: (value: string) => void;
	prefix?: string;
	suffix?: string;
	value: string;
}) {
	const id = useId();
	return (
		<div className="flex flex-col gap-2">
			<label className="font-medium text-body-sm text-brand" htmlFor={id}>
				{label}
			</label>
			<div className="flex items-center gap-1.5 rounded-xl border border-border bg-bg px-3.5 py-2.5 focus-within:ring-3 focus-within:ring-ring/50">
				{prefix ? (
					<span className="text-body text-secondary-foreground">{prefix}</span>
				) : null}
				<input
					className="w-full bg-transparent font-medium text-body text-primary-foreground tabular-nums outline-none"
					id={id}
					inputMode="decimal"
					min={0}
					onChange={(event) => onChange(event.target.value)}
					type="number"
					value={value}
				/>
				{suffix ? (
					<span className="text-body text-secondary-foreground">{suffix}</span>
				) : null}
			</div>
			<span className="text-caption text-secondary-foreground">{hint}</span>
		</div>
	);
}

function ScenarioRow({
	annual,
	emphasis = false,
	label,
	monthly,
}: {
	annual: number;
	emphasis?: boolean;
	label: string;
	monthly: number;
}) {
	return (
		<div
			className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-4 ${emphasis ? "bg-brand/8" : "bg-page"}`}
		>
			<span
				className={`text-body-sm ${emphasis ? "font-medium text-primary-foreground" : "text-secondary-foreground"}`}
			>
				{label}
			</span>
			<span className="flex items-baseline gap-3">
				<span className="font-medium text-body text-primary-foreground tabular-nums">
					{formatCents(monthly)}
					<span className="ml-0.5 font-normal text-caption text-secondary-foreground">
						/mo
					</span>
				</span>
				<span className="font-medium text-brand text-h3 tabular-nums">
					{formatCents(annual)}
					<span className="ml-0.5 font-normal text-caption text-secondary-foreground">
						/yr
					</span>
				</span>
			</span>
		</div>
	);
}

export function RpvCalculator() {
	const [revenue, setRevenue] = useState<string>(DEFAULTS.revenue);
	const [aov, setAov] = useState<string>(DEFAULTS.aov);
	const [cvr, setCvr] = useState<string>(DEFAULTS.cvr);

	const revenueCents = toCents(revenue);
	const aovCents = toCents(aov);
	const cvrBps = toBps(cvr);

	const singleLift = Math.floor((revenueCents * LIFT_PERCENT) / PERCENT_BASIS);
	const bothLift = Math.floor(
		(revenueCents * BOTH_LIFT_PERCENT) / PERCENT_BASIS
	);

	const orders = aovCents > 0 ? Math.floor(revenueCents / aovCents) : 0;
	const visitors = cvrBps > 0 ? Math.floor((orders * BPS_BASIS) / cvrBps) : 0;
	const rpvCents = visitors > 0 ? Math.floor(revenueCents / visitors) : 0;
	const liftedAovCents = Math.floor(
		(aovCents * (PERCENT_BASIS + LIFT_PERCENT)) / PERCENT_BASIS
	);

	return (
		<section
			aria-labelledby="calculator-heading"
			className="w-full scroll-mt-24 py-10"
			id="calculator"
		>
			<div className="mx-auto w-full max-w-7xl px-6">
				<div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
					<p className="font-medium text-body-sm text-brand">
						Do the maths on your own store
					</p>
					<h2
						className="text-balance font-medium text-display text-primary-foreground"
						id="calculator-heading"
					>
						<Highlight>What a 10% lift is actually worth to you</Highlight>
					</h2>
					<p className="text-pretty text-body-lg text-secondary-foreground leading-relaxed">
						Three numbers from your Shopify dashboard. No email required, and
						nothing leaves your browser.
					</p>
				</div>

				<div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] border border-border bg-border lg:grid-cols-5">
					<div className="flex flex-col gap-6 bg-page p-8 sm:p-10 lg:col-span-2">
						<NumberField
							hint="Shopify Analytics → Total sales, last 30 days"
							label="Monthly revenue"
							onChange={setRevenue}
							prefix="$"
							value={revenue}
						/>
						<NumberField
							hint="Total sales divided by orders"
							label="Average order value"
							onChange={setAov}
							prefix="$"
							value={aov}
						/>
						<NumberField
							hint="Orders divided by sessions. Most stores sit between 1% and 3%."
							label="Conversion rate"
							onChange={setCvr}
							suffix="%"
							value={cvr}
						/>

						<dl className="mt-auto flex flex-col gap-2 border-border border-t pt-6 text-body-sm">
							<div className="flex items-baseline justify-between gap-4">
								<dt className="text-secondary-foreground">
									Monthly orders, roughly
								</dt>
								<dd className="font-medium text-primary-foreground tabular-nums">
									{wholeNumber.format(orders)}
								</dd>
							</div>
							<div className="flex items-baseline justify-between gap-4">
								<dt className="text-secondary-foreground">
									Monthly sessions that implies
								</dt>
								<dd className="font-medium text-primary-foreground tabular-nums">
									{wholeNumber.format(visitors)}
								</dd>
							</div>
							<div className="flex items-baseline justify-between gap-4">
								<dt className="text-secondary-foreground">
									Each visit is worth
								</dt>
								<dd className="font-medium text-primary-foreground tabular-nums">
									{preciseCurrency.format(rpvCents / 100)}
								</dd>
							</div>
						</dl>
					</div>

					<div className="flex flex-col gap-6 bg-bg p-8 sm:p-10 lg:col-span-3">
						<div className="flex flex-col gap-1">
							<h3 className="font-medium text-h3 text-primary-foreground">
								What it adds up to
							</h3>
							<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
								Same traffic, same ad spend, same cost per acquisition. Only the
								two numbers in the equation change.
							</p>
						</div>

						<div className="flex flex-col gap-px overflow-hidden rounded-xl border border-border bg-border">
							<ScenarioRow
								annual={singleLift * MONTHS_PER_YEAR}
								label="+10% average order value"
								monthly={singleLift}
							/>
							<ScenarioRow
								annual={singleLift * MONTHS_PER_YEAR}
								label="+10% conversion rate"
								monthly={singleLift}
							/>
							<ScenarioRow
								annual={bothLift * MONTHS_PER_YEAR}
								emphasis
								label="Both together"
								monthly={bothLift}
							/>
						</div>

						<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
							A 10% lift moves your average order from{" "}
							<span className="font-medium text-primary-foreground tabular-nums">
								{preciseCurrency.format(aovCents / 100)}
							</span>{" "}
							to{" "}
							<span className="font-medium text-primary-foreground tabular-nums">
								{preciseCurrency.format(liftedAovCents / 100)}
							</span>
							. Buying the same increase from ads means paying your current cost
							per acquisition again, every month, forever. The Edge app that
							moves it costs single-digit dollars a month.
						</p>

						<p className="mt-auto text-pretty text-caption text-secondary-foreground leading-relaxed">
							Illustrative arithmetic, not a forecast. It shows what a lift of
							this size is worth on your current numbers. It does not predict
							that any app will produce one.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
