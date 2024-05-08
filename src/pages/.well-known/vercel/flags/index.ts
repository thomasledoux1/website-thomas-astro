export const prerender = false;

import { verifyAccess } from "../../../../lib/vercel-flags-port.mjs";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const access = await verifyAccess(request.headers.get("Authorization"));
  if (!access) {
    return new Response(null, { status: 401 });
  }

  return new Response(
    JSON.stringify({
      definitions: {
        newFeature: {
          description: "Controls whether the new feature is visible",
          options: [
            { value: false, label: "Off" },
            { value: true, label: "On" },
          ],
        },
      },
    }),
  );
};
