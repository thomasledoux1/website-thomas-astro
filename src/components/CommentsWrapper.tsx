import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Comment } from '../../types/comment';
import Comments from './Comments';

const queryClient = new QueryClient();

const CommentsWrapper = ({
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
export default CommentsWrapper;
