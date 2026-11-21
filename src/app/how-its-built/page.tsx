import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { Rule } from "@/components/primitives/Rule";
import { TextLink } from "@/components/primitives/TextLink";
import { MiniFlow } from "@/components/patterns/MiniFlow";
import { RadarChart } from "@/components/patterns/RadarChart";
import { PageIntro, INNER_LINKS } from "@/components/site/PageIntro";
import { SourceTag, type SourceKind } from "@/components/receipts/Receipts";
import { PAGE_GATE, PAGE_SIGNALS } from "@/lib/page-gate";
import { SHIP_GATE } from "@/lib/ship-gate";
import { SITE_CHECKS, siteShipGate } from "@/lib/site-ship-gate";
import { BASELINE } from "@/lib/bake-off";

const description =
  "This site, run through my own two gates: the design gate decided its shape, and the ship gate scores the one part of it that is an agent, gaps included.";

export const metadata: Metadata = {
  title: "How this site is built | Hamid Ettefagh",
  description,
  alternates: { canonical: "/how-its-built" },
};

const PARTS: { part: string; kind: SourceKind; how: string }[] = [
  { part: "Most of the words", kind: "static", how: "Written by me, served as is." },
  { part: "The verdict in the hero", kind: "computed", how: "The design gate's engine, run when the site is built." },
  { part: "The tools and the lab explorers", kind: "browser", how: "The same engines, running on your device. Nothing you type leaves it; the two gates count the verdict or score they reach, nothing more." },
  { part: "The ask widget", kind: "model", how: "One model call per question. The only model call on the site." },
  { part: "The eval results", kind: "recorded", how: "A script asks the live agent the golden set; the page shows its raw output." },
  { part: "The MCP server", kind: "server", how: "Deterministic code on the server, run when an agent calls it. No model behind it." },
];

const metaCls = "font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500";
const pCls = "text-body leading-body text-ink-700 max-w-(--measure-body) mt-5 mb-0";

