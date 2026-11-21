"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { ArchitectureDiagram } from "@/components/patterns/ArchitectureDiagram";
import { TextLink } from "@/components/primitives/TextLink";

import {
  QUESTIONS,
  compute,
  decodeAnswers,
  encodeAnswers,
  type Answers,
  type Platform,
} from "@/lib/design-gate";

function Detail({ label, text }: { label: string; text: string }) {
  return (
    <div className="grid grid-cols-[170px_1fr] gap-5 py-4 border-t border-line-1 [@media(max-width:640px)]:grid-cols-1 [@media(max-width:640px)]:gap-1">
      <span className="font-mono text-mono tracking-mono uppercase text-accent-600 pt-[2px]">
        {label}
      </span>
      <p className="text-body leading-body text-ink-700 m-0 max-w-[56ch]">{text}</p>
    </div>
  );
}

const PLATFORM_OPTIONS: { id: Platform; label: string }[] = [
  { id: "general", label: "General" },
  { id: "agentforce", label: "Agentforce" },
];

export function ArchitectureTool() {
  const [answers, setAnswers] = useState<Answers>({});
  const [platform, setPlatform] = useState<Platform>("general");
  const [copied, setCopied] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const done = answeredCount === QUESTIONS.length;
  const rec = useMemo(() => (done ? compute(answers, platform) : null), [answers, done, platform]);

  // Hydrate from the URL once, so a shared verdict link reproduces the state.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const a = sp.get("a");
    if (a) setAnswers(decodeAnswers(a));
    if (sp.get("l") === "a") setPlatform("agentforce");
  }, []);

  // Keep the URL in sync, debounced, so the current state is always linkable.
  useEffect(() => {
    const t = setTimeout(() => {
      const sp = new URLSearchParams();
      if (answeredCount > 0) sp.set("a", encodeAnswers(answers));
      if (platform === "agentforce") sp.set("l", "a");
      const qs = sp.toString();
      window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    }, 250);
    return () => clearTimeout(t);
  }, [answers, platform, answeredCount]);

  // Funnel: did they start, did they reach a verdict, did they take it with
  // them. Each fires once per session so changing an answer does not inflate it.
  const started = useRef(false);
  const verdictSent = useRef(false);

  const set = (qid: string, oid: string) => {
    if (!started.current) {
      started.current = true;
      track("design gate started");
    }
    setAnswers((prev) => ({ ...prev, [qid]: oid }));
  };

  useEffect(() => {
    if (rec && !verdictSent.current) {
      verdictSent.current = true;
      track("design gate verdict", { verdict: rec.shape, lens: platform });
    }
  }, [rec, platform]);

  const copySummary = () => {
    if (!rec) return;
    const prefix = platform === "agentforce" ? "Flow, prompt, or agent" : "Agent or workflow";
    const link = `hamidettefagh.com/agent-architecture${window.location.search}`;
    const text = `${prefix}: ${rec.shape}. ${rec.shapeDetail} ${link}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        track("design gate copied", { verdict: rec.shape, lens: platform });
        setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {
        // ignore
      });
  };

  return (
    <div className="mt-9">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500">
          Lens
        </span>
        {PLATFORM_OPTIONS.map((p) => {
          const on = platform === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlatform(p.id)}
              aria-pressed={on}
              className={[
                "text-small leading-tight rounded-pill border px-4 py-[7px] cursor-pointer transition-[background-color,border-color,color] duration-(--dur-fast) ease-out",
                on
                  ? "bg-accent-600 border-accent-600 text-on-accent"
                  : "bg-paper-0 border-line-2 text-ink-700 hover:border-ink-500",
              ].join(" ")}
            >
              {p.label}
            </button>
          );
        })}
        <span className="text-small text-ink-500 leading-tight">
          {platform === "agentforce"
            ? "Same verdict, rendered in Flow, prompt templates, Agent Script, and topics."
            : "Vendor-neutral vocabulary."}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 mt-7">
        <span className="font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500">
          {answeredCount} of {QUESTIONS.length} answered
        </span>
        {answeredCount > 0 ? (
          <button
            type="button"
            onClick={() => setAnswers({})}
            className="font-mono text-mono-sm tracking-[0.05em] text-ink-500 bg-transparent cursor-pointer border border-line-1 rounded-sm px-[11px] py-[6px] transition-[border-color,color] duration-(--dur-fast) ease-out hover:border-line-2 hover:text-ink-900"
          >
            Reset
          </button>
        ) : null}
      </div>

      {QUESTIONS.map((question) => (
        <div key={question.id} className="mt-9">
          <h2 className="text-[18px] font-medium text-ink-900 leading-tight m-0 mb-3">
            {question.q}
          </h2>
          <div className="flex flex-wrap gap-2">
            {question.options.map((o) => {
              const on = answers[question.id] === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => set(question.id, o.id)}
                  aria-pressed={on}
                  className={[
                    "text-small leading-tight text-left rounded-pill border px-4 py-[9px] cursor-pointer transition-[background-color,border-color,color] duration-(--dur-fast) ease-out",
                    on
                      ? "bg-accent-600 border-accent-600 text-on-accent"
                      : "bg-paper-0 border-line-2 text-ink-700 hover:border-ink-500",
                  ].join(" ")}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-11 pt-9 border-t border-line-2">
        {rec ? (
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-mono-sm tracking-[0.06em] uppercase text-accent-600">
                How I would start
              </span>
              <button
                type="button"
                onClick={copySummary}
                className="font-mono text-mono-sm tracking-[0.05em] text-ink-500 bg-transparent cursor-pointer border border-line-1 rounded-sm px-[11px] py-[6px] transition-[border-color,color] duration-(--dur-fast) ease-out hover:border-line-2 hover:text-ink-900"
              >
                {copied ? "Copied" : "Copy summary"}
              </button>
            </div>
            <h3 className="font-display font-bold text-[clamp(28px,4vw,40px)] tracking-heading leading-tight mt-3 mb-0">
              {rec.shape}
            </h3>
            <p className="mt-3 mb-0 text-lead leading-[1.5] text-ink-700 max-w-[54ch]">
              {rec.shapeDetail}
            </p>

            <div className="mt-8">
              <ArchitectureDiagram stages={rec.stages} />
            </div>

            <div className="mt-9">
              <Detail label="Knowledge" text={rec.knowledge} />
              <Detail label="Humans in the loop" text={rec.humans} />
              <Detail label="Model" text={rec.model} />
            </div>

            <div className="mt-9">
              <div className="font-mono text-mono tracking-mono uppercase text-accent-600 mb-1">
                What I would worry about
              </div>
              {rec.risks.map((r, i) => (
                <p
                  key={i}
                  className="text-body leading-body text-ink-700 m-0 py-4 border-t border-line-1 max-w-[62ch]"
                >
                  {r}
                </p>
              ))}
            </div>

            <p className="mt-9 text-small text-ink-500 leading-tight max-w-[56ch]">
              This link now carries your answers, so the verdict can be shared
              as is. To run the same decision over a real spec from your editor,
              use the{" "}
              <TextLink
                href="https://github.com/hamidettefagh/agent-or-workflow"
                external
              >
                Claude skill
              </TextLink>
              . Built the thing already? Take it through{" "}
              <TextLink href="/agent-production-readiness">
                the ship gate
              </TextLink>
              .
            </p>

            <p className="mt-6 font-mono text-[10.5px] tracking-[0.05em] uppercase text-ink-300 max-w-[60ch] leading-[1.6]">
              This is how I would start, not the only way. Your constraints may
              point somewhere else. If your answers put a model in the path, make
              it justify the seat.
            </p>
          </div>
        ) : (
          <p className="text-body text-ink-500 leading-body max-w-[52ch]">
            Answer the questions and I will tell you which parts of this actually
            need an agent, and which should stay a workflow you can test.
          </p>
        )}
      </div>
    </div>
  );
}
