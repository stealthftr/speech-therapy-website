# Lark — Speech Pathology for Children (Adelaide)

A self-contained static site (no build step, no framework) for a boutique paediatric
speech pathology practice. Built around one front-end action — a **free Discovery Call
(fit call)** with a speech pathologist — which routes each family to either a paid
**Speech Assessment** or straight into **therapy** (90-min Signature / 60-min Essentials).
Secondary funnel: a gated **"Is my child's talking on track?" milestone guide** (email
capture).

Strategy and rationale live in [STRATEGY.md](STRATEGY.md).

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — "what you're noticing" spine, boutique positioning, Discovery Call CTA |
| `concerns.html` | "Is this your child?" — problem hub, each concern routes to the call |
| `assessment.html` | The paid Speech Assessment (money page); CTA is the free call |
| `pricing.html` | Signature 90 vs Essentials 60, mileage maths, funding (NDIS etc.) |
| `schools.html` | Dual-audience: parents + schools/kindies, with a school enquiry form |
| `about.html` | Catherine's bio + practice philosophy |
| `faq.html` | NDIS, waitlists, mobile/online, assessment, session length, cost |
| `guide.html` | Lead-magnet landing — email capture for the milestone guide |
| `milestone-guide.html` | The delivered guide (soft-gated; printable) |
| `book.html` | Booking — Calendly Discovery Call embed slot + working request form |

Shared assets: `css/styles.css`, `js/main.js`, and **`js/config.js` (the only file you
must edit to go live)**.

## Preview locally

```
npx serve .
```

Open the printed URL. Forms run in demo mode locally (validate + confirm, logged to the
browser console).

## Wire up the booking calendar (Cliniko)

The practice uses **Cliniko** for online bookings. Two ways to embed it:

**Option A — paste your bookings URL (simplest):**
1. In Cliniko, go to **Settings → Online bookings** and copy your bookings URL
   (looks like `https://your-name.au4.cliniko.com/bookings` — the region shard,
   e.g. `au4`, is already in it).
2. Paste it into `clinikoUrl` in `js/config.js`.

The booking page then replaces the request form with your live Cliniko calendar
(embedded in a responsive iframe; `?embedded=true` is added automatically for the
streamlined view). Leave it `""` to keep using the request form.

**Option B — use Cliniko's own widget snippet:**
In Cliniko, **Settings → Online bookings → "Code to embed in your website"** gives
you a copy-paste snippet. In `book.html`, delete the `<div id="scheduler-embed">`
and paste Cliniko's snippet in its place. Leave `clinikoUrl` empty.

Set up your Cliniko appointment types to match the funnel — e.g. a free **Discovery
Call** plus the paid **Assessment** and **Signature/Essentials** sessions — so the
embedded calendar lets families pick the right one. (`calendlyUrl` remains as an
optional fallback if you ever switch schedulers; it's ignored when `clinikoUrl` is set.)

## Wire up the forms

Forms: the Discovery Call request (book page), the school enquiry (schools page), and two
guide-download captures (home + guide page). In order of ease:

- **Netlify (recommended):** forms are tagged `data-netlify="true"` — submissions appear
  in the Netlify dashboard (Site → Forms). Add an email notification there.
- **Formspree:** create a free form, paste the endpoint into `formEndpoint` in
  `js/config.js`. Works on any host.
- **Local / nothing configured:** demo mode — validates, shows success, logs to console.

Guide-capture emails should also flow into your email marketing tool (the copy promises a
short tip series). The milestone guide is **soft-gated** (a browser flag set on submit);
a determined visitor can reach the URL directly — standard for a static site. For a hard
gate later, email the guide as a PDF.

## Deploy

Static hosting anywhere (Netlify, Vercel, Cloudflare Pages, GitHub Pages). Netlify: drag
the folder in, or connect a repo. Use Formspree for forms on non-Netlify hosts.

## ⚠️ Placeholders to swap before launch

Marked `[SWAP]` throughout the HTML. Contact details live in `js/config.js` and propagate
site-wide.

**Brand & identity**
- Final confirmation of the **Lark** name pending three checks: `.com.au` domain,
  Speech Pathology Australia directory, and an IP Australia trade-mark search (see
  STRATEGY.md §11). The site is built on the assumption these come back clear.
- Logo is a simple songbird SVG mark — replace with a designed logo if/when you have one.
- Email `hello@larkspeech.com.au` is a placeholder on the new domain (migrate from
  LightUnfolding). Phone `0485 881 270` is the real number — verify.

**Practice details**
- Service radius around Adelaide; confirmed business/trading name; hours.
- **Clinician:** Catherine's full credentials (CPSP membership #, qualification &
  university), Working with Children Check, years/areas of experience, any special
  training. (`about.html`, `index.html`)

**Commercial**
- **Pricing:** Signature fee (shown as $300 — confirm), Essentials 60-min fee, and your
  **per-kilometre travel rate**. The mileage table on `pricing.html` uses clearly-marked
  example figures — replace the bracketed numbers with real ones.
- **Assessment fee** and honest **turnaround** ("within days" claim on `assessment.html`).
- **Funding specifics:** NDIS registration status (registered vs non-registered), Medicare
  care-plan details, private-health claiming notes.

**Content & proof**
- **Testimonials** on `index.html` are invented samples — replace with real,
  permission-granted quotes.
- **Photos** — SVG placeholders on `index.html` and `about.html` should become real photos
  of Catherine / sessions; the single highest-impact swap.
- **Milestone-guide content** — reviewed and approved by your clinician before launch, as
  it publishes under Lark's name.
- **Schools page** — confirm the acquisition offer (staff PD / screening day) and clearances.
