import { AbsoluteFill, Series } from "remotion";
import { GridBg } from "@/components/grid-bg";
import { BOUNTIES_DURATION, Bounties } from "@/scenes/bounties";
import { CLOSE_DURATION, Close } from "@/scenes/close";
import { EDGE_PARTNERS_DURATION, EdgePartners } from "@/scenes/edge-partners";
import { HEADLINE_DURATION, Headline } from "@/scenes/headline";
import { INTRODUCING_DURATION, Introducing } from "@/scenes/introducing";
import { PAID_FOR_EVERY_DURATION, PaidForEvery } from "@/scenes/paid-for-every";
import {
	PAYOUTS_DASHBOARD_DURATION,
	PayoutsDashboard,
} from "@/scenes/payouts-dashboard";
import { TESTIMONIAL_DURATION, Testimonial } from "@/scenes/testimonial";

const SCENES = [
	{ Component: Introducing, duration: INTRODUCING_DURATION, id: "introducing" },
	{
		Component: EdgePartners,
		duration: EDGE_PARTNERS_DURATION,
		id: "edge-partners",
	},
	{ Component: Headline, duration: HEADLINE_DURATION, id: "headline" },
	{
		Component: PaidForEvery,
		duration: PAID_FOR_EVERY_DURATION,
		id: "paid-for-every",
	},
	{
		Component: PayoutsDashboard,
		duration: PAYOUTS_DASHBOARD_DURATION,
		id: "payouts-dashboard",
	},
	{ Component: Bounties, duration: BOUNTIES_DURATION, id: "bounties" },
	{
		Component: Testimonial,
		duration: TESTIMONIAL_DURATION,
		id: "testimonial",
	},
	{ Component: Close, duration: CLOSE_DURATION, id: "close" },
] as const;

export const MAIN_DURATION = SCENES.reduce(
	(total, scene) => total + scene.duration,
	0
);

export const Main = () => (
	<AbsoluteFill>
		<GridBg />
		<Series>
			{SCENES.map(({ Component, duration, id }) => (
				<Series.Sequence durationInFrames={duration} key={id}>
					<Component />
				</Series.Sequence>
			))}
		</Series>
	</AbsoluteFill>
);
