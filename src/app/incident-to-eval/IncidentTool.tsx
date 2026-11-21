"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import {
  ASSERTION_HELP,
  ASSERTION_TYPES,
  CATEGORIES,
  RUN_ON,
  SEVERITIES,
  TAXONOMY,
  WORKED_EXAMPLE,
  kebab,
  toMarkdown,
  validateCase,
  type Category,
  type EvalCase,
} from "@/lib/eval-case";

type Assertion = { type: string; value: string };

type Draft = {
  title: string;
  id: string;
  idTouched: boolean;
  summary: string;
  severity: string;
  date: string;
  surface: string;
  category: string;
  mode: string;
  observed: string;
  expected: string;
  input: string;
  fixtures: string;
  behavior: string;
  assertions: Assertion[];
  runOn: string;
  suite: string;
  owner: string;
};

const BLANK: Draft = {
  title: "",
  id: "",
  idTouched: false,
  summary: "",
  severity: "",
  date: "",
  surface: "",
  category: "",
  mode: "",
  observed: "",
  expected: "",
  input: "",
  fixtures: "",
  behavior: "",
  assertions: [{ type: "must-contain", value: "" }],
  runOn: "",
  suite: "",
  owner: "",
};

function fromCase(c: EvalCase): Draft {
  const fixtures = c.case.context?.fixtures;
  return {
    title: c.title,
    id: c.id,
    idTouched: true,
    summary: c.sourceIncident.summary,
    severity: c.sourceIncident.severity,
    date: c.sourceIncident.date ?? "",
    surface: c.sourceIncident.surface ?? "",
    category: c.failure.category,
    mode: c.failure.mode,
    observed: c.failure.observed,
    expected: c.failure.expected,
    input: c.case.input,
    fixtures: typeof fixtures === "string" ? fixtures : "",
    behavior: c.case.expected.behavior,
    assertions: c.case.expected.assertions.map((a) => ({ ...a })),
    runOn: c.guard.runOn,
    suite: c.guard.suite ?? "",
    owner: c.guard.owner ?? "",
  };
}

// Field order follows the format's own order, so the JSON reads like the docs.
function toCase(d: Draft): EvalCase {
  return {
    id: d.id.trim(),
    title: d.title.trim(),
    sourceIncident: {
      ...(d.date ? { date: d.date } : {}),
      summary: d.summary.trim(),
      severity: d.severity,
      ...(d.surface.trim() ? { surface: d.surface.trim() } : {}),
    },
    failure: {
      category: d.category,
      mode: d.mode.trim(),
      observed: d.observed.trim(),
      expected: d.expected.trim(),
    },
    case: {
      input: d.input.trim(),
      ...(d.fixtures.trim() ? { context: { fixtures: d.fixtures.trim() } } : {}),
      expected: {
        behavior: d.behavior.trim(),
        assertions: d.assertions.map((a) => ({ type: a.type, value: a.value.trim() })),
      },
    },
    guard: {
      runOn: d.runOn,
      ...(d.suite.trim() ? { suite: d.suite.trim() } : {}),
      ...(d.owner.trim() ? { owner: d.owner.trim() } : {}),
    },
  };
}

const labelCls =
  "block font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500 mb-2";
const fieldCls =
  "w-full border border-line-2 rounded-sm bg-paper-0 font-body text-[16px] text-ink-900 px-4 py-[11px] outline-none tracking-body transition-[border-color] duration-(--dur-fast) ease-out focus:border-ink-900 placeholder:text-ink-300";
const areaCls = `${fieldCls} leading-tight resize-y min-h-[92px]`;
const chipCls = (on: boolean) =>
  [
    "choice-chip text-[14px] leading-none rounded-pill border px-[13px] py-[8px] cursor-pointer",
    on
      ? "border-accent-500 text-accent-700 bg-accent-050"
      : "border-line-2 text-ink-700 bg-transparent hover:border-ink-500 hover:text-ink-900",
  ].join(" ");
