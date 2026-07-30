import type { Metadata } from "next";
import { HeroHome } from "@/components/home/hero-home";
import { LogoTicker } from "@/components/home/logo-ticker";

export const metadata: Metadata = {
	title: "Edge",
	description:
		"A growing suite of thoughtfully crafted Shopify apps that help merchants sell more, convert better, and grow with confidence.",
};

export default function HomePage() {
	return (
		<main className="flex flex-col">
			<HeroHome />
			<LogoTicker />
		</main>
	);
}
