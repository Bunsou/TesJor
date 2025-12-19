import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";
import { config } from "@/shared/config";

// Create connection pool
const pool = new Pool({ connectionString: config.databaseUrl });

// Create Drizzle instance
export const db = drizzle(pool, { schema });
