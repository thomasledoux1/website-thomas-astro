import { ActionError, defineAction, z } from "astro:actions";
import { PageView, db } from "astro:db";
import { isbot } from "isbot";

export const server = {
  pageView: defineAction({
    input: z.object({
      url: z.string(),
    }),
    handler: async ({ url }, context) => {
      const { request } = context;

      if (isbot(request.headers.get("user-agent"))) {
        throw new ActionError({
          code: "FORBIDDEN",
          message: "This endpoint is not available for bots",
        });
      }
      if (!url) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Missing URL",
        });
      }
      if (url === "/page-views") {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "This url is not tracked",
        });
      }
      try {
        const res = await db.insert(PageView).values({
          url: url,
          date: new Date(),
        });
        return res;
      } catch (e) {
        console.error(e);
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Error updating views",
        });
      }
    },
  }),
};
