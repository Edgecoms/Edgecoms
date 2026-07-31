import { BadgeCheck, Star } from "lucide-react";
import { Bar, Panel } from "./parts";

const STARS = ["s1", "s2", "s3", "s4", "s5"];
const AVATARS = ["a1", "a2", "a3"];

export default function ReviewsDiagram() {
	return (
		<div className="relative w-[248px] pt-4">
			{/* Verified badge breaks the panel edge, so the drawing reads as
			    layered UI rather than a flat card. */}
			<div className="absolute top-0 right-2 z-10 flex items-center gap-1.5 rounded-full border border-border bg-page px-2.5 py-1 shadow-[0_1px_2px_var(--gray-a3),0_6px_14px_var(--gray-a4)]">
				<BadgeCheck aria-hidden="true" className="size-3.5 text-brand" />
				<span className="font-medium text-[10px] text-[var(--gray-12)]">
					Verified
				</span>
			</div>

			<Panel className="px-4 py-4">
				<div className="flex items-center gap-2">
					<div className="flex gap-0.5">
						{STARS.map((id) => (
							<Star
								aria-hidden="true"
								className="size-3.5 fill-brand text-brand"
								key={id}
							/>
						))}
					</div>
					<span className="font-semibold text-[12px] text-[var(--gray-12)] tabular-nums">
						4.9
					</span>
				</div>

				<p className="mt-2.5 font-medium text-[13px] text-[var(--gray-12)] leading-snug">
					“Exactly as described — shipped in two days.”
				</p>

				<div className="mt-3 flex flex-col gap-1.5">
					<Bar className="w-full" />
					<Bar className="w-2/3" />
				</div>

				<div className="mt-4 flex items-center gap-2 border-border border-t pt-3">
					<div className="flex -space-x-1.5">
						{AVATARS.map((id) => (
							<div
								className="size-5 rounded-full border border-page bg-[var(--gray-4)]"
								key={id}
							/>
						))}
					</div>
					<span className="text-[10px] text-[var(--gray-11)] tabular-nums">
						128 verified reviews
					</span>
				</div>
			</Panel>
		</div>
	);
}
