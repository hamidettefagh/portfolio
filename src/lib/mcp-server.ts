import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { QUESTIONS, classify, compute, encodeAnswers, type Answers } from "./design-gate";
import { SHIP_GATE, SHIP_GATE_TOTAL, diagnose, readinessBand } from "./ship-gate";
import { toMarkdown, validateCase, type EvalCase } from "./eval-case";
import { LATEST } from "@/data/evals/runs";

// The two gates as MCP tools, so an agent can run them without a browser.
// Every tool is a pure function over code that already runs on this site: no
// model call, no state, no secrets. Same input, same output, every time.

const SITE = "https://hamidettefagh.com";

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

// Friendly parameter names for the seven design gate questions.
const GATE_PARAMS = [
  ["does", "q1"],
  ["steps", "q2"],
  ["jobs", "q3"],
  ["actions", "q4"],
  ["knowledge", "q5"],
  ["demand", "q6"],
  ["autonomy", "q7"],
] as const;

function answerEnum(qid: string) {
  const q = QUESTIONS.find((x) => x.id === qid)!;
  const ids = q.options.map((o) => o.id) as [string, ...string[]];
  return z
    .enum(ids)
    .describe(`${q.q} ${q.options.map((o) => `"${o.id}": ${o.label}`).join("; ")}.`);
}

function json<T extends Record<string, unknown>>(out: T) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(out, null, 2) }],
    structuredContent: out,
  };
}

