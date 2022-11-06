import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const post: APIRoute = async ({ request }) => {
  console.log(request);
  const formData = await request.formData();
  const comment = formData.get('comment');
  const author = formData.get('author');
  const blogUrl = formData.get('blogUrl');
  let post = await supabase.from('blogs').select('id').eq('url', blogUrl);
  if (!post.data || post.data.length === 0) {
    post = await supabase.from('blogs').insert({ url: blogUrl }).select();
  }
  await supabase
    .from('comments')
    .upsert({ text: comment, author, blogid: post.data?.[0].id });
  return new Response(null, {
    status: 200,
  });
};
