# Portfolio UI kit

The personal site for Hamid Ettefagh, hamidettefagh.com. Two screens:

- `index.html` — "Field Notes" single-page home: sticky nav, hero with serif accent word and NOW ticker, hairline work list, ask-my-agent panel, about with principles, experience, contact.
- `project.html` — Case study detail template. Real title and outcome, dashed mono boxes mark where real content still needs to be added.

Screens are composed from the system components (`components/primitives`, `components/patterns`) plus kit-local sections (`Hero.jsx`, `WorkSection.jsx`, `AskSection.jsx`, `AboutSection.jsx`, `ExperienceSection.jsx`, `ContactSection.jsx`, `SiteNav.jsx`, `CaseStudy.jsx`, `Reveal.jsx`).

Work items live in `WorkSection.jsx` as `WORK_ITEMS`. Industry descriptors only, never client names. No dollar figures beyond "eight-figure" and "nine-figure" phrasing.

Interactive features: sticky nav with ⌘K pill, Cmd+K command menu (sections, ask agent, copy email, specs, LinkedIn), ask-my-agent panel (live model, grounded in site facts, offline fallback), "view specs" overlay (press "." or the footer link), live "Updated <month year>" ticker item, copy-email contact row, scroll-reveal sections.

Known placeholders: case study details, photo intentionally omitted for now. LinkedIn (in/hamidettefagh) and InsightForce ("winner of a 63-entry hackathon") are confirmed.
