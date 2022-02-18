import styles from './categories.module.css'
import { resultArrayElItf } from '../lib/db'
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import SearchBar from './search-bar'
import * as data from '../appconf/categories.json';

export default function Categories(
    { userCategories }: 
    {
      userCategories: resultArrayElItf[]
    }) {
        // You need to call "serverSideTranslations" in "getServerSideProps" of parent of this component
        const { t } = useTranslation();

        const router = useRouter();

        const categoriesObject: any = data

        const defaultButtonStyle = {
            backgroundSize: '70%',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'var(--white)',
            borderRadius: '50px',
            height: '50px',
            width: '50px',
            margin: '5px',
            border: '1px solid grey'
        }

        const submit = (event: React.SyntheticEvent) => {
            event.preventDefault()  
            // Handle search
        }

        const handleClick = (event: React.SyntheticEvent) => {
            event.preventDefault()
            const buttonClicked = event.target as HTMLButtonElement
            router.push('/' + buttonClicked.name);
        }

  return (
    <div className={styles.container}>
        <SearchBar placeholder={t('Search')} onSubmitFct={submit} />
        {
            userCategories.map(
                el => {
                    return (
                        <>
                            <h4>{t(el.category)}</h4>
                            <div className={styles.buttonList}>
                                {
                                    el.subcategories.map(
                                        (subel: string) => {
                                            const imgFileName = categoriesObject[el.category][subel]['image-url']
                                            const backgroundImage = 'url(/images/subcategories/' + imgFileName + ')'
                                            const styles = {
                                                ...defaultButtonStyle,
                                                backgroundImage: backgroundImage
                                            }
                                            return <button style={styles} name={subel} onClick={handleClick}></button>
                                        }
                                    )
                                }
                            </div>
                            
                        </>
                    )
                }
            )
        }
    </div>
  )
}