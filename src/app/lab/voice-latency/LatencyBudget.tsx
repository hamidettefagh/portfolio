"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MARKS,
  PRESETS,
  STAGES,
  TOOL_DECISION_MS,
  band,
  type StageKey,
} from "@/lib/voice-latency";

const CASCADE: StageKey[] = ["uplink", "eot", "stt", "llm", "tool", "tts", "downlink"];
const S2S: StageKey[] = ["uplink", "eot", "s2s", "downlink"];

// Fills for the stages along the bar: listening in ink, thinking in the
// accent, speaking back in ink again, so the model's share stands out.
const FILL: Record<StageKey, string> = {
  uplink: "bg-ink-300",
  eot: "bg-ink-500",
  stt: "bg-ink-700",
  llm: "bg-accent-600",
  tool: "bg-accent-500",
  tts: "bg-accent-100 border border-accent-500",
  s2s: "bg-accent-600",
  downlink: "bg-ink-300",
};

function fmt(ms: number) {
  return ms.toLocaleString("en-US");
}

export function LatencyBudget() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const [values, setValues] = useState<Partial<Record<StageKey, number>>>(preset.values);
  const [ack, setAck] = useState(false);
  const [rtt, setRtt] = useState<number | null>(null);

  // Your real round trip to this site's edge: five tiny requests, median kept.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const samples: number[] = [];
      for (let i = 0; i < 5; i++) {
        const t = performance.now();
        try {
          await fetch(`/api/ping?i=${i}&t=${Date.now()}`, { cache: "no-store" });
        } catch {
          return;
        }
        samples.push(performance.now() - t);
      }
      samples.sort((a, b) => a - b);
      if (!cancelled) setRtt(Math.round(samples[2]));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pick = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPresetId(id);
    setValues(p.values);
    setAck(false);
  };

  const keys = (preset.arch === "s2s" ? S2S : CASCADE).filter(
    (k) => k !== "tool" || values.tool !== undefined,
  );
  const total = keys.reduce((n, k) => n + (values[k] ?? 0), 0);
  const firstSound =
    ack && values.tool !== undefined ? total - values.tool + Math.min(TOOL_DECISION_MS, values.tool) : null;
  const verdict = band(firstSound ?? total);
  const scaleMax = Math.max(2600, Math.ceil((total + 200) / 500) * 500);
  const pct = (ms: number) => `${(ms / scaleMax) * 100}%`;

  const segments = useMemo(() => {
    let start = 0;
    return keys.map((k) => {
      const seg = { key: k, start, ms: values[k] ?? 0 };
      start += seg.ms;
      return seg;
    });
  }, [keys, values]);

  const ticks = Array.from({ length: scaleMax / 500 + 1 }, (_, i) => i * 500);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Setups">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={p.id === presetId}
            onClick={() => pick(p.id)}
            className={[
              "choice-chip text-[14px] leading-none rounded-pill border px-[13px] py-[8px] cursor-pointer",
              p.id === presetId
                ? "border-accent-500 text-accent-700 bg-accent-050"
                : "border-line-2 text-ink-700 bg-transparent hover:border-ink-500 hover:text-ink-900",
            ].join(" ")}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="text-small text-ink-500 leading-tight mt-4 mb-0 max-w-[62ch] min-h-[2.7em]">{preset.note}</p>

      <div className="mt-8 bg-surface-raised border border-line-1 rounded-md px-6 pt-6 pb-5 [@media(max-width:560px)]:px-4">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div aria-live="polite">
            <span className="block font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500">
              {firstSound !== null ? "First sound the caller hears" : "Caller stops talking to first sound back"}
            </span>
            <span className="block font-display font-bold text-[clamp(40px,7vw,64px)] tracking-display leading-none mt-2 tabular-nums">
              {fmt(firstSound ?? total)}
              <span className="text-[0.4em] font-semibold tracking-heading text-ink-500 ml-2">ms</span>
            </span>
            {firstSound !== null ? (
              <span className="block text-small text-ink-500 mt-2">
                An acknowledgment. The answer itself arrives at {fmt(total)} ms.
              </span>
            ) : null}
          </div>
          <div className="text-right [@media(max-width:560px)]:text-left">
            <span className="block font-display font-semibold text-[22px] tracking-heading">{verdict.label}</span>
            <span className="block text-small text-ink-500 leading-tight max-w-[30ch]">{verdict.note}</span>
          </div>
        </div>

        {/* The turn as a timeline: each stage starts where the last one ended. */}
        <div className="relative mt-8" aria-hidden="true">
          <div className="relative h-[34px] rounded-sm bg-paper-1 overflow-hidden">
            {segments.map((s) => (
              <span
                key={s.key}
                className={`absolute top-0 bottom-0 ${FILL[s.key]} transition-[left,width] duration-(--dur-base) ease-out`}
                style={{ left: pct(s.start), width: pct(s.ms) }}
                title={`${STAGES[s.key].label}: ${fmt(s.ms)} ms`}
              ></span>
            ))}
            {firstSound !== null ? (
              <span
                className="absolute top-[-4px] bottom-[-4px] w-[2px] bg-ink-900"
                style={{ left: pct(firstSound) }}
              ></span>
            ) : null}
          </div>
          <div className="relative h-[46px] mt-1">
            {ticks.map((t) => (
              <span
                key={t}
                className="absolute top-0 -translate-x-1/2 font-mono text-[10.5px] text-ink-500 tabular-nums"
                style={{ left: pct(t) }}
              >
                {t === 0 ? "0" : t >= 1000 ? `${t / 1000}s` : t}
              </span>
            ))}
            {MARKS.map((m) => (
              <span
                key={m.at}
                className="absolute top-[18px] border-l border-dashed border-ink-500 pl-[5px] font-mono text-[10.5px] tracking-[0.04em] uppercase text-ink-500 whitespace-nowrap [@media(max-width:560px)]:text-[9.5px]"
                style={{ left: pct(m.at) }}
                title={m.note}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ol className="list-none p-0 m-0 mt-6">
        {keys.map((k) => {
          const st = STAGES[k];
          const v = values[k] ?? 0;
          return (
            <li key={k} className="grid grid-cols-[14px_minmax(0,1fr)_minmax(0,240px)] gap-x-4 gap-y-2 items-start py-5 border-b border-line-1 [@media(max-width:700px)]:grid-cols-[14px_minmax(0,1fr)]">
              <span className={`w-[10px] h-[10px] mt-[7px] rounded-[2px] ${FILL[k]}`} aria-hidden="true"></span>
              <span>
                <label htmlFor={`vl-${k}`} className="block font-display font-semibold text-[17px] tracking-heading leading-heading">
                  {st.label}
                </label>
                <span className="block text-small text-ink-500 leading-tight mt-1">{st.detail}</span>
                <span className="block font-mono text-[11.5px] tracking-[0.02em] text-ink-500 mt-2">
                  Published: {st.range} [{st.sources.join(", ")}]
                </span>
              </span>
              <span className="[@media(max-width:700px)]:col-start-2">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[15px] text-ink-900 tabular-nums">{fmt(v)} ms</span>
                  {k === "tool" ? (
                    <label className="inline-flex items-center gap-2 text-small text-ink-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ack}
                        onChange={(e) => setAck(e.target.checked)}
                        className="accent-[var(--color-accent-600)] w-[15px] h-[15px]"
                      />
                      Say something first
                    </label>
                  ) : null}
                </span>
                <input
                  id={`vl-${k}`}
                  type="range"
                  min={st.min}
                  max={st.max}
                  step={5}
                  value={v}
                  onChange={(e) => setValues((prev) => ({ ...prev, [k]: Number(e.target.value) }))}
                  className="w-full mt-3 accent-[var(--color-accent-600)] cursor-pointer"
                  aria-valuetext={`${v} milliseconds`}
                />
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 mb-0 text-small text-ink-700 leading-tight max-w-[62ch]">
        {rtt !== null ? (
          <>
            Measured just now: your round trip to this site is{" "}
            <span className="font-mono text-ink-900">{rtt} ms</span> (median of five). On a
            web call, that network time rides inside the two audio legs at the
            top and bottom of the list.
          </>
        ) : (
          "Measuring your round trip to this site..."
        )}
      </p>
    </div>
  );
}
