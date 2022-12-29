export async function sendMail(
  subject: string,
  content: { type: string; value: string }[]
) {
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
}
