import type { MetadataRoute } from "next";
import { safeFetch } from "@/sanity/client";
import { postSlugsQuery } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || "https://www.yonseijoy.com";

  const slugs: { slug: string }[] = (await safeFetch(postSlugsQuery)) || [];

  const postEntries = slugs.map((s) => ({
    url: `${baseUrl}/columns/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/columns`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...postEntries,
  ];
}
