import { ClosingCta, Footer } from "@/components/closing";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/primitives";
import {
	Audience,
	Comparison,
	CoursePreview,
	Curriculum,
	Inclusions,
	Instructor,
	PainPoints,
	TrustStrip,
} from "@/components/sections";
import { Signup } from "@/components/signup";
import { SocialProof } from "@/components/social-proof";
import { StickyBar } from "@/components/sticky-bar";
import { COURSE_FAQ } from "@/lib/content";
import { absoluteUrl, COURSE_NAME, SITE_DESCRIPTION } from "@/lib/site";

/**
 * Structured data.
 *
 * The `offers` block states a price of 0 because the page genuinely offers the
 * course for nothing — that is a claim the page can back. There is deliberately
 * NO `aggregateRating`: the testimonials are placeholders, and a rich result
 * built on invented reviews is what earns a manual action.
 *
 * TODO(launch): add `aggregateRating` only once real, permissioned reviews
 * exist, and drop `offers` back to the real figure if the course starts being
 * charged for.
 */
const COURSE_SCHEMA = {
	"@context": "https://schema.org",
	"@type": "Course",
	description: SITE_DESCRIPTION,
	name: COURSE_NAME,
	offers: {
		"@type": "Offer",
		availability: "https://schema.org/InStock",
		price: 0,
		priceCurrency: "USD",
	},
	provider: {
		"@type": "Organization",
		name: "Edgecoms",
		url: absoluteUrl("/"),
	},
	url: absoluteUrl("/"),
};

const FAQ_SCHEMA = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: COURSE_FAQ.map((item) => ({
		"@type": "Question",
		acceptedAnswer: { "@type": "Answer", text: item.answer },
		name: item.question,
	})),
};

/** JSON-LD is our own structured data, and `<` is escaped so a stray angle
    bracket in copy can never close the script tag early. */
function JsonLd({ data }: { data: Record<string, unknown> }) {
	return (
		<script
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as raw text.
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(data).replace(/</g, "\\u003c"),
			}}
			type="application/ld+json"
		/>
	);
}

export default function CoursePage() {
	return (
		<>
			<JsonLd data={COURSE_SCHEMA} />
			<JsonLd data={FAQ_SCHEMA} />

			{/* Skip link: the page is long and the form is the point of it. */}
			<a
				className="sr-only rounded-[10px] bg-accent font-bold text-accent-ink focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2"
				href="#get-access"
			>
				Skip to sign-up
			</a>

			<main>
				{/* The hero animates on load; everything below arrives on scroll. */}
				<Hero />
				<TrustStrip />

				<Reveal>
					<PainPoints />
				</Reveal>
				<Reveal>
					<Inclusions />
				</Reveal>
				<Reveal>
					<CoursePreview />
				</Reveal>
				<Reveal>
					<Curriculum />
				</Reveal>
				<Reveal>
					<Audience />
				</Reveal>
				<Reveal>
					<Instructor />
				</Reveal>
				<Reveal>
					<Comparison />
				</Reveal>
				<Reveal>
					<SocialProof />
				</Reveal>
				<Reveal>
					<Signup />
				</Reveal>
				<Reveal>
					<Faq />
				</Reveal>
				<Reveal>
					<ClosingCta />
				</Reveal>
			</main>

			<Footer />
			<StickyBar />
		</>
	);
}
