import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma-client';

export const get: APIRoute = async ({ request }) => {
  if (import.meta.env.MODE !== 'development') {
    const url = new URL(request.headers.get('referer') ?? '').pathname;
    const blog = await prisma.post.findFirst({ where: { url } });
    if (!blog) {
      await prisma.post.create({
        data: {
          like_count: 1,
          url,
        },
      });
    } else {
      await prisma.post.update({
        where: { id: blog.id },
        data: {
          like_count: blog.like_count + 1,
        },
      });
    }
  }
  return new Response(undefined, {
    status: 200,
  });
};
