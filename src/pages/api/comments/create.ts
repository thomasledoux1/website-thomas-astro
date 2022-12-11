import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma-client';

async function sendMail(blogUrl: string, author: string, comment: string) {
  try {
    fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              {
                email: process.env.EMAIL_TO,
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
        subject: `New comment on ${blogUrl}`,
        content: [
          {
            type: 'text/html',
            value: `<p>New comment on <b>${blogUrl}</b> by <b>${author}</b>: ${comment}</p>`,
          },
        ],
      }),
    });
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}

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
            id: blog?.id ?? 0,
          },
        },
      },
    },
  });
  try {
    sendMail(blogUrl as string, author as string, comment as string);
  } catch (err) {
    console.error('Error sending email', err);
  }

  return new Response(null, {
    status: 200,
  });
};
