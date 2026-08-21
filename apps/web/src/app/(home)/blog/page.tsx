import type { Metadata, Route } from "next";
import Link from "next/link";
import { PostCard } from "@/components/blog/sections";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { AppIcon } from "@/components/ui/app-icon";
import { getBlogApps, getPillar, getPostsByApp, POSTS } from "@/lib/blog";
import { breadcrumbSchema, jsonLdScriptProps } from "@/lib/seo";

const DESCRIPTION =
	"Guides on Shopify conversion tracking, bundles, cart, reviews, subscriptions, urgency and multi-currency — written by the people building the apps.";

export const metadata: Metadata = {
	title: "Blog",
	description: DESCRIPTION,
	alternates: { canonical: "/blog" },
	openGraph: {
		title: "Edgecoms blog",
		description: DESCRIPTION,
		type: "website",
		url: "/blog",
	},
};

/** How many recent posts lead the page before the by-app browse. */
const LATEST_COUNT = 4;

export default function BlogIndexPage() {
	const apps = getBlogApps();
	const latest = POSTS.slice(0, LATEST_COUNT);

	return (
		<main>
			<script
				{...jsonLdScriptProps(
					breadcrumbSchema([
						{ name: "Home", path: "/" },
						{ name: "Blog", path: "/blog" },
					])
				)}
			/>

			<section className="w-full border-neutral-200 border-b bg-white">
				<Frame className="px-6 py-12 sm:px-8 sm:py-16">
					<header className="max-w-2xl">
						<h1 className="text-balance font-bold font-satoshi text-4xl text-neutral-900 tracking-tight sm:text-5xl">
							The Edgecoms blog
						</h1>
						<p className="mt-5 text-pretty text-[17px] text-neutral-600 leading-relaxed">
							{DESCRIPTION}
						</p>
					</header>

					{/* Browse by app first: someone arriving from a search for one
					    problem is almost always inside one cluster, and the hub is a
					    better landing than a reverse-chronological feed. */}
					{apps.length > 0 ? (
						<nav
							aria-label="Browse by app"
							className="mt-10 flex flex-wrap gap-2"
						>
							{apps.map((product) => (
								<Link
									className="inline-flex items-center gap-2 rounded-full border border-neutral-200 py-1.5 pr-4 pl-2 font-medium text-[14px] text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
									href={`/blog/${product.slug}` as Route}
									key={product.slug}
								>
									<AppIcon product={product} size="sm" />
									{product.name}
									<span className="text-neutral-400">
										{getPostsByApp(product.slug).length}
									</span>
								</Link>
							))}
						</nav>
					) : null}

					{latest.length > 0 ? (
						<section className="mt-14">
							<h2 className="font-bold font-satoshi text-2xl text-neutral-900 tracking-tight">
								Latest
							</h2>
							<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
								{latest.map((post) => (
									<PostCard key={post.slug} post={post} />
								))}
							</div>
						</section>
					) : null}

					{apps.map((product) => {
						const pillar = getPillar(product.slug);
						const posts = getPostsByApp(product.slug)
							.filter((post) => post.slug !== pillar?.slug)
							.slice(0, 2);

						if (!pillar && posts.length === 0) {
							return null;
						}

						return (
							<section className="mt-14" key={product.slug}>
								<div className="flex items-center justify-between gap-4">
									<h2 className="flex items-center gap-2.5 font-bold font-satoshi text-2xl text-neutral-900 tracking-tight">
										<AppIcon product={product} size="md" />
										{product.name}
									</h2>
									<Link
										className="shrink-0 font-medium text-[#ff5e1f] text-[14px] hover:underline"
										href={`/blog/${product.slug}` as Route}
									>
										All {getPostsByApp(product.slug).length} →
									</Link>
								</div>
								{pillar ? (
									<div className="mt-6">
										<PostCard featured post={pillar} />
									</div>
								) : null}
								{posts.length > 0 ? (
									<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
										{posts.map((post) => (
											<PostCard key={post.slug} post={post} />
										))}
									</div>
								) : null}
							</section>
						);
					})}
				</Frame>
			</section>

			<CtaDark />
		</main>
	);
}
