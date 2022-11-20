import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge';
import { PrismaClient as PrismaClientDev } from '@prisma/client';

const prisma =
  process.env.NODE_ENV === 'development'
    ? new PrismaClientDev()
    : new PrismaClientEdge();

export { prisma };
