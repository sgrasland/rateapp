import styles from './main-layout.module.css'
import GlobalLayout from './global-layout'
import { useRouter } from 'next/router'

export default function MainLayout(
  { children }: 
  {
    children: React.ReactNode
  }) {
    const router = useRouter();
  return (
    <GlobalLayout>
      <div className={styles.container}>
        <header className={styles.header}>
        </header>
        <main>{children}</main>
      </div>
    </GlobalLayout>
  )
}