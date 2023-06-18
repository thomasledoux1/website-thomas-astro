export const prerender = false;
import AstroAuth from '@astro-auth/core';
import { GithubProvider } from '@astro-auth/providers';

export const all = AstroAuth({
  authProviders: [
    GithubProvider({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
  ],
});
