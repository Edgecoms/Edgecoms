import {
	Bricolage_Grotesque,
	Instrument_Sans,
	JetBrains_Mono,
} from "next/font/google";
import type { ReactNode } from "react";
import styles from "./offer.module.css";

/**
 * `opsz` is requested so the display face keeps its optical-size axis: the
 * same family draws a 5rem headline and a 1.05rem label, and without the axis
 * both would be cut from the small-size master.
 */
const display = Bricolage_Grotesque({
	axes: ["opsz"],
	display: "swap",
	subsets: ["latin"],
	variable: "--font-bricolage",
});
/**
 * The other two list their weights rather than taking the whole variable
 * range, and the list is the design's own. It matters for the mono face: the
 * design loads no regular weight, so its unweighted mono text (the launch
 * checklist, the footer number) is drawn in Medium. Offer a true 400 and the
 * browser would use it, and those lines would come out lighter than approved.
 */
const body = Instrument_Sans({
	display: "swap",
	subsets: ["latin"],
	variable: "--font-instrument",
	weight: ["400", "500", "600"],
});
const mono = JetBrains_Mono({
	display: "swap",
	subsets: ["latin"],
	variable: "--font-jetbrains",
	weight: ["500", "600"],
});

/**
 * Chrome for a page somebody lands on from an ad to buy one thing.
 *
 * The site's header and footer are left off on purpose. Every link in a site
 * nav is a way to leave the page without paying, so an offer page carries only
 * its own buttons. It still sits under the root layout, which is what keeps the
 * Meta pixel and the consent banner working without being mounted twice.
 *
 * The root `body` does not scroll (see `globals.css`), so each route group
 * supplies its own scroller. This one also owns the offer palette and type,
 * which is why the paper colour reaches the scrollbar gutter and the whole
 * viewport rather than stopping at the edge of the content.
 */
export default function OfferLayout({ children }: { children: ReactNode }) {
	return (
		<div
			className={`${display.variable} ${body.variable} ${mono.variable} ${styles.shell}`}
		>
			{children}
		</div>
	);
}
