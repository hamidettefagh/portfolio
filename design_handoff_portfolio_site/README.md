# Handoff: hamidettefagh.com portfolio site

## Overview

Single-page personal portfolio for Hamid Ettefagh (Senior Forward Deployed Engineer, AI at Salesforce), plus a case-study detail template. Warm editorial design ("Field Notes"): heavy grotesque type, one italic serif accent word, burnt-orange accent, mono meta labels, hairline rules, generous whitespace. Signature interactive features: a Cmd+K command menu, a "view specs" overlay, and an ask-my-agent panel where a live Claude model answers questions about Hamid's work.

Target: **Next.js (App Router) + Tailwind, deployed on Vercel**, domain `hamidettefagh.com` already registered in AWS Route 53. GitHub repo: `hamidettefagh/portfolio` (currently empty).

## About the design files

Everything in this bundle is a **design reference created in HTML/JSX in a design tool** — it shows intended look, copy, and behavior. It is not production code to ship as-is (it loads React from a CDN, transpiles JSX in the browser, and injects CSS from strings). **Recreate these designs in a fresh Next.js codebase** using idiomatic patterns: real components, Tailwind theme mapped to the tokens below, `next/font/google` for fonts.

The design sources live in this zip at the **project root** (this README is in `design_handoff_portfolio_site/`). They are the single source of truth for copy and exact values:

- `ui_kits/portfolio/` — the screens: `index.html` (mount points), `Home.jsx`, `Hero.jsx`, `WorkSection.jsx` (contains `WORK_ITEMS`, all work copy), `AskSection.jsx`, `AboutSection.jsx`, `ExperienceSection.jsx`, `ContactSection.jsx`, `SiteNav.jsx`, `CaseStudy.jsx`, `Reveal.jsx`, plus `project.html`
- `components/` — reusable primitives and patterns with props contracts (`.d.ts`) and usage notes (`.prompt.md`). `patterns/AskAgent.jsx` contains the **agent system prompt** (`DEFAULT_SYSTEM`) to use verbatim in production
- `tokens/` + `styles.css` — the CSS custom properties (canonical token values)
- `readme.md` (project root) — brand guide: voice, visual foundations, iconography rules
- Ignore generated files: `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json`

## Fidelity

**High-fidelity.** Recreate pixel-perfectly. Copy exact values from the token files; do not round to Tailwind defaults (extend the theme instead). All copy is final and lives in the source files; do not rewrite it.

## Screens

### 1. Home (single page, anchor navigation)

Sections in order, inside a 1160px container, gutter `clamp(20px, 4.5vw, 48px)`, sections separated by 128px padding-top:

