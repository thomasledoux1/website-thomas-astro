import type { Comment } from '@prisma/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Comments from './Comments';

const queryClient = new QueryClient();

const CommentsWrapper = ({
  blogUrl,
  initialComments,
}: {
  blogUrl: string;
  initialComments?: Comment[] | undefined;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Comments blogUrl={blogUrl} initialComments={initialComments} />
    </QueryClientProvider>
  );
};
export default CommentsWrapper;