export default function HowItsBuilt() {
  const site = siteShipGate();
  return (
    <div>
      <SiteNav links={INNER_LINKS} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <PageIntro
          eyebrow={["Lab", "Colophon"]}
          title="How this site is built"
          lead="I hold this site to the two gates I use on client work. The design gate decided its shape before I built it. The ship gate scores the one part of it that is an agent. Both results are here, gaps included."
        />

        <section className="mt-11">
          <Rule label="The design gate, run on this site" source="computed" />
          <dl className="mt-5 mb-0 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-8 [@media(max-width:560px)]:grid-cols-1">
            {PAGE_SIGNALS.map((s) => (
              <div key={s.id} className="flex items-baseline justify-between gap-4 py-3 border-b border-line-1">
                <dt className={metaCls}>{s.signal}</dt>
                <dd className="m-0 text-small text-ink-900 text-right">{s.read}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 mb-0 font-display font-semibold text-[22px] tracking-heading leading-heading">
            {PAGE_GATE.verdict}
          </p>
          <div className="mt-4 text-[14px] overflow-x-auto pb-1">
            <MiniFlow stages={PAGE_GATE.stages} />
          </div>
          <p className={pCls}>
            The page is static, and the one judgment point is the ask widget.
            Everything else that looks clever is ordinary code. The first-visit
            intro on the home page plays this run;{" "}
            <TextLink href={PAGE_GATE.href}>open it in the tool</TextLink> to
            check the reasoning.
          </p>
        </section>

        <section className="mt-12">
          <Rule label="The ship gate, run on its agent" source="computed" />
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 items-center mt-6 [@media(max-width:760px)]:grid-cols-1">
            <div className="mx-auto w-full max-w-[400px]">
              <RadarChart values={site.perDimension} />
            </div>
            <div>
              <p className="m-0 font-display font-bold text-[clamp(36px,5vw,52px)] tracking-display leading-none tabular-nums">
                {site.score}
                <span className="text-ink-500"> / {site.total}</span>
              </p>
              <p className="mt-3 mb-0 font-display font-semibold text-[20px] tracking-heading">{site.band}</p>
              <p className="text-small text-ink-700 leading-tight mt-3 mb-0 max-w-[40ch]">
                Scored on the same 28 checks as the{" "}
                <TextLink href="/agent-production-readiness">ship gate</TextLink>. {site.deliberateGaps} of
                the gaps are deliberate: the site does not store conversations,
                so it cannot review or replay them.
              </p>
            </div>
          </div>

          {SHIP_GATE.map((d) => (
            <div key={d.key} className="mt-8">
              <div className="flex items-center gap-4">
                <span className="font-mono text-mono tracking-mono uppercase text-accent-600 flex-none">{d.label}</span>
                <span className="flex-1 h-0 border-t border-line-1"></span>
                <span className="font-mono text-mono-sm text-ink-500 flex-none">
                  {SITE_CHECKS[d.key].filter((c) => c.met).length}/{d.items.length}
                </span>
              </div>
              <ul className="list-none p-0 m-0">
                {d.items.map((item, i) => {
                  const c = SITE_CHECKS[d.key][i];
                  return (
                    <li key={item} className="grid grid-cols-[18px_minmax(0,1fr)] gap-4 py-4 border-b border-line-1">
                      <span
                        className={[
                          "w-[16px] h-[16px] rounded-sm border mt-[3px]",
                          c.met ? "bg-accent-600 border-accent-600" : "bg-paper-0 border-line-2",
                        ].join(" ")}
                        aria-hidden="true"
                      ></span>
                      <span>
                        <span className="sr-only">{c.met ? "Met: " : "Not met: "}</span>
                        <span className="block text-body leading-tight text-ink-900">{item}</span>
                        <span className="block text-small leading-tight text-ink-500 mt-[6px]">
                          {c.byDesign ? "Met by design. " : ""}
                          {c.deliberate ? "A deliberate gap. " : ""}
                          {c.how}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <Rule label="What makes each part" />
          <ul className="list-none p-0 m-0 mt-2">
            {PARTS.map((p) => (
              <li
                key={p.part}
                className="grid grid-cols-[220px_minmax(0,1fr)] gap-6 py-4 border-b border-line-1 [@media(max-width:640px)]:grid-cols-1 [@media(max-width:640px)]:gap-2"
              >
                <span className="text-small text-ink-900 font-medium">{p.part}</span>
                <span className="text-small text-ink-700 leading-tight">
                  <span className="receipts-always">
                    <SourceTag kind={p.kind} />
                  </span>{" "}
                  {p.how}
                </span>
              </li>
            ))}
          </ul>
          <p className={pCls}>
            Turn on <span className="font-mono text-[14px]">Receipts</span> in
            the top bar to see these labels on every page, and an evidence class
            on each figure from the work: production, testing, projection,
            count, computed, or illustrative.
          </p>
        </section>

        <section className="mt-12">
          <Rule label="Your data" />
          <p className={pCls}>
            The site does not store your questions or the agent&rsquo;s
            answers: its code writes neither to a log or a database. A question
            goes to Anthropic&rsquo;s API to write the answer, under that
            API&rsquo;s terms, and comes back to you with its trace. The tools
            and explorers run in your browser, and nothing you type in them
            leaves it; the two gates report only the verdict or score they
            reached, as an anonymous count. Page views and page speed are
            measured by Vercel Web Analytics and Speed Insights, which use no
            cookies.
          </p>
        </section>

        <section className="mt-12">
          <Rule label="Built with" />
          <p className={pCls}>
            Next.js and React, styled with Tailwind, hosted on Vercel. No UI
            kit and no animation library: every motion on the site is CSS or the
            browser&rsquo;s own animation API. The only other runtime
            dependencies are the Anthropic SDK for the ask widget, the MCP SDK
            and its schema library for the server, and Vercel&rsquo;s
            analytics. Type is Archivo, Newsreader, and Geist Mono.
          </p>
          <p className={pCls}>
            I build it with Claude Code. Commits it helped write carry its name
            in the git history. Before a release I run a production build and
            Lighthouse on phone and desktop settings. The latest, {BASELINE.measured},
            two runs on the phone setting and one on desktop: phone{" "}
            {BASELINE.mobile.performance} performance, {BASELINE.mobile.accessibility}{" "}
            accessibility, layout shift {BASELINE.mobile.cls}; desktop{" "}
            {BASELINE.desktop.performance}, {BASELINE.desktop.accessibility}, and{" "}
            {BASELINE.desktop.cls}.
          </p>
        </section>

        <section className="mt-12">
          <Rule label="For agents" />
          <ul className="list-none p-0 m-0 mt-2">
            <li className="py-4 border-b border-line-1 text-body leading-body text-ink-700">
              <a className="font-mono text-[14px] text-ink-900 underline decoration-line-2 underline-offset-[3px] hover:text-accent-700" href="/llms.txt">
                /llms.txt
              </a>{" "}
              is a plain-text map of the site for language models.
            </li>
            <li className="py-4 border-b border-line-1 text-body leading-body text-ink-700">
              <Link className="font-mono text-[14px] text-ink-900 underline decoration-line-2 underline-offset-[3px] hover:text-accent-700" href="/lab/mcp">
                /api/mcp
              </Link>{" "}
              serves the two gates as MCP tools, in both protocol eras.
            </li>
            <li className="py-4 border-b border-line-1 text-body leading-body text-ink-700">
              The source is public on{" "}
              <TextLink href="https://github.com/hamidettefagh/portfolio" external>
                GitHub
              </TextLink>
              , including the agent&rsquo;s fact sheet, its golden set, and the
              scripts behind the evals and the parity checks.
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
