import { SlotImage } from "@/components/slot-image";
import { Container, CtaLink, PriceTag } from "@/components/ui";
import { VISIBLE_STATS } from "@/lib/content";

/**
 * The hero plays on load rather than on scroll, in reading order: eyebrow,
 * headline, lead, price, buttons, fine print, product shot.
 *
 * Driven by CSS (`.hero-item` in globals.css) rather than Motion, and so a
 * server component with no client JavaScript at all. The old version wrote
 * `opacity: 0` into the SSR HTML via Motion's `initial` prop, which meant a
 * blocked bundle showed a blank screen and a reduced-motion visitor — whose
 * branch differed between server and client — never got the styles cleared.
 * A CSS animation needs no JS to run and is switched off by a media query.
 *
 * 110ms apart: each element is still settling as the next begins, which is
 * what makes six movements read as one.
 */
const STEP_MS = 110;

/** Inline custom property, read by the `.hero-item` animation-delay. */
function delay(index: number) {
	return { "--hero-delay": `${index * STEP_MS}ms` } as React.CSSProperties;
}

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-ink">
			{/* One soft mint bloom behind the headline. The page is almost entirely
			    flat black, so a single light source stops the hero reading as an
			    empty div. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,color-mix(in_oklab,var(--color-accent)_18%,transparent),transparent_70%)]"
			/>

			<Container className="relative">
				<div className="flex flex-col items-center gap-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-20">
					<p
						className="hero-item inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-semibold text-accent text-xs uppercase tracking-[0.16em]"
						style={delay(0)}
					>
						Free · for beginners and growing stores
					</p>

					<h1
						className="hero-item max-w-4xl text-balance font-bold text-hero"
						style={delay(1)}
					>
						Know what to work on next,{" "}
						<span className="text-accent">and why</span>
					</h1>

					<p
						className="hero-item max-w-2xl text-pretty text-base text-muted leading-relaxed sm:text-xl"
						style={delay(2)}
					>
						Free, ten modules, plain English. By the end you can name the one
						thing most likely to be holding a store back, and what to do about
						it — whether your store is trading already or still on paper.
					</p>

					<div
						className="hero-item flex flex-col items-center gap-3"
						style={delay(3)}
					>
						<PriceTag
							className="justify-center"
							currentClassName="font-bold text-4xl text-accent sm:text-5xl"
						/>
					</div>

					<div
						className="hero-item flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
						style={delay(4)}
					>
						<CtaLink href="#get-access">Get free access</CtaLink>
						<CtaLink href="#curriculum" variant="outline">
							See what's inside
						</CtaLink>
					</div>

					<p className="hero-item text-muted-dark text-sm" style={delay(5)}>
						No card required · Lifetime access · Unsubscribe anytime
					</p>
				</div>

				{/* The product shot sits under the copy rather than beside it, so the
				    headline keeps the full measure at every width. */}
				<div className="hero-item pb-16 sm:pb-20" style={delay(6)}>
					<div className="rounded-2xl border border-ink-border bg-ink-raised p-2 shadow-2xl sm:p-3">
						<SlotImage
							imageKey="hero-preview"
							priority
							sizes="(max-width: 1024px) 100vw, 1024px"
						/>
					</div>
				</div>
			</Container>

			{/* The numbers band. Every figure is flagged at source — see COURSE_STATS
			    — and the band removes itself entirely when nothing is verified. */}
			{VISIBLE_STATS.length > 0 ? (
				<div className="relative border-ink-border border-y">
					<Container>
						<dl className="grid grid-cols-1 divide-y divide-ink-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
							{VISIBLE_STATS.map((stat) => (
								/* `flex-col-reverse` puts the figure above its caption while
								   the DOM keeps the term before its description. */
								<div
									className="flex flex-col-reverse items-center gap-1 px-2 py-6 text-center sm:py-8"
									key={stat.label}
								>
									<dt className="text-pretty text-muted text-xs sm:text-sm">
										{stat.label}
									</dt>
									<dd className="font-bold text-2xl text-paper tabular-nums sm:text-4xl">
										{stat.value}
									</dd>
								</div>
							))}
						</dl>
					</Container>
				</div>
			) : null}
		</section>
	);
}
