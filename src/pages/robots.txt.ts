import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = () => {
  const baseUrl = import.meta.env.SITE_URL || "https://www.yonseijoy.com";

  const body = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
};
