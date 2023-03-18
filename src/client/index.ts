import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/router';

const trpcReact = createTRPCReact<AppRouter>();

export function getTrpcUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '/api/trpc';
  if (import.meta.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${import.meta.env.VERCEL_URL}/api/trpc`;
  // assume localhost
  return `http://localhost:3000/api/trpc`;
}

const trpcAstro = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getTrpcUrl(),
    }),
  ],
});

export { trpcReact, trpcAstro };
