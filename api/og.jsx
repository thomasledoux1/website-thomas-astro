import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
  region: "fra1",
};

const font = fetch(
  new URL("../public/fonts/inter-v12-latin-700.woff2", import.meta.url),
).then((res) => res.arrayBuffer());

export default async function handler(req) {
  const fontData = await font;

  try {
    const { searchParams } = new URL(req.url);

    // ?title=<title>
    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 200)
      : "My default title";

    return new ImageResponse(
      (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              width: "35%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginRight: "5%",
            }}
          >
            <img
              alt="avatar"
              width="100%"
              src="https://res.cloudinary.com/dzrea5zhv/image/upload/v1583171588/me_qvrwky.jpg"
              style={{
                borderRadius: "100%",
              }}
            />
          </div>
          <div
            style={{
              width: "60%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p style={{ fontSize: 32 }}>Thomas Ledoux&apos;s blog</p>
            <p style={{ fontSize: 64 }}>{title}</p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            style: "normal",
          },
        ],
      },
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
