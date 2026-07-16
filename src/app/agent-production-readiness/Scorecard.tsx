"use client";

import { useEffect, useMemo, useState } from "react";
import { RadarChart, readinessBand } from "@/components/patterns/RadarChart";
import { TextLink } from "@/components/primitives/TextLink";

// Interactive production-readiness diagnostic. The seven categories map to the
// seven axes of the radar (order matches READINESS_AXES). Fill-based checkbox
// state (no checkmark glyph) stays inside the text-glyph-only icon rule.
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

const PER = CATEGORIES[0].items.length; // items per axis (4)
const TOTAL = CATEGORIES.length * PER;

// The state is the URL: 28 checkboxes as a 28-bit mask in hex, so a filled
// scorecard is a link anyone can open and see the same shape.
function encodeChecked(checked: Set<string>): string {
  let bits = 0;
  for (let ci = 0; ci < CATEGORIES.length; ci++) {
    for (let ii = 0; ii < PER; ii++) {
      if (checked.has(`${ci}-${ii}`)) bits |= 1 << (ci * PER + ii);
    }
  }
  return bits.toString(16);
}

function decodeChecked(hex: string): Set<string> {
  const bits = parseInt(hex, 16);
  const out = new Set<string>();
  if (!Number.isInteger(bits) || bits < 0) return out;
  for (let ci = 0; ci < CATEGORIES.length; ci++) {
    for (let ii = 0; ii < PER; ii++) {
      if (bits & (1 << (ci * PER + ii))) out.add(`${ci}-${ii}`);
    }
  }
  return out;
}

export function Scorecard() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const s = new URLSearchParams(window.location.search).get("s");
    if (s) setChecked(decodeChecked(s));
  }, []);

  // Keep the URL in sync, debounced, so the current score is always linkable.
  useEffect(() => {
    const t = setTimeout(() => {
      const qs = checked.size > 0 ? `?s=${encodeChecked(checked)}` : "";
      window.history.replaceState(null, "", qs || window.location.pathname);
    }, 250);
    return () => clearTimeout(t);
  }, [checked]);

  const toggle = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const count = checked.size;

  const perCategory = useMemo(
    () =>
      CATEGORIES.map((c, ci) =>
        c.items.reduce((n, _item, ii) => (checked.has(`${ci}-${ii}`) ? n + 1 : n), 0),
      ),
    [checked],
  );

  const diagnosis = useMemo(() => {
    if (count === 0) return null;
    const fracs = perCategory.map((v) => v / PER);
    const max = Math.max(...fracs);
    const min = Math.min(...fracs);
    const strengths = CATEGORIES.filter((_c, i) => fracs[i] === max).map((c) => c.label);
    const gaps = CATEGORIES.filter((_c, i) => fracs[i] === min && fracs[i] < 1).map(
      (c) => c.label,
    );
    return { strengths: strengths.slice(0, 2), gaps: gaps.slice(0, 2), max, min };
  }, [perCategory, count]);

  const copySummary = () => {
    const parts = [
      `Agent production readiness: ${count}/${TOTAL} (${readinessBand(count, TOTAL)}).`,
    ];
    if (diagnosis && diagnosis.strengths.length)
      parts.push(`Strongest: ${diagnosis.strengths.join(", ")}.`);
    if (diagnosis && diagnosis.gaps.length)
      parts.push(`Gaps: ${diagnosis.gaps.join(", ")}.`);
    parts.push(`hamidettefagh.com/agent-production-readiness${window.location.search}`);
    navigator.clipboard
      .writeText(parts.join(" "))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {
        // ignore
      });
  };

  return (
    <div className="mt-9">
      <div className="mx-auto max-w-[540px]">
        <RadarChart values={perCategory} animate={!reduceMotion} />
      </div>

      {diagnosis && (diagnosis.strengths.length > 0 || diagnosis.gaps.length > 0) ? (
        <p className="text-center text-small text-ink-700 leading-tight max-w-[46ch] mx-auto mt-2">
          {diagnosis.max > diagnosis.min ? (
            <>
              Strongest in {diagnosis.strengths.join(" and ")}.
              {diagnosis.gaps.length > 0
                ? ` The gap is ${diagnosis.gaps.join(" and ")}.`
                : ""}
            </>
          ) : diagnosis.min === 1 ? (
            "Production ready across the board."
          ) : (
            "Even across the board. Pick the axis that matters most and start there."
          )}
        </p>
      ) : null}

      <div className="flex justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={copySummary}
          className="font-mono text-mono-sm tracking-[0.05em] text-ink-500 bg-transparent cursor-pointer border border-line-1 rounded-sm px-[11px] py-[6px] transition-[border-color,color] duration-(--dur-fast) ease-out hover:border-line-2 hover:text-ink-900"
        >
          {copied ? "Copied" : "Copy summary"}
        </button>
        <button
          type="button"
          onClick={() => setChecked(new Set())}
          className="font-mono text-mono-sm tracking-[0.05em] text-ink-500 bg-transparent cursor-pointer border border-line-1 rounded-sm px-[11px] py-[6px] transition-[border-color,color] duration-(--dur-fast) ease-out hover:border-line-2 hover:text-ink-900"
        >
          Reset
        </button>
      </div>

      {count > 0 ? (
        <p className="text-center text-small text-ink-500 leading-tight max-w-[52ch] mx-auto mt-4">
          This link now carries your score, so it can be shared as is. To run
          the same review on real code and configs, use the{" "}
          <TextLink
            href="https://github.com/hamidettefagh/agent-production-readiness"
            external
          >
            Claude skill
          </TextLink>
          . Deciding what the next build should even be? Start at{" "}
          <TextLink href="/agent-architecture">the design gate</TextLink>.
        </p>
      ) : null}

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
