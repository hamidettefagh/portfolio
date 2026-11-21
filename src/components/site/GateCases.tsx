"use client";

import Link from "next/link";
import { useState } from "react";
import { MiniFlow } from "@/components/patterns/MiniFlow";

export type GateCase = {
  label: string;
  verdict: string;
  stages: { label: string; accent?: boolean }[];
  href: string;
};

// The design gate, answering on the home page. Each case was run through the
// real engine when the site was built, so the diagram and the verdict here are
// its actual output, and each one links to the tool with those answers filled
// in. The swap is instant on purpose: it is a result changing, not a
// transition, and a visitor may sweep across all five in a second.
export function GateCases({ cases, initial = 0 }: { cases: GateCase[]; initial?: number }) {
  const [active, setActive] = useState(initial);
  const current = cases[active] ?? cases[0];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Example use cases">
        <span className="font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500 mr-2">
          Try a case
        </span>
        {cases.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={c.label}
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
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 min-h-[38px] [@media(max-width:640px)]:min-h-[84px]">
        <MiniFlow stages={current.stages} wrap className="text-[15px]" />
      </div>

      <p className="mt-4 mb-0 flex flex-wrap items-baseline gap-x-4 gap-y-1" aria-live="polite">
        <span className="font-display font-semibold text-[19px] tracking-heading text-ink-900">
          {current.verdict}
        </span>
        <Link
          href={current.href}
          className="text-small text-ink-700 underline decoration-line-2 decoration-1 underline-offset-[3px] transition-[color,text-decoration-color] duration-(--dur-fast) ease-out hover:text-accent-700 hover:decoration-current"
        >
          See why
        </Link>
      </p>
    </div>
  );
}
