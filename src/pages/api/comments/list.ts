import type { APIRoute } from "astro";
import { getCommentsForBlog } from "../../../lib/get-comments-for-blog";

export const get: APIRoute = async ({ request }) => {
  const params = new URLSearchParams(request.url.split("?")[1]);
  const allCommentsInDbForPost = await getCommentsForBlog(
    params.get("blogUrl")
  );
  return new Response(JSON.stringify(allCommentsInDbForPost), {
    status: 200,
  });
};
