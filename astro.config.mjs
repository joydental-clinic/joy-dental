import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sanity from "@sanity/astro";

export default defineConfig({
  output: "static",
  integrations: [
    sanity({
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || "coabe46s",
      dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
      useCdn: true,
      apiVersion: "2024-01-01",
    }),
    react(),
  ],
});
