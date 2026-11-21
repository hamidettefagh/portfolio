"use client";

import { useState } from "react";
import { RadarChart } from "@/components/patterns/RadarChart";

export type ReadinessProfile = { label: string; values: number[] };

// The ship gate, answering on the home page. Three illustrative agents at
// different stages; picking one redraws the radar and its score with the same
// scoring the diagnostic uses. They are archetypes, not real engagements, so
// they stay at the level of the seven axes and do not link into the checklist.
export function ReadinessProfiles({
  profiles,
  initial = 0,
  children,
  actions,
}: {
  profiles: ReadinessProfile[];
  initial?: number;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const [active, setActive] = useState(initial);
  const current = profiles[active] ?? profiles[0];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 items-center [@media(max-width:860px)]:grid-cols-1 [@media(max-width:860px)]:gap-7">
      <div className="mx-auto w-full max-w-[440px]">
        <RadarChart values={current.values} animate />
      </div>
      <div>
        {children}
        <div
          className="flex flex-wrap items-center gap-2 mt-6"
          role="group"
          aria-label="Example readiness profiles"
        >
          <span className="font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500 mr-2">
            Example profiles
          </span>
          {profiles.map((p, i) => {
            const on = i === active;
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(i)}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setActive(i);
                }}
                className={[
                  "choice-chip text-[14px] leading-none rounded-pill border px-[13px] py-[8px] cursor-pointer",
                  on
                    ? "border-accent-500 text-accent-700 bg-accent-050"
                    : "border-line-2 text-ink-700 bg-transparent hover:border-ink-500 hover:text-ink-900",
                ].join(" ")}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        {actions}
      </div>
    </div>
  );
}
