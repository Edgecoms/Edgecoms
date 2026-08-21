#!/usr/bin/env bun
/**
 * THE CONTENT QUALITY GATE.
 *
 * This is the blog's equivalent of the money tests: the checks that catch the
 * mistakes nobody notices for a month. It runs over the MDX on disk rather than
 * over the rendered site, so it can be the first thing CI does and the last
 * thing a writer runs.
 *
 * It exits non-zero on any failure. Warnings are printed and do not fail, and
 * are used only where the correct state is genuinely ambiguous — a planned
 * internal link to a post that has not been published yet is the main one.
 *
 *   bun run scripts/audit-content.ts
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { EDGE_PRODUCTS } from "../apps/web/src/lib/products";

const CONTENT_ROOT = join(
	import.meta.dir,
	"..",
	"apps",
	"web",
	"content",
	"blog"
);

/**
 * The components a post renders through carry reader-facing copy of their own,
 * so the em dash rule has to cover them too. Two slipped into `Example` and
 * `CheckedOn` on the first pass and only turned up in the rendered HTML, which
 * is exactly the gap this closes.
 */
const BLOG_COMPONENT_ROOT = join(
	import.meta.dir,
	"..",
	"apps",
	"web",
	"src",
	"components",
	"blog"
);

/** Google truncates past roughly 160 and wastes the snippet under roughly 140. */
const DESCRIPTION_MIN = 140;
const DESCRIPTION_MAX = 160;
const TITLE_MAX = 60;
const MIN_INTERNAL_LINKS = 3;
const TLDR_MIN_WORDS = 40;
const TLDR_MAX_WORDS = 60;
const MIN_FAQ = 3;
const MAX_FAQ = 5;
const SIMILARITY_CEILING = 0.85;
/** Words from the top of the body in which the primary keyword must appear. */
const KEYWORD_WINDOW = 100;

const WORD_RANGE: Record<string, readonly [number, number]> = {
	pillar: [2500, 3200],
	alternative: [1500, 2000],
	listicle: [1500, 2000],
	problem: [1500, 2000],
	tutorial: [1500, 2000],
};

interface Post {
	body: string;
	file: string;
	front: Record<string, unknown>;
}

const failures: string[] = [];
const warnings: string[] = [];

function fail(post: Post, message: string): void {
	failures.push(`${post.file}: ${message}`);
}

function warn(post: Post, message: string): void {
	warnings.push(`${post.file}: ${message}`);
}

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

function loadPosts(): Post[] {
	const posts: Post[] = [];

	let appDirs: string[];
	try {
		appDirs = readdirSync(CONTENT_ROOT, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name);
	} catch {
		return posts;
	}

	for (const app of appDirs) {
		for (const file of readdirSync(join(CONTENT_ROOT, app))) {
			if (!file.endsWith(".mdx")) {
				continue;
			}
			const raw = readFileSync(join(CONTENT_ROOT, app, file), "utf8");
			const { content, data } = matter(raw);
			posts.push({
				body: content,
				file: `${app}/${file}`,
				front: data as Record<string, unknown>,
			});
		}
	}

	return posts;
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

const CODE_FENCE = /```[\s\S]*?```/g;
const JSX_TAG = /<[^>]+>/g;
const NON_WORD = /[^a-z0-9\s]/g;
const EXAMPLE_OPEN = /^\s*<Example[\s>]/;
const EXAMPLE_CLOSE = /^\s*<\/Example>/;
/** A number immediately followed by %, x, or × — "40%", "3x", "2.5×". */
const STAT_SHAPED = /\d+(?:\.\d+)?\s?(?:%|x\b|×)/i;
/** Either a `<Cite href="...">` or a markdown link to an absolute URL. */
const HAS_CITATION = /<Cite\s+href="https?:\/\/|\]\(https?:\/\//;
const INTERNAL_BLOG_LINK = /\]\(\/blog\/([a-z0-9-]+)\)/g;
const H2_LINE = /^##\s+/;
const WHITESPACE = /\s+/;
const EM_DASH = "\u2014";
const CTA_LINE = /^\s*<PostCta\s*\/>\s*$/;

function plainWords(text: string): string[] {
	return text
		.replace(CODE_FENCE, " ")
		.replace(JSX_TAG, " ")
		.split(WHITESPACE)
		.filter(Boolean);
}

