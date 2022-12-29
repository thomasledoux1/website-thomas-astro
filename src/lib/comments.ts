import type { Comment } from '@prisma/client';
import type { PrismaClient } from '@prisma/client/index.js';

let prisma: PrismaClient | undefined;

if (import.meta.env.MODE === 'development') {
  import('@prisma/client/index.js').then(
    mod => (prisma = new mod.PrismaClient())
  );
} else {
  import('@prisma/client/edge.js').then(
    mod =>
      (prisma = new mod.PrismaClient({
        datasources: {
          db: {
            url: import.meta.env.DATABASE_URL,
          },
        },
      }))
  );
}

export const getComments = async (blogUrl: string) => {
  console.log('prisma client: ', prisma);
  const comments = await prisma?.post.findFirst({
    where: { url: (blogUrl as string | undefined) ?? undefined },
    include: { Comment: true },
    orderBy: { createdAt: 'asc' },
  });
  const allCommentsInDbForPost = comments?.Comment;
  return allCommentsInDbForPost;
};

export const createComment = async (
  author: string,
  blogUrl: string,
  comment: string
) => {
  let commentInDb: Comment | undefined;
  const blog = await prisma?.post.findFirst({
    where: { url: blogUrl },
  });
  try {
    commentInDb = await prisma?.comment.create({
      data: {
        author: author ?? '',
        text: comment ?? '',
        post: {
          connectOrCreate: {
            create: {
              url: blogUrl ?? '',
            },
            where: {
              id: blog?.id ?? 0,
            },
          },
        },
      },
    });
  } catch (err) {
    console.error('Error saving comment', err);
  }
  return commentInDb;
};
