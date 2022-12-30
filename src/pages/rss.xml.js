import rss from '@astrojs/rss';
const postImportResult = import.meta.glob('./blog/*.mdx', { eager: true });
const posts = Object.values(postImportResult);

export const get = () =>
  rss({
    title: 'Blog by Thomas Ledoux',
    description:
      'Blog by Thomas Ledoux. Writes about Javascript/React/Next.js/Remix/Astro. Always looking to learn about the newest frameworks and features.',
    site: import.meta.env.SITE,
    items: posts.map(post => ({
      link: post.url,
      title: post.frontmatter.title,
      pubDate: post.frontmatter.date,
    })),
    customData: `<language>en-us</language>`,
    stylesheet: '/rss/styles.xsl',
  });
