import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { getBlogApps, POSTS } from "@/lib/blog";
import { EDGE_PRODUCTS } from "@/lib/products";

interface FooterLink {
	external?: boolean;
	href: string;
	icon?: string;
	label: string;
}

/* No socials row and no status pill, both of which the reference footer has.
   We have no published social accounts and no status page, and an
   "All systems operational" badge that is not wired to anything is a claim
   rather than a decoration. Add them when they exist. */
const PRODUCT_LINKS: readonly FooterLink[] = EDGE_PRODUCTS.slice(0, 4).map(
	(product) => ({
		href: `/products/${product.slug}`,
		icon: `/app-icons/${product.slug}.webp`,
		label: product.name,
	})
);

const COLUMNS: readonly { heading: string; links: readonly FooterLink[] }[] = [
	{
		heading: "Product",
		links: [...PRODUCT_LINKS, { href: "/products", label: "All apps" }],
	},
	{
		heading: "Resources",
		links: [
			{ href: "/blog", label: "Blog" },
			{ href: "/case-studies", label: "Case studies" },
			{ href: "/contact", label: "Contact" },
		],
	},
	{
		heading: "Company",
		links: [
			{ href: "/about", label: "About" },
			{ href: "/partners", label: "Partner program" },
			{ href: "/register", label: "Apply to the program" },
			{ href: "/login", label: "Partner login" },
		],
	},
	{
		heading: "Get in touch",
		links: [
			{ external: true, href: "mailto:hello@edgecoms.com", label: "General" },
			{ external: true, href: "mailto:support@edgecoms.com", label: "Support" },
			{
				external: true,
				href: "mailto:partners@edgecoms.com",
				label: "Partnerships",
			},
		],
	},
];

const LINK_CLASS =
	"flex items-center gap-2 text-[14px] text-neutral-500 transition-colors hover:text-neutral-900";

/**
 * The blog band.
 *
 * Two jobs: it puts the newest writing one click from every page on the site,
 * and it gives a crawler a path to posts that are not yet linked from anywhere
 * else. Renders nothing at all until posts exist, so the footer never carries an
 * empty heading.
 */
function BlogBand() {
	const latest = POSTS.slice(0, 4);
	const apps = getBlogApps();

	if (latest.length === 0) {
		return null;
	}

	return (
		<section
			aria-labelledby="footer-blog"
			className="mt-16 border-neutral-200 border-t pt-10"
		>
			<div className="flex items-baseline justify-between gap-4">
				<h2
					className="font-medium text-[14px] text-neutral-900"
					id="footer-blog"
				>
					From the blog
				</h2>
				<Link
					className="shrink-0 text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
					href={"/blog" as Route}
				>
					All articles →
				</Link>
			</div>

			<ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
				{latest.map((post) => (
					<li key={post.slug}>
						<Link
							className="text-pretty text-[14px] text-neutral-500 leading-snug transition-colors hover:text-neutral-900"
							href={`/blog/${post.slug}` as Route}
						>
							{post.title}
						</Link>
					</li>
				))}
			</ul>

			{apps.length > 0 ? (
				<ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
					{apps.map((product) => (
						<li key={product.slug}>
							<Link
								className="text-[13px] text-neutral-400 transition-colors hover:text-neutral-900"
								href={`/blog/${product.slug}` as Route}
							>
								{product.name}
							</Link>
						</li>
					))}
				</ul>
			) : null}
		</section>
	);
}

export function LandingFooter() {
	return (
		<footer className="border-neutral-200 border-t bg-white">
			<div className="mx-auto w-full max-w-[1080px] px-6 py-16">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr]">
					<Link
						aria-label="Edgecoms home"
						className="flex h-fit items-center gap-2.5"
						href={"/" as Route}
					>
						<Logo className="h-7 w-auto" />
						<span className="font-semibold text-[22px] text-neutral-900 tracking-tight">
							Edgecoms
						</span>
					</Link>

					<div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
						{COLUMNS.map((column) => (
							<div className="flex flex-col gap-4" key={column.heading}>
								<h2 className="font-medium text-[14px] text-neutral-900">
									{column.heading}
								</h2>
								<ul className="flex flex-col gap-3">
									{column.links.map((link) => (
										<li key={link.label}>
											{link.external ? (
												<a className={LINK_CLASS} href={link.href}>
													{link.label}
												</a>
											) : (
												<Link className={LINK_CLASS} href={link.href as Route}>
													{link.icon ? (
														<Image
															alt=""
															className="size-4 rounded-[4px]"
															height={64}
															src={link.icon}
															width={64}
														/>
													) : null}
													{link.label}
												</Link>
											)}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<BlogBand />

				<div className="mt-16 flex flex-col gap-3 border-neutral-200 border-t pt-8 text-[13px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
					<span>Built for Shopify · Billed on your Shopify invoice</span>
					<span>© 2026 Edgecoms</span>
				</div>
			</div>
		</footer>
	);
}
