"use client";

import { useId, useState } from "react";

/**
 * PLACEHOLDER ECONOMICS — every number in this block is invented and MUST be
 * replaced with real figures before this page ships. They are isolated here so
 * that is a one-edit change.
 *
 * ponytail: illustrative estimator, swap for real catalog pricing and the
 * approved rate band when those are settled.
 */
const AVG_APP_PRICE_CENTS = 2900;
/** Edge's share of the subscription after Shopify's revenue cut. */
const NET_SHARE_BPS = 8500;
/** A representative partner rate. Real rates are agreed per partner. */
const RATE_BPS = 2000;

const MONTHS = 24;
const BASIS = 10_000;

const STORE_RANGE = { max: 40, min: 1, step: 1 } as const;
const APP_RANGE = { max: 6, min: 1, step: 1 } as const;

/* House rule: money is integer minor units and no float math touches it. That
   holds here too — every figure below is computed in whole cents with integer
   division, and the only division by 100 happens at the formatting boundary. */
function monthlyCommissionCents(stores: number, appsPerStore: number): number {
	const gross = AVG_APP_PRICE_CENTS * stores * appsPerStore;
	const net = Math.floor((gross * NET_SHARE_BPS) / BASIS);
	return Math.floor((net * RATE_BPS) / BASIS);
}

const currency = new Intl.NumberFormat("en-US", {
	currency: "USD",
	maximumFractionDigits: 0,
	style: "currency",
});

function formatCents(cents: number): string {
	return currency.format(cents / 100);
}

function Slider({
	label,
	max,
	min,
	onChange,
	step,
	value,
	valueLabel,
}: {
	label: string;
	max: number;
	min: number;
	onChange: (value: number) => void;
	step: number;
	value: number;
	valueLabel: string;
}) {
	const id = useId();
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-baseline justify-between">
				<label
					className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.1em]"
					htmlFor={id}
				>
					{label}
				</label>
				<span className="font-medium text-body text-primary-foreground tabular-nums">
					{valueLabel}
				</span>
			</div>
			<input
				className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--gray-4)] accent-[var(--brand)]"
				id={id}
				max={max}
				min={min}
				onChange={(event) => onChange(Number(event.target.value))}
				step={step}
				type="range"
				value={value}
			/>
		</div>
	);
}

export function EarningsCalculator() {
	const [stores, setStores] = useState(12);
	const [apps, setApps] = useState(3);

	const monthly = monthlyCommissionCents(stores, apps);
	const cumulative = Array.from(
		{ length: MONTHS },
		(_, index) => monthly * (index + 1)
	);
	const total = cumulative[MONTHS - 1] ?? 0;

	return (
		<div className="grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] border border-border bg-border lg:grid-cols-5">
			{/* Inputs */}
			<div className="flex flex-col gap-8 bg-page p-8 sm:p-10 lg:col-span-2">
				<Slider
					label="Stores you manage"
					max={STORE_RANGE.max}
					min={STORE_RANGE.min}
					onChange={setStores}
					step={STORE_RANGE.step}
					value={stores}
					valueLabel={`${stores}${stores === STORE_RANGE.max ? "+" : ""}`}
				/>
				<Slider
					label="Edge apps per store"
					max={APP_RANGE.max}
					min={APP_RANGE.min}
					onChange={setApps}
					step={APP_RANGE.step}
					value={apps}
					valueLabel={`${apps} of 6`}
				/>

				<div className="mt-auto flex flex-col gap-1 border-border border-t pt-6">
					<span className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.1em]">
						Your recurring commission
					</span>
					<span className="font-medium text-display text-primary-foreground tabular-nums">
						{formatCents(monthly)}
						<span className="ml-1 font-normal text-body-lg text-secondary-foreground">
							/mo
						</span>
					</span>
				</div>
			</div>

			{/* Cumulative earnings */}
			<div className="flex flex-col gap-6 bg-bg p-8 sm:p-10 lg:col-span-3">
				<div className="flex flex-wrap items-baseline justify-between gap-2">
					<h3 className="font-medium text-h3 text-primary-foreground">
						What that adds up to
					</h3>
					<span className="text-body-sm text-secondary-foreground">
						Cumulative, first {MONTHS} months
					</span>
				</div>

				{/* Bars are cumulative, so the shape is the argument: nothing drops
				    off, because there is no expiry window to drop off at. */}
				<div
					aria-hidden="true"
					className="flex h-40 items-end gap-1"
					key={`${stores}-${apps}`}
				>
					{cumulative.map((_value, index) => (
						<div
							className="flex-1 rounded-t-[3px] bg-brand"
							key={`month-${index + 1}`}
							style={{
								height: `${((index + 1) / MONTHS) * 100}%`,
								opacity: 0.35 + (index / MONTHS) * 0.65,
							}}
						/>
					))}
				</div>

				<div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
					{[
						{ label: "Month 12", value: cumulative[11] ?? 0 },
						{ label: `Month ${MONTHS}`, value: total },
						{ label: "Then every month", value: monthly },
					].map((stat) => (
						<div className="flex flex-col gap-1 bg-page p-4" key={stat.label}>
							<span className="text-caption text-secondary-foreground">
								{stat.label}
							</span>
							<span className="font-medium text-h3 text-primary-foreground tabular-nums">
								{formatCents(stat.value)}
							</span>
						</div>
					))}
				</div>

				<p className="text-pretty text-caption text-secondary-foreground leading-relaxed">
					Illustrative only — not a quote. Your rate is agreed when you are
					approved and frozen onto every commission generated from then on, so
					renegotiating later never rewrites what you have already earned.
				</p>
			</div>
		</div>
	);
}
