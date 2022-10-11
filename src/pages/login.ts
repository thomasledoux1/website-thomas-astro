import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const get: APIRoute = async ({ params }) => {
  if (!params || !params.email || !params.password) {
    return new Response(undefined, {
      status: 403,
    });
  }
  const { user, error } = await supabase.auth.signIn({
    email: params.email as string,
    password: params.password as string,
  });
  if (error) {
    console.error(error);
  }
  return new Response(undefined, {
    status: !!user ? 200 : 403,
  });
};
