import { z, defineCollection } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    layout: z.string(),
    tags: z.array(z.string()),
    date: z.string(),
    imageAlt: z.string(),
    image: z.string(),
  }),
});

export const collections = {
  blog,
};
