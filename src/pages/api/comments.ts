import type { APIRoute } from 'astro';
import type { Comment } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { getUser } from '@astro-auth/core';

const sendMail = async (
  subject: string,
  content: { type: string; value: string }[]
) => {
  fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [
            {
              email: import.meta.env.EMAIL_TO,
              name: 'Thomas Ledoux',
            },
          ],
        },
      ],
      from: {
        email: 'info@thomasledoux.be',
        name: 'Thomas Ledoux',
      },
      replyTo: {
        email: 'info@thomasledoux.be',
        name: 'Thomas Ledoux',
      },
      subject,
      content,
    }),
  });
};

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const blogUrl = params
    .get('blogUrl')
    ?.replace('src/content', '')
    .replace('.mdx', '');
  if (!blogUrl) {
    const comments = await prisma?.comment.findMany({
      include: {
        post: {
          select: {
            url: true,
          },
        },
      },
    });
    return new Response(JSON.stringify(comments), {
      status: 200,
    });
  }
  const commentsForBlogUrl = await prisma?.post.findFirst({
    where: { url: (blogUrl as string) ?? undefined },
    include: { Comment: true },
    orderBy: { createdAt: 'asc' },
  });
  const allCommentsInDbForPost = commentsForBlogUrl?.Comment;
  return new Response(JSON.stringify(allCommentsInDbForPost), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const post: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { comment, author, blogUrl } = body;
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
  if (!commentInDb) {
    return new Response(null, { status: 400 });
  }
  sendMail(`New comment on ${blogUrl}`, [
    {
      type: 'text/html',
      value: `<p>New comment on <b>${blogUrl}</b> by <b>${author}</b>: ${comment}</p>`,
    },
  ]);

  return new Response(null, { status: 200 });
};

export const del: APIRoute = async ({ request }) => {
  const user = getUser({ server: request });
  if (user) {
    const body = await request.json();
    const deleteComment = await prisma?.comment.delete({
      where: {
        id: body.id,
      },
    });
    return new Response(
      JSON.stringify({
        message: `Comment with id ${deleteComment?.id} deleted`,
      }),
      { status: 200 }
    );
  }
  return new Response(null, { status: 403 });
};
