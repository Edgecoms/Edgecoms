import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const PAYMENT_LINK_ERROR = "Payment link must be an https:// URL";

/**
 * A link a buyer pays through. https only: this value becomes an `href` on a
 * "Get Pro" button, so a typo or a pasted-in note fails the build here rather
 * than shipping a button that goes nowhere.
 *
 * Nothing here knows or checks which payment provider the link belongs to.
 * Changing provider is a change of value, never of code.
 *
 * The second check is for `https:/example.com/...` and `https:example.com/...`.
 * Both parse as URLs, and a browser resolves both against the current page, so
 * the button would open a 404 on this site instead of the payment page.
 */
const paymentLink = z
	.url({ protocol: /^https$/, error: PAYMENT_LINK_ERROR })
	.regex(/^https:\/\/[^/\s]/i, PAYMENT_LINK_ERROR)
	.optional();

/**
 * A Meta dataset ("pixel") id. Digits only -- a pixel id is numeric, and a
 * pasted-in URL or a name fails the build here rather than silently sending
 * events nowhere.
 */
const pixelId = z
	.string()
	.regex(/^\d+$/, "Meta pixel id must be digits only")
	.optional();

export const env = createEnv({
	client: {
		/**
		 * Store Setup (`/store-setup`): the two payment links and the WhatsApp
		 * number behind its buttons. All three are optional, and a missing one
		 * renders its button disabled instead of as a dead link, so local dev
		 * runs without them.
		 *
		 * NEXT_PUBLIC_, so each is inlined at BUILD time, like the pixel ids below.
		 */
		NEXT_PUBLIC_STORE_SETUP_PRO_PAY_URL: paymentLink,
		NEXT_PUBLIC_STORE_SETUP_BASIC_PAY_URL: paymentLink,
		/**
		 * Digits only, country code first, no `+` — the form `wa.me` expects
		 * (919800000000, not +91 98000 00000).
		 */
		NEXT_PUBLIC_STORE_SETUP_WHATSAPP: z
			.string()
			.regex(
				/^\d{7,15}$/,
				"WhatsApp number must be digits only, country code first"
			)
			.optional(),
		/**
		 * The site's Meta (Facebook) Pixel. Optional on purpose: local dev and
		 * preview deploys run without it and the pixel simply never loads, so
		 * nobody's clicking around a branch and polluting production ad data.
		 *
		 * NEXT_PUBLIC_, so the value is inlined into the client bundle at BUILD
		 * time. Changing it needs a rebuild, not just a restart.
		 */
		NEXT_PUBLIC_META_PIXEL_ID: pixelId,
		/**
		 * The Edgecoms Academy pixel: a second, separate dataset that hears from
		 * `/store-setup` and from nowhere else. Optional for the same reason as
		 * the site pixel, and set in production only.
		 */
		NEXT_PUBLIC_META_ACADEMY_PIXEL_ID: pixelId,
	},
	runtimeEnv: {
		NEXT_PUBLIC_STORE_SETUP_PRO_PAY_URL:
			process.env.NEXT_PUBLIC_STORE_SETUP_PRO_PAY_URL,
		NEXT_PUBLIC_STORE_SETUP_BASIC_PAY_URL:
			process.env.NEXT_PUBLIC_STORE_SETUP_BASIC_PAY_URL,
		NEXT_PUBLIC_STORE_SETUP_WHATSAPP:
			process.env.NEXT_PUBLIC_STORE_SETUP_WHATSAPP,
		NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
		NEXT_PUBLIC_META_ACADEMY_PIXEL_ID:
			process.env.NEXT_PUBLIC_META_ACADEMY_PIXEL_ID,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});

/**
 * Two pairs of values that are each valid alone and wrong together. Neither
 * mistake is visible downstream, so both are refused here, at build time,
 * where somebody will see it.
 *
 * - **The two pixel ids.** The pixels are kept apart by id: every event names
 *   the one dataset it is for. Give both the same id and that separation is
 *   gone -- Store Setup clicks would land in the site dataset as `Lead`, which
 *   is the event the Edge apps campaigns optimise on.
 * - **The two payment links.** With one link behind both buttons, "Get Basic"
 *   would open the Pro payment page and charge the Pro price.
 */
if (
	env.NEXT_PUBLIC_META_ACADEMY_PIXEL_ID &&
	env.NEXT_PUBLIC_META_ACADEMY_PIXEL_ID === env.NEXT_PUBLIC_META_PIXEL_ID
) {
	throw new Error(
		"NEXT_PUBLIC_META_ACADEMY_PIXEL_ID must not be the same id as NEXT_PUBLIC_META_PIXEL_ID"
	);
}

if (
	env.NEXT_PUBLIC_STORE_SETUP_PRO_PAY_URL &&
	env.NEXT_PUBLIC_STORE_SETUP_PRO_PAY_URL ===
		env.NEXT_PUBLIC_STORE_SETUP_BASIC_PAY_URL
) {
	throw new Error(
		"NEXT_PUBLIC_STORE_SETUP_PRO_PAY_URL and NEXT_PUBLIC_STORE_SETUP_BASIC_PAY_URL must be different links"
	);
}
