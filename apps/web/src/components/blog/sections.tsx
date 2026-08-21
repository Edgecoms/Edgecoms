import type { Route } from "next";
import Link from "next/link";
import {
	AUTHORS,
	type BlogFaq,
	type BlogPost,
	formatPostDate,
} from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo";

/**
 * The blocks that close out every post: questions, byline, assistant hand-off,
 * and the next thing worth reading.
 */

/**
 * Native `<details>`, matching `marketing/faq-list.tsx`. Keyboard-operable and
 * screen-reader-correct for free, works before hydration, and the answers sit in
 * the DOM whether or not anyone opens them — which is the condition for the
 * FAQPage markup on this page being an honest description of it.
 */
export function PostFaq({ items }: { items: readonly BlogFaq[] }) {
	return (
		<section aria-labelledby="faq" className="mt-16">
			<h2
				className="font-bold font-satoshi text-2xl text-neutral-900 tracking-tight"
				id="faq"
			>
				Questions people ask next
			</h2>
			<div className="mt-6 flex flex-col border-neutral-200 border-t">
				{items.map((item) => (
					<details
						className="group border-neutral-200 border-b"
						key={item.question}
					>
						<summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-pretty py-4 font-medium text-[16px] text-neutral-900 marker:content-none hover:text-[#ff5e1f] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-neutral-300">
							{item.question}
							<span
								aria-hidden="true"
								className="mt-1 shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-45"
							>
								+
							</span>
						</summary>
						<div className="pb-5">
							<p className="text-[15px] text-neutral-600 leading-relaxed">
								{item.answer}
							</p>
							{item.source ? (
								<a
									className="mt-2 inline-block text-[#ff5e1f] text-[13px] underline decoration-[#ff5e1f]/30 underline-offset-2"
									href={item.source}
									rel="noopener nofollow"
									target="_blank"
								>
									Source
								</a>
							) : null}
						</div>
					</details>
				))}
			</div>
		</section>
	);
}

export function AuthorBio({ post }: { post: BlogPost }) {
	const author = AUTHORS[post.author];

	return (
		<section className="mt-16 flex gap-4 rounded-2xl border border-neutral-200 p-6">
			<span
				aria-hidden="true"
				className="grid size-11 shrink-0 place-items-center rounded-full bg-neutral-900 font-satoshi font-semibold text-[16px] text-white"
			>
				{author.name.charAt(0)}
			</span>
			<div>
				<p className="font-satoshi font-semibold text-[16px] text-neutral-900">
					{author.name}
				</p>
				<p className="text-[14px] text-neutral-500">{author.role}</p>
				<p className="mt-3 text-pretty text-[15px] text-neutral-600 leading-relaxed">
					{author.bio}
				</p>
				{/* Rendered only when a real profile exists — see BlogAuthor.linkedin. */}
				{author.linkedin ? (
					<a
						className="mt-3 inline-block font-medium text-[#ff5e1f] text-[14px] hover:underline"
						href={author.linkedin}
						rel="noopener"
						target="_blank"
					>
						Connect on LinkedIn
					</a>
				) : null}
			</div>
		</section>
	);
}

/**
 * "Read this on your assistant."
 *
 * People increasingly ask an assistant to digest a page rather than reading it,
 * and an assistant that is handed the URL cites the URL. Each link opens the
 * assistant with the question already typed.
 */
const ASSISTANTS = [
	{ base: "https://chatgpt.com/?q=", name: "ChatGPT" },
	{ base: "https://www.perplexity.ai/search?q=", name: "Perplexity" },
	{ base: "https://gemini.google.com/app?q=", name: "Gemini" },
	{ base: "https://claude.ai/new?q=", name: "Claude" },
] as const;

export function AssistantRow({ post }: { post: BlogPost }) {
	const prompt = `Summarise this article and tell me what it means for my Shopify store: ${absoluteUrl(`/blog/${post.slug}`)}`;
	const encoded = encodeURIComponent(prompt);

	return (
		<section className="mt-12 rounded-2xl border border-neutral-200 border-dashed p-6">
			<p className="font-medium font-satoshi text-[15px] text-neutral-900">
				Read this on your assistant
			</p>
			<p className="mt-1 text-[14px] text-neutral-500">
				Opens with a summary request for this page already written.
			</p>
			<div className="mt-4 flex flex-wrap gap-2">
				{ASSISTANTS.map((assistant) => (
					<a
						className="inline-flex h-9 items-center rounded-full border border-neutral-200 px-4 font-medium text-[14px] text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
						href={`${assistant.base}${encoded}`}
						key={assistant.name}
						rel="noopener nofollow"
						target="_blank"
					>
						{assistant.name}
					</a>
				))}
			</div>
		</section>
	);
}

export function RelatedPosts({ posts }: { posts: readonly BlogPost[] }) {
	if (posts.length === 0) {
		return null;
	}

	return (
		<section className="mt-16 border-neutral-200 border-t pt-10">
			<h2 className="font-bold font-satoshi text-2xl text-neutral-900 tracking-tight">
				Read next
			</h2>
			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{posts.map((related) => (
					<Link
						className="group flex flex-col gap-2 rounded-xl border border-neutral-200 p-5 transition-colors hover:border-neutral-400"
						href={`/blog/${related.slug}` as Route}
						key={related.slug}
					>
						<span className="text-[13px] text-neutral-500">
							{related.product.name}
						</span>
						<span className="text-pretty font-medium font-satoshi text-[16px] text-neutral-900 leading-snug group-hover:text-[#ff5e1f]">
							{related.title}
						</span>
						<span className="mt-auto pt-2 text-[13px] text-neutral-400">
							{related.readingTime} min read
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}

/**
 * The card used on the index and the cluster hubs.
 *
 * `featured` is the pillar treatment: same data, more room. Images are
 * deliberately typographic placeholders for now rather than stock photography —
 * a generic photo above a technical post adds weight and says nothing.
 */
export function PostCard({
	featured = false,
	post,
}: {
	featured?: boolean;
	post: BlogPost;
}) {
	return (
		<Link
			className={`group flex flex-col rounded-2xl border border-neutral-200 transition-colors hover:border-neutral-400 ${featured ? "gap-4 p-7 sm:p-8" : "gap-3 p-6"}`}
			href={`/blog/${post.slug}` as Route}
		>
			<span className="flex items-center gap-2 text-[13px] text-neutral-500">
				{post.product.name}
				<span aria-hidden="true" className="text-neutral-300">
					·
				</span>
				{post.readingTime} min read
			</span>
			<span
				className={`text-pretty font-bold font-satoshi text-neutral-900 leading-tight tracking-tight group-hover:text-[#ff5e1f] ${featured ? "text-2xl sm:text-3xl" : "text-lg"}`}
			>
				{post.title}
			</span>
			<span
				className={`text-pretty text-neutral-600 leading-relaxed ${featured ? "text-[16px]" : "text-[14px]"}`}
			>
				{post.description}
			</span>
			<span className="mt-auto pt-3 text-[13px] text-neutral-400">
				{formatPostDate(post.publishedAt)}
			</span>
		</Link>
	);
}
