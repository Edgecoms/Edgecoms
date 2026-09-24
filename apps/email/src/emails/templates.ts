import { PARTNER_CONTACT_EMAIL } from "@edgecoms/mail/contact";
import type { Block, EmailBrand, EmailContent } from "@edgecoms/mail/render";

/**
 * EVERY EMAIL EDGE MAIL SENDS, as data for the minimal layout
 * (`@edgecoms/mail/minimal`).
 *
 * Copy rules, same as partner mail: no em dashes, never ask the reader to
 * reply (the sending domain receives no mail), one clear action per email,
 * and a button only where a real link exists.
 *
 * Each lifecycle email speaks about what THAT app does, from the positioning
 * in the marketing catalog (apps/web/src/lib/products.ts), so a merchant who
 * installed Edge Timer reads about deadlines, not about "growth".
 */

export interface AppIdentity {
	appUrl: string | null;
	brandColor: string | null;
	/** An https PNG. Defaults to the icon Edge Mail hosts (see apps/identity). */
	logoUrl: string | null;
	name: string;
	reviewUrl: string | null;
	slug: string;
	supportUrl: string | null;
}

/** How an app is talked about in its lifecycle email. */
interface AppVoice {
	/** Completes "It ...": what the app does for the store. */
	does: string;
	/** The first thing to set up, completing "The first step is to ...". */
	firstStep: string;
	/** One high-leverage move once it is live, as a full sentence. */
	tip: string;
}

const VOICES: Record<string, AppVoice> = {
	"edge-bundles": {
		does: "turns single-item orders into two or three, with mix-and-match sets and volume tiers that show the saving as it grows",
		firstStep: "build your first bundle around a best-seller",
		tip: "Pair the products your customers already buy together. Those bundles need the least convincing.",
	},
	"edge-cart": {
		does: "turns your cart from a place where orders wait into the last, best offer a shopper sees before checkout",
		firstStep: "switch on the cart drawer and add one upsell to it",
		tip: "Add a free-shipping progress bar. Shoppers top up their cart to reach it, which lifts order value without a discount.",
	},
	"edge-currency": {
		does: "shows international shoppers prices in their own currency, rounded so every number looks like a price you set",
		firstStep: "choose your markets and turn on automatic currency detection",
		tip: "Switch on price rounding, so 47.83 becomes 48. A round number reads like a decision, not a conversion.",
	},
	"edge-reviews": {
		does: "collects reviews from real buyers and shows them at the moment of doubt, not at the bottom of the page",
		firstStep:
			"turn on review requests, so every order asks for a review once it arrives",
		tip: "Ask for photos. A review with a photo of the product in someone's hands convinces more than any star rating.",
	},
	"edge-subscriptions": {
		does: "turns one-time buyers into subscribers, so the customer you already paid to acquire keeps buying",
		firstStep:
			"add a subscribe-and-save option to the product your customers reorder most",
		tip: "Let subscribers skip or swap a delivery instead of cancelling. A skip button keeps customers a cancel button would lose.",
	},
	"edge-timer": {
		does: "puts a real deadline where the buying decision happens, so “I'll come back later” becomes now",
		firstStep: "add a countdown to your best-selling product page",
		tip: "Tie every timer to something real, like a sale ending or a dispatch cutoff. Shoppers act on a deadline they believe.",
	},
};

const DEFAULT_VOICE: AppVoice = {
	does: "helps your store turn more visitors into customers",
	firstStep: "open the app and finish setup",
	tip: "Start with one change, watch it for a week, then build on what works.",
};

function voiceOf(app: AppIdentity): AppVoice {
	return VOICES[app.slug] ?? DEFAULT_VOICE;
}

/**
 * Resend fills these per recipient. Each template declares them with a
 * fallback, and each automation's Send Email step maps them from the event
 * payload Edge Mail sends (see the Automations page).
 */
export const TEMPLATE_VARIABLES = {
	greetingName: "{{{GREETING_NAME}}}",
	preferencesUrl: "{{{PREFERENCES_URL}}}",
} as const;

/** Declared on every lifecycle template, and where each is filled from. */
export const LIFECYCLE_VARIABLES = [
	{ fallback: "there", from: "event.first_name", key: "GREETING_NAME" },
	{ fallback: null, from: "event.preferences_url", key: "PREFERENCES_URL" },
] as const;

const EDGE_ORANGE = "#ff5e1f";

export function brandFor(app: AppIdentity, manageUrl?: string): EmailBrand {
	return {
		accent: app.brandColor ?? EDGE_ORANGE,
		// The app's own support page when it has one; the one inbox that is
		// read otherwise.
		contact: app.supportUrl ?? PARTNER_CONTACT_EMAIL,
		footer: `${app.name} by Edge, edgecoms.app`,
		logoUrl: app.logoUrl ?? undefined,
		manageUrl,
		name: app.name,
	};
}

function button(label: string, url: string | null): Block[] {
	return url ? [{ kind: "button", label, url }] : [];
}

function link(label: string, url: string | null): Block[] {
	return url ? [{ kind: "link", label, url }] : [];
}

function paragraph(text: string): Block {
	return { kind: "paragraph", text };
}

const GREETING = paragraph(`Hi ${TEMPLATE_VARIABLES.greetingName},`);

