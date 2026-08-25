import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { cx } from "@/components/ui";
import { IMAGES, type ImageKey } from "@/lib/images";

/**
 * Renders an image slot: the real asset once `src` is set in `lib/images.ts`,
 * a labelled placeholder until then.
 *
 * The placeholder reserves the slot's exact aspect ratio, so dropping the real
 * file in causes no layout shift and the page you are approving now is the page
 * that ships. It also prints the slot key and the brief, so whoever is
 * supplying assets can read what is wanted straight off the page instead of
 * cross-referencing a spreadsheet.
 */
export function SlotImage({
	className,
	imageKey,
	priority = false,
	rounded = "2xl",
	sizes,
	tone = "dark",
}: {
	className?: string;
	imageKey: ImageKey;
	/** Set on the hero image only — it is the LCP element. */
	priority?: boolean;
	rounded?: "none" | "lg" | "2xl" | "full";
	sizes?: string;
	tone?: "dark" | "light";
}) {
	const slot = IMAGES[imageKey];

	const radius = {
		"2xl": "rounded-2xl",
		full: "rounded-full",
		lg: "rounded-lg",
		none: "",
	}[rounded];

	if (slot.src) {
		return (
			<Image
				alt={slot.alt}
				className={cx(radius, "h-auto w-full object-cover", className)}
				height={slot.height}
				priority={priority}
				sizes={sizes}
				src={slot.src}
				width={slot.width}
			/>
		);
	}

	const isDark = tone === "dark";

	return (
		<div
			aria-hidden="true"
			className={cx(
				"flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed p-6 text-center",
				radius,
				isDark
					? "border-accent/25 bg-accent/[0.04] text-muted"
					: "border-ink/15 bg-ink/[0.03] text-ink/50",
				className
			)}
			// Reserving the real ratio is the whole point: approve this layout and
			// the layout does not move when the photograph arrives.
			style={{ aspectRatio: `${slot.width} / ${slot.height}` }}
		>
			<ImageIcon
				className={cx("size-6", isDark ? "text-accent/50" : "text-ink/30")}
			/>
			<p
				className={cx(
					"font-mono text-[11px] tracking-tight",
					isDark ? "text-accent/70" : "text-ink/50"
				)}
			>
				{imageKey} · {slot.width}×{slot.height}
			</p>
			<p className="max-w-sm text-pretty text-xs leading-relaxed">
				{slot.hint}
			</p>
		</div>
	);
}
