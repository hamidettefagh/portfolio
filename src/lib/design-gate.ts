// The design gate's verdict engine: seven signals in, one of five shapes out.
// Pure and deterministic, with no React in it, so the browser tool, the home
// page, and the server can all call the same function. Mirrors
// scripts/decide.mjs in the agent-or-workflow skill repo; keep them in sync.

export type Answers = Record<string, string>;

export const QUESTIONS: { id: string; q: string; options: { id: string; label: string }[] }[] = [
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

export type Kind = "workflow" | "hybrid" | "call" | "multi" | "tools";
export type Platform = "general" | "agentforce";

export type Node = { label: string; accent?: boolean };

export type Recommendation = {
  shape: string;
  shapeDetail: string;
  knowledge: string;
  humans: string;
  model: string;
  risks: string[];
  stages: Node[];
};

type Lens = {
  verdicts: Record<Kind, { title: string; detail: string }> & {
    hybridBackend?: { title: string; detail: string };
  };
  knowledge: { workflow: string; docs: string; live: string; records: string; model: string };
  humans: { workflow: string; irreversible: string; draft: string; guarded: string; fullread: string; default: string };
  model: { workflow: string; hybrid: string; interactive: string; highvolume: string; default: string };
  shapeRisk: Record<Kind, string>;
  condRisk: { cost: string; irreversible: string; full: string; docs: string; live: string };
  nodes: {
    workflow: string;
    hybridSpine: string;
    hybridSpineConversational?: string;
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
      docs: "RAG over a vector store for interactive answers, or agentic search where the agent can afford to explore. Either way, retrieval quality is your ceiling, so evaluate it on its own before you blame the model.",
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
        title: "Agent Script with the load-bearing decisions pinned",
        detail:
          "There is a conversation here, so the determinism belongs inside the agent. Write it as Agent Script: pin the decisions that must not vary, using availability gates and conditional instructions the model cannot override, and let it reason over the rest. The actions underneath stay Flow or Apex.",
      },
      hybridBackend: {
        title: "A Flow with a prompt template at the judgment points",
        detail:
          "Nothing here is conversational, so there is no agent to script. Automate the fixed process in Flow and call a prompt template action only at the genuine judgment points, wrapped in deterministic control flow.",
      },
      call: {
        title: "A prompt template, not an agent",
        detail:
          "One Flex prompt template with clear instructions, grounded merge fields, and a few strong examples. No topic, no agent loop. Where a single template passes your evals, an agent is pure overhead.",
      },
      multi: {
        title: "Multi-Agent Orchestration",
        detail:
          "A primary agent routing to focused specialist agents, each owning one domain and handing a result back. Default to one agent with well-separated topics first. Every handoff is latency plus a new failure mode, so this is the most expensive shape on the platform by a wide margin.",
      },
      tools: {
        title: "One Agentforce topic with a tight action set",
        detail:
          "One topic with a sharp classification description and scope, and a small set of actions backed by Flow or Apex. Define it in Agent Script so the guardrails and transitions are reviewable and the execution topology is known before a conversation starts. Let it reason over what varies and push what does not into the actions.",
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
        "One model call at each judgment point, right-sized for that decision. The structure around it, Agent Script or Flow, stays deterministic and testable.",
      interactive:
        "Favor a fast model on the interactive path, and escalate to a frontier model only for the steps that need it.",
      highvolume: "Right-size hard. The cheapest model that passes your evals, not the biggest one available.",
      default: "You can afford a frontier model and more steps. Spend the tokens where they buy accuracy.",
    },
    shapeRisk: {
      workflow:
        "The pressure will be to make it agentic, because that is what ships in demos. Resist it. Add a model only at the exact step where the work stops being predictable, and keep the rest as Flow you can test. Every model step you chain multiplies its own failure rate into the whole, so a long agent path can fail end to end even when each step looks fine.",
      hybrid: "Keep the model on a short leash. It advises at the decision points; it does not drive the process.",
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
      hybridSpineConversational: "Agent Script",
      hybridModel: "Prompt template",
      call: "Prompt template",
      coordinator: "Primary agent",
      specialists: "Specialist agents",
      agent: "Agentforce topic",
      toolsFallback: "Actions",
      docs: "Data library",
      records: "Query actions",
      live: "API actions",
    },
  },
};

export function classify(a: Answers): Kind {
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

// Is there a live conversational surface? Someone waiting on the answer, or a
// job whose whole purpose is answering questions. Only the agentforce lens uses
// this: it decides where the determinism lives, inside an agent or in a Flow
// with no agent at all. The classification never depends on it.
function isConversational(a: Answers): boolean {
  return a.q6 === "interactive" || a.q1 === "answer";
}

export function compute(a: Answers, platform: Platform): Recommendation {
  const L = LENSES[platform];
  const kind = classify(a);
  const backendHybrid =
    kind === "hybrid" && !isConversational(a) ? L.verdicts.hybridBackend : undefined;
  const verdict = backendHybrid ?? L.verdicts[kind];

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
    const spine =
      !backendHybrid && L.nodes.hybridSpineConversational
        ? L.nodes.hybridSpineConversational
        : L.nodes.hybridSpine;
    stages = [{ label: "You" }, { label: spine, accent: true }, { label: L.nodes.hybridModel }];
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

// The state is the URL: seven answer digits plus the lens, so a verdict is a
// link anyone can open and see the same result.
export function encodeAnswers(answers: Answers): string {
  return QUESTIONS.map((q) => {
    const idx = q.options.findIndex((o) => o.id === answers[q.id]);
    return idx === -1 ? "x" : String(idx);
  }).join("");
}

export function decodeAnswers(code: string): Answers {
  const out: Answers = {};
  QUESTIONS.forEach((q, i) => {
    const idx = Number(code[i]);
    if (Number.isInteger(idx) && idx >= 0 && idx < q.options.length) {
      out[q.id] = q.options[idx].id;
    }
  });
  return out;
}
