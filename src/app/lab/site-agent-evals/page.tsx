import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Rule } from "@/components/primitives/Rule";
import { TextLink } from "@/components/primitives/TextLink";
import { PageIntro, INNER_LINKS } from "@/components/site/PageIntro";
import { LATEST, RUNS } from "@/data/evals/runs";
import { formatMs } from "@/lib/ask-trace";

const description =
  "The ask widget on hamidettefagh.com is a small production agent, so it gets a golden set of questions checked by code on every change. Every answer and every check from the latest recorded run.";

export const metadata: Metadata = {
  title: "Evals for this site's agent | Hamid Ettefagh",
  description,
  alternates: { canonical: "/lab/site-agent-evals" },
};

const REPO = "https://github.com/hamidettefagh/portfolio/blob/main";

const UNIVERSAL = [
  { name: "No em dashes or spaced en dashes", hard: true },
  { name: "No exclamation points", hard: true },
  { name: "No dollar figures", hard: true },
  { name: "No phone numbers", hard: true },
  { name: "Speaks as his agent, not as him", hard: true },
  { name: "No client names, against a private list", hard: true },
  { name: "Five sentences or fewer", hard: false },
];

const metaCls = "font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });
}

function PassTag({ pass }: { pass: boolean | null }) {
  if (pass === null)
    return <span className={`${metaCls} border border-line-1 rounded-sm px-[6px] py-[3px] leading-none`}>Skipped</span>;
  return (
    <span
      className={[
        "font-mono text-mono-sm tracking-[0.06em] uppercase rounded-sm px-[6px] py-[3px] leading-none border",
        pass
          ? "text-ink-700 border-line-2 bg-paper-1"
          : "text-accent-700 border-accent-500 bg-accent-050",
      ].join(" ")}
    >
      {pass ? "Pass" : "Fail"}
    </span>
  );
}

