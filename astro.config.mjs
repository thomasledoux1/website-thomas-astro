import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

import { remarkReadingTime } from './src/utils/calculate-reading-time.mjs';

import vercel from '@astrojs/vercel/edge';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    mdx(),
  ],
  output: 'server',
  adapter: vercel(),
  markdown: {
    remarkPlugins: [remarkReadingTime],
    extendDefaultPlugins: true,
  },
});
