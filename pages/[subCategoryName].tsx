import MainLayout from '../components/layouts/main-layout'
import { GetServerSideProps  } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { constants as cst } from '../constants'
import { getUserIdFromJwt } from '../lib/auth-utils'
import { getUserSubCategoryContent, subCategoryElementItf } from '../lib/db'
import SubCategory from '../components/subcategory'

export default function Home(
  { subCategoryContent }: { subCategoryContent: subCategoryElementItf[] }
) {
  
  useTranslation();

  return (
    <MainLayout>
      <SubCategory subCategoryContent={subCategoryContent} />
    </MainLayout>
  )
}

/* SSR */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = getUserIdFromJwt(context.req.cookies[cst.ACCESS_TOKEN])
  const subCategoryName = context.params?.subCategoryName
  if (userId === null) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  } else {
      const subCategoryContent = await getUserSubCategoryContent(userId, subCategoryName)
      return {
        props: { 
          subCategoryContent,
          ...(await serverSideTranslations(context.locale || '', ['common']))
        },
    }
  }
}