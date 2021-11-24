import styles from './form-layout.module.css'

export default function FormLayout(
  { children, formTitle, onSubmitFct }: 
  {
    children: React.ReactNode,
    formTitle: Text,
    onSubmitFct: React.FormEventHandler
  }) {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h4>{formTitle}</h4>
        </div>
        <form className={styles.fieldsContainer} onSubmit={onSubmitFct} >
          {children}
        </form>
      </div>
    </div>
  )
}