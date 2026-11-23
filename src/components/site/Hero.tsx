import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Accent } from "@/components/primitives/Accent";
import { Button } from "@/components/primitives/Button";
import { Ticker } from "@/components/patterns/Ticker";
import { LocalTime } from "@/components/patterns/LocalTime";
import { GateDock } from "@/components/site/GateDock";

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
        {/* The dock sits beside the eyebrow from 1100px up and under it below
            that, by rule. The row used to wrap wherever the two happened to
            fit, and that depended on the hour (the time is one or two digits
            wide) and on which fonts had arrived, so in a few window widths
            the dock jumped a row, and the headline with it, as the page
            loaded. 1100px is the first round width where the widest case fits. */}
        <div className="flex flex-col items-start gap-x-10 gap-y-5 [@media(min-width:1100px)]:flex-row [@media(min-width:1100px)]:items-center [@media(min-width:1100px)]:justify-between">
          <Eyebrow dot="accent">
            {[
              "Portfolio, 2026",
              <span key="place">
                Los Angeles
                <LocalTime />
              </span>,
            ]}
          </Eyebrow>
          <GateDock />
        </div>
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
              Distinguished Forward Deployed Engineer at Salesforce.
            </span>
          </p>
          <p className="font-serif italic text-[19px] font-[450] leading-[1.55] text-ink-700 border-l-2 border-accent-500 pl-6 m-0">
            Demos are easy. Production is the job. The gap between a promising
            agent and a dependable one is where I work.
          </p>
        </div>
        <div className="flex flex-wrap gap-[14px] mt-9">
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
