import { cn } from "@edgecoms/ui/lib/utils";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ConsentSettingsLink } from "@/components/analytics/consent-settings-link";
import { SITE_NAME } from "@/lib/seo";
import {
	formatWhatsappNumber,
	STORE_SETUP_LINKS,
	STORE_SETUP_PLANS,
	type StoreSetupClick,
	storeSetupClickProps,
} from "@/lib/store-setup";
import styles from "./store-setup.module.css";

/**
 * `/store-setup` — the landing page the Store Setup ads on Meta point at.
 *
 * The copy, the section order and the look are an approved design and are
 * ported as-is. Two things are not typed into the markup:
 *
 * - **The prices** are read from `STORE_SETUP_PLANS`, the same constant the
 *   Meta pixel reports as the value of a checkout click.
 * - **The three outbound links** come from the environment by way of
 *   `STORE_SETUP_LINKS`. One that is not configured renders as a disabled
 *   button (see `ActionLink`), never as a link that goes nowhere.
 *
 * The page itself is a server component. The FAQ is native `<details>`, the
 * sticky bar is CSS, and click tracking is the delegated listener already
 * mounted in the root layout. Each button carries a mark saying which one it
 * is (`storeSetupClickProps`), the listener reads the mark, and on this page
 * the events go to the Edgecoms Academy pixel and to no other. The address a
 * button leads to plays no part in that.
 *
 * One addition to the design: the footer carries the site's cookie control.
 * The consent banner tells every visitor they can change their mind "from the
 * footer", and with no site footer here this one has to keep that promise.
 */

const { pro, basic } = STORE_SETUP_PLANS;

const usd = (amount: number): string => `$${amount}`;

const PRO_PRICE = usd(pro.priceUsd);
const BASIC_PRICE = usd(basic.priceUsd);
const PRO_PREMIUM = usd(pro.priceUsd - basic.priceUsd);

/** The hero's sub line, and the page's meta description. */
const HERO_SUB = `Pro is ${PRO_PRICE}: product research, a private supplier, a free theme and a full Shopify store, tested before we hand it over. Already have a product? Basic builds the store around it for ${BASIC_PRICE}.`;

export const metadata: Metadata = {
	title: "Store Setup",
	description: HERO_SUB,
	alternates: { canonical: "/store-setup" },
	openGraph: { type: "website", url: "/store-setup", siteName: SITE_NAME },
	/* Restated rather than inherited: the root layout pins a homepage title on
	   the Twitter card, and a page that says nothing here would unfurl as the
	   homepage. With no title of its own this falls back to the page's. */
	twitter: { card: "summary_large_image" },
};

/** The tooltip on a control whose link has not been configured. */
const LINK_PENDING = "Link not added yet";

interface Feature {
	/** A headline feature: drawn with the highlighted marker and in bold. */
	key?: boolean;
	text: string;
}

const PRO_FEATURES: readonly Feature[] = [
	{ key: true, text: "Winning product researched for your niche" },
	{ key: true, text: "Private supplier for that product" },
	{ key: true, text: "Free theme, set up in your brand look" },
	{ text: "Logo, colors and up to 10 products" },
	{ text: "Full store: pages, payments, tracking and a test order" },
	{ text: "2 rounds of changes and a 30-minute handover call" },
];

const BASIC_FEATURES: readonly Feature[] = [
	{ key: true, text: "Free theme, set up for your store" },
	{ text: "Up to 3 products added and written" },
	{ text: "All core pages and policies" },
	{ text: "Payments, shipping and tracking set up" },
	{ text: "Apps set up and a test order placed" },
	{ text: "1 round of changes and a handover video" },
];

const RESEARCH_STEPS: readonly { body: string; title: string }[] = [
	{
		title: "Demand",
		body: "We look for products whose ads have kept running for weeks in the TikTok and Meta ad libraries, a sign they're selling.",
	},
	{
		title: "Competition",
		body: "We check how many stores are already pushing it and skip the ones that are everywhere.",
	},
	{
		title: "Numbers",
		body: "Product cost, shipping and a realistic ad cost against your selling price, so there's room for profit.",
	},
	{
		title: "Supplier",
		body: "We line up a private supplier who can source, pack and ship it, so you're not relying on a marketplace listing.",
	},
];

const INCLUDED: readonly string[] = [
	"A free theme, set up with home, product, about, contact and policy pages",
	"Your product pages written and laid out",
	"Payments, shipping and store policies set up",
	"Meta pixel and Conversions API connected, with cookie consent switched on",
	"Bundle, cart and review apps installed and set up",
	"A test order placed from a second device before handover",
	"A short video showing you how to run the store",
];

