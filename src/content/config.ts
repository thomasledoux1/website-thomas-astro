import { z, defineCollection } from 'astro:content';

const blog = defineCollection({
  schema: {
    title: z.string(),
    layout: z.string(),
    tags: z.array(z.string()),
    date: z.string(),
  },
});

export const collections = {
  blog,
};
