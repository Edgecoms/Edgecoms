import { Package } from "lucide-react";
import { Bar, CONNECTOR, Focal, Ghost, Panel } from "./parts";

/* Three loose products resolve into one bundle. The connector coordinates are
   tied to the 216px row below: ghosts are 56px wide on a 24px gap, so their
   centres land on 28 / 108 / 188. Changing either must change both. */
const ITEMS = ["item-a", "item-b", "item-c"];

export default function BundlesDiagram() {
	return (
		<div className="flex w-[216px] flex-col items-center">
			<div className="flex items-center gap-6">
				{ITEMS.map((id) => (
					<Ghost className="size-14" key={id}>
						<div className="size-5 rounded-md bg-[var(--gray-4)]" />
					</Ghost>
				))}
			</div>

			<svg
				aria-hidden="true"
				className="h-9 w-full"
				fill="none"
				viewBox="0 0 216 36"
			>
				<g
					stroke={CONNECTOR}
					strokeDasharray="4 4"
					strokeLinecap="round"
					strokeWidth="1.25"
				>
					<path d="M28 0 C 28 22, 108 14, 108 36" />
					<path d="M108 0 L108 36" />
					<path d="M188 0 C 188 22, 108 14, 108 36" />
				</g>
			</svg>

			<Focal className="size-14">
				<Package aria-hidden="true" className="size-6" strokeWidth={1.6} />
			</Focal>

			<Panel className="mt-4 flex w-full items-center gap-3 px-3.5 py-2.5">
				<div className="flex flex-1 flex-col gap-1.5">
					<Bar className="w-16" />
					<Bar className="w-10" />
				</div>
				<span className="font-semibold text-[13px] text-[var(--gray-12)] tabular-nums">
					$129
				</span>
			</Panel>
		</div>
	);
}
