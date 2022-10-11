import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const get: APIRoute = async ({ request }) => {
  if (import.meta.env.MODE !== 'development') {
    const url = new URL(request.headers.get('referer') ?? '').pathname;
    const { data } = await supabase.from('blogs').select().eq('url', url);
    const blog = data?.[0];
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
