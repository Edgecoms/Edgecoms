import type { Route } from "next";
import Link from "next/link";
import Logo from "../ui/logo";

const navLinks = [
	{ label: "Products", href: "/products" },
	{ label: "Partner Program", href: "/partners" },
	{ label: "About", href: "/about" },
	{ label: "Contact", href: "/contact" },
] as const;

export default function Footer() {
	return (
		<footer className="w-full">
			<div className="mx-auto w-full max-w-7xl px-6 pt-20 pb-12">
				<div className="flex flex-col justify-between gap-10 border-border border-b pb-12 sm:flex-row">
					<div className="flex flex-col gap-4">
						<Logo height={18} width={18} />
						<p className="text-body-sm text-secondary-foreground">
							Built with intention.
						</p>
					</div>

					<nav className="flex flex-col gap-3 sm:items-end">
						{navLinks.map((link) => (
							<Link
								className="text-body-sm text-secondary-foreground transition-colors hover:text-primary-foreground"
								href={link.href as Route}
								key={link.label}
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>

				<div className="flex flex-col gap-2 pt-6 text-caption text-secondary-foreground sm:flex-row sm:justify-between">
					<span>Designed &amp; Built in India.</span>
					<span>© 2026 Edgecoms</span>
				</div>
			</div>
		</footer>
	);
}
