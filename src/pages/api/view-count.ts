import type { APIRoute } from "astro";
import { client } from "~/lib/dbClient";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url).searchParams.get("url");
  const viewCount =
    (await client.sql`SELECT COUNT(*) as count FROM page_views WHERE url = ${url}`.then(
      (res) => res.rows[0]?.count,
    )) || 0;
  return new Response(
    JSON.stringify({
      count: viewCount,
    }),
    { status: 200 },
  );
};
