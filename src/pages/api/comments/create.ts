import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma-client';

export const post: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const comment = formData.get('comment') ?? '';
  const author = formData.get('author') ?? '';
  const blogUrl = formData.get('blogUrl') ?? '';
  const blog = await prisma.post.findFirst({
    where: { url: blogUrl as string },
  });

  await prisma.comment.create({
    data: {
      author: author as string,
      text: comment as string,
      post: {
        connectOrCreate: {
          create: {
            url: blogUrl as string,
          },
          where: {
            id: blog?.id,
          },
        },
      },
    },
  });

  return new Response(null, {
    status: 200,
  });
};
