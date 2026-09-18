import {
	classifyUserAgent,
	hashIp,
	recordClick,
} from "@edgecoms/api/referrals/clicks";
import { normalizeSubId, resolveReferral } from "@edgecoms/api/referrals/links";
import { db } from "@edgecoms/db";
import { env } from "@edgecoms/env/server";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { EDGE_PRODUCTS, getProduct } from "@/lib/products";
import { ClaimForm } from "./claim-form";
import { appStoreUrlFor, PRODUCTS_PATH, withUtms } from "./shared";

/**
 * `/r/<code or slug>[/<app>]` — a partner's referral landing page.
 *
 * One job: turn a click into a claim. The merchant sees who referred them and
 * types their store address, which is the only durable link between this click
 * and an install that happens minutes later inside Shopify's own App Store.
 *
 * The click is recorded on render (see @edgecoms/api/referrals/clicks). The
 * claim is written by the form action. Neither binds a store: an attribution
 * happens at install time, and only when the store has no partner already.
 *
 * An address that resolves to nothing records no click and sends the visitor to
 * the product pages.
 */

export const dynamic = "force-dynamic";

/** A referral page is for one merchant, not for search engines. */
export const metadata: Metadata = {
	robots: { follow: false, index: false },
	title: "You have been referred to Edge",
};

function clientIp(headerBag: Headers): string | null {
	const forwarded = headerBag.get("x-forwarded-for");
	if (forwarded) {
		return forwarded.split(",")[0]?.trim() ?? null;
	}
	return headerBag.get("x-real-ip");
}

interface PageProps {
	params: Promise<{ ref: string[] }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(value: string | string[] | undefined): string | null {
	const found = Array.isArray(value) ? value[0] : value;
	return found ? found : null;
}

export default async function ReferralPage({
	params,
	searchParams,
}: PageProps) {
	const [{ ref }, query, headerBag] = await Promise.all([
		params,
		searchParams,
		headers(),
	]);

	const named = ref[1] ? getProduct(ref[1]) : undefined;
	const subId = normalizeSubId(first(query.s) ?? "");
	const resolved = await resolveReferral(db, {
		appSlug: named?.slug ?? null,
		ref: ref[0] ?? "",
		subId,
	});

	if (!resolved) {
		redirect(PRODUCTS_PATH);
	}

	const facts = classifyUserAgent(headerBag.get("user-agent"));
	const click = await recordClick(db, {
		appSlug: resolved.appSlug,
		country:
			headerBag.get("x-vercel-ip-country") ?? headerBag.get("cf-ipcountry"),
		deviceType: facts.deviceType,
		ipHash: hashIp(
			clientIp(headerBag),
			env.REFERRAL_IP_SALT ?? env.BETTER_AUTH_SECRET ?? null
		),
		isBot: facts.isBot,
		linkId: resolved.link?.id ?? null,
		partnerId: resolved.partnerId,
		referrer: headerBag.get("referer"),
		subId: resolved.subId,
		userAgent: headerBag.get("user-agent"),
		utmCampaign: first(query.utm_campaign),
		utmContent: first(query.utm_content),
		utmMedium: first(query.utm_medium),
		utmSource: first(query.utm_source),
		utmTerm: first(query.utm_term),
	});

	const app = resolved.appSlug ? getProduct(resolved.appSlug) : undefined;
	const skipUrl = withUtms(
		appStoreUrlFor(resolved.appSlug),
		resolved.code,
		resolved.subId ?? resolved.appSlug ?? "all-apps"
	);

	return (
		<main className="flex min-h-svh flex-col items-center justify-center bg-bg px-6 py-12">
			<div className="flex w-full max-w-md flex-col gap-8">
				<div className="flex flex-col gap-3">
					<span className="font-medium font-mono text-[11px] text-secondary-foreground uppercase tracking-[0.1em]">
						Edge Partners
					</span>
					<h1 className="font-medium text-h2 text-primary-foreground tracking-tight">
						{resolved.partnerName} recommends {app ? app.name : "Edge"}
					</h1>
					<p className="text-body text-secondary-foreground">
						{app
							? app.tagline
							: "Seven Shopify apps for average order value, conversion and retention, from one team."}
					</p>
				</div>

				{app ? null : (
					<ul className="grid grid-cols-2 gap-x-4 gap-y-2">
						{EDGE_PRODUCTS.filter((product) => product.live).map((product) => (
							<li
								className="text-body-sm text-secondary-foreground"
								key={product.slug}
							>
								{product.name}
							</li>
						))}
					</ul>
				)}

				<div className="rounded-xl border border-border-strong bg-surface p-5 shadow-sm">
					<ClaimForm
						appSlug={resolved.appSlug}
						clickId={click.clickId}
						partnerName={resolved.partnerName}
						refPath={ref[0] ?? ""}
						subId={resolved.subId}
					/>
				</div>

				<a
					className="w-fit text-caption text-secondary-foreground underline underline-offset-4"
					href={skipUrl}
					rel="noopener"
				>
					Skip, just take me to the app
				</a>
			</div>
		</main>
	);
}
