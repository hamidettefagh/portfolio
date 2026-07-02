import { Rule } from "@/components/primitives/Rule";
import { AskAgent } from "@/components/patterns/AskAgent";

// Ask my agent — ui_kits/portfolio/AskSection.jsx
export function AskSection() {
  return (
    <section className="pt-12 scroll-mt-[84px]" id="ask">
      <div className="mb-8">
        <Rule label="Ask" />
        <h2 className="font-display font-bold text-h2 tracking-heading leading-[1.05] mt-6 mb-0">
          Do not take my word for it.
          <br />
          Ask my agent
        </h2>
      </div>
      <AskAgent />
    </section>
  );
}
