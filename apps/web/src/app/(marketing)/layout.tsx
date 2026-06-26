import type { ReactNode } from "react";
import Header from "@/components/layout/header";
import { ScrollableContainer } from "@/components/layout/scrollable-container";

export default function MarketingLayout({ children }: { children: ReactNode }) {
	return (
		<ScrollableContainer>
			<Header />
			{children}
		</ScrollableContainer>
	);
}
