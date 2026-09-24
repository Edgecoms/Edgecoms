/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { PARTNER_CONTACT_EMAIL } from "@edgecoms/mail/contact";
import { renderHtml, renderText } from "@edgecoms/mail/render";
import {
	type AppIdentity,
	brandFor,
	campaignContent,
	LIFECYCLE_TEMPLATES,
	lifecycleContent,
} from "../templates";

const EM_DASH = "—";

const unconfigured: AppIdentity = {
	appUrl: null,
	brandColor: null,
	name: "Edge Cart",
	reviewUrl: null,
	slug: "edge-cart",
	supportUrl: null,
};

const configured: AppIdentity = {
	appUrl: "https://admin.shopify.com/apps/edge-cart",
	brandColor: "#2255ff",
	name: "Edge Cart",
	reviewUrl: "https://apps.shopify.com/edge-cart#reviews",
	slug: "edge-cart",
	supportUrl: "https://edgecoms.app/support",
};

describe("lifecycle templates", () => {
	test("never show a button that goes nowhere", () => {
		for (const template of LIFECYCLE_TEMPLATES) {
			const content = lifecycleContent(template, unconfigured);
			expect(content.blocks.some((block) => block.kind === "button")).toBe(
				false
			);
		}
	});

	test("each has its action once the app is configured", () => {
		for (const template of LIFECYCLE_TEMPLATES) {
			const content = lifecycleContent(template, configured);
			expect(content.blocks.some((block) => block.kind === "button")).toBe(
				true
			);
		}
	});

	test("name the app and follow the house copy rules", () => {
		for (const template of LIFECYCLE_TEMPLATES) {
			const content = lifecycleContent(template, configured);
			const html = renderHtml(content, brandFor(configured));
			const text = renderText(content, brandFor(configured));
			expect(html).toContain("Edge Cart");
			expect(html).not.toContain(EM_DASH);
			expect(text).not.toContain(EM_DASH);
			expect(text.toLowerCase()).not.toContain("reply to this");
		}
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

	test("splits the body into paragraphs and ends with the call to action", () => {
		const content = campaignContent(copy);
		expect(content.eyebrow).toBe("New feature");
		expect(content.blocks).toEqual([
			{ kind: "paragraph", text: "First paragraph." },
			{ kind: "paragraph", text: "Second paragraph." },
			{ kind: "button", label: "Try it", url: "https://edgecoms.app/x" },
		]);
	});

	test("has no button without both a label and a link", () => {
		const content = campaignContent({ ...copy, ctaUrl: null });
		expect(content.blocks.some((block) => block.kind === "button")).toBe(false);
	});
});
