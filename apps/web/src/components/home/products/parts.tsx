import type { ReactNode } from "react";

/**
 * Shared vocabulary for the six app illustrations, so they read as one system
 * rather than six drawings: hairline surfaces, dashed placeholders, grey
 * skeleton copy, and exactly one brand-filled node per drawing to carry the
 * eye. Every colour is a theme token, so the whole set tracks the palette
 * instead of drifting from hardcoded hex.
 */

/** Dashed connector stroke — kept here so every drawing uses the same grey. */
export const CONNECTOR = "var(--gray-6)";

/** A hairline surface — the "real UI" fragment in a drawing. */
export function Panel({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`rounded-2xl border border-border bg-page shadow-[0_1px_2px_var(--gray-a3),0_10px_24px_var(--gray-a4)] ${className}`}
		>
			{children}
		</div>
	);
}

/** The single brand-filled node. One per illustration, never two. */
export function Focal({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`grid shrink-0 place-items-center rounded-xl bg-brand text-white shadow-[0_6px_18px_var(--orange-a7)] ${className}`}
		>
			{children}
		</div>
	);
}

/** A dashed placeholder — something the system knows about but isn't the point. */
export function Ghost({
	children,
	className = "",
}: {
	children?: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`grid shrink-0 place-items-center rounded-xl border border-border border-dashed text-[var(--gray-9)] ${className}`}
		>
			{children}
		</div>
	);
}

/** Skeleton copy. Width comes from the caller so lines can vary. */
export function Bar({ className = "" }: { className?: string }) {
	return (
		<div className={`h-1.5 rounded-full bg-[var(--gray-4)] ${className}`} />
	);
}
