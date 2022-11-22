import satori from 'satori';
import type { APIRoute } from 'astro';
export const config = {
  runtime: 'experimental-edge',
};

const font = fetch(new URL('../../../assets/Inter.ttf', import.meta.url)).then(
  res => res.arrayBuffer()
);

export const get: APIRoute = async ({ request }) => {
  const fontData = await font;

  try {
    const { searchParams } = new URL(request.url);
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'My default title';

    const image = await satori(
      {
        type: 'div',
        key: 'test',
        props: {
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
          children: {
            type: 'div',
            props: {
              style: {
                width: '80%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                alignItems: 'center',
              },
            },
            children: [
              {
                type: 'p',
                props: {
                  style: { fontSize: 32 },
                  children: 'Thomas Ledoux&apos;s blog',
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
      },
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: 'Inter',
            data: fontData,
            style: 'normal',
          },
        ],
      }
      // (
      //   <div
      //     style={{
      //       background: 'white',
      //       width: '100%',
      //       height: '100%',
      //       display: 'flex',
      //       textAlign: 'center',
      //       alignItems: 'center',
      //       justifyContent: 'center',
      //       flexDirection: 'column',
      //       fontFamily: 'Inter',
      //       backgroundImage:
      //         'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
      //       backgroundSize: '100px 100px',
      //     }}
      //   >
      //     <div
      //       style={{
      //         width: '80%',
      //         display: 'flex',
      //         flexDirection: 'column',
      //         textAlign: 'center',
      //         alignItems: 'center',
      //       }}
      //     >
      //       <p style={{ fontSize: 32 }}>Thomas Ledoux&apos;s blog</p>
      //       <p style={{ fontSize: 64 }}>{title}</p>
      //     </div>
      //   </div>
      // ),
    );
    return new Response(image, {
      status: 200,
    });
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
};
