/**
 * The Edgecoms hiring catalog — the single source of copy for the /careers list
 * and every /careers/[slug] role page.
 *
 * Two rules hold across this file:
 *
 * 1. **No compensation number is invented.** `compensation` is optional and is
 *    left unset until a real, approved range exists for that role. A salary
 *    band on a public page is a commitment to every candidate who reads it, so
 *    an empty field is correct and a guessed one is not.
 * 2. **Every role states the same benefits.** `CAREER_BENEFITS` is shared by the
 *    listing page's icon grid and each role page's bullet list, so the two can
 *    never drift apart.
 */

import type { LucideIcon } from "lucide-react";
import {
	Calendar,
	DollarSign,
	Globe as GlobeIcon,
	Monitor,
	Palmtree,
	Plane,
} from "lucide-react";

export interface CareerBenefit {
	description: string;
	icon: LucideIcon;
	title: string;
}

export interface Role {
	/**
	 * The "You will be an exceptional fit if you also..." list. Optional, and
	 * genuinely optional in hiring too: nothing here should gate a candidate.
	 */
	bonus?: readonly string[];
	/** Only set once a real approved band exists. See the file header. */
	compensation?: string;
	/** One-line summary. Also the listing row's subtext and the page meta description. */
	description: string;
	/** Employment type shown on the chip, e.g. "Full-time". */
	employmentType: string;
	location: string;
	/** Free-form closing notes: timezone requirements, level, start date. */
	notes?: readonly string[];
	/**
	 * Label for the optional work-sample field on the application form. An
	 * engineer shows a repo, an editor shows a reel, so the field renames itself
	 * per role rather than asking everyone for a GitHub they may not have.
	 */
	portfolioLabel: string;
	/** The "You will be a perfect fit if you..." list. */
	requirements: readonly string[];
	/** The "In this role you will..." list. */
	responsibilities: readonly string[];
	slug: string;
	team: string;
	title: string;
}

export const CAREER_BENEFITS: readonly CareerBenefit[] = [
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
] as const;

/**
 * Why a candidate should want this, stated once. Every role page renders it, so
 * it is written to be true of the company rather than of any one team.
 */
export const WHY_EDGECOMS: readonly { body: string; title: string }[] = [
	{
		title: "A studio, not a single app",
		body: "We build a suite of Shopify apps aimed at one number: revenue per visitor. You will ship across products rather than maintain one forever.",
	},
	{
		title: "Small team, real ownership",
		body: "We are a small, global, fully remote team. You will own projects end to end without redundant meetings or standups, and your work reaches merchants in days rather than quarters.",
	},
	{
		title: "Merchants feel it immediately",
		body: "Everything we ship moves conversion, order value, or retention for a real store. The feedback loop is short and the impact is measurable.",
	},
];

