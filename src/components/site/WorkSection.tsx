import { Rule } from "@/components/primitives/Rule";
import { ProjectRow } from "@/components/patterns/ProjectRow";

// Selected work — copy verbatim from ui_kits/portfolio/WorkSection.jsx (WORK_ITEMS)
export const WORK_ITEMS = [
  {
    index: "01",
    title: "Multi-agent customer operations platform",
    summary:
      "A production customer service agent, handling more than 120,000 automated actions a week with case deflection between 40 and 49 percent. I led it through the launch failure that nearly ended it, and I'm now leading the build of the multi-agent architecture it moves to next.",
    org: "Major US airline",
    href: "/work/airline-super-agent",
  },
  {
    index: "02",
    title: "Service agents for a two-sided marketplace",
    summary:
      "Two live agents, one facing diners and one facing restaurant operators, together carrying between 8,000 and 15,000 conversations a week. I rebuilt the escalation path so a handoff is computed from business hours and real availability, not guessed by the model. The operator-facing agent runs at 80 percent deflection, and the agents recorded 1,156 successful customer reactivations.",
    org: "Global dining platform",
    href: "/work/dining-platform-agents",
  },
  {
    index: "03",
    title: "Global deal registration program",
    summary:
      "A partner deal registration program validated in UAT across 17 languages, spanning the US, Japan, and Asia-Pacific. I architected the foundational program.",
    org: "Global consumer technology company",
  },
  {
    index: "04",
    title: "Contact center AI proof of concept",
    summary:
      "A large-scale AI proof of concept for a contact center, with a projected material reduction in average handle time. I designed and delivered it, and projected is deliberate: a proof of concept earns a forecast, not a production claim.",
    org: "National telecom carrier",
  },
  {
    index: "05",
    title: "InsightForce",
    summary:
      "An AI insight engine prototype my team built for an internal engineering hackathon, named one of five winners out of 63 submissions.",
    org: "Internal innovation",
  },
];

export function WorkSection() {
  return (
    <section className="pt-12 scroll-mt-[84px]" id="work">
      <div className="mb-8">
        <Rule label="Selected work" />
        <h2 className="font-display font-bold text-h2 tracking-heading leading-[1.05] mt-6 mb-0">
          Five engagements, one job:
          <br />
          make it real
        </h2>
      </div>
      <div className="border-b border-line-1">
        {WORK_ITEMS.map((w) => (
          <ProjectRow key={w.index} {...w} />
        ))}
      </div>
    </section>
  );
}
