"use client";

import { useState } from "react";

// Large contact row — components/patterns/ContactLink.jsx
export function ContactLink({
  label,
  value,
  href,
  copyable = false,
}: {
  label: string;
  value: string;
  href?: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!copyable) return;
    e.preventDefault();
    try {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // fall through to href (mailto fallback)
    }
  };
  const external = href ? href.startsWith("http") : false;
  return (
    <a
      className="group flex items-baseline justify-between gap-6 py-[26px] border-t border-line-1 no-underline text-inherit cursor-pointer"
      href={copyable ? (href ?? `mailto:${value}`) : href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span className="font-mono text-mono tracking-mono uppercase text-ink-500 flex-none w-[120px]">
        {label}
      </span>
      <span className="font-display font-semibold text-[clamp(20px,2.4vw,30px)] tracking-heading flex-1 transition-colors duration-(--dur-fast) ease-out group-hover:text-accent-700">
        {value}
      </span>
      <span className="font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-300 flex-none transition-colors duration-(--dur-fast) ease-out group-hover:text-accent-600">
        {copyable ? (copied ? "Copied" : "Click to copy") : "↗"}
      </span>
    </a>
  );
}
