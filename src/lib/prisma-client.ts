import { PrismaClient } from '@prisma/client';
let prisma: PrismaClient;

if (typeof window === 'undefined') {
  const prisma = new PrismaClient();
}

export { prisma };
