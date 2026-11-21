import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { TextLink } from "@/components/primitives/TextLink";
import { PageIntro, INNER_LINKS } from "@/components/site/PageIntro";
import { IncidentTool } from "./IncidentTool";

const description =
  "Turn a production agent incident into a regression eval: classify the failure, write the smallest reproduction, and get a portable case checked by the same rules as the incident-to-eval Claude skill.";

export const metadata: Metadata = {
  title: "Incident to eval | Hamid Ettefagh",
  description,
  alternates: { canonical: "/incident-to-eval" },
};

export default function IncidentToEval() {
  return (
    <div>
      <SiteNav links={INNER_LINKS} />
      <article className="max-w-(--container-site) mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <PageIntro
          eyebrow={["Tools", "Incident to eval"]}
          title="Incident to eval"
          lead="An incident is an eval you already paid for. Most teams write the postmortem, fix the cause, and throw the eval away, then the same failure comes back in different clothes. This turns what broke into a case that runs on every change."
        >
          It writes the same portable format as the{" "}
          <TextLink href="https://github.com/hamidettefagh/incident-to-eval" external>
            incident-to-eval skill
          </TextLink>{" "}
          and checks it with the same rules, message for message. Nothing you
          type leaves your browser. This is the loop behind{" "}
          <TextLink href="/two-gates">the two gates</TextLink>: when a failure
          gets past both, it comes back here and becomes a test.
        </PageIntro>
        <IncidentTool />
      </article>
    </div>
  );
}
