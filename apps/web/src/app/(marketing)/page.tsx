import { HeroHome } from "@/components/home/hero-home";

export default function HomePage() {
	return (
		<main className="flex flex-col">
			<section className="container mx-auto px-6 sm:max-w-7xl">
				<HeroHome />
			</section>
		</main>
	);
}
