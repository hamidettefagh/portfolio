"use client";

import { useState } from "react";

// One line of code or a URL, with a button that copies it.
export function CopyLine({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-stretch w-full min-w-0 border border-line-2 rounded-sm bg-paper-1 overflow-hidden">
      <code
        tabIndex={0}
        aria-label={text}
        className="flex-1 min-w-0 font-mono text-[13px] leading-[1.5] text-ink-900 px-4 py-3 overflow-x-auto whitespace-nowrap">
        {text}
      </code>
      <button
        type="button"
        aria-label={label ? `Copy ${label}` : "Copy"}
        onClick={() =>
          navigator.clipboard
            ?.writeText(text)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            })
            .catch(() => {})
        }
        className="flex-none font-mono text-mono-sm tracking-[0.05em] uppercase text-ink-700 bg-transparent cursor-pointer border-0 border-l border-line-2 px-4 transition-colors duration-(--dur-fast) ease-out hover:text-ink-900"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
