import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Edge",
	description:
		"A growing suite of thoughtfully crafted Shopify apps that help merchants sell more, convert better, and grow with confidence.",
};

export default function HomePage() {
	return (
		<main className="flex min-h-[calc(100svh-var(--header-height))] flex-col">
			<section className="container mx-auto px-6 sm:max-w-7xl" />
		</main>
	);
}
