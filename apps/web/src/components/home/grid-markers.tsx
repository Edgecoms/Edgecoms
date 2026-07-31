/**
 * Blueprint-style squares pinned to every line crossing of a `cols`×`rows`
 * hairline grid — the corner-marker detail from the reference layouts.
 *
 * Decorative and desktop-only: below `lg` the grids reflow to 2 or 1 columns,
 * so these percentages would no longer land on the lines.
 */
export function GridMarkers({ cols, rows }: { cols: number; rows: number }) {
	const xs = Array.from({ length: cols + 1 }, (_, i) => (i / cols) * 100);
	const ys = Array.from({ length: rows + 1 }, (_, i) => (i / rows) * 100);

	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 hidden lg:block"
		>
			{xs.map((x) =>
				ys.map((y) => (
					<span
						className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 border border-border bg-bg"
						key={`${x}-${y}`}
						style={{ left: `${x}%`, top: `${y}%` }}
					/>
				))
			)}
		</div>
	);
}
