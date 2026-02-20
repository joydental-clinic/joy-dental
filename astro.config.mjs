import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import cloudflare from "@astrojs/cloudflare";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

export default defineConfig({
  output: "server",
  adapter: cloudflare({ imageService: "compile" }),
  integrations: [
    sanity({
      projectId: env.PUBLIC_SANITY_PROJECT_ID,
      dataset: env.PUBLIC_SANITY_DATASET,
      useCdn: true,
      apiVersion: "2024-01-01",
    }),
    react(),
  ],
});
