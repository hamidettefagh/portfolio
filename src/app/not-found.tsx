import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Button } from "@/components/primitives/Button";
import { TextLink } from "@/components/primitives/TextLink";

export const metadata: Metadata = {
  title: "Page not found | Hamid Ettefagh",
};

export default function NotFound() {
  return (
    <div>
      <SiteNav links={[{ href: "/", label: "Home" }]} />
      <article className="max-w-[880px] mx-auto pt-[calc(var(--nav-height)+var(--spacing-11))] px-(--gutter) pb-11">
        <Eyebrow dot="accent">{["404", "Page not found"]}</Eyebrow>
        <h1 className="font-display font-bold text-[clamp(40px,5.4vw,68px)] tracking-display leading-[1.02] mt-6 mb-6 text-balance">
          Nothing here
        </h1>
        <p className="text-lead leading-[1.5] text-ink-700 max-w-[52ch] m-0">
          This page does not exist. The link may be incomplete, or the page may
          have moved. Here is everything worth landing on instead.
        </p>

        <div className="mt-11 border-t border-line-1">
          <a
            className="group flex items-baseline justify-between gap-6 py-6 border-b border-line-1 no-underline text-inherit [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:items-start [@media(max-width:640px)]:gap-1"
            href="/two-gates"
          >
            <span className="font-display font-semibold text-[21px] tracking-heading flex-none transition-colors duration-(--dur-fast) ease-out group-hover:text-accent-700">
              The two gates
            </span>
            <span className="text-small text-ink-500 leading-tight flex-1 [@media(min-width:641px)]:text-right">
              How I decide what to build, and whether it is ready to run
            </span>
          </a>
          <a
            className="group flex items-baseline justify-between gap-6 py-6 border-b border-line-1 no-underline text-inherit [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:items-start [@media(max-width:640px)]:gap-1"
            href="/agent-architecture"
          >
            <span className="font-display font-semibold text-[21px] tracking-heading flex-none transition-colors duration-(--dur-fast) ease-out group-hover:text-accent-700">
              Agent, or workflow?
            </span>
            <span className="text-small text-ink-500 leading-tight flex-1 [@media(min-width:641px)]:text-right">
              Seven questions, a deterministic verdict
            </span>
          </a>
          <a
            className="group flex items-baseline justify-between gap-6 py-6 border-b border-line-1 no-underline text-inherit [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:items-start [@media(max-width:640px)]:gap-1"
            href="/agent-production-readiness"
          >
            <span className="font-display font-semibold text-[21px] tracking-heading flex-none transition-colors duration-(--dur-fast) ease-out group-hover:text-accent-700">
              Agent production readiness
            </span>
            <span className="text-small text-ink-500 leading-tight flex-1 [@media(min-width:641px)]:text-right">
              Score an agent across seven dimensions before go-live
            </span>
          </a>
        </div>

        <div className="flex items-center gap-6 mt-10 flex-wrap">
          <Button href="/" variant="secondary" arrow>
            Back to the start
          </Button>
          <TextLink href="mailto:hamid.ettefagh@gmail.com">
            Or email me
          </TextLink>
        </div>
      </article>
    </div>
  );
}
