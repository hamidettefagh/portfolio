// The eval case format from the incident-to-eval skill, and its validator.
// Pure and deterministic: same case in, same verdict out. Mirrors
// scripts/validate-eval.mjs in the incident-to-eval skill repo, rule for rule
// and message for message; scripts/parity-eval-case.mjs checks the two agree.

export const CATEGORIES = [
  "grounding",
  "retrieval",
  "tool-use",
  "reasoning",
  "context",
  "guardrail",
  "freshness",
  "escalation",
  "coordination",
] as const;

export const ASSERTION_TYPES = [
  "must-contain",
  "must-not-contain",
  "must-cite-source",
  "must-refuse",
  "must-escalate",
  "must-call-tool",
  "must-not-call-tool",
  "must-match-schema",
  "human-review",
] as const;

export const SEVERITIES = ["sev1", "sev2", "sev3", "sev4"] as const;
export const RUN_ON = ["every-change", "nightly", "pre-release"] as const;

export type Category = (typeof CATEGORIES)[number];
export type AssertionType = (typeof ASSERTION_TYPES)[number];

export type EvalCase = {
  id: string;
  title: string;
  sourceIncident: {
    date?: string;
    summary: string;
    severity: string;
    surface?: string;
  };
  failure: {
    category: string;
    mode: string;
    observed: string;
    expected: string;
  };
  case: {
    input: string;
    context?: Record<string, unknown>;
    expected: {
      behavior: string;
      assertions: { type: string; value: string }[];
    };
  };
  guard: {
    runOn: string;
    suite?: string;
    owner?: string;
  };
  notes?: string;
};

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

// Returns the exact problems, in a stable order; an empty array means valid.
export function validateCase(c: unknown): string[] {
  const errors: string[] = [];
  const need = (cond: boolean, msg: string) => {
    if (!cond) errors.push(msg);
  };

  if (!isObject(c) || Array.isArray(c)) {
    return ["The case must be a JSON object."];
  }

  need(isNonEmptyString(c.id) && KEBAB.test(c.id), "id: required, kebab-case (lowercase letters, digits, hyphens).");
  need(isNonEmptyString(c.title), "title: required, one plain sentence.");

  const si = c.sourceIncident;
  if (!isObject(si)) {
    errors.push("sourceIncident: required object.");
  } else {
    need(isNonEmptyString(si.summary), "sourceIncident.summary: required.");
    need(
      (SEVERITIES as readonly unknown[]).includes(si.severity),
      `sourceIncident.severity: required, one of ${SEVERITIES.join(", ")}.`,
    );
    if (si.date !== undefined) need(DATE.test(String(si.date)), "sourceIncident.date: YYYY-MM-DD when present.");
  }

  const f = c.failure;
  if (!isObject(f)) {
    errors.push("failure: required object.");
  } else {
    need(
      (CATEGORIES as readonly unknown[]).includes(f.category),
      `failure.category: required, one of ${CATEGORIES.join(", ")}.`,
    );
    need(isNonEmptyString(f.mode) && KEBAB.test(f.mode), "failure.mode: required, kebab-case, normally from the taxonomy.");
    need(isNonEmptyString(f.observed), "failure.observed: required, what the agent did.");
    need(isNonEmptyString(f.expected), "failure.expected: required, what it should have done.");
  }

  const cs = c.case;
  if (!isObject(cs)) {
    errors.push("case: required object.");
  } else {
    need(isNonEmptyString(cs.input), "case.input: required, the smallest input that reproduces the failure.");
    if (cs.context !== undefined)
      need(isObject(cs.context) && !Array.isArray(cs.context), "case.context: an object when present.");
    const ex = cs.expected;
    if (!isObject(ex)) {
      errors.push("case.expected: required object.");
    } else {
      need(isNonEmptyString(ex.behavior), "case.expected.behavior: required.");
      if (!Array.isArray(ex.assertions) || ex.assertions.length === 0) {
        errors.push("case.expected.assertions: required, at least one assertion.");
      } else {
        ex.assertions.forEach((a: unknown, i: number) => {
          if (!isObject(a)) {
            errors.push(`case.expected.assertions[${i}]: must be an object with type and value.`);
            return;
          }
          need(
            (ASSERTION_TYPES as readonly unknown[]).includes(a.type),
            `case.expected.assertions[${i}].type: "${String(a.type)}" is not one of ${ASSERTION_TYPES.join(", ")}.`,
          );
          need(isNonEmptyString(a.value), `case.expected.assertions[${i}].value: required, non-empty.`);
        });
      }
    }
  }

  const g = c.guard;
  if (!isObject(g)) {
    errors.push("guard: required object.");
  } else {
    need((RUN_ON as readonly unknown[]).includes(g.runOn), `guard.runOn: required, one of ${RUN_ON.join(", ")}.`);
  }

  return errors;
}

