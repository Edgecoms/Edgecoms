import type { Route } from "next";
import { permanentRedirect } from "next/navigation";

/**
 * "Start here" was folded into the dashboard, which is now the only partner
 * home there is.
 *
 * This route stays because it was PUBLISHED: every approval email sent so far
 * links here, and those links have to keep working for as long as the mail
 * sits in somebody's inbox. A permanent redirect is the cheapest way to honour
 * that without keeping a second screen alive.
 */
export default function PartnerWelcomeRedirect(): never {
	permanentRedirect("/partner" as Route);
}
