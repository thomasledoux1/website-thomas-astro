import { ipAddress } from "@vercel/edge";
import { kv } from "@vercel/kv";

export const config = {
  runtime: "edge",
  region: "fra1",
};

export default async function incr(req) {
  if (req.method !== "POST") {
    return new Response("use POST", { status: 405 });
  }
  if (req.headers.get("Content-Type") !== "application/json") {
    return new Response("must be json", { status: 400 });
  }

  const body = await req.json();
  let slug;
  if ("slug" in body) {
    slug = body.slug;
  }
  if (!slug) {
    return new Response("Slug not found", { status: 400 });
  }
  const ip = ipAddress(req);

  if (ip) {
    // Hash the IP in order to not store it directly in your db.
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip),
    );
    const hash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // deduplicate the ip for each slug
    const isNew = await kv.set(["deduplicate", hash, slug].join(":"), true, {
      nx: true,
      ex: 24 * 60 * 60,
    });
    if (!isNew) {
      new Response(null, { status: 202 });
    }
  }
  await kv.incr(["pageviews", slug].join(":"));
  return new Response(null, { status: 202 });
}
