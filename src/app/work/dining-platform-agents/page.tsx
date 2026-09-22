import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Tag } from "@/components/primitives/Tag";
import { Rule } from "@/components/primitives/Rule";
import { Button } from "@/components/primitives/Button";
import { TextLink } from "@/components/primitives/TextLink";
import { ArchitectureDiagram } from "@/components/patterns/ArchitectureDiagram";

const description =
  "Two live service agents were promising customers a transfer that could not happen. How I rebuilt escalation so the decision is computed from state instead of inferred by a model.";

export const metadata: Metadata = {
  title: "Service agents for a two-sided marketplace | Hamid Ettefagh",
  description,
};

// Case study detail — ui_kits/portfolio/CaseStudy.jsx
const labelCls =
  "font-mono text-mono tracking-mono uppercase text-accent-600 block mt-10 mb-4";
const pCls = "text-body leading-body text-ink-900 max-w-(--measure-body) mt-0 mb-4";

const decisions = [
  {
    lead: "Compute escalation eligibility before the model reasons, not while it reasons.",
    body: "Business hours and human availability are fetched and written to variables in a pre-reasoning step. The model then works from booleans it cannot argue with. I rejected fetching availability as a tool the model could call when it judged it relevant, because that preserves the failure: it may not call it, or it may call it and reason past the answer.",
  },
  {
    lead: "Order the checks by cost, cheap gate before expensive call.",
    body: "Business hours is a metadata lookup. Agent availability is an expensive call. Business hours runs first and short-circuits, so the expensive call never fires for the large share of turns that are out of hours and could not escalate anyway. I rejected caching availability, because a stale yes is exactly how you transfer someone into an empty queue.",
  },
  {
    lead: "Never announce a transfer that cannot happen.",
    body: "Inside hours with a person online, it escalates, once. Otherwise it does not attempt a transfer at all. It opens a ticket, gives the customer the number and a follow-up window, and says why. I rejected queueing the customer for the next available person, because out of hours that wait is until morning, and a ticket with a stated window is a promise that can actually be kept.",
  },
  {
    lead: "Break the loop with a flag set before the attempt, not after.",
    body: "A boolean is set true at the start of the escalation path, and the routing gate requires it to be false. Without it, nothing stopped a conversation re-entering escalation repeatedly, which is how a customer gets told three times that they are being transferred. I rejected a counter with a threshold, because it adds a tuning parameter nobody will ever tune correctly.",
  },
  {
    lead: "Put all customer-facing wording in one place.",
    body: "The platform emits its own handoff text at transfer, which lands on top of carefully designed wording and can contradict it, including announcing a transfer in the cases where the design deliberately does not transfer. I blanked it rather than rewriting it to something generically acceptable, so exactly one layer speaks to the customer.",
  },
  {
    lead: "Land the deterministic foundation before authenticated actions go on top.",
    body: "The plan was to build authenticated actions on the existing configuration and migrate afterward. That meant building read and write access to real customer accounts on a foundation we were about to replace, then migrating the riskiest part. I sequenced the migration first. I would rather delay a capability than migrate authenticated writes twice.",
  },
];

const outcomes = [
  "The redesign shipped to production and held. In a measured week about a month in, the two agents handled 14,882 conversations and 16,682 actions between them.",
  "The diner-facing agent ran at 59.59 percent deflection with 70.5 percent satisfaction.",
  "The operator-facing agent ran at 80.09 percent deflection with 53 percent satisfaction. The gap between those two numbers is the honest finding. It resolves more without transferring, and the people it resolves for are measurably less happy about it. That tension was the next thing to work on, not something to average away.",
  "The architecture stopped being one customer's fix. When an engineer on another account hit agents that stalled and looped on handoff, I wrote the pattern up, state variables, routing gate, pre-reasoning fetch and ticket fallback, and it became a design other engineers applied.",
  "The engagement ended because it was finished. The platform moved from build into steady state and the account graduated, which was always the goal: a system the customer runs without me.",
];

