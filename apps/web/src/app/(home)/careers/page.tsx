import {
	ArrowRight,
	BookOpen,
	Calendar,
	DollarSign,
	Dumbbell,
	Flag,
	Globe as GlobeIcon,
	Heart,
	Monitor,
	Palmtree,
	Plane,
} from "lucide-react";
import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";

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
				Being an open-source company, we uphold trust and transparency in
				every process. We also{" "}
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

const BENEFITS = [
	{
		icon: GlobeIcon,
		title: "Fully remote",
		description:
			"Work from anywhere in the world, your office is wherever you are.",
	},
	{
		icon: DollarSign,
		title: "Competitive salary & equity",
		description:
			"We offer above-market compensation and stock options for all roles.",
	},
	{
		icon: Heart,
		title: "Health, dental, and vision insurance",
		description: "Global coverage because your health is our priority.",
	},
	{
		icon: Palmtree,
		title: "21 PTO days per year",
		description: "Take time off to unwind and refresh throughout the year.",
	},
	{
		icon: Calendar,
		title: "7 holidays per year",
		description:
			"7 U.S. holidays (or substitute for your local ones if you prefer).",
	},
	{
		icon: Monitor,
		title: "Home office stipend",
		description:
			"Generous equipment coverage to help you be productive at home.",
	},
	{
		icon: Plane,
		title: "Annual in-person retreat",
		description: "In-person retreats to recharge and reconnect with the team.",
	},
	{
		icon: BookOpen,
		title: "Annual learning & development",
		description: "Courses, books, and conferences to help your role.",
	},
	{
		icon: Dumbbell,
		title: "Monthly wellness stipend",
		description:
			"A $100 monthly wellness budget for your mental and physical health.",
	},
] as const;

