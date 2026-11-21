import { Rule } from "@/components/primitives/Rule";
import { ProjectRow } from "@/components/patterns/ProjectRow";
import { Receipt } from "@/components/receipts/Receipts";

// Selected work — copy verbatim from ui_kits/portfolio/WorkSection.jsx (WORK_ITEMS)
// Every figure carries its evidence class for receipts mode.
export const WORK_ITEMS: {
  index: string;
  title: string;
  summary: React.ReactNode;
  org: string;
  href?: string;
}[] = [
  {
    index: "01",
    title: "Multi-agent customer operations platform",
    summary: (
      <>
        A production customer service agent, handling{" "}
        <Receipt kind="production" note="Weekly count of automated actions on live traffic">
          more than 120,000 automated actions a week
        </Receipt>{" "}
        with{" "}
        <Receipt kind="production" note="Case deflection reported from the live system">
          case deflection between 40 and 49 percent
        </Receipt>
        . I led it through the launch failure that nearly ended it, and I&rsquo;m
        now leading the build of the multi-agent architecture it moves to next.
      </>
    ),
    org: "Major US airline",
    href: "/work/airline-super-agent",
  },
  {
    index: "02",
    title: "Service agents for a two-sided marketplace",
    summary: (
      <>
        Two live agents, one facing diners and one facing restaurant operators,
        together carrying{" "}
        <Receipt kind="production" note="Weekly conversations across both agents, live traffic">
          between 8,000 and 15,000 conversations a week
        </Receipt>
        . I rebuilt the escalation path so a handoff is computed from business
        hours and real availability, not guessed by the model. The
        operator-facing agent runs at{" "}
        <Receipt kind="production" note="Deflection in a measured production week">
          80 percent deflection
        </Receipt>
        , and the agents recorded{" "}
        <Receipt kind="count" note="Reactivations recorded by the production system">
          1,156 successful customer reactivations
        </Receipt>
        .
      </>
    ),
    org: "Global dining platform",
    href: "/work/dining-platform-agents",
  },
  {
    index: "03",
    title: "Global deal registration program",
    summary: (
      <>
        A partner deal registration program{" "}
        <Receipt kind="testing" note="User acceptance testing, before launch">
          validated in UAT across 17 languages
        </Receipt>
        , spanning the US, Japan, and Asia-Pacific. I architected the
        foundational program.
      </>
    ),
    org: "Global consumer technology company",
  },
  {
    index: "04",
    title: "Contact center AI proof of concept",
    summary: (
      <>
        A large-scale AI proof of concept for a contact center, with a{" "}
        <Receipt kind="projection" note="Forecast from the proof of concept, not measured in production">
          projected material reduction in average handle time
        </Receipt>
        . I designed and delivered it, and projected is deliberate: a proof of
        concept earns a forecast, not a production claim.
      </>
    ),
    org: "National telecom carrier",
  },
  {
    index: "05",
    title: "InsightForce",
    summary: (
      <>
        An AI insight engine prototype my team built for an internal engineering
        hackathon, named{" "}
        <Receipt kind="count" note="Result announced by the organizers">
          one of five winners out of 63 submissions
        </Receipt>
        .
      </>
    ),
    org: "Internal innovation",
  },
];

export function WorkSection() {
  return (
    <section className="pt-12 scroll-mt-[84px]" id="work">
      <div className="mb-8">
        <Rule label="Selected work" source="static" />
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
