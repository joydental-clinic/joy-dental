import type { APIRoute } from "astro";
import { safeFetch } from "@/utils/sanity";

export const prerender = true;
import { postSlugsQuery, noticeSlugsQuery } from "@/utils/queries";

export const GET: APIRoute = async () => {
  const baseUrl = import.meta.env.SITE_URL || "https://www.yonseijoy.com";

  const [postSlugs, noticeSlugs] = await Promise.all([
    safeFetch<{ slug: string }[]>(postSlugsQuery),
    safeFetch<{ slug: string }[]>(noticeSlugsQuery),
  ]);

  const postEntries = (postSlugs || [])
    .map(
      (s) =>
        `  <url>
    <loc>${baseUrl}/columns/${s.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join("\n");

  const noticeEntries = (noticeSlugs || [])
    .map(
      (s) =>
        `  <url>
    <loc>${baseUrl}/notice/${s.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/columns</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/implant</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/ortho</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/notice</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
${postEntries}
${noticeEntries}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
