import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { TextLink } from "@/components/primitives/TextLink";
import { Button } from "@/components/primitives/Button";
import { Rule } from "@/components/primitives/Rule";

const description =
  "A production airline agent nearly got pulled offline in its first day. Here is what it taught me: two gates, one to decide what to build and one to prove it is ready to run.";

export const metadata: Metadata = {
  title: "The two gates | Hamid Ettefagh",
  description,
};

const labelCls =
  "font-mono text-mono tracking-mono uppercase text-accent-600 block mt-11 mb-4";
const pCls = "text-body leading-body text-ink-900 max-w-(--measure-body) mt-0 mb-4";

export default function TwoGates() {
  return (
    <div>
      <SiteNav links={[{ href: "/", label: "Home" }]} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <Eyebrow dot="accent">{["Field notes", "Building agents"]}</Eyebrow>
        <h1 className="font-display font-bold text-[clamp(40px,5.4vw,68px)] tracking-display leading-[1.02] mt-6 mb-7 text-balance">
          The two gates
        </h1>
        <p className="text-lead leading-[1.5] text-ink-700 max-w-[60ch] m-0">
          I build agents for production. The failures I see do not come from a
          lack of ambition. They come from the opposite: a system given more
          autonomy than the job needed, then shipped before anyone proved it
          could hold. So I stopped starting from the model. I start from two
          gates. The first decides what to build. The second decides whether it
          is ready to run. Nothing goes live until it clears both. I did not
          arrive at this from theory. I arrived at it from a system that nearly
          got shut down in its first day.
        </p>

        <div className="mt-11">
          <Rule />
        </div>

        <h2 className={labelCls}>The weekend it almost died</h2>
        <p className={pCls}>
          A major US airline put a customer service agent into production. Within
          a day of go-live, leadership was weighing a rollback. The failure was
          not a crash. The agent answered a policy question fluently,
          confidently, and wrong. On follow-up questions it skipped its
          knowledge lookup and answered from the conversation so far, or from
          what the model had absorbed in training, instead of from the
          airline&rsquo;s current approved policy. Its instructions said to
          always look it up. In a federally regulated business, a fluent wrong
          answer is worse than no answer, because fluency is what makes people
          trust it.
        </p>
        <p className={pCls}>
          I spent that Friday night and the Saturday after inside the system. The
          logs flagged low instruction adherence on exactly the turns that went
          wrong. The fix I could ship that weekend was tighter grounding
          instructions and a cleanup of the global instructions every topic
          shared, and it held. The platform stayed in production and the
          rollback never happened. Then I found an observability metric that had
          been lying about what the system was doing and fixed it at the source,
          because a number you cannot trust is worse than no number.
        </p>
        <p className={pCls}>
          But the weekend fix held by asking the model more firmly, and an
          instruction is a preference, not a guarantee. Afterward, about 1
          percent of interactions still showed the agent drifting from its
          instructions. The fix that lasts is not more intelligence, and it is
          not more instruction. It is less latitude: retrieval first in the
          path, so the agent answers from the approved source because it has no
          other route.
        </p>
        <p className={pCls}>
          That weekend bought the time to do the rest properly. I drew a hard
          trust boundary around the federally regulated data so nothing crossed
          it by accident. I built the tools once so every agent could share them
          rather than rebuild. That agent now handles more than 120,000
          automated customer actions a week, with case deflection between 40 and
          49 percent. I am leading the build of its next architecture, which
          puts that lookup in the path: one orchestrator that answers questions
          itself and a single delegate for back-office work, instead of one agent
          trying to hold everything. The full account is in the{" "}
          <TextLink href="/work/airline-super-agent">case study</TextLink>.
        </p>

        <h2 className={labelCls}>What the scar taught</h2>
        <p className={pCls}>
          The lesson was not add retrieval. The agent had retrieval. It was
          allowed to skip it, and no instruction takes that permission away. The
          failure lived at run time. The fix that lasts lives at design time,
          and I had been treating them as one decision.
        </p>
        <p className={pCls}>
          That weekend I patched it at run time, because that is all a weekend
          allows. But whether a step is required, whether to use one agent or
          several, where the trust boundary goes: those are settled before
          anything is built, and they are a different decision made at a
          different time. So I started running two gates, one before I build and
          one before I run, and I built each one into something I can run again
          instead of relearning it over a broken launch.
        </p>

        <h2 className={labelCls}>The design gate: decide what to build</h2>
        <p className={pCls}>
          Most agent projects fail at a decision made before any code is written.
          Someone assumes the answer is an agent, because agents are the
          interesting thing to build, and reaches for the most autonomous version
          of it. The design gate refuses that. It asks a narrower question first:
          given this task, what is the least autonomy that does the job. A
          workflow. A hybrid. A single model call. One agent with tools. Or, only
          when the work genuinely demands it, several agents behind an
          orchestrator.
        </p>
        <p className={pCls}>
          I turned that gate into a tool,{" "}
          <TextLink href="/agent-architecture">agent, or workflow</TextLink>, with
          a{" "}
          <TextLink href="https://github.com/hamidettefagh/agent-or-workflow" external>
            Claude skill
          </TextLink>{" "}
          behind it. You describe the problem and it returns a verdict, and the
          verdict is deterministic code, not a model reasoning about itself in a
          loop. A routing decision you can settle with rules should be settled
          with rules, because rules do not drift and you can read them a year
          later and know exactly what they did. The airline&rsquo;s next
          architecture is multi-agent because the design gate said it needed to
          be, and I can show that reasoning rather than assert it.
        </p>

        <p className="font-display font-semibold text-[clamp(22px,3.2vw,30px)] tracking-heading leading-[1.28] text-ink-900 max-w-[26ch] my-12">
          A demo is not evidence.
        </p>

        <h2 className={labelCls}>The ship gate: prove it is ready</h2>
        <p className={pCls}>
          Passing the design gate means you built the right thing. It says
          nothing about whether the thing works. That is a separate question, and
          it is the one that gets skipped, because by ship time everyone is tired
          and the demo looks good.
        </p>
        <p className={pCls}>
          So the second gate scores a built agent across seven dimensions before
          go-live: where its answers actually come from, what it is allowed to
          touch, whether you can see what it did after the fact, how it fails, and
          whether any of it holds under load. This is the{" "}
          <TextLink href="/agent-production-readiness">
            agent production readiness diagnostic
          </TextLink>
          , with{" "}
          <TextLink
            href="https://github.com/hamidettefagh/agent-production-readiness"
            external
          >
            its own skill
          </TextLink>
          . Grounding is one of those dimensions. It is the check that would have
          caught the airline failure on a Tuesday afternoon instead of a Friday
          night. Every failure I chased that weekend was a ship-gate dimension.
          None of them showed up in the demo. All of them showed up in
          production.
        </p>

        <h2 className={labelCls}>Why I work this way now</h2>
        <p className={pCls}>
          Two gates, in order. The design gate keeps me from building more
          autonomy than the job needs. The ship gate keeps me from trusting a
          thing I have not proven. One decides what to build. The other decides
          whether it is ready. Between them sits most of the distance between an
          agent that demos well and an agent that runs.
        </p>
        <p className={pCls}>
          I did not name this after myself, and I am not going to. It is not a
          framework. It is two questions I now ask every time, written down so I
          ask them the same way each time. The airline system is the reason I ask
          them at all. Everything since has just been me refusing to relearn that
          Friday night.
        </p>

        <div className="flex items-center gap-6 mt-12 flex-wrap">
          <Button href="/agent-architecture" variant="secondary" arrow>
            The design gate
          </Button>
          <Button href="/agent-production-readiness" variant="secondary" arrow>
            The ship gate
          </Button>
        </div>
        <p className="mt-6 text-small text-ink-500 leading-tight">
          The whole method, both gates plus a loop that turns incidents into
          regression evals, installs as a{" "}
          <TextLink href="https://github.com/hamidettefagh/two-gates" external>
            Claude Code plugin
          </TextLink>
          . It is listed in Anthropic&apos;s plugin directory: search two-gates
          under Discover in the Claude apps.
        </p>
      </article>
    </div>
  );
}
