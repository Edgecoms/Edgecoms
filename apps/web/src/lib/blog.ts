import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import { z } from "zod";
import { EDGE_PRODUCTS, type EdgeProduct, getProduct } from "@/lib/products";

/**
 * THE BLOG CATALOG.
 *
 * Same shape of contract as `products.ts` and `careers.ts`: one typed catalog,
 * read once, that decides which posts exist. The routes, the hub pages, the
 * sitemap, and the related-posts row all read from here, so a post cannot be
 * live on one surface and missing from another.
 *
 * Frontmatter is read from disk at module scope. Every blog route is statically
 * generated, so these reads happen at build time and never on a request.
 *
 * Validation THROWS rather than skipping a bad file. A post that ships with no
 * description or a malformed FAQ is a page Google indexes badly and nobody
 * notices for a month; a build that fails is noticed in a minute.
 */

const CONTENT_ROOT = join(process.cwd(), "content", "blog");

/** Average adult reading speed for prose on a screen. */
const WORDS_PER_MINUTE = 225;

export const BLOG_ARCHETYPES = [
	"pillar",
	"alternative",
	"listicle",
	"problem",
	"tutorial",
] as const;

export type BlogArchetype = (typeof BLOG_ARCHETYPES)[number];

export interface BlogAuthor {
	bio: string;
	/**
	 * Optional, and the byline omits the link entirely when it is unset — the
	 * same way a case study renders without a logo. A byline is the part of a
	 * page doing the most work to prove a person wrote it, so a guessed profile
	 * URL is the worst possible thing to put here.
	 */
	linkedin?: string;
	name: string;
	role: string;
}

export type AuthorId = "anurag";

/** Everyone who can be an author, stated once. */
export const AUTHORS: Record<AuthorId, BlogAuthor> = {
	anurag: {
		bio: "Anurag runs Edgecoms, a studio of Shopify apps. He spends most of his week inside merchant stores working out why a number is lower than it should be.",
		name: "Anurag Chandra",
		role: "Founder, Edgecoms",
	},
};

const faqSchema = z.object({
	answer: z.string().min(20),
	question: z.string().min(8),
	/**
	 * Required by the content audit whenever the answer states a figure.
	 *
	 * FAQ answers are plain strings — they feed the visible `<details>` block and
	 * the FAQPage markup, and neither can hold a `<Cite>` element. Without this
	 * field an unsourced statistic could sit in the one part of a post that gets
	 * lifted verbatim into a search result, which is the worst possible place for
	 * one.
	 */
	source: z.url().optional(),
});

/**
 * The frontmatter contract.
 *
 * Bounds are the ones the content audit enforces, restated here so a bad post
 * fails at build rather than at CI. `description` is held to Google's usable
 * range — under ~140 chars wastes the snippet, over ~160 gets truncated
 * mid-promise.
 */
const frontmatterSchema = z.object({
	app: z.string().min(1),
	archetype: z.enum(BLOG_ARCHETYPES),
	author: z.enum(Object.keys(AUTHORS) as [AuthorId, ...AuthorId[]]),
	description: z.string().min(140).max(160),
	faq: z.array(faqSchema).min(3).max(5),
	featuredImage: z.string().optional(),
	imageAlt: z.string().min(8),
	internalLinks: z.array(z.string()).min(3),
	metaTitle: z.string().optional(),
	primaryKeyword: z.string().min(3),
	publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	secondaryKeywords: z.array(z.string()).default([]),
	slug: z.string().regex(/^[a-z0-9-]+$/),
	title: z.string().min(10).max(60),
	tldr: z.string().min(40),
	updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type BlogFaq = z.infer<typeof faqSchema>;

/** One entry in the sticky table of contents. */
export interface BlogHeading {
	id: string;
	text: string;
}

export interface BlogPost extends z.infer<typeof frontmatterSchema> {
	/**
	 * The H2s, in document order, with the ids `rehype-slug` will put on them.
	 * Extracted here rather than scanned from the DOM on the client so the table
	 * of contents ships in the HTML and costs nothing to render.
	 */
	headings: readonly BlogHeading[];
	/** Resolved from `app`, so a post always renders its CTA against a real listing. */
	product: EdgeProduct;
	/** Minutes, computed from the body. Never authored. */
	readingTime: number;
	wordCount: number;
}

const FENCE = /^\s*```/;
const H2 = /^##\s+(.+?)\s*$/;

function extractHeadings(body: string): readonly BlogHeading[] {
	const slugger = new GithubSlugger();
	const headings: BlogHeading[] = [];
	let inFence = false;

	for (const line of body.split("\n")) {
		if (FENCE.test(line)) {
			inFence = !inFence;
			continue;
		}

		if (inFence) {
			continue;
		}

		const match = H2.exec(line);

		if (match) {
			// Strip inline markdown so "Why **this** breaks" reads as plain text in
			// the rail, while the id still matches what rehype-slug generates from
			// the rendered heading.
			const text = match[1].replace(/[*_`]/g, "");
			headings.push({ id: slugger.slug(text), text });
		}
	}

	return headings;
}

