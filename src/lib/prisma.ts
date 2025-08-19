
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], //this can be removed in prod though
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
