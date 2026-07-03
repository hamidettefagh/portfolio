import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://hamidettefagh.com",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://hamidettefagh.com/work/airline-super-agent",
      lastModified: new Date(),
      priority: 0.6,
    },
  ];
}
