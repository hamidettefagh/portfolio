"use client";

import { useEffect, useRef, useState } from "react";

// Ask-my-agent panel — components/patterns/AskAgent.jsx
// In production the panel calls /api/ask (Anthropic Messages API server-side).
const DEFAULT_SUGGESTIONS = [
  "What did he do for the airline?",
  "How did he cut agent costs 80 percent?",
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
  const [answer, setAnswer] = useState<{ text: string; muted: boolean } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
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
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data && typeof data.answer === "string") {
        setAnswer({ text: data.answer, muted: false });
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
        <span>{busy ? "Working" : "Agent online"}</span>
      </div>
      <form className="flex gap-[10px]" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          className="flex-1 min-w-0 border border-line-2 rounded-pill bg-paper-0 font-body text-[16px] text-ink-900 px-5 py-3 outline-none tracking-body transition-[border-color] duration-(--dur-fast) ease-out focus:border-ink-900 placeholder:text-ink-300"
          placeholder="Ask about the work"
          value={query}
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
      <p className="mt-[14px] mb-0 font-mono text-[10.5px] tracking-[0.05em] uppercase text-ink-300">
        Live model output. It can be wrong. For anything that matters, email.
      </p>
    </div>
  );
}
