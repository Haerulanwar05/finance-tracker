import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Prevent multiple instances of Prisma Client across hot reloads & serverless invocations
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  let connectionString = process.env.DATABASE_URL || "";

  // Critical Serverless Invariant:
  // Supabase Pooler port 5432 is Session Mode (limited to 15 concurrent clients).
  // Port 6543 is Transaction Mode (supports high-concurrency serverless lambdas with PgBouncer).
  if (connectionString.includes("pooler.supabase.com:5432")) {
    connectionString = connectionString.replace(":5432", ":6543");
    if (!connectionString.includes("pgbouncer=true")) {
      connectionString += (connectionString.includes("?") ? "&" : "?") + "pgbouncer=true";
    }
  }

  // For Serverless Lambdas (Vercel), each execution container runs a single request.
  // Using max: 1 prevents multiple dormant connections per container and prevents pool saturation.
  const pool = new Pool({
    connectionString,
    max: process.env.NODE_ENV === "production" ? 1 : 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
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
