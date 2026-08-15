import { AbsoluteFill } from "remotion";
import { Typewriter } from "@/components/remocn/typewriter";
import { COLOR } from "@/theme";

/** 18–19s. Everything clears; one line on the grid. */
export const TURN_DURATION = 30;

export const Turn = () => (
	<AbsoluteFill className="items-center justify-center">
		<Typewriter
			charsPerSecond={26}
			color={COLOR.ink}
			cursor={false}
			fontSize={104}
			fontWeight={700}
			text="The best part?"
		/>
	</AbsoluteFill>
);
