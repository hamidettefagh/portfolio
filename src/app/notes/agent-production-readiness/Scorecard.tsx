"use client";

import { useMemo, useState } from "react";

// Interactive production-readiness diagnostic. The seven categories map to the
// seven axes of a radar chart; checking items grows that axis. Fill-based
// checkbox state (no checkmark glyph) stays inside the text-glyph-only icon rule.
const CATEGORIES: { label: string; axis: string; items: string[] }[] = [
  {
    label: "Evaluation",
    axis: "Evaluation",
    items: [
      "An evaluation set built from real user inputs, not hand-picked happy paths.",
      "Evals run automatically when the prompt, tools, or model change.",
      "You measure grounding and accuracy, not just whether a reply was produced.",
      "Someone reviews a sample of real conversations on a set cadence.",
    ],
  },
  {
    label: "Cost",
    axis: "Cost",
    items: [
      "A token or credit budget per conversation that you actually enforce.",
      "The model is right-sized for the task, not the largest one by default.",
      "Cost is monitored, with an alert before the bill surprises you.",
      "You know the cost per resolved conversation, not just per call.",
    ],
  },
  {
    label: "Observability",
    axis: "Observability",
    items: [
      "Every conversation is traced end to end, tools included.",
      "Tool-call success and failure rates are tracked, not assumed.",
      "Latency is measured at the tail, not just the average.",
      "You can pull up any past conversation and see what happened.",
    ],
  },
  {
    label: "Guardrails",
    axis: "Guardrails",
    items: [
      "Inputs are validated before they reach the model.",
      "The agent stays in scope and declines work outside it.",
      "Sensitive data is handled deliberately, not passed through by accident.",
      "Outputs are checked before they reach a customer or a system of record.",
    ],
  },
  {
    label: "Human oversight",
    axis: "Oversight",
    items: [
      "There is a clear path to a human when the agent should step back.",
      "High-risk actions require confirmation before they run.",
      "Low-confidence answers are caught rather than sent anyway.",
      "The people on the hook for the agent know how it behaves.",
    ],
  },
  {
    label: "Reliability",
    axis: "Reliability",
    items: [
      "Prompts and agent config are versioned like code.",
      "You can roll back a bad change in minutes, not days.",
      "The agent degrades gracefully when a tool or model is down.",
      "You have tested what happens under load and under failure.",
    ],
  },
  {
    label: "Governance",
    axis: "Governance",
    items: [
      "Every consequential action leaves an audit trail.",
      "Data handling and retention are written down and followed.",
      "Access to the agent and its tools is controlled and reviewed.",
      "Changes go through review before they reach production.",
    ],
  },
];

const N = CATEGORIES.length;
const PER = CATEGORIES[0].items.length; // items per axis (4)
const TOTAL = N * PER;

// Radar geometry
const W = 560;
const H = 460;
const CX = 280;
const CY = 215;
const R = 145;
const LABEL_R = 174;

function angle(i: number): number {
  return ((-90 + i * (360 / N)) * Math.PI) / 180;
}
function point(i: number, frac: number): [number, number] {
  const a = angle(i);
  return [CX + R * frac * Math.cos(a), CY + R * frac * Math.sin(a)];
}
function ringPath(frac: number): string {
  return (
    CATEGORIES.map((_c, i) => {
      const [x, y] = point(i, frac);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ") + " Z"
  );
}

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
  const [copied, setCopied] = useState(false);

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

  const dataPath = useMemo(
    () =>
      CATEGORIES.map((_c, i) => {
        const [x, y] = point(i, perCategory[i] / PER);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      }).join(" ") + " Z",
    [perCategory],
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
      `Agent production readiness: ${count}/${TOTAL} (${band(count)}).`,
    ];
    if (diagnosis && diagnosis.strengths.length)
      parts.push(`Strongest: ${diagnosis.strengths.join(", ")}.`);
    if (diagnosis && diagnosis.gaps.length)
      parts.push(`Gaps: ${diagnosis.gaps.join(", ")}.`);
    parts.push("hamidettefagh.com/notes/agent-production-readiness");
    try {
      navigator.clipboard.writeText(parts.join(" "));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mt-9">
      {/* Radar diagnostic */}
      <div className="mx-auto max-w-[540px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Production readiness radar: ${count} of ${TOTAL}`}>
          {/* grid rings */}
          {[1, 2, 3, 4].map((lvl) => (
            <path
              key={lvl}
              d={ringPath(lvl / 4)}
              fill="none"
              className="stroke-line-1"
              strokeWidth={1}
            />
          ))}
          {/* spokes */}
          {CATEGORIES.map((_c, i) => {
            const [x, y] = point(i, 1);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={x.toFixed(1)}
                y2={y.toFixed(1)}
                className="stroke-line-1"
                strokeWidth={1}
              />
            );
          })}
          {/* data polygon */}
          <path
            d={dataPath}
            className="fill-accent-600 stroke-accent-600"
            style={{ fillOpacity: 0.14, transition: "d var(--dur-base) var(--ease-out)" }}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {/* vertex dots */}
          {CATEGORIES.map((_c, i) => {
            if (perCategory[i] === 0) return null;
            const [x, y] = point(i, perCategory[i] / PER);
            return (
              <circle
                key={i}
                cx={x.toFixed(1)}
                cy={y.toFixed(1)}
                r={perCategory[i] === PER ? 4.5 : 3.5}
                className="fill-accent-600"
              />
            );
          })}
          {/* axis labels */}
          {CATEGORIES.map((c, i) => {
            const a = angle(i);
            const lx = CX + LABEL_R * Math.cos(a);
            const ly = CY + LABEL_R * Math.sin(a);
            const cos = Math.cos(a);
            const anchor = cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
            const complete = perCategory[i] === PER;
            return (
              <text
                key={i}
                x={lx.toFixed(1)}
                y={ly.toFixed(1)}
                textAnchor={anchor}
                dominantBaseline="middle"
                className={`font-mono uppercase ${complete ? "fill-accent-600" : "fill-ink-500"}`}
                style={{ fontSize: 11, letterSpacing: "0.06em" }}
              >
                {c.axis}
              </text>
            );
          })}
          {/* center score */}
          <text
            x={CX}
            y={CY - 6}
            textAnchor="middle"
            className="font-display fill-ink-900"
            style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.035em" }}
          >
            {count}
          </text>
          <text
            x={CX}
            y={CY + 20}
            textAnchor="middle"
            className="font-mono fill-ink-300"
            style={{ fontSize: 13, letterSpacing: "0.08em" }}
          >
            / {TOTAL}
          </text>
          <text
            x={CX}
            y={CY + 40}
            textAnchor="middle"
            className="font-mono uppercase fill-accent-600"
            style={{ fontSize: 11, letterSpacing: "0.1em" }}
          >
            {band(count)}
          </text>
        </svg>
      </div>

      {/* diagnosis */}
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

      {/* controls */}
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

      {/* checklist */}
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
