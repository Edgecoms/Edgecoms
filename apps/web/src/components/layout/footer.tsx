import type { Route } from "next";
import Link from "next/link";
import { GridMarkers } from "@/components/home/grid-markers";
import Logo from "@/components/ui/logo";
import { EDGE_PRODUCTS } from "@/lib/products";

interface FooterLink {
	external?: boolean;
	href: string;
	label: string;
}

interface FooterColumn {
	heading: string;
	links: readonly FooterLink[];
}

/* The six apps get the index band above rather than a column here, so this
   list stays short and nothing is named twice. Every href resolves to a route
   that exists today. */
const COLUMNS: readonly FooterColumn[] = [
	{
		heading: "Partners",
		links: [
			{ href: "/partners", label: "Partner program" },
			{ href: "/register", label: "Apply to the program" },
			{ href: "/login", label: "Partner login" },
		],
	},
	{
		heading: "Company",
		links: [
			{ href: "/about", label: "About Edge" },
			{ href: "/contact", label: "Contact" },
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
	"text-body-sm text-secondary-foreground transition-colors hover:text-primary-foreground";

export default function Footer() {
	return (
		<footer className="w-full">
			<div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-10">
				{/* Suite index. The six apps as a legend across the foot of the page,
				    in the same hairline grid and corner markers the sections above
				    use — so the page closes in the language it opened in. "Edge" is
				    dropped from each name because the whole strip is Edge. */}
				<div className="relative">
					<div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
						{EDGE_PRODUCTS.map((product) => (
							<Link
								className="flex flex-col gap-2.5 bg-bg px-4 py-5 transition-colors hover:bg-page"
								href={`/products#${product.slug}` as Route}
								key={product.slug}
							>
								<span
									aria-hidden="true"
									className="size-1.5 rounded-full bg-brand"
								/>
								<span className="font-medium font-mono text-label text-primary-foreground uppercase tracking-[0.08em]">
									{product.name.replace("Edge ", "")}
								</span>
								<span className="text-caption text-secondary-foreground">
									{product.category}
								</span>
							</Link>
						))}
					</div>

					<GridMarkers cols={6} rows={1} />
				</div>

				<div className="mt-16 grid grid-cols-2 gap-y-10 lg:grid-cols-3 lg:gap-y-0 lg:divide-x lg:divide-border">
					{COLUMNS.map((column) => (
						<div
							className="flex flex-col gap-5 lg:px-8 lg:first:pl-0"
							key={column.heading}
						>
							<h2 className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.14em]">
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
												{link.label}
											</Link>
										)}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-16 flex flex-col gap-4 border-border border-t pt-8 text-caption text-secondary-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-2">
					<Link
						aria-label="Edgecoms — home"
						className="flex items-center gap-2 text-primary-foreground transition-opacity hover:opacity-70"
						href={"/" as Route}
					>
						<Logo height={16} width="auto" />
						<span className="font-medium text-body-sm">Edgecoms</span>
					</Link>
					<span>© 2026 Edgecoms</span>
				</div>
			</div>
		</footer>
	);
}
