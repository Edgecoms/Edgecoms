import { ImageResponse } from "next/og";

/**
 * The social card, generated at build time rather than maintained as a PNG.
 *
 * Every page inherits this unless it ships its own `opengraph-image`. It is
 * deliberately typographic: a card that states the product in words survives
 * being scaled into a Slack unfurl, where a screenshot does not.
 */

export const alt = "Edge · Shopify apps for revenue per visitor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
	return new ImageResponse(
		<div
			style={{
				alignItems: "flex-start",
				background: "#ffffff",
				backgroundImage:
					"radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)",
				backgroundSize: "32px 32px",
				display: "flex",
				flexDirection: "column",
				height: "100%",
				justifyContent: "space-between",
				padding: "72px",
				width: "100%",
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
				<div
					style={{
						alignItems: "center",
						background: "#0a0a0a",
						borderRadius: "14px",
						color: "#ffffff",
						display: "flex",
						fontSize: "34px",
						fontWeight: 700,
						height: "64px",
						justifyContent: "center",
						width: "64px",
					}}
				>
					E
				</div>
				<div style={{ color: "#0a0a0a", fontSize: "36px", fontWeight: 600 }}>
					Edgecoms
				</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
				<div
					style={{
						color: "#0a0a0a",
						fontSize: "68px",
						fontWeight: 700,
						letterSpacing: "-0.03em",
						lineHeight: 1.05,
						maxWidth: "900px",
					}}
				>
					Turn the traffic you already have into revenue.
				</div>
				<div
					style={{
						color: "#525252",
						fontSize: "30px",
						lineHeight: 1.35,
						maxWidth: "820px",
					}}
				>
					Seven focused Shopify apps for order value, conversion rate, and
					revenue that repeats.
				</div>
			</div>

			<div
				style={{
					borderTop: "1px solid #e5e7eb",
					color: "#737373",
					display: "flex",
					fontSize: "26px",
					paddingTop: "28px",
					width: "100%",
				}}
			>
				edgecoms.app
			</div>
		</div>,
		size
	);
}
