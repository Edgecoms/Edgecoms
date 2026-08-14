import type { Metadata } from "next";
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
/**
 * The v1/v2 archives duplicate live pages almost word for word. A duplicate
 * that outranks the page it replaced is worse than no page at all, so they are
 * kept out of the index here as well as in robots.ts — robots.txt stops the
 * crawl, this stops indexing if the URL is reached another way.
 */
export const metadata: Metadata = {
	robots: { follow: false, index: false },
};

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
