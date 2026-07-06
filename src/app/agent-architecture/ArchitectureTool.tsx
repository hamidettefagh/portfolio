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
type Platform = "general" | "agentforce";

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

type Lens = {
  verdicts: Record<Kind, { title: string; detail: string }>;
  knowledge: { workflow: string; docs: string; live: string; records: string; model: string };
  humans: { workflow: string; irreversible: string; draft: string; guarded: string; fullread: string; default: string };
  model: { workflow: string; hybrid: string; interactive: string; highvolume: string; default: string };
  shapeRisk: Record<Kind, string>;
  condRisk: { cost: string; irreversible: string; full: string; docs: string; live: string };
  nodes: {
    workflow: string;
    hybridSpine: string;
    hybridModel: string;
    call: string;
    coordinator: string;
    specialists: string;
    agent: string;
    toolsFallback: string;
    docs: string;
    records: string;
    live: string;
  };
};

// Everything a lens is allowed to change lives here. classify() reads none of
// it; a lens is vocabulary, never a different call. Mirrors scripts/decide.mjs
// in the agent-or-workflow skill repo.
const LENSES: Record<Platform, Lens> = {
  general: {
    verdicts: {
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
    },
    knowledge: {
      workflow:
        "Look it up deterministically, by key or query. No vector search, and no model in the retrieval path.",
      docs: "RAG over a vector store. Retrieval quality is your ceiling, so evaluate it on its own before you blame the model.",
      live: "Call tools or APIs at query time. RAG alone would hand back stale answers.",
      records:
        "Give it scoped, parameterized query tools over the system of record, not raw text-to-query and not a vector store. If you must generate queries, constrain them to a safe, read-only surface.",
      model: "No retrieval. Lean on the model and anchor it with a few strong examples.",
    },
    humans: {
      workflow:
        "No agent in this path, so oversight is ordinary code review and change control, not approval gates. If a step is irreversible, gate it deterministically and log it.",
      irreversible:
        "Put a confirmation gate before any irreversible action, log every call, and give a person the escape hatch.",
      draft: "The agent drafts, a person approves and sends. No autonomous writes yet.",
      guarded:
        "Autonomous within guardrails, with a confidence threshold that escalates uncertain cases to a person.",
      fullread:
        "Light oversight is fine because it cannot take action directly. The residual risk is a confident wrong answer a person acts on, so keep the reasoning visible. Earn more autonomy with evals and traces.",
      default: "Keep a person on the uncertain and the irreversible. Let the rest run.",
    },
    model: {
      workflow:
        "Little to none. If one step genuinely needs judgment, make it a single call, not the spine of the system.",
      hybrid:
        "One call at each judgment point, right-sized for that decision. The workflow around it stays deterministic and testable.",
      interactive:
        "Favor a fast, smaller model on the interactive path, and escalate to a frontier model only for the steps that need it.",
      highvolume: "Right-size hard. The cheapest model that passes your evals, not the biggest one available.",
      default: "You can afford a frontier model and more steps. Spend the tokens where they buy accuracy.",
    },
    shapeRisk: {
      workflow:
        "The pressure will be to make it agentic, because that is what ships in demos. Resist it. Add a model only at the exact step where the work stops being predictable, and keep the rest as code you can test. Every model step you chain multiplies its own failure rate into the whole, so a long agent path can fail end to end even when each step looks fine.",
      hybrid: "Keep the model on a short leash. It advises at the decision points; it does not drive the process.",
      tools:
        "Every step you can express as code is a step you do not have to trust the model on. Move those out, and let the agent reason only over what genuinely varies.",
      multi:
        "Every added agent is another nondeterministic hop that multiplies into your end-to-end reliability, plus new coordination failure modes. Start with one agent; split only when it provably cannot hold the job.",
      call: "This is the simplest shape. Keep it that way. Add a tool or a loop only when a specific failure in your evals demands it, not because an agent felt more complete.",
    },
    condRisk: {
      cost: "Track cost per resolved task, not per call, from the first day.",
      irreversible:
        "One confident wrong action is the whole risk. Log every action and make it reversible wherever you can.",
      full: "You cannot ship full autonomy without evals and traces to back it. Turn each up as the evidence comes in.",
      docs: "Most RAG failures are retrieval failures. Evaluate retrieval before you touch the prompt.",
      live: "Your tools are now part of the trust boundary. Handle their failures and latency on purpose.",
    },
    nodes: {
      workflow: "Deterministic workflow",
      hybridSpine: "Workflow",
      hybridModel: "Model",
      call: "Model",
      coordinator: "Coordinator",
      specialists: "Specialists",
      agent: "Agent",
      toolsFallback: "Tools",
      docs: "Retrieval",
      records: "Query tools",
      live: "Live tools",
    },
  },

  agentforce: {
    verdicts: {
      workflow: {
        title: "This is a Flow, not an agent",
        detail:
          "The steps are known and the rules are clear. Build it in Flow, or Apex where the logic outgrows it. A model in this path buys cost, latency, and nondeterminism you did not need.",
      },
      hybrid: {
        title: "A Flow with a prompt template at the judgment points",
        detail:
          "Automate the fixed process in Flow. Call a prompt template action only at the genuine judgment points, wrapped in deterministic control flow.",
      },
      call: {
        title: "A prompt template, not an agent",
        detail:
          "One Flex prompt template with clear instructions, grounded merge fields, and a few strong examples. No topic, no agent loop. Where a single template passes your evals, an agent is pure overhead.",
      },
      multi: {
        title: "Multiple agents behind an orchestrator",
        detail:
          "A coordinator agent that delegates to focused subagents, each owning one domain and handing a result back. Default to one agent with well-separated topics first. Every handoff is latency plus a new failure mode, so this is the most expensive shape on the platform by a wide margin.",
      },
      tools: {
        title: "One Agentforce topic with a tight action set",
        detail:
          "One topic with a sharp classification description and scope, and a small set of actions backed by Flow or Apex. Let it reason over what varies and push what does not into the actions. Keep the action surface tight and each action boring.",
      },
    },
    knowledge: {
      workflow:
        "Look it up deterministically in the Flow, a Get Records or a query by key. No retrieval, and no model in the retrieval path.",
      docs: "Ground it with retrieval over a data library of the approved content. Retrieval quality is your ceiling, so evaluate it on its own before you blame the model.",
      live: "Actions that call the source at run time, a Flow callout, Apex, or MuleSoft. Indexed content alone would hand back stale answers.",
      records:
        "Give it scoped Flow or Apex query actions over the CRM, not raw text-to-SOQL and not a vector store. If you must generate queries, constrain them to a safe, read-only surface.",
      model:
        "No retrieval. Lean on the model and anchor the prompt template with merge fields and a few strong examples.",
    },
    humans: {
      workflow:
        "No agent in this path, so oversight is code review and change control on the Flow, not approval gates. If a step is irreversible, gate it deterministically and log it.",
      irreversible:
        "Require confirmation before any irreversible action, log every action, and give a person the escape hatch.",
      draft: "The agent drafts, a person approves and sends. No autonomous writes to the org yet.",
      guarded: "Autonomous within guardrails, with escalation to a human queue for the uncertain cases.",
      fullread:
        "Light oversight is fine because it cannot touch records. The residual risk is a confident wrong answer a person acts on, so keep the reasoning visible. Earn more autonomy with evals and traces.",
      default: "Keep a person on the uncertain and the irreversible. Let the rest run.",
    },
    model: {
      workflow:
        "Little to none. If one step genuinely needs judgment, make it a single prompt template action, not the spine of the system.",
      hybrid:
        "One prompt template call at each judgment point, right-sized for that decision. The Flow around it stays deterministic and testable.",
      interactive:
        "Favor a fast model on the interactive path, and escalate to a frontier model only for the steps that need it.",
      highvolume: "Right-size hard. The cheapest model that passes your evals, not the biggest one available.",
      default: "You can afford a frontier model and more steps. Spend the tokens where they buy accuracy.",
    },
    shapeRisk: {
      workflow:
        "The pressure will be to make it agentic, because that is what ships in demos. Resist it. Add a model only at the exact step where the work stops being predictable, and keep the rest as Flow you can test. Every model step you chain multiplies its own failure rate into the whole, so a long agent path can fail end to end even when each step looks fine.",
      hybrid: "Keep the model on a short leash. It advises at the decision points; it does not drive the Flow.",
      tools:
        "Every step you can express in Flow or Apex is a step you do not have to trust the model on. Push those into the actions, and let the topic reason only over what genuinely varies.",
      multi:
        "Every added agent is another nondeterministic hop that multiplies into your end-to-end reliability, plus new coordination failure modes. Start with one agent and well-separated topics; split only when that provably cannot hold the job.",
      call: "This is the simplest shape. Keep it that way. Add a topic or an action only when a specific failure in your evals demands it, not because an agent felt more complete.",
    },
    condRisk: {
      cost: "Track cost per resolved task, not per call, from the first day.",
      irreversible:
        "One confident wrong action is the whole risk. Log every action and make it reversible wherever you can.",
      full: "You cannot ship full autonomy without evals and traces to back it. Turn each up as the evidence comes in.",
      docs: "Most RAG failures are retrieval failures. Evaluate the retriever and the data library before you touch the prompt.",
      live: "Your actions are now part of the trust boundary. Handle their failures and latency on purpose.",
    },
    nodes: {
      workflow: "Flow",
      hybridSpine: "Flow",
      hybridModel: "Prompt template",
      call: "Prompt template",
      coordinator: "Orchestrator",
      specialists: "Subagents",
      agent: "Agentforce topic",
      toolsFallback: "Actions",
      docs: "Data library",
      records: "Query actions",
      live: "API actions",
    },
  },
};

