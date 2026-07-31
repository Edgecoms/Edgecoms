import type { ReactNode } from "react";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { ScrollableContainer } from "@/components/layout/scrollable-container";

export default function MarketingLayout({ children }: { children: ReactNode }) {
	return (
		<ScrollableContainer className="isolate" smooth>
			<Header />
			<div className="bg-bg">
				{children}
				<Footer />
			</div>
		</ScrollableContainer>
	);
}
