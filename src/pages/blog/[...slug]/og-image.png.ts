import { getCollection, getEntryBySlug } from "astro:content";
import fs from "fs/promises";
import satori from "satori";
import sharp from "sharp";
import type { APIRoute } from "astro";

export async function getStaticPaths() {
  const blogs = await getCollection("blog", (blog) => blog.data.draft !== true);
  return blogs.map((blog) => ({
    params: { slug: blog.slug },
    props: { entry: blog },
  }));
}

export const GET: APIRoute = async function get({ params }) {
  const page = await getEntryBySlug("blog", params.slug!);
  const title = page?.data.title
    ? page?.data.title.slice(0, 200)
    : "My default title";
  const robotoData = await fs.readFile(
    "./public/fonts/inter-v12-latin-regular.ttf",
  );

  const svg = await satori(
    {
      type: "div",
      key: "root",
      children: [],
      props: {
        style: {
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter",
          paddingLeft: "32px",
          paddingRight: "32px",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                width: "35%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginRight: "5%",
              },
              children: [
                {
                  type: "img",
                  props: {
                    alt: "avatar",
                    width: "100%",
                    src: "https://res.cloudinary.com/dzrea5zhv/image/upload/v1583171588/me_qvrwky.jpg",
                    style: {
                      borderRadius: "100%",
                    },
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                width: "60%",
                display: "flex",
                flexDirection: "column",
              },
              children: [
                {
                  type: "p",
                  props: {
                    style: { fontSize: 32 },
                    children: "Thomas Ledoux's blog",
                  },
                },
                {
                  type: "p",
                  props: {
                    style: { fontSize: 64 },
                    children: title,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Roboto",
          data: robotoData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
