import { createPool } from "@vercel/postgres";

const client = createPool({
  connectionString:
    "postgres://default:BQuKt3c6qMOW@ep-lucky-star-15879815-pooler.eu-central-1.postgres.vercel-storage.com:5432/verceldb",
});

export { client };
