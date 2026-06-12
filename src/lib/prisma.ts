import { PrismaClient } from '@prisma/client/edge';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

let prismaInstance: PrismaClient | undefined;

function getPrisma() {
  if (prismaInstance) return prismaInstance;

  const databaseUrl = process.env.DATABASE_URL;

  if (process.env.NODE_ENV === 'production' || typeof (globalThis as any).EdgeRuntime !== 'undefined') {
    if (!databaseUrl) {
      console.error('CRITICAL ERROR: DATABASE_URL environment variable is missing!');
      throw new Error('DATABASE_URL environment variable is missing. Please set it in your Cloudflare Pages dashboard under Settings -> Environment variables.');
    }

    // Cloudflare natively supports WebSocket, so we do not need to import or configure 'ws'.
    // We completely avoid require('ws') because it crashes the Next.js Edge compiler.
    
    const pool = new Pool({ connectionString: databaseUrl });
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

