import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { ArchitectureTool } from "./ArchitectureTool";

export const metadata: Metadata = {
  title: "Agent, or workflow? | Hamid Ettefagh",
  description:
    "I keep seeing agents where a workflow would do. Answer a few questions about your use case and get an opinionated call on which parts actually need reasoning, and which should stay deterministic automation you can test.",
};

export default function AgentArchitecture() {
  return (
    <div>
      <SiteNav links={[{ href: "/", label: "Home" }]} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <Eyebrow dot="accent">{["Tools", "Architecture"]}</Eyebrow>
        <h1 className="font-display font-bold text-[clamp(40px,5.4vw,68px)] tracking-display leading-[1.02] mt-6 mb-6 text-balance">
          Agent, or workflow?
        </h1>
        <p className="text-lead leading-[1.5] text-ink-700 max-w-[56ch] m-0">
          I keep seeing agents where a workflow would do. Teams hand steps that
          should be plain, deterministic automation to a model, and make things
          nondeterministic that need to stay predictable. Reasoning earns its
          place in some of the work, not all of it. Answer a few questions and I
          will tell you which parts of this actually need an agent, and which
          should stay a workflow you can test.
        </p>
        <ArchitectureTool />
      </article>
    </div>
  );
}
