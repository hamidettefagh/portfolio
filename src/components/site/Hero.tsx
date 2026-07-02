import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Accent } from "@/components/primitives/Accent";
import { Button } from "@/components/primitives/Button";
import { Ticker } from "@/components/patterns/Ticker";

// Hero — ui_kits/portfolio/Hero.jsx
export function Hero() {
  // "Updated {Month Year}" is rendered at build time per the handoff README.
  const updated = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  return (
    <header className="relative pt-[calc(var(--nav-height)+var(--spacing-12))] pb-10">
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(1100px_560px_at_88%_-20%,var(--color-surface-wash),transparent_70%)]"
        aria-hidden="true"
      ></div>
      <div className="relative">
        <Eyebrow dot="accent">{["Portfolio, 2026", "Los Angeles"]}</Eyebrow>
        <h1 className="font-display font-bold text-hero tracking-display leading-display mt-6 mb-0 text-ink-900 text-balance">
          Agents that
          <br />
          actually <Accent underline>ship</Accent>
        </h1>
        <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 mt-9 items-start [@media(max-width:860px)]:grid-cols-1 [@media(max-width:860px)]:gap-7">
          <p className="text-lead leading-[1.5] tracking-body text-ink-900 m-0 max-w-(--measure-lead)">
            I design, build, and ship production agent systems for the
            enterprise.
            <span className="block mt-[14px] text-small text-ink-500 leading-tight">
              Senior Forward Deployed Engineer at Salesforce.
            </span>
          </p>
          <p className="font-serif italic text-[19px] font-[450] leading-[1.55] text-ink-700 border-l-2 border-accent-500 pl-6 m-0">
            Demos are easy. Production is the job. The gap between a promising
            agent and a dependable one is where I work.
          </p>
        </div>
        <div className="flex gap-[14px] mt-9">
          <Button href="#work" arrow>
            View selected work
          </Button>
          <Button href="#contact" variant="secondary">
            Get in touch
          </Button>
        </div>
        <div className="mt-11">
          <Ticker
            items={[
              "Shipping enterprise agent platforms",
              "Advising on AI trust and governance",
              `Updated ${updated}`,
            ]}
          />
        </div>
      </div>
    </header>
  );
}
