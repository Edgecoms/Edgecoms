import { Composition } from "remotion";
import { MAIN_DURATION, Main } from "@/main";
import { CANVAS } from "@/theme";
import "./fonts";
import "./index.css";

export const RemotionRoot: React.FC = () => (
	<Composition
		component={Main}
		durationInFrames={MAIN_DURATION}
		fps={CANVAS.fps}
		height={CANVAS.height}
		id="EdgePartnersLaunch"
		width={CANVAS.width}
	/>
);
