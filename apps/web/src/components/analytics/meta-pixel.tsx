"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

import { useConsent } from "@/lib/consent";
import { isAcademyPath } from "@/lib/meta-events";
import {
	eventsForOutboundClick,
	isTrackedPath,
	META_ACADEMY_PIXEL_ID,
	META_PIXEL_ID,
	productSlugFromPath,
	setPixelConsent,
	trackAcademy,
	trackOutbound,
	trackStandard,
} from "@/lib/meta-pixel";
import { readStoreSetupClick } from "@/lib/store-setup";

/**
 * Loads the Meta Pixel and reports what visitors do with the site.
 *
 * Mounted once, in the root layout. Nothing here runs until the visitor has
 * accepted -- `fbevents.js` is not even requested before then, so a declining
 * or undecided visitor makes zero contact with Meta. Three jobs, once allowed:
 *
 * 1. Load `fbevents.js` and `init` the site pixel. `init` on its own sends
 *    nothing, which is why the loader can stay mounted on portal routes while
 *    the tracking below stays off there.
 * 2. Fire `PageView` on the first paint and on every client-side navigation.
 *    Next does not reload the page between routes, so without this the whole
 *    site would look like one visit to whichever page they landed on.
 * 3. Watch for clicks on the links that mean intent -- book a demo, email
 *    sales, install an app, buy Store Setup -- via one delegated listener.
 *    `lib/meta-pixel.ts` owns what each href means and which pixel hears it.
 *
 * There is a second pixel, the Edgecoms Academy one, and it belongs to a
 * single page: `/store-setup`. It is initialised the first time a visitor is
 * on that page and is sent that page's `PageView` and button clicks. Nothing
 * on any other page is ever addressed to it.
 */
export function MetaPixel() {
	const pathname = usePathname();
	const consent = useConsent();
	/**
	 * `onReady` rather than a bare effect: it is the only signal that the inline
	 * snippet below has actually run. React effects can otherwise beat an
	 * `afterInteractive` script, and the landing PageView -- the one that
	 * matters most, because it is the ad click -- would be dropped.
	 */
	const [pixelReady, setPixelReady] = useState(false);

	/**
	 * Either id is enough to load `fbevents.js`: a deploy could carry the
	 * Academy pixel without the site one. Each report still checks its own
	 * pixel's id, so a missing one simply stays silent.
	 */
	const allowed =
		consent === "granted" && Boolean(META_PIXEL_ID || META_ACADEMY_PIXEL_ID);
	const tracked = isTrackedPath(pathname);

	/**
	 * Declared before the reporting effect so a re-grant reaches `fbevents.js`
	 * ahead of the PageView it is meant to allow.
	 */
	useEffect(() => {
		setPixelConsent(allowed);
	}, [allowed]);

	useEffect(() => {
		if (!(pixelReady && tracked && allowed)) {
			return;
		}

		trackStandard("PageView");

		/**
		 * A single app page also counts as viewing a product, tagged with which
		 * app it was. `PageView` says an ad drove traffic; this says what the
		 * traffic was interested in.
		 */
		const slug = productSlugFromPath(pathname);
		if (slug) {
			trackStandard("ViewContent", {
				content_type: "product",
				content_ids: slug,
				content_name: slug,
			});
		}

		/**
		 * The Academy pixel's only page view. `trackAcademy` initialises that
		 * pixel on first use and refuses to send from any other path, so the
		 * check here is about not asking, not about safety.
		 */
		if (isAcademyPath(pathname)) {
			trackAcademy("PageView");
		}
		/*
		 * Deliberately keyed on pathname only. Reading the query string here
		 * would need `useSearchParams`, which opts the entire site out of static
		 * rendering. `fbq` reads the full URL off `window.location` itself, so
		 * UTM tags still reach Meta -- this only means a navigation that changes
		 * *nothing but* the query string does not re-fire, which on a marketing
		 * site is the right trade.
		 */
	}, [allowed, pathname, pixelReady, tracked]);

	useEffect(() => {
		if (!allowed) {
			return;
		}

		function handleClick(clickEvent: MouseEvent) {
			const target = clickEvent.target;
			const anchor =
				target instanceof Element ? target.closest("a[href]") : null;
			if (!anchor) {
				return;
			}

			const href = anchor.getAttribute("href");
			if (!href) {
				return;
			}

			/**
			 * A Store Setup button is known by the mark it carries, not by its
			 * address, so the payment provider behind it can change freely.
			 *
			 * The page is read at the moment of the click, not captured when the
			 * listener was attached: which pixel a link reports to depends on
			 * where the visitor is standing when they press it.
			 */
			const link = { href, storeSetupClick: readStoreSetupClick(anchor) };
			for (const event of eventsForOutboundClick(
				link,
				window.location.pathname
			)) {
				trackOutbound(event);
			}
		}

		/**
		 * Capture phase, so an outbound click still reports even if a component
		 * in between calls `stopPropagation` on its own handler.
		 */
		document.addEventListener("click", handleClick, true);
		return () => document.removeEventListener("click", handleClick, true);
	}, [allowed]);

	if (!allowed) {
		return null;
	}

	/**
	 * Meta's official loader snippet, with the trailing `fbq('track','PageView')`
	 * removed -- the effect above owns every PageView, so first paint and
	 * client-side navigations go through one code path instead of two that have
	 * to agree.
	 *
	 * Only the site pixel is initialised here. The Academy pixel is initialised
	 * by `lib/meta-pixel.ts`, on `/store-setup`, the first time it is needed.
	 *
	 * The interpolated id is safe to inline: the env schema rejects anything
	 * that is not digits long before the build gets here.
	 */
	const initSitePixel = META_PIXEL_ID ? `fbq('init','${META_PIXEL_ID}');` : "";
	const loader = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
${initSitePixel}`;

	/**
	 * Meta's snippet normally ships a `<noscript>` 1x1 beacon alongside this.
	 * It is deliberately absent: reaching this line at all requires a stored
	 * consent answer, and storing one requires JavaScript. A no-JS visitor is
	 * therefore always an un-consented visitor, and the beacon would be the one
	 * thing on the page that tracked them anyway.
	 */
	return (
		<Script
			id="meta-pixel"
			onReady={() => setPixelReady(true)}
			strategy="afterInteractive"
		>
			{loader}
		</Script>
	);
}
