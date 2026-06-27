import { ArrowRight, Minus, Plus } from "lucide-react";

function CartLine({ qty }: { qty: number }) {
	return (
		<div className="flex items-center gap-2.5 px-4 py-2.5">
			<div className="size-7 shrink-0 rounded-md bg-[#F1F1F2]" />
			<div className="flex flex-1 flex-col gap-1">
				<div className="h-1.5 w-3/4 rounded-full bg-[#ECECEE]" />
				<div className="h-1.5 w-1/2 rounded-full bg-[#F1F1F2]" />
			</div>
			<div className="flex items-center gap-2 text-[#1c1c1e]">
				<Minus aria-hidden="true" className="size-3 text-[#a1a1aa]" />
				<span className="font-medium text-[12px] tabular-nums">{qty}</span>
				<Plus aria-hidden="true" className="size-3 text-[#a1a1aa]" />
			</div>
		</div>
	);
}

export default function CartDiagram() {
	return (
		<div className="grid w-full place-items-center">
			<div className="w-full max-w-[240px] overflow-hidden rounded-2xl border border-[#EDEDED] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_22px_rgba(0,0,0,0.05)]">
				<div className="px-4 pt-3.5 pb-1.5 font-semibold text-[#1c1c1e] text-[14px]">
					Cart
				</div>
				<CartLine qty={1} />
				<CartLine qty={2} />
				<div className="p-3">
					<button
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF4001] py-1.5 font-medium text-[13px] text-white"
						type="button"
					>
						Checkout
						<ArrowRight aria-hidden="true" className="size-3.5" />
					</button>
				</div>
			</div>
		</div>
	);
}
