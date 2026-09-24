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

/**
 * Fields use the shared `Input` (and `Textarea`); on this grey page their
 * translucent fill reads as grey, so they are white here.
 */
export const FIELD = "bg-white";

/** The shared SelectTrigger, full width and white like the inputs beside it. */
export const TRIGGER = "w-full bg-white";

/** The campaign types as Select items: `items` lets the trigger show the label. */
export const TYPE_ITEMS = CAMPAIGN_TYPES.map(([value, label]) => ({
	label,
	value,
}));

/** The shared Textarea, shaped like Input and set in mono for pasted HTML. */
export const CODE_AREA =
	"min-h-72 rounded-lg bg-white font-mono text-[12px] leading-relaxed focus-visible:ring-3";
