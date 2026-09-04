import type { Metadata } from "next";
import { Frame } from "@/components/landing/frame";
import { Reveal } from "@/components/ui/reveal";
import {
	APP_DATA_ROWS,
	PRIVACY_ENTITY,
	PRIVACY_UPDATED,
	REDACTION_WEBHOOKS,
	RETENTION_RULES,
	SUBPROCESSORS,
} from "@/lib/privacy";
import { EDGE_PRODUCTS } from "@/lib/products";
import { breadcrumbSchema, jsonLdScriptProps } from "@/lib/seo";

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"What the Edge suite of Shopify apps stores, who it is shared with, how long it is kept, and how to have it deleted. Written app by app against what the code actually does.",
	alternates: { canonical: "/privacy" },
	openGraph: { type: "website", url: "/privacy" },
};

/**
 * THE PRIVACY POLICY PAGE.
 *
 * Public, unauthenticated, and stable: this is the URL pasted into every Edge
 * app's App Store listing, so it must not move. All substance lives in
 * `lib/privacy.ts`; this file is layout only, which is what keeps a copy change
 * from becoming a JSX change.
 *
 * Light-only, like the rest of `(home)` — colours are stated absolutely rather
 * than through the semantic tokens, because this layout's nav and footer do the
 * same and a themed page under an unthemed header is the one combination that
 * looks broken.
 */

/** Section spine. Drives both the table of contents and the headings. */
const SECTIONS = [
	{ id: "who-we-are", title: "Who we are" },
	{ id: "roles", title: "Merchants, shoppers, and who answers for what" },
	{ id: "merchant-data", title: "What we store about merchants" },
	{ id: "shopper-data", title: "What each app stores about shoppers" },
	{ id: "website", title: "What the edgecoms.com website collects" },
	{ id: "partners", title: "What we store about partners" },
	{ id: "consent", title: "Consent" },
	{ id: "subprocessors", title: "Who else touches this data" },
	{ id: "retention", title: "How long we keep it, and how it gets deleted" },
	{ id: "security", title: "Security" },
	{ id: "rights", title: "Your rights" },
	{ id: "transfers", title: "International transfers" },
	{ id: "children", title: "Children" },
	{ id: "changes", title: "Changes to this policy" },
	{ id: "contact", title: "Contact us" },
] as const;

const PROSE = "text-[15px] text-neutral-600 leading-relaxed";
const HEADING = "font-satoshi font-semibold text-[22px] text-neutral-900";
const LIST = "mt-4 flex flex-col gap-2.5 text-[15px] text-neutral-600";

/** A `<section>` with its anchor, so the table of contents can reach it. */
function Section({
	children,
	id,
	title,
}: {
	children: React.ReactNode;
	id: string;
	title: string;
}) {
	return (
		<section className="scroll-mt-28" id={id}>
			<h2 className={HEADING}>{title}</h2>
			<div className="mt-4 flex flex-col gap-4">{children}</div>
		</section>
	);
}

/** Bullet with the square marker the rest of the site uses. */
function Bullet({ children }: { children: React.ReactNode }) {
	return (
		<li className="flex gap-3 leading-relaxed">
			<span
				aria-hidden="true"
				className="mt-2 size-1.5 shrink-0 rounded-[2px] bg-neutral-300"
			/>
			<span>{children}</span>
		</li>
	);
}

