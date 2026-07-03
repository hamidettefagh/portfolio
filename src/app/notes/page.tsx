import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/SiteNav";
import { Eyebrow } from "@/components/primitives/Eyebrow";

export const metadata: Metadata = {
  title: "Notes | Hamid Ettefagh",
  description:
    "Interactive pieces and working notes on building agents that hold up in production.",
};

const NOTES = [
  {
    href: "/notes/agent-production-readiness",
    title: "Agent production readiness",
    summary:
      "Score an agent across seven dimensions and see its shape. A radar diagnostic for telling a demo from a production system.",
  },
];

export default function Notes() {
  return (
    <div>
      <SiteNav links={[{ href: "/", label: "Home" }]} />
      <div className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <Eyebrow dot="accent">{["Notes"]}</Eyebrow>
        <h1 className="font-display font-bold text-[clamp(40px,5.4vw,68px)] tracking-display leading-[1.02] mt-6 mb-6 text-balance">
          Notes
        </h1>
        <p className="text-lead leading-[1.5] text-ink-700 max-w-[52ch] m-0 mb-9">
          Interactive pieces and working notes on building agents that hold up
          in production.
        </p>
        <div className="border-t border-line-1">
          {NOTES.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="group grid grid-cols-[1fr_28px] gap-6 items-baseline py-7 border-b border-line-1 no-underline text-inherit"
            >
              <span>
                <h2 className="font-display font-semibold text-[24px] tracking-heading leading-heading m-0 transition-colors duration-(--dur-fast) ease-out group-hover:text-accent-700">
                  {n.title}
                </h2>
                <p className="mt-2 mb-0 text-small text-ink-700 leading-tight max-w-[56ch]">
                  {n.summary}
                </p>
              </span>
              <span
                className="text-[18px] text-ink-300 self-center justify-self-end [transition:transform_var(--dur-base)_var(--ease-out),color_var(--dur-fast)_var(--ease-out)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:text-accent-700"
                aria-hidden="true"
              >
                &#8599;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
