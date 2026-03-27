import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";


const loadEnvFile = (
  process as NodeJS.Process & {
    loadEnvFile?: (path: string) => void;
  }
).loadEnvFile;

const environment = process.env.NODE_ENV ?? "development";

const envFiles = [
  ".env",
  environment === "test" ? null : ".env.local",
  `.env.${environment}`,
  `.env.${environment}.local`,
].filter((value): value is string => Boolean(value));

for (const envFile of envFiles) {
  const absolutePath = resolve(/* turbopackIgnore: true */ process.cwd(), envFile);

  if (existsSync(absolutePath)) {
    loadEnvFile?.(absolutePath);
  }
}

const connectionString =
  process.env.DATABASE_URL ??
  process.env.SUPABASE_DB_URL ??
  process.env.SUPABASE_DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing database connection string. Set DATABASE_URL, SUPABASE_DB_URL, or SUPABASE_DATABASE_URL.",
  );
}

export const sql = postgres(connectionString, {
  max: 1,
  prepare: false,
});

export const db = drizzle(sql, { schema });

export async function closeDbConnection() {
  await sql.end();
}


