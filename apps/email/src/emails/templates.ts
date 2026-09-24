import { PARTNER_CONTACT_EMAIL } from "@edgecoms/mail/contact";
import type { Block, EmailBrand, EmailContent } from "@edgecoms/mail/render";

/**
 * EVERY EMAIL EDGE MAIL SENDS, as data for `@edgecoms/mail/render`.
 *
 * One layout for all six apps: an app changes only its wordmark, accent and
 * links. Copy rules, same as partner mail: no em dashes, no asking the reader
 * to reply (the sending domain receives no mail), and a button only where a
 * real link exists, never one that goes nowhere.
 */

export interface AppIdentity {
	appUrl: string | null;
	brandColor: string | null;
	name: string;
	reviewUrl: string | null;
	slug: string;
	supportUrl: string | null;
}

const EDGE_ORANGE = "#ff5e1f";

export function brandFor(app: AppIdentity, manageUrl?: string): EmailBrand {
	return {
		accent: app.brandColor ?? EDGE_ORANGE,
		// The app's own support page when it has one; the one inbox that is
		// read otherwise.
		contact: app.supportUrl ?? PARTNER_CONTACT_EMAIL,
		footer: `${app.name} by Edge, edgecoms.app`,
		manageUrl,
		name: app.name,
	};
}

function action(label: string, url: string | null): Block[] {
	return url ? [{ kind: "button", label, url }] : [];
}

export const LIFECYCLE_TEMPLATES = [
	"welcome",
	"setup-reminder",
	"activation",
	"uninstall",
	"review-request",
] as const;

export type LifecycleTemplate = (typeof LIFECYCLE_TEMPLATES)[number];

/** What starts each one in Resend. Shown on the Automations page. */
export const LIFECYCLE_TRIGGERS: Record<LifecycleTemplate, string> = {
	welcome: "app.installed",
	"setup-reminder": "app.installed, then no setup.completed within 24 hours",
	activation: "app.activated",
	uninstall: "app.uninstalled",
	"review-request": "milestone.first_value",
};

export const LIFECYCLE_NAMES: Record<LifecycleTemplate, string> = {
	welcome: "Welcome",
	"setup-reminder": "Setup reminder",
	activation: "Activation",
	uninstall: "Uninstall feedback",
	"review-request": "Review request",
};

export function lifecycleContent(
	template: LifecycleTemplate,
	app: AppIdentity
): EmailContent {
	const name = app.name;
	switch (template) {
		case "welcome":
			return {
				subject: `Welcome to ${name}`,
				preheader: `A few minutes of setup and ${name} is live on your store.`,
				heading: `Welcome to ${name}`,
				blocks: [
					{
						kind: "paragraph",
						text: `Thanks for installing ${name}. Finish setup and it goes live on your store. Nothing changes for your customers until you turn it on.`,
					},
					...action("Finish setup", app.appUrl),
					{
						kind: "small",
						text: `You are getting this because ${name} was installed on your Shopify store.`,
					},
				],
			};
		case "setup-reminder":
			return {
				subject: `Finish setting up ${name}`,
				preheader: "Setup takes a few minutes.",
				heading: "Your setup is almost done",
				blocks: [
					{
						kind: "paragraph",
						text: `${name} is installed but not live yet. Setup takes a few minutes, and nothing changes on your store until you turn it on.`,
					},
					...action("Finish setup", app.appUrl),
					{
						kind: "paragraph",
						text: "Stuck on a step? Our team can set it up with you.",
					},
					...action("Get setup help", app.supportUrl),
				],
			};
		case "activation":
			return {
				subject: `${name} is live on your store`,
				preheader: "Here is what to do next.",
				heading: `${name} is live`,
				blocks: [
					{
						kind: "paragraph",
						text: `Your store is now running ${name}. The next step is tuning it to your catalog, which is where most of the lift comes from.`,
					},
					...action(`Open ${name}`, app.appUrl),
				],
			};
		case "uninstall":
			return {
				subject: `You removed ${name}`,
				preheader: "One question, if you have a minute.",
				heading: "Sorry to see you go",
				blocks: [
					{
						kind: "paragraph",
						text: `Thanks for trying ${name}. If something got in the way, we would like to know what it was. It is the fastest way for us to fix it.`,
					},
					...action("Tell us what happened", app.supportUrl),
				],
			};
		case "review-request":
			return {
				subject: `How is ${name} working for you?`,
				preheader: "A short review helps other merchants find it.",
				heading: `Enjoying ${name}?`,
				blocks: [
					{
						kind: "paragraph",
						text: `A short review on the Shopify App Store helps other merchants find ${name}, and tells us what to build next.`,
					},
					...action("Leave a review", app.reviewUrl),
				],
			};
		default: {
			const unknown: never = template;
			throw new Error(`Unknown template: ${String(unknown)}`);
		}
	}
}

/** The structured fields a campaign is written in. No free HTML, ever. */
export interface CampaignCopy {
	body: string;
	ctaLabel: string | null;
	ctaUrl: string | null;
	eyebrow: string | null;
	headline: string;
	preheader: string;
	subject: string;
}

const PARAGRAPH_BREAK = /\n\s*\n/;

/** A campaign as email content. Blank lines in the body start new paragraphs. */
export function campaignContent(copy: CampaignCopy): EmailContent {
	const paragraphs = copy.body
		.split(PARAGRAPH_BREAK)
		.map((text) => text.trim())
		.filter((text) => text !== "");
	const cta =
		copy.ctaLabel && copy.ctaUrl ? action(copy.ctaLabel, copy.ctaUrl) : [];
	return {
		subject: copy.subject,
		preheader: copy.preheader,
		eyebrow: copy.eyebrow ?? undefined,
		heading: copy.headline,
		blocks: [
			...paragraphs.map((text): Block => ({ kind: "paragraph", text })),
			...cta,
		],
	};
}
