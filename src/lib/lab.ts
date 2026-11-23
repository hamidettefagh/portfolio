import { LATEST, RUNS } from "@/data/evals/runs";
import { siteShipGate } from "./site-ship-gate";
import { PAGE_GATE } from "./page-gate";

// The lab: experiments I run in the open, each a question with a result.
// Results that come from data are computed from that data at build time, so
// the index can never claim more than the evidence behind it. Dates are the
// month each experiment shipped, matching the commits in the public repos;
// `updated` marks a later change that moved the result.

export type LabStatus = "running" | "shipped" | "planned";

export type LabEntry = {
  slug: string;
  title: string;
  status: LabStatus;
  date: string; // YYYY-MM
  updated?: string; // YYYY-MM
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
    date: "2026-11",
    question: "Does the agent on my home page hold its rules when someone pushes on it?",
    result:
      (RUNS.length > 1
        ? `The latest recorded run passed ${s.hardPassed} of ${s.hardChecks} hard checks and ${s.casesPassed} of ${s.cases} questions. The first run, at ${firstRun.casesPassed} of ${firstRun.cases}, caught a real gap in the agent’s fact sheet.`
        : `The first run passed ${s.hardPassed} of ${s.hardChecks} hard checks and ${s.casesPassed} of ${s.cases} questions, and caught a real gap in the agent’s fact sheet.`) +
      " Every answer now carries a trace of its model, time, tokens, and cost, and the set reruns after every production deploy.",
    href: "/lab/site-agent-evals",
  },
  {
    slug: "mcp",
    title: "The two gates, as an MCP server",
    status: "shipped",
    date: "2026-11",
    question: "Can another agent use my tools without a browser?",
    result:
      "Yes. Any MCP client can call five deterministic tools at /api/mcp, in either protocol era, with no sign-in and nothing it can change.",
    href: "/lab/mcp",
  },
  {
    slug: "voice-latency",
    title: "A voice agent’s latency budget",
    status: "shipped",
    date: "2026-11",
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
    date: "2026-11",
    question: "Can each figure from my work say what kind of evidence it is?",
    result:
      "One switch tags each figure from the work as production, testing, projection, count, computed, or illustrative, and each section with how it is made.",
    href: "/?receipts=on",
  },
  {
    slug: "site-ship-gate",
    title: "This site, through my ship gate",
    status: "shipped",
    date: "2026-11",
    question: "How does my own site agent score on the checklist I use on client agents?",
    result: `${gate.score} of ${gate.total}, ${gate.band.toLowerCase()}. Every gap is listed, and ${gate.deliberateGaps} of them are deliberate.`,
    href: "/how-its-built",
  },
  {
    slug: "page-gate",
    title: "The design gate, run on its own page",
    status: "shipped",
    date: "2026-11",
    question: "If my home page went through my own design gate, what would it be?",
    result:
      "A workflow with a model at one judgment point: the page is static, and its only model call is the ask widget. A first-visit intro plays the run. Its first version shifted the layout by 0.29 on a phone when fonts arrived; anchored to the top with fixed rows, production measures 0.000.",
    href: PAGE_GATE.href,
  },
  {
    slug: "house-style",
    title: "Can a prompt hold a house style?",
    status: "shipped",
    date: "2026-10",
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
    slug: "plugin-directory",
    title: "Listed in Anthropic’s plugin directory",
    status: "shipped",
    date: "2026-10",
    question: "Would the two gates hold up to Anthropic’s plugin review?",
    result:
      "Yes. The two-gates plugin, both gates plus the incident loop, passed review and is listed in the directory: search two-gates under Discover in the Claude apps.",
    href: "/two-gates",
  },
  {
    slug: "person-waiting",
    title: "When a person is waiting",
    status: "shipped",
    date: "2026-09",
    question: "Should the design gate’s answer change when a person is waiting on the other end?",
    result:
      "In the Agentforce lens, yes. Conversational work now gets Agent Script with the load-bearing decisions pinned; backend work stays a Flow with a prompt template. The classification itself never changes, and a 37-check suite holds both branches.",
    href: `${PAGE_GATE.href}&l=a`,
  },
  {
    slug: "design-gate-parity",
    title: "Does the browser tool agree with the skill?",
    status: "shipped",
    date: "2026-09",
    updated: "2026-11",
    question: "The design gate runs in two places, a Claude skill and this site. Do they ever disagree?",
    result:
      "First checked in September on six live cases, all matching. In November, every answer combination through both engines, in both lenses: 5,832 verdicts, 0 disagreements. The check is a script in the repo anyone can rerun.",
    href: "/agent-architecture",
  },
  {
    slug: "instrumented-tools",
    title: "Instrumenting my own tools",
    status: "shipped",
    date: "2026-08",
    question: "Would my own tools pass my own observability check?",
    result:
      "No. They counted page views and nothing else, which the ship gate would mark down. The design gate now records a start, a verdict, and a copy; the ship gate a start and a copy with its score. Each counts once per visit.",
    href: "/how-its-built",
  },
  {
    slug: "incident-to-eval",
    title: "Incident to eval",
    status: "shipped",
    date: "2026-07",
    updated: "2026-11",
    question: "Can a production failure become a test that runs on every change?",
    result:
      "A Claude skill turns an incident into a portable eval case, with a validator that pins the format. In November it came to the browser, and the browser’s validator agrees with the skill’s on all 429 test cases.",
    href: "/incident-to-eval",
  },
  {
    slug: "design-gate",
    title: "Agent, or workflow?",
    status: "shipped",
    date: "2026-07",
    question: "Can the call between an agent and a workflow be made by rules instead of taste?",
    result:
      "Yes. Seven questions decide one of five shapes, from a plain workflow to multi-agent, and the verdict is deterministic code. The page and a Claude skill run the same engine.",
    href: "/agent-architecture",
  },
  {
    slug: "ship-gate",
    title: "Agent production readiness",
    status: "shipped",
    date: "2026-07",
    question: "Can a checklist tell a demo agent from a production one?",
    result:
      "Twenty-eight checks across seven dimensions, drawn as a radar that shows where an agent is thin. It shipped as a page and a Claude skill the same day, and a filled-in score is a link anyone can open.",
    href: "/agent-production-readiness",
  },
  {
    slug: "bake-off",
    title: "Model bake-off",
    status: "planned",
    date: "2026-11",
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
    date: "2026-11",
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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// "2026-07" -> "July 2026"
export function monthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

// "2026-11" -> "Nov 2026", for the narrow date column.
export function monthShort(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1].slice(0, 3)} ${y}`;
}

// Newest first within a status; ties keep the order written above.
export function byNewest(a: LabEntry, b: LabEntry): number {
  return b.date.localeCompare(a.date);
}
