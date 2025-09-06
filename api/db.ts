import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";
import dotenv from "dotenv";
dotenv.config();

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Please check your environment variables.");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

// Create connection pool with error handling
let pool: Pool;
try {
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    // Add connection pool settings for serverless
    max: 1, // Limit connections for serverless
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
} catch (error) {
  console.error("Failed to create database pool:", error);
  throw error;
}

export { pool };
export const db = drizzle({ client: pool, schema });
