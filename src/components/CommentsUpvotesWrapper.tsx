import type { Comment } from '@prisma/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Comments from './CommentsUpvotes';

const queryClient = new QueryClient();

const CommentsUpvotesWrapper = ({
  initialComments,
  blogUrl,
}: {
  initialComments?: Comment[];
  blogUrl: string;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Comments initialComments={initialComments} blogUrl={blogUrl} />
    </QueryClientProvider>
  );
};
export default CommentsUpvotesWrapper;