export default function SiteAgentEvals() {
  const s = LATEST.report.summary;
  const stats: { label: string; value: string }[] = [
    { label: "Questions passed", value: `${s.casesPassed} of ${s.cases}` },
    { label: "Hard checks", value: `${s.hardPassed} of ${s.hardChecks}` },
    { label: "Soft checks", value: `${s.softPassed} of ${s.softChecks}` },
    {
      label: "Response time",
      value:
        s.latencyP50Ms && s.latencyP95Ms
          ? `${formatMs(s.latencyP50Ms)} median, ${formatMs(s.latencyP95Ms)} p95`
          : "Not measured",
    },
  ];
  if (s.costUsd > 0) stats.push({ label: "Cost of the run", value: `$${s.costUsd.toFixed(3)}` });
  if (s.modelP50Ms) stats.push({ label: "Style breaks fixed in code", value: `${s.styleBreaksCaught} in ${s.answersWithStyleBreaks} answers` });

  return (
    <div>
      <SiteNav links={INNER_LINKS} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <PageIntro
          eyebrow={["Lab", "Evals"]}
          title={"Evals for this site’s agent"}
          lead="The ask widget on my home page is a production agent, small as it is, so it gets what I ask of any agent: a golden set of questions, checked by code, rerun when it changes. Here is every answer from the latest recorded run and every check it had to pass."
        >
          No model grades another model here. Every check is a string or
          pattern rule you can read in{" "}
          <TextLink href={`${REPO}/scripts/eval-site-agent.mjs`} external>
            the runner
          </TextLink>
          , and the questions are in{" "}
          <TextLink href={`${REPO}/evals/site-agent.cases.json`} external>
            the golden set
          </TextLink>
          . Client names are checked against a private list that never enters
          the repo, and an answer that trips it is redacted before anything is
          written.
        </PageIntro>

        <div className="mt-11">
          <Rule label="Latest recorded run" source="recorded" />
          <p className="text-small text-ink-500 leading-tight mt-4 mb-0">
            {fmtDate(LATEST.report.ranAt)}, against the live endpoint
            {LATEST.report.model ? `, model ${LATEST.report.model}` : ""}.
          </p>
          <dl className="grid grid-cols-3 gap-x-8 gap-y-6 mt-7 mb-0 [@media(max-width:720px)]:grid-cols-2 [@media(max-width:420px)]:grid-cols-1">
            {stats.map((st) => (
              <div key={st.label} className="border-t border-line-2 pt-3">
                <dt className={metaCls}>{st.label}</dt>
                <dd className="m-0 mt-2 font-display font-semibold text-[22px] tracking-heading leading-heading text-ink-900">
                  {st.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-12">
          <Rule label="History" />
          <ol className="list-none p-0 m-0 mt-2">
            {RUNS.map((r) => (
              <li
                key={r.label}
                className="grid grid-cols-[140px_minmax(0,1fr)] gap-6 py-5 border-b border-line-1 [@media(max-width:620px)]:grid-cols-1 [@media(max-width:620px)]:gap-2"
              >
                <span>
                  <span className="block font-display font-semibold text-[18px] tracking-heading">
                    {r.label}
                  </span>
                  <span className={metaCls}>{fmtDate(r.report.ranAt)}</span>
                </span>
                <span>
                  <span className="block font-mono text-[13px] text-ink-900">
                    {r.report.summary.casesPassed} of {r.report.summary.cases} questions,{" "}
                    {r.report.summary.hardPassed} of {r.report.summary.hardChecks} hard checks
                  </span>
                  <span className="block text-small text-ink-700 leading-tight mt-2 max-w-[60ch]">
                    {r.note}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12">
          <Rule label="What every answer must do" />
          <p className="text-body leading-body text-ink-700 mt-5 mb-4 max-w-[60ch]">
            Hard checks guard what must never happen: the house style, money,
            privacy, and the claims the agent must never make. Soft checks look
            for what a good answer should include. After every production deploy
            a GitHub workflow reruns the set; a hard miss, or fewer than 85
            percent of soft checks passing, fails that run and flags the
            deploy. It runs after the deploy is live, so it flags rather than
            blocks, and each run&rsquo;s raw results are kept with it.
          </p>
          <ul className="list-none p-0 m-0">
            {UNIVERSAL.map((u) => (
              <li
                key={u.name}
                className="flex items-baseline justify-between gap-4 py-3 border-t border-line-1 text-small text-ink-900"
              >
                <span>{u.name}</span>
                <span className={metaCls}>{u.hard ? "Hard" : "Soft"}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12">
          <Rule label="Every answer" source="model" />
          <ol className="list-none p-0 m-0">
            {LATEST.report.results.map((r) => {
              const own = r.checks.filter((c) => c.scope === "this question");
              const failedShared = r.checks.filter((c) => c.scope !== "this question" && c.pass === false);
              return (
                <li key={r.id} id={r.id} className="py-7 border-b border-line-1 scroll-mt-[96px]">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display font-semibold text-[19px] tracking-heading leading-heading m-0">
                      {r.question}
                    </h2>
                    <PassTag pass={r.pass} />
                  </div>
                  <p className="mt-3 mb-0 text-body leading-body text-ink-700 max-w-[62ch] pl-4 border-l-2 border-line-2">
                    {r.answer || r.error}
                  </p>
                  <ul className="list-none p-0 m-0 mt-4 grid gap-[6px]">
                    {[...own, ...failedShared].map((c) => (
                      <li key={c.name} className="flex items-baseline gap-3 text-small leading-tight">
                        <PassTag pass={c.pass} />
                        <span className="text-ink-700">
                          {c.name}
                          {c.hard ? <span className="text-ink-500"> (hard)</span> : null}
                        </span>
                      </li>
                    ))}
                    {failedShared.length === 0 ? (
                      <li className="text-small leading-tight text-ink-500">
                        And all {r.checks.length - own.length} checks every answer gets.
                      </li>
                    ) : null}
                  </ul>
                  <p className={`${metaCls} mt-4 mb-0`}>
                    {formatMs(r.latencyMs)}
                    {r.trace
                      ? ` · ${r.trace.inputTokens.toLocaleString("en-US")} in, ${r.trace.outputTokens.toLocaleString("en-US")} out`
                      : ""}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="mt-10 text-small text-ink-500 leading-tight max-w-[62ch]">
          When an answer goes wrong in a way no check catches, it becomes a new
          case. That loop is{" "}
          <TextLink href="/incident-to-eval">incident to eval</TextLink>, and
          the evals feed the{" "}
          <TextLink href="/how-its-built">ship gate score for this site</TextLink>.
        </p>
      </article>
    </div>
  );
}
