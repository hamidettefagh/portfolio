import { Rule } from "@/components/primitives/Rule";
import { Button } from "@/components/primitives/Button";
import { TextLink } from "@/components/primitives/TextLink";
import { GateCases } from "@/components/site/GateCases";
import { ReadinessProfiles } from "@/components/site/ReadinessProfiles";
import { GATE_CASES } from "@/lib/page-gate";

// Three illustrative agents for the showcase radar, one value per axis in the
// order of READINESS_AXES. Archetypes, not engagements.
const PROFILES = [
  { label: "A weekend demo", values: [1, 0, 1, 1, 1, 0, 0] },
  { label: "A pilot with real users", values: [2, 2, 2, 3, 3, 2, 1] },
  { label: "Two quarters in production", values: [4, 3, 4, 4, 3, 4, 3] },
];

const gateLabelCls =
  "font-mono text-mono tracking-mono uppercase text-accent-600 block mb-3";

export function ToolsSection() {
  return (
    <section className="pt-12 scroll-mt-[84px]" id="tools">
      <div className="mb-9">
        <Rule label="Tools" />
        <h2 className="font-display font-bold text-h2 tracking-heading leading-[1.05] mt-6 mb-3">
          Two gates, built in the open
        </h2>
        <p className="text-body leading-body text-ink-700 max-w-[60ch] m-0">
          Two questions I ask on every build, each one turned into something you
          can run. The design gate decides what to build. The ship gate decides
          whether it is ready. The write-up behind both is in{" "}
          <TextLink href="/two-gates">the two gates</TextLink>, and the whole
          method installs as a{" "}
          <TextLink href="https://github.com/hamidettefagh/two-gates" external>
            Claude Code plugin
          </TextLink>
          , gates plus a loop that turns production incidents into regression
          evals.
        </p>
      </div>

      <div>
        <span className={gateLabelCls}>The design gate</span>
        <h3 className="font-display font-semibold text-[24px] tracking-heading leading-heading m-0">
          Agent, or workflow?
        </h3>
        <p className="mt-3 mb-0 text-body leading-body text-ink-700 max-w-[56ch]">
          I keep seeing agents built where a workflow would do. Answer seven
          questions and get an opinionated call on which parts actually need
          reasoning, and which should stay deterministic automation you can test.
          Use the browser version, or run the same decision over a real spec from
          your editor with the Claude skill.
        </p>
        <div className="mt-7">
          <GateCases cases={GATE_CASES} initial={1} />
        </div>
        <div className="flex items-center gap-6 mt-7">
          <Button href="/agent-architecture" variant="secondary" arrow>
            Open the tool
          </Button>
          <TextLink
            href="https://github.com/hamidettefagh/agent-or-workflow"
            external
          >
            On GitHub
          </TextLink>
        </div>
      </div>

      <div className="mt-12 pt-10 border-t border-line-1">
        <span className={gateLabelCls}>The ship gate</span>
        <ReadinessProfiles
          profiles={PROFILES}
          initial={2}
          actions={
            <div className="flex items-center gap-6 mt-7">
              <Button href="/agent-production-readiness" variant="secondary" arrow>
                Open the diagnostic
              </Button>
              <TextLink
                href="https://github.com/hamidettefagh/agent-production-readiness"
                external
              >
                On GitHub
              </TextLink>
            </div>
          }
        >
          <h3 className="font-display font-semibold text-[24px] tracking-heading leading-heading m-0">
            Agent production readiness
          </h3>
          <p className="mt-3 mb-0 text-body leading-body text-ink-700 max-w-[46ch]">
            A diagnostic for telling a demo agent from a production one. It
            scores an agent across seven dimensions, shows where it is strong
            and where it is thin, and turns the gaps into a plan. Use the
            interactive version, or run the same review from your editor with
            the Claude skill.
          </p>
        </ReadinessProfiles>
      </div>
    </section>
  );
}
