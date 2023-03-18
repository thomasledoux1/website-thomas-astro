import { getUser } from '@astro-auth/core';
import type { inferAsyncReturnType } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  const user = getUser({ server: req });
  return { req, resHeaders, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
