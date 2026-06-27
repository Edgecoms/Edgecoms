const RING_RADIUS = 72;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const PROGRESS = 0.8;

function TimeUnit({ value, label }: { value: string; label: string }) {
	return (
		<div className="flex flex-col items-center">
			<span className="font-medium text-[#1c1c1e] text-[22px] tabular-nums leading-none tracking-tight">
				{value}
			</span>
			<span className="mt-1 text-[#a1a1aa] text-[9px] tracking-[0.1em]">
				{label}
			</span>
		</div>
	);
}

export default function TimerDiagram() {
	return (
		<div className="grid w-full place-items-center">
			<div className="relative grid place-items-center">
				<svg aria-hidden="true" height="184" viewBox="0 0 184 184" width="184">
					{/* tick ring */}
					<circle
						cx="92"
						cy="92"
						fill="none"
						r="82"
						stroke="#E4E4E7"
						strokeDasharray="1 6"
						strokeWidth="2"
					/>
					{/* track */}
					<circle
						cx="92"
						cy="92"
						fill="none"
						r={RING_RADIUS}
						stroke="#ECECEE"
						strokeWidth="5"
					/>
					{/* progress */}
					<circle
						cx="92"
						cy="92"
						fill="none"
						r={RING_RADIUS}
						stroke="#FF4001"
						strokeDasharray={`${RING_CIRCUMFERENCE * PROGRESS} ${RING_CIRCUMFERENCE}`}
						strokeLinecap="round"
						strokeWidth="5"
						transform="rotate(-90 92 92)"
					/>
				</svg>

				<div className="absolute flex flex-col items-center">
					<span className="text-[#a1a1aa] text-[11px]">Offer ends in</span>
					<div className="mt-1.5 flex items-start gap-1.5">
						<TimeUnit label="HRS" value="04" />
						<span className="text-[#c9c9ce] text-[18px] leading-none">:</span>
						<TimeUnit label="MIN" value="32" />
						<span className="text-[#c9c9ce] text-[18px] leading-none">:</span>
						<TimeUnit label="SEC" value="18" />
					</div>
				</div>
			</div>
		</div>
	);
}
