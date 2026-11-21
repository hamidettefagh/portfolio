"use client";

import { useEffect, useState } from "react";
import { EVIDENCE, type EvidenceKind } from "./Receipts";

// The switch for receipts mode and the legend that appears while it is on.
// State lives on <html data-receipts="on">, set before first paint by the
// inline script in the root layout, and in localStorage so it follows the
// visitor from page to page. Every toggle on the page stays in sync through
// one event.

const KEY = "pf-receipts";
const EVENT = "pf-receipts-change";

export function setReceipts(on: boolean) {
  const d = document.documentElement;
  if (on) d.dataset.receipts = "on";
  else delete d.dataset.receipts;
  try {
    if (on) localStorage.setItem(KEY, "on");
    else localStorage.removeItem(KEY);
  } catch {
    // Storage can be blocked; the mode still works for this page view.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useReceipts(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const sync = () => setOn(document.documentElement.dataset.receipts === "on");
    // The inline script only sees full page loads. A link followed inside the
    // site (a soft navigation) lands here instead, so read the switch again.
    const q = new URLSearchParams(window.location.search).get("receipts");
    if (q === "on" || q === "1") setReceipts(true);
    else if (q === "off" || q === "0") setReceipts(false);
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  return on;
}

export function ReceiptsToggle({ className = "" }: { className?: string }) {
  const on = useReceipts();
  return (
    <button
      type="button"
      aria-pressed={on}
      title="Show what kind of evidence each number is"
      onClick={() => setReceipts(!on)}
      className={[
        "font-mono text-[11px] tracking-[0.05em] bg-transparent cursor-pointer border rounded-sm px-[9px] py-[5px] leading-none transition-[border-color,color,background-color] duration-(--dur-fast) ease-out",
        on
          ? "border-accent-500 text-accent-700 bg-accent-050"
          : "border-line-1 text-ink-700 hover:border-line-2 hover:text-ink-900",
        className,
      ].join(" ")}
    >
      Receipts
    </button>
  );
}

const LEGEND: EvidenceKind[] = ["production", "testing", "projection", "count", "computed", "illustrative"];

export function ReceiptsBar() {
  return (
    <div className="receipts-bar" role="region" aria-label="Receipts legend">
      <span className="receipts-bar-title">Receipts on</span>
      <span className="receipts-bar-items">
        {LEGEND.map((k) => (
          <span key={k} className="rcpt-tag" data-kind={k} title={EVIDENCE[k].note}>
            {EVIDENCE[k].label}
          </span>
        ))}
      </span>
      <button type="button" className="receipts-bar-off" onClick={() => setReceipts(false)}>
        Turn off
      </button>
    </div>
  );
}
