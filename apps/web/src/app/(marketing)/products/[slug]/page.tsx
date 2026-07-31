import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LogoTicker } from "@/components/home/logo-ticker";
import { FaqList } from "@/components/marketing/faq-list";
import { MarketingCta } from "@/components/marketing/marketing-cta";
import { AppHero } from "@/components/products/app-hero";
import {
	HowItWorks,
	TestimonialBlock,
	WorksWith,
} from "@/components/products/app-sections";
import { FeatureSections } from "@/components/products/feature-sections";
import { hasFreeTier, PricingTiers } from "@/components/products/pricing-tiers";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";
import { EDGE_PRODUCTS, getProduct } from "@/lib/products";

interface AppPageProps {
	params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
	return EDGE_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
	params,
}: AppPageProps): Promise<Metadata> {
	const { slug } = await params;
	const product = getProduct(slug);

	if (!product) {
		return { title: "Not found · Edge" };
	}

	return {
		title: `${product.name} · ${product.tagline}`,
		// `description` no longer renders on the page, so it does its work here.
		description: product.description,
	};
}

export default async function AppPage({ params }: AppPageProps) {
	const { slug } = await params;
	const product = getProduct(slug);

	if (!product) {
		notFound();
	}

	return (
		<main className="flex flex-col">
			<AppHero product={product} />
			<LogoTicker />

			<FeatureSections
				features={product.features}
				title={`What ${product.name} does, and the number each part moves`}
			/>

			<HowItWorks steps={product.how} title="Live in three steps" />

			{product.testimonial ? (
				<TestimonialBlock testimonial={product.testimonial} />
			) : null}

			<WorksWith items={product.worksWith} />
			<PricingTiers tiers={product.pricing} title={`${product.name} pricing`} />

			<FaqList items={product.faq} title={`${product.name}, answered`} />

			<MarketingCta
				body={
					hasFreeTier(product.pricing)
						? "Free plan, no contract, and nothing left in your theme if you change your mind. Or send us your store URL and we will set the first offer up for you."
						: "No contract, billed on the Shopify invoice you already get, and nothing left in your theme if you change your mind. Or send us your store URL and we will set it up for you."
				}
				heading={product.ctaHeading}
				primary={{ href: BOOKING_URL, label: BOOKING_LABEL }}
				secondary={{ href: "/products", label: "See the other apps" }}
			/>
		</main>
	);
}
