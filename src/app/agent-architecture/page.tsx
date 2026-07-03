import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { ArchitectureTool } from "./ArchitectureTool";

export const metadata: Metadata = {
  title: "Agent architecture | Hamid Ettefagh",
  description:
    "Answer a few questions about your use case and get an opinionated starting architecture for an agent system: one agent or many, where the knowledge and the humans belong, which model tier, and the risks to flag.",
};

export default function AgentArchitecture() {
  return (
    <div>
      <SiteNav links={[{ href: "/", label: "Home" }]} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <Eyebrow dot="accent">{["Tools", "Architecture"]}</Eyebrow>
        <h1 className="font-display font-bold text-[clamp(40px,5.4vw,68px)] tracking-display leading-[1.02] mt-6 mb-6 text-balance">
          Agent architecture
        </h1>
        <p className="text-lead leading-[1.5] text-ink-700 max-w-[54ch] m-0">
          The shape of an agent system gets decided in the first week, usually
          by reaching for whatever is familiar. Answer a few questions about
          your use case and I will tell you how I would start it, and the two or
          three things I would worry about.
        </p>
        <ArchitectureTool />
      </article>
    </div>
  );
}
