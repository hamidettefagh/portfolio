// The model bake-off: one spec, locked content, several models, scored by
// code. The spec and the rubric are final; the builds have not run.

export const SPEC: { title: string; body: string[] }[] = [
  {
    title: "Goal",
    body: [
      "Someone lands on the home page, a hiring manager, a recruiter, or an engineer, and within a minute knows what I do, has seen proof that it works in production, and has a way to test my thinking for themselves.",
    ],
  },
  {
    title: "The one message",
    body: ["I design, build, and ship production agent systems for the enterprise, and I can show the evidence."],
  },
  {
    title: "Sections, in this order",
    body: [
      "Hero: the headline, the role line, a way into the work and a way to get in touch.",
      "Selected work: five engagements, with every figure exactly as the content file gives it.",
      "Tools: the design gate and the ship gate, each one runnable on the page, not just linked.",
      "Ask: the live agent, calling the existing endpoint, labeled as live model output.",
      "About, experience, and contact.",
    ],
  },
  {
    title: "Content rules",
    body: [
      "Every visible word comes from the content file. No new claims, no new numbers, no client names, no rewording of figures.",
      "Sentence case. No em dashes, no exclamation points, no emoji.",
    ],
  },
  {
    title: "Design rules",
    body: [
      "Warm paper, dark ink, one accent used sparingly. No dark mode.",
      "Works at 375 pixels wide with no sideways scrolling. Visible keyboard focus. Motion only when it explains something, and none under reduced motion.",
    ],
  },
  {
    title: "Build rules",
    body: [
      "Next.js App Router and Tailwind. No other UI or animation libraries.",
      "One attempt and one round of fixes per model, from the same prompt and the same content file.",
    ],
  },
];

export const RUBRIC: { criterion: string; how: string; weight: number; gate?: string }[] = [
  { criterion: "Content fidelity", how: "Every visible string is matched against the content file; anything not in it counts as invented.", weight: 20, gate: "Any invented number fails the build" },
  { criterion: "Spec coverage", how: "A script checks each required section, in order, and that the tools actually run.", weight: 20 },
  { criterion: "Accessibility", how: "Lighthouse and axe, on phone and desktop settings.", weight: 15 },
  { criterion: "Performance", how: "Lighthouse performance on the phone setting.", weight: 15 },
  { criterion: "Layout shift", how: "Cumulative layout shift on the phone setting.", weight: 10, gate: "Above 0.1 fails the build" },
  { criterion: "House style", how: "Em dashes, exclamation points, and emoji in the rendered text.", weight: 10 },
  { criterion: "Page weight", how: "First-load JavaScript for the home page.", weight: 5 },
  { criterion: "Cost to build", how: "Tokens, dollars, and wall-clock time, reported for every build.", weight: 5 },
];

// The hand-built page, measured on production. It is the source of the
// content, so fidelity does not apply to it.
export const BASELINE = {
  measured: "November 21, 2026",
  runs: "Lighthouse on production, two runs on the phone setting and one on desktop; the phone runs agreed",
  mobile: { performance: 96, accessibility: 100, bestPractices: 100, seo: 100, cls: "0.000" },
  desktop: { performance: 100, accessibility: 100, bestPractices: 100, seo: 100, cls: "0.000" },
};
