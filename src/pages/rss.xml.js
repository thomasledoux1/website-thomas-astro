import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export const get = async () => {
  const blogs = await getCollection("blog", (blog) => blog.data.draft !== true);

  return rss({
    title: "Blog by Thomas Ledoux",
    description:
      "Blog by Thomas Ledoux. Writes about Javascript/React/Next.js/Remix/Astro. Always looking to learn about the newest frameworks and features.",
    site: import.meta.env.SITE,
    items: blogs.map((post) => ({
      link: `/blog/${post.slug}`,
      title: post.data.title,
      pubDate: post.data.date,
    })),
    customData: `<language>en-us</language>`,
    stylesheet: "/rss/styles.xsl",
  });
};
