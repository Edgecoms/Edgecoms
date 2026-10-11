import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/seo";
import { STORE_SETUP_PLANS } from "@/lib/store-setup";

/**
 * The social card for `/store-setup`.
 *
 * It borrows the page's look rather than the site-wide card's: warm paper,
 * near-black ink, and one stroke of highlighter yellow under the promise. An
 * ad for this offer and the unfurl of its link should read as the same thing.
 *
 * No custom font is loaded, for the reason given in the blog card: satori
 * cannot read the WOFF2 files the site ships, and a card in the system sans
 * beats one that fails to render.
 */

export const alt =
	"Store Setup by Edgecoms: your winning product and Shopify store in 7 days";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#FFFDF6";
const INK = "#16150F";
const MUTED = "#625E52";
const HIGHLIGHT = "#FFE14D";

const HEADLINE_WORDS = [
	"We",
	"find",
	"your",
	"winning",
	"product",
	"and",
	"build",
	"your",
	"store",
	"in",
] as const;

export default function StoreSetupOpengraphImage() {
	const { pro, basic } = STORE_SETUP_PLANS;

	return new ImageResponse(
		<div
			style={{
				alignItems: "flex-start",
				background: PAPER,
				color: INK,
				display: "flex",
				flexDirection: "column",
				height: "100%",
				justifyContent: "space-between",
				padding: "72px",
				width: "100%",
			}}
		>
			<div
				style={{
					color: MUTED,
					display: "flex",
					fontSize: "26px",
					fontWeight: 600,
					letterSpacing: "0.12em",
				}}
			>
				STORE SETUP · BY EDGECOMS
			</div>

			{/* Satori lays text out as flex items, so the headline is set word by
			    word. That is what lets the last two words carry the highlight and
			    still wrap as one unit. */}
			<div
				style={{
					columnGap: "20px",
					display: "flex",
					flexWrap: "wrap",
					fontSize: "82px",
					fontWeight: 700,
					letterSpacing: "-0.03em",
					lineHeight: 1.04,
					maxWidth: "1000px",
				}}
			>
				{HEADLINE_WORDS.map((word, index) => (
					// "your" appears twice, so the word alone is not a unique key.
					<span key={`${word}-${index}`}>{word}</span>
				))}
				<span
					style={{
						backgroundImage: `linear-gradient(to bottom, transparent 58%, ${HIGHLIGHT} 58%)`,
						padding: "0 6px",
					}}
				>
					7 days.
				</span>
			</div>

			<div
				style={{
					alignItems: "center",
					borderTop: `2px solid ${INK}`,
					display: "flex",
					fontSize: "28px",
					justifyContent: "space-between",
					paddingTop: "28px",
					width: "100%",
				}}
			>
				<div style={{ display: "flex", fontWeight: 600 }}>
					{pro.name} ${pro.priceUsd} · {basic.name} ${basic.priceUsd}, paid once
				</div>
				<div style={{ color: MUTED, display: "flex" }}>
					{new URL(SITE_URL).host}/store-setup
				</div>
			</div>
		</div>,
		size
	);
}
