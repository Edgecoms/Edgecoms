import type { MDXComponents } from "mdx/types";
import type { Route } from "next";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { PostCta } from "@/components/blog/post-cta";
import {
	Callout,
	CheckedOn,
	Cite,
	Example,
	Tldr,
} from "@/components/blog/primitives";
import type { BlogPost } from "@/lib/blog";

/**
 * How markdown becomes the site's typography.
 *
 * There is no `prose` plugin here on purpose: the type scale, the weights, and
 * the Satoshi-for-headings rule already exist in `globals.css`, and a second
 * typographic system layered on top of them is how a blog ends up looking like
 * a different website.
 */

const ABSOLUTE_URL = /^https?:\/\//;

/** Internal links go through `next/link`; external ones get the safety rel. */
function Anchor({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
	const external = ABSOLUTE_URL.test(href);

	if (external) {
		return (
			<a
				className="text-[#ff5e1f] underline decoration-[#ff5e1f]/30 underline-offset-2 transition-colors hover:decoration-[#ff5e1f]"
				href={href}
				rel="noopener"
				target="_blank"
				{...props}
			/>
		);
	}

	return (
		<Link
			className="text-[#ff5e1f] underline decoration-[#ff5e1f]/30 underline-offset-2 transition-colors hover:decoration-[#ff5e1f]"
			href={href as Route}
			{...props}
		/>
	);
}

const prose: MDXComponents = {
	a: Anchor,
	blockquote: (props) => (
		<blockquote
			className="my-6 border-neutral-200 border-l-2 pl-5 text-[17px] text-neutral-600 italic leading-relaxed"
			{...props}
		/>
	),
	code: (props) => (
		<code
			className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.875em] text-neutral-800"
			{...props}
		/>
	),
	h2: (props) => (
		<h2
			className="mt-14 scroll-mt-24 text-balance font-bold font-satoshi text-2xl text-neutral-900 tracking-tight sm:text-3xl"
			{...props}
		/>
	),
	h3: (props) => (
		<h3
			className="mt-10 text-balance font-satoshi font-semibold text-[19px] text-neutral-900 tracking-tight"
			{...props}
		/>
	),
	h4: (props) => (
		<h4
			className="mt-8 font-satoshi font-semibold text-[17px] text-neutral-900"
			{...props}
		/>
	),
	hr: (props) => <hr className="my-12 border-neutral-200" {...props} />,
	li: (props) => (
		<li
			className="text-[17px] text-neutral-600 leading-relaxed marker:text-neutral-300"
			{...props}
		/>
	),
	ol: (props) => (
		<ol className="my-5 flex list-decimal flex-col gap-3 pl-5" {...props} />
	),
	p: (props) => (
		<p
			className="my-5 text-pretty text-[17px] text-neutral-600 leading-relaxed"
			{...props}
		/>
	),
	pre: (props) => (
		<pre
			className="my-6 overflow-x-auto rounded-xl bg-neutral-900 p-5 text-[13px] text-neutral-100 leading-relaxed"
			{...props}
		/>
	),
	strong: (props) => (
		<strong className="font-semibold text-neutral-900" {...props} />
	),
	/* Tables carry the comparison work on every alternative post, so they scroll
	   inside their own container rather than forcing the page sideways on a
	   phone. */
	table: (props) => (
		<div className="-mx-6 my-8 overflow-x-auto px-6 sm:mx-0 sm:px-0">
			<table
				className="w-full min-w-[34rem] border-collapse text-left"
				{...props}
			/>
		</div>
	),
	td: (props) => (
		<td
			className="border-neutral-200 border-b py-3 pr-4 align-top text-[15px] text-neutral-600 leading-relaxed"
			{...props}
		/>
	),
	th: (props) => (
		<th
			className="border-neutral-300 border-b py-3 pr-4 text-left font-semibold text-[14px] text-neutral-900"
			{...props}
		/>
	),
	ul: (props) => (
		<ul className="my-5 flex list-disc flex-col gap-3 pl-5" {...props} />
	),
};

/** Components a post can call by name in its body. */
const shortcodes: MDXComponents = {
	Callout,
	CheckedOn,
	Cite,
	Example,
	Tldr,
};

/**
 * Per-post bindings.
 *
 * MDX's default export takes a `components` prop, so the post page can hand the
 * body components that already know which post they are in — which is what lets
 * a post write a bare `<PostCta />` and get the right app, the right listing URL
 * and the right `utm_campaign` without restating them four times per file.
 */
export function postMdxComponents(post: BlogPost): MDXComponents {
	return {
		...prose,
		...shortcodes,
		PostCta: () => <PostCta post={post} />,
	};
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return { ...prose, ...shortcodes, ...components };
}
