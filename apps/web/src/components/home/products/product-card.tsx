import type React from "react";

interface ProductCardProps {
	description: string;
	diagram: React.ReactNode;
	/** Position in the grid — used to keep the band's dividers/edges single-line. */
	index: number;
	title: string;
}

export function ProductCard({
	diagram,
	title,
	description,
	index,
}: ProductCardProps) {
	// The left edge only renders for the first cell of each row, so adjacent
	// cells share a single hairline. Row size changes per breakpoint.
	const isSmRowStart = index % 2 === 0;
	const isLgRowStart = index % 3 === 0;

	const visualBorders = [
		"border border-border",
		isSmRowStart ? "sm:border-l" : "sm:border-l-0",
		isLgRowStart ? "lg:border-l" : "lg:border-l-0",
	].join(" ");

	return (
		<div className="flex flex-col">
			{/* visual — borders live only on the band, never around the content */}
			<div
				className={`flex h-[280px] items-center justify-center overflow-hidden px-6 py-8 ${visualBorders}`}
			>
				{diagram}
			</div>

			{/* content — sits outside the band */}
			<div className="px-6 pt-6 pb-6 lg:px-8">
				<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
					<span className="font-semibold text-primary-foreground">
						{title}.
					</span>{" "}
					{description}
				</p>
			</div>
		</div>
	);
}
