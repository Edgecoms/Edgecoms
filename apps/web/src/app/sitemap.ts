import type { MetadataRoute } from "next";
import { getBlogApps, POSTS } from "@/lib/blog";
import { ROLES } from "@/lib/careers";
import { CASE_STUDIES } from "@/lib/marketing-stats";
import { EDGE_PRODUCTS } from "@/lib/products";
import { absoluteUrl } from "@/lib/seo";

/**
 * Every page worth indexing, generated from the same catalogs the pages render
 * from. Adding an app, a case study, or a role puts it in the sitemap with no
 * second edit, which is the only way a sitemap stays honest.
 *
 * Deliberately absent: the `-old` routes and the `v1`/`v2` archives (duplicates
 * of live pages, also disallowed in robots.ts), `/login`, and both portals.
 * `/register` is here because it is a landing page with its own copy, not a
 * bare form.
 *
 * `priority` is relative within this file only. It is a hint about which pages
 * matter most to us, not a ranking lever.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();

	const staticPages: MetadataRoute.Sitemap = (
		[
			{ url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
			{
				url: absoluteUrl("/products"),
				changeFrequency: "weekly",
				priority: 0.9,
			},
			{
				url: absoluteUrl("/partners"),
				changeFrequency: "monthly",
				priority: 0.9,
			},
			{
				url: absoluteUrl("/case-studies"),
				changeFrequency: "weekly",
				priority: 0.8,
			},
			{
				url: absoluteUrl("/blog"),
				changeFrequency: "daily",
				priority: 0.8,
			},
			{
				url: absoluteUrl("/customers"),
				changeFrequency: "weekly",
				priority: 0.7,
			},
			{ url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
			{
				url: absoluteUrl("/careers"),
				changeFrequency: "weekly",
				priority: 0.6,
			},
			{
				url: absoluteUrl("/contact"),
				changeFrequency: "monthly",
				priority: 0.5,
			},
			{
				url: absoluteUrl("/register"),
				changeFrequency: "monthly",
				priority: 0.6,
			},
		] satisfies MetadataRoute.Sitemap
	).map((page) => ({ ...page, lastModified }));

	const productPages: MetadataRoute.Sitemap = EDGE_PRODUCTS.map((product) => ({
		url: absoluteUrl(`/products/${product.slug}`),
		lastModified,
		changeFrequency: "weekly",
		priority: 0.9,
	}));

	const caseStudyPages: MetadataRoute.Sitemap = Object.keys(CASE_STUDIES).map(
		(slug) => ({
			url: absoluteUrl(`/case-studies/${slug}`),
			lastModified,
			changeFrequency: "monthly",
			priority: 0.7,
		})
	);

	/**
	 * Posts carry a real `lastModified` from their own `updatedAt` rather than
	 * today's date. A sitemap that claims every page changed this morning is one
	 * Google stops believing, and then the dates stop being worth anything on the
	 * pages that genuinely did change.
	 */
	const blogPostPages: MetadataRoute.Sitemap = POSTS.map((post) => ({
		url: absoluteUrl(`/blog/${post.slug}`),
		lastModified: new Date(`${post.updatedAt}T00:00:00Z`),
		changeFrequency: "monthly",
		priority: post.archetype === "pillar" ? 0.8 : 0.6,
	}));

	const blogHubPages: MetadataRoute.Sitemap = getBlogApps().map((product) => ({
		url: absoluteUrl(`/blog/${product.slug}`),
		lastModified,
		changeFrequency: "weekly",
		priority: 0.7,
	}));

	const rolePages: MetadataRoute.Sitemap = ROLES.map((role) => ({
		url: absoluteUrl(`/careers/${role.slug}`),
		lastModified,
		changeFrequency: "weekly",
		priority: 0.5,
	}));

	return [
		...staticPages,
		...productPages,
		...blogHubPages,
		...blogPostPages,
		...caseStudyPages,
		...rolePages,
	];
}
