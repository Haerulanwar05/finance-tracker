import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Prevent multiple instances of Prisma Client across hot reloads & serverless invocations
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  
  // Configure lightweight pg.Pool tailored for Serverless Lambdas & Supabase connection limits
  const pool = new Pool({
    connectionString,
    max: 1, // 1 connection per serverless lambda instance prevents pool exhaustion
    idleTimeoutMillis: 5000, // Release idle connection quickly after request finishes
    connectionTimeoutMillis: 8000,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

// Cache client globally in both dev and production serverless execution contexts
globalForPrisma.prisma = prisma;

export default prisma;

