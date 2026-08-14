import { ChevronLeft } from "lucide-react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/careers/application-form";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { CAREER_BENEFITS, getRole, ROLES, WHY_EDGECOMS } from "@/lib/careers";
import {
	breadcrumbSchema,
	jobPostingSchema,
	jsonLdScriptProps,
} from "@/lib/seo";

/**
 * One role, one page.
 *
 * Every section below the header is optional in the data and simply does not
 * render when a role has nothing for it, so a role can go live on the two lists
 * that always exist (what you will do, who fits) and grow the rest later.
 */

interface RolePageProps {
	params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
	return ROLES.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({
	params,
}: RolePageProps): Promise<Metadata> {
	const { slug } = await params;
	const role = getRole(slug);

	if (!role) {
		return { title: "Role not found · Edgecoms" };
	}

	const title = `${role.title} · Careers at Edgecoms`;

	return {
		title,
		description: role.description,
		alternates: { canonical: `/careers/${role.slug}` },
		openGraph: {
			title,
			description: role.description,
			type: "article",
			url: `/careers/${role.slug}`,
		},
	};
}

function SectionHeading({ children }: { children: string }) {
	return (
		<h2 className="font-bold font-satoshi text-2xl text-neutral-900 tracking-tight sm:text-3xl">
			{children}
		</h2>
	);
}

function BulletList({ items }: { items: readonly string[] }) {
	return (
		<ul className="mt-5 flex flex-col gap-3">
			{items.map((item) => (
				<li
					className="flex gap-3 text-neutral-600 text-sm leading-relaxed"
					key={item}
				>
					<span
						aria-hidden="true"
						className="mt-2 size-1.5 shrink-0 rounded-full bg-neutral-300"
					/>
					<span>{item}</span>
				</li>
			))}
		</ul>
	);
}

export default async function RolePage({ params }: RolePageProps) {
	const { slug } = await params;
	const role = getRole(slug);

	if (!role) {
		notFound();
	}

	return (
		<main>
			{/* Google Jobs reads this. Everything in it is also stated visibly on the
			    page below, which is the condition for the markup being legitimate. */}
			<script {...jsonLdScriptProps(jobPostingSchema(role))} />
			<script
				{...jsonLdScriptProps(
					breadcrumbSchema([
						{ name: "Home", path: "/" },
						{ name: "Careers", path: "/careers" },
						{ name: role.title, path: `/careers/${role.slug}` },
					])
				)}
			/>

			<section className="relative w-full border-neutral-200 border-b bg-white">
				<Frame className="px-6 py-12 sm:px-8 sm:py-16">
					<Link
						className="inline-flex items-center gap-1 font-medium text-neutral-500 text-sm transition-colors hover:text-neutral-900"
						href={"/careers" as Route}
					>
						<ChevronLeft className="size-4" />
						Browse all careers
					</Link>

					<div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
						{/* Sticky role header */}
						<aside className="lg:sticky lg:top-24 lg:self-start">
							<h1 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
								{role.title}
							</h1>
							<p className="mt-4 text-neutral-500 text-sm">
								{role.location}
								<span className="mx-2 text-neutral-300">|</span>
								{role.employmentType}
							</p>
							<a
								className="mt-6 flex w-full items-center justify-center rounded-lg bg-black px-5 py-3 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800 lg:max-w-xs"
								href="#apply"
							>
								Apply
							</a>
							<p className="mt-3 text-neutral-400 text-xs">
								{role.team} team · Applications reviewed weekly
							</p>
						</aside>

						{/* Role content */}
						<div className="flex max-w-2xl flex-col gap-12">
							<section>
								<SectionHeading>Why Edgecoms?</SectionHeading>
								<p className="mt-4 text-neutral-600 text-sm leading-relaxed">
									We build a suite of Shopify apps that move one number for
									merchants: revenue per visitor. Joining Edgecoms means
									shipping work that reaches real stores in days rather than
									quarters.
								</p>
								<ul className="mt-5 flex flex-col gap-3">
									{WHY_EDGECOMS.map((reason) => (
										<li
											className="flex gap-3 text-neutral-600 text-sm leading-relaxed"
											key={reason.title}
										>
											<span
												aria-hidden="true"
												className="mt-2 size-1.5 shrink-0 rounded-full bg-neutral-300"
											/>
											<span>
												<strong className="font-semibold text-neutral-900">
													{reason.title}:
												</strong>{" "}
												{reason.body}
											</span>
										</li>
									))}
								</ul>
							</section>

							<section>
								<SectionHeading>In this role you will...</SectionHeading>
								<BulletList items={role.responsibilities} />
							</section>

							<section>
								<SectionHeading>
									You will be a perfect fit if you...
								</SectionHeading>
								<BulletList items={role.requirements} />
							</section>

							{role.bonus && role.bonus.length > 0 ? (
								<section>
									<SectionHeading>
										You will be an exceptional fit if you also...
									</SectionHeading>
									<BulletList items={role.bonus} />
								</section>
							) : null}

							<section>
								<SectionHeading>Our benefits</SectionHeading>
								<BulletList
									items={CAREER_BENEFITS.map((benefit) => benefit.title)}
								/>
							</section>

							{role.notes && role.notes.length > 0 ? (
								<section>
									<SectionHeading>Additional notes</SectionHeading>
									<div className="mt-5 flex flex-col gap-3">
										{role.notes.map((note) => (
											<p
												className="text-neutral-600 text-sm leading-relaxed"
												key={note}
											>
												{note}
											</p>
										))}
									</div>
									{role.compensation ? (
										<p className="mt-3 text-neutral-600 text-sm leading-relaxed">
											{role.compensation}
										</p>
									) : null}
								</section>
							) : null}

							<section id="apply">
								<SectionHeading>Application</SectionHeading>
								<p className="mt-4 mb-6 text-neutral-500 text-sm leading-relaxed">
									Fill this in and we will get back to you within a week.
								</p>
								<ApplicationForm
									portfolioLabel={role.portfolioLabel}
									roleTitle={role.title}
								/>
							</section>
						</div>
					</div>
				</Frame>
			</section>

			<CtaDark />
		</main>
	);
}
