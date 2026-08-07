import { cn } from "@edgecoms/ui/lib/utils";
import Image from "next/image";
import type { ReactNode } from "react";

/**
 * SHARED CHROME FOR THE v3 HOMEPAGE.
 *
 * The page is deliberately light-only. Every surface below states its own
 * colour in absolute terms (`bg-white`, `text-neutral-900`) rather than through
 * the app's semantic tokens, because the reference this page copies has one
 * appearance and a dark variant of it does not exist. The rest of the site
 * still follows `--color-*` and still themes; nothing here leaks out.
 */

/** The 1080px column, with the hairline rules that run down both of its edges. */
export function Frame({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"mx-auto w-full max-w-[1080px] border-neutral-200 border-x",
				className
			)}
		>
			{children}
		</div>
	);
}

/**
 * The three pillars the page is organised around, each with the accent it owns.
 *
 * The colour is the only thing that tells a reader which of three near-identical
 * section layouts they are in, so it is carried all the way through: the eyebrow
 * icon, the active feature tab's left rule, and the link colour inside that tab.
 */
export const PILLARS = {
	apps: {
		accent: "#F97316",
		icon: "/app-icons/edge-bundles.webp",
		label: "Edge Apps",
	},
	results: {
		accent: "#16A34A",
		icon: "/app-icons/trackproof.webp",
		label: "Edge Results",
	},
	partners: {
		accent: "#7C3AED",
		icon: "/app-icons/edge-subscriptions.webp",
		label: "Edge Partners",
	},
} as const;

export type PillarKey = keyof typeof PILLARS;

/** Eyebrow: the pillar's icon and name, above every section headline. */
export function PillarEyebrow({ pillar }: { pillar: PillarKey }) {
	const { icon, label } = PILLARS[pillar];

	return (
		<p className="flex items-center gap-2 font-medium text-[13px] text-neutral-600">
			<Image
				alt=""
				className="size-[18px] rounded-[5px]"
				height={64}
				src={icon}
				width={64}
			/>
			{label}
		</p>
	);
}

/**
 * The dotted field the quote blocks and the statement sit on. 4px grid, faded
 * at the edges so it reads as texture under the type rather than as a border
 * the type is trapped inside.
 */
export function DottedField({ className }: { className?: string }) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				"pointer-events-none absolute inset-0 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]",
				className
			)}
		/>
	);
}

/** The square grid behind the hero and the closing panel. */
export function GridField({
	className,
	dark = false,
}: {
	className?: string;
	dark?: boolean;
}) {
	const line = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

	return (
		<div
			aria-hidden="true"
			className={cn("pointer-events-none absolute inset-0", className)}
			style={{
				backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
				backgroundSize: "64px 64px",
			}}
		/>
	);
}