function signOff(closing: string, app: AppIdentity): Block {
	return paragraph(`${closing},\nThe ${app.name} team`);
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

function welcome(app: AppIdentity, voice: AppVoice): EmailContent {
	return {
		subject: `Welcome to ${app.name}`,
		preheader: `Your first step: ${voice.firstStep}.`,
		heading: `Welcome to ${app.name}`,
		blocks: [
			GREETING,
			paragraph(`Thanks for installing ${app.name}. It ${voice.does}.`),
			paragraph(
				`Getting started takes a few minutes. The first step is to ${voice.firstStep}. Nothing changes for your customers until you switch it on, so feel free to look around first.`
			),
			...button("Finish setup →", app.appUrl),
			paragraph("We're glad you're here."),
			signOff("Warmly", app),
		],
	};
}

function setupReminder(app: AppIdentity, voice: AppVoice): EmailContent {
	return {
		subject: `Finish setting up ${app.name}`,
		preheader: "It's installed, but it isn't working for your store yet.",
		heading: "You're one step away",
		blocks: [
			GREETING,
			paragraph(
				`You installed ${app.name}, but it isn't switched on yet, so it isn't doing anything for your store.`
			),
			paragraph(
				`The quickest win is to ${voice.firstStep}. It takes a few minutes.`
			),
			...button("Finish setup →", app.appUrl),
			paragraph("Stuck on a step? Our team can walk through it with you."),
			...link("Get setup help", app.supportUrl),
			signOff("Cheers", app),
		],
	};
}

function activation(app: AppIdentity, voice: AppVoice): EmailContent {
	return {
		subject: `${app.name} is live on your store`,
		preheader: "One thing worth doing this week.",
		heading: "You're live",
		blocks: [
			GREETING,
			paragraph(`${app.name} is now running on your store. Nice work.`),
			paragraph(
				"The first week is where most of the gains come from. One thing worth doing now:"
			),
			paragraph(voice.tip),
			...button(`Open ${app.name} →`, app.appUrl),
			paragraph("We'll check in once you start seeing results."),
			signOff("Cheers", app),
		],
	};
}

function uninstall(app: AppIdentity): EmailContent {
	return {
		subject: `Sorry to see ${app.name} go`,
		preheader: "One question, if you have a minute.",
		heading: "Before you go",
		blocks: [
			GREETING,
			paragraph(
				`You removed ${app.name} from your store. Thanks for giving it a try.`
			),
			paragraph(
				"If something got in the way, we'd really like to know what it was. Too expensive, something broken, hard to set up, a missing feature, or just not the right time: any answer helps us fix it for the next store."
			),
			...button("Tell us what happened →", app.supportUrl),
			paragraph(
				`If you change your mind, you can reinstall ${app.name} any time from the Shopify App Store.`
			),
			signOff("Thanks again", app),
		],
	};
}

function reviewRequest(app: AppIdentity): EmailContent {
	return {
		subject: `Is ${app.name} working for you?`,
		preheader: "A short review helps other merchants find it.",
		heading: `${app.name} is paying off`,
		blocks: [
			GREETING,
			paragraph(
				`${app.name} just reached its first real result on your store. That's the moment we build for.`
			),
			paragraph(
				`If it's been useful, a short review on the Shopify App Store would mean a lot. It helps other merchants find ${app.name}, and it tells us what to build next.`
			),
			...button("Leave a review →", app.reviewUrl),
			paragraph("A couple of sentences is plenty."),
			signOff("Thank you", app),
		],
	};
}

export function lifecycleContent(
	template: LifecycleTemplate,
	app: AppIdentity
): EmailContent {
	const voice = voiceOf(app);
	switch (template) {
		case "welcome":
			return welcome(app, voice);
		case "setup-reminder":
			return setupReminder(app, voice);
		case "activation":
			return activation(app, voice);
		case "uninstall":
			return uninstall(app);
		case "review-request":
			return reviewRequest(app);
		default: {
			const unknown: never = template;
			throw new Error(`Unknown template: ${String(unknown)}`);
		}
	}
}

/**
 * A lifecycle email as the admin previews it: the variables Resend would fill
 * are filled with their fallbacks.
 */
export function previewVariables(html: string): string {
	return html
		.replaceAll(TEMPLATE_VARIABLES.greetingName, "there")
		.replaceAll(TEMPLATE_VARIABLES.preferencesUrl, "#");
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

/**
 * A campaign as email content: the body (a blank line starts a paragraph),
 * the button, then "The <app> team", so a campaign signs off like every
 * lifecycle email does.
 */
export function campaignContent(
	copy: CampaignCopy,
	appName?: string
): EmailContent {
	const paragraphs = copy.body
		.split(PARAGRAPH_BREAK)
		.map((text) => text.trim())
		.filter((text) => text !== "");
	const cta =
		copy.ctaLabel && copy.ctaUrl ? button(copy.ctaLabel, copy.ctaUrl) : [];
	return {
		subject: copy.subject,
		preheader: copy.preheader,
		eyebrow: copy.eyebrow ?? undefined,
		heading: copy.headline,
		blocks: [
			...paragraphs.map(paragraph),
			...cta,
			...(appName ? [paragraph(`The ${appName} team`)] : []),
		],
	};
}
