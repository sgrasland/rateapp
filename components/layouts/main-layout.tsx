import styles from './main-layout.module.css'
import GlobalLayout, { siteTitle } from './global-layout'
import { constants as cst } from '../../constants' 
import { fetcher } from '../../lib/api-utils'
import { useTranslation } from 'next-i18next';
import useSWR from 'swr'

export default function MainLayout(
    { children }: { children: React.ReactNode }
  ) {

    const { t } = useTranslation('common')

    const handleOpenAddReviewForm = (event: React.SyntheticEvent) => {
      event.preventDefault()  
      // Handle search
    }

    const { data, error } = useSWR('/api/userinfo/profilepicturepath', fetcher)
    let profilePicturePath = "/images/avatar_neutral_40x40.png"
    if (data && !error) {
      if (data.errorCode === cst.NO_ERROR && data.additionnalInfo !== null) {
          profilePicturePath = data.additionnalInfo
      }
    }

    return (
      <GlobalLayout>
        <header className={styles.header}>
          <img src="/images/logo_green_40x40.png" />
          <h2>{siteTitle}</h2>
          <img id={styles.userpic} src={profilePicturePath} />
        </header>
        <div className={styles.container}>
          <main>{children}</main>
        </div>
        <div>
          <button style={styles} name="OpenAddReviewForm" onClick={handleOpenAddReviewForm}></button>
        </div>
      </GlobalLayout>
    )
}