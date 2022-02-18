import styles from './card.module.css'
import { subCategoryElementItf } from '../lib/db'
import * as data from '../appconf/categories.json';

export default function Card({ subCategoryContent }: { subCategoryContent: subCategoryElementItf }) {

   const categoriesObject: any = data
   const imgFileName = categoriesObject[subCategoryContent.category][subCategoryContent.subcategory]['image-url']

   return (
      <div id={subCategoryContent.index.toString()} className={styles.container} >
         <img className={styles.mainImage} src={'/images/subcategories/' + imgFileName} />
         <div className={styles.verticalContainer}>
            <h5>{subCategoryContent.title}</h5>
            <p className={styles.desc}>{subCategoryContent.description}</p>
         </div>
         <div className={`${styles.verticalContainer} ${styles.ratingContainer}`}>
            <p className={styles.rating}>{subCategoryContent.rating100}</p>
            <img className={styles.star} src='/images/star.png' />
         </div>
      </div>
  )
}