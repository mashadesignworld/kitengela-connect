import { PrismaClient } from "@prisma/client";
import Database from 'better-sqlite3'

const globalForPrisma = global as unknown as { prisma: PrismaClient };


export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
       log: ["query", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
