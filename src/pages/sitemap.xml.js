const blogsImportResult = import.meta.glob("../content/blog/*.mdx", {
  eager: true,
});
const blogs = Object.values(blogsImportResult);
const uniqueTags = [
  ...new Set(blogs.map((blog) => blog.frontmatter.tags).flat()),
];

export const get = () => {
  return {
    body: `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.thomasledoux.be/</loc></url>
  <url><loc>https://www.thomasledoux.be/blog</loc></url>
  <url><loc>https://www.thomasledoux.be/contact</loc></url>
  <url><loc>https://www.thomasledoux.be/cv</loc></url>
  <url><loc>https://www.thomasledoux.be/personal</loc></url>
  <url><loc>https://www.thomasledoux.be/portfolio</loc></url>
    ${blogs
      .map(
        (blog) => `<url>
    <loc>https://www.thomasledoux.be${blog.url
      .replace("src/content", "")
      .replace(".mdx", "")}</loc>
  </url>`,
      )
      .join("")}
          ${uniqueTags
            .map(
              (tag) => `<url>
    <loc>https://www.thomasledoux.be/blog/tags/${tag}</loc>
  </url>`,
            )
            .join("")}
  </urlset>`,
  };
};
