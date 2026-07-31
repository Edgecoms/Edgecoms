# Integration logos

Drop each brand's **official** SVG here, then set `logo` (and `width`) on the
matching entry in `apps/web/src/lib/integrations.ts`. Until a file exists, the
ticker renders that brand's name as a wordmark, so the section works with any
number of these filled in.

| File            | Brand    | Where the official asset comes from                          |
| --------------- | -------- | ------------------------------------------------------------ |
| `shopify.svg`   | Shopify  | Shopify Brand Assets / press kit                             |
| `shop-pay.svg`  | Shop Pay | Shopify Brand Assets — Shop Pay lockup                       |
| `meta.svg`      | Meta     | Meta Brand Resource Centre                                   |
| `google.svg`    | Google   | Google Brand Permissions / Google Ads brand guidelines        |
| `tiktok.svg`    | TikTok   | TikTok Brand Guidelines / TikTok for Business press resources |
| `klaviyo.svg`   | Klaviyo  | Klaviyo Brand Kit                                             |

## Two rules

**Use each brand's own file.** Do not trace, redraw or recolour a mark, and do
not pull one off a random icon site — those are frequently outdated or subtly
wrong, and a wrong logo reads as carelessness about the integration itself.

**Do not restyle beyond the row's own treatment.** The ticker applies a uniform
greyscale at reduced opacity and returns to full colour on hover, which is the
normal way to show a compatibility row and is consistent across every mark. Most
brand guidelines allow exactly this and disallow recolouring individual marks.

Using these logos to state factual compatibility — "works with" — is legitimate
nominative use. It stops being legitimate if the row implies endorsement,
partnership or sponsorship, which is why the heading says what it says.
