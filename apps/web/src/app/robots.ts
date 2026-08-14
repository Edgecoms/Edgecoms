import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

/**
 * What crawlers may read.
 *
 * The disallow list is deliberately explicit rather than relying on routes
 * being unlinked: the superseded `-old` pages duplicate live copy almost word
 * for word, and a duplicate that outranks the page it replaced is worse than no
 * page at all. The portals are behind auth, so a crawler would only ever reach
 * a redirect, but they are listed anyway.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/api/",
					"/admin",
					"/partner",
					"/about-old",
					"/contact-old",
					"/products-old",
					"/partners-s",
					"/v1",
					"/v2",
				],
			},
		],
		sitemap: absoluteUrl("/sitemap.xml"),
		host: SITE_URL,
	};
}