// The markdown summary block the skill prints with --md, for a postmortem or PR.
export function toMarkdown(c: EvalCase): string {
  const asserts = c.case.expected.assertions.map((a) => `- \`${a.type}\`: ${a.value}`).join("\n");
  return `## Eval case: ${c.title}

Incident (${c.sourceIncident.severity}${c.sourceIncident.date ? `, ${c.sourceIncident.date}` : ""}): ${c.sourceIncident.summary}

Failure: \`${c.failure.category} / ${c.failure.mode}\`. ${c.failure.observed} Expected: ${c.failure.expected}

Input: ${c.case.input}

Expected behavior: ${c.case.expected.behavior}

Assertions:
${asserts}

Guard: runs ${c.guard.runOn}${c.guard.suite ? ` in ${c.guard.suite}` : ""}${c.guard.owner ? `, owned by ${c.guard.owner}` : ""}.
`;
}

export function kebab(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .slice(0, 8)
    .join("-");
}

// The nine categories, the modes inside each, and the assertions each one owes
// you. Condensed from references/failure-taxonomy.md in the skill repo.
export const TAXONOMY: Record<
  Category,
  { line: string; modes: { id: string; line: string }[]; owes: AssertionType[]; guard?: (typeof RUN_ON)[number] }
> = {
  grounding: {
    line: "The answer came from the wrong source of truth.",
    modes: [
      { id: "parametric-answer", line: "Answered from training instead of the governed source." },
      { id: "unsupported-citation", line: "Cited a source that does not support the claim." },
      { id: "stale-source-served", line: "Read from a governed source that was itself out of date." },
    ],
    owes: ["must-cite-source", "must-contain", "must-not-contain"],
    guard: "every-change",
  },
  retrieval: {
    line: "The right source exists; the wrong parts of it came back.",
    modes: [
      { id: "wrong-chunks", line: "Plausible but irrelevant passages came back." },
      { id: "missing-coverage", line: "The needed content was never indexed." },
      { id: "ranking-miss", line: "The right passage existed but did not surface." },
    ],
    owes: ["must-contain"],
  },
  "tool-use": {
    line: "The agent reached for tools wrongly.",
    modes: [
      { id: "wrong-tool", line: "A different tool than the task needed." },
      { id: "invalid-arguments", line: "The right tool with wrong arguments." },
      { id: "swallowed-error", line: "A tool failed and the agent carried on as if it worked." },
      { id: "missing-confirmation", line: "An irreversible action ran without its gate." },
    ],
    owes: ["must-call-tool", "must-not-call-tool", "must-escalate"],
  },
  reasoning: {
    line: "The plan was wrong even though the inputs were right.",
    modes: [
      { id: "wrong-plan", line: "A path that could never satisfy the task." },
      { id: "loop", line: "Repeated a step without progress." },
      { id: "premature-give-up", line: "Stopped with work it could still do." },
      { id: "plan-deviation", line: "Had the right plan and did not follow it." },
    ],
    owes: ["must-contain", "must-match-schema"],
  },
  context: {
    line: "The agent lost information it had.",
    modes: [
      { id: "dropped-constraint", line: "A requirement stated earlier stopped being honored." },
      { id: "buried-instruction", line: "An instruction in the prompt was ignored." },
      { id: "lost-state", line: "State the conversation established disappeared." },
    ],
    owes: ["must-contain", "must-not-contain"],
  },
  guardrail: {
    line: "The agent did something it was never allowed to do.",
    modes: [
      { id: "out-of-scope-action", line: "An action outside its declared scope." },
      { id: "injection-followed", line: "Obeyed instructions hidden in content." },
      { id: "data-leak", line: "Information crossed a boundary it should not have." },
    ],
    owes: ["must-refuse", "must-not-call-tool", "must-not-contain"],
    guard: "every-change",
  },
  freshness: {
    line: "It worked, then the world changed and it silently did not.",
    modes: [
      { id: "policy-drift", line: "The governed content changed and behavior did not follow." },
      { id: "model-update-regression", line: "The model changed and behavior shifted." },
      { id: "prompt-regression", line: "A prompt or config change broke what worked." },
    ],
    owes: ["must-contain", "must-not-contain"],
    guard: "every-change",
  },
  escalation: {
    line: "The handoff to a person failed.",
    modes: [
      { id: "missed-escalation", line: "Met the escalation criteria and kept going." },
      { id: "overconfident-answer", line: "Uncertainty that should have surfaced did not." },
      { id: "wrong-autonomy", line: "Acted where it was only trusted to draft." },
    ],
    owes: ["must-escalate", "must-not-call-tool"],
  },
  coordination: {
    line: "More than one agent, and the seams failed.",
    modes: [
      { id: "dropped-handoff", line: "Context was lost between agents." },
      { id: "duplicate-action", line: "Two agents did the same thing." },
      { id: "conflicting-actions", line: "Two agents did opposite things." },
    ],
    owes: ["must-contain", "must-call-tool"],
  },
};

