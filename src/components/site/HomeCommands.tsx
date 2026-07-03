"use client";

import { CommandMenu, type Command } from "@/components/patterns/CommandMenu";

// Command menu wiring for the home page — ui_kits/portfolio/Home.jsx
const EMAIL = "hamid.ettefagh@gmail.com";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const COMMANDS: Command[] = [
  { label: "Go to work", hint: "01", action: () => scrollToId("work") },
  {
    label: "Ask my agent",
    hint: "AI",
    action: () => {
      scrollToId("ask");
      setTimeout(() => window.dispatchEvent(new Event("pf-ask-focus")), 450);
    },
  },
  { label: "Go to about", hint: "02", action: () => scrollToId("about") },
  {
    label: "Go to experience",
    hint: "03",
    action: () => scrollToId("experience"),
  },
  { label: "Go to contact", hint: "04", action: () => scrollToId("contact") },
  {
    label: "Copy email",
    hint: "@",
    action: () => {
      try {
        navigator.clipboard.writeText(EMAIL);
      } catch {
        // noop
      }
    },
    confirm: `Copied ${EMAIL}`,
  },
  {
    label: "View specs",
    hint: ".",
    action: () => window.dispatchEvent(new Event("pf-specs-open")),
  },
  {
    label: "Open LinkedIn",
    hint: "↗",
    action: () =>
      window.open("https://www.linkedin.com/in/hamidettefagh", "_blank"),
  },
  {
    label: "Open GitHub",
    hint: "↗",
    action: () => window.open("https://github.com/hamidettefagh", "_blank"),
  },
];

export function HomeCommands() {
  return <CommandMenu items={COMMANDS} />;
}
