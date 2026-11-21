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
import { GateIntro } from "@/components/site/GateIntro";
import { PAGE_GATE, PAGE_SIGNALS } from "@/lib/page-gate";

// Decides, before first paint, whether this visit gets the intro: first visit,
// landing at the top of the home page, and motion allowed. It also lets any
// key, tap, or scroll end the intro at once, even before the page hydrates.
// Kept inline and tiny because it has to run before anything is drawn.
const INTRO_SCRIPT = `(function(){try{var d=document.documentElement,k="pf-intro-v1";if(location.pathname!=="/"||location.hash)return;if(localStorage.getItem(k))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;localStorage.setItem(k,"1");d.dataset.intro="play";var ev=["pointerdown","keydown","wheel","touchstart"];var done=function(){ev.forEach(function(e){removeEventListener(e,done,true)});if(d.dataset.intro==="play")d.dataset.intro="done"};ev.forEach(function(e){addEventListener(e,done,{capture:true,passive:true})})}catch(e){}})();`;

// Home — ui_kits/portfolio/Home.jsx
export default function Home() {
  return (
    <div>
      <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      <GateIntro
        signals={PAGE_SIGNALS}
        stages={PAGE_GATE.stages}
        verdict={PAGE_GATE.verdict}
      />
      <SiteNav
        cmdk
        links={[
          { href: "#work", label: "Work" },
          { href: "#tools", label: "Tools" },
          { href: "/two-gates", label: "Two gates" },
          { href: "#about", label: "About" },
          { href: "#experience", label: "Experience" },
          { href: "#contact", label: "Contact" },
          { href: "/lab", label: "Lab" },
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
