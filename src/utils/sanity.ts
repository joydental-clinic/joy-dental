import { sanityClient } from "sanity:client";
import imageUrlBuilder from "@sanity/image-url";

export const client = sanityClient;

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

export async function safeFetch<T = any>(
  query: string,
  params?: Record<string, string>
): Promise<T | null> {
  try {
    const result = await client.fetch<T>(query, params ?? {});
    return result;
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return null;
  }
}
