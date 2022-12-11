import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { prisma } from '../../../lib/prisma-client';
import mjml2html from 'mjml';

let transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});

async function sendMail(blogUrl: string, author: string, comment: string) {
  const htmlOutput = mjml2html(`
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>
              A new comment was added to blog ${blogUrl} by ${author}:
              ${comment}
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>`);

  await transporter.sendMail({
    from: '"Thomas Ledoux" <info@thomasledoux.be>',
    to: process.env.EMAIL_TO,
    subject: `New comment on post ${blogUrl}`,
    html: htmlOutput.html,
  });
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
