import { Check } from "lucide-react";
import { Ghost, Panel } from "./parts";

/* The drawing is the argument: the same purchases, seen two ways. The grey
   track is what a browser pixel manages to report, the brand track is what
   actually happened. Deliberately unlabelled with figures — the gap is a
   proportion the illustration suggests, not a statistic the site is claiming. */
const PIXEL_REPORTED = 0.68;

const PLATFORMS = ["Meta", "Google", "TikTok"] as const;

function Track({
	filled,
	label,
	tone,
	width,
}: {
	filled?: boolean;
	label: string;
	tone: "brand" | "grey";
	width: number;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex items-center justify-between">
				<span className="text-[10px] text-[var(--gray-11)]">{label}</span>
				{filled ? (
					<span className="grid size-4 place-items-center rounded-full bg-brand text-white shadow-[0_4px_10px_var(--orange-a7)]">
						<Check aria-hidden="true" className="size-2.5" strokeWidth={3} />
					</span>
				) : (
					<span className="text-[9px] text-[var(--gray-9)] uppercase tracking-[0.1em]">
						Gaps
					</span>
				)}
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-[var(--gray-3)]">
				<div
					className={`h-full rounded-full ${tone === "brand" ? "bg-brand" : "bg-[var(--gray-6)]"}`}
					style={{ width: `${width * 100}%` }}
				/>
			</div>
		</div>
	);
}

export default function TrackproofDiagram() {
	return (
		<Panel className="w-[248px] px-4 py-4">
			<span className="font-medium text-[10px] text-[var(--gray-11)] uppercase tracking-[0.14em]">
				Purchases reported
			</span>

			<div className="mt-3.5 flex flex-col gap-3">
				<Track label="Browser pixel only" tone="grey" width={PIXEL_REPORTED} />
				<Track filled label="Pixel + server-side" tone="brand" width={1} />
			</div>

			<div className="mt-4 flex items-center gap-1.5 border-border border-t pt-3">
				{PLATFORMS.map((platform) => (
					<Ghost
						className="flex-1 py-1 text-[9px] tracking-[0.04em]"
						key={platform}
					>
						{platform}
					</Ghost>
				))}
			</div>

			<p className="mt-2 text-[9px] text-[var(--gray-11)] leading-relaxed">
				Deduplicated: one purchase, one conversion.
			</p>
		</Panel>
	);
}
