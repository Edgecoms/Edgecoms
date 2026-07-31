"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { DIAGRAMS } from "@/components/home/products/diagrams";
import { AppIcon } from "@/components/ui/app-icon";
import { Highlight } from "@/components/ui/highlight";
import {
	APP_RESULT_BADGES,
	SHOW_PLACEHOLDER_PROOF,
} from "@/lib/marketing-stats";
import { type EdgeProduct, getProduct, JOURNEY } from "@/lib/products";

/**
 * An explorer for the suite: the visit down the left, the app that acts at each
 * point on the right.
 *
 * Built as a real ARIA tablist rather than a row of divs with click handlers.
 * The list is a set of alternative views of one panel, which is exactly what
 * tabs are for — and it means arrow keys move between steps, the panel is
 * announced when it changes, and the whole thing works without a mouse.
 */

interface JourneyStep {
	product: EdgeProduct;
	stage: string;
}

const STEPS: JourneyStep[] = JOURNEY.flatMap((entry) => {
	const product = getProduct(entry.slug);
	return product ? [{ product, stage: entry.stage }] : [];
});

/**
 * A real screenshot when the app has one, the schematic diagram until then.
 * The diagram is not a placeholder to be embarrassed about — it explains the
 * mechanism without the noise of a real admin, which is often the better
 * teaching image anyway. Swap it per app as the screenshots get taken.
 */
function StepVisual({ product }: { product: EdgeProduct }) {
	// A comp is withheld outside development, which drops this app back to its
	// diagram in a production build. Assigning to a local rather than testing the
	// property inline is what lets TypeScript narrow it to a string below.
	const withheld = product.screenshotIsComp && !SHOW_PLACEHOLDER_PROOF;
	const screenshot = withheld ? undefined : product.screenshot;

	if (screenshot) {
		return (
			<Image
				alt={`${product.name} running in a store`}
				className="h-auto w-full object-contain"
				height={720}
				sizes="(max-width: 1024px) 100vw, 560px"
				src={screenshot}
				width={960}
			/>
		);
	}

	/* The wrapper is full-width so the screenshot branch can fill the panel, so
	   the diagram needs its own centring rather than inheriting the panel's. */
	return (
		<div className="flex justify-center">
			<div className="scale-110 sm:scale-125">{DIAGRAMS[product.slug]}</div>
		</div>
	);
}

/** Arrow keys move between tabs; Home and End jump to the ends. */
function nextIndex(key: string, current: number, total: number): number | null {
	if (key === "ArrowDown" || key === "ArrowRight") {
		return (current + 1) % total;
	}
	if (key === "ArrowUp" || key === "ArrowLeft") {
		return (current - 1 + total) % total;
	}
	if (key === "Home") {
		return 0;
	}
	if (key === "End") {
		return total - 1;
	}
	return null;
}

export function JourneyExplorer() {
	const [active, setActive] = useState(0);
	const baseId = useId();
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

	const step = STEPS[active];
	if (!step) {
		return null;
	}

	const badge = APP_RESULT_BADGES[step.product.slug];

	const handleKeyDown = (event: React.KeyboardEvent) => {
		const target = nextIndex(event.key, active, STEPS.length);
		if (target === null) {
			return;
		}
		event.preventDefault();
		setActive(target);
		// Roving focus follows selection, so the panel a keyboard user is reading
		// is always the one their focus is on.
		tabRefs.current[target]?.focus();
	};

	return (
		<section aria-labelledby="journey-heading" className="w-full py-24">
			<div className="mx-auto w-full max-w-7xl px-6">
				<div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
					<p className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.14em]">
						One visit, seven surfaces
					</p>
					<h2
						className="text-balance font-medium text-display text-primary-foreground"
						id="journey-heading"
					>
						<Highlight>
							Every step of a visit has a number attached to it
						</Highlight>
					</h2>
					<p className="text-pretty text-body-lg text-secondary-foreground leading-relaxed">
						Each app works at a different point between landing and buying
						again. Pick a moment to see what happens there.
					</p>
				</div>

				<div className="mt-16 grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
					<div
						aria-label="Steps in a visit"
						aria-orientation="vertical"
						className="flex flex-col"
						onKeyDown={handleKeyDown}
						role="tablist"
					>
						{STEPS.map((entry, index) => {
							const selected = index === active;
							return (
								<button
									aria-controls={`${baseId}-panel`}
									aria-selected={selected}
									className={`flex flex-col items-start gap-1.5 border-border border-b py-5 text-left transition-colors first:border-t ${selected ? "" : "hover:bg-page"}`}
									id={`${baseId}-tab-${entry.product.slug}`}
									key={entry.product.slug}
									onClick={() => setActive(index)}
									ref={(node) => {
										tabRefs.current[index] = node;
									}}
									role="tab"
									tabIndex={selected ? 0 : -1}
									type="button"
								>
									<span
										className={`font-medium font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${selected ? "text-brand" : "text-secondary-foreground"}`}
									>
										{entry.stage}
									</span>
									<span className="flex items-center gap-2.5 font-medium text-h3 text-primary-foreground">
										<AppIcon product={entry.product} size="sm" />
										{entry.product.name}
									</span>
									{/* Only the open step carries its description, so the column
									    stays scannable instead of becoming seven paragraphs. */}
									{selected ? (
										<span className="mt-1 max-w-md text-pretty text-body-sm text-secondary-foreground leading-relaxed">
											<Highlight>{entry.product.tagline}</Highlight>
										</span>
									) : null}
								</button>
							);
						})}
					</div>

					<div
						aria-labelledby={`${baseId}-tab-${step.product.slug}`}
						className="lg:sticky lg:top-24"
						id={`${baseId}-panel`}
						role="tabpanel"
						tabIndex={-1}
					>
						<div className="relative isolate flex min-h-[380px] items-center justify-center overflow-hidden rounded-[2rem] border border-border bg-bg lg:min-h-[480px]">
							<div
								aria-hidden="true"
								className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a4)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_80%)]"
							/>
							{/* Keyed on the slug so React replaces the subtree rather than
							    diffing one diagram into another. The drawings share no
							    structure, so there is nothing worth reusing, and a fresh
							    subtree is what makes the fade-in fire on every change. */}
							<div
								className="fade-in w-full animate-in duration-300"
								key={step.product.slug}
							>
								<StepVisual product={step.product} />
							</div>
						</div>

						<div className="mt-6 flex flex-wrap items-center justify-between gap-4">
							<div className="flex flex-col gap-2">
								{badge ? (
									<span className="w-fit rounded-full bg-brand/12 px-2.5 py-1 font-medium font-mono text-[11px] text-brand uppercase tracking-[0.08em]">
										{badge.value}
									</span>
								) : null}
								<p className="max-w-md text-pretty text-body-sm text-secondary-foreground leading-relaxed">
									{step.product.heroLead}
								</p>
							</div>
							<Link
								className="shrink-0 text-body-sm text-primary-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
								href={`/products/${step.product.slug}` as Route}
							>
								See {step.product.name}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
