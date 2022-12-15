let prisma;

if (process.env.NODE_ENV === 'development') {
  import('@prisma/client.js').then(mod => (prisma = new mod.PrismaClient()));
} else {
  import('@prisma/client/edge.js').then(
    mod => (prisma = new mod.PrismaClient())
  );
}

export default async function handler(req, res) {
  const searchParams = new URLSearchParams(req.url.split('?')[1]);
  const comments = await prisma.post.findFirst({
    where: { url: searchParams.get('blogUrl') ?? undefined },
    include: { Comment: true },
    orderBy: { createdAt: 'asc' },
  });
  const allCommentsInDbForPost = comments?.Comment;

  return res.status(200).json(allCommentsInDbForPost);
}