const BUILD_DAYS: readonly { body: string; day: string; end?: boolean }[] = [
	{
		day: "Day 1",
		body: "You pay, then send your niche (Pro) or your product (Basic), plus store access. We confirm the plan the same day.",
	},
	{
		day: "Days 2 to 3",
		body: "Pro: we pick your winning product and supplier, and you approve them. Then we build the theme, pages, products, payments and apps.",
	},
	{
		day: "Day 4",
		body: "You get the first version to review on your phone.",
	},
	{
		day: "Days 5 to 6",
		body: "We make your changes and run the launch checklist below.",
	},
	{
		day: "Day 7",
		body: "Handover: your store is ready to launch, with a walkthrough video.",
		end: true,
	},
];

const LAUNCH_CHECKLIST: readonly string[] = [
	"Fresh Meta pixel connected to the store",
	"Data sharing set to Maximum, so the Conversions API is on",
	"Cookie banner on, and it holds scripts until a visitor accepts",
	"ViewContent, AddToCart, InitiateCheckout and Purchase events checked",
	"Test order placed from a second device",
	"Every page checked on a phone",
];

const FAQS: readonly { answer: string; question: string }[] = [
	{
		question: "Does a winning product mean guaranteed sales?",
		answer:
			"No. We pick a product with real demand and margins that work. Sales depend on your offer and your ads, and every product needs testing.",
	},
	{
		question: "What is a private supplier?",
		answer:
			"A supplier who works with you directly to source, pack and ship your orders, instead of a public marketplace listing. With Pro, we connect you with one for your winning product.",
	},
	{
		question: "Is the theme really free?",
		answer:
			"Yes. Both options include the theme, set up for your store, with no theme fee.",
	},
	{
		question: "Are ads included?",
		answer:
			"No. If you want us to launch your first Meta ads, we can quote that separately once your store is ready.",
	},
	{
		question: "What do I need to have?",
		answer:
			"A Shopify account, plus your niche for Pro or your product for Basic. If you don't have a Shopify account yet, we'll walk you through opening one on day 1.",
	},
	{
		question: "How do I pay?",
		answer:
			"By card or PayPal, through the secure PayPal checkout on this page. The payment goes to Anurag Chandra, our founder. Once it's paid, you're taken to WhatsApp to confirm your start date with us the same day.",
	},
	{
		question: "What if I change my mind?",
		answer:
			"If we haven't started building, you get a full refund. Once the build has started, we finish the store as described on this page.",
	},
	{
		question: "Who builds it?",
		answer:
			"Anurag, founder of Edgecoms, and the team behind the Edge apps for Shopify.",
	},
];

/**
 * One of the page's three outbound links: pay for Pro, pay for Basic, or ask
 * on WhatsApp.
 *
 * With an `href` it is an ordinary link that opens in a new tab, so the offer
 * stays open behind the payment page. It carries `track` as a data attribute,
 * which is the only thing the pixel reads to know what was pressed.
 *
 * Without an `href` it is a disabled button wearing the same classes. A
 * disabled button cannot be clicked, focused or followed, which is the point:
 * an anchor with nowhere to go still looks and behaves like a link, and a
 * buyer who taps "Get Pro" and lands nowhere has been told the page is broken.
 *
 * `inline` is for the one link that sits inside a sentence. A browser lays a
 * button out as a single unbreakable box, so there the switched-off form is
 * plain dimmed text instead, which wraps with the words around it the way the
 * link does.
 */
function ActionLink({
	children,
	className,
	href,
	inline = false,
	track,
}: {
	children: ReactNode;
	className: string;
	href: string | undefined;
	inline?: boolean;
	track: StoreSetupClick;
}) {
	if (href) {
		return (
			<a
				className={className}
				href={href}
				rel="noopener"
				target="_blank"
				{...storeSetupClickProps(track)}
			>
				{children}
			</a>
		);
	}

	const pending = cn(className, styles.isPending);

	if (inline) {
		return (
			<span className={pending} title={LINK_PENDING}>
				{children}
			</span>
		);
	}

	return (
		<button className={pending} disabled title={LINK_PENDING} type="button">
			{children}
		</button>
	);
}

function Check() {
	return (
		<svg aria-hidden="true" viewBox="0 0 16 16">
			<path d="M3 8.5l3.2 3L13 4.5" />
		</svg>
	);
}

