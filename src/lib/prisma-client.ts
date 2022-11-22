let prisma;

if (process.env.NODE_ENV === 'development') {
  import('@prisma/client').then(mod => (prisma = new mod.PrismaClient()));
} else {
  import('@prisma/client/edge').then(mod => (prisma = new mod.PrismaClient()));
}
export { prisma };
