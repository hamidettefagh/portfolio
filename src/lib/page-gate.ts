import { compute, encodeAnswers, type Answers } from "./design-gate";

// The design gate, run on this site's own home page. The seven answers are my
// honest reading of the page; the verdict and the diagram are whatever the
// engine returns for them, the same function the tool at /agent-architecture
// runs. Change an answer here and the hero, the intro, and the link all follow.
export const PAGE_ANSWERS: Answers = {
  q1: "answer",
  q2: "spine",
  q3: "one",
  q4: "read",
  q5: "docs",
  q6: "interactive",
  q7: "guarded",
};

// The same seven signals in plain words, for the intro's decision record.
// Kept short on purpose: every row has to fit on one line at phone width, in
// the web font or its fallback, so nothing in the intro moves when fonts load.
export const PAGE_SIGNALS: { id: string; signal: string; read: string }[] = [
  { id: "q1", signal: "What it does", read: "Answers questions" },
  { id: "q2", signal: "How fixed it is", read: "One judgment call" },
  { id: "q3", signal: "How many jobs", read: "One" },
  { id: "q4", signal: "Can change", read: "Nothing, read-only" },
  { id: "q5", signal: "Its knowledge", read: "A fact sheet I keep" },
  { id: "q6", signal: "Who is waiting", read: "A person, live" },
  { id: "q7", signal: "Acting alone", read: "Within guardrails" },
];

const rec = compute(PAGE_ANSWERS, "general");

export const PAGE_GATE = {
  verdict: rec.shape,
  stages: rec.stages,
  href: `/agent-architecture?a=${encodeAnswers(PAGE_ANSWERS)}`,
};

// Five everyday cases, one per shape the gate can return, for the home page's
// "try a case" row. Each links to the tool with these exact answers filled in.
const CASE_INPUTS: { label: string; answers: Answers }[] = [
  {
    label: "Check an order status",
    answers: { q1: "answer", q2: "fixed", q3: "one", q4: "read", q5: "records", q6: "interactive", q7: "full" },
  },
  {
    label: "Hand off to a person",
    answers: { q1: "act", q2: "spine", q3: "few", q4: "undoable", q5: "live", q6: "interactive", q7: "guarded" },
  },
  {
    label: "Summarize a call",
    answers: { q1: "transform", q2: "open", q3: "one", q4: "read", q5: "model", q6: "async", q7: "draft" },
  },
  {
    label: "Answer policy questions",
    answers: { q1: "answer", q2: "open", q3: "one", q4: "read", q5: "docs", q6: "interactive", q7: "guarded" },
  },
  {
    label: "Serve several teams",
    answers: { q1: "act", q2: "open", q3: "many", q4: "irreversible", q5: "records", q6: "interactive", q7: "guarded" },
  },
];

export const GATE_CASES = CASE_INPUTS.map(({ label, answers }) => {
  const r = compute(answers, "general");
  return {
    label,
    verdict: r.shape,
    stages: r.stages,
    href: `/agent-architecture?a=${encodeAnswers(answers)}`,
  };
});
