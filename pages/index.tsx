import Head from 'next/head'
import MainLayout, { siteTitle } from '../components/layouts/main-layout'
import utilStyles from '../styles/utils.module.css'
import { GetServerSideProps  } from 'next'
import { constants as cst } from '../constants'
import { getUserIdFromJwt } from '../lib/auth-utils'

export default function Home(
  { userId }: 
  {
    userId: number
  }
) {
  return (
      <MainLayout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={utilStyles.headingMd}>
          <p>coucou user {userId}</p>
        </section>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        </section>
      </MainLayout>
  )
}

/* SERVER SIDE RENDERING */
export const getServerSideProps: GetServerSideProps = async context => {
  const userId = getUserIdFromJwt(context.req.cookies[cst.ACCESS_TOKEN])
  if (userId === null) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  } else {
      return {
      props: { userId },
    }
  }
}

/* Si on veut faire du client-side rendering (classique), on peut faire de la static generation et faire les requêtes dans le composant directement */
/* Pour faire du data-fetching côté client il existe le hook SWR : */
/* import useSWR from 'swr'

function Profile() {
  const { data, error } = useSWR('/api/user', fetch)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
} */


/* STATIC GENERATION */
/* export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
} */