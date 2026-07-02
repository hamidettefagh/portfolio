# Ettefagh Design System

The personal brand system for **Hamid Ettefagh**, Forward Deployed AI Engineer. It powers his portfolio site and any asset that carries his name: the site itself, case studies, and one-off mocks.

Domain: **hamidettefagh.com** (confirmed by Hamid, July 2026; shorter or AI-flavored alternates like ettefagh.ai remain of interest later). There is **no logo**. The wordmark is the domain set in Geist Mono, or the full name set in Archivo 600. Do not draw a mark.

## Sources

- Reference site: https://www.keithmancuso.com/ (user-supplied screenshot in `uploads/`; the live site is JS-rendered and was not readable as code). The system borrows its DNA: warm paper, heavy grotesque + italic serif accent word, mono meta labels, hairline rules, a NOW ticker. It is deliberately more restrained.
- GitHub repo `hamidettefagh/portfolio` (https://github.com/hamidettefagh/portfolio) was attached but is an empty repository as of July 2026. Explore it if it gains content; it may hold the production implementation later.
- Secondary references named by the user: rauno.me (restraint, interaction quality), brianlovin.com (project presentation), paulstamatiou.com (substantive about page).
- All positioning copy and the six work items came from the user directly.

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
- Links are named plainly: "LinkedIn", the email address itself. LinkedIn and email are the only channels; GitHub is intentionally omitted until repos are ready. Email is hamid.ettefagh@gmail.com at launch, swapping to hamid@hamidettefagh.com once mail is set up on the domain (one-line change).

## Visual foundations

One direction: **"Field Notes"**, warm editorial (chosen by Hamid, July 2026; a grayscale "Quiet" alternative was explored and retired).

- **Color.** Warm paper (#FDFBF8) and warm ink (#211D18), not white and black. One burnt-orange accent (oklch 53% 0.17 38) used sparingly: one accent moment per view, plus a green dot reserved for the live NOW ticker and agent status. Backgrounds never change between sections; whitespace and hairlines do the separating. The only permitted gradient is the faint radial accent wash behind the hero (`--surface-wash`).
- **Type.** Archivo for display and body: display at 700, tracking -0.035em, leading 0.98. Newsreader italic is the signature flourish, one accent word per headline, at most once per screen, usually accent colored with a thick underline. Geist Mono for meta: uppercase, 0.08em tracking, 13px. Scale: 112 / 54 / 26 / 21 / 17 / 15 / 13. Body measure 62ch, lead 44ch.
- **Spacing.** 4px base, 13 steps to 176px. Sections separate with 128 to 176px of whitespace. Container 1160px, fluid gutter clamp(20px, 4.5vw, 48px).
- **Backgrounds and imagery.** Flat paper. No stock photos, no generic AI imagery, no illustrations. No-photo layout is the current choice (approved July 2026); if a portrait is added later it is the only image on the site. No textures, no patterns.
- **Borders and dividers.** 1px hairlines everywhere: work rows, experience rows, contact rows, section rules with mono labels. Boxes are rare; the dashed hairline box is reserved for placeholder/TODO content.
- **Radii.** Square by default. 6px for small chips of UI, 12px for the portrait, pill for buttons and tags.
- **Shadows.** None, except `--shadow-float` for floating chrome (sticky nav uses blur + hairline instead).
- **Transparency and blur.** Only the sticky nav: 82% paper over blur(12px), hairline bottom once scrolled.
- **Motion.** Quick, decisive ease-out `cubic-bezier(0.16, 1, 0.3, 1)`, 140/240/420ms. Entrances: 14px fade-up on section reveal, once, respecting reduced motion. Hovers: color shifts (link underline darkens to currentColor, titles warm to accent), arrows nudge 2 to 3px. Press: 1px translate down. No bounces, no infinite loops, no parallax.
- **Cards.** There are no cards. Content sits on the page separated by hairlines. If something must be contained (portrait, TODO note), it gets a hairline border and paper-2 fill.

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

Intentional additions (no source component inventory existed; the set was authored for the site's needs): Accent formalizes the serif-accent-word motif; Reveal wraps the entrance animation; Ticker formalizes the NOW strip; CommandMenu (Cmd+K), AskAgent (live model Q&A grounded in site facts), and SpecsOverlay (press ".") are the site's three interactive signatures. Deliberately kept out: skill-badge grids, GitHub graphs, typing animations, particle or 3D backgrounds, AI-generated imagery, chatbot popups, dark mode.

## Index

- `styles.css` imports everything under `tokens/` (fonts, colors, typography, spacing, effects, base)
- `guidelines/` foundation specimen cards (Colors, Type, Spacing, Effects groups in the Design System tab)
- `components/primitives/`, `components/patterns/` reusable UI with props contracts and usage notes per component
- `ui_kits/portfolio/` the site: `index.html` (the home page), `project.html` (case study template), sections as JSX
- `templates/portfolio-site/` the consuming-project template for seeding a new page from this system
- `SKILL.md` agent-facing entry point

## Fonts

Webfonts load from Google Fonts CDN via `tokens/fonts.css`: Archivo (variable), Newsreader (variable, italics), Geist Mono. No binaries are vendored; if offline use is needed, download the ttfs into `assets/fonts/` and rewrite `tokens/fonts.css` as local `@font-face` rules.

## Known placeholders and confirmations pending

- Case study details (dashed TODO boxes in `project.html`)
- Photo: intentionally none for now; layout works either way
- Email: gmail at launch by design; swap to hamid@hamidettefagh.com when domain mail exists

Confirmed July 2026: LinkedIn is linkedin.com/in/hamidettefagh. InsightForce is "winner of a 63-entry company-wide hackathon".
