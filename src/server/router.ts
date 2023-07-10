import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { Context } from './context';

export const t = initTRPC.context<Context>().create();

export const middleware = t.middleware;
export const publicProcedure = t.procedure;

export const appRouter = t.router({
  sendContactForm: publicProcedure
    .input(
      z.object({ email: z.string().nullable(), message: z.string().nullable() })
    )
    .mutation(async ({ input }) => {
      if (input.email && input.message) {
        await fetch(import.meta.env.FORMSPREE_URL!, {
          method: 'post',
          headers: {
            Accept: 'application/json',
          },
          body: JSON.stringify(input),
        }).catch(e => {
          console.error(e);
          return { status: 'error' };
        });
        return { status: 'success' };
      }
      return { status: 'missingdata' };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