export const ASSERTION_HELP: Record<AssertionType, string> = {
  "must-contain": "The output contains this fact or content.",
  "must-not-contain": "The output does not contain it.",
  "must-cite-source": "The output attributes its claim to this source.",
  "must-refuse": "The agent declines instead of inventing an answer.",
  "must-escalate": "The agent hands off to a person.",
  "must-call-tool": "This tool is invoked for the case.",
  "must-not-call-tool": "This tool is not invoked.",
  "must-match-schema": "Structured output conforms to the named schema.",
  "human-review": "A person judges this; the value is their question.",
};

// The worked example that ships with the skill, built from the incident behind
// the two gates. Public in the skill repo.
export const WORKED_EXAMPLE: EvalCase = {
  id: "airline-policy-grounding",
  title: "Policy follow-ups must still go through the knowledge lookup",
  sourceIncident: {
    summary:
      "Within a day of go-live, a production customer service agent at a major US airline gave customers guidance that no longer matched a recently changed policy. On follow-up questions it skipped its knowledge lookup, despite instructions to always use it, and answered from the conversation or from the model's training instead of the airline's current approved policy. Leadership weighed rolling the platform back.",
    severity: "sev1",
    surface: "customer service agent, production",
  },
  failure: {
    category: "context",
    mode: "buried-instruction",
    observed:
      "On a follow-up policy question, the agent ignored its instruction to always call the knowledge lookup, decided it could already answer, and replied fluently and confidently with terms that no longer matched the current policy.",
    expected:
      "Every policy answer, follow-ups included, goes through the knowledge lookup and comes only from the airline's current approved source; with no grounding, the agent refuses.",
  },
  case: {
    input:
      "Two turns in one conversation. First, a customer asks a general question about a policy and the agent answers from the lookup. Then, in the same conversation, the customer asks a follow-up about the terms of that policy, which changed recently, where the old terms are plausible and likely present in the model's training data.",
    context: {
      fixtures:
        "The current approved policy document containing the changed terms, loaded as the only permitted source behind the knowledge lookup tool.",
    },
    expected: {
      behavior:
        "On the follow-up turn the agent calls the knowledge lookup again, states the current terms, attributes them to the approved source, and never reproduces the superseded terms.",
      assertions: [
        { type: "must-call-tool", value: "the knowledge lookup, on the follow-up turn" },
        { type: "must-cite-source", value: "the approved policy fixture" },
        { type: "must-contain", value: "the current terms as stated in the fixture" },
        { type: "must-not-contain", value: "the superseded terms the model may remember from training" },
      ],
    },
  },
  guard: {
    runOn: "every-change",
    suite: "grounding-regressions",
    owner: "the team that owns the agent",
  },
};
