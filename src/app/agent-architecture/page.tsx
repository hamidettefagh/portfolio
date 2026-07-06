import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { TextLink } from "@/components/primitives/TextLink";
import { ArchitectureTool } from "./ArchitectureTool";

const description =
  "I keep seeing agents where a workflow would do. Answer seven questions about your use case and get an opinionated call on which parts actually need reasoning, and which should stay deterministic automation you can test.";

export const metadata: Metadata = {
  title: "Agent, or workflow? | Hamid Ettefagh",
  description,
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
          I keep seeing agents where a workflow would do. Teams hand a model
          steps that should be plain, deterministic automation, and make
          predictable work nondeterministic in the process. Reasoning earns its
          place in some of the work, not all of it. Answer seven questions and I
          will tell you which parts of this actually need an agent, and which
          should stay a workflow you can test.
        </p>
        <p className="mt-4 text-small text-ink-500 leading-tight">
          The executable version, a Claude skill that reads a real spec, is{" "}
          <TextLink
            href="https://github.com/hamidettefagh/agent-or-workflow"
            external
          >
            on GitHub
          </TextLink>
          . This is the design gate in{" "}
          <TextLink href="/two-gates">the two gates</TextLink>.
        </p>
        <ArchitectureTool />
      </article>
    </div>
  );
}
