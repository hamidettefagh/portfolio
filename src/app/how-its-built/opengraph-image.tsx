import { ogCard } from "@/lib/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "How this site is built";

export default function Image() {
  return ogCard("How this site is built", "The site, run through its own two gates, gaps included.");
}
