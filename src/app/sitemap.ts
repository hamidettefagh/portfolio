import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://hamidettefagh.com",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://hamidettefagh.com/two-gates",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: "https://hamidettefagh.com/agent-production-readiness",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://hamidettefagh.com/agent-architecture",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://hamidettefagh.com/work/airline-super-agent",
      lastModified: new Date(),
      priority: 0.6,
    },
  ];
}