function classify(a: Answers): Kind {
  if (a.q2 === "fixed") return "workflow";
  if (a.q2 === "spine") return "hybrid";
  // q2 === "open": genuine judgment on every case
  if (a.q3 === "many") return "multi";
  if (a.q3 === "one" && a.q5 === "model" && (a.q1 === "answer" || a.q1 === "transform")) return "call";
  return "tools";
}

function knowledgeNode(q5: string, nodes: Lens["nodes"]): Node | null {
  if (q5 === "docs") return { label: nodes.docs };
  if (q5 === "records") return { label: nodes.records };
  if (q5 === "live") return { label: nodes.live };
  return null;
}

function compute(a: Answers, platform: Platform): Recommendation {
  const L = LENSES[platform];
  const kind = classify(a);
  const verdict = L.verdicts[kind];

  // Knowledge. A workflow has no model in the retrieval path, so it never does RAG.
  const knowledge =
    kind === "workflow" ? L.knowledge.workflow : L.knowledge[a.q5 as "docs" | "live" | "records" | "model"];

  let humans: string;
  if (kind === "workflow") humans = L.humans.workflow;
  else if (a.q4 === "irreversible") humans = L.humans.irreversible;
  else if (a.q7 === "draft") humans = L.humans.draft;
  else if (a.q7 === "guarded") humans = L.humans.guarded;
  else if (a.q7 === "full" && a.q4 === "read") humans = L.humans.fullread;
  else humans = L.humans.default;

  // Model. Shape wins over the latency tuning: a workflow or hybrid pins the answer.
  let model: string;
  if (kind === "workflow") model = L.model.workflow;
  else if (kind === "hybrid") model = L.model.hybrid;
  else if (a.q6 === "interactive") model = L.model.interactive;
  else if (a.q6 === "highvolume") model = L.model.highvolume;
  else model = L.model.default;

  // Risks. The shape's headline risk leads; cost earns a seat whenever volume is the pressure.
  const risks: string[] = [L.shapeRisk[kind]];
  if (a.q6 === "highvolume") risks.push(L.condRisk.cost);
  if (a.q4 === "irreversible") risks.push(L.condRisk.irreversible);
  if (a.q7 === "full") risks.push(L.condRisk.full);
  if (a.q5 === "docs" && kind !== "workflow") risks.push(L.condRisk.docs);
  if (a.q5 === "live" && kind !== "workflow") risks.push(L.condRisk.live);

  // Stages.
  const end: Node =
    a.q1 === "answer"
      ? { label: "Answer" }
      : a.q1 === "transform"
        ? { label: "Structured output" }
        : { label: "Systems of record" };
  const needsApproval = a.q7 === "draft" || a.q4 === "irreversible";
  const kn = knowledgeNode(a.q5, L.nodes);
  let stages: Node[];

  if (kind === "workflow") {
    stages = [{ label: "You" }, { label: L.nodes.workflow, accent: true }];
    if (needsApproval) stages.push({ label: "Human approval" });
    stages.push(end);
  } else if (kind === "hybrid") {
    stages = [{ label: "You" }, { label: L.nodes.hybridSpine, accent: true }, { label: L.nodes.hybridModel }];
    if (needsApproval) stages.push({ label: "Human approval" });
    stages.push(end);
  } else if (kind === "call") {
    stages = [{ label: "You" }, { label: L.nodes.call, accent: true }, { label: "Structured output" }];
  } else if (kind === "multi") {
    stages = [
      { label: "You" },
      { label: L.nodes.coordinator, accent: true },
      { label: L.nodes.specialists, accent: true },
    ];
    if (needsApproval) stages.push({ label: "Human approval" });
    stages.push(end);
  } else {
    stages = [{ label: "You" }, { label: L.nodes.agent, accent: true }, kn ?? { label: L.nodes.toolsFallback }];
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
      <p className="text-body leading-body text-ink-700 m-0 max-w-[56ch]">{text}</p>
    </div>
  );
}

