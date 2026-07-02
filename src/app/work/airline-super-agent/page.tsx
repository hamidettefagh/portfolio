import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Tag } from "@/components/primitives/Tag";
import { Rule } from "@/components/primitives/Rule";
import { Button } from "@/components/primitives/Button";

export const metadata: Metadata = {
  title: "Airline super agent program, case study",
};

// Case study detail — ui_kits/portfolio/CaseStudy.jsx
const labelCls =
  "font-mono text-mono tracking-mono uppercase text-accent-600 block mt-10 mb-4";
const pCls = "text-body leading-body text-ink-900 max-w-(--measure-body) mt-0 mb-4";
const todoCls =
  "text-small leading-tight text-ink-300 border border-dashed border-line-2 rounded-sm px-4 py-[14px] max-w-(--measure-body) font-mono";

export default function CaseStudy() {
  return (
    <div>
      <SiteNav links={[{ href: "/#work", label: "All work" }]} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <Eyebrow dot="accent">{["Case study", "Major US airline"]}</Eyebrow>
        <h1 className="font-display font-bold text-[clamp(40px,5.4vw,68px)] tracking-display leading-[1.02] mt-6 mb-7 text-balance">
          Airline super agent program
        </h1>
        <div className="flex gap-[10px] flex-wrap mb-10">
          <Tag>Lead engineer</Tag>
          <Tag>Multi-agent platform</Tag>
          <Tag variant="fill">In production</Tag>
        </div>

        <Rule />
        <span className={labelCls}>The situation</span>
        <p className={pCls}>
          A major US airline was taking a multi-agent customer operations
          platform to production, and a critical go-live was failing under
          executive visibility.
        </p>
        <div className={todoCls}>
          Add: what was breaking, scale of the rollout, team shape.
        </div>

        <span className={labelCls}>The work</span>
        <p className={pCls}>
          As lead forward deployed engineer I stabilized the platform through
          go-live, then co-authored the roadmap for the next-generation agent
          now in flight.
        </p>
        <div className={todoCls}>
          Add: architecture decisions, reliability work, handoff details.
        </div>

        <span className={labelCls}>The outcome</span>
        <p className={pCls}>
          A production system, live with customers, and a funded path forward.
        </p>
        <div className={todoCls}>
          Add: shippable metrics you are cleared to share.
        </div>

        <div className="mt-10">
          <Button href="/#work" variant="secondary">
            Back to all work
          </Button>
        </div>
      </article>
    </div>
  );
}
