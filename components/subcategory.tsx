import styles from './subcategory.module.css'
import { useTranslation } from 'next-i18next';
import { subCategoryElementItf } from '../lib/db'
import Card from './card'
import SearchBar from './search-bar'

export default function Subcategory(
      { subCategoryContent }: 
      { subCategoryContent: subCategoryElementItf[] }
   ) {

      // You need to call "serverSideTranslations" in "getServerSideProps" of parent of this component
      const { t } = useTranslation();

      const submit = (event: React.SyntheticEvent) => {
         event.preventDefault()  
         // Handle search
      }

   return (
      <div className={styles.container}>
         <SearchBar placeholder={t('Search')} onSubmitFct={submit} />
         <h4>{t(subCategoryContent[0].subcategory)}</h4>
         <div className={styles.cardlistContainer}>
            {
               subCategoryContent.map(
                  (el: subCategoryElementItf) => {
                     return <Card subCategoryContent={el} />
                  }
               )
            }
         </div>
      </div>
   )
}