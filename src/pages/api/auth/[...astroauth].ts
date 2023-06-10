export const prerender = false;
import AstroAuth from '@astro-auth/core';
import { CredentialProvider, GithubProvider } from '@astro-auth/providers';
import { prisma } from '../../../lib/prisma';

export const all = AstroAuth({
  authProviders: [
    CredentialProvider({
      authorize: async properties => {
        const account = await prisma?.account.findFirst({
          where: {
            username: properties.username,
            AND: {
              password: properties.password,
            },
          },
          select: {
            id: true,
          },
        });
        if (account?.id) {
          return properties.username;
        }
        return null;
      },
    }),
    GithubProvider({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
  ],
});
