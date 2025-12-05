import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,            // for Supabase Transaction connection pooling mode
});

export const db = drizzle(client, { schema });
