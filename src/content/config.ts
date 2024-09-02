import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/data/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tags: z.array(z.string()),
      date: z.string().datetime(),
      image: image(),
      imageAlt: z.string(),
      draft: z.boolean().optional(),
      containImage: z.boolean().optional(),
    }),
});

export const collections = {
  blog,
};
