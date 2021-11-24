import { GetServerSideProps  } from 'next'
import { useRouter } from 'next/router';
import { getFormItems } from '../lib/form-utils'
import TextInput from '../components/text-input'
import Button from '../components/button'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import MainLayout from '../components/layouts/main-layout'
import FormLayout from '../components/layouts/form-layout'
import HorizontalLayout from '../components/layouts/horizontal-layout'
import { constants as cst } from '../constants'

export default function Register({ data }: {data: any}) {

  const router = useRouter();

  const { t } = useTranslation('common');

  const registerUser = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Build body containing user informations
    const formItems = getFormItems(event.target as HTMLFormElement)

      // Post query to register user
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formItems),
      })
      .then((res) => res.json())
      .then(data => {
        if (data?.errorCode === cst.NO_ERROR) {
          router.push('/');
        }
      })
  }

  return (
      <MainLayout>
        <FormLayout formTitle={t('Register')} onSubmitFct={registerUser}>
          <TextInput name="email" label={t('EMailAddress')} type="email"  maxLength={255}/>
          <TextInput name="firstname" label={t('FirstName')} type="text" maxLength={255}/>
          <TextInput name="lastname" label={t('LastName')} type="text" maxLength={255}/>
          <TextInput name="password" label={t('Password')} type="password"/>
          <TextInput name="confirmpassword" label={t('ConfirmPassword')} type="password"/>
          <HorizontalLayout>
            <Button id="register" label={t('Register')} type="submit" styleType="button" />
            <Button id="cancel" label={t('Cancel')} type="button" styleType="link" />
          </HorizontalLayout>
        </FormLayout>
      </MainLayout>
  )
}

/* SERVER SIDE RENDERING */
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let data: any = null;
  try {
    // data = await getUserByEmail('testmail_uuid@test.com')
  } catch (error) {
    data = "errodfrff"
  }
  return {
    props: {
      data,
      ...(await serverSideTranslations(locale || '', ['common']))
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
/*  export const getStaticProps: GetStaticProps = async () => {
  let data: any = null;
  try {
    data = await getUserByEmail('toto@gmail.com');
  } catch (error) {
    data = "error"
  }
  return {
    props: {
      data
    }
  }
} */
