import { createPool } from "@vercel/postgres";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const PageViewsTable = pgTable("page_views", {
  url: text("url").notNull(),
  date: timestamp("date").defaultNow().notNull(),
});

// Connect to Vercel Postgres

const pool = createPool({
  connectionString: import.meta.env.POSTGRES_URL,
});
const client = drizzle(pool);

export { client };
