---
name: reference-analysis
description: Auto-trigger when analyzing a reference website/web-app to clone or learn from — mapping page types, extracting UI from screenshots, capturing API calls (HAR), and inferring the data model. Use when a client gives a URL and says "make it like this site".
---

# Reference Analysis (website → structure → data model)

## Goal
Turn a reference URL into a structured understanding you can build from: page types, UI design,
the APIs it calls, and an inferred data model — without copying its content/assets.

## The 4 tiers (use only as deep as the task needs)

### Tier 1 — Map page TYPES (not every page)
- Read `sitemap.xml` first if present (fastest URL enumeration).
- Crawl with `max_depth` + `max_pages`, locked to the domain; drop junk query params (`?sort=`, `?page=`, facets) to avoid infinite-URL traps.
- Group URLs by pattern → **page types** (home, list, detail, checkout, auth, blog, dashboard…).
  1000 product URLs = ONE `product-detail` type. Sample ONE representative page per type.
- Tooling: WebFetch = single static page only. JS/SPA or multi-page → **Firecrawl / Crawl4AI** (headless render + crawl).

### Tier 2 — Extract UI / design (per page type)
- Screenshot each representative page → **Claude vision** → describe layout, components, design tokens (spacing, color, type).
- WebFetch/markdown can't see design or JS-rendered content — visual cloning needs the screenshot, not the HTML text.

### Tier 3 — Capture API calls (what each page calls)
- Use a headless browser with network capture (**Playwright/Puppeteer**) or DevTools → **Save as HAR**; mitmproxy/Charles as a proxy alternative.
- "Exercise" the core flows (browse → detail → add to cart → checkout). The HAR records, per page: method + URL + request body + **response JSON**.
- Produces an **API inventory**: endpoint, params, response shape, auth (tokens/cookies).

### Tier 4 — Infer the data model
- From response shapes → entities, fields, relationships → propose DB schema + API design.
  `GET /api/orders/123 → {id, items[{productId, qty}], total, userId}` ⇒ Order, OrderItem, Product, User.
- Record the design as an ADR via `/new-decision`. Feed entities/terms into `docs/specs/GLOSSARY.md`.

## Honest limits (state these, don't overclaim)
- Captures only flows you EXERCISE and traffic that is OBSERVABLE — server logic, private endpoints, and the real DB schema stay hidden. You INFER, not read.
- Response JSON ≠ DB schema — it's a projection (joined/filtered/renamed). A starting point, not ground truth.
- Auth-gated pages/APIs need credentials; GraphQL is one endpoint (capture query + variables).
- SPA links rendered by JS need a real browser to follow; basic crawlers miss them.
- "Fetch came back empty" usually means SPA/anti-bot, NOT that the site is empty — escalate the tool tier, don't conclude.

## Legal / IP guardrail
Analyze STRUCTURE and behavior to understand and rebuild — do NOT copy text, images, logos, brand,
or proprietary data, and do not replay/scrape their API for its data. Respect robots.txt / ToS / rate limits.

## Output
- Page-type map (types + one sample URL each)
- UI inventory per type (layout + components)
- API inventory (endpoint → params → response shape)
- Inferred data model (entities + relationships) → BRIEF/PRD/GLOSSARY + an ADR for the schema

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "Fetch came back empty, the site has no content" | It's almost always SPA/anti-bot, not an empty site. Escalate the tool tier (Playwright), don't conclude. |
| "The response JSON IS the database schema" | It's a projection — joined, filtered, renamed. Treat it as a starting inference, label it as such. |
| "I'll just crawl every page to be thorough" | 1000 product URLs = one page type. Sample one per type; dumping every page is cost + noise, not thoroughness. |
| "I inferred the backend, so it's settled" | Server logic and private endpoints are unobservable. Mark every tier 3-4 claim as inference and note what you couldn't reach. |

## Rules
- Map page types; never dump every page (cost + noise).
- Pick the lowest tier that answers the question — don't run Playwright/HAR for a static brochure site.
- Everything from tiers 3–4 is an inference; label it as such and note what you couldn't reach.
- `/discover` Path A drives the client-facing confirmation; this skill is the extraction method behind it.
