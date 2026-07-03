"use client";

import { useMemo, useState } from "react";
import { ArchitectureDiagram } from "@/components/patterns/ArchitectureDiagram";

type Answers = Record<string, string>;

const QUESTIONS: { id: string; q: string; options: { id: string; label: string }[] }[] = [
  {
    id: "q1",
    q: "What does the agent mainly do?",
    options: [
      { id: "answer", label: "Answer questions from a body of knowledge" },
      { id: "act", label: "Take actions in other systems" },
      { id: "transform", label: "Analyze or transform input you give it" },
      { id: "workflow", label: "Run a multi-step workflow across both" },
    ],
  },
  {
    id: "q2",
    q: "How many distinct jobs does it span?",
    options: [
      { id: "one", label: "One focused job" },
      { id: "few", label: "A few related steps" },
      { id: "many", label: "Several specialties, with handoffs" },
    ],
  },
  {
    id: "q3",
    q: "How reversible are its actions?",
    options: [
      { id: "read", label: "Read-only, or suggestions a person acts on" },
      { id: "undoable", label: "Writes that can be undone" },
      { id: "irreversible", label: "Irreversible or high-impact" },
    ],
  },
  {
    id: "q4",
    q: "Where does its knowledge live?",
    options: [
      { id: "model", label: "General knowledge the model already has" },
      { id: "docs", label: "Stable documents" },
      { id: "live", label: "Changing or real-time data" },
      { id: "records", label: "Structured records in a database or CRM" },
    ],
  },
  {
    id: "q5",
    q: "What are the latency and scale needs?",
    options: [
      { id: "interactive", label: "Interactive, a person is waiting" },
      { id: "async", label: "Background or async" },
      { id: "highvolume", label: "High volume, cost-sensitive" },
    ],
  },
  {
    id: "q6",
    q: "How much should it act on its own?",
    options: [
      { id: "draft", label: "Draft only, a person approves" },
      { id: "guarded", label: "Autonomous within guardrails" },
      { id: "full", label: "Fully autonomous" },
    ],
  },
];

type Recommendation = {
  shape: string;
  shapeDetail: string;
  knowledge: string;
  humans: string;
  model: string;
  risks: string[];
  stages: { label: string; accent?: boolean }[];
};

function knowledgeNode(q4: string): { label: string; accent?: boolean } | null {
  if (q4 === "docs") return { label: "Retrieval" };
  if (q4 === "records") return { label: "Query tools" };
  if (q4 === "live") return { label: "Live tools" };
  return null;
}

