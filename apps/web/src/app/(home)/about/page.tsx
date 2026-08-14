import { Globe } from "@edgecoms/ui/components/globe";
import {
	Flag,
	Heart,
	Play,
	ShoppingBag,
	TrendingUp,
	Users,
} from "lucide-react";
import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { LogoCloud } from "@/components/landing/logo-cloud";

export const metadata: Metadata = {
	title:
		"About Edgecoms · Turning Store Traffic Into Maximum Revenue Per Visitor",
	description:
		"We're a dedicated, fully-remote global team building the ultimate 7-app Shopify suite. We help DTC brands lift average order value, boost conversion rates, and prove revenue moves with server-side attribution.",
	alternates: { canonical: "/about" },
	openGraph: { type: "website", url: "/about" },
};

interface TeamMember {
	avatar: string;
	github?: string;
	linkedin?: string;
	name: string;
	role: string;
	twitter?: string;
}

function XIcon() {
	return (
		<svg
			aria-hidden="true"
			className="size-4 text-neutral-600 transition-colors hover:text-neutral-900"
			fill="currentColor"
			viewBox="0 0 24 24"
		>
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

function GithubIcon() {
	return (
		<svg
			aria-hidden="true"
			className="size-4 text-neutral-600 transition-colors hover:text-neutral-900"
			fill="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				clipRule="evenodd"
				d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
				fillRule="evenodd"
			/>
		</svg>
	);
}

function LinkedinIcon() {
	return (
		<svg
			aria-hidden="true"
			className="size-4 text-neutral-600 transition-colors hover:text-neutral-900"
			fill="currentColor"
			viewBox="0 0 24 24"
		>
			<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.6 1.6 0 1 0 1.6 1.6 1.6 1.6 0 0 0-1.6-1.6z" />
		</svg>
	);
}

const TEAM_MEMBERS: readonly TeamMember[] = [
	{
		avatar:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
		github: "https://github.com",
		name: "Anurag Chandra",
		role: "Founder, CEO",
		twitter: "https://x.com",
	},
	{
		avatar:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
		github: "https://github.com",
		name: "Rajdeep Das",
		role: "CTO, Software Engineer",
		twitter: "https://x.com",
	},
	{
		avatar:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
		github: "https://github.com",
		name: "Avinash Shaw",
		role: "COO, Websites & Creatives",
		twitter: "https://x.com",
	},
	{
		avatar:
			"https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
		linkedin: "https://linkedin.com",
		name: "Medha Raj Jyotishi",
		role: "CRO, Social Media & Performance Marketing",
		twitter: "https://x.com",
	},
] as const;

const LIFE_PHOTOS = [
	{
		alt: "Team Beach Gathering",
		rotation: "-rotate-3",
		src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
	},
	{
		alt: "Jungle Hike Adventure",
		rotation: "rotate-2",
		src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600",
	},
	{
		alt: "Co-working Session",
		rotation: "-rotate-2",
		src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600",
	},
	{
		alt: "Kayaking Adventure",
		rotation: "rotate-3",
		src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600",
	},
	{
		alt: "Sunset Beach Retreat",
		rotation: "-rotate-1",
		src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
	},
	{
		alt: "Lounge Evening Session",
		rotation: "rotate-2",
		src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
	},
] as const;

const COMPANY_VALUES = [
	{
		number: "01",
		title: "Customers First",
		body: (
			<>
				Our{" "}
				<span className="underline decoration-neutral-400 decoration-dotted underline-offset-4">
					customers
				</span>{" "}
				are the heart of our business. We succeed when they succeed, and we are
				committed to delivering products that not only meet but exceed their
				expectations.
			</>
		),
	},
	{
		number: "02",
		title: "Security by Design",
		body: (
			<>
				Being an open-source company, we uphold trust and transparency in every
				process. We also{" "}
				<span className="underline decoration-neutral-400 decoration-dotted underline-offset-4">
					regularly audit
				</span>{" "}
				our codebase and infrastructure to ensure it's secure.
			</>
		),
	},
	{
		number: "03",
		title: "Act as an Owner",
		body: (
			<>
				We empower our team to own projects without the need for redundant
				meetings or standups. We trust our team to make decisions and take
				ownership of their work.
			</>
		),
	},
	{
		number: "04",
		title: "Don't Stop Shipping",
		body: (
			<>
				Complacency is the root of all evil. As a company, you're either growing
				or you're dying. We{" "}
				<span className="underline decoration-neutral-400 decoration-dotted underline-offset-4">
					ship fast
				</span>{" "}
				and{" "}
				<span className="underline decoration-neutral-400 decoration-dotted underline-offset-4">
					iterate faster
				</span>{" "}
				– all without compromising on quality.
			</>
		),
	},
] as const;

export default function AboutPage() {
	return (
		<main>
			{/* SECTION 1: HERO SECTION */}
			<section className="relative w-full border-neutral-200 border-b bg-white">
				<Frame className="py-20 sm:py-24">
					<div className="flex flex-col items-center justify-center px-6 text-center sm:px-8">
						{/* Headline with Inline Pill Badges */}
						<h1 className="max-w-3xl font-bold font-satoshi text-3xl text-neutral-900 leading-[1.25] tracking-tight sm:text-4xl lg:text-[44px]">
							A dedicated{" "}
							<span className="inline-flex items-center justify-center rounded-full bg-purple-100 px-2.5 py-0.5 align-middle text-purple-700">
								<Users className="size-4 text-purple-600" />
							</span>{" "}
							team committed to powering your growth with the{" "}
							<span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 align-middle text-emerald-700">
								<ShoppingBag className="size-4 text-emerald-600" />
							</span>{" "}
							ultimate Shopify{" "}
							<span className="inline-flex items-center justify-center rounded-full bg-orange-100 px-2.5 py-0.5 align-middle text-orange-700">
								<TrendingUp className="size-4 text-orange-600" />
							</span>{" "}
							revenue suite.
						</h1>

						{/* Subtitle */}
						<p className="mt-4 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							We're building the all-in-one app suite to lift average order
							value, boost conversion rates, and deliver accurate server-side
							attribution for modern Shopify brands.
						</p>

						{/* CTA Button */}
						<div className="mt-6">
							<Link
								className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2 font-medium text-white text-xs shadow-xs transition-colors hover:bg-neutral-800 sm:text-sm"
								href={"/#careers" as Route}
							>
								View careers
							</Link>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 2: LOGO CLOUD BAR */}
			<LogoCloud />

			{/* SECTION 3: WHAT IS EDGECOMS & VIDEO CARD */}
			<section className="relative w-full border-neutral-200 border-b bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-neutral-50/40 [background-size:16px_16px]">
				<Frame className="py-16 sm:py-20">
					<div className="flex flex-col items-center px-6 text-center sm:px-8">
						{/* Title */}
						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 leading-tight tracking-tight sm:text-4xl">
							What is Edgecoms?
						</h2>

						{/* Subtitle */}
						<p className="mt-4 max-w-xl text-neutral-600 text-xs leading-relaxed sm:text-sm">
							Edgecoms is a high-performance suite of 7 specialized Shopify
							apps. We power{" "}
							<span className="underline decoration-neutral-400 decoration-dotted underline-offset-4">
								volume bundles
							</span>
							,{" "}
							<span className="underline decoration-neutral-400 decoration-dotted underline-offset-4">
								slide cart upsells
							</span>
							,{" "}
							<span className="underline decoration-neutral-400 decoration-dotted underline-offset-4">
								auto-refills
							</span>
							, and{" "}
							<span className="underline decoration-neutral-400 decoration-dotted underline-offset-4">
								server-side attribution
							</span>{" "}
							for 1,000+ Shopify merchants globally.
						</p>

						{/* Video Banner Card */}
						<div className="group relative mt-10 aspect-video w-full max-w-2xl cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 shadow-xl">
							<Image
								alt="Get to know Edgecoms"
								className="size-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
								height={720}
								src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
								width={1280}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

							{/* Bottom Left Info Pill */}
							<div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg bg-black/70 px-3 py-1.5 backdrop-blur-md">
								<span className="font-semibold text-white text-xs">
									Get to know Edgecoms with Founder Anurag Chandra
								</span>
							</div>

							{/* Bottom Right Play Icon */}
							<div className="absolute right-4 bottom-4 z-10 flex size-10 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg transition-transform duration-300 group-hover:scale-110">
								<Play className="ml-0.5 size-4 fill-neutral-900" />
							</div>
						</div>

						{/* Mission Statement */}
						<div className="mt-16 max-w-xl text-center">
							<h3 className="font-satoshi font-semibold text-2xl text-neutral-900 tracking-tight sm:text-3xl">
								We're on a mission to maximize revenue per visitor for every
								Shopify store.
							</h3>
							<p className="mt-4 text-neutral-500 text-xs leading-relaxed sm:text-sm">
								Revenue per visitor is conversion rate times average order
								value. Most Shopify apps bloat your theme code and slow down
								your store while focusing on only a single touchpoint.
							</p>
							<p className="mt-3 text-neutral-500 text-xs leading-relaxed sm:text-sm">
								We're building Edgecoms with zero Liquid theme bloat and
								sub-50ms edge latency – giving merchants a seamless suite where
								six apps directly lift revenue per visitor, and{" "}
								<span className="underline decoration-neutral-400 decoration-dotted underline-offset-4">
									Trackproof
								</span>{" "}
								proves the exact move server-side.
							</p>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 4: OUR PEOPLE & TEAM GRID */}
			<section className="relative w-full border-neutral-200 border-b bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-neutral-50/40 [background-size:16px_16px]">
				<Frame className="pt-16 pb-16 sm:pt-20 sm:pb-20">
					{/* 3D WebGL Globe Visual matching Partners Page */}
					<div className="relative mx-auto mb-4 flex h-[240px] w-full max-w-2xl items-center justify-center overflow-hidden sm:h-[270px]">
						{/* 3D Globe Canvas with Bottom Gradient Fade Mask */}
						<div
							className="pointer-events-auto absolute top-0 flex size-[500px] cursor-grab items-center justify-center opacity-95 active:cursor-grabbing sm:size-[580px]"
							style={{
								maskImage:
									"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0) 45%)",
								WebkitMaskImage:
									"linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0) 45%)",
							}}
						>
							<Globe
								className="size-full"
								config={{
									baseColor: [0.98, 0.98, 0.99],
									dark: 0,
									devicePixelRatio: 2,
									diffuse: 0.6,
									glowColor: [0.96, 0.94, 1],
									height: 1150,
									mapBrightness: 1.5,
									mapSamples: 24_000,
									markerColor: [147 / 255, 51 / 255, 234 / 255],
									markers: [
										{ location: [52.3676, 4.9041], size: 0.08 },
										{ location: [-26.2041, 28.0473], size: 0.08 },
										{ location: [31.0461, 34.8516], size: 0.08 },
										{ location: [40.7128, -74.006], size: 0.08 },
										{ location: [51.5074, -0.1278], size: 0.08 },
										{ location: [35.6762, 139.6503], size: 0.08 },
									],
									phi: 0.4,
									theta: 0.2,
									width: 1150,
								}}
							/>
						</div>
					</div>

					{/* Header Content */}
					<div className="flex flex-col items-center px-6 text-center sm:px-8">
						{/* Eyebrow */}
						<p className="flex items-center gap-1.5 font-medium text-neutral-500 text-xs">
							<Users className="size-3.5" />
							<span>Our People</span>
						</p>

						{/* Headline */}
						<h2 className="mt-2 font-satoshi font-semibold text-2xl text-neutral-900 tracking-tight sm:text-3xl">
							We care deeply about the human link
						</h2>

						{/* Subtitle */}
						<p className="mt-2 max-w-lg text-neutral-500 text-xs leading-relaxed sm:text-sm">
							Edgecoms is a fully-remote, small but mighty global team united by
							speed, action, and a shared passion for reshaping marketing
							attribution.
						</p>
					</div>

					{/* Team Grid matching Image 1 with aligned baselines */}
					<div className="mt-12 grid grid-cols-1 divide-y divide-neutral-200/80 border-neutral-200 border-t border-b bg-white/70 backdrop-blur-xs sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
						{TEAM_MEMBERS.map((member) => (
							<div
								className="flex h-full flex-col items-center justify-between p-6 text-center transition-colors hover:bg-neutral-50/70"
								key={member.name}
							>
								<div className="flex w-full flex-col items-center">
									<div className="relative size-16 overflow-hidden rounded-full border border-neutral-200 shadow-2xs">
										<Image
											alt={member.name}
											className="size-full object-cover"
											height={64}
											src={member.avatar}
											width={64}
										/>
									</div>
									<p className="mt-3 font-semibold text-neutral-900 text-sm">
										{member.name}
									</p>
									<div className="mt-1 flex min-h-[2.5rem] items-center justify-center">
										<p className="max-w-[190px] font-medium text-neutral-500 text-xs leading-snug">
											{member.role}
										</p>
									</div>
								</div>

								{/* Social Media Pill Card aligned across all cards */}
								<div className="mt-5 flex items-center justify-center gap-3 rounded-xl border border-neutral-200/90 bg-white px-3.5 py-1.5 shadow-2xs">
									{member.twitter && (
										<a
											aria-label={`${member.name} on X`}
											className="flex items-center justify-center"
											href={member.twitter}
											rel="noopener noreferrer"
											target="_blank"
										>
											<XIcon />
										</a>
									)}
									{member.github && (
										<a
											aria-label={`${member.name} on GitHub`}
											className="flex items-center justify-center"
											href={member.github}
											rel="noopener noreferrer"
											target="_blank"
										>
											<GithubIcon />
										</a>
									)}
									{member.linkedin && (
										<a
											aria-label={`${member.name} on LinkedIn`}
											className="flex items-center justify-center"
											href={member.linkedin}
											rel="noopener noreferrer"
											target="_blank"
										>
											<LinkedinIcon />
										</a>
									)}
								</div>
							</div>
						))}
					</div>
				</Frame>
			</section>

			{/* SECTION 5: LIFE AT EDGECOMS PHOTO MOSAIC */}
			<section className="relative w-full border-neutral-200 border-b bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-neutral-50/40 [background-size:16px_16px]">
				<Frame className="py-16 sm:py-20">
					<div className="flex flex-col items-center px-6 text-center sm:px-8">
						{/* Eyebrow */}
						<p className="flex items-center gap-1 font-medium text-neutral-500 text-xs">
							<Heart className="size-3.5 text-rose-500" />
							<span>Staying Connected</span>
						</p>

						{/* Headline */}
						<h2 className="mt-2 font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Life at Edgecoms
						</h2>

						{/* Subtitle */}
						<p className="mt-2 max-w-xl text-neutral-500 text-xs leading-relaxed sm:text-sm">
							We're builders from all corners of the world who care deeply about
							our work, but we also know when to step back and enjoy life. Some
							of our best ideas come when we're not staring at screens.
						</p>

						{/* Photo Mosaic Grid matching Image 5 */}
						<div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
							{LIFE_PHOTOS.map((photo) => (
								<div
									className={`relative overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg transition-transform duration-300 hover:rotate-0 hover:scale-105 ${photo.rotation}`}
									key={photo.alt}
								>
									<div className="aspect-4/3 w-full overflow-hidden">
										<Image
											alt={photo.alt}
											className="size-full object-cover"
											height={400}
											src={photo.src}
											width={500}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 6: OUR VALUES */}
			<section className="relative w-full overflow-hidden border-neutral-200 border-b bg-white">
				<Frame>
					{/* Top Cloud Graphic Header */}
					<div className="relative flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center sm:px-8 sm:pt-20">
						{/* Cloud Glow Graphic */}
						<div className="relative mb-2 flex h-28 w-full max-w-md items-center justify-center">
							<div
								aria-hidden="true"
								className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(56,189,248,0.22),transparent_75%)]"
							/>
							<div className="relative z-10 flex size-9 items-center justify-center rounded-full border border-neutral-200/80 bg-white shadow-sm">
								<Flag className="size-4 text-neutral-800" />
							</div>
						</div>

						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Our values
						</h2>
					</div>

					{/* 2x2 Values Grid matching reference image */}
					<div className="grid grid-cols-1 divide-y divide-neutral-200 border-neutral-200 border-t border-b bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0">
						{COMPANY_VALUES.map((val, idx) => (
							<div
								className={`flex flex-col p-8 text-left transition-colors hover:bg-neutral-50/50 sm:p-10 ${
									idx >= 2 ? "border-neutral-200 sm:border-t" : ""
								}`}
								key={val.number}
							>
								<span className="font-mono font-semibold text-orange-600 text-xs sm:text-sm">
									{val.number}
								</span>
								<h3 className="mt-3 font-semibold text-lg text-neutral-900 sm:text-xl">
									{val.title}
								</h3>
								<p className="mt-3 max-w-md text-neutral-500 text-xs leading-relaxed sm:text-sm">
									{val.body}
								</p>
							</div>
						))}
					</div>
				</Frame>
			</section>

			{/* SECTION 7: CLOSING CTA */}
			<CtaDark />
		</main>
	);
}
