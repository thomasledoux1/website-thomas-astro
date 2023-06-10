import { z, defineCollection } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    date: z.string().datetime(),
    image: z.string(),
    imageAlt: z.string(),
  }),
});

export const collections = {
  blog,
};
