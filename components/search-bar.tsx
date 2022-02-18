import styles from './search-bar.module.css'

export default function SearchBar(
  { placeholder, onSubmitFct }: { placeholder: string, onSubmitFct: React.FormEventHandler }) {
  return (
    <div className={styles.container}>
        <form className={styles.form} onSubmit={onSubmitFct}>
            <input type="text" placeholder={placeholder} ></input>
            <button type="submit">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path className={styles.searchicon} d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path>
                </svg>
            </button>
        </form>
    </div>
  )
}