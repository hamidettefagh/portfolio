import { Rule } from "@/components/primitives/Rule";
import { ProjectRow } from "@/components/patterns/ProjectRow";

// Selected work — copy verbatim from ui_kits/portfolio/WorkSection.jsx (WORK_ITEMS)
export const WORK_ITEMS = [
  {
    index: "01",
    title: "Airline super agent program",
    summary:
      "Lead forward deployed engineer on a production multi-agent platform serving customer operations. Stabilized a critical go-live under executive visibility and co-authored the roadmap for the next-generation agent now in flight.",
    org: "Major US airline",
  },
  {
    index: "02",
    title: "Agent cost and retention optimization",
    summary:
      "Re-architected the production agent runtime, cutting operating costs by 80 percent and driving more than 1,150 customer reactivations.",
    org: "Global dining platform",
  },
  {
    index: "03",
    title: "Global deal registration program",
    summary:
      "Architected the foundational program spanning the US, Japan, and Asia-Pacific, delivered with zero-defect UAT across 17 languages.",
    org: "Consumer electronics leader",
  },
  {
    index: "04",
    title: "Agentic AI proof of concept",
    summary:
      "Designed and delivered a large-scale agentic proof of concept with projected material reduction in average handle time.",
    org: "National telecom carrier",
  },
  {
    index: "05",
    title: "InsightForce",
    summary:
      "AI insight engine prototype. Winner of a 63-entry company-wide hackathon, with modeled pipeline impact north of $1B.",
    org: "Internal innovation",
  },
];

export function WorkSection({
  detailHref = "/work/airline-super-agent",
}: {
  detailHref?: string;
}) {
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
          <ProjectRow
            key={w.index}
            {...w}
            href={w.index === "01" ? detailHref : undefined}
          />
        ))}
      </div>
    </section>
  );
}
