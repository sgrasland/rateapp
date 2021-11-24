import styles from './text-input.module.css'

export default function TextInput(
  { name, label, type, isRequired, maxLength }: 
  { 
    name: string,
    label: string,
    type: 'text' | 'email' | 'password' | 'number',
    isRequired?: boolean,
    maxLength?: number,
  }) {
  return (
    <div className={styles.container}>
      <label htmlFor={name}>{label}</label>
      <input type={type} id={name} name={name} required={isRequired} maxLength={maxLength}></input>
    </div>
  )
}