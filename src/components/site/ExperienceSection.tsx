import { Rule } from "@/components/primitives/Rule";
import { ExperienceItem } from "@/components/patterns/ExperienceItem";

// Experience: a plain list, newest first, one row per title held.
export function ExperienceSection() {
  return (
    <section className="pt-12 scroll-mt-[84px]" id="experience">
      <div className="mb-8">
        <Rule label="Experience" />
        <h2 className="font-display font-bold text-h2 tracking-heading leading-[1.05] mt-6 mb-0">
          Where the work happens
        </h2>
      </div>
      <div className="border-b border-line-1">
        <ExperienceItem
          dates="Nov 2026 - Now"
          role="Distinguished Forward Deployed Engineer"
          org="Salesforce"
          note="Director level, on a specialist team for the most complex agent builds."
        />
        <ExperienceItem
          dates="2025 - 2026"
          role="Senior Forward Deployed Engineer, AI"
          org="Salesforce"
          note="Production agent deployments and technical advisory for strategic enterprise accounts."
        />
        <ExperienceItem
          dates="2022 - 2025"
          role="Senior Technical Architect, Strategic Accounts"
          org="Salesforce"
          note="Architecture and delivery leadership across consumer technology, telecom, and travel programs, leading teams of 25+ engineers."
        />
        <ExperienceItem
          dates="Earlier"
          role="Enterprise delivery roles"
          org="Accenture, Deloitte, and Cognizant"
        />
      </div>
      <div className="mt-8">
        <Rule label="Credentials" />
        <p className="text-small leading-tight text-ink-700 mt-5 mb-0 max-w-[70ch]">
          Claude Certified Architect, Anthropic &middot; 17 Salesforce
          certifications &middot; Professional certificate, MIT xPRO
        </p>
      </div>
    </section>
  );
}
