import "@edgecoms/env/web";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	/**
	 * `mdx` is NOT added to `pageExtensions` on purpose. Blog content lives under
	 * `content/blog/`, outside `src/app/`, and is pulled in by the `[slug]` route
	 * rather than becoming a route itself — so the catalog in `lib/blog.ts` stays
	 * the one thing that decides which posts exist, exactly like `products.ts`
	 * decides which app pages exist.
	 */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
};

/**
 * `remark-frontmatter` only teaches the parser to *recognise* YAML frontmatter
 * so it stops rendering as a paragraph of stray text. The values are read
 * separately by `lib/blog.ts` with gray-matter, which is what the sitemap, the
 * hub pages, and the related-posts row read from.
 */
const withMDX = createMDX({
	options: {
		remarkPlugins: [["remark-frontmatter", ["yaml"]], "remark-gfm"],
		rehypePlugins: [["rehype-slug"]],
	},
});

export default withMDX(nextConfig);
