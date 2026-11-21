import { SHIP_GATE, SHIP_GATE_TOTAL, readinessBand } from "./ship-gate";

// The ship gate, run on this site's own agent: the ask widget. One entry per
// check, in checklist order, with the evidence for the call. "byDesign" marks
// checks met because the agent cannot do the risky thing at all; "deliberate"
// marks gaps I chose, not ones I missed.
export type SiteCheck = {
  met: boolean;
  how: string;
  byDesign?: boolean;
  deliberate?: boolean;
};

export const SITE_CHECKS: Record<string, SiteCheck[]> = {
  evaluation: [
    {
      met: false,
      how: "The golden set is written by me, from the questions visitors are likely to ask and the ones the rules exist for. No real questions are stored, so none can feed it.",
    },
    {
      met: true,
      how: "A GitHub workflow reruns the golden set against production after every production deploy, and fails on any hard check.",
    },
    {
      met: true,
      how: "Checks assert the facts an answer must contain and the claims it must never make, not just that it replied.",
    },
    {
      met: false,
      deliberate: true,
      how: "There is nothing to review: questions are not stored. That is a privacy choice, not an oversight.",
    },
  ],
  cost: [
    { met: true, how: "One model call per question, at most 400 output tokens, questions capped at 300 characters." },
    { met: true, how: "A small, fast model for short answers from one fact sheet." },
    { met: false, how: "Every answer reports its cost, but nothing on the site alerts on the running total yet." },
    { met: true, how: "Each answer shows its own cost, and each eval run adds them up." },
  ],
  observability: [
    {
      met: false,
      how: "Each answer carries its own trace back to the person who asked, but traces are not stored, so there is no record to query later.",
    },
    { met: true, byDesign: true, how: "The agent has no tools, so there are no tool calls to fail." },
    { met: true, how: "Every eval run reports median and p95 response time." },
    { met: false, deliberate: true, how: "Conversations are not stored, by choice." },
  ],
  guardrails: [
    { met: true, how: "Type and length checks, same-site requests only, and a per-visitor rate limit, before the model sees anything." },
    { met: true, how: "Eval cases for off-topic requests and prompt injection pass." },
    {
      met: true,
      how: "The fact sheet holds no client names, no dollar figures, and no contact details beyond email.",
    },
    {
      met: false,
      how: "The house style is enforced in code on every answer. A live check against the private client list is built into the endpoint but waits on its secret.",
    },
  ],
  oversight: [
    { met: true, how: "When it does not know, it says so and points to my email." },
    { met: true, byDesign: true, how: "It can take no actions at all." },
    {
      met: false,
      how: "There is no confidence check. The widget labels every answer as live model output that can be wrong.",
    },
    { met: true, how: "That is me, and the evals are public." },
  ],
  reliability: [
    { met: true, how: "The fact sheet, the route, and the checks all live in git." },
    { met: true, how: "Every deploy is immutable, and rolling back to the last one takes a single command." },
    { met: true, how: "If the model call fails, the widget says so and offers my email instead of guessing." },
    { met: false, how: "The rate limit is per server instance, and nothing has been load tested." },
  ],
  governance: [
    { met: true, byDesign: true, how: "It takes no consequential actions, and every change to it is a commit." },
    { met: true, how: "Written on this page: the site does not store questions or answers." },
    { met: true, how: "The API key lives only on the server, and the endpoint answers only same-site requests." },
    { met: false, how: "Changes ship from my main branch without a second reviewer." },
  ],
};

export function siteShipGate() {
  const perDimension = SHIP_GATE.map((d) => SITE_CHECKS[d.key].filter((c) => c.met).length);
  const score = perDimension.reduce((n, v) => n + v, 0);
  return {
    perDimension,
    score,
    total: SHIP_GATE_TOTAL,
    band: readinessBand(score, SHIP_GATE_TOTAL),
    deliberateGaps: Object.values(SITE_CHECKS)
      .flat()
      .filter((c) => c.deliberate).length,
  };
}
