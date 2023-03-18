import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { CommentOverview } from './CommentOverview';
import type { Comment } from '@prisma/client';
import { getTrpcUrl, trpcReact } from '../client';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';

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
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [
        httpBatchLink({
          url: getTrpcUrl(),
        }),
      ],
    })
  );
  return (
    <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <CommentOverview commentsWithPost={commentsWithPost} />
        <Toaster richColors />
      </QueryClientProvider>
    </trpcReact.Provider>
  );
};
export default CommentsOverviewWrapper;
