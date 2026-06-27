import { WordmarkReveal } from "@/components/layout/wordmark-reveal";
import { WordMark } from "@/components/ui/word-mark";

/**
 * The sticky reveal layer. It sits behind the page content (z-0) and is the
 * ONLY thing the curtain uncovers — the footer nav/copyright scroll normally
 * as part of the opaque content above it.
 */
export default function FooterWordmark() {
	return (
		<div className="sticky bottom-0 z-0 w-full" data-reveal-layer>
			<div className="mx-auto w-full max-w-7xl px-6 pb-10">
				{/* WordmarkReveal is the optional elastic ease; remove it and render
				    <WordMark /> directly for the pure CSS reveal. */}
				<WordmarkReveal>
					<WordMark className="h-auto w-full text-primary-foreground [filter:drop-shadow(0_18px_40px_rgba(0,0,0,0.22))_drop-shadow(0_4px_8px_rgba(0,0,0,0.12))]" />
				</WordmarkReveal>
			</div>
		</div>
	);
}
