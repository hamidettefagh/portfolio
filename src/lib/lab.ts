import { LATEST, RUNS } from "@/data/evals/runs";
import { siteShipGate } from "./site-ship-gate";
import { PAGE_GATE } from "./page-gate";

// The lab: experiments I run in the open, each a question with a result.
// Results that come from data are computed from that data at build time, so
// the index can never claim more than the evidence behind it.

export type LabStatus = "running" | "shipped" | "planned";

export type LabEntry = {
  slug: string;
  title: string;
  status: LabStatus;
  date: string;
  question: string;
  result: string;
  href?: string;
};

const s = LATEST.report.summary;
const gate = siteShipGate();
const firstRun = RUNS[0].report.summary;

export const LAB: LabEntry[] = [
  {
    slug: "site-agent-evals",
    title: "Evals for this site’s agent",
    status: "running",
    date: "November 2026",
    question: "Does the agent on my home page hold its rules when someone pushes on it?",
    result:
      RUNS.length > 1
        ? `The latest recorded run passed ${s.hardPassed} of ${s.hardChecks} hard checks and ${s.casesPassed} of ${s.cases} questions. The first run, at ${firstRun.casesPassed} of ${firstRun.cases}, caught a real gap in the agent’s fact sheet. It reruns after every production deploy.`
        : `The first run passed ${s.hardPassed} of ${s.hardChecks} hard checks and ${s.casesPassed} of ${s.cases} questions, and caught a real gap in the agent’s fact sheet. It reruns after every production deploy.`,
    href: "/lab/site-agent-evals",
  },
  {
    slug: "mcp",
    title: "The two gates, as an MCP server",
    status: "shipped",
    date: "November 2026",
    question: "Can another agent use my tools without a browser?",
    result:
      "Yes. Any MCP client can call five deterministic tools at /api/mcp, in either protocol era, with no sign-in and nothing it can change.",
    href: "/lab/mcp",
  },
  {
    slug: "ask-trace",
    title: "A trace with every answer",
    status: "shipped",
    date: "November 2026",
    question: "What did one answer cost, how long did it take, and what checked it?",
    result:
      "Every answer from the agent on my home page now shows its model, its time, its tokens, its cost, and the guardrails it passed.",
    href: "/#ask",
  },
  {
    slug: "incident-to-eval",
    title: "Incident to eval, in the browser",
    status: "shipped",
    date: "November 2026",
    question: "Can the third skill work without an editor?",
    result:
      "The form writes the skill’s case format, and its validator agrees with the skill’s on all 429 test cases, message for message.",
    href: "/incident-to-eval",
  },
  {
    slug: "voice-latency",
    title: "A voice agent’s latency budget",
    status: "shipped",
    date: "November 2026",
    question:
      "Where do the milliseconds go between a caller finishing a sentence and hearing the agent answer?",
    result:
      "An interactive budget, stage by stage, built from published ranges, with your own network round trip measured live.",
    href: "/lab/voice-latency",
  },
  {
    slug: "receipts",
    title: "Receipts mode",
    status: "shipped",
    date: "November 2026",
    question: "Can each figure from my work say what kind of evidence it is?",
    result:
      "One switch tags each figure from the work as production, testing, projection, count, computed, or illustrative, and each section with how it is made.",
    href: "/?receipts=on",
  },
  {
    slug: "site-ship-gate",
    title: "This site, through my ship gate",
    status: "shipped",
    date: "November 2026",
    question: "How does my own site agent score on the checklist I use on client agents?",
    result: `${gate.score} of ${gate.total}, ${gate.band.toLowerCase()}. Every gap is listed, and ${gate.deliberateGaps} of them are deliberate.`,
    href: "/how-its-built",
  },
  {
    slug: "design-gate-parity",
    title: "Does the browser tool agree with the skill?",
    status: "shipped",
    date: "November 2026",
    question: "The design gate runs in two places, a Claude skill and this site. Do they ever disagree?",
    result:
      "Every answer combination through both engines, in both lenses: 5,832 verdicts, 0 disagreements. The check is a script in the repo anyone can rerun.",
    href: "/agent-architecture",
  },
  {
    slug: "house-style",
    title: "Can a prompt hold a house style?",
    status: "shipped",
    date: "November 2026",
    question: "If the system prompt says no em dashes and no exclamation points, does the model comply?",
    // The count needs traces, which runs before the trace existed do not have.
    result:
      "Not reliably, so the rule moved into code that runs after the model answers, and the trace counts every time it steps in." +
      (s.modelP50Ms
        ? ` In the latest recorded run, the model broke the style in ${s.answersWithStyleBreaks} of ${s.cases} answers; the checks confirm none of those breaks reached the page.`
        : ""),
    href: "/lab/site-agent-evals",
  },
  {
    slug: "intro-layout-shift",
    title: "What does a first-visit intro cost?",
    status: "shipped",
    date: "November 2026",
    question: "Can a page animate on a first visit without moving under the reader?",
    result:
      "The first version shifted the layout by 0.29 on a phone when web fonts arrived. Anchoring it to the top with fixed rows brought the shift back to the page’s own baseline, about 0.04 in local runs from the fonts themselves and 0.000 in two production runs, with the mobile performance score unchanged.",
    href: "/",
  },
  {
    slug: "page-gate",
    title: "The design gate, run on its own page",
    status: "shipped",
    date: "November 2026",
    question: "If my home page went through my own design gate, what would it be?",
    result:
      "A workflow with a model at one judgment point: the page is static, and its only model call is the ask widget. The first-visit intro shows the run.",
    href: PAGE_GATE.href,
  },
  {
    slug: "bake-off",
    title: "Model bake-off",
    status: "planned",
    date: "November 2026",
    question:
      "Given one spec and locked content, which model builds the best version of my home page, measured rather than judged?",
    result:
      "The spec, the content rules, and the scoring are written, and the hand-built page has its baseline. The builds have not run.",
    href: "/lab/bake-off",
  },
  {
    slug: "call-replay",
    title: "Call replay",
    status: "planned",
    date: "November 2026",
    question: "What does a voice agent call look like turn by turn, with the timing that makes it feel human or not?",
    result: "The player is built and runs a scripted call. It waits on a real, consented recording.",
    href: "/lab/call-replay",
  },
];

export const LAB_STATUS: Record<LabStatus, { label: string; note: string }> = {
  running: { label: "Running", note: "Measured again on every change" },
  shipped: { label: "Shipped", note: "Done, with a result" },
  planned: { label: "Planned", note: "Designed, waiting on something real" },
};
