import { supabase } from './supabase';

export const getCommentsForBlog = async (blogUrl: string | null) => {
  const comments = await supabase
    .from('comments')
    .select('*, blogs(*)')
    .eq('blogs.url', blogUrl)
    .order('created_at', {
      ascending: false,
    });
  const allCommentsInDbForPost = comments.data?.filter(item => !!item.blogs);
  return allCommentsInDbForPost;
};
