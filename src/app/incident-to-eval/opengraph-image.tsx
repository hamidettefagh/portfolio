import { ogCard } from "@/lib/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Incident to eval, a tool by Hamid Ettefagh";

export default function Image() {
  return ogCard("Incident to eval", "Turn an agent incident into a regression test that runs on every change.");
}
