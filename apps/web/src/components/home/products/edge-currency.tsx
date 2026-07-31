import { Globe } from "lucide-react";
import { CONNECTOR, Focal, Panel } from "./parts";

/* Satellite prices, positioned against the 248×176 stage below. Each `at` pins
   a corner; the matching connector in the SVG runs from that corner to the
   centre node at (124, 88). Move one, move the other. */
const MARKETS = [
	{ amount: "$129.00", at: "top-0 left-0", code: "USD", d: "M40 26 L108 78" },
	{ amount: "£99.00", at: "top-0 right-0", code: "GBP", d: "M208 26 L140 78" },
	{
		amount: "$199.00",
		at: "bottom-0 left-2",
		code: "AUD",
		d: "M48 150 L108 98",
	},
	{
		amount: "¥18,900",
		at: "right-2 bottom-0",
		code: "JPY",
		d: "M200 150 L140 98",
	},
];

export default function CurrencyDiagram() {
	return (
		<div className="relative h-[176px] w-[248px]">
			<svg
				aria-hidden="true"
				className="absolute inset-0 h-full w-full"
				fill="none"
				viewBox="0 0 248 176"
			>
				<g
					stroke={CONNECTOR}
					strokeDasharray="4 4"
					strokeLinecap="round"
					strokeWidth="1.25"
				>
					{MARKETS.map((market) => (
						<path d={market.d} key={market.code} />
					))}
				</g>
			</svg>

			{/* Centre node — the shopper's own currency, resolved. */}
			<Panel className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 px-3 py-2.5">
				<Focal className="size-9">
					<Globe aria-hidden="true" className="size-4.5" strokeWidth={1.6} />
				</Focal>
				<div className="flex flex-col">
					<span className="font-semibold text-[13px] text-[var(--gray-12)] tabular-nums">
						€119.00
					</span>
					<span className="text-[10px] text-[var(--gray-11)]">
						Detected · EUR
					</span>
				</div>
			</Panel>

			{MARKETS.map((market) => (
				<div
					className={`absolute ${market.at} rounded-xl border border-border bg-page px-2.5 py-1.5 shadow-[0_1px_2px_var(--gray-a3),0_6px_14px_var(--gray-a4)]`}
					key={market.code}
				>
					<div className="font-semibold text-[11px] text-[var(--gray-12)]">
						{market.code}
					</div>
					<div className="text-[10px] text-[var(--gray-11)] tabular-nums">
						{market.amount}
					</div>
				</div>
			))}
		</div>
	);
}
