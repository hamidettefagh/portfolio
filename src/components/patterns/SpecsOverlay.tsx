"use client";

import { useEffect, useState } from "react";

// "View specs" overlay — components/patterns/SpecsOverlay.jsx
// Reads the design tokens from the page at runtime. Token names follow the
// production Tailwind theme (globals.css).
const COLOR_TOKENS = [
  "--color-paper-0",
  "--color-paper-1",
  "--color-paper-2",
  "--color-line-1",
  "--color-line-2",
  "--color-ink-300",
  "--color-ink-500",
  "--color-ink-700",
  "--color-ink-900",
  "--color-accent-050",
  "--color-accent-100",
  "--color-accent-500",
  "--color-accent-600",
  "--color-accent-700",
  "--color-live",
];
const TYPE_TOKENS: {
  name: string;
  sample: string;
  px: number;
  weight?: number;
  tight?: boolean;
  mono?: boolean;
}[] = [
  { name: "--text-hero", sample: "Agents that ship", px: 40, weight: 700, tight: true },
  { name: "--text-h2", sample: "Selected work", px: 30, weight: 700, tight: true },
  { name: "--text-h3", sample: "Multi-agent customer operations", px: 24, weight: 600, tight: true },
  { name: "--text-lead", sample: "Production agent systems for the enterprise", px: 20, weight: 400 },
  { name: "--text-body", sample: "Demos are easy. Production is the job.", px: 17, weight: 400 },
  { name: "--text-small", sample: "Captions and footnotes", px: 15, weight: 400 },
  { name: "--text-mono", sample: "META LABELS AND TICKERS", px: 13, mono: true },
];
const SPACE_TOKENS = Array.from({ length: 13 }, (_, i) => `--spacing-${i + 1}`);
const MISC_TOKENS = [
  "--font-display",
  "--font-serif",
  "--font-mono",
  "--container-site",
  "--gutter",
  "--radius-sm",
  "--radius-md",
  "--radius-pill",
  "--ease-out",
  "--dur-fast",
  "--dur-base",
  "--dur-slow",
];

export function SpecsOverlay({
  openEventName = "pf-specs-open",
}: {
  openEventName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [tokens, setTokens] = useState<Record<string, string>>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        t &&
        (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "." && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(openEventName, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(openEventName, onOpen);
    };
  }, [openEventName]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const cs = getComputedStyle(document.documentElement);
    const all: Record<string, string> = {};
    [...COLOR_TOKENS, ...SPACE_TOKENS, ...MISC_TOKENS, ...TYPE_TOKENS.map((t) => t.name)].forEach(
      (n) => {
        all[n] = cs.getPropertyValue(n).trim();
      },
    );
    setTokens(all);
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const rowCls =
    "grid grid-cols-[190px_1fr_minmax(200px,auto)] gap-5 items-center py-[10px] border-b border-line-1 [@media(max-width:720px)]:grid-cols-[130px_1fr]";
  const nameCls = "font-mono text-[11.5px] tracking-[0.04em] text-ink-700";
  const valueCls =
    "font-mono text-[11px] tracking-[0.03em] text-ink-300 justify-self-end text-right [@media(max-width:720px)]:hidden";
  const sectionCls =
    "font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500 mt-[40px] mb-[6px]";

  return (
    <div
      className="fixed inset-0 z-[100] bg-paper-0 overflow-y-auto"
      role="dialog"
      aria-label="Design specs"
    >
      <div className="max-w-[1160px] mx-auto pt-7 px-(--gutter) pb-[80px]">
        <div className="flex items-center justify-between gap-4 pb-[18px] border-b border-line-2 mb-2">
          <span className="font-mono text-mono tracking-mono uppercase text-accent-600">
            Specs &middot; living tokens, read from this page at runtime
          </span>
          <button
            type="button"
            className="font-mono text-[11px] tracking-[0.05em] text-ink-500 bg-transparent cursor-pointer border border-line-1 rounded-sm px-[9px] py-[5px] transition-[border-color,color] duration-(--dur-fast) ease-out hover:border-line-2 hover:text-ink-900"
            onClick={() => setOpen(false)}
          >
            esc
          </button>
        </div>

        <div className={sectionCls}>Type</div>
        {TYPE_TOKENS.map((t) => (
          <div key={t.name} className={rowCls}>
            <span className={nameCls}>{t.name}</span>
            <span
              style={{
                fontFamily: t.mono ? "var(--font-mono)" : "var(--font-display)",
                fontSize: `${t.px}px`,
                fontWeight: t.weight || 400,
                letterSpacing: t.tight
                  ? "var(--tracking-heading)"
                  : t.mono
                    ? "var(--tracking-mono)"
                    : "var(--tracking-body)",
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {t.sample}
            </span>
            <span className={valueCls}>{tokens[t.name]}</span>
          </div>
        ))}

        <div className={sectionCls}>Color</div>
        {COLOR_TOKENS.map((n) => (
          <div key={n} className={rowCls}>
            <span className={nameCls}>{n}</span>
            <span
              className="w-[44px] h-[22px] rounded-[4px] border border-line-1"
              style={{ background: `var(${n})` }}
            ></span>
            <span className={valueCls}>{tokens[n]}</span>
          </div>
        ))}

        <div className={sectionCls}>Spacing</div>
        {SPACE_TOKENS.map((n) => (
          <div key={n} className={rowCls}>
            <span className={nameCls}>{n}</span>
            <span
              className="h-[12px] bg-accent-100 border-l-2 border-accent-500"
              style={{ width: tokens[n] }}
            ></span>
            <span className={valueCls}>{tokens[n]}</span>
          </div>
        ))}

        <div className={sectionCls}>Face, layout, motion</div>
        {MISC_TOKENS.map((n) => (
          <div key={n} className={rowCls}>
            <span className={nameCls}>{n}</span>
            <span className="font-mono text-[11.5px] text-ink-700 overflow-hidden text-ellipsis whitespace-nowrap">
              {tokens[n]}
            </span>
            <span className={valueCls}></span>
          </div>
        ))}
      </div>
    </div>
  );
}
