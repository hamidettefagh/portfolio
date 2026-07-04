"use client";

import { useMemo, useState } from "react";
import { ArchitectureDiagram } from "@/components/patterns/ArchitectureDiagram";

type Answers = Record<string, string>;

const QUESTIONS: { id: string; q: string; options: { id: string; label: string }[] }[] = [
  {
    id: "q1",
    q: "What does it mainly do?",
    options: [
      { id: "answer", label: "Answer questions from a body of knowledge" },
      { id: "act", label: "Take actions in other systems" },
      { id: "transform", label: "Analyze or transform input you give it" },
    ],
  },
  {
    id: "q2",
    q: "How much of the work follows fixed steps or rules?",
    options: [
      { id: "fixed", label: "Every step is a fixed rule or lookup" },
      { id: "spine", label: "A fixed backbone with one or two real judgment calls" },
      { id: "open", label: "Open-ended, every case is genuinely different" },
    ],
  },
  {
    id: "q3",
    q: "How many distinct jobs does it span?",
    options: [
      { id: "one", label: "One focused job" },
      { id: "few", label: "A few related steps" },
      { id: "many", label: "Several specialties, with handoffs" },
    ],
  },
  {
    id: "q4",
    q: "How reversible are its actions?",
    options: [
      { id: "read", label: "Read-only, or suggestions a person acts on" },
      { id: "undoable", label: "Writes that can be undone" },
      { id: "irreversible", label: "Irreversible or high-impact" },
    ],
  },
  {
    id: "q5",
    q: "Where does its knowledge live?",
    options: [
      { id: "model", label: "General knowledge the model already has" },
      { id: "docs", label: "Stable documents" },
      { id: "live", label: "Changing or real-time data" },
      { id: "records", label: "Structured records in a database or CRM" },
    ],
  },
  {
    id: "q6",
    q: "What are the latency and scale needs?",
    options: [
      { id: "interactive", label: "Interactive, a person is waiting" },
      { id: "async", label: "Background or async" },
      { id: "highvolume", label: "High volume, cost-sensitive" },
    ],
  },
  {
    id: "q7",
    q: "How much should it act on its own?",
    options: [
      { id: "draft", label: "Draft only, a person approves" },
      { id: "guarded", label: "Autonomous within guardrails" },
      { id: "full", label: "Fully autonomous" },
    ],
  },
];

type Kind = "workflow" | "hybrid" | "call" | "multi" | "tools";

type Node = { label: string; accent?: boolean };

type Recommendation = {
  shape: string;
  shapeDetail: string;
  knowledge: string;
  humans: string;
  model: string;
  risks: string[];
  stages: Node[];
};

const VERDICTS: Record<Kind, { title: string; detail: string }> = {
  workflow: {
    title: "This is a workflow, not an agent",
    detail:
      "The steps are known and the rules are clear. Build this as deterministic automation. A model in this path buys cost, latency, and nondeterminism you did not need.",
  },
  hybrid: {
    title: "A workflow with a model at the judgment points",
    detail:
      "Automate the fixed process. Put the model only at the genuine judgment points, wrapped in deterministic control flow.",
  },
  call: {
    title: "A single model call",
    detail:
      "One structured call with clear instructions and a few strong examples. No agent loop, no tools. Where a single call passes your evals, an agent is pure overhead.",
  },
  multi: {
    title: "Multi-agent",
    detail:
      "A coordinator that delegates to focused specialists, each owning one domain and handing a result back. Default to a single agent with tools first. Every handoff is latency plus a new failure mode, so this is the most expensive shape here by a wide margin.",
  },
  tools: {
    title: "Single agent with tools",
    detail:
      "One agent with a small, well-defined set of tools. Let it reason over what varies and lean on plain code for what does not. Keep the tool surface tight and each tool boring.",
  },
};

function knowledgeNode(q5: string): Node | null {
  if (q5 === "docs") return { label: "Retrieval" };
  if (q5 === "records") return { label: "Query tools" };
  if (q5 === "live") return { label: "Live tools" };
  return null;
}

function classify(a: Answers): Kind {
  if (a.q2 === "fixed") return "workflow";
  if (a.q2 === "spine") return "hybrid";
  // q2 === "open": genuine judgment on every case
  if (a.q3 === "many") return "multi";
  if (a.q3 === "one" && a.q5 === "model" && (a.q1 === "answer" || a.q1 === "transform")) return "call";
  return "tools";
}

