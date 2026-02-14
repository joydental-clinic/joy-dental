import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}

// Safe fetch wrapper that returns null on error (for builds without Sanity configured)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function safeFetch<T = any>(query: string, params?: Record<string, string>): Promise<T | null> {
  if (projectId === "placeholder") return null;
  try {
    const result = await client.fetch<T>(query, params ?? {}, { next: { revalidate: 60 } });
    return result;
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return null;
  }
}
