import type { APIRoute } from 'astro';
import { createComment, getComments } from '../../lib/comments';
import { sendMail } from '../../lib/emails';

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const blogUrl = params.get('blogUrl');
  if (!blogUrl) {
    return new Response('No blog url provided', {
      status: 400,
    });
  }
  const comments = await getComments(blogUrl);
  return new Response(JSON.stringify(comments), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const post: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { comment, author, blogUrl } = body;
  const commentInDb = await createComment(author, blogUrl, comment);
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
