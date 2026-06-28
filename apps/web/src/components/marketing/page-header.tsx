import type { ReactNode } from "react";

interface PageHeaderProps {
	children?: ReactNode;
	eyebrow?: string;
	lead?: string;
	title: string;
}

/** Shared marketing page intro: eyebrow + display title + lead + optional CTAs. */
export function PageHeader({
	eyebrow,
	title,
	lead,
	children,
}: PageHeaderProps) {
	return (
		<div className="flex flex-col items-start gap-6">
			{eyebrow ? (
				<span className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.1em]">
					{eyebrow}
				</span>
			) : null}
			<h1 className="max-w-3xl text-balance font-medium text-display text-primary-foreground">
				{title}
			</h1>
			{lead ? (
				<p className="max-w-2xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
					{lead}
				</p>
			) : null}
			{children ? (
				<div className="flex flex-wrap items-center gap-3 pt-2">{children}</div>
			) : null}
		</div>
	);
}
