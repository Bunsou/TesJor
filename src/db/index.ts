import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";
import { env } from "@/lib/env";

// Create connection pool
const pool = new Pool({ connectionString: env.DATABASE_URL });

// Create Drizzle instance
export const db = drizzle(pool, { schema });
