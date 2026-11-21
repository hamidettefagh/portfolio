import { ogCard } from "@/lib/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Lab, experiments by Hamid Ettefagh";

export default function Image() {
  return ogCard("Lab", "Experiments run in the open, each with a question and a result.");
}
