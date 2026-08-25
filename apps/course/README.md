# Course site

The marketing site for the Edge growth course. A **separate Next.js app on its
own domain** — it shares the monorepo's tooling and nothing else. No
`@edgecoms/ui`, no Edge nav or footer, no Edge design tokens, and none of the
platform's secrets.

```bash
bun run dev:course   # http://localhost:3004
```

## Environment

Copy `.env.example` to `.env`. Two variables:

| Variable | Required | Why |
| --- | --- | --- |
| `DATABASE_URL` | **Yes** | Where signups are stored. Without it every submission is refused. |
| `NEXT_PUBLIC_SITE_URL` | **Yes in production** | Canonical + OG URLs. Must be the real domain. |

The app imports only the `course_leads` table definition from `@edgecoms/db`,
never the package root — the root pulls in `@edgecoms/env/server`, which demands
`BETTER_AUTH_SECRET` and the Partner API tokens. A public marketing site has no
business holding those.

## Database

One table, `course_leads`, created by migration `0002_giant_blob.sql`. It is not
part of the money system: no foreign keys into `partners` or `merchants`, and
nothing in the commission pipeline reads it.

```bash
bun run db:migrate       # apply it
```

Rows are idempotent on the normalised email, so a double-click or a returning
visitor updates their row rather than creating a second one.

## ⚠️ Access delivery is currently MANUAL

**Nothing in this codebase sends the access email.** The form stores the lead and
tells the visitor their link is coming. Somebody has to actually send it.

Until a sender is wired up, that is a daily job:

```sql
SELECT name, email, phone, created_at
FROM course_leads
WHERE access_sent_at IS NULL
ORDER BY created_at;
```

…then, once access has genuinely gone out:

```sql
UPDATE course_leads SET access_sent_at = now() WHERE email = '...';
```

`access_sent_at` is the difference between "we captured a lead" and "we kept our
promise". Alert on rows where it stays null for more than a day.

## Launch checklist

Everything below is a placeholder and is marked `TODO(launch)` in the source.

- [ ] **`COURSE_STATS`** (`src/lib/content.ts`) — "300+ students" and "12+ hours"
      are invented. Replace or delete the band.
- [ ] **Testimonials** (`src/lib/social-proof.ts`) — all six are placeholders.
      See "Collecting testimonials" below.
- [ ] **Module lesson counts** — placeholders until the course is filmed.
- [ ] **`SHOW_STRUCK_PRICE`** (`src/lib/content.ts`) — read the legal note above
      it. A struck-through price the course was never actually sold at is
      deceptive under FTC reference-pricing guidance. Set it to `false` for the
      safer "free while in beta" framing.
- [ ] **`COURSE_NAME`** and **`NEXT_PUBLIC_SITE_URL`** (`src/lib/site.ts`).
- [ ] **A real sender** for the access email, so the section above can be deleted.
- [ ] **A privacy policy** to link from the consent line under the form.

## Collecting testimonials

The page ships with **no testimonials**, and that is correct — there are no
students yet. Until real ones exist it shows an honest "why trust this" panel
instead, built from what Edgecoms can actually defend: the apps it ships.

A quote in `src/lib/social-proof.ts` must clear **two independent gates** before
it renders in production:

```ts
provenance: "verified"   // a real person really said this
permission: "granted"    // and agreed to it appearing publicly, by name
```

Both. A genuine quote used without permission is still a problem; a
permissioned quote we wrote ourselves is worse. Anything failing either gate is
visible in `bun run dev:course` and stripped from the production build — verify
with `bunx next build` and grep the output.

**When to ask.** The natural moment is a few weeks after access is delivered,
once someone has actually applied something. You already have the list:

```sql
SELECT name, email FROM course_leads
WHERE access_sent_at < now() - interval '21 days';
```

**What to ask.** "What did your conversion rate or order value do?" gets you a
figure and a quote in one reply. "Would you leave a review?" gets you neither.

**What to record.** Fill in every field — `name`, `role`, `rating`,
`collectedAt`, and `source` (the email or call it came from). `source` is the
audit trail: under the UK CPRs, publishing reviews without reasonable steps to
check they are genuine is a banned practice, and "we have the email" is that
step.

The star average is **computed**, never written by hand, and stays hidden until
there are at least four real ratings — an average of one is not an average, and
a hardcoded rating beside three reviews is what earns a Google manual action.
For the same reason `aggregateRating` is deliberately absent from the page's
JSON-LD; add it only once real reviews exist.
