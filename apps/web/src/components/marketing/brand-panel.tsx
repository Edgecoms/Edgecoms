import type { ReactNode } from "react";
import { PanelTexture } from "@/components/home/panel-texture";

/**
 * The orange surface, shared by the page heroes: brand fill, flickering grid,
 * and the warm glow rising off the bottom edge. Content is rendered above the
 * decoration, so callers never have to remember the `relative` themselves.
 *
 * The closing CTA panel does not use this — its rail has to sit outside the
 * content stack and its glow stops short at the rail's height.
 */
export function BrandPanel({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`relative isolate overflow-hidden rounded-[2rem] bg-brand ${className}`}
		>
			<PanelTexture />
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_30%_82%_at_50%_112%,rgba(255,232,178,0.95),transparent_66%),radial-gradient(ellipse_58%_66%_at_50%_116%,rgba(255,198,138,0.5),transparent_72%)]"
			/>
			{/* `w-full min-w-0` is load-bearing. Callers pass flex classes on the
			    panel, which makes this a flex item — and a flex item defaults to
			    `min-width: auto`, so it refuses to shrink below its content's
			    min-content width. On a narrow screen that made the content wider
			    than the panel and the panel's own `overflow-hidden` then clipped
			    the copy off both edges. */}
			<div className="relative w-full min-w-0">{children}</div>
		</div>
	);
}
