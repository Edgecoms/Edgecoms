import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/components/landing/frame";
import { CASE_STUDIES, HOME_TESTIMONIALS } from "@/lib/marketing-stats";

/**
 * The customer wall.
 *
 * WARNING, carried over from `marketing-stats.ts` unchanged: every quote in
 * `HOME_TESTIMONIALS` was written by us and is attributed to a named, real
 * store. This section renders them exactly as the previous homepage did — it
 * adds no new fabrication — but shipping any of it still needs the merchant's
 * own words, their written permission, and a figure from their own dashboard.
 * Anything without all three gets deleted rather than softened.
 */
const [FIRST_QUOTE, SECOND_QUOTE, THIRD_QUOTE] = HOME_TESTIMONIALS;

const LOGO_CELLS = [
	{ slug: "vyssence" },
	{ slug: "aurient" },
	{ slug: "klyrolight" },
	{ slug: "matataxplore" },
] as const;

function QuoteCell({
	attribution,
	quote,
	slug,
}: {
	attribution: string;
	quote: string;
	slug: keyof typeof CASE_STUDIES;
}) {
	const study = CASE_STUDIES[slug];

	return (
		<div className="flex flex-col gap-6 p-8">
			{study.logo ? (
				<Image
					alt={study.brand}
					className="h-6 w-auto object-contain"
					height={96}
					src={study.logo}
					width={220}
				/>
			) : null}
			<p className="text-[16px] text-neutral-600 leading-relaxed">
				&ldquo;{quote}&rdquo;
			</p>
			<p className="mt-auto text-[13px] text-neutral-500">{attribution}</p>
		</div>
	);
}

export function Trusted() {
	return (
		<section className="bg-white">
			<Frame>
				<div className="flex flex-col items-center gap-6 px-6 py-20 text-center sm:py-24">
					<h2 className="max-w-[620px] text-balance font-medium text-[36px] text-neutral-900 leading-[1.08] tracking-[-0.03em] sm:text-[46px]">
						Trusted by growing Shopify brands
					</h2>
					<p className="max-w-[520px] text-pretty text-[17px] text-neutral-500 leading-relaxed">
						Supplements, beauty, home, apparel, pets and outdoor — stores whose
						storefronts you can open and check for yourself.
					</p>
					<Link
						className="mt-2 inline-flex h-10 items-center rounded-lg border border-neutral-200 bg-white px-5 font-medium text-[15px] text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
						href={"/case-studies" as Route}
					>
						View all customers
					</Link>
				</div>
			</Frame>

			<Frame className="border-neutral-200 border-t">
				<div className="grid grid-cols-1 divide-y divide-neutral-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
					<div className="grid grid-cols-2 divide-x divide-neutral-200 lg:col-span-2 lg:grid-cols-2 lg:grid-rows-2 lg:divide-y">
						{LOGO_CELLS.map((cell) => {
							const study = CASE_STUDIES[cell.slug];

							return (
								<Link
									className="flex min-h-[140px] items-center justify-center p-8 transition-colors hover:bg-neutral-50"
									href={`/case-studies/${cell.slug}` as Route}
									key={cell.slug}
								>
									{study.logo ? (
										<Image
											alt={study.brand}
											className="h-7 w-auto object-contain opacity-80"
											height={96}
											src={study.logo}
											width={220}
										/>
									) : (
										<span className="font-medium text-[15px] text-neutral-600">
											{study.brand}
										</span>
									)}
								</Link>
							);
						})}
					</div>

					<QuoteCell
						attribution={SECOND_QUOTE.attribution}
						quote={SECOND_QUOTE.quote}
						slug="vyssence"
					/>
				</div>
			</Frame>

			<Frame className="border-neutral-200 border-t">
				<div className="grid grid-cols-1 divide-y divide-neutral-200 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
					<QuoteCell
						attribution={THIRD_QUOTE.attribution}
						quote={THIRD_QUOTE.quote}
						slug="aurient"
					/>
					<QuoteCell
						attribution={FIRST_QUOTE.attribution}
						quote={FIRST_QUOTE.quote}
						slug="matataxplore"
					/>
				</div>
			</Frame>
		</section>
	);
}
