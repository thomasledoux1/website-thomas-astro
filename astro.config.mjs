import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import { remarkReadingTime } from './src/utils/calculate-reading-time.mjs';
import vercel from '@astrojs/vercel/edge';
import react from '@astrojs/react';
import prefetch from '@astrojs/prefetch';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
    mdx(),
    prefetch(),
  ],
  output: 'server',
  adapter: vercel(),
  markdown: {
    remarkPlugins: [remarkReadingTime],
    extendDefaultPlugins: true,
  },
  site: 'https://www.thomasledoux.be',
});
