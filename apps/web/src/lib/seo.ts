/**
 * One place for everything Google reads.
 *
 * Two rules hold here:
 *
 * 1. **Every absolute URL is built from `SITE_URL`.** Nothing hardcodes a
 *    domain, so moving the site is a single env change rather than a hunt
 *    through the sitemap, the canonicals, and every JSON-LD block.
 * 2. **Structured data never claims more than the page shows.** Schema.org
 *    markup is a statement to Google in the site's own voice; a rating or a
 *    salary asserted here that no page can back is exactly the kind of thing
 *    that earns a manual action. Optional fields stay off until the data is
 *    real.
 */

/**
 * The canonical origin, no trailing slash. Override per environment with
 * `NEXT_PUBLIC_SITE_URL` (set it on preview deploys so their canonicals do not
 * point at production).
 */
export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://edgecoms.com"
).replace(/\/$/, "");

export const SITE_NAME = "Edgecoms";

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path: string): string {
	return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

interface JsonLdNode {
	"@context"?: string;
	"@type": string;
	[key: string]: unknown;
}

/**
 * Renders a JSON-LD block.
 *
 * `dangerouslySetInnerHTML` is the documented way to emit JSON-LD in Next, and
 * the input here is our own structured data rather than user content. `<` is
 * still escaped so a stray angle bracket in copy can never close the script
 * tag early.
 */
export function jsonLdScriptProps(data: JsonLdNode): {
	dangerouslySetInnerHTML: { __html: string };
	type: string;
} {
	return {
		type: "application/ld+json",
		dangerouslySetInnerHTML: {
			__html: JSON.stringify({
				"@context": "https://schema.org",
				...data,
			}).replace(/</g, "\\u003c"),
		},
	};
}

/** The publisher every other node points back at. */
export const organizationSchema: JsonLdNode = {
	"@type": "Organization",
	"@id": `${SITE_URL}/#organization`,
	name: SITE_NAME,
	url: SITE_URL,
	logo: absoluteUrl("/icon.svg"),
	description:
		"Edgecoms builds the Edge suite of Shopify apps for higher order value, better conversion rate, and revenue that repeats, plus a partner program that pays recurring commission.",
	email: "hello@edgecoms.com",
};

export const websiteSchema: JsonLdNode = {
	"@type": "WebSite",
	"@id": `${SITE_URL}/#website`,
	name: SITE_NAME,
	url: SITE_URL,
	publisher: { "@id": `${SITE_URL}/#organization` },
};

/**
 * A breadcrumb trail. Google renders these in place of the raw URL in a result,
 * so every page more than one level deep should carry one.
 */
export function breadcrumbSchema(
	crumbs: readonly { name: string; path: string }[]
): JsonLdNode {
	return {
		"@type": "BreadcrumbList",
		itemListElement: crumbs.map((crumb, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: crumb.name,
			item: absoluteUrl(crumb.path),
		})),
	};
}

/**
 * A Shopify app, as Google understands it.
 *
 * `offers` is built **only** from tiers marked `confirmed` in the catalog. Most
 * tiers on the site are still proposals, and a price in structured data is a
 * price Google will show in a result and a merchant will hold us to. An app
 * with no confirmed tier ships no offer rather than a guessed one.
 *
 * No `aggregateRating` is emitted anywhere: we hold no review data of our own,
 * and inventing one is the single fastest way to earn a structured-data manual
 * action.
 */
export function softwareAppSchema(product: {
	appStoreUrl?: string;
	description: string;
	name: string;
	pricing: readonly {
		confirmed: boolean;
		name: string;
		price: string;
	}[];
	slug: string;
}): JsonLdNode {
	const offers = product.pricing
		.filter((tier) => tier.confirmed)
		.map((tier) => {
			const amount = tier.price.replace(/[^0-9.]/g, "");

			return {
				"@type": "Offer",
				name: tier.name,
				price: amount === "" ? "0" : amount,
				priceCurrency: "USD",
			};
		});

	return {
		"@type": "SoftwareApplication",
		name: product.name,
		description: product.description,
		url: absoluteUrl(`/products/${product.slug}`),
		applicationCategory: "BusinessApplication",
		operatingSystem: "Shopify",
		publisher: { "@id": `${SITE_URL}/#organization` },
		...(product.appStoreUrl ? { installUrl: product.appStoreUrl } : {}),
		...(offers.length > 0 ? { offers } : {}),
	};
}

/**
 * A job opening, in the shape Google Jobs indexes.
 *
 * Two fields are deliberately omitted rather than guessed:
 *
 * - `baseSalary` — we publish no bands yet. Google shows salary when it is
 *   given, and a number here that no offer honours is a promise to every
 *   applicant who reads the result.
 * - `validThrough` — a date we would have to keep true. Google prefers a
 *   listing with no expiry over one that has silently lapsed.
 *
 * `jobLocationType: "TELECOMMUTE"` with an `applicantLocationRequirements` of
 * the whole world is the correct encoding for "remote, hire anywhere"; without
 * the second field Google treats a remote listing as location-unknown and
 * surfaces it far less.
 */
export function jobPostingSchema(role: {
	description: string;
	employmentType: string;
	postedAt: string;
	responsibilities: readonly string[];
	requirements: readonly string[];
	slug: string;
	title: string;
}): JsonLdNode {
	const asHtmlList = (items: readonly string[]) =>
		`<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;

	return {
		"@type": "JobPosting",
		title: role.title,
		description: [
			`<p>${role.description}</p>`,
			"<p>In this role you will:</p>",
			asHtmlList(role.responsibilities),
			"<p>You will be a perfect fit if you:</p>",
			asHtmlList(role.requirements),
		].join(""),
		datePosted: role.postedAt,
		employmentType:
			role.employmentType.toLowerCase() === "internship"
				? "INTERN"
				: "FULL_TIME",
		hiringOrganization: { "@id": `${SITE_URL}/#organization` },
		jobLocationType: "TELECOMMUTE",
		applicantLocationRequirements: { "@type": "Country", name: "Worldwide" },
		directApply: true,
		url: absoluteUrl(`/careers/${role.slug}`),
	};
}

/** A question-and-answer block that already renders visibly on the page. */
export function faqSchema(
	faqs: readonly { answer: string; question: string }[]
): JsonLdNode {
	return {
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: { "@type": "Answer", text: faq.answer },
		})),
	};
}
