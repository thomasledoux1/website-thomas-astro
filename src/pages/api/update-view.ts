export const prerender = false;
import { isbot } from "isbot";

import type { APIRoute } from "astro";
import { PageViewsTable, client } from "~/lib/dbClient";

export const POST: APIRoute = async ({ request }) => {
  if (import.meta.env.NODE_ENV === "development") {
    return new Response(
      JSON.stringify({
        error: "This endpoint is not available in development",
      }),
      { status: 400 },
    );
  }
  if (isbot(request.headers.get("user-agent"))) {
    return new Response(
      JSON.stringify({
        error: "This endpoint is not available for bots",
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
    await client.insert(PageViewsTable).values({
      url: body.url,
      date: new Date(),
    });
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
