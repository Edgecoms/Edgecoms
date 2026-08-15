import { AbsoluteFill } from "remotion";
import { COLOR } from "@/theme";

/** Grid pitch. Avatars snap to this so faces sit inside the graph-paper cells. */
export const CELL = 180;
const LINE = "#E6EAEF";

/** The faint 1px graph-paper grid every scene sits on. */
export const GridBg = ({ opacity = 0.55 }: { opacity?: number }) => (
	<AbsoluteFill style={{ backgroundColor: COLOR.canvas }}>
		<div
			style={{
				backgroundImage: `linear-gradient(to right, ${LINE} 1px, transparent 1px), linear-gradient(to bottom, ${LINE} 1px, transparent 1px)`,
				backgroundSize: `${CELL}px ${CELL}px`,
				inset: 0,
				maskImage:
					"linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
				opacity,
				position: "absolute",
			}}
		/>
	</AbsoluteFill>
);
