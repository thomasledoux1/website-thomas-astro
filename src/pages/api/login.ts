import type { APIRoute } from 'astro';
import { prisma } from '../../lib/prisma';

export const post: APIRoute = async ({ request, redirect }) => {
  const loginDetails = await request.json();
  const account = await prisma?.account.findFirst({
    where: {
      username: loginDetails.username,
      AND: {
        password: loginDetails.password,
      },
    },
    select: {
      id: true,
    },
  });
  if (account?.id) {
    return redirect('/', 307);
  }

  return new Response('Login failed', { status: 400 });
};
