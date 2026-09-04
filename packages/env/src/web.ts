import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	client: {
		/**
		 * Meta (Facebook) Pixel dataset id. Optional on purpose: local dev and
		 * preview deploys run without it and the pixel simply never loads, so
		 * nobody's clicking around a branch and polluting production ad data.
		 *
		 * Digits only -- a pixel id is numeric, and a pasted-in URL or a name
		 * fails the build here rather than silently sending events nowhere.
		 *
		 * NEXT_PUBLIC_, so the value is inlined into the client bundle at BUILD
		 * time. Changing it needs a rebuild, not just a restart.
		 */
		NEXT_PUBLIC_META_PIXEL_ID: z
			.string()
			.regex(/^\d+$/, "Meta pixel id must be digits only")
			.optional(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
