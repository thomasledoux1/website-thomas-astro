import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { remarkReadingTime } from "./src/utils/calculate-reading-time.js";
import {netlifyFunctions} from "@astrojs/netlify";
import react from "@astrojs/react";
import prefetch from "@astrojs/prefetch";
import AutoImport from "astro-auto-import";
import { astroCodeSnippets, codeSnippetAutoImport } from "./integrations/astro-code-snippets";
import partytown from "@astrojs/partytown";


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({
    applyBaseStyles: false
  }), react(), AutoImport({
    imports: [codeSnippetAutoImport]
  }), astroCodeSnippets(), prefetch(), partytown({
    config: {
      forward: ["dataLayer.push"]
    }
  }), mdx()],
  vite: {
    define: {
      "process.env.NODE_ENV": `'${process.env.NODE_ENV}'`
    }
  },
  output: "hybrid",
  adapter: netlifyFunctions(),
  markdown: {
    remarkPlugins: [remarkReadingTime]
  },
  experimental: {
    viewTransitions: true
  },
  site: "https://www.thomasledoux.be"
});