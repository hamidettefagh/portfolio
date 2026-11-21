// The ship gate's checklist: seven dimensions, four checks each. One list,
// read by the interactive diagnostic, the site's own scorecard, and the MCP
// server, so the three can never drift apart. Mirrors the 28-check rubric in
// the agent-production-readiness skill.

export type ShipGateDimension = {
  key: string;
  label: string;
  items: string[];
};

export const SHIP_GATE: ShipGateDimension[] = [
  {
    key: "evaluation",
    label: "Evaluation",
    items: [
      "An evaluation set built from real user inputs, not hand-picked happy paths.",
      "Evals run automatically when the prompt, tools, or model change.",
      "You measure grounding and accuracy, not just whether a reply was produced.",
      "Someone reviews a sample of real conversations on a set cadence.",
    ],
  },
  {
    key: "cost",
    label: "Cost",
    items: [
      "A token or credit budget per conversation that you actually enforce.",
      "The model is right-sized for the task, not the largest one by default.",
      "Cost is monitored, with an alert before the bill surprises you.",
      "You know the cost per resolved conversation, not just per call.",
    ],
  },
  {
    key: "observability",
    label: "Observability",
    items: [
      "Every conversation is traced end to end, tools included.",
      "Tool-call success and failure rates are tracked, not assumed.",
      "Latency is measured at the tail, not just the average.",
      "You can pull up any past conversation and see what happened.",
    ],
  },
  {
    key: "guardrails",
    label: "Guardrails",
    items: [
      "Inputs are validated before they reach the model.",
      "The agent stays in scope and declines work outside it.",
      "Sensitive data is handled deliberately, not passed through by accident.",
      "Outputs are checked before they reach a customer or a system of record.",
    ],
  },
  {
    key: "oversight",
    label: "Human oversight",
    items: [
      "There is a clear path to a human when the agent should step back.",
      "High-risk actions require confirmation before they run.",
      "Low-confidence answers are caught rather than sent anyway.",
      "The people on the hook for the agent know how it behaves.",
    ],
  },
  {
    key: "reliability",
    label: "Reliability",
    items: [
      "Prompts and agent config are versioned like code.",
      "You can roll back a bad change in minutes, not days.",
      "The agent degrades gracefully when a tool or model is down.",
      "You have tested what happens under load and under failure.",
    ],
  },
  {
    key: "governance",
    label: "Governance",
    items: [
      "Every consequential action leaves an audit trail.",
      "Data handling and retention are written down and followed.",
      "Access to the agent and its tools is controlled and reviewed.",
      "Changes go through review before they reach production.",
    ],
  },
];

export const SHIP_GATE_TOTAL = SHIP_GATE.reduce((n, d) => n + d.items.length, 0);

export function readinessBand(count: number, total: number): string {
  if (count === 0) return "Score your system";
  const pct = count / total;
  if (pct >= 0.9) return "Production ready";
  if (pct >= 0.7) return "Nearly there";
  if (pct >= 0.4) return "On the way";
  return "This is a demo";
}

// Strongest and weakest dimensions for a set of per-dimension counts.
export function diagnose(perDimension: number[]) {
  const fracs = perDimension.map((v, i) => v / SHIP_GATE[i].items.length);
  const max = Math.max(...fracs);
  const min = Math.min(...fracs);
  return {
    strongest: SHIP_GATE.filter((_d, i) => fracs[i] === max).map((d) => d.label),
    gaps: SHIP_GATE.filter((_d, i) => fracs[i] === min && fracs[i] < 1).map((d) => d.label),
  };
}
