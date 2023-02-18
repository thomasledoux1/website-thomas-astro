import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CommentOverview } from './CommentOverview';
import type { Comment } from '@prisma/client';

const queryClient = new QueryClient();

const CommentsOverviewWrapper = ({
  commentsWithPost,
}: {
  commentsWithPost:
    | (Comment & {
        post: {
          url: string;
        };
      })[]
    | undefined;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CommentOverview commentsWithPost={commentsWithPost} />
    </QueryClientProvider>
  );
};
export default CommentsOverviewWrapper;
