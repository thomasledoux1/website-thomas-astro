import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Comments from './CommentsUpvotes';

const queryClient = new QueryClient();

const CommentsUpvotesWrapper = ({ blogUrl }: { blogUrl: string }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Comments blogUrl={blogUrl} />
    </QueryClientProvider>
  );
};
export default CommentsUpvotesWrapper;
