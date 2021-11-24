import styles from './button.module.css'

export default function Button(
  { id, label, type, styleType }: 
  { 
    id: string,
    label: string,
    type: 'submit' | 'button',
    styleType: 'button' | 'link'
  }) {
  return (
    <button 
      id={id} 
      className={`${styles.common} ${styles[styleType]}`} 
      type={type} >
        {label}
    </button>
  )
}