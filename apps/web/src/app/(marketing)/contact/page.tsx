import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/contact-form";
import { PageHeader } from "@/components/marketing/page-header";

export const metadata: Metadata = {
	title: "Contact — Edge",
	description:
		"Talk to the Edge team about the apps, the partner program, or anything else.",
};

const channels = [
	{
		label: "Partnerships",
		value: "partners@edgecoms.com",
		href: "mailto:partners@edgecoms.com",
	},
	{
		label: "Support",
		value: "support@edgecoms.com",
		href: "mailto:support@edgecoms.com",
	},
	{
		label: "General",
		value: "hello@edgecoms.com",
		href: "mailto:hello@edgecoms.com",
	},
] as const;

export default function ContactPage() {
	return (
		<section className="relative w-full overflow-hidden">
			<div className="mx-auto w-full max-w-7xl px-6 pt-32 pb-32">
				<PageHeader
					eyebrow="Contact"
					lead="Questions about the apps, the partner program, or a merchant you manage? We read every message."
					title="Let's talk."
				/>

				<div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-5">
					<div className="flex flex-col gap-8 lg:col-span-2">
						{channels.map((channel) => (
							<div className="flex flex-col gap-1" key={channel.label}>
								<span className="font-medium font-mono text-[11px] text-secondary-foreground uppercase tracking-[0.08em]">
									{channel.label}
								</span>
								<a
									className="text-body-lg text-primary-foreground underline-offset-4 transition-colors hover:underline"
									href={channel.href}
								>
									{channel.value}
								</a>
							</div>
						))}
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
