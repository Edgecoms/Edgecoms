import type React from "react";

const CARD_SHADOW = "0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.035)";

const BoxIcon = () => (
	<svg
		aria-hidden="true"
		fill="none"
		height="27"
		stroke="#1c1c1e"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.7}
		viewBox="0 0 24 24"
		width="27"
	>
		<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
		<path d="m3.3 7 8.7 5 8.7-5" />
		<path d="M12 22V12" />
	</svg>
);

const DatabaseIcon = () => (
	<svg
		aria-hidden="true"
		fill="none"
		height="27"
		stroke="#1c1c1e"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.7}
		viewBox="0 0 24 24"
		width="27"
	>
		<ellipse cx="12" cy="5" rx="9" ry="3" />
		<path d="M3 5V19A9 3 0 0 0 21 19V5" />
		<path d="M3 12A9 3 0 0 0 21 12" />
	</svg>
);

const LayersIcon = () => (
	<svg
		aria-hidden="true"
		fill="none"
		height="27"
		stroke="#EF5F37"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.7}
		viewBox="0 0 24 24"
		width="27"
	>
		<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
		<path d="M2 12.5a1 1 0 0 0 .58.91l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9A1 1 0 0 0 22 12.5" />
		<path d="M2 17a1 1 0 0 0 .58.91l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9A1 1 0 0 0 22 17" />
	</svg>
);

const TrendingUpIcon = () => (
	<svg
		aria-hidden="true"
		fill="none"
		height="30"
		stroke="#EF5F37"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={2}
		viewBox="0 0 24 24"
		width="30"
	>
		<path d="M16 7h6v6" />
		<path d="m22 7-8.5 8.5-5-5L2 17" />
	</svg>
);

const IconTile: React.FC<{ bg: string; children: React.ReactNode }> = ({
	bg,
	children,
}) => (
	<div
		style={{
			width: 52,
			height: 52,
			borderRadius: 14,
			background: bg,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexShrink: 0,
		}}
	>
		{children}
	</div>
);

export default function BundleFlowDiagram() {
	return (
		<div
			style={{
				width: 615,
				height: 665,
				position: "relative",
				fontFamily:
					"-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Helvetica,Arial,sans-serif",
				WebkitFontSmoothing: "antialiased",
			}}
		>
			{/* Dashed connectors */}
			<svg
				aria-hidden="true"
				fill="none"
				height="665"
				style={{ position: "absolute", inset: 0, zIndex: 0 }}
				viewBox="0 0 615 665"
				width="615"
			>
				<g
					fill="none"
					stroke="#CFCFCF"
					strokeDasharray="5 5"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
				>
					<path d="M186 172 V199 a4 4 0 0 0 4 4 H331" />
					<path d="M471 172 V199 a4 4 0 0 1 -4 4 H331" />
					<path d="M331 203 V240" />
					<path d="M331 272 V315" />
					<path d="M331 437 V534" />
				</g>
				<g
					fill="none"
					stroke="#CFCFCF"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
				>
					<path d="M325.5 311 L331 317 L336.5 311" />
					<path d="M325.5 530 L331 536 L336.5 530" />
				</g>
			</svg>

			{/* Product A */}
			<div
				style={{
					position: "absolute",
					left: 75,
					top: 67,
					width: 223,
					height: 105,
					zIndex: 1,
					background: "#fff",
					border: "1px solid #EDEDED",
					borderRadius: 18,
					boxShadow: CARD_SHADOW,
					display: "flex",
					alignItems: "center",
					gap: 18,
					padding: "0 24px",
				}}
			>
				<IconTile bg="#F3F3F4">
					<BoxIcon />
				</IconTile>
				<div>
					<div
						style={{
							fontSize: 22,
							fontWeight: 600,
							color: "#1c1c1e",
							letterSpacing: "-0.01em",
						}}
					>
						Product A
					</div>
					<div style={{ fontSize: 19, color: "#8a8a8e", marginTop: 3 }}>
						$49
					</div>
				</div>
			</div>

			{/* Product B */}
			<div
				style={{
					position: "absolute",
					left: 360,
					top: 67,
					width: 223,
					height: 105,
					zIndex: 1,
					background: "#fff",
					border: "1px solid #EDEDED",
					borderRadius: 18,
					boxShadow: CARD_SHADOW,
					display: "flex",
					alignItems: "center",
					gap: 18,
					padding: "0 24px",
				}}
			>
				<IconTile bg="#F3F3F4">
					<DatabaseIcon />
				</IconTile>
				<div>
					<div
						style={{
							fontSize: 22,
							fontWeight: 600,
							color: "#1c1c1e",
							letterSpacing: "-0.01em",
						}}
					>
						Product B
					</div>
					<div style={{ fontSize: 19, color: "#8a8a8e", marginTop: 3 }}>
						$39
					</div>
				</div>
			</div>

			{/* Plus node */}
			<div
				style={{
					position: "absolute",
					left: 313,
					top: 238,
					width: 36,
					height: 36,
					zIndex: 2,
					background: "#fff",
					border: "1px solid #E5E5E5",
					borderRadius: "50%",
					boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<svg
					aria-hidden="true"
					fill="none"
					height="16"
					stroke="#6e6e73"
					strokeLinecap="round"
					strokeWidth={2}
					viewBox="0 0 24 24"
					width="16"
				>
					<path d="M12 5v14M5 12h14" />
				</svg>
			</div>

			{/* Bundle */}
			<div
				style={{
					position: "absolute",
					left: 145,
					top: 318,
					width: 373,
					height: 120,
					zIndex: 1,
					background: "#FFF5F1",
					border: "1.5px solid #F1916F",
					borderRadius: 20,
					boxShadow:
						"0 1px 2px rgba(242,104,63,0.08), 0 8px 20px rgba(242,104,63,0.07)",
					display: "flex",
					alignItems: "center",
					gap: 18,
					padding: "0 26px",
				}}
			>
				<IconTile bg="#FBDDD1">
					<LayersIcon />
				</IconTile>
				<div>
					<div
						style={{
							fontSize: 22,
							fontWeight: 600,
							color: "#1c1c1e",
							letterSpacing: "-0.01em",
						}}
					>
						Bundle
					</div>
					<div style={{ fontSize: 19, color: "#5e5e63", marginTop: 3 }}>
						$79
					</div>
				</div>
				<div
					style={{
						marginLeft: "auto",
						border: "1px solid #F3A487",
						background: "#fff",
						color: "#EF5F37",
						borderRadius: 11,
						padding: "8px 15px",
						fontSize: 16,
						fontWeight: 600,
						whiteSpace: "nowrap",
					}}
				>
					Save 11%
				</div>
			</div>

			{/* Higher AOV */}
			<div
				style={{
					position: "absolute",
					left: 155,
					top: 537,
					width: 350,
					height: 90,
					zIndex: 1,
					background: "#fff",
					border: "1px solid #EDEDED",
					borderRadius: 18,
					boxShadow: CARD_SHADOW,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "0 32px",
				}}
			>
				<div
					style={{
						fontSize: 22,
						fontWeight: 600,
						color: "#1c1c1e",
						letterSpacing: "-0.01em",
					}}
				>
					Higher AOV
				</div>
				<TrendingUpIcon />
			</div>
		</div>
	);
}
