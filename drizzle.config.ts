import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

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
  if (existsSync(envFile)) {
    loadEnvFile?.(envFile);
  }
}

const databaseUrl =
  process.env.DATABASE_URL ??
  process.env.SUPABASE_DB_URL ??
  process.env.SUPABASE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Missing database connection string. Set DATABASE_URL, SUPABASE_DB_URL, or SUPABASE_DATABASE_URL.",
  );
}

export default defineConfig({
  casing: "snake_case",
  dbCredentials: {
    url: databaseUrl,
  },
  dialect: "postgresql",
  out: "./db/migrations",
  schema: "./db/schema/index.ts",
  schemaFilter: ["public"],
  strict: true,
  verbose: true,
});
