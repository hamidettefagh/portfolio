import { Rule } from "@/components/primitives/Rule";

// About — copy verbatim from ui_kits/portfolio/AboutSection.jsx
const PRINCIPLES = [
  {
    num: "01",
    title: "Production over demos",
    text: "An agent that works in a keynote is not an agent that works at 2am.",
  },
  {
    num: "02",
    title: "Cost is a feature",
    text: "Runtimes should get cheaper as they get smarter.",
  },
  {
    num: "03",
    title: "Trust is architecture",
    text: "Governance belongs in the system design, not the slide deck.",
  },
];

export function AboutSection() {
  const pCls =
    "text-body leading-body text-ink-900 max-w-(--measure-body) mt-0 mb-5";
  return (
    <section className="pt-12 scroll-mt-[84px]" id="about">
      <div className="mb-8">
        <Rule label="About" />
        <h2 className="font-display font-bold text-h2 tracking-heading leading-[1.05] mt-6 mb-0">
          The gap between
          <br />
          pilot and production
        </h2>
      </div>
      <div>
        <p className={pCls}>
          I&rsquo;m a Senior Forward Deployed Engineer at Salesforce, where I
          lead production AI deployments for some of the company&rsquo;s largest
          enterprise customers. My work sits at the intersection of architecture
          and delivery: multi-agent systems, RAG pipelines, and the evaluation
          and observability layers that make them safe to run at scale.
        </p>
        <p className={pCls}>
          Recent work includes leading the engineering of a production
          multi-agent platform for a major US airline, re-architecting an agent
          runtime for a global dining platform to cut operating costs by 80
          percent, and advising Fortune 500 teams on AI trust, security, and
          governance. Earlier in my career I shipped enterprise programs across
          consumer electronics, telecom, and travel, from strategy through
          zero-defect delivery.
        </p>
        <p className={pCls}>
          I hold the Claude Certified Architect certification, 17 Salesforce
          certifications, and a professional certificate from MIT xPRO. Based in
          Los Angeles.
        </p>
        <div className="mt-8 grid gap-0 max-w-[720px]">
          {PRINCIPLES.map((p) => (
            <div
              key={p.num}
              className="grid grid-cols-[40px_1fr] gap-5 py-5 border-t border-line-1"
            >
              <span className="font-mono text-mono text-accent-600 tracking-mono pt-[2px]">
                {p.num}
              </span>
              <p className="text-small leading-tight text-ink-700 m-0 max-w-[58ch]">
                <strong className="text-ink-900 font-semibold block mb-[3px] text-[16px]">
                  {p.title}
                </strong>
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
