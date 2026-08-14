import { ArrowRight, Flag, Globe as GlobeIcon } from "lucide-react";
import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { CAREER_BENEFITS, rolesByTeam } from "@/lib/careers";

export const metadata: Metadata = {
	title: "Careers at Edgecoms · Join Our Fully-Remote Global Team",
	description:
		"We are a global, fully-remote team on a mission to maximize revenue per visitor for modern Shopify brands. View our culture, benefits, and open roles.",
};

const HERO_PHOTOS = [
	{
		alt: "Team retreat dinner",
		rotation: "-rotate-6 translate-y-2",
		src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
		zIndex: "z-10",
	},
	{
		alt: "Co-working outdoors",
		rotation: "-rotate-2 -translate-y-3",
		src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600",
		zIndex: "z-20",
	},
	{
		alt: "Kayaking adventure",
		rotation: "rotate-3 translate-y-1",
		src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600",
		zIndex: "z-30",
	},
	{
		alt: "Lounge strategy session",
		rotation: "rotate-6 translate-y-4",
		src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
		zIndex: "z-20",
	},
] as const;

const TEAM_AVATARS = [
	"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
	"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
	"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
	"https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
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

export default function CareersPage() {
	return (
		<main>
			{/* SECTION 1: HERO WITH STACKED PHOTO COLLAGE */}
			<section className="relative w-full border-neutral-200 border-b bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-neutral-50/40 [background-size:16px_16px]">
				<Frame className="pt-16 pb-0 sm:pt-20">
					<div className="flex flex-col items-center px-6 pb-14 text-center sm:px-8 sm:pb-16">
						{/* Stacked Photo Collage */}
						<div className="relative mb-8 flex h-52 w-full max-w-2xl items-center justify-center sm:mb-12 sm:h-64">
							{HERO_PHOTOS.map((photo, idx) => (
								<div
									className={`absolute aspect-4/3 w-44 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl transition-transform duration-300 hover:z-40 hover:scale-105 sm:w-56 ${photo.rotation} ${photo.zIndex}`}
									key={photo.alt}
									style={{
										left: `${15 + idx * 18}%`,
									}}
								>
									<Image
										alt={photo.alt}
										className="size-full object-cover"
										height={300}
										src={photo.src}
										width={400}
									/>
								</div>
							))}
						</div>

						{/* Hero Headline */}
						<h1 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl lg:text-[44px]">
							Careers at Edgecoms
						</h1>

						{/* Subhead */}
						<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							We are a global, fully remote team on a mission to maximize
							revenue per visitor for modern Shopify brands.
						</p>

						{/* View Open Roles CTA Button */}
						<div className="mt-6">
							<a
								className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 font-medium text-white text-xs shadow-xs transition-colors hover:bg-neutral-800 sm:text-sm"
								href="#open-roles"
							>
								View open roles
							</a>
						</div>
					</div>

					{/* About Team Link Banner flush at the bottom of the section */}
					<div className="flex flex-wrap items-center justify-center gap-3 border-neutral-200 border-t bg-white/80 px-6 py-3.5 text-center backdrop-blur-xs">
						<div className="flex -space-x-2 overflow-hidden">
							{TEAM_AVATARS.map((avatar, i) => (
								<div
									className="inline-block size-7 overflow-hidden rounded-full border-2 border-white shadow-2xs"
									key={avatar}
								>
									<Image
										alt={`Team member ${i + 1}`}
										className="size-full object-cover"
										height={28}
										src={avatar}
										width={28}
									/>
								</div>
							))}
						</div>
						<Link
							className="inline-flex items-center gap-1.5 font-medium text-neutral-600 text-xs transition-colors hover:text-neutral-900 sm:text-sm"
							href={"/about" as Route}
						>
							<span>About Edgecoms and the team</span>
							<ArrowRight className="size-3.5" />
						</Link>
					</div>
				</Frame>
			</section>

			{/* SECTION 2: OUR VALUES */}
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

			{/* SECTION 3: BENEFITS AND WELLNESS */}
			<section className="relative w-full border-neutral-200 border-b bg-white">
				<Frame className="py-16 sm:py-20">
					{/* Header */}
					<div className="mb-12 flex flex-col items-center px-6 text-center sm:mb-16 sm:px-8">
						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Benefits and wellness
						</h2>
						<p className="mt-2.5 max-w-md text-neutral-500 text-xs leading-relaxed sm:text-sm">
							We're committed to giving you the resources to do your best work,
							even when you're not working.
						</p>
					</div>

					{/* 3x3 Grid matching Image 3 */}
					<div className="grid grid-cols-1 divide-y divide-neutral-200 border-neutral-200 border-t border-b bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
						{CAREER_BENEFITS.map((b, idx) => {
							const Icon = b.icon;
							return (
								<div
									className={`flex flex-col p-8 text-left transition-colors hover:bg-neutral-50/50 sm:p-9 ${
										idx >= 3 ? "border-neutral-200 sm:border-t" : ""
									}`}
									key={b.title}
								>
									<Icon className="size-5 text-neutral-800" />
									<h3 className="mt-4 font-semibold text-neutral-900 text-sm sm:text-base">
										{b.title}
									</h3>
									<p className="mt-1.5 text-neutral-500 text-xs leading-relaxed sm:text-sm">
										{b.description}
									</p>
								</div>
							);
						})}
					</div>
				</Frame>
			</section>

			{/* SECTION 4: OPEN ROLES */}
			<section
				className="relative w-full border-neutral-200 border-b bg-white"
				id="open-roles"
			>
				<Frame className="py-16 sm:py-20">
					{/* Header */}
					<div className="mb-10 flex flex-col items-center px-6 text-center sm:px-8">
						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Open roles
						</h2>
						<p className="mt-2.5 max-w-md text-neutral-500 text-xs leading-relaxed sm:text-sm">
							Every role is fully remote. If you see a fit, send us a note and
							we'll get back to you within a week.
						</p>
					</div>

					{/* Roles grouped by team */}
					<div className="mx-auto max-w-3xl px-6 sm:px-8">
						{rolesByTeam().map((group) => (
							<div className="mb-10 last:mb-0" key={group.team}>
								<div className="flex items-center gap-3">
									<h3 className="font-mono font-semibold text-neutral-900 text-xs uppercase tracking-widest sm:text-sm">
										{group.team}
									</h3>
									<span className="h-px flex-1 bg-neutral-200" />
									<span className="text-neutral-400 text-xs">
										{group.roles.length}{" "}
										{group.roles.length === 1 ? "role" : "roles"}
									</span>
								</div>

								<ul className="mt-4 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white">
									{group.roles.map((role) => (
										<li key={role.slug}>
											<Link
												className="group flex flex-col gap-3 p-6 transition-colors hover:bg-neutral-50/70 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-7"
												href={`/careers/${role.slug}` as Route}
											>
												<div className="min-w-0">
													<h4 className="font-semibold text-base text-neutral-900 sm:text-lg">
														{role.title}
													</h4>
													<p className="mt-1.5 max-w-lg text-neutral-500 text-xs leading-relaxed sm:text-sm">
														{role.description}
													</p>
													<div className="mt-3 flex flex-wrap items-center gap-2">
														<span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-medium text-[11px] text-neutral-600">
															{role.location}
														</span>
														<span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-medium text-[11px] text-neutral-600">
															{role.employmentType}
														</span>
													</div>
												</div>

												<span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-neutral-900 text-xs transition-colors group-hover:text-orange-600 sm:text-sm">
													View role
													<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
												</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}

						{/* Open application fallback */}
						<div className="mt-12 rounded-2xl border border-neutral-200/90 bg-neutral-50/60 p-8 text-center backdrop-blur-xs">
							<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-neutral-200/80 bg-neutral-100">
								<GlobeIcon className="size-5 text-neutral-500" />
							</div>
							<h3 className="font-semibold text-base text-neutral-900 sm:text-lg">
								Don't see your role?
							</h3>
							<p className="mt-2 text-neutral-500 text-xs leading-relaxed sm:text-sm">
								We're always interested in connecting with brilliant engineers,
								designers, and growth leaders. Tell us what you'd build here.
							</p>
							<div className="mt-6">
								<a
									className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 font-medium text-white text-xs shadow-xs transition-colors hover:bg-neutral-800 sm:text-sm"
									href="mailto:careers@edgecoms.com"
								>
									Send us an email
								</a>
							</div>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 5: CLOSING CTA */}
			<CtaDark />
		</main>
	);
}
