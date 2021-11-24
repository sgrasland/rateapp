import styles from './horizontal-layout.module.css'

export default function HorizontalLayout(
  { children }: 
  {
    children: React.ReactNode
  }) {
  return (
    <div className={styles.container}>
        {children}
    </div>
  )
}