const CODE_FENCE_BLOCK = /```[\s\S]*?```/g;
const HTML_TAG = /<[^>]+>/g;
const WHITESPACE = /\s+/;
const MDX_EXTENSION = /\.mdx$/;

function countWords(body: string): number {
	return body
		.replace(CODE_FENCE_BLOCK, " ")
		.replace(HTML_TAG, " ")
		.split(WHITESPACE)
		.filter(Boolean).length;
}

function readPosts(): readonly BlogPost[] {
	let appDirs: string[];

	try {
		appDirs = readdirSync(CONTENT_ROOT, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name);
	} catch {
		// No content directory yet. An empty blog is a valid state; a crashed
		// build on a fresh clone is not.
		return [];
	}

	const posts: BlogPost[] = [];

	for (const app of appDirs) {
		const dir = join(CONTENT_ROOT, app);
		const files = readdirSync(dir).filter((file) => file.endsWith(".mdx"));

		for (const file of files) {
			const raw = readFileSync(join(dir, file), "utf8");
			const { content, data } = matter(raw);
			const parsed = frontmatterSchema.safeParse(data);

			if (!parsed.success) {
				throw new Error(
					`Invalid frontmatter in content/blog/${app}/${file}:\n${z.prettifyError(parsed.error)}`
				);
			}

			const front = parsed.data;

			if (front.slug !== file.replace(MDX_EXTENSION, "")) {
				throw new Error(
					`Slug mismatch in content/blog/${app}/${file}: frontmatter says "${front.slug}".`
				);
			}

			if (front.app !== app) {
				throw new Error(
					`App mismatch in content/blog/${app}/${file}: frontmatter says "${front.app}".`
				);
			}

			const product = getProduct(front.app);

			if (!product) {
				throw new Error(
					`content/blog/${app}/${file} targets "${front.app}", which is not an Edge app.`
				);
			}

			const wordCount = countWords(content);

			posts.push({
				...front,
				headings: extractHeadings(content),
				product,
				readingTime: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
				wordCount,
			});
		}
	}

	return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Every published post, newest first. */
export const POSTS: readonly BlogPost[] = readPosts();

export function getPost(slug: string): BlogPost | undefined {
	return POSTS.find((post) => post.slug === slug);
}

export function getPostsByApp(app: string): readonly BlogPost[] {
	return POSTS.filter((post) => post.app === app);
}

/** The pillar for a cluster, which the hub page features above the rest. */
export function getPillar(app: string): BlogPost | undefined {
	return POSTS.find((post) => post.app === app && post.archetype === "pillar");
}

/**
 * Apps that have at least one post, in catalog order. Drives the hub pages and
 * the blog index filter — an app with nothing written about it gets no empty
 * page for a crawler to find.
 */
export function getBlogApps(): readonly EdgeProduct[] {
	return EDGE_PRODUCTS.filter((product) =>
		POSTS.some((post) => post.app === product.slug)
	);
}

/**
 * Related posts, driven by `internalLinks` and topped up from the same cluster.
 *
 * The author's own links come first because they were chosen for a reason. The
 * fallback exists so a post never renders a row of two.
 */
export function getRelatedPosts(
	post: BlogPost,
	limit = 3
): readonly BlogPost[] {
	const explicit = post.internalLinks
		.map((slug) => getPost(slug))
		.filter((related): related is BlogPost => Boolean(related));

	const seen = new Set([post.slug, ...explicit.map((related) => related.slug)]);
	const fallback = getPostsByApp(post.app).filter(
		(sibling) => !seen.has(sibling.slug)
	);

	return [...explicit, ...fallback].slice(0, limit);
}

/** `21 August 2026` — the format the rest of the site would use if it had one. */
export function formatPostDate(date: string): string {
	return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		timeZone: "UTC",
		year: "numeric",
	});
}
