import {ImageResponse} from '@vercel/og'

export const config = {
  runtime: 'experimental-edge',
}

const font = fetch(new URL('../../assets/Inter.ttf', import.meta.url)).then(
  res => res.arrayBuffer(),
)

export default async function handler(req) {
  const fontData = await font

  try {
    const {searchParams} = new URL(req.url)

    // ?title=<title>
    const hasTitle = searchParams.has('title')
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 200)
      : 'My default title'

    return new ImageResponse(
      (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              width: '80%',
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <p style={{fontSize: 32}}>Thomas Ledoux&apos;s blog</p>
            <p style={{fontSize: 64}}>{title}</p>
          </div>
        </div>
      ),
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
      },
    )
  } catch (e) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
