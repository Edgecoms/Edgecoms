import type { MailAudience } from "@edgecoms/db/schema/mail";

export const CAMPAIGN_TYPES = [
	["product_update", "Product update"],
	["announcement", "Announcement"],
	["education", "Education"],
	["marketing", "Marketing"],
	["discount", "Discount"],
	["cross_sell", "Cross-sell"],
	["winback", "Winback"],
] as const;

export type CampaignType = (typeof CAMPAIGN_TYPES)[number][0];

/** Mirrors the server's CATEGORY_FOR_TYPE, for the label only; the server decides. */
export const CATEGORY_LABEL: Record<CampaignType, string> = {
	announcement: "Product updates",
	cross_sell: "Marketing",
	discount: "Marketing",
	education: "Education",
	marketing: "Marketing",
	product_update: "Product updates",
	winback: "Marketing",
};

export interface CampaignForm {
	appId: string;
	audience: MailAudience;
	/** The whole email, pasted. */
	html: string;
	name: string;
	preheader: string;
	subject: string;
	type: CampaignType;
}

export const EMPTY_FORM: CampaignForm = {
	appId: "",
	audience: {},
	html: "",
	name: "",
	preheader: "",
	subject: "",
	type: "product_update",
};

export const FIELD =
	"h-9 w-full rounded-lg border border-border bg-white px-3 text-body-sm text-primary-foreground";
export const CODE_AREA =
	"min-h-72 w-full rounded-lg border border-border bg-white px-3 py-2 font-mono text-[12px] text-primary-foreground leading-relaxed";
