"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Fixed site nav — ui_kits/portfolio/SiteNav.jsx
export function SiteNav({
  mark = "hamidettefagh.com",
  links = [],
  cmdk = false,
}: {
  mark?: string;
  links?: { href: string; label: string }[];
  cmdk?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls =
    "text-[15px] text-ink-700 no-underline transition-colors duration-(--dur-fast) ease-out hover:text-ink-900 [@media(max-width:640px)]:text-[14px]";

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50 h-(--nav-height) flex items-center justify-between px-(--gutter)",
        // The wordmark and four links cannot share one row on phones; stack them
        "[@media(max-width:640px)]:h-auto [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:items-start [@media(max-width:640px)]:gap-[6px] [@media(max-width:640px)]:py-[10px]",
        "border-b transition-[background-color,border-color] duration-(--dur-base) ease-out",
        scrolled
          ? "bg-[color-mix(in_srgb,var(--color-paper-0)_82%,transparent)] backdrop-blur-[12px] border-line-1"
          : "bg-transparent border-transparent",
      ].join(" ")}
    >
      <Link
        className="font-mono text-[14px] tracking-[0.02em] text-ink-900 no-underline font-medium"
        href="/"
      >
        {mark}
      </Link>
      <div className="flex gap-[28px] items-center [@media(max-width:640px)]:gap-[18px]">
        {links.map((l) =>
          l.href.startsWith("#") ? (
            <a key={l.href} className={linkCls} href={l.href}>
              {l.label}
            </a>
          ) : (
            <Link key={l.href} className={linkCls} href={l.href}>
              {l.label}
            </Link>
          ),
        )}
        {cmdk ? (
          <button
            type="button"
            className="font-mono text-[11px] tracking-[0.05em] text-ink-500 bg-transparent cursor-pointer border border-line-1 rounded-sm px-[9px] py-[5px] leading-none transition-[border-color,color] duration-(--dur-fast) ease-out hover:border-line-2 hover:text-ink-900 [@media(max-width:720px)]:hidden"
            title="Command menu"
            onClick={() => window.dispatchEvent(new Event("pf-cmdk-open"))}
          >
            &#8984;K
          </button>
        ) : null}
      </div>
    </nav>
  );
}
