import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === 'production' || typeof (globalThis as any).EdgeRuntime !== 'undefined') {
  // Configure WebSocket for serverless environments (like Cloudflare Pages/Workers)
  if (typeof window === 'undefined') {
    const ws = require('ws');
    neonConfig.webSocketConstructor = ws;
  }
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool as any);
  prismaInstance = new PrismaClient({ adapter });
} else {
  // Use standard Prisma Client locally for better dev performance
  const globalForPrisma = global as unknown as { prisma: PrismaClient };
  prismaInstance = globalForPrisma.prisma || new PrismaClient();
  if ((process.env.NODE_ENV as any) !== 'production') globalForPrisma.prisma = prismaInstance;
}

export const prisma = prismaInstance;
