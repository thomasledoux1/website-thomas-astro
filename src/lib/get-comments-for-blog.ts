import { prisma } from './prisma-client';

export const getCommentsForBlog = async (blogUrl: string | null) => {
  const comments = await prisma.post.findFirst({
    where: { url: blogUrl ?? undefined },
    include: { Comment: true },
    orderBy: { createdAt: 'asc' },
  });
  const allCommentsInDbForPost = comments?.Comment;
  return allCommentsInDbForPost;
};
