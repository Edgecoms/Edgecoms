import {
	ArrowRight,
	Calendar,
	Code2,
	Headphones,
	HelpCircle,
	Mail,
	ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";

export const metadata: Metadata = {
	title: "Contact Us · Edgecoms",
	description:
		"Get in touch with our team for sales, support, live demos, or general inquiries.",
	alternates: { canonical: "/contact" },
	openGraph: { type: "website", url: "/contact" },
};

const HELP_CARDS = [
	{
		icon: ShieldCheck,
		title: "Sales",
		description:
			"Speak with our sales team about a product demo, volume pricing, or custom integrations.",
		actionText: "Talk to sales",
		href: "mailto:sales@edgecoms.com",
	},
	{
		icon: Headphones,
		title: "Support",
		description:
			"Chat with us about product support, resolve billing questions, or provide feedback.",
		actionText: "Get support",
		href: "mailto:support@edgecoms.com",
	},
	{
		icon: HelpCircle,
		title: "Questions",
		description:
			"Read our help articles to find the answer to your question about Edgecoms apps.",
		actionText: "View Help Center",
		href: "https://docs.edgecoms.com",
	},
	{
		icon: Code2,
		title: "Developer Docs",
		description:
			"Read about Edgecoms platform development, GraphQL APIs, and webhook documentation.",
		actionText: "Read docs",
		href: "https://docs.edgecoms.com",
	},
] as const;

export default function ContactPage() {
	return (
		<main>
			{/* SECTION 1: HOW CAN WE HELP? (Matching Image 1 Design) */}
			<section className="relative w-full border-neutral-200 border-b bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-neutral-50/40 [background-size:16px_16px]">
				<Frame className="pt-16 pb-0 sm:pt-20">
					{/* Header */}
					<div className="flex flex-col items-center px-6 text-center sm:px-8">
						<h1 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl lg:text-[44px]">
							How can we help?
						</h1>
						<p className="mt-3 max-w-md text-neutral-500 text-sm leading-relaxed sm:text-base">
							Get in touch for sales and support, or dive into our product docs.
						</p>

						{/* System Status Pill Badge */}
						<div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-emerald-700 text-xs shadow-2xs backdrop-blur-xs">
							<span className="relative flex size-2">
								<span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
								<span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
							</span>
							<span className="font-medium">All systems operational</span>
						</div>
					</div>

					{/* 2x2 Help Cards Grid matching Image 1 (Flush at section bottom) */}
					<div className="mt-12 grid grid-cols-1 divide-y divide-neutral-200 border-neutral-200 border-t bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0">
						{HELP_CARDS.map((card, idx) => {
							const Icon = card.icon;
							return (
								<div
									className={`flex flex-col justify-between p-8 text-left transition-colors hover:bg-neutral-50/50 sm:p-10 ${
										idx >= 2 ? "border-neutral-200 sm:border-t" : ""
									}`}
									key={card.title}
								>
									<div>
										<div className="flex size-10 items-center justify-center rounded-lg border border-neutral-200/80 bg-neutral-50 shadow-2xs">
											<Icon className="size-5 text-neutral-800" />
										</div>
										<h3 className="mt-4 font-semibold text-lg text-neutral-900 sm:text-xl">
											{card.title}
										</h3>
										<p className="mt-2 max-w-sm text-neutral-500 text-xs leading-relaxed sm:text-sm">
											{card.description}
										</p>
									</div>

									<div className="mt-6">
										<a
											className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 font-medium text-white text-xs shadow-xs transition-colors hover:bg-neutral-800 sm:text-sm"
											href={card.href}
											rel={
												card.href.startsWith("http")
													? "noopener noreferrer"
													: undefined
											}
											target={
												card.href.startsWith("http") ? "_blank" : undefined
											}
										>
											{card.actionText}
										</a>
									</div>
								</div>
							);
						})}
					</div>
				</Frame>
			</section>

			{/* SECTION 2: GET IN TOUCH OR BOOK A DEMO */}
			<section className="relative w-full border-neutral-200 border-b bg-white">
				<Frame className="py-16 sm:py-20">
					{/* Header */}
					<div className="flex flex-col items-center px-6 text-center sm:px-8">
						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl">
							Get in touch or schedule a live demo
						</h2>
						<p className="mt-3 max-w-lg text-neutral-500 text-sm leading-relaxed sm:text-base">
							Have questions about our apps or need help boosting your store's
							revenue? Our team is here to assist.
						</p>
					</div>

					{/* 2 Main Action Cards */}
					<div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
						{/* Card 1: Get a Demo */}
						<div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/50 p-8 shadow-2xs transition-all hover:bg-neutral-50 hover:shadow-sm">
							<div>
								<div className="flex size-11 items-center justify-center rounded-xl border border-neutral-200/80 bg-white shadow-2xs">
									<Calendar className="size-5 text-neutral-800" />
								</div>
								<h3 className="mt-5 font-bold font-satoshi text-neutral-900 text-xl">
									Book a Live Demo
								</h3>
								<p className="mt-2 text-neutral-500 text-xs leading-relaxed sm:text-sm">
									Schedule a 15-minute 1-on-1 walkthrough with an Edgecoms
									specialist to see how our 7-app suite can lift your average
									order value and conversion rate.
								</p>
							</div>

							<div className="mt-8">
								<a
									className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800"
									href={BOOKING_URL}
									rel="noopener noreferrer"
									target="_blank"
								>
									<span>{BOOKING_LABEL}</span>
									<ArrowRight className="size-4" />
								</a>
							</div>
						</div>

						{/* Card 2: Send us an Email */}
						<div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/50 p-8 shadow-2xs transition-all hover:bg-neutral-50 hover:shadow-sm">
							<div>
								<div className="flex size-11 items-center justify-center rounded-xl border border-neutral-200/80 bg-white shadow-2xs">
									<Mail className="size-5 text-neutral-800" />
								</div>
								<h3 className="mt-5 font-bold font-satoshi text-neutral-900 text-xl">
									Send us an Email
								</h3>
								<p className="mt-2 text-neutral-500 text-xs leading-relaxed sm:text-sm">
									Prefer email? Send your inquiry directly to our team and we'll
									get back to you within 2 hours during business hours.
								</p>

								{/* Direct Email Links */}
								<div className="mt-5 flex flex-col gap-2 text-neutral-600 text-xs sm:text-sm">
									<div className="flex items-center justify-between border-neutral-200/80 border-b pb-2">
										<span className="text-neutral-500">Support</span>
										<a
											className="font-semibold text-neutral-900 hover:underline"
											href="mailto:support@edgecoms.com"
										>
											support@edgecoms.com
										</a>
									</div>
									<div className="flex items-center justify-between border-neutral-200/80 border-b py-2">
										<span className="text-neutral-500">Partnerships</span>
										<a
											className="font-semibold text-neutral-900 hover:underline"
											href="mailto:partners@edgecoms.com"
										>
											partners@edgecoms.com
										</a>
									</div>
									<div className="flex items-center justify-between pt-1">
										<span className="text-neutral-500">General Inquiries</span>
										<a
											className="font-semibold text-neutral-900 hover:underline"
											href="mailto:hello@edgecoms.com"
										>
											hello@edgecoms.com
										</a>
									</div>
								</div>
							</div>

							<div className="mt-8">
								<a
									className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-3 font-semibold text-neutral-900 text-sm shadow-2xs transition-colors hover:bg-neutral-100"
									href="mailto:hello@edgecoms.com"
								>
									<span>Email us</span>
									<Mail className="size-4 text-neutral-700" />
								</a>
							</div>
						</div>
					</div>
				</Frame>
			</section>

			{/* SECTION 3: CLOSING CTA */}
			<CtaDark />
		</main>
	);
}
