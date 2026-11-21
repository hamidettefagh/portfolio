"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SCRIPTS, SPEAKER_LABEL, responseGaps, summarize, type Speaker } from "@/lib/call-replay";

// A call, replayed against a clock. The transcript is all there from the
// start, so nothing depends on watching; playing it shows the timing, which is
// the part a transcript alone hides.

const FILL: Record<Speaker, string> = {
  menu: "bg-ink-500",
  caller: "bg-line-2",
  agent: "bg-accent-500",
  person: "bg-ink-700",
  hold: "bg-paper-2 [background-image:repeating-linear-gradient(135deg,transparent_0_5px,var(--color-line-2)_5px_6px)]",
};

function clock(s: number) {
  const m = Math.floor(s / 60);
  const sec = s - m * 60;
  return `${m}:${sec.toFixed(1).padStart(4, "0")}`;
}

export function CallReplay() {
  const [scriptId, setScriptId] = useState<"menu" | "agent">("agent");
  const script = SCRIPTS.find((s) => s.id === scriptId)!;
  const duration = script.turns[script.turns.length - 1].end;
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  const gaps = useMemo(() => new Map(responseGaps(script.turns).map((g) => [g.index, g.gap])), [script]);
  const both = useMemo(() => SCRIPTS.map((s) => ({ id: s.id, label: s.label, ...summarize(s) })), []);

  useEffect(() => {
    if (!playing) return;
    const step = (now: number) => {
      if (last.current !== null) {
        const dt = ((now - last.current) / 1000) * speed;
        setT((prev) => {
          const next = prev + dt;
          if (next >= duration) {
            setPlaying(false);
            return duration;
          }
          return next;
        });
      }
      last.current = now;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      last.current = null;
    };
  }, [playing, speed, duration]);

  const choose = (id: "menu" | "agent") => {
    setScriptId(id);
    setT(0);
    setPlaying(false);
  };

  const toggle = () => {
    if (t >= duration) setT(0);
    setPlaying((p) => !p);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setT(Math.max(0, Math.min(duration, ((e.clientX - r.left) / r.width) * duration)));
  };

  const pct = (s: number) => `${(s / duration) * 100}%`;
  const btn =
    "font-mono text-mono-sm tracking-[0.05em] uppercase text-ink-700 bg-transparent cursor-pointer border border-line-2 rounded-sm px-[11px] py-[7px] leading-none transition-[border-color,color] duration-(--dur-fast) ease-out hover:border-ink-500 hover:text-ink-900";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Which call">
        {SCRIPTS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={s.id === scriptId}
            onClick={() => choose(s.id)}
            className={[
              "choice-chip text-[14px] leading-none rounded-pill border px-[13px] py-[8px] cursor-pointer",
              s.id === scriptId
                ? "border-accent-500 text-accent-700 bg-accent-050"
                : "border-line-2 text-ink-700 bg-transparent hover:border-ink-500 hover:text-ink-900",
            ].join(" ")}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-6 bg-surface-raised border border-line-1 rounded-md px-6 py-5 [@media(max-width:560px)]:px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button type="button" className={btn} onClick={toggle}>
              {playing ? "Pause" : t >= duration ? "Replay" : "Play"}
            </button>
            <button
              type="button"
              className={btn}
              onClick={() => setSpeed((s) => (s === 1 ? 4 : 1))}
              aria-label={`${speed}x speed`}
            >
              {speed}x
            </button>
          </div>
          <span className="font-mono text-[15px] text-ink-900 tabular-nums">
            {clock(t)} <span className="text-ink-500">/ {clock(duration)}</span>
          </span>
        </div>

        <div
          className="relative mt-5 h-[30px] rounded-sm bg-paper-1 cursor-pointer overflow-hidden"
          onClick={seek}
          role="presentation"
        >
          {script.turns.map((turn, i) => (
            <span
              key={i}
              className={`absolute ${turn.who === "caller" ? "top-[16px] h-[10px]" : "top-[4px] h-[10px]"} rounded-[2px] ${FILL[turn.who]}`}
              style={{ left: pct(turn.start), width: `max(2px, ${pct(turn.end - turn.start)})` }}
              title={`${SPEAKER_LABEL[turn.who]}, ${clock(turn.start)}`}
            ></span>
          ))}
          <span className="absolute top-0 bottom-0 w-[2px] bg-ink-900" style={{ left: pct(t) }}></span>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 font-mono text-[11px] tracking-[0.04em] uppercase text-ink-500">
          {(Array.from(new Set(script.turns.map((x) => x.who))) as Speaker[]).map((w) => (
            <span key={w} className="inline-flex items-center gap-2">
              <span className={`w-[14px] h-[8px] rounded-[2px] ${FILL[w]}`} aria-hidden="true"></span>
              {SPEAKER_LABEL[w]}
            </span>
          ))}
        </div>
      </div>

      <ol className="list-none p-0 m-0 mt-6">
        {script.turns.map((turn, i) => {
          const state = t >= turn.end ? "past" : t >= turn.start ? "now" : "next";
          const gap = gaps.get(i);
          return (
            <li
              key={i}
              className={[
                "grid grid-cols-[64px_112px_minmax(0,1fr)] gap-x-4 gap-y-1 py-3 border-b border-line-1 transition-opacity duration-(--dur-base) ease-out [@media(max-width:620px)]:grid-cols-[64px_minmax(0,1fr)]",
                state === "next" && (playing || t > 0) ? "opacity-40" : "opacity-100",
              ].join(" ")}
            >
              <span className="font-mono text-[12px] text-ink-500 tabular-nums pt-[3px]">{clock(turn.start)}</span>
              <span
                className={[
                  "font-mono text-mono-sm tracking-[0.06em] uppercase pt-[3px] [@media(max-width:620px)]:col-start-2",
                  state === "now" ? "text-accent-700" : "text-ink-500",
                ].join(" ")}
              >
                {SPEAKER_LABEL[turn.who]}
              </span>
              <span className="[@media(max-width:620px)]:col-start-2">
                <span className={turn.kind === "keypad" || turn.kind === "hold" ? "text-ink-500 italic" : "text-ink-900"}>
                  {turn.text}
                </span>
                {gap !== undefined ? (
                  <span className="ml-2 font-mono text-[11.5px] text-ink-500 whitespace-nowrap">
                    after {gap.toFixed(1)} s
                  </span>
                ) : null}
                {turn.note ? (
                  <span className="block text-small text-ink-500 leading-tight mt-1">{turn.note}</span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="grid grid-cols-2 gap-6 mt-8 [@media(max-width:560px)]:grid-cols-1">
        {both.map((b) => (
          <div key={b.id} className="border-t border-line-2 pt-3">
            <span className="block font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500">{b.label}</span>
            <span className="block font-display font-semibold text-[24px] tracking-heading mt-1 tabular-nums">
              {clock(b.seconds)}
            </span>
            <span className="block text-small text-ink-700 leading-tight mt-1">
              {b.callerTurns} caller turns, {b.retries} {b.retries === 1 ? "repeat" : "repeats"},{" "}
              {b.transfers} {b.transfers === 1 ? "transfer" : "transfers"}
              {b.holdSeconds ? `, ${Math.round(b.holdSeconds)} s on hold` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
