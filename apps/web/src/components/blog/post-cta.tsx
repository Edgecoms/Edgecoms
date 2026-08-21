import type { BlogPost } from "@/lib/blog";

/**
 * The in-body conversion block, repeated down a post.
 *
 * The destination is the app's own App Store listing, tagged so organic traffic
 * is separable from everything else in the install report. `appStoreUrl` is
 * optional in the catalog on purpose — five of the seven apps are not live yet —
 * so this falls back to /contact rather than shipping a button that 404s.
 */
export function PostCta({ post }: { post: BlogPost }) {
	const { product } = post;
	const live = Boolean(product.appStoreUrl);
	const href = live
		? `${product.appStoreUrl}?utm_source=organic&utm_medium=blog&utm_campaign=${post.slug}`
		: `/contact?utm_source=organic&utm_medium=blog&utm_campaign=${post.slug}`;

	return (
		<aside className="my-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-7">
			<p className="font-medium text-[13px] text-neutral-500">{product.name}</p>
			<p className="mt-2 max-w-xl text-pretty font-medium font-satoshi text-[19px] text-neutral-900 leading-snug">
				{product.ctaHeading}
			</p>
			<p className="mt-2 max-w-xl text-pretty text-[15px] text-neutral-600 leading-relaxed">
				{product.heroLead}
			</p>
			<a
				className="mt-5 inline-flex h-10 items-center rounded-full bg-[#ff5e1f] px-5 font-medium text-[15px] text-white transition-colors hover:bg-[#e5541b]"
				href={href}
				rel={live ? "noopener" : undefined}
				target={live ? "_blank" : undefined}
			>
				{live ? `Install ${product.name}` : `Talk to us about ${product.name}`}
			</a>
		</aside>
	);
}
