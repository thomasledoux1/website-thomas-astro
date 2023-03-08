import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import type { Comment } from '@prisma/client';
import type { Context } from './context';
import { sendMail } from '../utils/send-email';

export const t = initTRPC.context<Context>().create();

export const middleware = t.middleware;
export const publicProcedure = t.procedure;

const isAdmin = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const adminProcedure = publicProcedure.use(isAdmin);

export const appRouter = t.router({
  getAllComments: publicProcedure.query(async () => {
    const comments = await prisma?.comment.findMany({
      include: {
        post: {
          select: {
            url: true,
          },
        },
      },
    });
    return comments;
  }),
  getCommentsForBlog: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const blogUrl = input.replace('src/content', '').replace('.mdx', '');
      const commentsForBlogUrl = await prisma?.post.findFirst({
        where: { url: (blogUrl as string) ?? undefined },
        include: { Comment: { orderBy: { createdAt: 'desc' } } },
      });
      const allCommentsInDbForPost = commentsForBlogUrl?.Comment;
      return allCommentsInDbForPost ?? null;
    }),
  createCommentForBlog: publicProcedure
    // validate input with Zod
    .input(
      z.object({
        comment: z.string(),
        author: z.string(),
        blogUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { comment, blogUrl, author } = input;
      let commentInDb: Comment | undefined;
      const blog = await prisma?.post.findFirst({
        where: { url: blogUrl },
      });
      try {
        commentInDb = await prisma?.comment.create({
          data: {
            author: author ?? '',
            text: comment ?? '',
            post: {
              connectOrCreate: {
                create: {
                  url: blogUrl ?? '',
                },
                where: {
                  id: blog?.id ?? 0,
                },
              },
            },
          },
        });
      } catch (err) {
        console.error('Error saving comment', err);
        return { status: 'error', error: 'Error saving comment' };
      }
      if (!commentInDb) {
        return { status: 'error', error: 'Error saving comment' };
      }
      if (import.meta.env.MODE !== 'development') {
        sendMail(`New comment on ${blogUrl}`, [
          {
            type: 'text/html',
            value: `<p>New comment on <b>${blogUrl}</b> by <b>${author}</b>: ${comment}</p>`,
          },
        ]);
      }
      return { status: 'success' };
    }),
  deleteCommentForBlog: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      let deleteComment;
      try {
        deleteComment = await prisma?.comment.delete({
          where: {
            id: input.id,
          },
        });
      } catch (e) {
        return { status: 'error', error: 'Error deleting comment' };
      }
      if (!deleteComment) {
        return { status: 'error', error: 'Error deleting comment' };
      }

      return { status: 'success' };
    }),
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
