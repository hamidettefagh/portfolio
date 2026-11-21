import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Rule } from "@/components/primitives/Rule";
import { TextLink } from "@/components/primitives/TextLink";
import { PageIntro, INNER_LINKS } from "@/components/site/PageIntro";
import { BASELINE, RUBRIC, SPEC } from "@/lib/bake-off";

const description =
  "One spec, locked content, several models each building my home page, and the builds scored by code instead of taste. A planned lab experiment: the spec and scoring are written; the builds have not run.";

export const metadata: Metadata = {
  title: "Model bake-off | Hamid Ettefagh",
  description,
  alternates: { canonical: "/lab/bake-off" },
  robots: { index: false, follow: true },
};

const metaCls = "font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500";

export default function BakeOff() {
  const rows: { label: string; key: keyof typeof BASELINE.mobile }[] = [
    { label: "Performance", key: "performance" },
    { label: "Accessibility", key: "accessibility" },
    { label: "Best practices", key: "bestPractices" },
    { label: "SEO", key: "seo" },
    { label: "Layout shift", key: "cls" },
  ];
  return (
    <div>
      <SiteNav links={INNER_LINKS} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <PageIntro
          eyebrow={["Lab", "Planned"]}
          title="Model bake-off"
          lead="One spec, the content locked, and several models each building my home page. Then the builds are scored by code instead of by taste: whether they invented anything, how much of the spec they cover, how fast and accessible they are, and what they cost to make."
        >
          Planned. The spec and the scoring below are final, and the page I
          built by hand has its baseline. The model builds have not run yet;
          when they do, each one gets its own page and a row here.
        </PageIntro>

        <div className="mt-11">
          <Rule label="The spec" source="static" />
          <div className="mt-2">
            {SPEC.map((s, i) => (
              <details key={s.title} className="group border-b border-line-1" open={i < 2}>
                <summary className="flex items-baseline justify-between gap-4 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-display font-semibold text-[19px] tracking-heading">{s.title}</span>
                  <span className={`${metaCls} group-open:hidden`}>Show</span>
                  <span className={`${metaCls} hidden group-open:inline`}>Hide</span>
                </summary>
                <ul className="list-none p-0 m-0 pb-5 grid gap-2 max-w-(--measure-body)">
                  {s.body.map((b) => (
                    <li key={b} className="text-body leading-body text-ink-700">
                      {b}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <Rule label="How builds are scored" />
          <ul className="list-none p-0 m-0 mt-2">
            {RUBRIC.map((r) => (
              <li
                key={r.criterion}
                className="grid grid-cols-[190px_minmax(0,1fr)_56px] gap-6 py-4 border-b border-line-1 [@media(max-width:640px)]:grid-cols-[minmax(0,1fr)_56px] [@media(max-width:640px)]:gap-y-1"
              >
                <span className="font-display font-semibold text-[17px] tracking-heading">{r.criterion}</span>
                <span className="text-small text-ink-700 leading-tight [@media(max-width:640px)]:col-span-2 [@media(max-width:640px)]:row-start-2">
                  {r.how}
                  {r.gate ? <span className="block text-ink-500 mt-1">{r.gate}.</span> : null}
                </span>
                <span className="font-mono text-[14px] text-ink-900 text-right tabular-nums [@media(max-width:640px)]:row-start-1 [@media(max-width:640px)]:col-start-2">
                  {r.weight}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-small text-ink-500 leading-tight mt-4 max-w-[62ch]">
            Weights out of 100. The two hard limits fail a build outright, whatever
            its total: a fast page that invents a number is not a candidate.
          </p>
        </div>

        <div className="mt-12">
          <Rule label="Baseline: the page I built" source="computed" />
          <p className="text-small text-ink-500 leading-tight mt-4 mb-0">
            Lighthouse on production, {BASELINE.measured}.
          </p>
          <table className="w-full mt-4 border-collapse text-small">
            <thead>
              <tr>
                <th className={`${metaCls} text-left font-normal py-2 border-b border-line-2`}>Measure</th>
                <th className={`${metaCls} text-right font-normal py-2 border-b border-line-2`}>Phone</th>
                <th className={`${metaCls} text-right font-normal py-2 border-b border-line-2`}>Desktop</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td className="py-3 border-b border-line-1 text-ink-900">{r.label}</td>
                  <td className="py-3 border-b border-line-1 text-right font-mono tabular-nums">{BASELINE.mobile[r.key]}</td>
                  <td className="py-3 border-b border-line-1 text-right font-mono tabular-nums">{BASELINE.desktop[r.key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12">
          <Rule label="Builds" />
          <p className="text-body leading-body text-ink-700 max-w-(--measure-body) mt-5 mb-0">
            None yet. Each model gets the same spec and content file, one
            attempt, and one round of fixes. Its build, its score on every line
            above, and what it cost will land here, including the ones that
            lose.
          </p>
          <p className="mt-6 text-small text-ink-500 leading-tight max-w-[62ch]">
            The scoring reuses the checks this site already runs on itself:
            the ship gate&rsquo;s idea of evidence, and the{" "}
            <TextLink href="/lab/site-agent-evals">eval runner</TextLink>
            &rsquo;s rule that code, not a model, does the grading.
          </p>
        </div>
      </article>
    </div>
  );
}