const PLATFORM_OPTIONS: { id: Platform; label: string }[] = [
  { id: "general", label: "General" },
  { id: "agentforce", label: "Agentforce" },
];

export function ArchitectureTool() {
  const [answers, setAnswers] = useState<Answers>({});
  const [platform, setPlatform] = useState<Platform>("general");
  const [copied, setCopied] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const done = answeredCount === QUESTIONS.length;
  const rec = useMemo(() => (done ? compute(answers, platform) : null), [answers, done, platform]);

  const set = (qid: string, oid: string) =>
    setAnswers((prev) => ({ ...prev, [qid]: oid }));

  const copySummary = () => {
    if (!rec) return;
    const prefix = platform === "agentforce" ? "Flow, prompt, or agent" : "Agent or workflow";
    const text = `${prefix}: ${rec.shape}. ${rec.shapeDetail} hamidettefagh.com/agent-architecture`;
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
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500">
          Lens
        </span>
        {PLATFORM_OPTIONS.map((p) => {
          const on = platform === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              aria-pressed={on}
              className={[
                "text-small leading-tight rounded-pill border px-4 py-[7px] cursor-pointer transition-[background-color,border-color,color] duration-(--dur-fast) ease-out",
                on
                  ? "bg-accent-600 border-accent-600 text-on-accent"
                  : "bg-paper-0 border-line-2 text-ink-700 hover:border-ink-500",
              ].join(" ")}
            >
              {p.label}
            </button>
          );
        })}
        <span className="text-small text-ink-500 leading-tight">
          {platform === "agentforce"
            ? "Same verdict, rendered in Flow, prompt templates, topics, and actions."
            : "Vendor-neutral vocabulary."}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 mt-7">
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
                  className="text-body leading-body text-ink-700 m-0 py-4 border-t border-line-1 max-w-[62ch]"
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
