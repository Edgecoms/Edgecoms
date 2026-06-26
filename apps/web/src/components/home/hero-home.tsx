import { ButtonLink } from "@edgecoms/ui/components/button";
import type { Route } from "next";
import { WordMark } from "@/components/ui/word-mark";

export function HeroHome() {
	return (
		<div className="grid min-h-[calc(100svh-var(--header-height))] grid-cols-1 items-center gap-12 py-20 lg:grid-cols-3 lg:gap-10 lg:py-0">
			<div className="flex flex-col items-start gap-8">
				<h1 className="text-balance font-medium text-display text-primary-foreground">
					Building exceptional Shopify apps.
				</h1>
				<div className="flex flex-wrap items-center gap-3">
					<ButtonLink href={"/products" as Route} size="xl" variant="primary">
						Explore Products
					</ButtonLink>
					<ButtonLink href={"/partners" as Route} size="xl" variant="secondary">
						Become a Partner
					</ButtonLink>
				</div>
			</div>

			<div className="flex items-center justify-center">
				<WordMark className="h-auto w-full max-w-[18rem] text-primary-foreground [filter:drop-shadow(0_18px_40px_rgba(0,0,0,0.22))_drop-shadow(0_4px_8px_rgba(0,0,0,0.12))]" />
			</div>

			<div className="flex justify-start lg:justify-end">
				<p className="max-w-xs text-pretty font-medium font-mono text-label text-primary-foreground uppercase leading-[1.8] tracking-[0.06em]">
					A growing suite of thoughtfully crafted apps that help merchants sell
					more, convert better, and grow with confidence.
				</p>
			</div>
		</div>
	);
}
