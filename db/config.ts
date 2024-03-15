import { column, defineDb, defineTable } from "astro:db";

export const PageView = defineTable({
  columns: {
    url: column.text(),
    date: column.date(),
  },
  indexes: {
    url_idx: { on: ["url"], unique: false },
    date_idx: { on: ["date"], unique: false },
  },
});

export default defineDb({
  tables: { PageView },
});
