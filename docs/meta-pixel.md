# Meta Pixel & Conversions API

How the marketing site reports to Meta Ads, and how to turn it on.

There are **two pixels**. The site pixel covers the marketing site and the Edge
apps campaigns. The Edgecoms Academy pixel covers one page, `/store-setup`, and
the Store Setup campaigns. Most of this document is about the site pixel; the
Academy pixel has [its own section](#the-academy-pixel-store-setup-only).

## What it is

Two halves of the same thing, reporting the same events:

| Half | Where it runs | Why it exists |
| --- | --- | --- |
| **Pixel** | The visitor's browser (`fbevents.js`) | The standard way Meta reads a site. |
| **Conversions API (CAPI)** | Our server (`/api/meta/events`) | iOS, Safari's ITP and ad blockers drop a large slice of the browser half. This one is first-party, so nothing blocks it. |

Both send the same `event_id`, so **Meta collapses the pair into one event**.
The numbers do not double. Losing that shared id is the one change that would
silently inflate every reported conversion — it is covered by a test.

## What gets reported

| Event | Fires when | Type |
| --- | --- | --- |
| `PageView` | Any marketing page, including client-side navigation | standard |
| `ViewContent` | A single app page, tagged with the app slug | standard |
| `Lead` | A "Get a demo" click (any of ~20 surfaces) | standard |
| `Contact` | A `mailto:` click — sales or support | standard |
| `CompleteRegistration` | A partner application is submitted successfully | standard |
| `AppStoreClick` | An "Install free" click through to the Shopify App Store | **custom** |

`Lead` is the money event — it is the one worth optimising campaigns for. On
this pixel it means "Get a demo" and nothing else, which is why Store Setup
clicks are kept out of it (see [the Academy pixel](#the-academy-pixel-store-setup-only)).

`AppStoreClick` is custom because the install completes on Shopify and none of
Meta's purchase-shaped standard events would be honest about a click. To
optimise for it, wrap it in a Custom Conversion in Events Manager first.

Clicks are caught by **one delegated listener**, not a handler per button, so a
new "Get a demo" or App Store link anywhere on the site is picked up with no
extra wiring. `eventsForOutboundClick` in `apps/web/src/lib/meta-pixel.ts` is
the single place that decides what a link means and which pixel hears it.

Every event is sent with `trackSingle` (or `trackSingleCustom`), addressed to
one pixel by id. Nothing calls a bare `fbq('track')`, because that reaches every
pixel initialised on the page.

## The Academy pixel (Store Setup only)

`/store-setup` is the landing page for the Store Setup ads. It reports to the
**Edgecoms Academy** pixel, a separate dataset from the site's.

| Event | Fires when | Value |
| --- | --- | --- |
| `PageView` | `/store-setup` is viewed | |
| `InitiateCheckout` + `Lead` | A "Get Pro" click, through to the Pro payment page | 497 USD |
| `InitiateCheckout` + `Lead` | A "Get Basic" click, through to the Basic payment page | 297 USD |
| `Contact` + `Lead` | A WhatsApp click | none |

Each click is two events, each with its own `event_id`, and each is sent from
the browser and from the server like every other event here. The values are
whole US dollars, read from the same constant that prints the price on the page
(`STORE_SETUP_PLANS` in `apps/web/src/lib/store-setup.ts`). They are ad
reporting, not the partner money system, so the minor-units rule in `CLAUDE.md`
does not apply to them. The payment itself completes on the payment provider's
page, where we cannot see it, so a click is the start of a checkout and never a
`Purchase`.

**A button is recognised by a mark it carries, not by where it leads.** Each
Store Setup button has a `data-store-setup-click` attribute (`pro`, `basic` or
`whatsapp`), written by `storeSetupClickProps` and read by the click listener
with `readStoreSetupClick`. The address behind the button is never consulted, so
changing payment provider means changing `NEXT_PUBLIC_STORE_SETUP_PRO_PAY_URL`
and `NEXT_PUBLIC_STORE_SETUP_BASIC_PAY_URL` and nothing else. A payment or
WhatsApp link without the mark reports nothing. The build fails if the two
payment links are the same.

### The two rules

1. **The Academy pixel hears from `/store-setup` and from nowhere else.**
2. **The site pixel never receives a Store Setup click.** Its `Lead` means "Get
   a demo" and the Edge apps campaigns optimise on it.

The site pixel still gets its ordinary `PageView` for `/store-setup`, the same as
for any marketing page.

### How the rules are held

Each is enforced in more than one place, because a leak between the datasets
would not look like an error. It would look like slightly different numbers.

- **In the click mapping.** On `/store-setup`, a marked Store Setup button is
  answered by the Store Setup mapping and the site mapping is never asked. On
  every other page the mark is ignored.
- **At the point of sending.** `report()` in `meta-pixel.ts` drops any Academy
  event unless the address bar says `/store-setup` at that moment, whatever the
  caller intended.
- **Inside `fbevents.js`.** The Academy pixel stays initialised when a visitor
  moves to another page of the site without a reload, and `fbevents.js` sends
  some things without being asked: an automatic `PageView` to every initialised
  pixel on each client-side navigation, and, with automatic setup on, button
  clicks and page metadata. So the Academy pixel is initialised with
  `fbq('set','autoConfig',false,id)` before `init` and
  `fbq('set','trackSingleOnly',true,id)` after it. A pixel marked
  `trackSingleOnly` is skipped by everything except a `trackSingle` addressed to
  it.
- **On the server.** `/api/meta/events` refuses an Academy event whose page is
  not `/store-setup`, refuses any event the Academy pixel never fires, and
  refuses an `InitiateCheckout` addressed to the site dataset.
- **At build time.** The two pixel ids must differ, or the build fails.

### Turning it on

```bash
NEXT_PUBLIC_META_ACADEMY_PIXEL_ID="<the Academy dataset id>"
META_ACADEMY_CAPI_ACCESS_TOKEN="<from Events Manager, for the Academy dataset>"
```

Production only, like the site pixel. With no id the Academy pixel is never
initialised and the buttons report nothing. With an id and no token the browser
pixel runs alone and the server leg does nothing.

`META_CAPI_TEST_EVENT_CODE` belongs to the site dataset and is never sent with
Academy events. To check the Academy pixel, use the **Test Events** tab of the
Academy dataset in Events Manager with the browser's own events, or the Meta
Pixel Helper extension.

## What is deliberately NOT reported

- **The signed-in portal.** `/partner/*` and `/admin/*` never load the pixel. A
  partner reading their own earnings is not ad traffic.
- **Anyone's personal data.** No email, name, or phone is ever sent — not even
  hashed. Match quality comes from Meta's own cookies plus IP and user agent.
- **Anyone who has not said yes.** See below.

## Consent

**Nothing loads until the visitor accepts.** Not a smaller payload — nothing.
`connect.facebook.net` is not even requested while the answer is undecided.

- A banner asks on the first visit. Decline has equal weight to Accept.
- The answer is stored in `localStorage` under `edge.consent.analytics.v1`.
- The footer carries a permanent on/off control, so withdrawing is as easy as
  giving — which is what GDPR asks for.
- Withdrawing takes effect immediately: it sends `fbq('consent','revoke')` and
  **deletes Meta's `_fbp` and `_fbc` cookies**. It cannot recall what already
  went.
- No JavaScript means no stored answer means no tracking. This is why Meta's
  usual `<noscript>` beacon is deliberately absent.

> **Still outstanding:** the site has no privacy policy page. A consent banner
> normally links to one describing what is collected and why. Worth adding.

## Turning it on

Set these in the production environment (not locally — see below):

```bash
NEXT_PUBLIC_META_PIXEL_ID="2162392621349935"
META_CAPI_ACCESS_TOKEN="<from Events Manager>"
```

The token comes from **Events Manager → your dataset → Settings → Conversions
API → Generate access token**. It is a secret: it is not `NEXT_PUBLIC_` and
must never reach the browser.

`NEXT_PUBLIC_META_PIXEL_ID` is inlined at **build** time, so changing it needs a
rebuild, not just a restart.

**Leave both unset locally and on preview deploys.** No pixel id means the
pixel never loads, which is what stops branch traffic landing in real ad data.

## Verifying it works

1. Set `META_CAPI_TEST_EVENT_CODE` to the code from **Events Manager → Test
   Events**. Events then land in that tab instead of the live dataset.
2. Load the site, accept cookies, click "Get a demo".
3. You should see `PageView` and `Lead` arrive, each **once**, marked as
   received from both Browser and Server. Two separate entries for one action
   means the shared `event_id` broke.
4. **Unset `META_CAPI_TEST_EVENT_CODE`** when done.

`/api/meta/events` answers `204` to everything, success or refusal, so the
response tells you nothing on purpose. Events Manager is where you confirm it,
not the network tab.

## Failure behaviour

This is analytics, so it **fails soft** — the opposite of `/api/v1/*`, which
guards the money system and fails closed. No token, an unreachable Meta, a
malformed body: the browser pixel simply runs alone and the page is unaffected.
An ad report is never worth an error page.

`/api/meta/events` is a public route, so it accepts **same-origin requests
only** and **only the events listed in this document**, each for the pixel that
fires it. Otherwise anyone with `curl` could post invented conversions into the
dataset the ad spend is judged against.

An event names its dataset with `pixel` in the request body (`"site"` or
`"academy"`; absent means `"site"`). A dataset with no id or no token configured
is simply not sent to.

## Where the code lives

| File | Role |
| --- | --- |
| `apps/web/src/lib/consent.ts` | The on/off switch every third-party request obeys |
| `apps/web/src/lib/meta-events.ts` | The event vocabulary and the two pixels, shared by both halves |
| `apps/web/src/lib/meta-pixel.ts` | Browser reporting, what each outbound link means, and which pixel hears it |
| `apps/web/src/lib/store-setup.ts` | Store Setup prices and links, shared by the page and the pixel |
| `apps/web/src/lib/meta-capi.ts` | Server payload, guards, which dataset an event goes to, Graph API call |
| `apps/web/src/components/analytics/` | The pixel loader, the banner, the footer control |
| `apps/web/src/app/api/meta/events/route.ts` | The server leg |

## Graph API version

Pinned via `META_GRAPH_API_VERSION`, default `v26.0` (current as of September
2026). Meta supports each version for roughly two years. Bump it before the
default expires — check the
[changelog](https://developers.facebook.com/docs/graph-api/changelog).