const smallBtnCls =
  "font-mono text-mono-sm tracking-[0.05em] text-ink-500 bg-transparent cursor-pointer border border-line-1 rounded-sm px-[11px] py-[6px] transition-[border-color,color] duration-(--dur-fast) ease-out hover:border-line-2 hover:text-ink-900";

function Step({
  n,
  title,
  hint,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0 m-0 mt-11 first:mt-0 min-w-0">
      <legend className="p-0 w-full">
        <span className="flex items-center gap-4">
          <span className="font-mono text-mono tracking-mono uppercase text-accent-600 flex-none">
            Step {n}
          </span>
          <span className="flex-1 h-0 border-t border-line-1"></span>
        </span>
        <span className="block font-display font-semibold text-[22px] tracking-heading leading-heading mt-4">
          {title}
        </span>
      </legend>
      {hint ? (
        <p className="text-small text-ink-500 leading-tight mt-2 mb-0 max-w-[60ch]">{hint}</p>
      ) : null}
      <div className="mt-5 grid gap-5">{children}</div>
    </fieldset>
  );
}

export function IncidentTool() {
  const [d, setD] = useState<Draft>(BLANK);
  const [tab, setTab] = useState<"json" | "md">("json");
  const [copied, setCopied] = useState<string | null>(null);
  const trackedValid = useRef(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setD((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !prev.idTouched) next.id = kebab(String(value));
      return next;
    });

  const evalCase = useMemo(() => toCase(d), [d]);
  const errors = useMemo(() => validateCase(evalCase), [evalCase]);
  const valid = errors.length === 0;
  const json = useMemo(() => JSON.stringify(evalCase, null, 2), [evalCase]);
  const md = useMemo(() => (valid ? toMarkdown(evalCase) : ""), [valid, evalCase]);

  useEffect(() => {
    if (valid && !trackedValid.current && d !== BLANK) {
      trackedValid.current = true;
      track("incident to eval valid");
    }
  }, [valid, d]);

  const tax = (CATEGORIES as readonly string[]).includes(d.category)
    ? TAXONOMY[d.category as Category]
    : null;

  const pickCategory = (c: Category) =>
    setD((prev) => {
      const t = TAXONOMY[c];
      const keepMode = t.modes.some((m) => m.id === prev.mode);
      return {
        ...prev,
        category: c,
        mode: keepMode ? prev.mode : "",
        runOn: prev.runOn || t.guard || "",
      };
    });

  // Keep every assertion that has a value, drop empty placeholders, then add
  // one empty row for each type this category owes that is not filled yet.
  const addOwed = () =>
    setD((prev) => {
      if (!tax) return prev;
      const filled = prev.assertions.filter((a) => a.value.trim());
      const types = new Set(filled.map((a) => a.type));
      const added = tax.owes.filter((t) => !types.has(t)).map((t) => ({ type: t, value: "" }));
      const next = [...filled, ...added];
      return { ...prev, assertions: next.length ? next : prev.assertions };
    });

  const setAssertion = (i: number, patch: Partial<Assertion>) =>
    setD((prev) => ({
      ...prev,
      assertions: prev.assertions.map((a, j) => (j === i ? { ...a, ...patch } : a)),
    }));

  const copy = (text: string, what: string) => {
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setCopied(what);
        setTimeout(() => setCopied(null), 1600);
      })
      .catch(() => {});
  };

  const download = () => {
    const blob = new Blob([json + "\n"], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${evalCase.id || "eval-case"}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-11 grid grid-cols-[minmax(0,1fr)_minmax(0,420px)] gap-12 items-start [@media(max-width:960px)]:grid-cols-1 [@media(max-width:960px)]:gap-10">
      <form className="min-w-0" onSubmit={(e) => e.preventDefault()} aria-label="Eval case">
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <button type="button" className={smallBtnCls} onClick={() => setD(fromCase(WORKED_EXAMPLE))}>
            Load the worked example
          </button>
          <button type="button" className={smallBtnCls} onClick={() => setD(BLANK)}>
            Start blank
          </button>
          <span className="text-small text-ink-500 leading-tight">
            The example is the incident behind the two gates.
          </span>
        </div>

        <Step
          n={1}
          title="Reconstruct the incident"
          hint="What happened, from the trace or the postmortem. Where the record is silent, say so rather than inventing a cleaner story."
        >
          <div>
            <label className={labelCls} htmlFor="ie-summary">What happened</label>
            <textarea
              id="ie-summary"
              className={areaCls}
              placeholder="Within a day of launch, the agent told customers..."
              value={d.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </div>
          <div>
            <span className={labelCls} id="ie-sev">Severity</span>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="ie-sev">
              {SEVERITIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={d.severity === s}
                  className={chipCls(d.severity === s)}
                  onClick={() => set("severity", s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 [@media(max-width:560px)]:grid-cols-1">
            <div>
              <label className={labelCls} htmlFor="ie-date">Date (optional)</label>
              <input
                id="ie-date"
                type="date"
                className={fieldCls}
                value={d.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="ie-surface">Where (optional)</label>
              <input
                id="ie-surface"
                className={fieldCls}
                placeholder="support agent, production"
                value={d.surface}
                onChange={(e) => set("surface", e.target.value)}
              />
            </div>
          </div>
        </Step>

        <Step
          n={2}
          title="Classify the failure"
          hint="Pick the first failure in the chain. The usual miss is calling it a model problem when the trace shows grounding, retrieval, or context."
        >
          <div>
            <span className={labelCls} id="ie-cat">Category</span>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="ie-cat">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={d.category === c}
                  className={chipCls(d.category === c)}
                  onClick={() => pickCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <p className="text-small text-ink-700 leading-tight mt-3 mb-0 min-h-[1.35em]">
              {tax ? tax.line : "Nine categories, from the skill's failure taxonomy."}
            </p>
          </div>
          {tax ? (
            <div>
              <span className={labelCls} id="ie-mode">Mode</span>
              <div className="grid gap-2" role="group" aria-labelledby="ie-mode">
                {tax.modes.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={d.mode === m.id}
                    onClick={() => set("mode", m.id)}
                    className={[
                      "choice-chip text-left rounded-sm border px-4 py-3 cursor-pointer flex flex-wrap items-baseline gap-x-3 gap-y-1",
                      d.mode === m.id
                        ? "border-accent-500 bg-accent-050"
                        : "border-line-1 bg-transparent hover:border-line-2",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "font-mono text-[13px] tracking-[0.02em]",
                        d.mode === m.id ? "text-accent-700" : "text-ink-900",
                      ].join(" ")}
                    >
                      {m.id}
                    </span>
                    <span className="text-small text-ink-500 leading-tight">{m.line}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <div>
            <label className={labelCls} htmlFor="ie-observed">What the agent did</label>
            <textarea
              id="ie-observed"
              className={areaCls}
              value={d.observed}
              onChange={(e) => set("observed", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="ie-expected">What it should have done</label>
            <textarea
              id="ie-expected"
              className={areaCls}
              value={d.expected}
              onChange={(e) => set("expected", e.target.value)}
            />
          </div>
        </Step>

        <Step
          n={3}
          title="Write the smallest reproduction"
          hint="The least input that still triggers the failure. A case that needs the whole production environment will never run, and a case that never runs guards nothing."
        >
          <div>
            <label className={labelCls} htmlFor="ie-input">Input</label>
            <textarea
              id="ie-input"
              className={areaCls}
              value={d.input}
              onChange={(e) => set("input", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="ie-fixtures">Fixtures (optional)</label>
            <textarea
              id="ie-fixtures"
              className={areaCls}
              placeholder="The documents, records, or tool responses the case depends on."
              value={d.fixtures}
              onChange={(e) => set("fixtures", e.target.value)}
            />
          </div>
        </Step>

        <Step
          n={4}
          title="Say what must be true"
          hint="Assert at the level the failure lives: sources and facts for grounding, calls for tool use, end states for reasoning."
        >
          <div>
            <label className={labelCls} htmlFor="ie-behavior">Expected behavior</label>
            <textarea
              id="ie-behavior"
              className={areaCls}
              value={d.behavior}
              onChange={(e) => set("behavior", e.target.value)}
            />
          </div>
          <div>
            <span className={labelCls}>Assertions</span>
            {tax ? (
              <p className="text-small text-ink-700 leading-tight mt-0 mb-3">
                A {d.category} failure owes you{" "}
                {tax.owes.map((t, i) => (
                  <span key={t}>
                    {i > 0 ? (i === tax.owes.length - 1 ? " and " : ", ") : ""}
                    <code className="font-mono text-[13px]">{t}</code>
                  </span>
                ))}
                .{" "}
                <button
                  type="button"
                  className="text-small text-ink-900 underline decoration-line-2 underline-offset-[3px] bg-transparent p-0 cursor-pointer hover:text-accent-700 hover:decoration-current"
                  onClick={addOwed}
                >
                  Add them
                </button>
              </p>
            ) : null}
            <div className="grid gap-3">
              {d.assertions.map((a, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[200px_minmax(0,1fr)_auto] gap-2 items-start [@media(max-width:560px)]:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <select
                    aria-label={`Assertion ${i + 1} type`}
                    className={`${fieldCls} font-mono text-[14px] [@media(max-width:560px)]:col-span-2`}
                    value={a.type}
                    onChange={(e) => setAssertion(i, { type: e.target.value })}
                  >
                    {ASSERTION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <input
                    aria-label={`Assertion ${i + 1} value`}
                    className={fieldCls}
                    placeholder={ASSERTION_HELP[a.type as keyof typeof ASSERTION_HELP] ?? ""}
                    value={a.value}
                    onChange={(e) => setAssertion(i, { value: e.target.value })}
                  />
                  <button
                    type="button"
                    className={`${smallBtnCls} self-stretch`}
                    aria-label={`Remove assertion ${i + 1}`}
                    disabled={d.assertions.length === 1}
                    onClick={() =>
                      setD((prev) => ({
                        ...prev,
                        assertions: prev.assertions.filter((_, j) => j !== i),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className={`${smallBtnCls} mt-3`}
              onClick={() =>
                setD((prev) => ({
                  ...prev,
                  assertions: [...prev.assertions, { type: "must-contain", value: "" }],
                }))
              }
            >
              Add an assertion
            </button>
          </div>
        </Step>

        <Step
          n={5}
          title="Wire the guard"
          hint="A case that does not run is a document, not a guard. Grounding and guardrail cases run on every change."
        >
          <div>
            <span className={labelCls} id="ie-runon">Runs</span>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="ie-runon">
              {RUN_ON.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={d.runOn === r}
                  className={chipCls(d.runOn === r)}
                  onClick={() => set("runOn", r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 [@media(max-width:560px)]:grid-cols-1">
            <div>
              <label className={labelCls} htmlFor="ie-suite">Suite (optional)</label>
              <input
                id="ie-suite"
                className={fieldCls}
                placeholder="grounding-regressions"
                value={d.suite}
                onChange={(e) => set("suite", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="ie-owner">Owner (optional)</label>
              <input
                id="ie-owner"
                className={fieldCls}
                placeholder="the team that owns the agent"
                value={d.owner}
                onChange={(e) => set("owner", e.target.value)}
              />
            </div>
          </div>
        </Step>

        <Step n={6} title="Name it" hint="The title is the assertion in plain words.">
          <div>
            <label className={labelCls} htmlFor="ie-title">Title</label>
            <input
              id="ie-title"
              className={fieldCls}
              placeholder="Policy follow-ups must still go through the lookup"
              value={d.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="ie-id">ID</label>
            <input
              id="ie-id"
              className={`${fieldCls} font-mono text-[15px]`}
              placeholder="policy-follow-up-grounding"
              value={d.id}
              onChange={(e) =>
                setD((prev) => ({ ...prev, id: e.target.value, idTouched: true }))
              }
            />
          </div>
        </Step>
      </form>

      <aside
        className="min-w-0 sticky top-[calc(var(--nav-height)+24px)] [@media(max-width:960px)]:static"
        aria-label="The eval case"
      >
        <div className="bg-surface-raised border border-line-1 rounded-md overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line-1">
            <span
              className={[
                "font-mono text-mono-sm tracking-[0.06em] uppercase inline-flex items-center gap-2",
                valid ? "text-ink-900" : "text-ink-500",
              ].join(" ")}
              aria-live="polite"
            >
              <span
                className={[
                  "w-[7px] h-[7px] rounded-full flex-none",
                  valid ? "bg-accent-600" : "bg-line-2",
                ].join(" ")}
                aria-hidden="true"
              ></span>
              {valid
                ? "Valid case"
                : `${errors.length} ${errors.length === 1 ? "problem" : "problems"}`}
            </span>
            <span className="flex gap-1" role="group" aria-label="Output format">
              {(["json", "md"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={tab === t}
                  onClick={() => setTab(t)}
                  className={[
                    "font-mono text-mono-sm tracking-[0.05em] uppercase px-[9px] py-[5px] rounded-sm cursor-pointer border",
                    tab === t
                      ? "border-line-2 text-ink-900 bg-paper-1"
                      : "border-transparent text-ink-500 hover:text-ink-900",
                  ].join(" ")}
                >
                  {t === "json" ? "JSON" : "Summary"}
                </button>
              ))}
            </span>
          </div>
          <pre
            tabIndex={0}
            aria-label={tab === "json" ? "Eval case JSON" : "Eval case summary"}
            className="m-0 px-5 py-4 font-mono text-[12.5px] leading-[1.6] text-ink-700 whitespace-pre-wrap break-words max-h-[52vh] overflow-y-auto [@media(max-width:960px)]:max-h-[60vh]">
            {tab === "json"
              ? json
              : md || "The summary renders once the case is valid."}
          </pre>
          <div className="flex flex-wrap items-center gap-2 px-5 py-4 border-t border-line-1">
            <button
              type="button"
              className={smallBtnCls}
              onClick={() => copy(tab === "json" ? json : md, tab)}
              disabled={tab === "md" && !valid}
            >
              {copied === tab ? "Copied" : tab === "json" ? "Copy JSON" : "Copy summary"}
            </button>
            <button type="button" className={smallBtnCls} onClick={download} disabled={!valid}>
              Download .json
            </button>
          </div>
        </div>
        {!valid ? (
          <div className="mt-5">
            <span className={labelCls}>What the validator says</span>
            <ul className="list-none p-0 m-0 grid gap-2">
              {errors.map((e) => (
                <li key={e} className="font-mono text-[12.5px] leading-[1.5] text-ink-700 pl-3 border-l-2 border-line-2">
                  {e}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-5 mb-0 text-small text-ink-500 leading-tight">
            Same verdict the skill&rsquo;s validator gives. Drop the file into
            your eval suite, or run{" "}
            the skill&rsquo;s{" "}
            <a
              href="https://github.com/hamidettefagh/incident-to-eval/blob/main/scripts/validate-eval.mjs"
              target="_blank"
              rel="noreferrer"
              className="text-ink-900 underline decoration-line-2 underline-offset-[3px] hover:text-accent-700 hover:decoration-current"
            >
              validator<span aria-hidden="true"> &#8599;</span>
            </a>{" "}
            on it yourself.
          </p>
        )}
      </aside>
    </div>
  );
}
