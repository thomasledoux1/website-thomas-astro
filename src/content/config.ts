import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/data/blog" }),
  schema: () =>
    z.object({
      title: z.string(),
      tags: z.array(z.string()),
      date: z.string().datetime(),
      draft: z.boolean().optional(),
    }),
});

export const collections = {
  blog,
};
