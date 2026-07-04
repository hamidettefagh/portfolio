import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Tag } from "@/components/primitives/Tag";
import { Rule } from "@/components/primitives/Rule";
import { Button } from "@/components/primitives/Button";

export const metadata: Metadata = {
  title: "Airline super agent program, case study",
  description:
    "How I stabilized a major US airline's production customer service agent through a go-live crisis, then designed the delegate-agent architecture it now runs on.",
};

// Case study detail — ui_kits/portfolio/CaseStudy.jsx
const labelCls =
  "font-mono text-mono tracking-mono uppercase text-accent-600 block mt-10 mb-4";
const pCls = "text-body leading-body text-ink-900 max-w-(--measure-body) mt-0 mb-4";

const decisions = [
  {
    lead: "Ground every answer in retrieval, not the model's own knowledge.",
    body: "The go-live failure traced directly to the agent answering from parametric knowledge. I enforced retrieval-grounded responses so the agent could only draw from approved, current sources.",
  },
  {
    lead: "Split one agent into delegate agents behind an orchestrator.",
    body: "Instead of a single monolithic agent, I designed specialized delegates for loyalty and back-office requests, coordinated by an orchestrator, so each domain could be governed, tested, and scaled on its own.",
  },
  {
    lead: "Draw an explicit trust boundary for regulated data.",
    body: "I authored the trust-boundary analysis for federally regulated customer data moving through the platform, and set the deployment path that kept that data inside the required controls.",
  },
  {
    lead: "Build tools once, share them across agents and partners.",
    body: "I defined a reusable tool strategy so capabilities were implemented a single time and shared across delegates and SI partners, rather than rebuilt per agent.",
  },
  {
    lead: "Fix the observability gap at the source.",
    body: "When the analytics layer produced unreliable KPIs, I built the query and computed the metric directly so leadership had a trustworthy read on production.",
  },
];

const outcomes = [
  "The program survived the go-live escalation and stayed in production. The weekend grounding fix reversed a decision that had already been made to shut it down.",
  "In production, the platform handles hundreds of thousands of automated customer actions a week and deflects roughly 20 percent of call-center volume.",
  "I co-authored the roadmap and statement of work for the next-generation agent architecture, now in delivery.",
  "I became the technical point of contact leadership escalated to for the hardest production and trust decisions on the account.",
];

export default function CaseStudy() {
  return (
    <div>
      <SiteNav links={[{ href: "/#work", label: "All work" }]} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <Eyebrow dot="accent">{["Case study", "Major US airline"]}</Eyebrow>
        <h1 className="font-display font-bold text-[clamp(40px,5.4vw,68px)] tracking-display leading-[1.02] mt-6 mb-5 text-balance">
          Airline super agent program
        </h1>
        <p className="text-lead leading-[1.5] text-ink-700 max-w-[56ch] m-0">
          I stabilized a production customer service agent that leadership had
          moved to shut down within a day of launch, then co-authored the
          architecture for its next generation.
        </p>
        <div className="flex gap-[10px] flex-wrap mt-8 mb-10">
          <Tag>Lead forward deployed engineer</Tag>
          <Tag>Multi-agent platform</Tag>
          <Tag variant="fill">In production</Tag>
        </div>

        <Rule />

        <span className={labelCls}>Overview</span>
        <p className={pCls}>
          A major US airline launched a production customer service agent to
          deflect call-center volume across loyalty, baggage, and back-office
          requests. I led the engagement as the forward deployed engineer:
          stabilizing the platform through a go-live crisis, then designing the
          delegate-agent architecture it now runs on.
        </p>

        <span className={labelCls}>The turning point</span>
        <p className={pCls}>
          Within a day of launch, the agent gave customers guidance that no
          longer matched a policy the airline had recently changed. The error
          reached real customers, and the executive team moved to pull the
          platform out of production. I stepped in over a Friday night and
          Saturday to find the failure and fix it before the decision became
          permanent.
        </p>
        <p className={pCls}>
          The cause was not a weak model. The agent was answering from what the
          model already held rather than from the airline's current, approved
          knowledge. The fix was to force every answer through retrieval, so the
          agent could only respond from sources the airline controlled and kept
          current.
        </p>

        <span className={labelCls}>Decisions</span>
        <ul className="list-none p-0 m-0 max-w-(--measure-body)">
          {decisions.map((d) => (
            <li
              key={d.lead}
              className="text-body leading-body text-ink-800 py-4 border-t border-line-1"
            >
              <span className="text-ink-900 font-medium">{d.lead}</span> {d.body}
            </li>
          ))}
        </ul>

        <span className={labelCls}>Outcomes</span>
        <ul className="list-none p-0 m-0 max-w-(--measure-body)">
          {outcomes.map((o, i) => (
            <li
              key={i}
              className="text-body leading-body text-ink-800 py-4 border-t border-line-1"
            >
              {o}
            </li>
          ))}
        </ul>

        <span className={labelCls}>What carried forward</span>
        <p className={pCls}>
          The incident is a compact version of why enterprise agents fail in
          production. Not because the model is weak, but because it is allowed to
          answer from the wrong source. Reliability comes from grounding answers
          in current, approved knowledge and enforcing trust boundaries
          deterministically in the request path, not from trusting the model to
          police itself.
        </p>

        <div className="mt-11">
          <Button href="/#work" variant="secondary">
            Back to all work
          </Button>
        </div>
      </article>
    </div>
  );
}
