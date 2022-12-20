export default async function handler(req, res) {
  await fetch(process.env.FORMSPREE_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: JSON.stringify(req.body),
  }).catch(e => console.error(e));
  return res.redirect(301, '/contact/thanks');
}
