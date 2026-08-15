"use client";

import { Caret } from "@/components/remocn/caret";
import { SANS_STACK } from "@/fonts";
import { useTypewriter } from "@/lib/remocn-ui";

export interface TypewriterProps {
	charsPerSecond?: number;
	className?: string;
	color?: string;
	cursor?: boolean;
	cursorColor?: string;
	fontSize?: number;
	fontWeight?: number;
	speed?: number;
	text: string;
}

export function Typewriter({
	text,
	cursor = true,
	charsPerSecond = 22,
	speed = 1,
	fontSize = 48,
	color = "#171717",
	cursorColor = "#171717",
	fontWeight = 600,
	className,
}: TypewriterProps) {
	const tw = useTypewriter(text, { cps: charsPerSecond, speed });

	return (
		<div
			style={{
				display: "inline-flex",
				alignItems: "baseline",
			}}
		>
			<span
				className={className}
				style={{
					fontSize,
					fontWeight,
					color,
					letterSpacing: "-0.03em",
					fontFamily: SANS_STACK,
					whiteSpace: "pre",
				}}
			>
				{tw.text}
				{cursor && (
					<Caret
						blink={!tw.typing}
						color={cursorColor}
						radius={0}
						speed={speed}
						style={{
							width: "0.08em",
							height: "1em",
							marginLeft: "0.04em",
							verticalAlign: "text-bottom",
						}}
					/>
				)}
			</span>
		</div>
	);
}
