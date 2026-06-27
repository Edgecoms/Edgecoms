import Image from "next/image";
import { Reveal } from "@/components/home/reveal";

const thoughts = [
	["We solve problems", "before adding features."],
	["Details aren't decoration.", "They're the product."],
	["We ship deliberately,", "then improve relentlessly."],
	["Quality compounds", "over time."],
] as const;

export function ManifestoHome() {
	return (
		<section className="relative w-full overflow-hidden">
			<div className="mx-auto w-full max-w-7xl px-6 py-28 lg:py-40">
				<div className="grid items-center gap-y-16 pt-16 lg:grid-cols-12 lg:gap-x-16 lg:pt-24">
					{/* manifesto */}
					<div className="flex flex-col lg:col-span-6 lg:pr-6">
						<Reveal delay={60}>
							<h2 className="text-balance font-medium text-h2 text-primary-foreground lg:text-h1">
								Built with intention.
							</h2>
						</Reveal>

						<div className="mt-10 flex flex-col gap-10 lg:mt-12 lg:gap-6">
							{thoughts.map(([first, second], index) => (
								<Reveal delay={160 + index * 90} key={first}>
									<p className="text-pretty font-mono font-normal text-body-lg text-primary-foreground tracking-tight">
										{first} {second}
									</p>
								</Reveal>
							))}
						</div>

						<Reveal delay={540}>
							<p className="mt-12 max-w-sm text-pretty text-body-sm text-secondary-foreground leading-relaxed lg:mt-16">
								Because the best products quietly disappear into the workflow.
							</p>
						</Reveal>
					</div>

					{/* illustration */}
					<div className="lg:col-span-6">
						<Reveal delay={160}>
							<figure className="group relative mx-auto w-full max-w-xl transition-transform duration-700 ease-out hover:translate-y-[-3px] motion-reduce:transition-none lg:mr-0 lg:ml-auto">
								<div className="overflow-hidden rounded-2xl bg-white ring-1 ring-border/70">
									<Image
										alt="Isometric diagram of how we build: transparency, speed, craft, reliability, and outcomes"
										className="h-auto w-full object-contain"
										height={1086}
										sizes="(min-width: 1024px) 36rem, 90vw"
										src="/how-we-build.png"
										width={1448}
									/>
								</div>
							</figure>
						</Reveal>
					</div>
				</div>
			</div>
		</section>
	);
}
