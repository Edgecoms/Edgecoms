import { ChevronLeft } from "lucide-react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tldr } from "@/components/blog/primitives";
import {
	AssistantRow,
	AuthorBio,
	PostCard,
	PostFaq,
	RelatedPosts,
} from "@/components/blog/sections";
import { TableOfContents } from "@/components/blog/toc";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import {
	AUTHORS,
	type BlogPost,
	formatPostDate,
	getBlogApps,
	getPillar,
	getPost,
	getPostsByApp,
	getRelatedPosts,
	POSTS,
} from "@/lib/blog";
import type { EdgeProduct } from "@/lib/products";
import {
	articleSchema,
	breadcrumbSchema,
	faqSchema,
	jsonLdScriptProps,
} from "@/lib/seo";
import { postMdxComponents } from "@/mdx-components";

/**
 * One `[slug]` segment serves both a post and a cluster hub.
 *
 * `/blog/trackproof` (a hub) and `/blog/shopify-server-side-tracking` (a post)
 * are the URLs we want, and Next cannot have `[app]` and `[slug]` as siblings —
 * so the segment resolves against the post catalog first and the app catalog
 * second. `scripts/audit-content.ts` fails the build if a post slug ever
 * collides with an app slug, which is the only way the two can be ambiguous.
 */

interface BlogSlugPageProps {
	params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
	return [
		...POSTS.map((post) => ({ slug: post.slug })),
		...getBlogApps().map((product) => ({ slug: product.slug })),
	];
}

export async function generateMetadata({
	params,
}: BlogSlugPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = getPost(slug);

	if (post) {
		const title = post.metaTitle ?? post.title;

		return {
			title,
			description: post.description,
			alternates: { canonical: `/blog/${post.slug}` },
			keywords: [post.primaryKeyword, ...post.secondaryKeywords],
			authors: [{ name: AUTHORS[post.author].name }],
			openGraph: {
				title,
				description: post.description,
				type: "article",
				url: `/blog/${post.slug}`,
				publishedTime: post.publishedAt,
				modifiedTime: post.updatedAt,
			},
		};
	}

	const product = getBlogApps().find((app) => app.slug === slug);

	if (!product) {
		return { title: "Not found · Edgecoms" };
	}

	return {
		title: `${product.name} articles`,
		description:
			`Guides, comparisons and fixes for ${product.name} — ${product.description}`.slice(
				0,
				158
			),
		alternates: { canonical: `/blog/${product.slug}` },
	};
}

async function PostView({ post }: { post: BlogPost }) {
	// Static prefix, variable tail: the bundler builds a context over
	// `content/blog/**/*.mdx` and every post resolves out of it at build time.
	const { default: Body } = await import(
		`@content/blog/${post.app}/${post.slug}.mdx`
	);
	const author = AUTHORS[post.author];
	const related = getRelatedPosts(post);

	return (
		<main>
			<script
				{...jsonLdScriptProps(
					articleSchema({
						authorName: author.name,
						authorUrl: author.linkedin,
						description: post.description,
						publishedAt: post.publishedAt,
						slug: post.slug,
						title: post.title,
						updatedAt: post.updatedAt,
					})
				)}
			/>
			<script {...jsonLdScriptProps(faqSchema(post.faq))} />
			<script
				{...jsonLdScriptProps(
					breadcrumbSchema([
						{ name: "Home", path: "/" },
						{ name: "Blog", path: "/blog" },
						{ name: post.product.name, path: `/blog/${post.app}` },
						{ name: post.title, path: `/blog/${post.slug}` },
					])
				)}
			/>

			<section className="w-full border-neutral-200 border-b bg-white">
				<Frame className="px-6 py-12 sm:px-8 sm:py-16">
					<Link
						className="inline-flex items-center gap-1 font-medium text-[14px] text-neutral-500 transition-colors hover:text-neutral-900"
						href={`/blog/${post.app}` as Route}
					>
						<ChevronLeft className="size-4" />
						{post.product.name} articles
					</Link>

					<header className="mt-8 max-w-3xl">
						<h1 className="text-balance font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-[2.75rem] sm:leading-[1.08]">
							{post.title}
						</h1>
						<p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-neutral-500">
							<span>{author.name}</span>
							<span aria-hidden="true" className="text-neutral-300">
								·
							</span>
							<time dateTime={post.publishedAt}>
								{formatPostDate(post.publishedAt)}
							</time>
							<span aria-hidden="true" className="text-neutral-300">
								·
							</span>
							<span>{post.readingTime} min read</span>
						</p>
					</header>

					<div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,42rem)_1fr] lg:gap-16">
						<article>
							<Tldr>
								<p>{post.tldr}</p>
							</Tldr>

							{/* Components are bound to this post, so a bare `<PostCta />` in
							    the body resolves to the right app and the right campaign. */}
							<Body components={postMdxComponents(post)} />

							<PostFaq items={post.faq} />
							<AuthorBio post={post} />
							<AssistantRow post={post} />
							<RelatedPosts posts={related} />
						</article>

						<aside className="order-first lg:order-none">
							<TableOfContents headings={post.headings} />
						</aside>
					</div>
				</Frame>
			</section>

			<CtaDark />
		</main>
	);
}

function HubView({ product }: { product: EdgeProduct }) {
	const posts = getPostsByApp(product.slug);
	const pillar = getPillar(product.slug);
	const rest = posts.filter((post) => post.slug !== pillar?.slug);

	return (
		<main>
			<script
				{...jsonLdScriptProps(
					breadcrumbSchema([
						{ name: "Home", path: "/" },
						{ name: "Blog", path: "/blog" },
						{ name: product.name, path: `/blog/${product.slug}` },
					])
				)}
			/>

			<section className="w-full border-neutral-200 border-b bg-white">
				<Frame className="px-6 py-12 sm:px-8 sm:py-16">
					<Link
						className="inline-flex items-center gap-1 font-medium text-[14px] text-neutral-500 transition-colors hover:text-neutral-900"
						href={"/blog" as Route}
					>
						<ChevronLeft className="size-4" />
						All articles
					</Link>

					<header className="mt-8 max-w-2xl">
						<h1 className="text-balance font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							{product.name} articles
						</h1>
						<p className="mt-4 text-pretty text-[17px] text-neutral-600 leading-relaxed">
							{product.heroLead}
						</p>
						<Link
							className="mt-5 inline-block font-medium text-[#ff5e1f] text-[15px] hover:underline"
							href={`/products/${product.slug}` as Route}
						>
							See what {product.name} does →
						</Link>
					</header>

					{pillar ? (
						<div className="mt-12">
							<PostCard featured post={pillar} />
						</div>
					) : null}

					{rest.length > 0 ? (
						<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
							{rest.map((post) => (
								<PostCard key={post.slug} post={post} />
							))}
						</div>
					) : null}
				</Frame>
			</section>

			<CtaDark />
		</main>
	);
}

export default async function BlogSlugPage({ params }: BlogSlugPageProps) {
	const { slug } = await params;
	const post = getPost(slug);

	if (post) {
		return <PostView post={post} />;
	}

	const product = getBlogApps().find((app) => app.slug === slug);

	if (product) {
		return <HubView product={product} />;
	}

	notFound();
}
