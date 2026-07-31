import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/contact-form";
import { Highlight } from "@/components/ui/highlight";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";

export const metadata: Metadata = {
	title: "Get a 15-minute store teardown · Edge",
	description:
		"Send us your store URL and we will tell you where revenue per visitor is leaking, which of the two numbers is weakest, and what we would change first. Free, no call required.",
};

/**
 * The destination for every primary CTA on the site, which is why it is a
 * teardown page rather than a contact page. A button that promises a teardown
 * and lands on "Let's talk" breaks the promise at the exact moment somebody
 * decided to act, and that is where the traffic is lost.
 */

/** What they get, so the ask feels like a trade rather than a lead form. */
const DELIVERABLES = [
	{
		title: "Which of the two numbers is weakest",
		body: "We look at your product pages, cart and checkout as a shopper does, and tell you whether conversion rate or average order value is the one holding you back.",
	},
	{
		title: "The three changes we would make first",
		body: "Specific to your store and ranked by what we think they are worth, not a checklist you could have found in a blog post.",
	},
	{
		title: "An honest answer about whether you need us",
		body: "If the fix is your product photography or your shipping rates, we will say so. We would rather be useful than sell you an app that will not move anything.",
	},
] as const;

const CHANNELS = [
	{
		label: "Support",
		value: "support@edgecoms.com",
		href: "mailto:support@edgecoms.com",
	},
	{
		label: "Partnerships",
		value: "partners@edgecoms.com",
		href: "mailto:partners@edgecoms.com",
	},
	{
		label: "Everything else",
		value: "hello@edgecoms.com",
		href: "mailto:hello@edgecoms.com",
	},
] as const;

export default function ContactPage() {
	return (
		<section className="relative isolate w-full overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a4)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_65%_50%_at_50%_25%,black_20%,transparent_78%)]"
			/>

			<div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-20">
				<div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
					<p className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.14em]">
						Free store teardown
					</p>
					<h1 className="text-balance font-medium text-display text-primary-foreground sm:text-display-lg">
						<Highlight>
							Send us your store. We'll tell you where the revenue is leaking.
						</Highlight>
					</h1>
					<p className="max-w-xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
						Fifteen minutes of our time on your storefront, written up and sent
						back to you. No call required, no charge, and no obligation to
						install anything.
					</p>
				</div>

				<div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-5 lg:gap-16">
					<div className="flex flex-col gap-10 lg:col-span-2">
						<ol className="flex flex-col gap-7">
							{DELIVERABLES.map((item, index) => (
								<li className="flex flex-col gap-2" key={item.title}>
									<span className="grid size-8 place-items-center rounded-full bg-brand/12 font-medium font-mono text-[13px] text-brand tabular-nums">
										{index + 1}
									</span>
									<h2 className="text-balance font-medium text-body text-primary-foreground">
										{item.title}
									</h2>
									<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
										{item.body}
									</p>
								</li>
							))}
						</ol>

						<div className="flex flex-col gap-4 border-border border-t pt-8">
							<h2 className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.12em]">
								Would rather book a time?
							</h2>
							<a
								className="w-fit text-body-sm text-primary-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
								href={BOOKING_URL}
								rel="noopener"
								target="_blank"
							>
								{BOOKING_LABEL}
							</a>
						</div>

						<div className="flex flex-col gap-4 border-border border-t pt-8">
							<h2 className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.12em]">
								Or email us directly
							</h2>
							<ul className="flex flex-col gap-3">
								{CHANNELS.map((channel) => (
									<li
										className="flex flex-wrap items-baseline gap-x-3"
										key={channel.label}
									>
										<span className="text-body-sm text-secondary-foreground">
											{channel.label}
										</span>
										<a
											className="text-body-sm text-primary-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
											href={channel.href}
										>
											{channel.value}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="lg:col-span-3">
						<div className="rounded-[2rem] border border-border bg-page p-8 sm:p-10">
							<ContactForm />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
