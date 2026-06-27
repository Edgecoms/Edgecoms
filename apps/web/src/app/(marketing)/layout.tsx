import type { ReactNode } from "react";
import Footer from "@/components/layout/footer";
import FooterWordmark from "@/components/layout/footer-wordmark";
import Header from "@/components/layout/header";
import { ScrollableContainer } from "@/components/layout/scrollable-container";

export default function MarketingLayout({ children }: { children: ReactNode }) {
	return (
		<ScrollableContainer className="isolate">
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
