# hamidettefagh.com

The code and design system behind [hamidettefagh.com](https://hamidettefagh.com), the portfolio of Hamid Ettefagh, Forward Deployed AI Engineer.

The production site lives in `src/`: Next.js 15 App Router, Tailwind v4, TypeScript, deployed on Vercel. It carries the two gates, the method I use to build production agents: the design gate ([Agent, or workflow?](https://hamidettefagh.com/agent-architecture), with an Agentforce lens), the ship gate ([Agent production readiness](https://hamidettefagh.com/agent-production-readiness)), the write-up behind both ([The two gates](https://hamidettefagh.com/two-gates)), a production case study, and a live ask-the-agent panel grounded in site facts. Both gates also ship as Claude skills, bundled in the [two-gates plugin](https://github.com/hamidettefagh/two-gates).

Everything else in this repo is the design system that governs the site: tokens, component specs, and the UI kit the site was built from. One direction, **"Field Notes"**: warm editorial, one accent, no cards, no icons, restraint over decoration. There is **no logo**. The wordmark is the domain set in Geist Mono, or the full name set in Archivo 600. Do not draw a mark.

## Positioning

"Forward Deployed AI Engineer. I design, build, and ship production agent systems for the enterprise."

Senior Forward Deployed Engineer, AI at Salesforce (2025 to present; Senior Technical Architect, Strategic Accounts 2022 to 2025; earlier Accenture, Deloitte, Cognizant). Based in Los Angeles. Work spans airlines, telecom, dining platforms, and consumer electronics: multi-agent platforms, RAG pipelines, evaluation and observability, AI trust and governance. Credentials: Claude Certified Architect (Anthropic), 17 Salesforce certifications, MIT xPRO professional certificate.

## Content fundamentals

- First person singular. "I design, build, and ship." Never "we", never third person.
- Concise and direct. Short declaratives beat subordinate clauses. "Demos are easy. Production is the job."
- **No em dashes. No exclamation points.** Use periods, commas, colons.
- Sentence case everywhere, including headings and buttons. Uppercase only in mono meta labels, where it is applied by CSS, not typed.
- Numerals allowed when they are the point ("cut operating costs by 80 percent", "more than 1,150 customer reactivations", "winner of a 63-entry hackathon", "17 languages"). Never exact contract or deal dollar figures; magnitude phrasing only ("eight-figure program", "modeled pipeline impact north of $1B").
- **Client names never appear.** Industry descriptors only: "Major US airline", "Global dining platform", "National telecom carrier", "Consumer electronics leader". Salesforce may be named as employer in prose; never Salesforce logos, product screenshots, or a CTA-in-progress mention.
- Never publish a phone number or street address. Los Angeles is as specific as location gets.
- Nothing that reads job-seeking. No "open to work", no availability language. Present tense, in-motion: "Shipping enterprise agent platforms."
- No emoji. No decorative unicode beyond the two arrows (see Iconography).
- Links are named plainly: "LinkedIn", "GitHub", the email address itself.

## Visual foundations

- **Color.** Warm paper (#FDFBF8) and warm ink (#211D18), not white and black. One burnt-orange accent (oklch 53% 0.17 38) used sparingly: one accent moment per view, plus a green dot reserved for the live NOW ticker and agent status. Backgrounds never change between sections; whitespace and hairlines do the separating. The only permitted gradient is the faint radial accent wash behind the hero (`--surface-wash`).
- **Type.** Archivo for display and body: display at 700, tracking -0.035em, leading 0.98. Newsreader italic is the signature flourish, one accent word per headline, at most once per screen, usually accent colored with a thick underline. Geist Mono for meta: uppercase, 0.08em tracking, 13px. Scale: 112 / 54 / 26 / 21 / 17 / 15 / 13. Body measure 62ch, lead 44ch.
- **Spacing.** 4px base, 13 steps to 176px. Sections separate with 128 to 176px of whitespace. Container 1160px, fluid gutter clamp(20px, 4.5vw, 48px).
- **Backgrounds and imagery.** Flat paper. No stock photos, no generic AI imagery, no illustrations. No-photo layout is the current choice; if a portrait is added later it is the only image on the site. No textures, no patterns.
- **Borders and dividers.** 1px hairlines everywhere: work rows, experience rows, contact rows, section rules with mono labels. Boxes are rare; the dashed hairline box is reserved for placeholder content.
- **Radii.** Square by default. 6px for small chips of UI, 12px for the portrait, pill for buttons and tags.
- **Shadows.** None, except `--shadow-float` for floating chrome (sticky nav uses blur + hairline instead).
- **Transparency and blur.** Only the sticky nav: 82% paper over blur(12px), hairline bottom once scrolled.
- **Motion.** Quick, decisive ease-out `cubic-bezier(0.16, 1, 0.3, 1)`, 140/240/420ms. Entrances: 14px fade-up on section reveal, once, respecting reduced motion. Hovers: color shifts (link underline darkens to currentColor, titles warm to accent), arrows nudge 2 to 3px. Press: 1px translate down. No bounces, no infinite loops, no parallax.
- **Cards.** There are no cards. Content sits on the page separated by hairlines. If something must be contained, it gets a hairline border and paper-2 fill.

## Iconography

There is no icon set. The system uses exactly two typographic glyphs, always as text, never SVG:

- `↗` (U+2197) external links and work-row affordance
- `→` (U+2192) button arrow, nudges right on hover
- `⌘` (U+2318), `↵` (U+21B5), `↑↓` chrome glyphs, allowed only inside command-menu UI

Status is a 7px dot: green `--live` for the NOW ticker, accent orange for eyebrow markers. Social icons are banned; channels are text links ("LinkedIn"). No emoji. If a future need exceeds these glyphs, use Lucide from CDN at 1.5px stroke and flag the addition here.

## Components

Primitives (`components/primitives/`): **Button**, **TextLink**, **Eyebrow**, **Tag**, **Rule**, **Accent**.
Patterns (`components/patterns/`): **ProjectRow**, **ExperienceItem**, **ContactLink**, **Ticker**, **CommandMenu**, **AskAgent**, **SpecsOverlay**.

Kit sections (`ui_kits/portfolio/`, screen-level, also exported): **Home**, **CaseStudy**, **Hero**, **WorkSection**, **AskSection**, **AboutSection**, **ExperienceSection**, **ContactSection**, **SiteNav**, **Reveal**.

The production implementations live under `src/components/`, extended past the kit where the site grew: the shared **RadarChart** and **ArchitectureDiagram** behind the interactive tools, and the tool engines under `src/app/`. CommandMenu (Cmd+K), AskAgent (live model Q&A grounded in site facts), and SpecsOverlay (press ".") are the site's three interactive signatures. Deliberately kept out: skill-badge grids, GitHub graphs, typing animations, particle or 3D backgrounds, AI-generated imagery, chatbot popups, dark mode.

## Index

- `src/` the production site: app routes, components, the API route behind the ask panel
- `styles.css` imports everything under `tokens/` (fonts, colors, typography, spacing, effects, base)
- `guidelines/` foundation specimen cards (Colors, Type, Spacing, Effects groups in the Design System tab)
- `components/primitives/`, `components/patterns/` reusable UI with props contracts and usage notes per component
- `ui_kits/portfolio/` the original kit: `index.html` (the home page), `project.html` (case study template), sections as JSX
- `templates/portfolio-site/` the consuming-project template for seeding a new page from this system
- `SKILL.md` agent-facing entry point to the design system

## Fonts

Webfonts load from Google Fonts CDN via `tokens/fonts.css`: Archivo (variable), Newsreader (variable, italics), Geist Mono. No binaries are vendored; if offline use is needed, download the ttfs into `assets/fonts/` and rewrite `tokens/fonts.css` as local `@font-face` rules.
