/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PARTNER_CONTACT_EMAIL } from "@edgecoms/mail/contact";
import { renderMinimalHtml } from "@edgecoms/mail/minimal";
import { renderText } from "@edgecoms/mail/render";
import { hostedIconUrl } from "../../server/apps/identity";
import {
	type AppIdentity,
	brandFor,
	campaignContent,
	LIFECYCLE_TEMPLATES,
	lifecycleContent,
	previewVariables,
	TEMPLATE_VARIABLES,
} from "../templates";

process.env.EDGE_MAIL_URL = "https://email.edgecoms.app";

const EM_DASH = "—";
const SIX_APPS = [
	"edge-cart",
	"edge-bundles",
	"edge-subscriptions",
	"edge-timer",
	"edge-reviews",
	"edge-currency",
];

const unconfigured: AppIdentity = {
	appUrl: null,
	brandColor: null,
	logoUrl: null,
	name: "Edge Cart",
	reviewUrl: null,
	slug: "edge-cart",
	supportUrl: null,
};

const configured: AppIdentity = {
	appUrl: "https://admin.shopify.com/apps/edge-cart",
	brandColor: "#2255ff",
	logoUrl: "https://email.edgecoms.app/app-icons/edge-cart.png",
	name: "Edge Cart",
	reviewUrl: "https://apps.shopify.com/edge-cart#reviews",
	slug: "edge-cart",
	supportUrl: "https://edgecoms.app/support",
};

function actions(
	template: (typeof LIFECYCLE_TEMPLATES)[number],
	app: AppIdentity
) {
	return lifecycleContent(template, app).blocks.filter(
		(block) => block.kind === "button" || block.kind === "link"
	);
}

describe("lifecycle templates", () => {
	test("never show a button or link that goes nowhere", () => {
		for (const template of LIFECYCLE_TEMPLATES) {
			expect(actions(template, unconfigured)).toHaveLength(0);
		}
	});

	test("each has exactly one button once the app is configured", () => {
		for (const template of LIFECYCLE_TEMPLATES) {
			const buttons = lifecycleContent(template, configured).blocks.filter(
				(block) => block.kind === "button"
			);
			expect(buttons).toHaveLength(1);
		}
	});

	test("greet by name through Resend, and follow the house copy rules", () => {
		const brand = brandFor(configured, TEMPLATE_VARIABLES.preferencesUrl);
		for (const template of LIFECYCLE_TEMPLATES) {
			const content = lifecycleContent(template, configured);
			const html = renderMinimalHtml(content, brand);
			const text = renderText(content, brand);
			expect(html).toContain("Hi {{{GREETING_NAME}}},");
			expect(html).toContain('href="{{{PREFERENCES_URL}}}"');
			expect(html).toContain("The Edge Cart team");
			for (const part of [html, text, content.subject, content.preheader]) {
				expect(part).not.toContain(EM_DASH);
				expect(part.toLowerCase()).not.toContain("reply to this");
			}
		}
	});

	test("every one of the six apps speaks in its own voice", () => {
		const welcomes = SIX_APPS.map((slug) =>
			renderText(lifecycleContent("welcome", { ...configured, slug }))
		);
		for (const text of welcomes) {
			expect(text).not.toContain("turn more visitors into customers");
		}
		expect(new Set(welcomes).size).toBe(SIX_APPS.length);
	});

	test("the preview fills the placeholders", () => {
		const html = previewVariables(
			renderMinimalHtml(
				lifecycleContent("welcome", configured),
				brandFor(configured, TEMPLATE_VARIABLES.preferencesUrl)
			)
		);
		expect(html).toContain("Hi there,");
		expect(html).not.toContain("{{{");
	});
});

describe("app icon", () => {
	test("the header shows the app's icon, and the name when there is none", () => {
		const content = lifecycleContent("welcome", configured);
		expect(renderMinimalHtml(content, brandFor(configured))).toContain(
			'<img src="https://email.edgecoms.app/app-icons/edge-cart.png" width="48" height="48" alt="Edge Cart"'
		);
		const plain = renderMinimalHtml(content, brandFor(unconfigured));
		expect(plain).not.toContain("<img");
		expect(plain).toContain("Edge<br>Cart");
	});

	test("every hosted icon exists as a real PNG, so no email links a missing image", () => {
		const PNG = [0x89, 0x50, 0x4e, 0x47];
		for (const slug of SIX_APPS) {
			const url = hostedIconUrl(slug);
			expect(url).toBe(`https://email.edgecoms.app/app-icons/${slug}.png`);
			const file = join(
				import.meta.dir,
				"../../../public/app-icons",
				`${slug}.png`
			);
			expect([...readFileSync(file).subarray(0, 4)]).toEqual(PNG);
		}
		expect(hostedIconUrl("not-an-app")).toBeNull();
	});
});

describe("brand", () => {
	test("falls back to the read inbox when the app has no support page", () => {
		expect(brandFor(unconfigured).contact).toBe(PARTNER_CONTACT_EMAIL);
		expect(brandFor(configured).contact).toBe("https://edgecoms.app/support");
	});
});

describe("campaign content", () => {
	const copy = {
		body: "First paragraph.\n\nSecond paragraph.\n\n\n",
		ctaLabel: "Try it",
		ctaUrl: "https://edgecoms.app/x",
		eyebrow: "New feature",
		headline: "Smart Upsells are here",
		preheader: "p",
		subject: "s",
	};

	test("body, then the button, then the app's sign-off", () => {
		const content = campaignContent(copy, "Edge Cart");
		expect(content.eyebrow).toBe("New feature");
		expect(content.blocks).toEqual([
			{ kind: "paragraph", text: "First paragraph." },
			{ kind: "paragraph", text: "Second paragraph." },
			{ kind: "button", label: "Try it", url: "https://edgecoms.app/x" },
			{ kind: "paragraph", text: "The Edge Cart team" },
		]);
	});

	test("has no button without both a label and a link", () => {
		const content = campaignContent({ ...copy, ctaUrl: null });
		expect(content.blocks.some((block) => block.kind === "button")).toBe(false);
	});
});
