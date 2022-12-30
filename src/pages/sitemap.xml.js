const pagesImportResult = import.meta.glob('./blog/*.mdx', { eager: true });
const pages = Object.values(pagesImportResult);

export const get = () => {
  console.log(pages);
  return {
    body: `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.thomasledoux.be/</loc></url>
  <url><loc>https://www.thomasledoux.be/blog</loc></url>
  <url><loc>https://www.thomasledoux.be/contact</loc></url>
  <url><loc>https://www.thomasledoux.be/cv</loc></url>
  <url><loc>https://www.thomasledoux.be/personal</loc></url>
  <url><loc>https://www.thomasledoux.be/portfolio</loc></url>
    ${pages
      .map(
        page => `<url>
    <loc>https://www.thomasledoux.be${page.url}</loc>
  </url>`
      )
      .join('')}
  </urlset>`,
  };
};