function compute(a: Answers): Recommendation {
  let shape: string;
  let shapeDetail: string;

  if (a.q2 === "many") {
    shape = "Multi-agent";
    shapeDetail =
      "A coordinator that delegates to focused specialists. Each specialist owns one domain and hands a result back.";
  } else if (a.q1 === "transform" && a.q2 === "one") {
    shape = "You may not need an agent";
    shapeDetail =
      "A single structured model call likely does this. Reach for an agent only when the task has to plan, use tools, or loop.";
  } else if (a.q1 === "act" || a.q1 === "workflow" || a.q2 === "few") {
    shape = "Single agent with tools";
    shapeDetail =
      "One agent with a small, well-defined set of tools. Keep the tool surface tight and each tool boring.";
  } else {
    shape = "Single agent";
    shapeDetail = "One agent, one job. Do not add structure it does not need yet.";
  }

  let knowledge: string;
  switch (a.q4) {
    case "docs":
      knowledge =
        "RAG over a vector store. Retrieval quality is your ceiling, so evaluate retrieval on its own before you blame the model.";
      break;
    case "live":
      knowledge = "Call tools or APIs at query time. RAG alone would hand back stale answers.";
      break;
    case "records":
      knowledge =
        "Give it query tools over the system of record, not a vector store. Text-to-query works if the schema is stable.";
      break;
    default:
      knowledge = "No retrieval. Lean on the model and anchor it with a few strong examples.";
  }

  let humans: string;
  if (a.q3 === "irreversible")
    humans = "Put a confirmation gate before any irreversible action, and give a person the escape hatch.";
  else if (a.q6 === "draft")
    humans = "The agent drafts, a person approves and sends. No autonomous writes yet.";
  else if (a.q6 === "guarded")
    humans =
      "Autonomous within guardrails, with a confidence threshold that escalates the uncertain cases to a person.";
  else if (a.q6 === "full" && a.q3 === "read")
    humans = "Light oversight is fine, but only because it cannot do harm. Earn more autonomy with evals and traces.";
  else humans = "Keep a person on the uncertain and the irreversible. Let the rest run.";

  let model: string;
  if (a.q5 === "interactive")
    model = "A fast, smaller model in the loop. Escalate to a frontier model only for the steps that need it.";
  else if (a.q5 === "highvolume")
    model = "Right-size hard. The cheapest model that passes your evals, not the biggest one available.";
  else model = "You can afford a frontier model and more steps. Spend the tokens where they buy accuracy.";

  const allRisks: string[] = [];
  if (shape === "You may not need an agent")
    allRisks.push(
      "Adding agentic loops here buys failure modes for no gain. Use the simplest thing that works and revisit only if it stops working.",
    );
  if (a.q3 === "irreversible")
    allRisks.push(
      "One confident wrong action is the whole risk. Gate it, log it, and make it reversible wherever you can.",
    );
  if (a.q6 === "full")
    allRisks.push(
      "You cannot ship full autonomy without evals and traces. Autonomy is earned with evidence, not asserted.",
    );
  if (shape === "Multi-agent")
    allRisks.push(
      "Coordination adds latency and new failure modes. Start with one agent and split only when a single one provably cannot hold the job.",
    );
  if (a.q4 === "docs")
    allRisks.push("Most RAG failures are retrieval failures. Evaluate retrieval before you touch the prompt.");
  if (a.q4 === "live")
    allRisks.push("Your tools are now part of the trust boundary. Handle their failures and their latency on purpose.");
  if (a.q5 === "highvolume")
    allRisks.push("Track cost per resolved task, not per call, from the first day.");
  if (a.q1 === "act" && allRisks.length < 3)
    allRisks.push("Every tool is a new way to be wrong. Validate inputs going in and check outputs before they land.");

  let stages: { label: string; accent?: boolean }[];
  const kn = knowledgeNode(a.q4);
  const needsApproval = a.q6 === "draft" || a.q3 === "irreversible";

  if (shape === "You may not need an agent") {
    stages = [{ label: "You" }, { label: "Model", accent: true }, { label: "Structured output" }];
  } else if (shape === "Multi-agent") {
    stages = [{ label: "You" }, { label: "Coordinator", accent: true }, { label: "Specialists", accent: true }];
    if (needsApproval) stages.push({ label: "Human approval" });
    stages.push({ label: "Systems of record" });
  } else if (shape === "Single agent with tools") {
    stages = [{ label: "You" }, { label: "Agent", accent: true }, kn ?? { label: "Tools" }];
    if (needsApproval) stages.push({ label: "Human approval" });
    stages.push({ label: "Systems of record" });
  } else {
    stages = [{ label: "You" }, { label: "Agent", accent: true }];
    if (kn) stages.push(kn);
    stages.push({ label: "Answer" });
  }

  return { shape, shapeDetail, knowledge, humans, model, risks: allRisks.slice(0, 3), stages };
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
    const text = `Agent architecture: ${rec.shape}. ${rec.shapeDetail} hamidettefagh.com/agent-architecture`;
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
            <p className="mt-3 mb-0 text-lead leading-[1.5] text-ink-700 max-w-[52ch]">
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
              point somewhere else. The point is to choose the shape on purpose.
            </p>
          </div>
        ) : (
          <p className="text-body text-ink-500 leading-body max-w-[52ch]">
            Answer the six questions and I will show you how I would start it,
            and the two or three things I would worry about.
          </p>
        )}
      </div>
    </div>
  );
}