export default function PrivacyPage() {
	const productName = new Map(
		EDGE_PRODUCTS.map((product) => [product.slug, product.name])
	);

	return (
		<main>
			<script
				{...jsonLdScriptProps(
					breadcrumbSchema([
						{ name: "Home", path: "/" },
						{ name: "Privacy Policy", path: "/privacy" },
					])
				)}
			/>

			{/* HERO */}
			<section className="relative w-full border-neutral-200 border-b bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-neutral-50/40 [background-size:16px_16px]">
				<Frame className="px-6 py-16 sm:px-8 sm:py-20">
					<p className="font-medium text-[13px] text-neutral-500 uppercase tracking-[0.14em]">
						Legal
					</p>
					<h1 className="mt-3 font-bold font-satoshi text-3xl text-neutral-900 tracking-tight sm:text-4xl lg:text-[44px]">
						Privacy Policy
					</h1>
					<p className={`mt-4 max-w-2xl text-balance ${PROSE}`}>
						This policy covers the edgecoms.com website, the Edge partner
						portal, and every app in the Edge suite. It was written app by app
						against what each one actually stores, rather than against what it
						is for.
					</p>
					<p className="mt-6 text-[13px] text-neutral-500">
						Last updated: {PRIVACY_UPDATED}
					</p>
				</Frame>
			</section>

			{/* THE SHORT VERSION */}
			<Reveal>
				<section className="border-neutral-200 border-b bg-white">
					<Frame className="px-6 py-14 sm:px-8">
						<h2 className={HEADING}>The short version</h2>
						<ul className={`${LIST} max-w-3xl`}>
							<Bullet>
								We never sell your data, and we never use a merchant&apos;s
								shoppers to advertise anything of our own.
							</Bullet>
							<Bullet>
								Most of the apps store no shopper identifiers at all — they
								count anonymous events. The exceptions are named plainly in the
								table below.
							</Bullet>
							<Bullet>
								Trackproof is the one app that handles customer contact details.
								It encrypts them at rest and hashes them before they reach an
								advertising platform, and it only ever sends them to accounts
								the merchant connected themselves.
							</Bullet>
							<Bullet>
								Uninstalling deletes everything. Shopify sends us a redaction
								request about 48 hours later and the store&apos;s entire dataset
								is hard-deleted.
							</Bullet>
						</ul>
					</Frame>
				</section>
			</Reveal>

			{/* BODY */}
			<section className="bg-white">
				<Frame className="px-6 py-14 sm:px-8">
					<div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
						{/* Table of contents */}
						<nav
							aria-label="On this page"
							className="h-fit lg:sticky lg:top-24"
						>
							<h2 className="font-medium text-[13px] text-neutral-900 uppercase tracking-[0.12em]">
								On this page
							</h2>
							<ul className="mt-4 flex flex-col gap-2.5">
								{SECTIONS.map((section) => (
									<li key={section.id}>
										<a
											className="text-[13px] text-neutral-500 leading-snug transition-colors hover:text-neutral-900"
											href={`#${section.id}`}
										>
											{section.title}
										</a>
									</li>
								))}
							</ul>
						</nav>

						<div className="flex max-w-3xl flex-col gap-12">
							<Section id="who-we-are" title="Who we are">
								<p className={PROSE}>
									{/* One template literal rather than JSX text: the formatter
									    strips a `{" "}` here and JSX then eats the space before
									    the parenthetical, rendering "Edgecoms(\u201cwe\u201d". */}
									{`${PRIVACY_ENTITY.legalName} (\u201cwe\u201d, \u201cus\u201d) builds and operates the Edge suite of Shopify apps and the partner program at edgecoms.com. This policy explains what we do with personal data across all of them.`}
								</p>
								<p className={PROSE}>
									Privacy questions and data requests go to{" "}
									<a
										className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
										href={`mailto:${PRIVACY_ENTITY.privacyEmail}`}
									>
										{PRIVACY_ENTITY.privacyEmail}
									</a>
									.
									{PRIVACY_ENTITY.registeredAddress
										? ` Our registered address is ${PRIVACY_ENTITY.registeredAddress}.`
										: ""}
								</p>
							</Section>

							<Section
								id="roles"
								title="Merchants, shoppers, and who answers for what"
							>
								<p className={PROSE}>
									Two different relationships run through these apps, and the
									law treats them differently.
								</p>
								<ul className={LIST}>
									<Bullet>
										<strong className="font-medium text-neutral-900">
											Merchants and partners.
										</strong>{" "}
										When you install an app or join the partner program, we
										decide what to do with your data. We are the controller, and
										you can bring a request straight to us.
									</Bullet>
									<Bullet>
										<strong className="font-medium text-neutral-900">
											Shoppers in a merchant&apos;s store.
										</strong>{" "}
										We only process shopper data on the merchant&apos;s
										instructions, to run the feature the merchant switched on.
										The merchant is the controller and we are the processor. If
										you are a shopper, your request goes to the store you bought
										from — they have tooling in the app to answer it, and we
										help them do so.
									</Bullet>
								</ul>
							</Section>

							<Section id="merchant-data" title="What we store about merchants">
								<ul className={LIST}>
									<Bullet>
										Your shop domain, shop name, currency, timezone, Shopify
										plan and install state.
									</Bullet>
									<Bullet>
										The name and email address on the Shopify account that
										installed the app, from the session Shopify issues us.
									</Bullet>
									<Bullet>
										The configuration you create — bundles, timers, cart
										settings, selling plans, review flows, connected pixels.
									</Bullet>
									<Bullet>
										Aggregate revenue figures attributed to the app, which we
										use for your analytics and, where an app is priced on
										revenue, for billing.
									</Bullet>
									<Bullet>
										Support conversations you start in the in-app chat.
									</Bullet>
									<Bullet>
										Advertising platform credentials, where you connect them
										(Trackproof). These are encrypted at rest with AES-256-GCM
										and are never logged or shown back to the browser.
									</Bullet>
								</ul>
							</Section>

							<Section
								id="shopper-data"
								title="What each app stores about shoppers"
							>
								<p className={PROSE}>
									The apps differ substantially here, so they are listed
									separately rather than covered by one paragraph. Each row says
									what the app writes to our database and what it explicitly
									does not.
								</p>
								<div className="mt-2 overflow-x-auto">
									<table className="w-full min-w-[640px] border-collapse text-left">
										<thead>
											<tr className="border-neutral-200 border-b">
												<th className="w-[140px] py-3 pr-4 font-medium text-[13px] text-neutral-900">
													App
												</th>
												<th className="py-3 pr-4 font-medium text-[13px] text-neutral-900">
													What it stores
												</th>
												<th className="py-3 font-medium text-[13px] text-neutral-900">
													What it does not collect
												</th>
											</tr>
										</thead>
										<tbody>
											{APP_DATA_ROWS.map((row) => (
												<tr
													className="border-neutral-200 border-b align-top"
													key={row.slug}
												>
													<td className="py-4 pr-4 font-medium text-[14px] text-neutral-900">
														{productName.get(row.slug) ?? row.slug}
													</td>
													<td className="py-4 pr-4 text-[14px] text-neutral-600 leading-relaxed">
														{row.stores}
													</td>
													<td className="py-4 text-[14px] text-neutral-500 leading-relaxed">
														{row.notCollected}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								<p className={`${PROSE} mt-2`}>
									Across every app: we never collect payment card details.
									Payments stay with Shopify and its payment processors.
								</p>
							</Section>

							<Section
								id="website"
								title="What the edgecoms.com website collects"
							>
								<ul className={LIST}>
									<Bullet>
										<strong className="font-medium text-neutral-900">
											Advertising measurement.
										</strong>{" "}
										We run the Meta Pixel and Meta&apos;s Conversions API to
										measure how our own ads perform. Nothing loads and no
										request reaches Meta until you accept in the cookie banner.
										What is sent is the Meta cookie identifiers, your IP address
										and browser user-agent — not your email address. You can
										change your answer at any time from the link in the footer.
									</Bullet>
									<Bullet>
										<strong className="font-medium text-neutral-900">
											Traffic analytics.
										</strong>{" "}
										Aggregate, cookieless page analytics from Vercel. These do
										not identify you.
									</Bullet>
									<Bullet>
										<strong className="font-medium text-neutral-900">
											Forms you fill in.
										</strong>{" "}
										If you request a guide or playbook, we store the email
										address and optional store URL you typed, which button you
										submitted from, and when we sent the email. We use it to
										send you what you asked for and to follow up about the app
										it relates to.
									</Bullet>
									<Bullet>
										<strong className="font-medium text-neutral-900">
											Abuse prevention.
										</strong>{" "}
										Form submissions are rate-limited by IP address in memory.
										That IP address is not written to our database.
									</Bullet>
								</ul>
							</Section>

							<Section id="partners" title="What we store about partners">
								<p className={PROSE}>
									If you join the Edge partner program we store your name, email
									address and login credentials, the stores attributed to you,
									the commissions generated on them, and the payout method and
									reference you give us so we can pay you. A partner can only
									ever see their own merchants, earnings and commissions; that
									isolation is enforced in the database layer, not just in the
									interface.
								</p>
							</Section>

							<Section id="consent" title="Consent">
								<p className={PROSE}>
									Inside a merchant&apos;s storefront, tracking is gated on
									Shopify&apos;s Customer Privacy API. Where a store collects
									consent — for example under GDPR in the EU and UK — no events
									are sent and no cookies are written until the shopper has
									consented.
								</p>
								<p className={PROSE}>
									For Trackproof specifically: where an advertising platform
									does not honour browser-level consent signals automatically,
									we do not send events at all for a visitor who has declined
									marketing consent, and we forward Google Consent Mode v2
									signals in the payload where the destination supports them.
								</p>
							</Section>

							<Section id="subprocessors" title="Who else touches this data">
								<div className="mt-2 overflow-x-auto">
									<table className="w-full min-w-[640px] border-collapse text-left">
										<thead>
											<tr className="border-neutral-200 border-b">
												<th className="w-[180px] py-3 pr-4 font-medium text-[13px] text-neutral-900">
													Sub-processor
												</th>
												<th className="py-3 pr-4 font-medium text-[13px] text-neutral-900">
													Why
												</th>
												<th className="py-3 font-medium text-[13px] text-neutral-900">
													What it receives
												</th>
											</tr>
										</thead>
										<tbody>
											{SUBPROCESSORS.map((processor) => (
												<tr
													className="border-neutral-200 border-b align-top"
													key={processor.name}
												>
													<td className="py-4 pr-4 font-medium text-[14px] text-neutral-900">
														{processor.name}
													</td>
													<td className="py-4 pr-4 text-[14px] text-neutral-600 leading-relaxed">
														{processor.purpose}
													</td>
													<td className="py-4 text-[14px] text-neutral-500 leading-relaxed">
														{processor.dataShared}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								<p className={`${PROSE} mt-2`}>
									We do not sell personal data, and we do not share it for
									cross-context behavioural advertising of our own products.
								</p>
							</Section>

							<Section
								id="retention"
								title="How long we keep it, and how it gets deleted"
							>
								<p className={PROSE}>
									We implement Shopify&apos;s mandatory privacy webhooks in
									every app:
								</p>
								<ul className={LIST}>
									{REDACTION_WEBHOOKS.map((hook) => (
										<Bullet key={hook.topic}>
											<code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] text-neutral-900">
												{hook.topic}
											</code>{" "}
											— {hook.behaviour}
										</Bullet>
									))}
								</ul>
								<p className={`${PROSE} mt-2`}>
									Some data expires sooner than that, whether or not you
									uninstall:
								</p>
								<ul className={LIST}>
									{RETENTION_RULES.map((rule) => (
										<Bullet key={rule}>{rule}</Bullet>
									))}
								</ul>
							</Section>

							<Section id="security" title="Security">
								<ul className={LIST}>
									<Bullet>
										All traffic is encrypted in transit with TLS, and databases
										are encrypted at rest.
									</Bullet>
									<Bullet>
										Advertising platform credentials and stored customer contact
										details are encrypted with AES-256-GCM. They are decrypted
										in memory only at the moment they are needed.
									</Bullet>
									<Bullet>
										Customer email addresses and phone numbers are hashed with
										SHA-256 before they leave our systems for any advertising
										platform.
									</Bullet>
									<Bullet>
										Webhook and storefront ingestion requests are verified by
										HMAC signature and rate-limited. An endpoint that cannot
										verify a signature refuses the request rather than accepting
										it unsigned.
									</Bullet>
									<Bullet>
										Access to production systems is restricted to the operating
										team.
									</Bullet>
								</ul>
							</Section>

							<Section id="rights" title="Your rights">
								<p className={PROSE}>
									Depending on where you live — including under the GDPR in the
									EU and UK, and the CCPA and CPRA in California — you may have
									the right to access the personal data we hold about you,
									correct it, have it deleted, object to or restrict how we use
									it, receive a portable copy, and not be discriminated against
									for exercising any of that. We do not sell personal data, so
									there is nothing to opt out of on that front.
								</p>
								<p className={PROSE}>
									<strong className="font-medium text-neutral-900">
										If you are a shopper
									</strong>{" "}
									in a store that uses an Edge app, send your request to that
									store. They are the controller of your data and can action it
									through Shopify, which reaches us automatically. If you cannot
									reach them, write to us and we will help.
								</p>
								<p className={PROSE}>
									<strong className="font-medium text-neutral-900">
										If you are a merchant or a partner
									</strong>
									, write to{" "}
									<a
										className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
										href={`mailto:${PRIVACY_ENTITY.privacyEmail}`}
									>
										{PRIVACY_ENTITY.privacyEmail}
									</a>{" "}
									and we will respond within 30 days. If you are in the EU or
									UK, you also have the right to complain to your local data
									protection authority.
								</p>
							</Section>

							<Section id="transfers" title="International transfers">
								<p className={PROSE}>
									Our servers are in the United States. If you are outside the
									US, using the apps means your data is transferred there and to
									the sub-processors listed above. Where that transfer is out of
									the EU or UK, it is made under the European Commission&apos;s
									Standard Contractual Clauses and the UK Addendum.
								</p>
							</Section>

							<Section id="children" title="Children">
								<p className={PROSE}>
									The Edge apps are business tools sold to merchants. They are
									not directed at children, and we do not knowingly collect
									personal data from anyone under 16. If you believe we have,
									write to us and we will delete it.
								</p>
							</Section>

							<Section id="changes" title="Changes to this policy">
								<p className={PROSE}>
									We update this policy when what the apps do changes. The
									&ldquo;last updated&rdquo; date at the top always reflects the
									current version, and for a material change we will notify
									merchants in-app or by email before it takes effect.
								</p>
							</Section>

							<Section id="contact" title="Contact us">
								<p className={PROSE}>
									Privacy questions and data requests:{" "}
									<a
										className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
										href={`mailto:${PRIVACY_ENTITY.privacyEmail}`}
									>
										{PRIVACY_ENTITY.privacyEmail}
									</a>
									.
								</p>
								<p className={PROSE}>
									Anything else:{" "}
									<a
										className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
										href={`mailto:${PRIVACY_ENTITY.supportEmail}`}
									>
										{PRIVACY_ENTITY.supportEmail}
									</a>
									.
								</p>
							</Section>
						</div>
					</div>
				</Frame>
			</section>
		</main>
	);
}
