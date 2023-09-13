import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { remarkReadingTime } from "./src/utils/calculate-reading-time.js";
import react from "@astrojs/react";
import prefetch from "@astrojs/prefetch";
import AutoImport from "astro-auto-import";
import {
  astroCodeSnippets,
  codeSnippetAutoImport,
} from "./integrations/astro-code-snippets";
import partytown from "@astrojs/partytown";

import netlify from "@astrojs/netlify/functions";

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
    prefetch(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    mdx(),
  ],
  vite: {
    define: {
      "process.env.NODE_ENV": `'${process.env.NODE_ENV}'`,
    },
  },
  output: "hybrid",
  adapter: netlify(),
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  site: "https://www.thomasledoux.be",
});
