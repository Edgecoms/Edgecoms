import { ArrowRight, Truck } from "lucide-react";
import { Bar, Panel } from "./parts";

const LINES = [
	{ id: "line-a", qty: 1 },
	{ id: "line-b", qty: 2 },
];

/** Free-shipping threshold progress, as a fraction of the bar. */
const SHIPPING_PROGRESS = 0.72;

export default function CartDiagram() {
	return (
		<Panel className="w-[248px] overflow-hidden">
			<div className="flex items-center justify-between px-4 pt-3.5 pb-2">
				<span className="font-semibold text-[13px] text-[var(--gray-12)]">
					Cart
				</span>
				<span className="text-[11px] text-[var(--gray-11)] tabular-nums">
					3 items
				</span>
			</div>

			{LINES.map((line) => (
				<div className="flex items-center gap-2.5 px-4 py-2" key={line.id}>
					<div className="size-8 shrink-0 rounded-lg bg-[var(--gray-3)]" />
					<div className="flex flex-1 flex-col gap-1.5">
						<Bar className="w-full" />
						<Bar className="w-1/2" />
					</div>
					<span className="font-medium text-[11px] text-[var(--gray-11)] tabular-nums">
						×{line.qty}
					</span>
				</div>
			))}

			<div className="mt-1 flex flex-col gap-1.5 px-4">
				<div className="flex items-center gap-1.5 text-[10px] text-[var(--gray-11)]">
					<Truck aria-hidden="true" className="size-3" strokeWidth={1.6} />
					$21 away from free shipping
				</div>
				<div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--gray-3)]">
					<div
						className="h-full rounded-full bg-brand"
						style={{ width: `${SHIPPING_PROGRESS * 100}%` }}
					/>
				</div>
			</div>

			<div className="p-3.5 pt-3">
				<div className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2 font-medium text-[13px] text-white shadow-[0_6px_18px_var(--orange-a7)]">
					Checkout
					<ArrowRight aria-hidden="true" className="size-3.5" />
				</div>
			</div>
		</Panel>
	);
}
