"use client";

import { Rule } from "@/components/primitives/Rule";
import { ContactLink } from "@/components/patterns/ContactLink";

// Contact + footer — ui_kits/portfolio/ContactSection.jsx
export function ContactSection() {
  const metaCls =
    "font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500";
  return (
    <section className="pt-12 scroll-mt-[84px]" id="contact">
      <div className="mb-8">
        <Rule label="Contact" />
        <h2 className="font-display font-bold text-h2 tracking-heading leading-[1.05] mt-6 mb-0">
          Get in touch
        </h2>
      </div>
      <div className="border-b border-line-1">
        <ContactLink label="Email" value="hamid.ettefagh@gmail.com" copyable />
        <ContactLink
          label="LinkedIn"
          value="in/hamidettefagh"
          href="https://www.linkedin.com/in/hamidettefagh"
        />
      </div>
      <footer className="mt-12 pt-6 pb-8 border-t border-line-2 flex items-baseline justify-between gap-4 [@media(max-width:640px)]:flex-wrap [@media(max-width:640px)]:gap-y-[8px]">
        <span className="font-display font-semibold text-[15px]">
          Hamid Ettefagh
        </span>
        <span className={metaCls}>hamidettefagh.com</span>
        <button
          type="button"
          className={`${metaCls} bg-transparent p-0 cursor-pointer underline underline-offset-[3px] decoration-line-2 transition-colors duration-(--dur-fast) ease-out hover:text-ink-900 hover:decoration-current`}
          onClick={() => window.dispatchEvent(new Event("pf-specs-open"))}
        >
          view specs
        </button>
        <span className={metaCls}>&copy; 2026</span>
      </footer>
    </section>
  );
}