function FeatureList({ features }: { features: readonly Feature[] }) {
	return (
		<ul>
			{features.map((feature) => (
				<li className={feature.key ? styles.key : undefined} key={feature.text}>
					{feature.text}
				</li>
			))}
		</ul>
	);
}

export default function StoreSetupPage() {
	const links = STORE_SETUP_LINKS;
	const linkMissing = !(links.proPay && links.basicPay && links.whatsapp);

	const primary = cn(styles.btn, styles.primary);
	const ghost = cn(styles.btn, styles.ghost);

	return (
		<>
			<div className={styles.page}>
				<main className={styles.wrap}>
					{linkMissing ? (
						<p className={styles.previewNote}>
							Preview: add your payment links and WhatsApp number to switch the
							buttons on.
						</p>
					) : null}

					<header className={styles.hero}>
						<p className={styles.eyebrow}>Store Setup · by Edgecoms</p>
						<h1>
							We find your winning product and build your store in{" "}
							<span className={styles.mark}>7&nbsp;days</span>.
						</h1>
						<p className={styles.sub}>{HERO_SUB}</p>
						<div className={styles.actions}>
							<ActionLink className={primary} href={links.proPay} track="pro">
								Get Pro · {PRO_PRICE}
							</ActionLink>
							<a className={ghost} href="#options">
								Compare both options
							</a>
						</div>
						<p className={styles.madeBy}>
							Questions first?{" "}
							<ActionLink
								className={styles.textLink}
								href={links.whatsapp}
								inline
								track="whatsapp"
							>
								Ask us on WhatsApp
							</ActionLink>
							. Built by Edgecoms, the team behind the Edge apps for Shopify.
						</p>
					</header>

					<aside aria-label="October launch bonus" className={styles.bonus}>
						<span className={styles.badge}>
							Launch
							<br />
							bonus
						</span>
						<strong>Order by 31 Oct and get two extras, free.</strong>
						<p>
							Edgecoms Academy, our $500 course, so you learn to run the store,
							plus 3 ad images made for your product, ready for your first ads.
						</p>
					</aside>

					<section aria-labelledby="pick" id="options">
						<p className={styles.eyebrow}>Two options, paid once</p>
						<h2 id="pick">Pick the one that fits.</h2>
						<div className={styles.options}>
							<article className={cn(styles.card, styles.pro)}>
								<div className={styles.head}>
									<span className={styles.name}>{pro.name}</span>
									<span className={styles.tag}>Recommended</span>
								</div>
								<p className={styles.amount}>
									{PRO_PRICE}
									<small>one-time</small>
								</p>
								<p className={styles.lede}>
									We find your winning product and build the store around it.
								</p>
								<FeatureList features={PRO_FEATURES} />
								<p className={styles.value}>
									The store build alone is {BASIC_PRICE}. Pro adds the winning
									product, the supplier and your brand for {PRO_PREMIUM} more.
								</p>
								<ActionLink className={primary} href={links.proPay} track="pro">
									Get Pro · {PRO_PRICE}
								</ActionLink>
							</article>
							<article className={styles.card}>
								<div className={styles.head}>
									<span className={styles.name}>{basic.name}</span>
								</div>
								<p className={styles.amount}>
									{BASIC_PRICE}
									<small>one-time</small>
								</p>
								<p className={styles.lede}>
									You already have a product. We build the store around it.
								</p>
								<FeatureList features={BASIC_FEATURES} />
								<p className={styles.value}>
									Bring your own product and supplier. Upgrade to Pro any time
									before we start.
								</p>
								<ActionLink
									className={primary}
									href={links.basicPay}
									track="basic"
								>
									Get Basic · {BASIC_PRICE}
								</ActionLink>
							</article>
						</div>
						<p className={styles.fine}>
							Prices are in US dollars, paid securely by card or PayPal to
							Anurag Chandra, our founder. Your Shopify plan and any paid apps
							are billed to you by Shopify, separately. We take 2 new stores a
							week. Not sure which fits? Tell us what you want to sell on
							WhatsApp and we'll point you to one.
						</p>
					</section>

					<section aria-labelledby="win">
						<p className={styles.eyebrow}>The Pro difference</p>
						<h2 id="win">How we pick your winning product.</h2>
						<p className={styles.lead}>
							It's the research we do for our own stores. You get the product,
							the numbers behind it and a supplier ready to ship it.
						</p>
						<ol className={styles.steps}>
							{RESEARCH_STEPS.map((step) => (
								<li key={step.title}>
									<h3>{step.title}</h3>
									<p>{step.body}</p>
								</li>
							))}
						</ol>
						<p className={styles.honest}>
							No product is guaranteed to sell. We pick one with real demand and
							margins that work, and you test it with ads.
						</p>
					</section>

					<section aria-labelledby="get">
						<p className={styles.eyebrow}>In every store</p>
						<h2 id="get">Everything a new store needs before its first ad.</h2>
						<ul className={styles.ticks}>
							{INCLUDED.map((item) => (
								<li key={item}>
									<span className={styles.tick}>
										<Check />
									</span>
									<span>{item}</span>
								</li>
							))}
						</ul>
					</section>

					<section aria-labelledby="week" className={styles.narrow}>
						<p className={styles.eyebrow}>How the 7 days go</p>
						<h2 id="week">You know what happens every day of the build.</h2>
						<ol className={styles.days}>
							{BUILD_DAYS.map((entry) => (
								<li
									className={entry.end ? styles.end : undefined}
									key={entry.day}
								>
									<span className={styles.day}>{entry.day}</span>
									<span>{entry.body}</span>
								</li>
							))}
						</ol>
					</section>

					<section aria-labelledby="check" className={styles.narrow}>
						<p className={styles.eyebrow}>Before handover</p>
						<h2 id="check">Every store goes through our launch checklist.</h2>
						<p className={styles.lead}>
							We wrote it after a client store spent $900 on ads while its
							tracking was broken. Your store isn't handed over until every line
							is ticked.
						</p>
						{/* biome-ignore lint/a11y/useSemanticElements: the suggested <fieldset> is for form controls; this is a printed checklist with nothing to fill in */}
						<div
							aria-label="Launch checklist"
							className={styles.sheet}
							role="group"
						>
							<header>
								<span>Launch checklist</span>
								<span>v1.0</span>
							</header>
							<ol>
								{LAUNCH_CHECKLIST.map((item) => (
									<li key={item}>
										<span className={styles.box}>
											<Check />
										</span>
										<span>{item}</span>
									</li>
								))}
							</ol>
						</div>
					</section>

					<section aria-labelledby="fitq">
						<p className={styles.eyebrow}>Is it for you?</p>
						<h2 id="fitq">Straight answer before you pay.</h2>
						<div className={styles.fit}>
							<div>
								<h3>A good fit</h3>
								<p>
									You want to start selling online and need a product with real
									demand and a store that's built properly, without spending
									weeks figuring it out alone.
								</p>
							</div>
							<div className={styles.no}>
								<h3>Not a fit</h3>
								<p>
									You want someone to promise you sales. Nobody honest can.
									Sales come from your product, your offer and your ads.
								</p>
							</div>
						</div>
					</section>

					<section aria-labelledby="faqh" className={styles.narrow}>
						<p className={styles.eyebrow}>Questions</p>
						<h2 id="faqh">What people ask before they start.</h2>
						<div className={styles.faq}>
							{FAQS.map((faq) => (
								<details key={faq.question}>
									<summary>{faq.question}</summary>
									<p>{faq.answer}</p>
								</details>
							))}
						</div>
					</section>

					<section aria-labelledby="go" className={styles.closing}>
						<h2 id="go">Get your winning product and your store this month.</h2>
						<p>
							Order by 31 Oct for the launch bonus. We take 2 new stores a week,
							so each one gets built properly.
						</p>
						<div className={styles.actions}>
							<ActionLink className={primary} href={links.proPay} track="pro">
								Get Pro · {PRO_PRICE}
							</ActionLink>
							<ActionLink
								className={primary}
								href={links.basicPay}
								track="basic"
							>
								Get Basic · {BASIC_PRICE}
							</ActionLink>
							<ActionLink
								className={ghost}
								href={links.whatsapp}
								track="whatsapp"
							>
								Ask on WhatsApp
							</ActionLink>
						</div>
					</section>

					<footer className={styles.footer}>
						<span>Edgecoms · Store Setup</span>
						<ConsentSettingsLink />
						{links.whatsappNumber ? (
							<span>
								WhatsApp:{" "}
								<span className={styles.num}>
									{formatWhatsappNumber(links.whatsappNumber)}
								</span>
							</span>
						) : null}
					</footer>
				</main>
			</div>

			{/* Outside `.page`, so the page's rule for `section` cannot reach it:
			    this is a bar pinned to the screen, not a part of the document. */}
			<section aria-label="Get Pro" className={styles.sticky}>
				<span>
					<strong>
						{pro.name} · {PRO_PRICE}
					</strong>
					Winning product, supplier and store
				</span>
				<ActionLink className={primary} href={links.proPay} track="pro">
					Get Pro
				</ActionLink>
			</section>
		</>
	);
}
