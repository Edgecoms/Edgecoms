import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Superseded by a live page and kept only for reference. It duplicates that
 * page's copy closely enough that indexing it would split the ranking signal,
 * so it is excluded here as well as in robots.ts.
 */
export const metadata: Metadata = {
	robots: { follow: false, index: false },
};

export default function ArchivedRouteLayout({
	children,
}: {
	children: ReactNode;
}) {
	return children;
}
