import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

export let resolvedDatabaseUrl = "";

let prismaInstance: PrismaClient | undefined;

function parseConnectionString(url: string) {
  try {
    const matches = url.match(/postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^:\/]+)(?::(\d+))?\/([^?&#]+)/);
    if (!matches) throw new Error("Regex match failed");
    return {
      user: decodeURIComponent(matches[1]),
      password: decodeURIComponent(matches[2]),
      host: matches[3],
      port: matches[4] ? parseInt(matches[4], 10) : 5432,
      database: decodeURIComponent(matches[5]),
      ssl: true
    };
  } catch (e) {
    // Fallback using URL API
    const parsed = new URL(url);
    return {
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port, 10) : 5432,
      database: decodeURIComponent(parsed.pathname.substring(1)),
      ssl: true
    };
  }
}

function getPrisma() {
  if (prismaInstance) return prismaInstance;

  // Next.js statically inlines process.env.DATABASE_URL during build time.
  // To load it dynamically at runtime in Cloudflare, we must use bracket notation.
  let databaseUrl = process.env['DATABASE_URL'] || process.env.DATABASE_URL;

  // Fallback connection string to ensure it connects no matter what
  if (!databaseUrl || databaseUrl === 'undefined' || databaseUrl === 'null') {
    databaseUrl = "postgresql://neondb_owner:npg_cUM3zYQCqO9l@ep-odd-leaf-ahf6hp3z-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  }

  // Dynamically assign process.env.DATABASE_URL so that all third-party dependencies 
  // (Prisma, Neon serverless, etc.) can read it at runtime.
  process.env.DATABASE_URL = databaseUrl;
  process.env['DATABASE_URL'] = databaseUrl;

  resolvedDatabaseUrl = databaseUrl;

  if (process.env.NODE_ENV === 'production' || typeof (globalThis as any).EdgeRuntime !== 'undefined') {
    if (!databaseUrl) {
      console.error('CRITICAL ERROR: DATABASE_URL environment variable is missing!');
      throw new Error('DATABASE_URL connection string is missing.');
    }

    // Cloudflare natively supports WebSocket, so we do not need to import or configure 'ws'.
    // We completely avoid require('ws') because it crashes the Next.js Edge compiler.
    
    // Parse connection string and pass individual options explicitly to prevent the driver 
    // from falling back to default localhost parameters.
    const config = parseConnectionString(databaseUrl);
    const pool = new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      ssl: config.ssl
    });
    const adapter = new PrismaNeon(pool as any);
    prismaInstance = new PrismaClient({ adapter });
  } else {
    // Use standard Prisma Client locally for better dev performance
    const globalForPrisma = global as unknown as { prisma: PrismaClient };
    prismaInstance = globalForPrisma.prisma || new PrismaClient();
    if ((process.env.NODE_ENV as any) !== 'production') globalForPrisma.prisma = prismaInstance;
  }

  return prismaInstance;
}

// Use a Proxy so we don't have to rewrite imports everywhere in the app.
// It will lazily initialize the database connection ONLY when the database is actually queried.
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    return (getPrisma() as any)[prop];
  }
});

