export const prerender = false;

import type { APIRoute } from "astro";
import {
  db,
  and,
  desc,
  gte,
  like,
  lte,
  sql,
  count,
  countDistinct,
} from "astro:db";
import { PageView } from "astro:db";

export const GET: APIRoute = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const dateRange = searchParams.get("date-range") ?? "all-time";
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  let dateGreaterThan: Date | undefined;
  const dateLessThan = new Date(Date.now());
  switch (dateRange) {
    case "past-day":
      dateGreaterThan = new Date(Date.now() - 24 * 60 * 60 * 1000);
      break;
    case "past-week":
      dateGreaterThan = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "past-month":
      dateGreaterThan = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "past-year":
      dateGreaterThan = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      dateGreaterThan = new Date("2024-01-04");
      break;
  }

  const pageSize = 10;
  const offset = (page - 1) * pageSize;
  const search = searchParams.get("search") ?? "";

  const start = performance.now();

  const conditions = [];
  if (dateGreaterThan) {
    conditions.push(gte(PageView.date, dateGreaterThan));
    conditions.push(lte(PageView.date, dateLessThan));
  }
  if (search !== "") {
    conditions.push(like(PageView.url, `%${search}%`));
  }
  let totalViews;
  let pageViews;
  let viewsPerUrl;
  let totalUniqueURLs: number | undefined;
  let totalPages;
  if (!searchParams.get("mode") || searchParams.get("mode") === "page-views") {
    const whereClause = dateGreaterThan
      ? `WHERE date >= '${dateGreaterThan.toISOString()}'`
      : "";
    const pageViewsQuery = db.run(
      sql.raw(`SELECT
    strftime('%Y-%m-%d', date) AS day,
        COUNT(*) AS page_views_count
  FROM
    PageView
  ${whereClause}
  GROUP BY
    day
  ORDER BY
    day ASC;`),
    );
    let totalViewsRes;
    const totalViewsQuery = db
      .select({
        totalUniqueURLs: countDistinct(PageView.url),
        totalCount: count(),
      })
      .from(PageView)
      .where(and(...conditions));
    [pageViews, totalViewsRes] = await Promise.all([
      pageViewsQuery,
      totalViewsQuery,
    ]);
    totalViews = totalViewsRes[0]?.totalCount ?? 0;
  } else {
    let totalViewsRes;
    const totalViewsQuery = db
      .select({
        totalUniqueURLs: countDistinct(PageView.url),
        totalCount: count(),
      })
      .from(PageView)
      .where(and(...conditions));
    const viewsQuery = db
      .select({
        url: PageView.url,
        pageviews: count(),
      })
      .from(PageView)
      .where(and(...conditions))
      .limit(pageSize)
      .offset(offset)
      .groupBy(PageView.url)
      .orderBy(desc(count()));
    [totalViewsRes, viewsPerUrl] = await Promise.all([
      totalViewsQuery,
      viewsQuery,
    ]);
    totalViews = totalViewsRes[0]?.totalCount ?? 0;
    totalUniqueURLs = totalViewsRes[0]?.totalUniqueURLs ?? 0;
    totalPages = Math.ceil((totalUniqueURLs ?? 0) / pageSize);
  }

  const end = performance.now();
  console.log(`Query took ${end - start}ms`);
  return new Response(
    JSON.stringify({
      totalViews,
      totalUniqueURLs,
      totalPages,
      pageViews,
      viewsPerUrl,
    }),
  );
};
