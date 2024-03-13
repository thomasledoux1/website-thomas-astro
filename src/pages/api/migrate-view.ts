export const prerender = false;
import type { APIRoute } from "astro";
import { db, PageView } from "astro:db";
import { PageViewsTable, client } from "~/lib/dbClient";

export const GET: APIRoute = async ({ request }) => {
  try {
    const entries = (await client.select().from(PageViewsTable)).slice(12011);
    for (const entry of entries) {
      await db.insert(PageView).values({ url: entry.url, date: entry.date });
    }
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
