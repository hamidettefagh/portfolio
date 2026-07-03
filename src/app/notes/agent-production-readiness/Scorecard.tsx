"use client";

import { useMemo, useState } from "react";

// Interactive production-readiness scorecard.
// Fill-based checkbox state (no checkmark glyph) keeps it inside the brand's
// text-glyph-only icon rule.
const CATEGORIES: { label: string; items: string[] }[] = [
  {
    label: "Evaluation",
    items: [
      "An evaluation set built from real user inputs, not hand-picked happy paths.",
      "Evals run automatically when the prompt, tools, or model change.",
      "You measure grounding and accuracy, not just whether a reply was produced.",
      "Someone reviews a sample of real conversations on a set cadence.",
    ],
  },
  {
    label: "Cost",
    items: [
      "A token or credit budget per conversation that you actually enforce.",
      "The model is right-sized for the task, not the largest one by default.",
      "Cost is monitored, with an alert before the bill surprises you.",
      "You know the cost per resolved conversation, not just per call.",
    ],
  },
  {
    label: "Observability",
    items: [
      "Every conversation is traced end to end, tools included.",
      "Tool-call success and failure rates are tracked, not assumed.",
      "Latency is measured at the tail, not just the average.",
      "You can pull up any past conversation and see what happened.",
    ],
  },
  {
    label: "Guardrails",
    items: [
      "Inputs are validated before they reach the model.",
      "The agent stays in scope and declines work outside it.",
      "Sensitive data is handled deliberately, not passed through by accident.",
      "Outputs are checked before they reach a customer or a system of record.",
    ],
  },
  {
    label: "Human oversight",
    items: [
      "There is a clear path to a human when the agent should step back.",
      "High-risk actions require confirmation before they run.",
      "Low-confidence answers are caught rather than sent anyway.",
      "The people on the hook for the agent know how it behaves.",
    ],
  },
  {
    label: "Reliability",
    items: [
      "Prompts and agent config are versioned like code.",
      "You can roll back a bad change in minutes, not days.",
      "The agent degrades gracefully when a tool or model is down.",
      "You have tested what happens under load and under failure.",
    ],
  },
  {
    label: "Governance",
    items: [
      "Every consequential action leaves an audit trail.",
      "Data handling and retention are written down and followed.",
      "Access to the agent and its tools is controlled and reviewed.",
      "Changes go through review before they reach production.",
    ],
  },
];

const TOTAL = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

function band(count: number): string {
  if (count === 0) return "Score your system";
  const pct = count / TOTAL;
  if (pct >= 0.9) return "Production ready";
  if (pct >= 0.7) return "Nearly there";
  if (pct >= 0.4) return "On the way";
  return "This is a demo";
}

export function Scorecard() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const count = checked.size;
  const pct = Math.round((count / TOTAL) * 100);

  const perCategory = useMemo(
    () =>
      CATEGORIES.map((c, ci) =>
        c.items.reduce((n, _item, ii) => (checked.has(`${ci}-${ii}`) ? n + 1 : n), 0),
      ),
    [checked],
  );

  return (
    <div className="mt-9">
      <div className="border-t border-b border-line-2 py-7">
        <div className="flex items-end justify-between gap-6 [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:items-start [@media(max-width:640px)]:gap-3">
          <div>
            <div className="font-mono text-mono-sm tracking-[0.06em] uppercase text-accent-600 mb-2">
              {band(count)}
            </div>
            <div className="font-display font-bold text-[clamp(40px,6vw,64px)] tracking-display leading-none">
              {count}
              <span className="text-ink-300"> / {TOTAL}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setChecked(new Set())}
            className="font-mono text-mono-sm tracking-[0.05em] text-ink-500 bg-transparent cursor-pointer border border-line-1 rounded-sm px-[9px] py-[5px] transition-[border-color,color] duration-(--dur-fast) ease-out hover:border-line-2 hover:text-ink-900"
          >
            Reset
          </button>
        </div>
        <div className="mt-5 h-[6px] bg-paper-2 rounded-pill overflow-hidden">
          <div
            className="h-full bg-accent-600 rounded-pill transition-[width] duration-(--dur-base) ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {CATEGORIES.map((cat, ci) => (
        <section key={cat.label}>
          <div className="flex items-center gap-4 mt-10 mb-1">
            <span className="font-mono text-mono tracking-mono uppercase text-accent-600 flex-none">
              {cat.label}
            </span>
            <span className="flex-1 h-0 border-t border-line-1" />
            <span className="font-mono text-mono-sm tracking-[0.04em] text-ink-300 flex-none">
              {perCategory[ci]}/{cat.items.length}
            </span>
          </div>
          {cat.items.map((item, ii) => {
            const key = `${ci}-${ii}`;
            const on = checked.has(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                aria-pressed={on}
                className="group flex items-start gap-4 py-4 border-t border-line-1 w-full text-left cursor-pointer"
              >
                <span
                  className={[
                    "w-[18px] h-[18px] rounded-sm border flex-none mt-[3px] transition-colors duration-(--dur-fast) ease-out",
                    on
                      ? "bg-accent-600 border-accent-600"
                      : "bg-paper-0 border-line-2 group-hover:border-ink-500",
                  ].join(" ")}
                  aria-hidden="true"
                />
                <span
                  className={[
                    "text-body leading-tight transition-colors duration-(--dur-fast) ease-out",
                    on ? "text-ink-900" : "text-ink-700",
                  ].join(" ")}
                >
                  {item}
                </span>
              </button>
            );
          })}
        </section>
      ))}

      <p className="mt-10 font-mono text-[10.5px] tracking-[0.05em] uppercase text-ink-300 max-w-[60ch] leading-[1.6]">
        This is my checklist, not a standard. Adapt it to your own system. The
        score is a prompt for a conversation, not a certificate.
      </p>
    </div>
  );
}