function compute(a: Answers): Recommendation {
  const kind = classify(a);
  const verdict = VERDICTS[kind];

  // Knowledge. A workflow has no model in the retrieval path, so it never does RAG.
  let knowledge: string;
  if (kind === "workflow") {
    knowledge = "Look it up deterministically, by key or query. No vector search, and no model in the retrieval path.";
  } else {
    switch (a.q5) {
      case "docs":
        knowledge =
          "RAG over a vector store. Retrieval quality is your ceiling, so evaluate it on its own before you blame the model.";
        break;
      case "live":
        knowledge = "Call tools or APIs at query time. RAG alone would hand back stale answers.";
        break;
      case "records":
        knowledge =
          "Give it scoped, parameterized query tools over the system of record, not raw text-to-query and not a vector store. If you must generate queries, constrain them to a safe, read-only surface.";
        break;
      default:
        knowledge = "No retrieval. Lean on the model and anchor it with a few strong examples.";
    }
  }

  let humans: string;
  if (kind === "workflow")
    humans =
      "No agent in this path, so oversight is ordinary code review and change control, not approval gates. If a step is irreversible, gate it deterministically and log it.";
  else if (a.q4 === "irreversible")
    humans = "Put a confirmation gate before any irreversible action, log every call, and give a person the escape hatch.";
  else if (a.q7 === "draft")
    humans = "The agent drafts, a person approves and sends. No autonomous writes yet.";
  else if (a.q7 === "guarded")
    humans =
      "Autonomous within guardrails, with a confidence threshold that escalates uncertain cases to a person.";
  else if (a.q7 === "full" && a.q4 === "read")
    humans =
      "Light oversight is fine because it cannot take action directly. The residual risk is a confident wrong answer a person acts on, so keep the reasoning visible. Earn more autonomy with evals and traces.";
  else humans = "Keep a person on the uncertain and the irreversible. Let the rest run.";

  // Model. Shape wins over the latency tuning: a workflow or hybrid pins the answer.
  let model: string;
  if (kind === "workflow")
    model = "Little to none. If one step genuinely needs judgment, make it a single call, not the spine of the system.";
  else if (kind === "hybrid")
    model =
      "One call at each judgment point, right-sized for that decision. The workflow around it stays deterministic and testable.";
  else if (a.q6 === "interactive")
    model = "Favor a fast, smaller model on the interactive path, and escalate to a frontier model only for the steps that need it.";
  else if (a.q6 === "highvolume")
    model = "Right-size hard. The cheapest model that passes your evals, not the biggest one available.";
  else model = "You can afford a frontier model and more steps. Spend the tokens where they buy accuracy.";

  // Risks. The shape's headline risk leads; cost earns a seat whenever volume is the pressure.
  const shapeRisk: Record<Kind, string> = {
    workflow:
      "The pressure will be to make it agentic, because that is what ships in demos. Resist it. Add a model only at the exact step where the work stops being predictable, and keep the rest as code you can test. Every model step you chain multiplies its own failure rate into the whole, so a long agent path can fail end to end even when each step looks fine.",
    hybrid:
      "Keep the model on a short leash. It advises at the decision points; it does not drive the process.",
    tools:
      "Every step you can express as code is a step you do not have to trust the model on. Move those out, and let the agent reason only over what genuinely varies.",
    multi:
      "Every added agent is another nondeterministic hop that multiplies into your end-to-end reliability, plus new coordination failure modes. Start with one agent; split only when it provably cannot hold the job.",
    call: "This is the simplest shape. Keep it that way. Add a tool or a loop only when a specific failure in your evals demands it, not because an agent felt more complete.",
  };

  const risks: string[] = [shapeRisk[kind]];
  if (a.q6 === "highvolume") risks.push("Track cost per resolved task, not per call, from the first day.");
  if (a.q4 === "irreversible")
    risks.push("One confident wrong action is the whole risk. Log every action and make it reversible wherever you can.");
  if (a.q7 === "full")
    risks.push("You cannot ship full autonomy without evals and traces to back it. Turn each up as the evidence comes in.");
  if (a.q5 === "docs" && kind !== "workflow")
    risks.push("Most RAG failures are retrieval failures. Evaluate retrieval before you touch the prompt.");
  if (a.q5 === "live" && kind !== "workflow")
    risks.push("Your tools are now part of the trust boundary. Handle their failures and latency on purpose.");

  // Stages.
  const end: Node =
    a.q1 === "answer"
      ? { label: "Answer" }
      : a.q1 === "transform"
        ? { label: "Structured output" }
        : { label: "Systems of record" };
  const needsApproval = a.q7 === "draft" || a.q4 === "irreversible";
  const kn = knowledgeNode(a.q5);
  let stages: Node[];

  if (kind === "workflow") {
    stages = [{ label: "You" }, { label: "Deterministic workflow", accent: true }];
    if (needsApproval) stages.push({ label: "Human approval" });
    stages.push(end);
  } else if (kind === "hybrid") {
    stages = [{ label: "You" }, { label: "Workflow", accent: true }, { label: "Model" }];
    if (needsApproval) stages.push({ label: "Human approval" });
    stages.push(end);
  } else if (kind === "call") {
    stages = [{ label: "You" }, { label: "Model", accent: true }, { label: "Structured output" }];
  } else if (kind === "multi") {
    stages = [{ label: "You" }, { label: "Coordinator", accent: true }, { label: "Specialists", accent: true }];
    if (needsApproval) stages.push({ label: "Human approval" });
    stages.push(end);
  } else {
    stages = [{ label: "You" }, { label: "Agent", accent: true }, kn ?? { label: "Tools" }];
    if (needsApproval) stages.push({ label: "Human approval" });
    stages.push(end);
  }

  return {
    shape: verdict.title,
    shapeDetail: verdict.detail,
    knowledge,
    humans,
    model,
    risks: risks.slice(0, 3),
    stages,
  };
}

