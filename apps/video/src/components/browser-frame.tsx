import type { ReactNode } from "react";
import { MONO_STACK } from "@/fonts";
import { COLOR } from "@/theme";

export interface BrowserFrameProps {
	children?: ReactNode;
	height: number;
	/** 0–1 across the top of the chrome. Omit for no loading bar. */
	progress?: number;
	url: string;
	width: number;
}

/** Browser chrome with an optional loading bar. Content fills the viewport. */
export const BrowserFrame = ({
	children,
	url,
	width,
	height,
	progress,
}: BrowserFrameProps) => (
	<div
		style={{
			backgroundColor: "#FFFFFF",
			border: "1px solid #E6EAEF",
			borderRadius: 18,
			height,
			overflow: "hidden",
			width,
		}}
	>
		<div
			style={{
				alignItems: "center",
				backgroundColor: "#F7F8FA",
				borderBottom: "1px solid #E6EAEF",
				display: "flex",
				height: 62,
				justifyContent: "center",
				position: "relative",
			}}
		>
			{progress === undefined ? null : (
				<div
					style={{
						backgroundColor: COLOR.accent,
						height: 4,
						left: 0,
						position: "absolute",
						top: 0,
						width: `${progress * 100}%`,
					}}
				/>
			)}
			<span
				style={{
					color: COLOR.inkMuted,
					fontFamily: MONO_STACK,
					fontSize: 22,
				}}
			>
				{url}
			</span>
		</div>
		<div style={{ height: height - 62, position: "relative" }}>{children}</div>
	</div>
);

/**
 * Where the Edge Partners dashboard screenshot goes. Renders as an empty
 * surface until a real capture is supplied — never a mocked-up dashboard.
 */
export const DashboardSurface = () => (
	<div style={{ backgroundColor: "#FCFCFD", height: "100%", width: "100%" }} />
);
