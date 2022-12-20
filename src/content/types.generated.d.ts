declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		typeof entryMap[C][keyof typeof entryMap[C]] & Render;

	type BaseCollectionConfig<S extends import('astro/zod').ZodRawShape> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<import('astro/zod').ZodObject<S>>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends import('astro/zod').ZodRawShape>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	export function getEntry<C extends keyof typeof entryMap, E extends keyof typeof entryMap[C]>(
		collection: C,
		entryKey: E
	): Promise<typeof entryMap[C][E] & Render>;
	export function getCollection<
		C extends keyof typeof entryMap,
		E extends keyof typeof entryMap[C]
	>(
		collection: C,
		filter?: (data: typeof entryMap[C][E]) => boolean
	): Promise<(typeof entryMap[C][E] & Render)[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		import('astro/zod').ZodObject<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			injectedFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"blog": {
"adding-comments-prisma-planetscale-astro-vercel-edge.mdx": {
  id: "adding-comments-prisma-planetscale-astro-vercel-edge.mdx",
  slug: "adding-comments-prisma-planetscale-astro-vercel-edge",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"adding-vercel-og-image-astro-project.mdx": {
  id: "adding-vercel-og-image-astro-project.mdx",
  slug: "adding-vercel-og-image-astro-project",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"avoid-flash-unwanted-animation-first-render-react.mdx": {
  id: "avoid-flash-unwanted-animation-first-render-react.mdx",
  slug: "avoid-flash-unwanted-animation-first-render-react",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"best-features-gatsbyconf-2021.mdx": {
  id: "best-features-gatsbyconf-2021.mdx",
  slug: "best-features-gatsbyconf-2021",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"best-features-nextjs-conf-2021.mdx": {
  id: "best-features-nextjs-conf-2021.mdx",
  slug: "best-features-nextjs-conf-2021",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"create-blog-astro-mdx.mdx": {
  id: "create-blog-astro-mdx.mdx",
  slug: "create-blog-astro-mdx",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"create-blog-notion-tailwind-nextjs.mdx": {
  id: "create-blog-notion-tailwind-nextjs.mdx",
  slug: "create-blog-notion-tailwind-nextjs",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"dark-mode-tailwind-nextjs.mdx": {
  id: "dark-mode-tailwind-nextjs.mdx",
  slug: "dark-mode-tailwind-nextjs",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"easily-integrate-google-maps-react.mdx": {
  id: "easily-integrate-google-maps-react.mdx",
  slug: "easily-integrate-google-maps-react",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"formatting-dates-javascript-without-library.mdx": {
  id: "formatting-dates-javascript-without-library.mdx",
  slug: "formatting-dates-javascript-without-library",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"highlighting-navigation-items-on-scroll.mdx": {
  id: "highlighting-navigation-items-on-scroll.mdx",
  slug: "highlighting-navigation-items-on-scroll",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"load-google-fonts-fast.mdx": {
  id: "load-google-fonts-fast.mdx",
  slug: "load-google-fonts-fast",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"migrating-portfolio-nextjs-remix.mdx": {
  id: "migrating-portfolio-nextjs-remix.mdx",
  slug: "migrating-portfolio-nextjs-remix",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"route-transition-animations-remix.mdx": {
  id: "route-transition-animations-remix.mdx",
  slug: "route-transition-animations-remix",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"ship-less-css-nextjs-purgecss.mdx": {
  id: "ship-less-css-nextjs-purgecss.mdx",
  slug: "ship-less-css-nextjs-purgecss",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"static-site-generation-nextjs.mdx": {
  id: "static-site-generation-nextjs.mdx",
  slug: "static-site-generation-nextjs",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"strava-stats-nextjs.mdx": {
  id: "strava-stats-nextjs.mdx",
  slug: "strava-stats-nextjs",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
},

	};

	type ContentConfig = typeof import("./config");
}
