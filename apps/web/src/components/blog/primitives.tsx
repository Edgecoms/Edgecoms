import { cn } from "@edgecoms/ui/lib/utils";
import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

/**
 * The pieces a post is built from.
 *
 * Everything here states its colours absolutely (`text-neutral-900`, `bg-white`)
 * rather than through the app's semantic tokens, because the blog sits in the
 * `(home)` route group behind `LandingNav`/`LandingFooter`, which are light-only
 * by design. See the note at the top of `landing/frame.tsx`.
 */

/**
 * The answer block at the very top of every post.
 *
 * This is the paragraph an AI Overview or a Perplexity citation lifts, so it has
 * to answer the title completely with no preceding context — it is written to be
 * read alone, and the border is there to stop a reader skipping it.
 */
export function Tldr({ children }: { children: ReactNode }) {
	return (
		<aside
			aria-label="Short answer"
			className="rounded-2xl border border-neutral-200 border-l-[#ff5e1f] border-l-[3px] bg-neutral-50 p-6"
		>
			<p className="font-medium font-satoshi text-[13px] text-neutral-500 uppercase tracking-[0.08em]">
				Short answer
			</p>
			<div className="mt-3 text-[17px] text-neutral-800 leading-relaxed [&>p]:m-0">
				{children}
			</div>
		</aside>
	);
}

/** An aside inside the body — a warning, a caveat, a "do this instead". */
export function Callout({
	children,
	title,
	tone = "neutral",
}: {
	children: ReactNode;
	title?: string;
	tone?: "neutral" | "warning";
}) {
	return (
		<aside
			className={cn(
				"my-8 rounded-xl border p-5",
				tone === "warning"
					? "border-amber-200 bg-amber-50"
					: "border-neutral-200 bg-neutral-50"
			)}
		>
			{title ? (
				<p className="font-satoshi font-semibold text-[15px] text-neutral-900">
					{title}
				</p>
			) : null}
			<div
				className={cn(
					"text-[15px] text-neutral-600 leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
					title && "mt-2"
				)}
			>
				{children}
			</div>
		</aside>
	);
}

/**
 * An inline source link.
 *
 * Every hard number on this blog carries one of these. The rule is the same one
 * `marketing-stats.ts` states for the rest of the site: a figure with no
 * fetchable source behind it does not get published, because a wrong stat on a
 * page claiming expertise costs more than the stat was ever worth.
 */
export function Cite({
	href,
	children,
}: {
	children: ReactNode;
	href: string;
}) {
	return (
		<a
			className="inline-flex items-baseline gap-0.5 text-[#ff5e1f] underline decoration-[#ff5e1f]/30 underline-offset-2 transition-colors hover:decoration-[#ff5e1f]"
			href={href}
			rel="noopener nofollow"
			target="_blank"
		>
			{children}
			<ExternalLink aria-hidden="true" className="size-3 shrink-0" />
		</a>
	);
}

/**
 * Worked arithmetic, marked as arithmetic.
 *
 * Numbers inside this block are a hypothesis the reader is invited to swap
 * their own figures into — not a claim about the world. That distinction is
 * load-bearing: `scripts/audit-content.ts` fails the build on any stat-shaped
 * string that has no citation next to it, and it skips the inside of this
 * component precisely because nothing in here is asserting a fact.
 *
 * Which means the rule for using it is strict. Put a calculation in here. Never
 * put a claim about real merchants in here to get it past the audit.
 */
export function Example({
	children,
	title = "Worked example",
}: {
	children: ReactNode;
	title?: string;
}) {
	return (
		<aside className="my-8 rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
			<p className="font-medium font-satoshi text-[13px] text-neutral-500 uppercase tracking-[0.08em]">
				{title}
			</p>
			<div className="mt-3 text-[15px] text-neutral-600 leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
				{children}
			</div>
			<p className="mt-4 border-neutral-100 border-t pt-3 text-[13px] text-neutral-400">
				Illustrative arithmetic. Swap in your own numbers — these are not our
				results or anyone else's.
			</p>
		</aside>
	);
}

/** A checked-on date under a competitor table. Pricing moves; the page shouldn't lie about when it last looked. */
export function CheckedOn({ date }: { date: string }) {
	return (
		<p className="mt-3 text-[13px] text-neutral-500 italic">
			Pricing and features checked on {date}. App Store listings change without
			notice — verify on the listing before you commit to a plan.
		</p>
	);
}