export default function CareersPage() {
	return (
		<main>
			{/* SECTION 1: HERO WITH STACKED PHOTO COLLAGE */}
			<section className="relative w-full border-neutral-200 border-b bg-neutral-50/40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
				<Frame className="pt-16 pb-0 sm:pt-20">
					<div className="flex flex-col items-center text-center px-6 sm:px-8 pb-14 sm:pb-16">
						{/* Stacked Photo Collage */}
						<div className="relative flex h-52 sm:h-64 w-full max-w-2xl items-center justify-center mb-8 sm:mb-12">
							{HERO_PHOTOS.map((photo, idx) => (
								<div
									key={photo.alt}
									className={`absolute overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl transition-transform duration-300 hover:scale-105 hover:z-40 w-44 sm:w-56 aspect-4/3 ${photo.rotation} ${photo.zIndex}`}
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
							We are a global, fully remote team on a mission to maximize revenue
							per visitor for modern Shopify brands.
						</p>

						{/* View Open Roles CTA Button */}
						<div className="mt-6">
							<a
								href="#open-roles"
								className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 font-medium text-xs text-white shadow-xs transition-colors hover:bg-neutral-800 sm:text-sm"
							>
								View open roles
							</a>
						</div>
					</div>

					{/* About Team Link Banner flush at the bottom of the section */}
					<div className="flex flex-wrap items-center justify-center gap-3 border-neutral-200 border-t bg-white/80 px-6 py-3.5 backdrop-blur-xs text-center">
						<div className="flex -space-x-2 overflow-hidden">
							{TEAM_AVATARS.map((avatar, i) => (
								<div
									key={avatar}
									className="inline-block size-7 overflow-hidden rounded-full border-2 border-white shadow-2xs"
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
							href={"/about" as Route}
							className="inline-flex items-center gap-1.5 font-medium text-neutral-600 text-xs transition-colors hover:text-neutral-900 sm:text-sm"
						>
							<span>About Edgecoms and the team</span>
							<ArrowRight className="size-3.5" />
						</Link>
					</div>
				</Frame>
			</section>

			{/* SECTION 2: OUR VALUES */}
			<section className="relative w-full border-neutral-200 border-b bg-white overflow-hidden">
				<Frame>
					{/* Top Cloud Graphic Header */}
					<div className="relative flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center sm:px-8 sm:pt-20">
						{/* Cloud Glow Graphic */}
						<div className="relative flex w-full max-w-md h-28 items-center justify-center mb-2">
							<div
								aria-hidden="true"
								className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(56,189,248,0.22),transparent_75%)]"
							/>
							<div className="relative z-10 flex size-9 items-center justify-center rounded-full bg-white shadow-sm border border-neutral-200/80">
								<Flag className="size-4 text-neutral-800" />
							</div>
						</div>

						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Our values
						</h2>
					</div>

					{/* 2x2 Values Grid matching reference image */}
					<div className="grid grid-cols-1 border-neutral-200 border-t border-b divide-y divide-neutral-200 bg-white sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
						{COMPANY_VALUES.map((val, idx) => (
							<div
								key={val.number}
								className={`flex flex-col p-8 sm:p-10 text-left transition-colors hover:bg-neutral-50/50 ${
									idx >= 2 ? "sm:border-t border-neutral-200" : ""
								}`}
							>
								<span className="font-mono font-semibold text-xs text-orange-600 sm:text-sm">
									{val.number}
								</span>
								<h3 className="mt-3 font-semibold text-neutral-900 text-lg sm:text-xl">
									{val.title}
								</h3>
								<p className="mt-3 text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-md">
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
					<div className="flex flex-col items-center px-6 text-center sm:px-8 mb-12 sm:mb-16">
						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Benefits and wellness
						</h2>
						<p className="mt-2.5 max-w-md text-neutral-500 text-xs sm:text-sm leading-relaxed">
							We're committed to giving you the resources to do your best work,
							even when you're not working.
						</p>
					</div>

					{/* 3x3 Grid matching Image 3 */}
					<div className="grid grid-cols-1 border-neutral-200 border-t border-b divide-y divide-neutral-200 bg-white sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
						{BENEFITS.map((b, idx) => {
							const Icon = b.icon;
							return (
								<div
									key={b.title}
									className={`flex flex-col p-8 sm:p-9 text-left transition-colors hover:bg-neutral-50/50 ${
										idx >= 3 ? "sm:border-t border-neutral-200" : ""
									}`}
								>
									<Icon className="size-5 text-neutral-800" />
									<h3 className="mt-4 font-semibold text-neutral-900 text-sm sm:text-base">
										{b.title}
									</h3>
									<p className="mt-1.5 text-neutral-500 text-xs sm:text-sm leading-relaxed">
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
				id="open-roles"
				className="relative w-full border-neutral-200 border-b bg-white"
			>
				<Frame className="py-16 sm:py-20">
					{/* Header */}
					<div className="flex flex-col items-center px-6 text-center sm:px-8 mb-10">
						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Open roles
						</h2>
					</div>

					{/* Empty State matching user requirement: "currently there is no open roles" */}
					<div className="mx-auto max-w-xl rounded-2xl border border-neutral-200/90 bg-neutral-50/60 p-8 sm:p-12 text-center backdrop-blur-xs">
						<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200/80 mb-4">
							<GlobeIcon className="size-5 text-neutral-500" />
						</div>
						<h3 className="font-semibold text-neutral-900 text-base sm:text-lg">
							No open roles at the moment
						</h3>
						<p className="mt-2 text-neutral-500 text-xs sm:text-sm leading-relaxed">
							We don't have any active job openings right now, but we're always
							interested in connecting with brilliant engineers, designers, and growth leaders.
						</p>
						<div className="mt-6">
							<a
								href="mailto:careers@edgecoms.com"
								className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 font-medium text-xs text-white shadow-xs transition-colors hover:bg-neutral-800 sm:text-sm"
							>
								Send us an email
							</a>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 5: CLOSING CTA */}
			<CtaDark />
		</main>
	);
}
