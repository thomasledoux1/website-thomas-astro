export const prerender = false;
import type { APIRoute } from "astro";
import { db, gt, PageView } from "astro:db";
import { asc } from "drizzle-orm";
import { PageViewsTable, client } from "~/lib/dbClient";

export const GET: APIRoute = async () => {
  try {
    const entries = await client
      .select()
      .from(PageViewsTable)
      .orderBy(asc(PageViewsTable.date))
      // @ts-expect-error
      .where(gt(PageViewsTable.date, new Date("2024-03-16")));
    console.log(entries);
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
