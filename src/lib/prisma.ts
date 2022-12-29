import type { PrismaClient } from '@prisma/client/index.js';

let prisma: PrismaClient | undefined;

if (process.env.NODE_ENV === 'development') {
  import('@prisma/client/index.js').then(
    mod => (prisma = new mod.PrismaClient())
  );
} else {
  import('@prisma/client/edge.js').then(
    mod => (prisma = new mod.PrismaClient())
  );
}

export { prisma };
