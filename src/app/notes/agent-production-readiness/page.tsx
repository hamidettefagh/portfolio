import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Scorecard } from "./Scorecard";

export const metadata: Metadata = {
  title: "Agent production readiness | Hamid Ettefagh",
  description:
    "A checklist for telling a demo agent from a production one. Score your own system across evaluation, cost, observability, guardrails, oversight, reliability, and governance.",
};

export default function AgentReadiness() {
  return (
    <div>
      <SiteNav links={[{ href: "/", label: "Home" }]} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <Eyebrow dot="accent">{["Notes", "Production readiness"]}</Eyebrow>
        <h1 className="font-display font-bold text-[clamp(40px,5.4vw,68px)] tracking-display leading-[1.02] mt-6 mb-6 text-balance">
          Agent production readiness
        </h1>
        <p className="text-lead leading-[1.5] text-ink-700 max-w-[52ch] m-0">
          A demo that works in a keynote is not an agent that works at 2am. This
          is the checklist I use to tell the difference. Score your own system
          against it. The gaps are the work.
        </p>
        <Scorecard />
      </article>
    </div>
  );
}
