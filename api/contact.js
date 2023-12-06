export const config = {
  runtime: "edge",
  region: "fra1",
};

export default async function contact(req) {
  const input = await req.json();
  if (input.email && input.message) {
    await fetch(process.env.FORMSPREE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }).catch((e) => {
      console.error(e);
      return new Response("error", { status: 400 });
    });
    return new Response("success", { status: 200 });
  }
  return new Response("missingdata", { status: 400 });
}
