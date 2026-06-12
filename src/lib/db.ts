import { neon } from '@neondatabase/serverless';

let databaseUrl = process.env['DATABASE_URL'] || process.env.DATABASE_URL;

// Fallback connection string
if (!databaseUrl || databaseUrl === 'undefined' || databaseUrl === 'null') {
  databaseUrl = "postgresql://neondb_owner:npg_cUM3zYQCqO9l@ep-odd-leaf-ahf6hp3z-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
}

// Expose it globally to process.env
process.env.DATABASE_URL = databaseUrl;
process.env['DATABASE_URL'] = databaseUrl;

export const resolvedDatabaseUrl = databaseUrl;

// Simple Neon HTTP SQL client
export const sql = neon(databaseUrl);
