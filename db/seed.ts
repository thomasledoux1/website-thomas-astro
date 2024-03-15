import { db, PageView } from "astro:db";

export default async function () {
  await db.insert(PageView).values([
    { date: new Date(), url: "/" },
    { date: new Date(new Date().getTime() - 1000), url: "/test" },
  ]);
}
