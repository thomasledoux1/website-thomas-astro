export const prerender = false;

import type { APIRoute } from "astro";
import { client } from "~/lib/dbClient";

export const POST: APIRoute = async ({ request }) => {
  if (import.meta.env.NODE_ENV === "development") {
    return new Response(
      JSON.stringify({
        error: "This endpoint is not available in development",
      }),
      { status: 400 },
    );
  }
  const body = await request.json();
  if (!body.url) {
    return new Response(
      JSON.stringify({
        error: "Missing URL",
      }),
      { status: 400 },
    );
  }
  if (body.url === "/page-views") {
    return new Response(
      JSON.stringify({
        error: "This url is not tracked",
      }),
      { status: 202 },
    );
  }
  try {
    await client.sql`INSERT INTO page_views (url, date) VALUES (${
      body.url
    }, ${new Date().toISOString()});`;
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({
        error: "Error updating views",
      }),
      { status: 400 },
    );
  }

  return new Response(
    JSON.stringify({
      message: "Succesfully updated views",
    }),
    { status: 200 },
  );
};
