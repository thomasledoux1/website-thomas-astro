export default async function handler(req, res) {
  fetch(process.env.FORMSPREE_URL, {
    method: 'post',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  }).catch(e => console.error(e));
  return res.redirect(301, '/contact/thanks');
}
