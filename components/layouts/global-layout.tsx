import Head from 'next/head'

export const siteTitle = 'Weiver'

export default function GlobalLayout(
  { children }: 
  {
    children: React.ReactNode
  }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/logo_green_256x256.ico" />
        <meta
          name="description"
          content="Rate anything you want to remember and share it with your friends"
        />
        <meta name="og:title" content={siteTitle} />
        <title>{siteTitle}</title>
      </Head>
      {children}
    </>
  )
}