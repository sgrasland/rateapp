import { GetServerSideProps  } from 'next'
import Head from 'next/head'
import styles from './main-layout.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

const name = 'Sylvain'
export const siteTitle = 'Next.js Sample Website'

export default function MainLayout(
  { children, home }: 
  {
    children: React.ReactNode
    home?: boolean
  }) {
    const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  )
}

/* SERVER SIDE RENDERING */
export const getServerSideProps: GetServerSideProps = async context => {
  const testProps = {toto: 'toto'}
  return {
    props: {
      testProps
    }
  }
}
