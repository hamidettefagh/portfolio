import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { WorkSection } from "@/components/site/WorkSection";
import { ToolsSection } from "@/components/site/ToolsSection";
import { AskSection } from "@/components/site/AskSection";
import { AboutSection } from "@/components/site/AboutSection";
import { ExperienceSection } from "@/components/site/ExperienceSection";
import { ContactSection } from "@/components/site/ContactSection";
import { Reveal } from "@/components/site/Reveal";
import { HomeCommands } from "@/components/site/HomeCommands";
import { SpecsOverlay } from "@/components/patterns/SpecsOverlay";

// Home — ui_kits/portfolio/Home.jsx
export default function Home() {
  return (
    <div>
      <SiteNav
        cmdk
        links={[
          { href: "#work", label: "Work" },
          { href: "#tools", label: "Tools" },
          { href: "#about", label: "About" },
          { href: "#experience", label: "Experience" },
          { href: "#contact", label: "Contact" },
        ]}
      />
      <div className="max-w-(--container-site) mx-auto px-(--gutter)">
        <Hero />
        <Reveal>
          <WorkSection />
        </Reveal>
        <Reveal>
          <ToolsSection />
        </Reveal>
        <Reveal>
          <AskSection />
        </Reveal>
        <Reveal>
          <AboutSection />
        </Reveal>
        <Reveal>
          <ExperienceSection />
        </Reveal>
        <Reveal>
          <ContactSection />
        </Reveal>
      </div>
      <HomeCommands />
      <SpecsOverlay />
    </div>
  );
}
