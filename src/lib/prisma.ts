import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

let prismaInstance: PrismaClient;

const databaseUrl = process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'production' || typeof (globalThis as any).EdgeRuntime !== 'undefined') {
  if (!databaseUrl) {
    console.error('CRITICAL ERROR: DATABASE_URL environment variable is missing!');
    throw new Error('DATABASE_URL environment variable is missing. Please set it in your Cloudflare Pages dashboard under Settings -> Environment variables.');
  }

  // Only use the 'ws' library if native WebSocket is not available (e.g. Node.js environment)
  if (typeof (globalThis as any).WebSocket === 'undefined') {
    try {
      const ws = require('ws');
      neonConfig.webSocketConstructor = ws;
    } catch (e) {
      console.error('Failed to load "ws" package:', e);
    }
  }
  
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaNeon(pool as any);
  prismaInstance = new PrismaClient({ adapter });
} else {
  // Use standard Prisma Client locally for better dev performance
  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  prismaInstance = globalForPrisma.prisma || new PrismaClient();
  if ((process.env.NODE_ENV as any) !== 'production') globalForPrisma.prisma = prismaInstance;
}

export const prisma = prismaInstance;

