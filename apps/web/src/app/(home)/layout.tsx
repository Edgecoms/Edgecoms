import type { ReactNode } from "react";
import { LandingFooter } from "@/components/landing/footer";
import { LandingNav } from "@/components/landing/nav";
import { ScrollableContainer } from "@/components/layout/scrollable-container";

/**
 * The homepage has its own chrome, separate from `(marketing)`.
 *
 * Not a stylistic preference — the v3 homepage is light-only by design, and its
 * nav and footer state their colours absolutely rather than through the app's
 * semantic tokens. Dropping that header onto the app pages, which still theme,
 * would give a dark-mode visitor a white bar above a dark page. Two route
 * groups both resolving to `/` would collide, so the homepage moves out of
 * `(marketing)` rather than the layout being forked in place.
 */
export default function HomeLayout({ children }: { children: ReactNode }) {
	return (
		<ScrollableContainer className="isolate" smooth>
			<div className="bg-white">
				<LandingNav />
				{children}
				<LandingFooter />
			</div>
		</ScrollableContainer>
	);
}
