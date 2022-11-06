import type { APIRoute } from 'astro';
import type { Blog } from '../../../../types/blog';
import { supabase } from '../../../lib/supabase';

export const get: APIRoute = async ({ request }) => {
  if (import.meta.env.MODE !== 'development') {
    const url = new URL(request.headers.get('referer') ?? '').pathname;
    const { data } = await supabase.from('blogs').select().eq('url', url);
    const blog = data?.[0] as Blog | undefined;
    await supabase.from('blogs').upsert({
      id: blog ? blog.id : undefined,
      view_count: blog ? blog.view_count + 1 : 1,
      url: blog ? blog.url : url,
    });
  }
  return new Response(undefined, {
    status: 200,
  });
};
