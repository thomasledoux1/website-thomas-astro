import { prisma } from './prisma-client';

export const getCommentsForBlog = async (blogUrl: string | null) => {
  const comments = await prisma.post.findFirst({
    where: { url: blogUrl ?? undefined },
    include: { Comment: true },
    orderBy: { createdAt: 'asc' },
  });
  // const comments = await supabase
  //   .from('comments')
  //   .select('*, blogs(*)')
  //   .eq('blogs.url', blogUrl)
  //   .order('created_at', {
  //     ascending: false,
  //   });
  const allCommentsInDbForPost = comments?.Comment;
  return allCommentsInDbForPost;
};
