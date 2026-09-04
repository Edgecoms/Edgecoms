"use client";

import { cn } from "@edgecoms/ui/lib/utils";
import { useId, useState } from "react";

/**
 * The threshold calculator.
 *
 * Client side only, and deliberately arithmetic rather than a model: it
 * restates the merchant's own two numbers back at them and says which side of
 * the line they are on. There is nothing to predict here, and a projection
 * would be an outcome claim this page is not allowed to make.
 */

const DEFAULT_AOV = 62;
const DEFAULT_THRESHOLD = 50;
/** Above a real storefront's range the inputs stop being informative. */
const MAX_VALUE = 100_000;

function parseAmount(raw: string): number {
	const value = Number.parseFloat(raw);
	if (!Number.isFinite(value) || value < 0) {
		return 0;
	}
	return Math.min(value, MAX_VALUE);
}

/** Whole dollars unless the merchant typed cents. */
function money(value: number): string {
	return `$${Number.isInteger(value) ? value.toString() : value.toFixed(2)}`;
}

function AmountField({
	label,
	onChange,
	value,
}: {
	label: string;
	onChange: (next: string) => void;
	value: string;
}) {
	const id = useId();

	return (
		<div>
			<label
				className="block font-medium text-neutral-900 text-sm"
				htmlFor={id}
			>
				{label}
			</label>
			<div className="relative mt-1.5">
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 left-3 flex items-center font-medium text-neutral-400 text-sm"
				>
					$
				</span>
				<input
					className="h-11 w-full rounded-lg border border-neutral-200 bg-white pr-3 pl-7 font-mono text-neutral-900 text-sm outline-none transition-colors focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30"
					id={id}
					inputMode="decimal"
					min={0}
					onChange={(event) => onChange(event.target.value)}
					step="1"
					type="number"
					value={value}
				/>
			</div>
		</div>
	);
}

export function ThresholdCalculator() {
	const [aovInput, setAovInput] = useState(DEFAULT_AOV.toString());
	const [thresholdInput, setThresholdInput] = useState(
		DEFAULT_THRESHOLD.toString()
	);

	const aov = parseAmount(aovInput);
	const threshold = parseAmount(thresholdInput);
	const working = threshold > aov;
	const gap = threshold - aov;

	return (
		<div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
			<div className="flex flex-col gap-5 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-7">
				<AmountField
					label="Your average order value"
					onChange={setAovInput}
					value={aovInput}
				/>
				<AmountField
					label="Your free shipping threshold"
					onChange={setThresholdInput}
					value={thresholdInput}
				/>
			</div>

			{/* One region, rewritten in place, so a screen reader hears the verdict
			    change rather than only the digits that caused it. */}
			<div
				aria-live="polite"
				className={cn(
					"flex flex-col justify-center rounded-3xl border p-6 shadow-xs sm:p-7",
					working
						? "border-emerald-200 bg-emerald-50/50"
						: "border-rose-200 bg-rose-50/50"
				)}
			>
				<h3
					className={cn(
						"font-bold font-satoshi text-xl tracking-tight sm:text-2xl",
						working ? "text-emerald-800" : "text-rose-800"
					)}
				>
					{working ? "The bar has a job." : "You are giving the reward away."}
				</h3>
				<p
					className={cn(
						"mt-3 text-sm leading-relaxed",
						working ? "text-emerald-900/80" : "text-rose-900/80"
					)}
				>
					{working
						? `A typical ${money(aov)} order needs ${money(gap)} more to unlock. That gap is what the progress bar sells.`
						: `At ${money(threshold)}, a typical ${money(aov)} order already qualifies. The bar has no work to do.`}
				</p>
			</div>
		</div>
	);
}
