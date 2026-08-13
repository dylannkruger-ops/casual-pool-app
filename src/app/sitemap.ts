import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getAllSlugs } from "@/lib/data/items";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.siteUrl;
  const staticRoutes = ["", "/pricing", "/licence", "/terms", "/privacy"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date("2026-07-09"),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.6,
    }),
  );

  const slugs = await getAllSlugs();
  const itemRoutes = slugs.map((slug) => ({
    url: `${base}/l/${slug}`,
    lastModified: new Date("2026-07-09"),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...itemRoutes];
}
