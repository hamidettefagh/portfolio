// Every recorded run of the site agent's eval set, oldest first. Each file is
// the raw output of scripts/eval-site-agent.mjs, unedited.
import run1 from "./site-agent-run-1.json";
import run2 from "./site-agent-run-2.json";
import type { AskTrace } from "@/lib/ask-trace";

export type EvalCheck = { name: string; scope: string; hard: boolean; pass: boolean | null };

export type EvalResult = {
  id: string;
  question: string;
  answer: string;
  error: string | null;
  latencyMs: number;
  trace: AskTrace | null;
  checks: EvalCheck[];
  pass: boolean;
};

export type EvalSummary = {
  cases: number;
  casesPassed: number;
  errors?: number;
  checks: number;
  checksPassed: number;
  hardChecks: number;
  hardPassed: number;
  softChecks: number;
  softPassed: number;
  skippedChecks: number;
  latencyP50Ms: number | null;
  latencyP95Ms: number | null;
  modelP50Ms: number | null;
  modelP95Ms: number | null;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  styleBreaksCaught: number;
  answersWithStyleBreaks: number;
  denylist: string;
};

export type EvalReport = {
  ranAt: string;
  target: string;
  model: string | null;
  summary: EvalSummary;
  results: EvalResult[];
};

export const RUNS: { label: string; note: string; report: EvalReport }[] = [
  {
    label: "Run 1",
    note: "Baseline, on the fact sheet as it was. It caught a real miss: asked where to try the design gate, the agent sent people to the plugin and never mentioned the tool on this site, because the fact sheet never said the two were the same thing. The other two misses were questions about things the fact sheet did not cover yet.",
    report: run1 as EvalReport,
  },
  {
    label: "Run 2",
    note: "After the fact sheet fix, on the live site, with traces. Every check passed, and the three misses from run 1 are gone. Passing is not the same as right, though: reading the answers, the one about its model gave a reason for the choice that no fact supports. The fact sheet now states the reason, and a new question in the set checks for it.",
    report: run2 as EvalReport,
  },
];

export const LATEST = RUNS[RUNS.length - 1];