export default function CaseStudy() {
  return (
    <div>
      <SiteNav links={[{ href: "/#work", label: "All work" }]} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <Eyebrow dot="accent">{["Case study", "Global dining platform"]}</Eyebrow>
        <h1 className="font-display font-bold text-[clamp(40px,5.4vw,68px)] tracking-display leading-[1.02] mt-6 mb-5 text-balance">
          Service agents for a two-sided marketplace
        </h1>
        <p className="text-lead leading-[1.5] text-ink-700 max-w-[56ch] m-0">
          Two production agents were telling customers a person was coming when
          no person was available. I rebuilt escalation so the decision is
          computed from state before the model ever reasons about it.
        </p>
        <div className="flex gap-[10px] flex-wrap mt-8 mb-10">
          <Tag>Lead forward deployed engineer</Tag>
          <Tag>Two production agents</Tag>
          <Tag variant="fill">Graduated to steady state</Tag>
        </div>

        <Rule />

        <h2 className={labelCls}>Overview</h2>
        <p className={pCls}>
          A global dining platform ran two live service agents, one facing
          diners and one facing restaurant operators, together carrying roughly
          15,000 conversations a week. I led the engagement as the forward
          deployed engineer: rebuilding the escalation path both agents depended
          on, then migrating them onto a deterministic authoring model before
          any authenticated action was built on top.
        </p>
        <div className="mt-7">
          <ArchitectureDiagram
            stages={[
              { label: "Customer" },
              { label: "Agent" },
              { label: "Eligibility gate", accent: true },
              { label: "Human, or a ticket" },
            ]}
          />
        </div>

        <h2 className={labelCls}>The turning point</h2>
        <p className={pCls}>
          The escalation flow in the diagrams was not the escalation flow in
          production. Someone had applied a fix to it that nobody could explain
          when asked. I ran a deep dive with their engineer just to establish
          what the system actually did, then rebuilt the diagrams from the
          running configuration.
        </p>
        <p className={pCls}>
          What surfaced was worse than drift. The agent was being asked to
          decide something it had no way to know. Whether to hand a customer to
          a person depends on two facts, whether it is inside business hours and
          whether anyone is actually online, and neither one is in the
          conversation. The model was inferring an answer to a question that had
          a lookup.
        </p>
        <p className={pCls}>
          The failure that produces is the worst thing a service agent can do.
          It tells a customer that help is coming, and then nobody comes. That
          is not a wrong answer, it is a broken promise, and customers forgive
          the first far more readily than the second.
        </p>

        <h2 className={labelCls}>Decisions</h2>
        <ul className="list-none p-0 m-0 max-w-(--measure-body)">
          {decisions.map((d) => (
            <li
              key={d.lead}
              className="text-body leading-body text-ink-700 py-4 border-t border-line-1"
            >
              <span className="text-ink-900 font-medium">{d.lead}</span> {d.body}
            </li>
          ))}
        </ul>

        <h2 className={labelCls}>Outcomes</h2>
        <ul className="list-none p-0 m-0 max-w-(--measure-body)">
          {outcomes.map((o, i) => (
            <li
              key={i}
              className="text-body leading-body text-ink-700 py-4 border-t border-line-1"
            >
              {o}
            </li>
          ))}
        </ul>

        <h2 className={labelCls}>What carried forward</h2>
        <p className={pCls}>
          Never let a model decide something that has a lookup. Availability,
          entitlement, business hours, permissions: these are facts with
          authoritative sources. Handing them to inference produces a system
          that is confidently wrong at exactly the moments that matter most, and
          that cannot be audited afterward. The model can phrase the outcome. It
          does not get to determine it.
        </p>
        <p className="mt-6 text-small text-ink-500 leading-tight">
          The approach it taught me is in{" "}
          <TextLink href="/two-gates">the two gates</TextLink>.
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
