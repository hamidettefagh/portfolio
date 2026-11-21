"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  askGuardrails,
  FACT_SHEET_URL,
  formatCost,
  formatMs,
  isTrace,
  type AskTrace,
} from "@/lib/ask-trace";

// Ask-my-agent panel — components/patterns/AskAgent.jsx
// In production the panel calls /api/ask (Anthropic Messages API server-side).
// Each answer comes back with a trace of what it took to make it, shown on
// request under the answer.
const DEFAULT_SUGGESTIONS = [
  "What did he do for the airline?",
  "What are the two gates?",
  "What does a forward deployed engineer do?",
];

const ERROR_FALLBACK =
  "The agent hit an error. Try again, or email hamid.ettefagh@gmail.com.";

export function AskAgent({
  suggestions = DEFAULT_SUGGESTIONS,
  focusEventName = "pf-ask-focus",
}: {
  suggestions?: string[];
  focusEventName?: string;
}) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<{
    text: string;
    muted: boolean;
    trace?: AskTrace;
    roundTripMs?: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onFocus = () => inputRef.current?.focus();
    window.addEventListener(focusEventName, onFocus);
    return () => window.removeEventListener(focusEventName, onFocus);
  }, [focusEventName]);

  const ask = async (q: string) => {
    const question = (q || "").trim();
    if (!question || busy) return;
    setBusy(true);
    setAnswer(null);
    try {
      const started = performance.now();
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json().catch(() => null);
      const roundTripMs = performance.now() - started;
      if (res.ok && data && typeof data.answer === "string") {
        setAnswer({
          text: data.answer,
          muted: false,
          trace: isTrace(data.trace) ? data.trace : undefined,
          roundTripMs,
        });
      } else {
        setAnswer({
          text:
            data && typeof data.error === "string" ? data.error : ERROR_FALLBACK,
          muted: true,
        });
      }
    } catch {
      setAnswer({ text: ERROR_FALLBACK, muted: true });
    }
    setBusy(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(query);
  };
  const onSuggestion = (s: string) => {
    setQuery(s);
    ask(s);
  };

  return (
    <div className="bg-surface-raised border border-line-1 rounded-md p-6">
      <div className="font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500 flex items-center gap-2 mb-4">
        <span
          className={[
            "w-[7px] h-[7px] rounded-full bg-live flex-none",
            busy ? "animate-[ask-pulse_1.1s_ease-in-out_infinite]" : "",
          ].join(" ")}
        ></span>
        <span role="status">{busy ? "Working" : "Agent online"}</span>
      </div>
      <form className="flex gap-[10px]" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          className="flex-1 min-w-0 border border-line-2 rounded-pill bg-paper-0 font-body text-[16px] text-ink-900 px-5 py-3 outline-none tracking-body transition-[border-color] duration-(--dur-fast) ease-out focus:border-ink-900 placeholder:text-ink-300"
          placeholder="Ask about the work"
          value={query}
          maxLength={300}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="font-body font-medium text-[16px] leading-none px-6 py-3 rounded-pill cursor-pointer whitespace-nowrap bg-accent-600 text-on-accent transition-[background-color,transform] duration-(--dur-fast) ease-out hover:bg-accent-700 active:translate-y-px disabled:opacity-45 disabled:pointer-events-none"
          disabled={busy || !query.trim()}
        >
          Ask
        </button>
      </form>
      <div className="flex gap-2 flex-wrap mt-[14px]">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            className="font-mono text-mono-sm tracking-[0.04em] text-ink-700 border border-line-1 rounded-pill bg-transparent px-3 py-[6px] cursor-pointer leading-[1.3] transition-[border-color,color] duration-(--dur-fast) ease-out hover:border-line-2 hover:text-ink-900"
            onClick={() => onSuggestion(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {answer ? (
          <p
            className={[
              "mt-[18px] mb-0 pt-[18px] border-t border-line-1 text-body leading-body max-w-[62ch] whitespace-pre-wrap",
              answer.muted ? "text-ink-500" : "text-ink-900",
            ].join(" ")}
          >
            {answer.text}
          </p>
        ) : null}
      </div>
      {answer?.trace ? (
        <div className="mt-4">
          <button
            type="button"
            aria-expanded={traceOpen}
            aria-controls={traceOpen ? "ask-trace" : undefined}
            onClick={() => setTraceOpen((o) => !o)}
            className="font-mono text-mono-sm tracking-[0.05em] uppercase text-ink-500 bg-transparent p-0 cursor-pointer underline underline-offset-[3px] decoration-line-2 transition-colors duration-(--dur-fast) ease-out hover:text-ink-900 hover:decoration-current"
          >
            {traceOpen ? "Hide how this answer was made" : "How this answer was made"}
          </button>
          {traceOpen ? (
            <dl
              id="ask-trace"
              className="mt-3 mb-0 grid grid-cols-[120px_minmax(0,1fr)] gap-x-5 gap-y-[7px] font-mono text-[12.5px] leading-[1.5] [@media(max-width:520px)]:grid-cols-1 [@media(max-width:520px)]:gap-y-[2px]"
            >
              <dt className="text-ink-500 uppercase tracking-[0.05em] text-[11px] pt-[2px] [@media(max-width:520px)]:pt-2">Model</dt>
              <dd className="m-0 text-ink-700">{answer.trace.model}, one call, no tools</dd>
              <dt className="text-ink-500 uppercase tracking-[0.05em] text-[11px] pt-[2px] [@media(max-width:520px)]:pt-2">Time</dt>
              <dd className="m-0 text-ink-700">
                {formatMs(answer.trace.modelMs)} in the model
                {answer.roundTripMs ? `, ${formatMs(answer.roundTripMs)} round trip` : ""}
              </dd>
              <dt className="text-ink-500 uppercase tracking-[0.05em] text-[11px] pt-[2px] [@media(max-width:520px)]:pt-2">Tokens</dt>
              <dd className="m-0 text-ink-700">
                {answer.trace.inputTokens.toLocaleString("en-US")} in,{" "}
                {answer.trace.outputTokens.toLocaleString("en-US")} out
              </dd>
              <dt className="text-ink-500 uppercase tracking-[0.05em] text-[11px] pt-[2px] [@media(max-width:520px)]:pt-2">Cost</dt>
              <dd className="m-0 text-ink-700">{formatCost(answer.trace.costUsd)} at list price</dd>
              <dt className="text-ink-500 uppercase tracking-[0.05em] text-[11px] pt-[2px] [@media(max-width:520px)]:pt-2">House style</dt>
              <dd className="m-0 text-ink-700">
                {answer.trace.styleBreaks === 0
                  ? "The model followed it; nothing to fix"
                  : `${answer.trace.styleBreaks} ${answer.trace.styleBreaks === 1 ? "break" : "breaks"} fixed in code before you saw it`}
              </dd>
              <dt className="text-ink-500 uppercase tracking-[0.05em] text-[11px] pt-[2px] [@media(max-width:520px)]:pt-2">Guardrails</dt>
              <dd className="m-0 text-ink-700">{askGuardrails(answer.trace.outputCheck === true).join(". ")}.</dd>
              <dt className="text-ink-500 uppercase tracking-[0.05em] text-[11px] pt-[2px] [@media(max-width:520px)]:pt-2">Sources</dt>
              <dd className="m-0 text-ink-700">
                <a
                  href={FACT_SHEET_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink-900 underline decoration-line-2 underline-offset-[3px] hover:text-accent-700 hover:decoration-current"
                >
                  The fact sheet it answers from<span aria-hidden="true"> &#8599;</span>
                </a>
                {". "}
                <Link
                  href="/lab/site-agent-evals"
                  className="text-ink-900 underline decoration-line-2 underline-offset-[3px] hover:text-accent-700 hover:decoration-current"
                >
                  How it scores on its evals
                </Link>
                .
              </dd>
            </dl>
          ) : null}
        </div>
      ) : null}
      <p className="mt-[14px] mb-0 font-mono text-[10.5px] tracking-[0.05em] uppercase text-ink-300">
        Live model output. It can be wrong. For anything that matters, email.
      </p>
    </div>
  );
}
