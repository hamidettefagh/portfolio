import type { MetadataRoute } from "next";

const BASE = "https://hamidettefagh.com";

// Template pages (the bake-off and the call replay) stay out until they hold
// real results; they are marked noindex as well.
const PAGES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/two-gates", priority: 0.8 },
  { path: "/lab", priority: 0.8 },
  { path: "/agent-production-readiness", priority: 0.7 },
  { path: "/agent-architecture", priority: 0.7 },
  { path: "/incident-to-eval", priority: 0.7 },
  { path: "/lab/site-agent-evals", priority: 0.6 },
  { path: "/lab/mcp", priority: 0.6 },
  { path: "/lab/voice-latency", priority: 0.6 },
  { path: "/how-its-built", priority: 0.5 },
  { path: "/work/airline-super-agent", priority: 0.6 },
  { path: "/work/dining-platform-agents", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${BASE}${p.path}`,
    lastModified: new Date(),
    priority: p.priority,
  }));
}
