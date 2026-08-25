import { Container, CtaLink, PriceTag, Section } from "@/components/ui";
import { COURSE_NAME } from "@/lib/site";

export function ClosingCta() {
	return (
		<Section className="relative isolate overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,color-mix(in_oklab,var(--color-accent)_20%,transparent),transparent_70%)]"
			/>

			<Container className="relative">
				<div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
					<h2 className="text-balance font-bold text-section">
						Stop guessing which change matters
					</h2>

					<p className="text-pretty text-muted leading-relaxed sm:text-lg">
						Learn the system we use to grow ecommerce stores, and start applying
						it to yours this week.
					</p>

					<PriceTag
						className="justify-center"
						listClassName="font-bold text-2xl text-muted-dark line-through decoration-2"
					/>

					<CtaLink href="#get-access">Get free access</CtaLink>

					<p className="text-muted-dark text-sm">
						No card required · Lifetime access
					</p>
				</div>
			</Container>
		</Section>
	);
}

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-ink-border border-t bg-ink py-10">
			<Container>
				<div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
					<p className="text-muted-dark text-sm">
						© {year} Edgecoms · {COURSE_NAME}
					</p>
					<a
						className="text-muted text-sm underline underline-offset-4 transition-colors hover:text-paper"
						href="mailto:hello@edgecoms.com"
					>
						hello@edgecoms.com
					</a>
				</div>
			</Container>
		</footer>
	);
}