1. **Nav** — fixed, 64px tall. Left: wordmark `hamidettefagh.com` (Geist Mono 14px, weight 500). Right: Work / About / Experience / Contact (15px, secondary color) + a ⌘K pill (mono 11px, hairline border, radius 6px) that opens the command menu. Transparent at top; after 12px scroll: 82% paper over `backdrop-filter: blur(12px)` + bottom hairline.
2. **Hero** — padding-top ~128px below nav. Eyebrow (mono 13px uppercase, orange 7px dot): "Portfolio, 2026 · Los Angeles". H1 Archivo 700, `clamp(56px, 8.2vw, 112px)`, tracking -0.035em, leading 0.98: "Agents that / actually *ship*" where *ship* is Newsreader italic 500, accent color, thick underline (0.055em thickness, 0.12em offset). Two-column row (1.2fr/1fr, 64px gap): left lead 21px "I design, build, and ship production agent systems for the enterprise." + small meta line "Senior Forward Deployed Engineer at Salesforce."; right an italic serif aside (19px, 2px accent left border, 24px padding-left): "Demos are easy. Production is the job. The gap between a promising agent and a dependable one is where I work." Buttons: primary pill "View selected work →" (accent fill) + secondary outline "Get in touch". Faint radial accent wash behind hero only. Below: **NOW ticker** between two strong hairlines: green dot + "Now" (mono, accent) then mono items "Shipping enterprise agent platforms", "Advising on AI trust and governance", "Updated {Month Year}" (render at build time).
3. **Selected work** — section label rule ("Selected work" mono accent + hairline), H2 "Five engagements, one job: / make it real". Five rows (hairline-separated, no cards), grid `56px 1fr auto 28px`: mono index, title (Archivo 600 24px) + one-line summary (15px secondary, 56ch), industry tag (mono pill), ↗ arrow. Hover: title/arrow warm to accent-700, arrow translates (2px, -2px). Row 01 links to the case study page. All copy in `WorkSection.jsx`.
4. **Ask my agent** — H2 "Do not take my word for it. / Ask my agent". White panel (hairline border, 12px radius, 24px padding): status line (green dot + "Agent online" / pulsing + "Working"), input (pill, hairline, focus ink border) + accent "Ask" button, three mono suggestion chips, answer paragraph (hairline-top separated), mono fineprint "Live model output. It can be wrong. For anything that matters, email." Behavior below.
5. **About** — H2 "The gap between / pilot and production". Three paragraphs (17px, 62ch max; exact copy in `AboutSection.jsx`). Below: three numbered principles (hairline rows, mono accent numerals 01–03): Production over demos / Cost is a feature / Trust is architecture. **No photo** (intentional).
6. **Experience** — rows grid `160px 1fr`: mono dates column, role (Archivo 600 19px), org (15px secondary), note (15px meta). Rows: 2025 - Now Senior Forward Deployed Engineer, AI (Salesforce); 2022 - 2025 Senior Technical Architect, Strategic Accounts (Salesforce); Earlier: Enterprise delivery roles (Accenture, Deloitte, and Cognizant). Then a "Credentials" labeled rule + one line: "Claude Certified Architect, Anthropic · 17 Salesforce certifications · Professional certificate, MIT xPRO".
7. **Contact** — H2 "Get in touch". Two large hairline rows (label mono / value Archivo 600 up to 30px / right hint): Email `hamid.ettefagh@gmail.com` (click copies, hint flips "Click to copy" → "Copied" for 1.6s; mailto fallback) and LinkedIn `in/hamidettefagh` → https://www.linkedin.com/in/hamidettefagh (↗, new tab). Footer (strong hairline top): "Hamid Ettefagh" / "hamidettefagh.com" / "view specs" (opens overlay) / "© 2026".

### 2. Case study (`/work/airline-super-agent` or similar)

See `ui_kits/portfolio/CaseStudy.jsx` + `project.html`. Nav with "All work" back link. Eyebrow "Case study · Major US airline", H1 "Airline super agent program", meta tags (Lead engineer / Multi-agent platform / In production). Sections The situation / The work / The outcome, each: mono accent label, 1–2 real sentences, then a dashed-border mono TODO box listing content still to be supplied. Keep the TODO boxes out of production nav until filled — or hold this page back at launch.

## Interactions & behavior

- **Smooth scroll**: anchor nav scrolls with an 84px offset (fixed nav clearance).
- **Reveal on scroll**: each section fades up 14px over 420ms `cubic-bezier(0.16,1,0.3,1)`, once, via IntersectionObserver threshold 0.12; skip entirely under `prefers-reduced-motion`.
- **Command menu (⌘K / Ctrl+K, or the nav pill)**: centered panel 560px at 16vh, white, hairline, 12px radius, float shadow; filter input ("Where to?"), arrow keys + Enter, Esc/scrim closes. Items: Go to work/about/experience/contact, Ask my agent (scrolls + focuses input), Copy email (flashes "Copied {email}" ~900ms then closes), View specs, Open LinkedIn. Footer hints "↑↓ navigate · ↵ select · esc close".
- **Specs overlay (`.` key when not typing, footer link, or command menu)**: opaque full-page spec sheet reading the design tokens at runtime — type scale with live samples, color swatches with resolved values, spacing bars, font/layout/motion values. Esc or "esc" button closes; body scroll locked while open.
- **Ask my agent**: submit → status "Working" (pulsing dot) → answer renders below a hairline. Errors/offline → muted fallback pointing at email. Suggestions submit immediately.
- **Hovers**: links darken underline to currentColor; buttons darken fill (accent-700) / darken outline; arrows nudge (→ +3px x; ↗ +2px,-2px). Press: 1px translateY. Durations 140/240ms, same ease-out. No bounces, no infinite loops.

## Ask-my-agent in production (Vercel function)

The prototype calls an in-tool model bridge; in production build a serverless route:

- `app/api/ask/route.ts` (Edge or Node): POST `{ question: string }` → calls Anthropic Messages API (`claude-haiku-4-5` or current haiku), `max_tokens: 400`, `system` = the `DEFAULT_SYSTEM` string from `components/patterns/AskAgent.jsx` **verbatim** → returns `{ answer: string }`.
- `ANTHROPIC_API_KEY` as a Vercel env var. Never expose it client-side.
- Rate limit: ~10 requests/min per IP (Upstash Ratelimit on Vercel KV is the standard drop-in), plus a 300-char question cap and same-origin check. Return 429 with a friendly message; client shows the muted error state.
- Client fallback copy when the API fails: "The agent hit an error. Try again, or email hamid.ettefagh@gmail.com."

