import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import { remarkReadingTime } from "./src/utils/calculate-reading-time.js";
import react from "@astrojs/react";
import db from "@astrojs/db";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    expressiveCode({
      frames: {
        showCopyToClipboardButton: true,
      },
    }),
    mdx(),
    db(),
    sitemap(),
    pagefind(),
  ],
  prefetch: {
    prefetchAll: true,
  },
  adapter: vercel(),
  experimental: {
    responsiveImages: true,
    svg: true,
  },
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  site: "https://www.thomasledoux.be",
});
