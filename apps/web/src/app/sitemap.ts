import type { MetadataRoute } from "next";
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
 * of live pages, also disallowed in robots.ts), the auth pages, and both
 * portals.
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

	const rolePages: MetadataRoute.Sitemap = ROLES.map((role) => ({
		url: absoluteUrl(`/careers/${role.slug}`),
		lastModified,
		changeFrequency: "weekly",
		priority: 0.5,
	}));

	return [...staticPages, ...productPages, ...caseStudyPages, ...rolePages];
}
