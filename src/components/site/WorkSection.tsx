import { Rule } from "@/components/primitives/Rule";
import { ProjectRow } from "@/components/patterns/ProjectRow";

// Selected work — copy verbatim from ui_kits/portfolio/WorkSection.jsx (WORK_ITEMS)
export const WORK_ITEMS = [
  {
    index: "01",
    title: "Multi-agent customer operations platform",
    summary:
      "A production multi-agent platform for customer operations, now handling hundreds of thousands of automated actions a week and deflecting roughly 20 percent of call volume. I led it through the launch failure that nearly ended it and designed the delegate-agent architecture it runs on today.",
    org: "Major US airline",
    href: "/work/airline-super-agent",
  },
  {
    index: "02",
    title: "Service agents for a two-sided marketplace",
    summary:
      "Two live agents, one facing diners and one facing restaurant operators, together carrying roughly 15,000 conversations a week. I rebuilt the escalation path so a handoff is computed from business hours and real availability, and the agents stopped promising transfers that could not happen.",
    org: "Global dining platform",
    href: "/work/dining-platform-agents",
  },
  {
    index: "03",
    title: "Global deal registration program",
    summary:
      "Zero-defect UAT across 17 languages, spanning the US, Japan, and Asia-Pacific. I architected the foundational program.",
    org: "Consumer electronics leader",
  },
  {
    index: "04",
    title: "Agentic AI proof of concept",
    summary:
      "A large-scale agentic proof of concept with a projected material reduction in average handle time. I designed and delivered it, and projected is deliberate: a proof of concept earns a forecast, not a production claim.",
    org: "National telecom carrier",
  },
  {
    index: "05",
    title: "InsightForce",
    summary:
      "An AI insight engine prototype with modeled pipeline impact north of $1B. I built it for a 63-entry company-wide hackathon and it took first place.",
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
