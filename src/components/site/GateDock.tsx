import Link from "next/link";
import { MiniFlow } from "@/components/patterns/MiniFlow";
import { PAGE_GATE } from "@/lib/page-gate";

// The verdict the design gate returned for this page, resting in the hero.
// On a first visit the intro draws it and hands it off to this spot; after
// that it simply sits here. It links to the tool with this page's own answers
// filled in, so the claim can be checked.
export function GateDock() {
  return (
    <Link
      href={PAGE_GATE.href}
      data-gate-dock
      aria-label={`The design gate, run on this page. Verdict: ${PAGE_GATE.verdict}. See the reasoning.`}
      className="group inline-flex flex-wrap items-center gap-x-4 gap-y-[10px] no-underline"
    >
      <span className="font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500 transition-colors duration-(--dur-fast) ease-out group-hover:text-ink-900">
        Design gate, run on this page
      </span>
      <span className="inline-flex items-center gap-[10px]" aria-hidden="true">
        <span data-gate-flow className="text-[clamp(11px,3.3vw,13px)]">
          <MiniFlow stages={PAGE_GATE.stages} />
        </span>
        <span className="gate-dock-arrow text-ink-300 text-[15px] leading-none inline-block">
          &rarr;
        </span>
      </span>
    </Link>
  );
}
