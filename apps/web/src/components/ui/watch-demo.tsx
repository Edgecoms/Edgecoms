"use client";

import {
	Dialog,
	DialogClose,
	DialogPopup,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "@edgecoms/ui/components/dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

/**
 * A "Watch demo" button and the lightbox behind it.
 *
 * The trigger's own styling stays with the caller, because the hero button on
 * /partners and the pair-of-buttons row on an app page are different shapes
 * that happen to open the same thing. Only the player is shared.
 *
 * Full-bleed popup rather than `DialogContent`: the video is the whole surface,
 * so a titled card around it is chrome the viewer has to look past. Same shape
 * the mobile nav sheet uses.
 */
export function WatchDemo({
	children,
	className,
	src,
	title,
}: {
	children: ReactNode;
	className: string;
	/** A file under `public/videos`. There is no fallback: a button that opens
	    an empty player is worse than one that is not rendered at all. */
	src: string;
	/** Named for screen readers, and never shown. */
	title: string;
}) {
	return (
		<Dialog>
			<DialogTrigger className={className}>{children}</DialogTrigger>
			<DialogPortal>
				<DialogPopup className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0">
					<DialogTitle className="sr-only">{title}</DialogTitle>
					<DialogClose className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
						<X className="size-4" />
						<span className="sr-only">Close</span>
					</DialogClose>
					{/* Autoplay is a courtesy, not the mechanism: the click that opened
					    the dialog is the user gesture browsers require, and `controls`
					    covers a policy blocking it anyway. */}
					{/* biome-ignore lint/a11y/useMediaCaption: no caption track authored yet */}
					<video
						autoPlay
						className="aspect-video w-full max-w-5xl rounded-xl bg-black"
						controls
						playsInline
						preload="metadata"
						src={src}
					/>
				</DialogPopup>
			</DialogPortal>
		</Dialog>
	);
}
