import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import { remarkReadingTime } from "./src/utils/calculate-reading-time.js";
import react from "@astrojs/react";
import db from "@astrojs/db";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
// import expressiveCode from "astro-expressive-code";
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
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Figtree",
        cssVariable: "--font-figtree",
        weights: ["400", "500", "600", "700"],
      },
      {
        provider: fontProviders.google(),
        name: "Bricolage Grotesque",
        cssVariable: "--font-bricolage",
        weights: ["600", "700", "800"],
      },
    ],
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
