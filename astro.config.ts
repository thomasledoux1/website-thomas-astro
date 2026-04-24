import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import { remarkReadingTime } from "./src/utils/calculate-reading-time.js";
import react from "@astrojs/react";
import db from "@astrojs/db";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import algolia from "./algolia-integration";
// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [react(), db(), sitemap(), mdx(), algolia()],
  prefetch: {
    prefetchAll: true,
  },
  image: {
    responsiveStyles: true,
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Figtree",
      cssVariable: "--font-figtree",
      weights: [400, 500, 600, 700],
    },
    {
      provider: fontProviders.google(),
      name: "Sora",
      cssVariable: "--font-sora",
      weights: [600, 700, 800],
    },
  ],
  vite: {
    environments: {
      client: {
        optimizeDeps: {
          noDiscovery: true,
        },
      },
    },
    plugins: [tailwindcss()],
    // Avoid raw CJS `react-dom/client.js` in the browser (breaks `import { createRoot }`)
    // when the client dep optimizer races with injected routes (e.g. Astro Actions).
    // See: https://github.com/withastro/astro/issues/16387
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      include: [
        "@astrojs/react/client.js",
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-dom/client",
      ],
    },
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  build: {
    format: "file",
  },
  site: "https://www.thomasledoux.be",
  base: "/",
});