export function buildMcpServer() {
  const server = new McpServer(
    {
      name: "hamidettefagh-two-gates",
      title: "The two gates",
      version: "1.0.0",
      description:
        "Hamid Ettefagh's design gate, ship gate, and incident-to-eval validator, as deterministic tools.",
      websiteUrl: `${SITE}/lab/mcp`,
    },
    {
      instructions:
        "Tools for deciding and checking AI agent designs. design_gate picks the least autonomous architecture that does a job, from seven answers. ship_gate_checklist lists the 28 production readiness checks; ship_gate_score scores an agent from how many checks it meets in each dimension. validate_eval_case checks an incident-to-eval case. site_agent_evals reports the latest recorded eval run of the agent on hamidettefagh.com. All tools are deterministic code with no model inside.",
      cacheHints: {
        "tools/list": { ttlMs: 3_600_000, cacheScope: "public" },
        "server/discover": { ttlMs: 3_600_000, cacheScope: "public" },
      },
    },
  );

  server.registerTool(
    "design_gate",
    {
      title: "Design gate",
      description:
        "Decide the architecture for an AI feature before building it: a deterministic workflow, a workflow with a model at the judgment points, a single model call, a single agent with tools, or multi-agent. Answer seven questions about the use case. Returns the verdict, the flow, the risks, and a link to the same verdict in the browser tool. Set lens to agentforce to get the answer in Salesforce Agentforce terms.",
      inputSchema: z.object({
        does: answerEnum("q1"),
        steps: answerEnum("q2"),
        jobs: answerEnum("q3"),
        actions: answerEnum("q4"),
        knowledge: answerEnum("q5"),
        demand: answerEnum("q6"),
        autonomy: answerEnum("q7"),
        lens: z
          .enum(["general", "agentforce"])
          .default("general")
          .describe('"general" for any stack, "agentforce" for Flows, prompt templates, Agent Script, and topics.'),
      }),
      outputSchema: z.object({
        verdict: z.string(),
        detail: z.string(),
        shape: z.enum(["workflow", "hybrid", "call", "tools", "multi"]),
        flow: z.array(z.string()),
        knowledge: z.string(),
        humans: z.string(),
        model: z.string(),
        risks: z.array(z.string()),
        url: z.string(),
      }),
      annotations: READ_ONLY,
    },
    async (args) => {
      const input = args as Record<string, string>;
      const answers: Answers = {};
      for (const [name, qid] of GATE_PARAMS) answers[qid] = input[name];
      const lens = input.lens === "agentforce" ? "agentforce" : "general";
      const rec = compute(answers, lens);
      return json({
        verdict: rec.shape,
        detail: rec.shapeDetail,
        shape: classify(answers),
        flow: rec.stages.map((s) => s.label),
        knowledge: rec.knowledge,
        humans: rec.humans,
        model: rec.model,
        risks: rec.risks,
        url: `${SITE}/agent-architecture?a=${encodeAnswers(answers)}${lens === "agentforce" ? "&l=a" : ""}`,
      });
    },
  );

  server.registerTool(
    "ship_gate_checklist",
    {
      title: "Ship gate checklist",
      description:
        "The 28 production readiness checks, four in each of seven dimensions: evaluation, cost, observability, guardrails, human oversight, reliability, governance. Use it to review an agent, then pass the counts to ship_gate_score.",
      inputSchema: z.object({}),
      outputSchema: z.object({
        total: z.number(),
        dimensions: z.array(z.object({ key: z.string(), label: z.string(), checks: z.array(z.string()) })),
      }),
      annotations: READ_ONLY,
    },
    async () =>
      json({
        total: SHIP_GATE_TOTAL,
        dimensions: SHIP_GATE.map((d) => ({ key: d.key, label: d.label, checks: d.items })),
      }),
  );

  const countField = (label: string) =>
    z.number().int().min(0).max(4).describe(`How many of the four ${label} checks the agent meets, 0 to 4.`);

  server.registerTool(
    "ship_gate_score",
    {
      title: "Ship gate score",
      description:
        "Score an agent's production readiness from how many of the four checks it meets in each of the seven dimensions (see ship_gate_checklist). Returns the score out of 28, the band, and the strongest and weakest dimensions.",
      inputSchema: z.object(
        Object.fromEntries(SHIP_GATE.map((d) => [d.key, countField(d.label)])) as Record<string, z.ZodNumber>,
      ),
      outputSchema: z.object({
        score: z.number(),
        total: z.number(),
        band: z.string(),
        strongest: z.array(z.string()),
        gaps: z.array(z.string()),
        dimensions: z.array(z.object({ label: z.string(), met: z.number(), of: z.number() })),
      }),
      annotations: READ_ONLY,
    },
    async (args) => {
      const counts = SHIP_GATE.map((d) => Number((args as Record<string, number>)[d.key] ?? 0));
      const score = counts.reduce((n, v) => n + v, 0);
      const { strongest, gaps } = diagnose(counts);
      return json({
        score,
        total: SHIP_GATE_TOTAL,
        band: readinessBand(score, SHIP_GATE_TOTAL),
        strongest,
        gaps,
        dimensions: SHIP_GATE.map((d, i) => ({ label: d.label, met: counts[i], of: d.items.length })),
      });
    },
  );

  server.registerTool(
    "validate_eval_case",
    {
      title: "Validate an eval case",
      description:
        "Check an incident-to-eval case: the portable JSON format that turns a production agent incident into a regression test. Returns the exact problems, or a markdown summary when the case is valid. Same rules as the incident-to-eval skill's validator.",
      inputSchema: z.object({
        evalCase: z.unknown().describe("The eval case as a JSON object."),
      }),
      outputSchema: z.object({
        valid: z.boolean(),
        problems: z.array(z.string()),
        summary: z.string().nullable(),
      }),
      annotations: READ_ONLY,
    },
    async (args) => {
      const c = (args as { evalCase?: unknown }).evalCase;
      const problems = validateCase(c);
      return json({
        valid: problems.length === 0,
        problems,
        summary: problems.length === 0 ? toMarkdown(c as EvalCase) : null,
      });
    },
  );

  server.registerTool(
    "site_agent_evals",
    {
      title: "Latest evals for the site agent",
      description:
        "The latest recorded run of the golden eval set against the ask agent on hamidettefagh.com: pass counts, response times, and any failing questions.",
      inputSchema: z.object({}),
      outputSchema: z.object({
        ranAt: z.string(),
        questions: z.number(),
        questionsPassed: z.number(),
        hardChecks: z.number(),
        hardPassed: z.number(),
        softChecks: z.number(),
        softPassed: z.number(),
        medianMs: z.number().nullable(),
        p95Ms: z.number().nullable(),
        failing: z.array(z.object({ question: z.string(), failedChecks: z.array(z.string()) })),
        url: z.string(),
      }),
      annotations: READ_ONLY,
    },
    async () => {
      const r = LATEST.report;
      return json({
        ranAt: r.ranAt,
        questions: r.summary.cases,
        questionsPassed: r.summary.casesPassed,
        hardChecks: r.summary.hardChecks,
        hardPassed: r.summary.hardPassed,
        softChecks: r.summary.softChecks,
        softPassed: r.summary.softPassed,
        medianMs: r.summary.latencyP50Ms,
        p95Ms: r.summary.latencyP95Ms,
        failing: r.results
          .filter((x) => !x.pass)
          .map((x) => ({
            question: x.question,
            failedChecks: x.checks.filter((k) => k.pass === false).map((k) => k.name),
          })),
        url: `${SITE}/lab/site-agent-evals`,
      });
    },
  );

  return server;
}
