import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/components/landing/frame";
import { CASE_STUDIES } from "@/lib/marketing-stats";

const LOGO_CELLS = [
	{ borderClass: "border-r border-b border-neutral-200", slug: "vyssence" },
	{ borderClass: "border-b border-neutral-200", slug: "aurient" },
	{ borderClass: "border-r border-neutral-200", slug: "klyrolight" },
	{ borderClass: "", slug: "matataxplore" },
] as const;

interface Testimonial {
	authorName: string;
	authorRole: string;
	avatarUrl: string;
	highlightQuote: React.ReactNode;
	slug: keyof typeof CASE_STUDIES;
}

const TESTIMONIALS: Record<string, Testimonial> = {
	vyssence: {
		slug: "vyssence",
		authorName: "Sarah Chen",
		authorRole: "Head of E-commerce",
		avatarUrl:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
		highlightQuote: (
			<>
				&ldquo;Bundles turned our single-item orders into{" "}
				<strong className="font-semibold text-neutral-900">
					two-item orders
				</strong>
				. AOV is{" "}
				<strong className="font-semibold text-neutral-900">up 22%</strong> and
				we never touched ad spend.&rdquo;
			</>
		),
	},
	aurient: {
		slug: "aurient",
		authorName: "Marcus Vance",
		authorRole: "Founder",
		avatarUrl:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
		highlightQuote: (
			<>
				&ldquo;Subscriptions{" "}
				<strong className="font-semibold text-neutral-900">
					doubled our repeat purchase rate
				</strong>{" "}
				in a single quarter.&rdquo;
			</>
		),
	},
	matataxplore: {
		slug: "matataxplore",
		authorName: "Elena Rostova",
		authorRole: "Co-Founder & CEO",
		avatarUrl:
			"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80",
		highlightQuote: (
			<>
				&ldquo;We recovered the cost of Edge in{" "}
				<strong className="font-semibold text-neutral-900">
					less than two weeks
				</strong>
				. Our average order value{" "}
				<strong className="font-semibold text-neutral-900">
					increased by 18%
				</strong>
				.&rdquo;
			</>
		),
	},
};

function QuoteCell({
	className,
	testimonial,
}: {
	className?: string;
	testimonial: Testimonial;
}) {
	const study = CASE_STUDIES[testimonial.slug];

	return (
		<div
			className={`group relative flex flex-1 flex-col justify-between p-8 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-50/70 hover:via-indigo-50/30 hover:to-slate-50/50 sm:p-9 ${
				className ?? ""
			}`}
		>
			<div className="flex flex-col gap-5">
				{study.logo ? (
					<Image
						alt={study.brand}
						className="h-6 w-auto object-contain"
						height={96}
						src={study.logo}
						width={220}
					/>
				) : (
					<span className="font-semibold text-[18px] text-neutral-900">
						{study.brand}
					</span>
				)}
				<p className="text-[15px] text-neutral-600 leading-relaxed sm:text-[16px]">
					{testimonial.highlightQuote}
				</p>
			</div>

			<div className="mt-8 flex items-end justify-between gap-4">
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-1.5 font-medium text-[12px] text-neutral-700">
						<span className="flex size-4 items-center justify-center rounded-[4px] bg-[#F97316] font-bold text-[9px] text-white">
							A
						</span>
						<span>{study.brand.toLowerCase()}.link</span>
						<ArrowUpRight className="size-3 text-neutral-400" />
					</div>
					<div className="flex items-center gap-1.5 font-medium text-[12px] text-neutral-700">
						<span className="flex size-4 items-center justify-center rounded-[4px] bg-[#8B5CF6] font-bold text-[9px] text-white">
							❖
						</span>
						<span>edge.com/customers/{testimonial.slug}</span>
						<ArrowUpRight className="size-3 text-neutral-400" />
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex flex-col text-right">
						<span className="font-semibold text-[13px] text-neutral-900 leading-tight">
							{testimonial.authorName}
						</span>
						<span className="text-[11px] text-neutral-500 leading-tight">
							{testimonial.authorRole}, {study.brand}
						</span>
					</div>
					<Image
						alt={testimonial.authorName}
						className="size-10 rounded-xl object-cover shadow-2xs ring-1 ring-neutral-900/10"
						height={80}
						src={testimonial.avatarUrl}
						unoptimized
						width={80}
					/>
				</div>
			</div>
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
				<div className="grid grid-cols-1 lg:grid-cols-3">
					<div className="grid grid-cols-2 lg:col-span-1">
						{LOGO_CELLS.map((cell) => {
							const study = CASE_STUDIES[cell.slug];

							return (
								<Link
									className={`flex min-h-[140px] items-center justify-center p-8 transition-colors hover:bg-neutral-50 ${cell.borderClass}`}
									href={`/case-studies/${cell.slug}` as Route}
									key={cell.slug}
								>
									{study.logo ? (
										<Image
											alt={study.brand}
											className="h-7 w-auto object-contain opacity-100"
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
						className="border-neutral-200 border-t lg:col-span-2 lg:border-t-0 lg:border-l"
						testimonial={TESTIMONIALS.vyssence}
					/>
				</div>

				<div className="grid grid-cols-1 border-neutral-200 border-t lg:grid-cols-2">
					<QuoteCell
						className="border-neutral-200 border-b lg:border-r lg:border-b-0"
						testimonial={TESTIMONIALS.aurient}
					/>
					<QuoteCell testimonial={TESTIMONIALS.matataxplore} />
				</div>
			</Frame>
		</section>
	);
}
