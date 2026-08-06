import { ButtonLink } from "@edgecoms/ui/components/button";
import type { Route } from "next";
import { DIAGRAMS } from "@/components/home/products/diagrams";
import { AppIcon } from "@/components/ui/app-icon";
import { Highlight } from "@/components/ui/highlight";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";
import { APP_RESULT_BADGES } from "@/lib/marketing-stats";
import type { EdgeProduct } from "@/lib/products";

/**
 * Until an App Store URL exists on the product, the primary action goes to
 * /contact rather than to a button that promises an install and delivers a 404.
 * The label changes with it, so the promise always matches the destination.
 */
function primaryAction(product: EdgeProduct): { href: string; label: string } {
	if (product.appStoreUrl) {
		return { href: product.appStoreUrl, label: "Install free" };
	}
	return {
		href: "/contact",
		label: product.live ? "Get the install link" : "Get early access",
	};
}

export function AppHero({ product }: { product: EdgeProduct }) {
	const badge = APP_RESULT_BADGES[product.slug];
	const primary = primaryAction(product);

	return (
		<section className="relative isolate w-full overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a4)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black_20%,transparent_80%)]"
			/>

			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-24 pb-14 lg:grid-cols-2 lg:gap-16">
				<div className="flex flex-col items-start gap-5">
					<AppIcon product={product} size="lg" />
					<span className="font-medium text-body-sm text-brand">
						{product.eyebrow}
					</span>

					<div className="flex flex-wrap items-center gap-2">
						{badge ? (
							<span className="rounded-full bg-brand/12 px-2.5 py-1 font-medium font-mono text-[11px] text-brand uppercase tracking-[0.08em]">
								{badge.value}
							</span>
						) : null}
						{product.live ? (
							<span className="rounded-full border border-border px-2.5 py-1 font-medium font-mono text-[11px] text-secondary-foreground uppercase tracking-[0.08em]">
								Live on the App Store
							</span>
						) : null}
					</div>

					<h1 className="text-balance font-medium text-display text-primary-foreground sm:text-display-lg">
						<Highlight>{product.tagline}</Highlight>
					</h1>

					<p className="max-w-xl text-pretty text-body text-secondary-foreground leading-relaxed sm:text-body-lg">
						{product.heroLead}
					</p>

					<div className="flex w-full flex-col items-stretch gap-3 pt-1 sm:w-auto sm:flex-row sm:items-center">
						<ButtonLink
							className="h-11 rounded-full px-6 text-[15px]"
							href={primary.href as Route}
							size="xl"
							variant="brand"
						>
							{primary.label}
						</ButtonLink>
						<ButtonLink
							className="h-11 rounded-full px-6 text-[15px]"
							href={BOOKING_URL as Route}
							rel="noopener"
							size="xl"
							target="_blank"
							variant="secondary"
						>
							{BOOKING_LABEL}
						</ButtonLink>
					</div>

					<ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-caption text-secondary-foreground">
						{product.heroTrust.map((item, index) => (
							<li className="flex items-center gap-3" key={item}>
								{index > 0 ? (
									<span aria-hidden="true" className="text-[var(--gray-7)]">
										·
									</span>
								) : null}
								{item}
							</li>
						))}
					</ul>
				</div>

				<div className="relative isolate flex min-h-[380px] items-center justify-center overflow-hidden rounded-[2rem] border border-border bg-bg lg:min-h-[440px] dark:bg-transparent">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a4)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_80%)]"
					/>
					<div className="scale-110 sm:scale-125">{DIAGRAMS[product.slug]}</div>
				</div>
			</div>
		</section>
	);
}
