import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel/serverless";
import { remarkReadingTime } from "./src/utils/calculate-reading-time.js";
import react from "@astrojs/react";
import AutoImport from "astro-auto-import";
import {
  astroCodeSnippets,
  codeSnippetAutoImport,
} from "./integrations/astro-code-snippets";
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    AutoImport({
      imports: [codeSnippetAutoImport],
    }),
    astroCodeSnippets(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    mdx(),
  ],
  adapter: vercel({
    speedInsights: { enabled: true },
  }),
  vite: {
    define: {
      "process.env.NODE_ENV": `'${process.env.NODE_ENV}'`,
    },
  },
  prefetch: {
    prefetchAll: true,
  },
  output: "hybrid",
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  site: "https://www.thomasledoux.be",
});
