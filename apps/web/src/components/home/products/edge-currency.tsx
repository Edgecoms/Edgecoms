import { ArrowLeftRight } from "lucide-react";

interface CurrencyPill {
	amount: string;
	code: string;
	position: string;
}

const PILLS: CurrencyPill[] = [
	{ code: "USD", amount: "$129.00", position: "top-0 left-0" },
	{ code: "EUR", amount: "€119.00", position: "top-0 right-0" },
	{ code: "GBP", amount: "£99.00", position: "bottom-0 left-2" },
	{ code: "AUD", amount: "$199.00", position: "right-2 bottom-0" },
];

export default function CurrencyDiagram() {
	return (
		<div className="relative grid h-[210px] w-full max-w-[260px] place-items-center">
			{/* dotted map backdrop */}
			<svg
				aria-hidden="true"
				className="absolute inset-0 h-full w-full opacity-70"
				viewBox="0 0 260 210"
			>
				<defs>
					<pattern
						height="9"
						id="map-dots"
						patternUnits="userSpaceOnUse"
						width="9"
					>
						<circle cx="1.5" cy="1.5" fill="#D9D9DE" r="1.1" />
					</pattern>
					<ellipse cx="130" cy="105" id="map-shape" rx="118" ry="74" />
					<clipPath id="map-clip">
						<use href="#map-shape" />
					</clipPath>
				</defs>
				<rect
					clipPath="url(#map-clip)"
					fill="url(#map-dots)"
					height="210"
					width="260"
				/>
			</svg>

			{/* connectors */}
			<svg
				aria-hidden="true"
				className="absolute inset-0 h-full w-full"
				viewBox="0 0 260 210"
			>
				<g
					fill="none"
					stroke="#D4D4D8"
					strokeDasharray="4 4"
					strokeLinecap="round"
					strokeWidth="1.3"
				>
					<path d="M130 105 C 95 80, 70 55, 48 38" />
					<path d="M130 105 C 165 80, 190 55, 212 38" />
					<path d="M130 105 C 95 130, 70 155, 50 172" />
					<path d="M130 105 C 165 130, 190 155, 210 172" />
				</g>
			</svg>

			{/* center swap node */}
			<div className="z-10 grid size-12 place-items-center rounded-full border border-[#EDEDED] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
				<ArrowLeftRight aria-hidden="true" className="size-5 text-[#1c1c1e]" />
			</div>

			{PILLS.map((pill) => (
				<div
					className={`absolute ${pill.position} z-10 rounded-xl border border-[#EDEDED] bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.035)]`}
					key={pill.code}
				>
					<div className="font-semibold text-[#1c1c1e] text-[12px]">
						{pill.code}
					</div>
					<div className="text-[#8a8a8e] text-[11px] tabular-nums">
						{pill.amount}
					</div>
				</div>
			))}
		</div>
	);
}
