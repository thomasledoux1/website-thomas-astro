let prisma;
let fetcher;

if (process.env.NODE_ENV === 'development') {
  import('@prisma/client.js').then(mod => (prisma = new mod.PrismaClient()));
} else {
  import('@prisma/client/edge.js').then(
    mod => (prisma = new mod.PrismaClient())
  );
}
import('node-fetch').then(mod => (fetcher = mod.default));

async function sendMail(blogUrl, author, comment) {
  try {
    fetcher('https://api.sendgrid.com/v3/mail/send', {
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
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}

export default async function handler(req, res) {
  const { comment, author, blogUrl } = await JSON.parse(req.body);
  const blog = await prisma.post.findFirst({
    where: { url: blogUrl },
  });

  try {
    await prisma.comment.create({
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
  try {
    sendMail(blogUrl, author, comment);
  } catch (err) {
    console.error('Error sending email', err);
  }

  return res.status(200).send({});
}
