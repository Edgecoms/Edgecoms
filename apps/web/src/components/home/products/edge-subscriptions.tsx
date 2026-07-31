import { RefreshCw } from "lucide-react";
import { CONNECTOR, Focal, Panel } from "./parts";

/* First charge is the sale; everything after it is revenue that arrives without
   one. Only the future cycles are filled, which is the whole point of the app. */
const CYCLES = [
	{ label: "Jan", recurring: false },
	{ label: "Feb", recurring: true },
	{ label: "Mar", recurring: true },
	{ label: "Apr", recurring: true },
];

export default function SubscriptionsDiagram() {
	return (
		<div className="flex w-[248px] flex-col items-center gap-5">
			<div className="relative w-full">
				<svg
					aria-hidden="true"
					className="absolute inset-x-0 top-[13px] h-px w-full"
					fill="none"
					preserveAspectRatio="none"
					viewBox="0 0 248 1"
				>
					<path
						d="M12 0.5 L236 0.5"
						stroke={CONNECTOR}
						strokeDasharray="4 4"
						strokeWidth="1.25"
					/>
				</svg>

				<div className="relative flex items-start justify-between">
					{CYCLES.map((cycle) => (
						<div className="flex flex-col items-center gap-2" key={cycle.label}>
							<span
								className={
									cycle.recurring
										? "size-[26px] rounded-full border-[5px] border-brand bg-page"
										: "size-[26px] rounded-full border border-border bg-page"
								}
							/>
							<span
								className={`text-[10px] ${cycle.recurring ? "font-medium text-[var(--gray-12)]" : "text-[var(--gray-11)]"}`}
							>
								{cycle.label}
							</span>
						</div>
					))}
				</div>
			</div>

			<Panel className="flex w-full items-center gap-3 px-3.5 py-3">
				<Focal className="size-9">
					<RefreshCw aria-hidden="true" className="size-4" strokeWidth={1.7} />
				</Focal>
				<div className="flex flex-1 flex-col">
					<span className="font-semibold text-[13px] text-[var(--gray-12)]">
						Renews monthly
					</span>
					<span className="text-[10px] text-[var(--gray-11)]">
						Skip or pause anytime
					</span>
				</div>
				<span className="font-semibold text-[13px] text-brand tabular-nums">
					$29
				</span>
			</Panel>
		</div>
	);
}
