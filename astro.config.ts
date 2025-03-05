import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import { remarkReadingTime } from "./src/utils/calculate-reading-time.js";
import react from "@astrojs/react";
import db from "@astrojs/db";
import sitemap from "@astrojs/sitemap";
import pagefind from "./integration";
import tailwindcss from "@tailwindcss/vite";
import expressiveCode from "astro-expressive-code";
import algolia from "./algolia-integration";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [
    react(),
    expressiveCode({
      frames: {
        showCopyToClipboardButton: true,
      },
    }),
    db(),
    sitemap(),
    mdx(),
    pagefind(),
    algolia(),
  ],
  prefetch: {
    prefetchAll: true,
  },
  experimental: {
    responsiveImages: true,
    svg: true,
  },
  vite: {
    plugins: [tailwindcss()],
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