function Detail({ label, text }: { label: string; text: string }) {
  return (
    <div className="grid grid-cols-[170px_1fr] gap-5 py-4 border-t border-line-1 [@media(max-width:640px)]:grid-cols-1 [@media(max-width:640px)]:gap-1">
      <span className="font-mono text-mono tracking-mono uppercase text-accent-600 pt-[2px]">
        {label}
      </span>
      <p className="text-body leading-body text-ink-800 m-0 max-w-[56ch]">{text}</p>
    </div>
  );
}

export function ArchitectureTool() {
  const [answers, setAnswers] = useState<Answers>({});
  const [copied, setCopied] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const done = answeredCount === QUESTIONS.length;
  const rec = useMemo(() => (done ? compute(answers) : null), [answers, done]);

  const set = (qid: string, oid: string) =>
    setAnswers((prev) => ({ ...prev, [qid]: oid }));

  const copySummary = () => {
    if (!rec) return;
    const text = `Agent or workflow: ${rec.shape}. ${rec.shapeDetail} hamidettefagh.com/agent-architecture`;
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mt-9">
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500">
          {answeredCount} of {QUESTIONS.length} answered
        </span>
        {answeredCount > 0 ? (
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="font-mono text-mono-sm tracking-[0.05em] text-ink-500 bg-transparent cursor-pointer border border-line-1 rounded-sm px-[11px] py-[6px] transition-[border-color,color] duration-(--dur-fast) ease-out hover:border-line-2 hover:text-ink-900"
          >
            Reset
          </button>
        ) : null}
      </div>

      {QUESTIONS.map((question) => (
        <div key={question.id} className="mt-9">
          <h2 className="text-[18px] font-medium text-ink-900 leading-tight m-0 mb-3">
            {question.q}
          </h2>
          <div className="flex flex-wrap gap-2">
            {question.options.map((o) => {
              const on = answers[question.id] === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => set(question.id, o.id)}
                  aria-pressed={on}
                  className={[
                    "text-small leading-tight text-left rounded-pill border px-4 py-[9px] cursor-pointer transition-[background-color,border-color,color] duration-(--dur-fast) ease-out",
                    on
                      ? "bg-accent-600 border-accent-600 text-on-accent"
                      : "bg-paper-0 border-line-2 text-ink-700 hover:border-ink-500",
                  ].join(" ")}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-11 pt-9 border-t border-line-2">
        {rec ? (
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-mono-sm tracking-[0.06em] uppercase text-accent-600">
                How I would start
              </span>
              <button
                type="button"
                onClick={copySummary}
                className="font-mono text-mono-sm tracking-[0.05em] text-ink-500 bg-transparent cursor-pointer border border-line-1 rounded-sm px-[11px] py-[6px] transition-[border-color,color] duration-(--dur-fast) ease-out hover:border-line-2 hover:text-ink-900"
              >
                {copied ? "Copied" : "Copy summary"}
              </button>
            </div>
            <h3 className="font-display font-bold text-[clamp(28px,4vw,40px)] tracking-heading leading-tight mt-3 mb-0">
              {rec.shape}
            </h3>
            <p className="mt-3 mb-0 text-lead leading-[1.5] text-ink-700 max-w-[54ch]">
              {rec.shapeDetail}
            </p>

            <div className="mt-8">
              <ArchitectureDiagram stages={rec.stages} />
            </div>

            <div className="mt-9">
              <Detail label="Knowledge" text={rec.knowledge} />
              <Detail label="Humans in the loop" text={rec.humans} />
              <Detail label="Model" text={rec.model} />
            </div>

            <div className="mt-9">
              <div className="font-mono text-mono tracking-mono uppercase text-accent-600 mb-1">
                What I would worry about
              </div>
              {rec.risks.map((r, i) => (
                <p
                  key={i}
                  className="text-body leading-body text-ink-800 m-0 py-4 border-t border-line-1 max-w-[62ch]"
                >
                  {r}
                </p>
              ))}
            </div>

            <p className="mt-9 font-mono text-[10.5px] tracking-[0.05em] uppercase text-ink-300 max-w-[60ch] leading-[1.6]">
              This is how I would start, not the only way. Your constraints may
              point somewhere else. If your answers put a model in the path, make
              it justify the seat.
            </p>
          </div>
        ) : (
          <p className="text-body text-ink-500 leading-body max-w-[52ch]">
            Answer the questions and I will tell you which parts of this actually
            need an agent, and which should stay a workflow you can test.
          </p>
        )}
      </div>
    </div>
  );
}
