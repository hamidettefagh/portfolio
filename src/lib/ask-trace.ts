// The site agent's model and what each answer costs, shared by the API route
// (which measures) and the widget (which shows the measurement).

export const ASK_MODEL = "claude-haiku-4-5";

// Anthropic list prices for ASK_MODEL, US dollars per million tokens, as of
// November 2026. Used only to turn token counts into a cost estimate.
export const ASK_PRICE = { input: 1, output: 5 };

export type AskTrace = {
  model: string;
  modelMs: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  stopReason: string | null;
  styleBreaks: number;
  outputCheck?: boolean;
};

// Every check a question and its answer pass through, in the order they run.
// The client-name check only runs when its secret is set, so the trace adds it
// only when the server says it ran.
export function askGuardrails(outputCheck: boolean): string[] {
  return [
    "Browsers on other sites are refused",
    "A rate limit per visitor",
    "300-character limit",
    "Fact sheet only, no tools, no browsing",
    ...(outputCheck ? ["Client names checked on the way out"] : []),
    "House style enforced in code after the model answers",
  ];
}

export const FACT_SHEET_URL =
  "https://github.com/hamidettefagh/portfolio/blob/main/src/lib/agent-system.ts";

export function isTrace(v: unknown): v is AskTrace {
  if (typeof v !== "object" || v === null) return false;
  const t = v as Record<string, unknown>;
  return (
    typeof t.model === "string" &&
    typeof t.modelMs === "number" &&
    typeof t.inputTokens === "number" &&
    typeof t.outputTokens === "number" &&
    typeof t.costUsd === "number" &&
    typeof t.styleBreaks === "number"
  );
}

export function formatCost(usd: number): string {
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(3)}`;
}

export function formatMs(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(2)} s`;
}
