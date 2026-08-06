import { HOME_TESTIMONIALS, type HomeTestimonial } from "@/lib/marketing-stats";

/* Which cells break the rhythm. A wall of six identical cards is read as
   wallpaper and skipped; a larger quote and a filled card give the eye two
   places to land, and those two carry the strongest quotes. Positions rather
   than a field on the data: this is layout, and the data has no opinion about
   which cell it lands in.

   The feature card is emphasised by type size alone. Spanning it two rows left
   six cards filling seven cells, so the grid ended on an empty row and the tall
   card carried a band of dead space under its own quote. */
const FEATURE_INDEX = 0;
const ACCENT_INDEX = 3;

function Card({
	testimonial,
	tone,
}: {
	testimonial: HomeTestimonial;
	tone: "accent" | "feature" | "plain";
}) {
	const isAccent = tone === "accent";
	const isFeature = tone === "feature";

	return (
		<li
			className={`flex flex-col rounded-[1.5rem] border p-6 sm:p-7 ${
				isAccent ? "border-transparent bg-brand" : "border-border bg-page"
			}`}
		>
			{/* The quote is the whole card, so it gets the size. The attribution is
			    pushed to the bottom edge, which is what keeps a two-line quote and a
			    five-line quote looking like the same component. */}
			<p
				className={`text-pretty leading-relaxed ${
					isFeature ? "font-medium text-h3" : "text-body"
				} ${isAccent ? "text-brand-foreground" : "text-primary-foreground"}`}
			>
				“{testimonial.quote}”
			</p>

			<p
				className={`mt-auto pt-5 text-body-sm ${
					isAccent ? "text-brand-foreground/80" : "text-secondary-foreground"
				}`}
			>
				{testimonial.attribution}
			</p>
		</li>
	);
}

function toneFor(index: number): "accent" | "feature" | "plain" {
	if (index === FEATURE_INDEX) {
		return "feature";
	}
	if (index === ACCENT_INDEX) {
		return "accent";
	}
	return "plain";
}

/**
 * The testimonial wall, immediately before the FAQ — the last thing a merchant
 * reads before their remaining objections get answered.
 *
 * Every quote names a number. "Great app" is worth nothing here: the page has
 * spent four sections arguing that revenue moves for arithmetic reasons, and a
 * testimonial without a figure quietly undoes that.
 *
 * See `HOME_TESTIMONIALS` for the rule these have to satisfy before launch.
 */
export function Testimonials() {
	if (HOME_TESTIMONIALS.length === 0) {
		return null;
	}

	return (
		<section
			aria-labelledby="testimonials-heading"
			className="w-full py-10 sm:py-14"
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 sm:items-center sm:text-center">
				<p className="font-medium text-body-sm text-brand">
					What merchants say
				</p>
				<h2
					className="text-balance font-medium text-h1 text-primary-foreground"
					id="testimonials-heading"
				>
					Paid for itself, then kept going.
				</h2>
				<p className="max-w-2xl text-pretty text-body text-secondary-foreground leading-relaxed sm:text-body-lg">
					Every quote here names a number the merchant can point at in their own
					Shopify dashboard.
				</p>
			</div>

			<ul className="mx-auto mt-10 grid w-full max-w-7xl auto-rows-auto gap-4 px-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
				{HOME_TESTIMONIALS.map((testimonial, index) => (
					<Card
						key={testimonial.quote}
						testimonial={testimonial}
						tone={toneFor(index)}
					/>
				))}
			</ul>
		</section>
	);
}
