import MainLayout from '../components/layouts/main-layout'
import { GetServerSideProps  } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { constants as cst } from '../constants'
import { getUserIdFromJwt } from '../lib/auth-utils'
import { getUserCategories, resultArrayElItf } from '../lib/db'
import Categories from '../components/categories'

export default function Home(
  { userCategories }: 
  {
    userCategories: resultArrayElItf[]
  }
) {
  
  useTranslation();

  return (
    <MainLayout>
      <Categories userCategories={userCategories} />
    </MainLayout>
  )
}

/* SSR */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = getUserIdFromJwt(context.req.cookies[cst.ACCESS_TOKEN])
  if (userId === null) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  } else {
      const userCategories = await getUserCategories(userId)
      return {
        props: { 
          userCategories,
          ...(await serverSideTranslations(context.locale || '', ['common']))
        },
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