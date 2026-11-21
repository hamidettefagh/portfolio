import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Rule } from "@/components/primitives/Rule";
import { PageIntro, INNER_LINKS } from "@/components/site/PageIntro";
import { SOURCES, TECHNIQUES } from "@/lib/voice-latency";
import { LatencyBudget } from "./LatencyBudget";

const description =
  "Where the milliseconds go in one turn of a voice agent: listening, deciding the caller is done, transcribing, thinking, and speaking. An interactive budget built from published ranges.";

export const metadata: Metadata = {
  title: "A voice agent's latency budget | Hamid Ettefagh",
  description,
  alternates: { canonical: "/lab/voice-latency" },
};

export default function VoiceLatency() {
  return (
    <div>
      <SiteNav links={INNER_LINKS} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <PageIntro
          eyebrow={["Lab", "Voice"]}
          title={"A voice agent’s latency budget"}
          lead="People leave each other about 200 milliseconds between turns. A voice agent has to hear the caller, decide they are done, understand them, think, and start speaking inside a budget built for humans, and every stage spends some of it. Pick a setup and move the stages to see where the time goes."
        >
          The ranges come from published research and engineering write-ups,
          numbered below. The presets and the four bands are my picks inside
          those ranges, not measurements of any product. The one live number on
          this page is your own network round trip.
        </PageIntro>

        <div className="mt-11">
          <Rule label="One turn" source="browser" />
          <div className="mt-6">
            <LatencyBudget />
          </div>
        </div>

        <div className="mt-12">
          <Rule label="Where the time comes back" />
          <ul className="list-none p-0 m-0 mt-2">
            {TECHNIQUES.map((t) => (
              <li key={t.title} className="py-4 border-b border-line-1 text-body leading-body text-ink-700 max-w-(--measure-body)">
                <span className="text-ink-900 font-medium">{t.title}.</span> {t.body}{" "}
                <span className="font-mono text-[12px] text-ink-500">[{t.sources.join(", ")}]</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12">
          <Rule label="What the thresholds rest on" />
          <p className="text-body leading-body text-ink-700 max-w-(--measure-body) mt-5 mb-0">
            Across ten languages, the typical gap between turns sits near 200
            ms, and most transitions take under half a second [1, 2]. Longer
            gaps make listeners rate a conversation as less connected [3].
            Voice agent guidance puts the point where callers notice lag near
            800 ms, and the outer target near 1,400 to 1,500 ms [6, 7, 8, 16].
            For the network alone, the phone standard calls under 150 ms one
            way essentially transparent [4].
          </p>
        </div>

        <div className="mt-12">
          <Rule label="Sources" />
          <ol className="list-none p-0 m-0 mt-4 grid gap-[10px]">
            {SOURCES.map((s) => (
              <li key={s.n} className="grid grid-cols-[32px_minmax(0,1fr)] gap-2 text-small leading-tight">
                <span className="font-mono text-ink-500">{s.n}</span>
                <span className="text-ink-700">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-900 underline decoration-line-2 underline-offset-[3px] hover:text-accent-700 hover:decoration-current"
                  >
                    {s.title}
                    <span aria-hidden="true"> &#8599;</span>
                  </a>
                  . {s.by}, {s.year}.
                </span>
              </li>
            ))}
          </ol>
        </div>
      </article>
    </div>
  );
}
