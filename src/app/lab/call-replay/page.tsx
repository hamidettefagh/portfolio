import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Rule } from "@/components/primitives/Rule";
import { TextLink } from "@/components/primitives/TextLink";
import { PageIntro, INNER_LINKS } from "@/components/site/PageIntro";
import { CallReplay } from "./CallReplay";

const description =
  "A call replayed against a clock, turn by turn, with the gaps that make a voice agent feel human or not. A planned lab experiment, running a scripted call until a real one is ready.";

export const metadata: Metadata = {
  title: "Call replay | Hamid Ettefagh",
  description,
  alternates: { canonical: "/lab/call-replay" },
  robots: { index: false, follow: true },
};

export default function CallReplayPage() {
  return (
    <div>
      <SiteNav links={INNER_LINKS} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <PageIntro
          eyebrow={["Lab", "Planned"]}
          title="Call replay"
          lead="A transcript hides the thing callers feel most: time. This replays a call against a clock, so you can see every gap, every repeat, and every moment someone talks over someone else."
        >
          Planned. The player is built, and for now it runs two calls I
          scripted to show the format: the same request through a phone menu
          and through a voice agent. Every line and every time on this page is
          written, not recorded or measured. It becomes a real experiment when
          it can replay a real, consented call with timing taken from its
          trace.
        </PageIntro>

        <div className="mt-11">
          <Rule label="Scripted example" source="illustrative" />
          <div className="mt-6">
            <CallReplay />
          </div>
        </div>

        <div className="mt-12">
          <Rule label="What a real replay needs" />
          <ul className="list-none p-0 m-0 mt-2 max-w-(--measure-body)">
            {[
              "A real call, recorded with the caller's consent, with names, numbers, and anything identifying taken out.",
              "Timing from the agent's own trace, so every gap on the clock is measured, not written.",
              "Audio, played in sync with the transcript, or synthesized from it with the voice clearly labeled as synthetic.",
            ].map((x) => (
              <li key={x} className="py-4 border-b border-line-1 text-body leading-body text-ink-700">
                {x}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-small text-ink-500 leading-tight max-w-[62ch]">
            The timing in the scripted call follows the{" "}
            <TextLink href="/lab/voice-latency">latency budget</TextLink> for a
            phone line, with an acknowledgment before the tool call and a
            pre-rendered goodbye.
          </p>
        </div>
      </article>
    </div>
  );
}
