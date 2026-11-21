import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Rule } from "@/components/primitives/Rule";
import { TextLink } from "@/components/primitives/TextLink";
import { CopyLine } from "@/components/patterns/CopyLine";
import { PageIntro, INNER_LINKS } from "@/components/site/PageIntro";
import { PAGE_ANSWERS } from "@/lib/page-gate";
import { siteShipGate } from "@/lib/site-ship-gate";
import { SHIP_GATE } from "@/lib/ship-gate";
import { McpDemo } from "./McpDemo";

const description =
  "This site is also an MCP server. Any MCP client can call the design gate, the ship gate, and the eval validator directly, as deterministic tools.";

export const metadata: Metadata = {
  title: "The two gates, as an MCP server | Hamid Ettefagh",
  description,
  alternates: { canonical: "/lab/mcp" },
};

const ENDPOINT = "https://hamidettefagh.com/api/mcp";

const TOOLS = [
  {
    name: "design_gate",
    what: "Decides the least autonomous architecture that does the job, from seven answers, with an Agentforce lens.",
  },
  { name: "ship_gate_checklist", what: "Lists the 28 production readiness checks, four per dimension." },
  { name: "ship_gate_score", what: "Scores an agent from how many checks it meets in each dimension." },
  { name: "validate_eval_case", what: "Checks an incident-to-eval case with the skill's rules, message for message." },
  { name: "site_agent_evals", what: "Reports the latest eval run of the agent on this site." },
];

const labelCls = "font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500 block mb-2";
const pCls = "text-body leading-body text-ink-700 max-w-(--measure-body) mt-5 mb-0";

export default function McpPage() {
  const site = siteShipGate();
  const gateArgs = {
    does: PAGE_ANSWERS.q1,
    steps: PAGE_ANSWERS.q2,
    jobs: PAGE_ANSWERS.q3,
    actions: PAGE_ANSWERS.q4,
    knowledge: PAGE_ANSWERS.q5,
    demand: PAGE_ANSWERS.q6,
    autonomy: PAGE_ANSWERS.q7,
  };
  const scoreArgs = Object.fromEntries(SHIP_GATE.map((d, i) => [d.key, site.perDimension[i]]));

  return (
    <div>
      <SiteNav links={INNER_LINKS} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <PageIntro
          eyebrow={["Lab", "MCP server"]}
          title="The two gates, as an MCP server"
          lead="An agent should not need a browser to use my tools. This site is also an MCP server: any MCP client can call the design gate, the ship gate, and the eval validator directly. Behind it is the same deterministic code these pages run, with no model inside."
        >
          It speaks both protocol eras: the stateless 2026-07-28 revision, and
          the 2025 handshake, answered by a fresh server per request. No
          sessions, no sign-in, no state, and nothing it can change.
        </PageIntro>

        <div className="mt-11">
          <Rule label="Connect" />
          <div className="grid grid-cols-[minmax(0,1fr)] gap-6 mt-6">
            <div>
              <span className={labelCls}>Endpoint</span>
              <CopyLine text={ENDPOINT} label="the endpoint" />
            </div>
            <div>
              <span className={labelCls}>Claude Code</span>
              <CopyLine text={`claude mcp add --transport http two-gates ${ENDPOINT}`} label="the Claude Code command" />
            </div>
            <div>
              <span className={labelCls}>A server entry for .mcp.json or VS Code</span>
              <CopyLine text={`{ "type": "http", "url": "${ENDPOINT}" }`} label="the server entry" />
            </div>
          </div>
          <p className={pCls}>
            In the Claude apps, add it as a custom connector with the endpoint
            above; it needs no sign-in. Then ask something like: run the design
            gate on a returns agent that issues refunds without a person.
          </p>
        </div>

        <div className="mt-12">
          <Rule label="Tools" source="computed" />
          <ul className="list-none p-0 m-0 mt-2">
            {TOOLS.map((t) => (
              <li
                key={t.name}
                className="grid grid-cols-[220px_minmax(0,1fr)] gap-6 py-4 border-b border-line-1 [@media(max-width:640px)]:grid-cols-1 [@media(max-width:640px)]:gap-1"
              >
                <code className="font-mono text-[13.5px] text-ink-900 pt-[2px]">{t.name}</code>
                <span className="text-small text-ink-700 leading-tight">{t.what}</span>
              </li>
            ))}
          </ul>
          <p className={pCls}>
            Every tool is marked read-only and idempotent, and returns both
            structured JSON and a text copy of it. The tool list is public and
            cacheable for an hour. Calls are rate limited per client, generously:
            the limit only stops a runaway loop.
          </p>
        </div>

        <div className="mt-12">
          <Rule label="Try it from here" source="browser" />
          <p className="text-body leading-body text-ink-700 max-w-(--measure-body) mt-5 mb-6">
            These are real requests from your browser to the endpoint, in the
            2026-07-28 shape, where every request carries its own protocol
            version and no handshake comes first.
          </p>
          <McpDemo
            examples={[
              { label: "List the tools", method: "tools/list" },
              { label: "Design gate on my home page", method: "tools/call", name: "design_gate", args: gateArgs },
              { label: "Score this site's agent", method: "tools/call", name: "ship_gate_score", args: scoreArgs },
              { label: "Latest evals", method: "tools/call", name: "site_agent_evals", args: {} },
            ]}
          />
        </div>

        <p className="mt-10 text-small text-ink-500 leading-tight max-w-[62ch]">
          The same gates install as skills in the{" "}
          <TextLink href="https://github.com/hamidettefagh/two-gates" external>
            two-gates plugin
          </TextLink>
          , for when you want them reading a real spec or codebase rather than
          seven answers. The method behind them is in{" "}
          <TextLink href="/two-gates">the two gates</TextLink>.
        </p>
      </article>
    </div>
  );
}
