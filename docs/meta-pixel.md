# Meta Pixel & Conversions API

How the marketing site reports to Meta Ads, and how to turn it on.

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

`Lead` is the money event — it is the one worth optimising campaigns for.

`AppStoreClick` is custom because the install completes on Shopify and none of
Meta's purchase-shaped standard events would be honest about a click. To
optimise for it, wrap it in a Custom Conversion in Events Manager first.

Clicks are caught by **one delegated listener**, not a handler per button, so a
new "Get a demo" or App Store link anywhere on the site is picked up with no
extra wiring. `eventForOutboundHref` in `apps/web/src/lib/meta-pixel.ts` is the
single place that decides what a link means.

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
only** and **only the six events above**. Otherwise anyone with `curl` could
post invented conversions into the dataset the ad spend is judged against.

## Where the code lives

| File | Role |
| --- | --- |
| `apps/web/src/lib/consent.ts` | The on/off switch every third-party request obeys |
| `apps/web/src/lib/meta-events.ts` | The event vocabulary, shared by both halves |
| `apps/web/src/lib/meta-pixel.ts` | Browser reporting + what each outbound link means |
| `apps/web/src/lib/meta-capi.ts` | Server payload, guards, Graph API call |
| `apps/web/src/components/analytics/` | The pixel loader, the banner, the footer control |
| `apps/web/src/app/api/meta/events/route.ts` | The server leg |

## Graph API version

Pinned via `META_GRAPH_API_VERSION`, default `v26.0` (current as of September
2026). Meta supports each version for roughly two years. Bump it before the
default expires — check the
[changelog](https://developers.facebook.com/docs/graph-api/changelog).
