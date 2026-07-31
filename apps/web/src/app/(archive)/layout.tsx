import type { ReactNode } from "react";
import Header from "@/components/layout/header";
import { ScrollableContainer } from "@/components/layout/scrollable-container";
import Footer from "@/components/v1/footer";
import FooterWordmark from "@/components/v1/footer-wordmark";

/**
 * Frozen chrome for the archived v1 pages. This deliberately duplicates what
 * the marketing layout used to be — the footer and its sticky wordmark reveal
 * live in `components/v1` so redesigning the live site never disturbs the
 * comparison copy. Header is still the shared one, so it tracks the redesign.
 */
export default function ArchiveLayout({ children }: { children: ReactNode }) {
	return (
		<ScrollableContainer className="isolate" smooth>
			<Header />
			{/* opaque curtain: page content + footer text scroll up over the
			    sticky wordmark, revealing only it. */}
			<div className="relative z-10 bg-bg">
				{children}
				<Footer />
			</div>
			<FooterWordmark />
		</ScrollableContainer>
	);
}