function tokens(text: string): string[] {
	return text
		.replace(CODE_FENCE, " ")
		.replace(JSX_TAG, " ")
		.toLowerCase()
		.replace(NON_WORD, " ")
		.split(WHITESPACE)
		.filter((word) => word.length > 2);
}

/**
 * TF-IDF cosine similarity.
 *
 * Deliberately local and dependency-free. An embedding API would understand
 * paraphrase better, but this catches what the rule is actually for — two posts
 * that ended up saying the same thing in the same words — and it runs in CI
 * with no key, no network, and the same answer every time.
 */
function cosineSimilarity(
	a: Map<string, number>,
	b: Map<string, number>
): number {
	let dot = 0;
	let magA = 0;
	let magB = 0;

	for (const [term, weight] of a) {
		magA += weight * weight;
		const other = b.get(term);
		if (other !== undefined) {
			dot += weight * other;
		}
	}

	for (const weight of b.values()) {
		magB += weight * weight;
	}

	if (magA === 0 || magB === 0) {
		return 0;
	}

	return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function tfidfVectors(docs: string[][]): Map<string, number>[] {
	const docFrequency = new Map<string, number>();

	for (const doc of docs) {
		for (const term of new Set(doc)) {
			docFrequency.set(term, (docFrequency.get(term) ?? 0) + 1);
		}
	}

	return docs.map((doc) => {
		const counts = new Map<string, number>();
		for (const term of doc) {
			counts.set(term, (counts.get(term) ?? 0) + 1);
		}

		const vector = new Map<string, number>();
		for (const [term, count] of counts) {
			const idf = Math.log(docs.length / (docFrequency.get(term) ?? 1)) + 1;
			vector.set(term, (count / doc.length) * idf);
		}

		return vector;
	});
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

function checkRequiredFrontmatter(post: Post): void {
	for (const field of [
		"title",
		"slug",
		"app",
		"archetype",
		"author",
		"description",
		"primaryKeyword",
		"publishedAt",
		"updatedAt",
		"imageAlt",
		"tldr",
		"faq",
		"internalLinks",
	]) {
		if (post.front[field] === undefined) {
			fail(post, `missing frontmatter: ${field}`);
		}
	}
}

function checkLengths(post: Post): void {
	const title = String(post.front.title ?? "");
	const description = String(post.front.description ?? "");
	const tldrWords = String(post.front.tldr ?? "")
		.split(WHITESPACE)
		.filter(Boolean);

	if (title.length > TITLE_MAX) {
		fail(post, `title is ${title.length} chars (max ${TITLE_MAX})`);
	}

	if (
		description.length < DESCRIPTION_MIN ||
		description.length > DESCRIPTION_MAX
	) {
		fail(
			post,
			`description is ${description.length} chars (must be ${DESCRIPTION_MIN}-${DESCRIPTION_MAX})`
		);
	}

	if (tldrWords.length < TLDR_MIN_WORDS || tldrWords.length > TLDR_MAX_WORDS) {
		fail(
			post,
			`tldr is ${tldrWords.length} words (must be ${TLDR_MIN_WORDS}-${TLDR_MAX_WORDS})`
		);
	}

	const faq = post.front.faq;
	if (!Array.isArray(faq) || faq.length < MIN_FAQ || faq.length > MAX_FAQ) {
		fail(
			post,
			`faq has ${Array.isArray(faq) ? faq.length : 0} entries (must be ${MIN_FAQ}-${MAX_FAQ})`
		);
	}

	checkCounts(post);
}

/** Link count, FAQ count and body length — the countable half of the checks. */
function checkCounts(post: Post): void {
	const links = post.front.internalLinks;
	if (!Array.isArray(links) || links.length < MIN_INTERNAL_LINKS) {
		fail(
			post,
			`has ${Array.isArray(links) ? links.length : 0} internal links (min ${MIN_INTERNAL_LINKS})`
		);
	}

	const archetype = String(post.front.archetype ?? "");
	const range = WORD_RANGE[archetype];

	if (!range) {
		return;
	}

	const count = plainWords(post.body).length;

	if (count < range[0] || count > range[1]) {
		fail(
			post,
			`body is ${count} words, outside the ${archetype} range ${range[0]}-${range[1]}`
		);
	}
}

/**
 * Every stat-shaped string must have a source next to it.
 *
 * Lines inside an `<Example>` block are skipped: that component exists to mark
 * arithmetic the reader is meant to substitute their own numbers into, which is
 * a hypothesis rather than a claim about the world. FAQ answers are checked
 * too, via the entry's own `source` field, because an answer is the part of a
 * post most likely to be lifted verbatim into a search result.
 */
function checkStats(post: Post): void {
	let inExample = false;

	for (const [index, line] of post.body.split("\n").entries()) {
		if (EXAMPLE_OPEN.test(line)) {
			inExample = true;
			continue;
		}
		if (EXAMPLE_CLOSE.test(line)) {
			inExample = false;
			continue;
		}
		if (inExample) {
			continue;
		}

		if (STAT_SHAPED.test(line) && !HAS_CITATION.test(line)) {
			fail(
				post,
				`line ${index + 1} states a figure with no citation: ${line.trim().slice(0, 90)}`
			);
		}
	}

	const faq = post.front.faq;
	if (Array.isArray(faq)) {
		for (const entry of faq as { answer?: string; source?: string }[]) {
			if (STAT_SHAPED.test(entry.answer ?? "") && !entry.source) {
				fail(
					post,
					`faq answer states a figure with no source: "${(entry.answer ?? "").slice(0, 70)}..."`
				);
			}
		}
	}
}

/**
 * No em dashes in reader-facing copy.
 *
 * House rule. The em dash is one of the strongest tells of machine-written
 * prose, and this blog's whole premise is that a person who runs the agency
 * wrote it. Restructure the sentence rather than substituting punctuation: a
 * full stop and a short new sentence is usually better anyway, and it matches
 * the voice. En dashes in numeric ranges are fine and are not checked.
 */
function checkEmDashes(post: Post): void {
	for (const [index, line] of post.body.split("\n").entries()) {
		if (line.includes(EM_DASH)) {
			fail(
				post,
				`line ${index + 1} uses an em dash: ${line.trim().slice(0, 90)}`
			);
		}
	}

	for (const field of ["title", "description", "tldr"]) {
		if (String(post.front[field] ?? "").includes(EM_DASH)) {
			fail(post, `${field} uses an em dash`);
		}
	}

	const faq = post.front.faq;
	if (Array.isArray(faq)) {
		for (const entry of faq as { answer?: string; question?: string }[]) {
			if (
				(entry.answer ?? "").includes(EM_DASH) ||
				(entry.question ?? "").includes(EM_DASH)
			) {
				fail(post, "an faq entry uses an em dash");
			}
		}
	}
}

/** Primary keyword in the title and in the opening of the body. */
function checkKeywordPlacement(post: Post): void {
	const keyword = String(post.front.primaryKeyword ?? "").toLowerCase();
	if (!keyword) {
		return;
	}

	// "Server-Side Tracking" in a title matches the keyword "server side
	// tracking". Hyphenation is a typographic choice, not a different phrase.
	const flatten = (text: string) => text.toLowerCase().replace(/[-–—]/g, " ");
	const title = flatten(String(post.front.title ?? ""));
	if (!title.includes(flatten(keyword))) {
		warn(post, `title does not contain the primary keyword "${keyword}"`);
	}

	const opening = plainWords(post.body)
		.slice(0, KEYWORD_WINDOW)
		.join(" ")
		.toLowerCase()
		.replace(NON_WORD, " ")
		.replace(/\s+/g, " ");

	if (!opening.includes(keyword)) {
		fail(
			post,
			`primary keyword "${keyword}" does not appear in the first ${KEYWORD_WINDOW} words`
		);
	}
}

/** A CTA block after every second H2. */
function checkCtaCadence(post: Post): void {
	const marks: ("h2" | "cta")[] = [];

	for (const line of post.body.split("\n")) {
		if (H2_LINE.test(line)) {
			marks.push("h2");
		} else if (CTA_LINE.test(line)) {
			marks.push("cta");
		}
	}

	const headings = marks.filter((mark) => mark === "h2").length;
	const expected = Math.floor(headings / 2);
	const actual = marks.filter((mark) => mark === "cta").length;

	if (actual !== expected) {
		fail(
			post,
			`has ${headings} H2s and ${actual} CTA blocks (expected ${expected}, one after every second H2)`
		);
	}

	// Position check: the Nth CTA should follow the 2Nth heading.
	let seenHeadings = 0;
	let seenCtas = 0;
	for (const mark of marks) {
		if (mark === "h2") {
			seenHeadings += 1;
		} else {
			seenCtas += 1;
			if (seenHeadings !== seenCtas * 2) {
				fail(
					post,
					`CTA #${seenCtas} sits after H2 #${seenHeadings} (expected after H2 #${seenCtas * 2})`
				);
				return;
			}
		}
	}
}

/** In-body links to posts that do not exist would 404. */
function checkBodyLinks(
	post: Post,
	slugs: Set<string>,
	apps: Set<string>
): void {
	for (const match of post.body.matchAll(INTERNAL_BLOG_LINK)) {
		const target = match[1];
		if (!(slugs.has(target) || apps.has(target))) {
			fail(post, `body links to /blog/${target}, which does not exist`);
		}
		if (target === post.front.slug) {
			fail(post, "body links to itself");
		}
	}
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

/** A JSDoc, line or JSX comment. Never reaches the reader, so dashes are fine. */
const COMMENT_LINE = /^\s*(\*|\/\/|\/\*|\{\/\*)/;

for (const file of readdirSync(BLOG_COMPONENT_ROOT)) {
	const source = readFileSync(join(BLOG_COMPONENT_ROOT, file), "utf8");

	for (const [index, line] of source.split("\n").entries()) {
		if (line.includes(EM_DASH) && !COMMENT_LINE.test(line)) {
			failures.push(
				`src/components/blog/${file}: line ${index + 1} has an em dash in rendered copy`
			);
		}
	}
}

const posts = loadPosts();

if (posts.length === 0) {
	process.stdout.write("No posts found. Nothing to audit.\n");
	process.exit(0);
}

const appSlugs = new Set(EDGE_PRODUCTS.map((product) => product.slug));
const slugs = new Set(posts.map((post) => String(post.front.slug)));

// Cross-post uniqueness.
const seenSlugs = new Map<string, string>();
const seenKeywords = new Map<string, string>();

for (const post of posts) {
	const slug = String(post.front.slug ?? "");
	const keyword = String(post.front.primaryKeyword ?? "").toLowerCase();

	if (seenSlugs.has(slug)) {
		fail(post, `duplicate slug, also used by ${seenSlugs.get(slug)}`);
	}
	seenSlugs.set(slug, post.file);

	if (seenKeywords.has(keyword)) {
		fail(
			post,
			`duplicate primary keyword "${keyword}", also targeted by ${seenKeywords.get(keyword)}`
		);
	}
	seenKeywords.set(keyword, post.file);

	// The `/blog/[slug]` route resolves posts before app hubs, so a post whose
	// slug matches an app slug would take the hub's URL and hide it.
	if (appSlugs.has(slug)) {
		fail(post, `slug "${slug}" collides with the ${slug} cluster hub URL`);
	}
}

for (const post of posts) {
	checkRequiredFrontmatter(post);
	checkLengths(post);
	checkStats(post);
	checkEmDashes(post);
	checkKeywordPlacement(post);
	checkCtaCadence(post);
	checkBodyLinks(post, slugs, appSlugs);

	// Planned links to unpublished posts are expected mid-programme.
	const links = post.front.internalLinks;
	if (Array.isArray(links)) {
		for (const link of links as string[]) {
			if (!(slugs.has(link) || appSlugs.has(link))) {
				warn(post, `internalLinks references "${link}", not yet published`);
			}
		}
	}
}

// Body similarity.
const vectors = tfidfVectors(posts.map((post) => tokens(post.body)));

for (let i = 0; i < posts.length; i++) {
	for (let j = i + 1; j < posts.length; j++) {
		const score = cosineSimilarity(vectors[i], vectors[j]);
		if (score > SIMILARITY_CEILING) {
			failures.push(
				`${posts[i].file} is ${score.toFixed(3)} cosine-similar to ${posts[j].file} (ceiling ${SIMILARITY_CEILING})`
			);
		}
	}
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

process.stdout.write(`Audited ${posts.length} posts.\n`);

if (warnings.length > 0) {
	process.stdout.write(`\n${warnings.length} warning(s):\n`);
	for (const warning of warnings) {
		process.stdout.write(`  ! ${warning}\n`);
	}
}

if (failures.length > 0) {
	process.stdout.write(`\n${failures.length} failure(s):\n`);
	for (const failure of failures) {
		process.stdout.write(`  x ${failure}\n`);
	}
	process.exit(1);
}

process.stdout.write("\nAll checks passed.\n");
