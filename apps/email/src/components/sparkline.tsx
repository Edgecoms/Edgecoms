const WIDTH = 600;
const HEIGHT = 48;
/** Room above and below so the line and its end dot never clip. */
const PAD = 6;

/**
 * A trend line: fades in from the left, ends in a dot on the latest value.
 * Pure SVG, so it renders on the server with no chart library. A flat run of
 * zeros is a flat line along the bottom, which is the honest picture.
 */
export function Sparkline({
	label,
	values,
}: {
	label: string;
	values: readonly number[];
}) {
	const max = Math.max(1, ...values);
	const step = values.length > 1 ? WIDTH / (values.length - 1) : 0;
	const y = (value: number) =>
		HEIGHT - PAD - (value / max) * (HEIGHT - 2 * PAD);
	const points = values
		.map(
			(value, index) => `${(index * step).toFixed(1)},${y(value).toFixed(1)}`
		)
		.join(" ");
	const last = values.at(-1) ?? 0;

	return (
		<div className="relative h-12 w-full">
			<svg
				aria-label={label}
				className="h-full w-full overflow-visible"
				preserveAspectRatio="none"
				role="img"
				viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
			>
				<defs>
					{/* userSpaceOnUse: a flat line has no height, and an
					    objectBoundingBox gradient on it would not render. */}
					<linearGradient
						gradientUnits="userSpaceOnUse"
						id="sparkline-fade"
						x1="0"
						x2={WIDTH}
						y1="0"
						y2="0"
					>
						<stop
							offset="0"
							style={{ stopColor: "var(--brand)", stopOpacity: 0 }}
						/>
						<stop
							offset="0.35"
							style={{ stopColor: "var(--brand)", stopOpacity: 1 }}
						/>
					</linearGradient>
				</defs>
				<polyline
					fill="none"
					points={points}
					stroke="url(#sparkline-fade)"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
			{/* The dot is HTML so the stretched SVG cannot squash it into an oval. */}
			<span
				aria-hidden="true"
				className="absolute right-0 size-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
				style={{ top: `${(y(last) / HEIGHT) * 100}%` }}
			/>
		</div>
	);
}
