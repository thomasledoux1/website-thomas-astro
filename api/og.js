import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'experimental-edge',
};

const font = fetch(new URL('../assets/Inter.ttf', import.meta.url)).then(res =>
  res.arrayBuffer()
);

export default async function handler(req, res) {
  const fontData = await font;

  try {
    const { searchParams } = new URL(req.url);

    // ?title=<title>
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 200)
      : 'My default title';

    const html = {
      type: 'div',
      props: {
        children: [
          {
            type: 'div',
            props: {
              style: {
                width: '80%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'p',
                  props: {
                    style: { fontSize: 32 },
                    children: 'Blog by Thomas Ledoux',
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: { fontSize: 64 },
                    children: title,
                  },
                },
              ],
            },
          },
        ],
        style: {
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'Inter',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        },
      },
    };

    return new ImageResponse(html, {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
        },
      ],
    });
  } catch (e) {
    console.log(`${e.message}`);
    return res.status(500).json({ error: 'Failed to generate the image' });
  }
}
