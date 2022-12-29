import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  fetch(process.env.FORMSPREE_URL!, {
    method: 'post',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  }).catch(e => console.error(e));
  return redirect('/contact/thanks', 301);
};
