import Image from "next/image";
import {
	DottedField,
	Frame,
	PartnersIcon,
	PILLARS,
} from "@/components/landing/frame";

/* The floating cards are the page's only decorative furniture. They carry real
   figures rather than lorem: each pair is one of the featured stories' own
   before/after readings, so a reader who zooms in finds something true. */
const LEFT_CARDS = [
	{ label: "Average order value", value: "$61 → $79" },
	{ label: "Revenue, same traffic", value: "$84k → $119k" },
] as const;

const RIGHT_CARDS = [
	{ label: "Subscriber lifetime value", value: "3.4×" },
	{ label: "Product page conversion", value: "+15%" },
] as const;

function FloatCard({
	className,
	label,
	value,
}: {
	className?: string;
	label: string;
	value: string;
}) {
	return (
		<div
			className={`flex w-[190px] flex-col gap-0.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 shadow-[0_6px_20px_-8px_rgba(0,0,0,0.15)] ${className ?? ""}`}
		>
			<span className="text-[11px] text-neutral-500">{label}</span>
			<span className="font-medium text-[15px] text-neutral-900">{value}</span>
		</div>
	);
}

export function Statement() {
	return (
		<section className="relative overflow-hidden border-neutral-200 border-b bg-white">
			<Frame className="relative overflow-hidden py-20 sm:py-28">
				<DottedField />

				{/* Hidden below `lg`: at 375px they would sit on top of the sentence
				    they are supposed to decorate. */}
				<div className="pointer-events-none absolute inset-y-0 left-6 hidden flex-col justify-center gap-6 lg:flex">
					{LEFT_CARDS.map((card, index) => (
						<FloatCard
							className={
								index % 2 === 0 ? "-rotate-3" : "translate-x-6 rotate-2"
							}
							key={card.label}
							label={card.label}
							value={card.value}
						/>
					))}
				</div>

				<div className="pointer-events-none absolute inset-y-0 right-6 hidden flex-col justify-center gap-6 lg:flex">
					{RIGHT_CARDS.map((card, index) => (
						<FloatCard
							className={
								index % 2 === 0 ? "rotate-3" : "-translate-x-6 -rotate-2"
							}
							key={card.label}
							label={card.label}
							value={card.value}
						/>
					))}
				</div>

				<div className="relative mx-auto flex max-w-[520px] flex-col gap-8 px-6 text-[26px] leading-[1.35] tracking-[-0.02em] sm:text-[30px]">
					<p className="font-medium text-neutral-900">
						Ecommerce isn&apos;t just about traffic.
						<br />
						It&apos;s about outcomes.
					</p>

					<p className="text-neutral-900">
						Edge is a studio of focused Shopify apps for{" "}
						<InlineChip pillar="apps" word="offers" />, better{" "}
						<InlineChip pillar="results" word="conversion" /> and revenue that{" "}
						<InlineChip pillar="partners" word="repeats" /> — all on the traffic
						you already pay for.
					</p>

					<p className="text-neutral-400">
						They install in minutes. They leave nothing behind. And most of them
						have a free plan.
					</p>
				</div>
			</Frame>
		</section>
	);
}

function InlineChip({
	pillar,
	word,
}: {
	pillar: keyof typeof PILLARS;
	word: string;
}) {
	return (
		<span className="whitespace-nowrap">
			{word}
			<Image
				alt=""
				className="ml-1.5 inline-block size-[0.8em] translate-y-[-0.05em] rounded-[4px] align-middle"
				height={64}
				src={PILLARS[pillar].icon}
				width={64}
			/>
		</span>
	);
}
