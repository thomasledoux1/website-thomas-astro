import { column, defineDb, defineTable } from "astro:db";

const PageView = defineTable({
  columns: {
    url: column.text(),
    date: column.date(),
  },
});

export default defineDb({
  tables: { PageView },
});
