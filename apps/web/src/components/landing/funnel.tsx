/**
 * Sessions → add to cart → orders, drawn as a narrowing band.
 */
const STAGES = [
	{ label: "Clicks", share: "100%", value: "7.2K" },
	{ label: "Leads", share: "36%", value: "165" },
	{ label: "Sales", share: "1.3%", value: "$506" },
] as const;

export function Funnel() {
	return (
		<div className="relative w-full border-neutral-200 border-t bg-[#F8FAFC] px-4 py-12 sm:px-8 sm:py-16">
			<div className="mx-auto flex max-w-[640px] flex-col items-center gap-6">
				{/* Elevated Funnel Card */}
				<div className="w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)]">
					<dl className="grid grid-cols-3 divide-x divide-neutral-200 border-neutral-200 border-b bg-white">
						{STAGES.map((stage) => (
							<div
								className="flex flex-col gap-0.5 px-5 py-3.5"
								key={stage.label}
							>
								<dt className="font-medium text-[11px] text-neutral-400">
									{stage.label}
								</dt>
								<dd className="font-semibold text-[20px] text-neutral-900 tracking-tight">
									{stage.value}
								</dd>
							</div>
						))}
					</dl>

					<div className="relative h-[180px] bg-white">
						<svg
							aria-hidden="true"
							className="h-full w-full"
							preserveAspectRatio="none"
							viewBox="0 0 300 100"
						>
							<defs>
								<linearGradient
									id="funnel-band-dub"
									x1="0"
									x2="1"
									y1="0"
									y2="0"
								>
									<stop offset="0%" stopColor="#2563EB" stopOpacity="0.85" />
									<stop offset="50%" stopColor="#9333EA" stopOpacity="0.85" />
									<stop offset="100%" stopColor="#0D9488" stopOpacity="0.85" />
								</linearGradient>
							</defs>

							<path
								d="M0 10 C60 10 60 36 100 36 C160 36 160 44 200 44 C260 44 260 46 300 46 L300 54 C260 54 260 56 200 56 C160 56 160 64 100 64 C60 64 60 90 0 90 Z"
								fill="url(#funnel-band-dub)"
							/>
						</svg>

						<div className="absolute inset-0 grid grid-cols-3 items-center">
							{STAGES.map((stage) => (
								<span className="flex justify-center" key={stage.label}>
									<span className="rounded-full border border-neutral-200 bg-white/90 px-2.5 py-0.5 font-semibold text-[10px] text-neutral-700 shadow-sm backdrop-blur-sm">
										{stage.share}
									</span>
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
