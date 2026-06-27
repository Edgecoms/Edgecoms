import { ArrowRight } from "lucide-react";
import type React from "react";

export interface FlowItem {
	highlight?: boolean;
	icon?: React.ReactNode;
	label: string;
}

function Chip({ label, icon, highlight }: FlowItem) {
	return (
		<span
			className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border bg-white px-2.5 py-1.5 font-medium text-[11px] ${
				highlight
					? "border-[#F3A487] text-[#EF5F37]"
					: "border-[#EAEAEA] text-[#52525b]"
			}`}
		>
			{icon}
			{label}
		</span>
	);
}

export function FlowRow({ items }: { items: FlowItem[] }) {
	return (
		<div className="flex flex-wrap items-center gap-1.5">
			{items.map((item, index) => (
				<div className="flex items-center gap-1.5" key={item.label}>
					{index > 0 ? (
						<ArrowRight
							aria-hidden="true"
							className="size-3 shrink-0 text-[#C9C9CE]"
						/>
					) : null}
					<Chip {...item} />
				</div>
			))}
		</div>
	);
}
