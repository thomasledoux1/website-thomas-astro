import { createPool } from "@vercel/postgres";

const client = createPool({
  connectionString: import.meta.env.POSTGRES_URL,
});

export { client };
