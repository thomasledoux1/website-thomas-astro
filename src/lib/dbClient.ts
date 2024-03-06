import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export const PageViewsTable = pgTable("page_views", {
  url: text("url").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

// Connect to Vercel Postgres
const client = drizzle(neon(import.meta.env.POSTGRES_URL));

export { client };
