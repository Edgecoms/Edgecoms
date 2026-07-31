import { Panel } from "./parts";

const UNITS = [
	{ label: "HRS", value: "02" },
	{ label: "MIN", value: "14" },
	{ label: "SEC", value: "36" },
];

/** How much of the window has already elapsed. */
const ELAPSED = 0.68;

/* Tick marks sit under the progress track. Evenly spaced by index rather than
   hardcoded, so changing the count does not require redrawing the row. */
const TICKS = Array.from({ length: 24 }, (_, i) => i);

export default function TimerDiagram() {
	return (
		<Panel className="w-[248px] px-4 py-4">
			<span className="font-medium text-[10px] text-[var(--gray-11)] uppercase tracking-[0.14em]">
				Sale ends in
			</span>

			<div className="mt-3 flex items-end gap-1.5">
				{UNITS.map((unit, index) => (
					<div className="flex items-end gap-1.5" key={unit.label}>
						<div className="flex flex-col items-center">
							<span className="font-medium text-[30px] text-[var(--gray-12)] tabular-nums leading-none tracking-tight">
								{unit.value}
							</span>
							<span className="mt-1.5 text-[9px] text-[var(--gray-11)] tracking-[0.12em]">
								{unit.label}
							</span>
						</div>
						{index < UNITS.length - 1 ? (
							<span className="pb-4 font-medium text-[22px] text-[var(--gray-6)] leading-none">
								:
							</span>
						) : null}
					</div>
				))}
			</div>

			<div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--gray-3)]">
				<div
					className="h-full rounded-full bg-brand"
					style={{ width: `${ELAPSED * 100}%` }}
				/>
			</div>

			<div className="mt-1.5 flex justify-between">
				{TICKS.map((tick) => (
					<span className="h-1 w-px bg-[var(--gray-5)]" key={tick} />
				))}
			</div>
		</Panel>
	);
}
