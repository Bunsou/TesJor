import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { readFileSync } from "fs";
import { join } from "path";

config({ path: ".env.local" });

const sql = readFileSync(
  join(process.cwd(), "src/server/db/migrations/0002_unify_listings.sql"),
  "utf-8"
);

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { max: 1 });

async function migrate() {
  try {
    console.log("Running migration...");
    await client.unsafe(sql);
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
