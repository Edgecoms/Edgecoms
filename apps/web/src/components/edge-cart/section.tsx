import { cn } from "@edgecoms/ui/lib/utils";
import type { ReactNode } from "react";
import { Frame } from "@/components/landing/frame";

/**
 * THE TOKENS THE EDGE CART LANDING PAGE IS BUILT FROM, STATED ONCE.
 *
 * Every value below is lifted verbatim from the surfaces this page has to sit
 * next to — the existing hero on this route and the Trackproof page, which is
 * the longest app page in the site today. Nothing here is a new design
 * decision; it is the existing one written down so fourteen sections cannot
 * drift apart one paste at a time.
 *
 * Light-only on purpose, same as `landing/frame.tsx`: this whole route group
 * states its colours absolutely rather than through the semantic `--color-*`
 * tokens, because the layout it lives in has one appearance.
 */

/** The section band: full width, hairline rule underneath, white. */
export function Section({
	children,
	className,
	id,
}: {
	children: ReactNode;
	className?: string;
	/** Anchor target. Offset for the 72px sticky nav is applied here. */
	id?: string;
}) {
	return (
		<section
			className={cn(
				"relative w-full border-neutral-200 border-b bg-white",
				/* The nav is `sticky h-[72px]`, so an anchor landing flush at the
				   top of the viewport lands underneath it. */
				id && "scroll-mt-[88px]",
				className
			)}
			id={id}
		>
			<Frame className="py-16 sm:py-20">
				<div className="px-6 sm:px-8">{children}</div>
			</Frame>
		</section>
	);
}

/** The blue pill above every headline. Blue is Edge Cart's accent. */
export function Eyebrow({ children }: { children: ReactNode }) {
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 font-semibold text-blue-700 text-xs shadow-2xs">
			<span className="size-2 rounded-full bg-blue-600" />
			{children}
		</span>
	);
}

/**
 * Eyebrow, H2 and optional lede as one unit.
 *
 * Left-aligned by default. The reference pages centre only the FAQ, so
 * `centered` is the exception rather than a per-section choice.
 */
export function SectionHeading({
	centered = false,
	eyebrow,
	heading,
	lede,
}: {
	centered?: boolean;
	eyebrow: string;
	heading: string;
	lede?: string;
}) {
	return (
		<div
			className={cn("flex flex-col", centered && "items-center text-center")}
		>
			<div>
				<Eyebrow>{eyebrow}</Eyebrow>
			</div>
			<h2 className="mt-3 text-balance font-bold font-satoshi text-3xl text-neutral-900 leading-[1.1] tracking-tight sm:text-4xl lg:text-[42px]">
				{heading}
			</h2>
			{lede ? (
				<p
					className={cn(
						"mt-4 max-w-[680px] text-pretty text-neutral-500 text-sm leading-relaxed sm:text-base",
						centered && "mx-auto"
					)}
				>
					{lede}
				</p>
			) : null}
		</div>
	);
}

/** The card surface used by every grid on the page. */
export function Card({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-col rounded-3xl border border-neutral-200/80 bg-white/90 p-6 shadow-xs transition-colors hover:border-neutral-300 sm:p-7",
				className
			)}
		>
			{children}
		</div>
	);
}

/** The small grey line that closes most sections. */
export function Footnote({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<p
			className={cn(
				"mt-6 text-neutral-500 text-xs leading-relaxed sm:text-sm",
				className
			)}
		>
			{children}
		</p>
	);
}
