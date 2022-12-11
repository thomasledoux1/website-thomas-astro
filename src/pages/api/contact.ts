import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  await fetch(process.env.FORMSPREE_URL!, {
    method: 'post',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  }).catch(e => console.error(e));
  return new Response(null, {
    status: 301,
    headers: {
      Location: '/contact/thanks',
    },
  });
};
