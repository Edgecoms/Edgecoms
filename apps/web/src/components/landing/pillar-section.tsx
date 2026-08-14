import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { type Feature, FeatureTabs } from "@/components/landing/feature-tabs";
import {
	DottedField,
	Frame,
	PillarEyebrow,
	type PillarKey,
} from "@/components/landing/frame";

export interface PillarQuote {
	/** Role and store, in that order. */
	attribution: string;
	/** The merchant's wordmark, under `public/case-studies/`. */
	logo?: string;
	logoAlt?: string;
	quote: string;
}

/**
 * One of the three product sections. Header, graphic, three-up feature row,
 * quote — in that order, three times, so the reader learns the shape once and
 * then only has to read the content.
 *
 * The graphic is a slot rather than a prop because each section's is a
 * different kind of thing (a tile field, a funnel, a stack of reward cards) and
 * flattening those into one configurable component would cost more than the
 * three separate ones do.
 */
export function PillarSection({
	children,
	cta,
	ctaHref,
	description,
	features,
	pillar,
	quote,
	title,
}: {
	/** The section's visual. Optional: a pillar can stand on its features alone. */
	children?: ReactNode;
	cta: string;
	ctaHref: string;
	description: string;
	features: readonly Feature[];
	pillar: PillarKey;
	quote: PillarQuote;
	title: string;
}) {
	return (
		<section className="w-full overflow-hidden border-neutral-200 border-b bg-white">
			<Frame>
				<div className="flex flex-col gap-6 px-6 pt-20 pb-14 sm:pt-24">
					<PillarEyebrow pillar={pillar} />
					<h2 className="max-w-[620px] text-balance font-medium text-[36px] text-neutral-900 leading-[1.08] tracking-[-0.03em] sm:text-[46px]">
						{title}
					</h2>
					<p className="max-w-[560px] text-pretty text-[17px] text-neutral-500 leading-relaxed">
						{description}
					</p>
					<Link
						className="mt-2 inline-flex h-10 w-fit items-center rounded-lg border border-neutral-200 bg-white px-5 font-medium text-[15px] text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
						href={ctaHref as Route}
					>
						{cta}
					</Link>
				</div>
			</Frame>

			{children ? <Frame>{children}</Frame> : null}

			<Frame>
				<FeatureTabs features={features} pillar={pillar} />
			</Frame>

			<div className="w-full border-neutral-200 border-t">
				<Frame className="relative overflow-hidden">
					<DottedField />
					<figure className="relative flex flex-col items-center justify-center gap-6 px-6 py-14 text-center lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:py-16 lg:text-left">
						<blockquote className="max-w-[720px] text-balance text-center font-normal text-[20px] text-neutral-900 leading-[1.4] tracking-[-0.02em] sm:text-[26px] lg:text-left">
							&ldquo;{quote.quote}&rdquo;
						</blockquote>
						<figcaption className="flex shrink-0 flex-col items-center justify-center gap-2 text-center lg:items-end lg:text-right">
							{quote.logo ? (
								<Image
									alt={quote.logoAlt ?? ""}
									className="h-6 w-auto object-contain lg:self-end"
									height={96}
									src={quote.logo}
									width={220}
								/>
							) : null}
							<span className="text-center text-[14px] text-neutral-500 lg:text-right">
								{quote.attribution}
							</span>
						</figcaption>
					</figure>
				</Frame>
			</div>
		</section>
	);
}
