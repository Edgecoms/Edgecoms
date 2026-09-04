import "@edgecoms/env/web";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	/**
	 * The playbook email embeds the Edge Cart icon as an inline attachment, so
	 * `lib/edge-cart-email.ts` reads the PNG off disk at send time. On Vercel a
	 * route handler is a serverless function and `public/` is served by the CDN,
	 * not shipped inside the function bundle, so the file has to be traced in.
	 *
	 * Verified: `@vercel/nft` ALREADY resolves this one today, because the path
	 * is `join(process.cwd(), "public", "app-icons", LOGO_FILENAME)` and every
	 * segment is a literal it can evaluate. A clean build without this entry
	 * still traced the PNG and nothing else from `public/`.
	 *
	 * The entry stays anyway, as a pin rather than a fix. The moment that path
	 * stops being statically analysable — a filename from env, a locale in the
	 * middle, a helper that builds it — the tracer silently drops the asset,
	 * `logoBase64()` returns null, and every email ships logoless with nothing
	 * looking broken. This costs 12KB in one function and removes that failure
	 * mode.
	 */
	outputFileTracingIncludes: {
		"/api/edge-cart/send-guide": ["./public/app-icons/edge-cart-email.png"],
	},
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
