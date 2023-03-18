import type { Comment } from '@prisma/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { getTrpcUrl, trpcReact } from '../client';
import Comments from './Comments';

const CommentsWrapper = ({
  blogUrl,
  initialComments,
}: {
  blogUrl: string;
  initialComments?: Comment[] | undefined;
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
        <Comments blogUrl={blogUrl} initialComments={initialComments} />
        <Toaster richColors />
      </QueryClientProvider>
    </trpcReact.Provider>
  );
};
export default CommentsWrapper;
