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

const pokemon = defineCollection({
  loader: async () => {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=100",
    ).catch(() => {
      throw new Error();
    });
    const json = await response.json().catch(() => {
      throw new Error();
    });

    return (
      json.results as Array<{
        name: string;
      }>
    ).map((pokemon) => ({
      id: pokemon.name,
      ...pokemon,
    }));
  },
});

export const collections = {
  blog,
  pokemon,
};
