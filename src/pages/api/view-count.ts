export const prerender = false;

import type { APIRoute } from "astro";
import { isbot } from "isbot";
import { client } from "~/lib/dbClient";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url).searchParams.get("url");
  if (isbot(request.headers.get("user-agent"))) {
    return new Response(
      JSON.stringify({
        error: "This endpoint is not available for bots",
      }),
      { status: 400 },
    );
  }
  const viewCount =
    (await client.sql`SELECT COUNT(*) as count FROM page_views WHERE url = ${url}`.then(
      (res) => res.rows[0]?.count,
    )) || 0;
  return new Response(
    JSON.stringify({
      count: viewCount,
    }),
    {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    },
  );
};