## State management

All client-side and local: nav scrolled boolean; command menu open/query/active-index; specs overlay open; ask panel query/busy/answer; copied flags with timeouts. No global store, no data fetching besides `/api/ask`.

## Design tokens

Canonical values in `tokens/*.css` (colors, typography, spacing, effects). Highlights — map into the Tailwind theme:

- Paper `#FDFBF8` / `#F7F3EC` / `#F0EADF`; ink `#211D18` / `#4F4840` / `#7D7569` / `#ADA495`; hairlines `#E8E2D6`, strong `#D3CBBD`; accent `oklch(53% 0.17 38)` (hover `46%`, light `59%`, washes `93%`/`97%`); live green `oklch(58% 0.13 150)`.
- Fonts: Archivo (display+body), Newsreader italic (accent word, asides only), Geist Mono (meta) — all on Google Fonts; use `next/font/google`.
- Type scale: hero `clamp(56px,8.2vw,112px)` / h2 `clamp(34px,4.2vw,54px)` / h3 26 / lead 21 / body 17 / small 15 / mono 13 and 11.5. Tracking: display -0.035em, headings -0.02em, mono +0.08em uppercase. Leading: display 0.98, body 1.6.
- Spacing: 4px base — 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96, 128, 176. Container 1160px.
- Radii: 0 default, 6, 12, pill. Shadow only `0 1px 2px rgba(33,29,24,.05), 0 8px 28px rgba(33,29,24,.07)` for floating chrome. Motion: `cubic-bezier(0.16,1,0.3,1)`, 140/240/420ms.

## Copy rules (enforce in any new copy)

First person singular. Sentence case everywhere. **No em dashes. No exclamation points. No emoji.** Client names never (industry descriptors only); Salesforce OK as employer, never its logos/screenshots. No exact contract dollar figures ("eight-figure", "north of $1B modeled" are the approved phrasings). No phone/street address (Los Angeles max). No job-seeking language. No GitHub link at launch. Icons: only text glyphs ↗ → (⌘ ↵ ↑↓ inside command-menu chrome); no icon libraries, no social icons.

## SEO / meta

- Title: `Hamid Ettefagh | Forward Deployed AI Engineer`
- Description: `Forward Deployed AI Engineer building production agent systems for the enterprise. Multi-agent platforms, RAG, and AI governance at Fortune 500 scale.`
- OG image: simple text card (name + tagline) generated at build (e.g. `next/og`), in the site palette. No photos.

## Assets

**There is no logo** — the wordmark is the domain set in Geist Mono (or the full name in Archivo 600). Do not create a mark. No images at all in v1 (no-photo layout approved). Fonts load from Google Fonts.

## Deploy runbook (GitHub → Vercel → Route 53)

1. Claude Code: build the Next.js app in `hamidettefagh/portfolio`, commit, push to `main`.
2. vercel.com → Add New Project → import `hamidettefagh/portfolio` (framework auto-detects Next.js, zero config). Add env var `ANTHROPIC_API_KEY` (+ KV/Upstash vars if using rate limiting). Deploy.
3. Project → Settings → Domains → add `hamidettefagh.com` (and `www.hamidettefagh.com`, redirecting www → apex). Vercel shows the DNS records.
4. Route 53 → the hamidettefagh.com hosted zone → add exactly what Vercel showed: an A record on the apex (Vercel's IP, currently 76.76.21.21) and a CNAME `www` → `cname.vercel-dns.com`. Wait for validation (minutes).
5. Every future `git push` to `main` auto-deploys. PRs get preview URLs.

## Suggested Claude Code kickoff prompt

"Read design_handoff_portfolio_site/README.md and the design sources at the repo root (tokens/, components/, ui_kits/portfolio/). Scaffold a Next.js App Router + Tailwind + TypeScript project. Map the CSS custom properties in tokens/ into the Tailwind theme, load Archivo, Newsreader (italic) and Geist Mono via next/font/google, and recreate the Home page and interactions exactly as specified, reusing the copy from ui_kits/portfolio/WorkSection.jsx and AboutSection.jsx verbatim. Implement /api/ask per the README. Do not add sections, images, icon libraries, or copy that is not in the handoff."
