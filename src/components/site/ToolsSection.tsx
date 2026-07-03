import { Rule } from "@/components/primitives/Rule";
import { Button } from "@/components/primitives/Button";
import { TextLink } from "@/components/primitives/TextLink";
import { RadarChart } from "@/components/patterns/RadarChart";
import { ArchitectureDiagram } from "@/components/patterns/ArchitectureDiagram";

// A representative filled profile so the showcase radar reads as a real result.
const EXAMPLE = [4, 3, 4, 4, 3, 4, 3];

// A representative architecture flow for the showcase.
const EXAMPLE_STAGES = [
  { label: "You" },
  { label: "Agent", accent: true },
  { label: "Retrieval" },
  { label: "Human approval" },
  { label: "Systems of record" },
];

export function ToolsSection() {
  return (
    <section className="pt-12 scroll-mt-[84px]" id="tools">
      <div className="mb-8">
        <Rule label="Tools" />
        <h2 className="font-display font-bold text-h2 tracking-heading leading-[1.05] mt-6 mb-0">
          Built in the open
        </h2>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 items-center [@media(max-width:860px)]:grid-cols-1 [@media(max-width:860px)]:gap-7">
        <div className="mx-auto w-full max-w-[440px]">
          <RadarChart values={EXAMPLE} />
        </div>
        <div>
          <h3 className="font-display font-semibold text-[24px] tracking-heading leading-heading m-0">
            Agent production readiness
          </h3>
          <p className="mt-3 mb-0 text-body leading-body text-ink-700 max-w-[46ch]">
            A diagnostic for telling a demo agent from a production one. It
            scores an agent across seven dimensions, shows where it is strong and
            where it is thin, and turns the gaps into a plan. Use the interactive
            version, or run the same review from your editor with the Claude
            skill.
          </p>
          <div className="flex items-center gap-6 mt-6">
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
        </div>
      </div>

      <div className="mt-12 pt-10 border-t border-line-1">
        <h3 className="font-display font-semibold text-[24px] tracking-heading leading-heading m-0">
          Agent architecture
        </h3>
        <p className="mt-3 mb-0 text-body leading-body text-ink-700 max-w-[56ch]">
          The design-time companion. Answer a few questions about your use case
          and get an opinionated starting architecture: one agent or many, where
          the knowledge and the humans belong, and the risks I would flag.
        </p>
        <div className="mt-7">
          <ArchitectureDiagram stages={EXAMPLE_STAGES} />
        </div>
        <div className="mt-7">
          <Button href="/agent-architecture" variant="secondary" arrow>
            Open the tool
          </Button>
        </div>
      </div>
    </section>
  );
}
