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
  if (!blog) {
    await prisma.post.create({
      data: {
        url: blogUrl as string,
        view_count: 1,
        Comment: {
          create: {
            author: author as string,
            text: comment as string,
          },
        },
      },
    });
  } else {
    await prisma.comment.create({
      data: {
        author: author as string,
        text: comment as string,
        postId: blog.id,
      },
    });
  }

  return new Response(null, {
    status: 200,
  });
};