export const ROLES: readonly Role[] = [
	{
		slug: "full-stack-software-engineer",
		title: "Full-Stack Software Engineer",
		team: "Engineering",
		employmentType: "Full-time",
		location: "Remote · Global",
		portfolioLabel: "GitHub",
		description:
			"Build and ship the Edge app suite end to end with TypeScript, React, and Shopify's platform APIs.",
		responsibilities: [
			"Design APIs, database schemas, background jobs, and queues to build powerful features across the Edge app suite.",
			"Take ownership of projects from conception all the way to shipping, keeping the code modular, typed, and maintainable.",
			"Work directly against Shopify's platform APIs, from app embeds and checkout extensions to billing and webhooks.",
			"Improve our infrastructure so it keeps up as merchant install counts and event volume grow.",
			"Turn merchant feedback into shipped product changes rather than backlog tickets.",
			"Use AI to improve internal tooling and workflows as we scale.",
		],
		requirements: [
			"Have 3+ years building production web applications at a fast-paced product company or startup.",
			"Are proficient in our stack: TypeScript, React, Next.js, Tailwind, tRPC, Drizzle, and PostgreSQL.",
			"Write strictly typed code by default and treat correctness as part of shipping, not a later pass.",
			"Can take a Figma design and turn it into pixel-accurate UI when the work calls for it.",
			"Are comfortable collaborating asynchronously in a fully remote, global team.",
		],
		bonus: [
			"Have built on the Shopify platform before, whether apps, themes, or checkout extensions.",
			"Take initiative and do not mind wearing a lot of hats. Even better if you have founded something yourself.",
			"Have worked on billing, payouts, or other systems where a wrong number is a real dispute.",
		],
		notes: [
			"This role is for engineers who are comfortable owning a product surface end to end.",
		],
	},
	{
		slug: "shopify-web-developer",
		title: "Shopify Web Developer",
		team: "Engineering",
		employmentType: "Full-time",
		location: "Remote · Global",
		portfolioLabel: "Portfolio or GitHub",
		description:
			"Own our marketing site and merchant-facing storefronts, from theme development to conversion-focused builds.",
		responsibilities: [
			"Own and extend the Edgecoms marketing site, from new product pages to the components behind them.",
			"Build and customize Shopify themes with Liquid, including sections, blocks, and app embeds.",
			"Turn design files into responsive, accessible, fast pages that hold up on real merchant traffic.",
			"Run page speed and Core Web Vitals work, then keep the wins from regressing.",
			"Partner with growth on landing pages and conversion tests, and ship the variants quickly.",
		],
		requirements: [
			"Have 2+ years building Shopify themes or storefronts in a professional setting.",
			"Are fluent in Liquid, HTML, modern CSS, and JavaScript, and comfortable in React and Next.js.",
			"Care about accessibility and semantic markup as much as visual fidelity.",
			"Can work from Figma to production without needing every state specified.",
			"Are comfortable collaborating asynchronously in a fully remote, global team.",
		],
		bonus: [
			"Have worked with Shopify Plus, checkout extensibility, or headless storefronts.",
			"Have run conversion rate experiments and can talk about what actually moved.",
		],
	},
	{
		slug: "motion-designer-video-editor",
		title: "Motion Designer & Video Editor",
		team: "Creative",
		employmentType: "Full-time",
		location: "Remote · Global",
		portfolioLabel: "Portfolio or reel",
		description:
			"Turn product stories into motion with ad creative, launch films, and social cutdowns that convert.",
		responsibilities: [
			"Concept, edit, and animate paid social creative across Meta, TikTok, and YouTube.",
			"Produce product launch films and feature demos that explain what an app does in seconds.",
			"Build motion systems and templates so we can ship variants quickly instead of rebuilding every time.",
			"Cut long-form footage down into short-form content for our own channels.",
			"Work with the media buying team on creative testing, and iterate on whatever the data says is working.",
		],
		requirements: [
			"Have 2+ years editing and animating for brands, agencies, or in-house creative teams.",
			"Are strong in After Effects and Premiere Pro, and comfortable in Figma.",
			"Have a reel that shows both storytelling and clean technical execution.",
			"Understand how ad creative works, including hooks, pacing, captions, and platform-native formats.",
			"Can manage your own pipeline and hit dates without being chased.",
		],
		bonus: [
			"Have edited direct response creative and know what a winning ad looks like before it runs.",
			"Can handle sound design, color, or 3D when a project needs it.",
		],
	},
	{
		slug: "performance-media-buyer",
		title: "Performance Media Buyer",
		team: "Growth",
		employmentType: "Full-time",
		location: "Remote · Global",
		portfolioLabel: "Portfolio or case studies",
		description:
			"Plan, launch, and scale paid acquisition across Meta, Google, and emerging channels against clear CAC targets.",
		responsibilities: [
			"Own day to day buying across Meta and Google, from structure and budgets to bids and audiences.",
			"Scale spend against CAC and payback targets rather than against impressions.",
			"Run a constant creative testing loop with the creative team and kill losers fast.",
			"Build and maintain the reporting that tells us what each channel is actually returning.",
			"Test new channels and formats, and tell us honestly when one is not worth the budget.",
		],
		requirements: [
			"Have 2+ years buying media with real budget responsibility and clear performance targets.",
			"Are fluent in Meta Ads Manager and Google Ads, including tracking, attribution, and conversion setup.",
			"Are comfortable in spreadsheets and analytics, and can defend a decision with the numbers behind it.",
			"Understand creative as the main lever in paid social, not an afterthought.",
			"Are comfortable collaborating asynchronously in a fully remote, global team.",
		],
		bonus: [
			"Have bought media for ecommerce, SaaS, or the Shopify app ecosystem.",
			"Have set up server-side tracking or worked through attribution after the iOS privacy changes.",
		],
	},
	{
		slug: "paid-advertising-manager",
		title: "Paid Advertising Manager",
		team: "Growth",
		employmentType: "Full-time",
		location: "Remote · Global",
		portfolioLabel: "Portfolio or case studies",
		description:
			"Own campaign strategy, creative testing, and reporting across the full paid portfolio.",
		responsibilities: [
			"Own the paid strategy across channels, including budget allocation and the testing roadmap.",
			"Brief the creative team and run a structured testing calendar rather than ad hoc requests.",
			"Report on performance to the wider team in a way that leads to decisions, not just dashboards.",
			"Work with the media buyer on account structure, targeting, and scaling decisions.",
			"Keep messaging consistent from the ad to the landing page to the app listing.",
		],
		requirements: [
			"Have 3+ years managing paid advertising programs, including budget ownership.",
			"Can move between strategy and execution, and are still comfortable inside the ad platforms.",
			"Have briefed creative teams and can articulate why an ad worked or did not.",
			"Are analytical about spend and can build a forecast you are willing to be held to.",
			"Are comfortable collaborating asynchronously in a fully remote, global team.",
		],
		bonus: [
			"Have run paid programs for ecommerce brands or B2B SaaS.",
			"Have managed lifecycle or retention campaigns alongside acquisition.",
		],
		notes: [
			"This role and the Performance Media Buyer role work as a pair: one owns strategy and reporting, the other owns day to day buying. Apply to whichever is closer to how you work.",
		],
	},
	{
		slug: "ecommerce-creator-influencer",
		title: "Ecommerce Creator & Influencer",
		team: "Marketing",
		employmentType: "Full-time",
		location: "Remote · Global",
		portfolioLabel: "Your channels or portfolio",
		description:
			"Be the face of Edgecoms across social and build an audience of Shopify operators through hands-on, founder-style content.",
		responsibilities: [
			"Be on camera as the face of Edgecoms across YouTube, TikTok, Instagram, and X.",
			"Build a content engine around ecommerce and Shopify operators, from teardowns to tactical breakdowns.",
			"Turn our products into content that teaches first and sells second.",
			"Grow and engage a community of merchants, and bring what they tell you back to the product team.",
			"Work with the creative team on production so you can stay focused on ideas and delivery.",
		],
		requirements: [
			"Have built an audience before, whether your own or for a brand, and can show the growth.",
			"Are genuinely comfortable on camera and can explain a technical idea simply.",
			"Know the ecommerce and Shopify world well enough to have opinions about it.",
			"Can write, shoot, and ship a piece of content without a full production team behind you.",
			"Are consistent, because this role is won on volume and reps over time.",
		],
		bonus: [
			"Have run a Shopify store yourself or worked closely with merchants.",
			"Have experience with short-form scripting, community building, or partnerships.",
		],
	},
	{
		slug: "marketing-intern",
		title: "Marketing Intern",
		team: "Marketing",
		employmentType: "Internship",
		location: "Remote · Global",
		portfolioLabel: "Portfolio or writing samples",
		description:
			"Support content, lifecycle, and campaign execution while learning how a Shopify app studio grows.",
		responsibilities: [
			"Support content production, from research and drafts to publishing and distribution.",
			"Help run email and lifecycle campaigns, including list work and copy support.",
			"Pull together performance reports so the team can see what is working.",
			"Research competitors, keywords, and the Shopify app ecosystem.",
			"Take on real owned projects, not just support tasks.",
		],
		requirements: [
			"Are studying marketing or a related field, or are early in your career and switching into it.",
			"Write clearly and can hold a consistent tone of voice.",
			"Are curious about ecommerce and willing to learn the Shopify ecosystem quickly.",
			"Are organized and responsive in an async, remote environment.",
		],
		notes: [
			"This is a paid internship with a defined term and the possibility of converting to a full-time role.",
		],
	},
	{
		slug: "social-media-intern",
		title: "Social Media Intern",
		team: "Marketing",
		employmentType: "Internship",
		location: "Remote · Global",
		portfolioLabel: "Your channels or portfolio",
		description:
			"Help run our channels day to day, from community and publishing to always-on short-form content.",
		responsibilities: [
			"Run the day to day publishing calendar across our social channels.",
			"Draft and edit short-form content, including hooks, captions, and cutdowns.",
			"Engage with the community in replies and DMs, and flag what merchants keep asking for.",
			"Track what performs and turn it into a short weekly readout.",
			"Watch the ecommerce corner of social and bring us the trends worth acting on.",
		],
		requirements: [
			"Live on social and understand what makes short-form content actually land.",
			"Can write in a brand voice without sounding like a brand account.",
			"Are comfortable with basic editing tools such as CapCut, Canva, or Figma.",
			"Are organized and responsive in an async, remote environment.",
		],
		notes: [
			"This is a paid internship with a defined term and the possibility of converting to a full-time role.",
		],
	},
	{
		slug: "customer-support-specialist",
		title: "Customer Support Specialist",
		team: "Customer Experience",
		employmentType: "Full-time",
		location: "Remote · Global",
		portfolioLabel: "Portfolio or personal website",
		description:
			"Be the first response for merchants using our apps. Troubleshoot issues, close the loop, and feed what you hear back into the product.",
		responsibilities: [
			"Be the first response for merchants across email and in-app chat, and own each conversation to resolution.",
			"Troubleshoot real issues inside Shopify stores, including theme conflicts, app settings, and billing questions.",
			"Write and maintain help documentation so the same question does not need answering twice.",
			"Escalate bugs to engineering with enough detail that they can be reproduced immediately.",
			"Turn recurring merchant complaints into product feedback the team can act on.",
		],
		requirements: [
			"Have 1+ years in customer support for a software or ecommerce product.",
			"Write clearly and calmly, especially when a merchant is frustrated and losing sales.",
			"Are technical enough to read a theme, follow a setting, and reproduce an issue yourself.",
			"Are organized about follow-ups, because the second reply matters more than the first.",
			"Are comfortable collaborating asynchronously in a fully remote, global team.",
		],
		bonus: [
			"Know the Shopify admin well, whether from support, agency, or merchant side.",
			"Have written help center content or built support macros before.",
		],
		notes: [
			"Support coverage is shared across timezones, so tell us where you are based and the hours that work for you.",
		],
	},
];

export function getRole(slug: string): Role | undefined {
	return ROLES.find((role) => role.slug === slug);
}

/** The listing page groups by team, in the order the teams first appear above. */
export function rolesByTeam(): readonly { roles: Role[]; team: string }[] {
	const groups: { roles: Role[]; team: string }[] = [];

	for (const role of ROLES) {
		const existing = groups.find((group) => group.team === role.team);

		if (existing) {
			existing.roles.push(role);
		} else {
			groups.push({ team: role.team, roles: [role] });
		}
	}

	return groups;
}
