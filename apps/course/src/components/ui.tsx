import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { CURRENT_PRICE, LIST_PRICE, SHOW_STRUCK_PRICE } from "@/lib/content";

/** Joins class names, skipping the falsy ones. */
export function cx(...parts: (string | false | null | undefined)[]): string {
	return parts.filter(Boolean).join(" ");
}

/**
 * The one content column. Everything on the page sits inside this, so changing
 * the page's measure is a single edit here.
 */
export function Container({
	children,
	className,
	narrow = false,
}: {
	children: ReactNode;
	className?: string;
	narrow?: boolean;
}) {
	return (
		<div
			className={cx(
				"mx-auto w-full px-5 sm:px-8",
				narrow ? "max-w-3xl" : "max-w-6xl",
				className
			)}
		>
			{children}
		</div>
	);
}

type Tone = "dark" | "wash" | "paper";

/**
 * A full-bleed band. `tone` is the only thing that decides its colours, so a
 * section never has to restate the palette and the dark/light rhythm of the
 * page can be re-ordered by changing one prop per section.
 */
export function Section({
	children,
	className,
	id,
	tone = "dark",
}: {
	children: ReactNode;
	className?: string;
	id?: string;
	tone?: Tone;
}) {
	// `[--color-focus:...]` re-points the site-wide focus ring for everything
	// inside a light band. Mint measures 1.40:1 on white — effectively
	// invisible — and the FAQ's text-only buttons live on exactly that surface.
	const tones: Record<Tone, string> = {
		dark: "bg-ink text-paper",
		paper: "bg-paper text-ink [--color-focus:var(--color-ink)]",
		wash: "bg-accent-wash text-ink [--color-focus:var(--color-ink)]",
	};

	return (
		<section
			className={cx(
				"w-full scroll-mt-24 py-16 sm:py-24",
				tones[tone],
				className
			)}
			id={id}
		>
			{children}
		</section>
	);
}

/**
 * The centred section headline. Every band on the page opens with one, which is
 * what keeps a page this long legible at a scroll.
 */
export function SectionHeading({
	eyebrow,
	lead,
	title,
	tone = "dark",
}: {
	eyebrow?: string;
	lead?: ReactNode;
	title: ReactNode;
	tone?: Tone;
}) {
	const isDark = tone === "dark";

	return (
		<div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
			{eyebrow ? (
				<p
					className={cx(
						"font-semibold text-xs uppercase tracking-[0.18em]",
						isDark ? "text-accent" : "text-ink/60"
					)}
				>
					{eyebrow}
				</p>
			) : null}

			<h2 className="text-balance font-bold text-section">{title}</h2>

			{lead ? (
				<p
					className={cx(
						"max-w-xl text-pretty text-base leading-relaxed sm:text-lg",
						isDark ? "text-muted" : "text-ink/60"
					)}
				>
					{lead}
				</p>
			) : null}
		</div>
	);
}

const CTA_BASE =
	"inline-flex items-center justify-center gap-2 rounded-[10px] px-6 font-bold transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none";

const CTA_SIZES = {
	lg: "h-14 text-base sm:text-lg",
	md: "h-12 text-sm sm:text-base",
} as const;

/** The mint call to action. Black on mint clears AA comfortably. */
export function CtaLink({
	children,
	className,
	href,
	size = "lg",
	variant = "accent",
	...props
}: ComponentPropsWithoutRef<"a"> & {
	href: string;
	size?: keyof typeof CTA_SIZES;
	variant?: "accent" | "outline";
}) {
	const variants = {
		accent: "bg-accent text-accent-ink hover:bg-accent-dim",
		outline: "border border-ink-border bg-white/5 text-paper hover:bg-white/10",
	};

	return (
		<a
			className={cx(CTA_BASE, CTA_SIZES[size], variants[variant], className)}
			href={href}
			{...props}
		>
			{children}
		</a>
	);
}

export function CtaButton({
	children,
	className,
	size = "lg",
	...props
}: ComponentPropsWithoutRef<"button"> & { size?: keyof typeof CTA_SIZES }) {
	return (
		<button
			className={cx(
				CTA_BASE,
				CTA_SIZES[size],
				"bg-accent text-accent-ink hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-60",
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
}

/**
 * The price, everywhere it appears.
 *
 * A single component because `SHOW_STRUCK_PRICE` previously gated two sentences
 * while four separate components rendered the struck figure inline — so turning
 * the flag off removed the explanation and left the crossed-out price sitting
 * there on its own, which is worse than either state. Now the flag governs the
 * figure itself, in one place.
 *
 * The struck number is `aria-hidden` and paired with an `sr-only` sentence, so
 * a screen reader is told the relationship once in words rather than being read
 * a bare, unexplained figure.
 */
export function PriceTag({
	className,
	currentClassName = "font-bold text-4xl text-accent",
	listClassName = "font-semibold text-2xl text-muted-dark line-through decoration-2",
}: {
	className?: string;
	currentClassName?: string;
	listClassName?: string;
}) {
	return (
		<>
			<p className={cx("flex items-baseline gap-3", className)}>
				{SHOW_STRUCK_PRICE ? (
					<span aria-hidden="true" className={listClassName}>
						{LIST_PRICE}
					</span>
				) : null}
				<span className={currentClassName}>{CURRENT_PRICE}</span>
			</p>
			<span className="sr-only">
				{SHOW_STRUCK_PRICE
					? `Was ${LIST_PRICE}. Now ${CURRENT_PRICE}.`
					: `${CURRENT_PRICE} while the course is in beta.`}
			</span>
		</>
	);
}
