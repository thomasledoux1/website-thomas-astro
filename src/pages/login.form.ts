import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const post: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  console.log(formData.get('email'));
  console.log(formData.get('password'));
  const { user, error, session } = await supabase.auth.signIn({
    email: formData.get('email')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  });
  if (!user || error) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: '/',
      },
    });
  }
  console.log(session?.access_token);
  return new Response(null, {
    status: 301,
    headers: {
      Location: '/',
      'Set-Cookie': `sb:token=${session?.access_token}; Path=/; Max-Age=2592000`,
    },
  });
};
