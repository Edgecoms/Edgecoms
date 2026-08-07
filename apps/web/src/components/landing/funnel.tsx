/**
 * Sessions → add to cart → orders, drawn as a narrowing band.
 *
 * The three figures are illustrative and deliberately mundane — a 3.1% store,
 * not a 12% one. The point of the graphic is the shape of the leak, and a
 * flattering example undersells it: what the reader should notice is how much
 * of the band is gone by the third column.
 */
const STAGES = [
	{ label: "Sessions", share: "100%", value: "48,200" },
	{ label: "Reached cart", share: "9.4%", value: "4,530" },
	{ label: "Orders", share: "3.1%", value: "1,494" },
] as const;

export function Funnel() {
	return (
		<div className="px-6 py-12">
			<div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
				<dl className="grid grid-cols-3 divide-x divide-neutral-200">
					{STAGES.map((stage) => (
						<div className="flex flex-col gap-1 px-5 py-4" key={stage.label}>
							<dt className="text-[12px] text-neutral-500">{stage.label}</dt>
							<dd className="font-medium text-[22px] text-neutral-900 tracking-[-0.02em]">
								{stage.value}
							</dd>
						</div>
					))}
				</dl>

				<div className="relative h-[220px] border-neutral-200 border-t bg-neutral-50/60">
					<svg
						aria-hidden="true"
						className="h-full w-full"
						preserveAspectRatio="none"
						viewBox="0 0 300 100"
					>
						<defs>
							<linearGradient id="funnel-band" x1="0" x2="1" y1="0" y2="0">
								<stop offset="0%" stopColor="#F97316" stopOpacity="0.85" />
								<stop offset="50%" stopColor="#7C3AED" stopOpacity="0.85" />
								<stop offset="100%" stopColor="#16A34A" stopOpacity="0.85" />
							</linearGradient>
						</defs>

						{/* Two mirrored cubics closed across the right edge: the band keeps
						    a soft waist at each column boundary rather than stepping. */}
						<path
							d="M0 8 C60 8 60 34 100 34 C160 34 160 42 200 42 C260 42 260 46 300 46 L300 54 C260 54 260 58 200 58 C160 58 160 66 100 66 C60 66 60 92 0 92 Z"
							fill="url(#funnel-band)"
						/>
					</svg>

					<div className="absolute inset-0 grid grid-cols-3 items-center">
						{STAGES.map((stage) => (
							<span className="flex justify-center" key={stage.label}>
								<span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 font-medium text-[11px] text-neutral-700">
									{stage.share}
								</span>
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
