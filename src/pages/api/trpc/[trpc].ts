import { createAstroTRPCApiHandler } from 'astro-trpc';
import * as trpc from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';
import type { Comment } from '@prisma/client';
import { sendMail } from '../../../lib/email';

// the tRPC router
export const appRouter = trpc
  .router()
  .query('comments', {
    input: z.object({
      blogUrl: z.string(),
    }),
    async resolve({ input }) {
      const comments = await prisma?.post.findFirst({
        where: { url: input.blogUrl },
        include: { Comment: true },
        orderBy: { createdAt: 'asc' },
      });
      console.log(comments);
      const allCommentsInDbForPost = comments?.Comment;
      return {
        comments: allCommentsInDbForPost,
      };
    },
  })
  .mutation('comment', {
    input: z.object({
      author: z.string(),
      comment: z.string(),
      blogUrl: z.string(),
    }),
    async resolve({ input }) {
      let commentInDb: Comment | undefined;
      const blog = await prisma?.post.findFirst({
        where: { url: input.blogUrl },
      });
      try {
        commentInDb = await prisma?.comment.create({
          data: {
            author: input.author,
            text: input.comment,
            post: {
              connectOrCreate: {
                create: {
                  url: input.blogUrl,
                },
                where: {
                  id: blog?.id ?? 0,
                },
              },
            },
          },
        });
        sendMail(`New comment on ${input.blogUrl}`, [
          {
            type: 'text/html',
            value: `<p>New comment on <b>${input.blogUrl}</b> by <b>${input.author}</b>: ${input.comment}</p>`,
          },
        ]);
        return commentInDb;
      } catch (err) {
        console.error('Error saving comment', err);
        return null;
      }
    },
  })
  .mutation('contact', {
    input: z.object({
      email: z.string(),
      message: z.string(),
    }),
    async resolve({ input }) {
      fetch(import.meta.env.FORMSPREE_URL!, {
        method: 'post',
        headers: {
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: input.email,
          message: input.message,
        }),
      }).catch(e => console.error(e));
    },
  });

// type definition of the router
export type AppRouter = typeof appRouter;

// API handler
export const all = createAstroTRPCApiHandler({
  router: appRouter,
  createContext: () => null,
});
