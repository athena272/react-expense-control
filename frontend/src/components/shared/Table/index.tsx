import type { ReactNode } from 'react'
import styles from './Table.module.css'

type TableProps = {
  headers: string[]
  children: ReactNode
  footer?: ReactNode
}

export default function Table({ headers, children, footer }: TableProps) {
  return (
    <div className={styles.table}>
      <div className={`${styles.row} ${styles.header}`}>
        {headers.map((header) => (
          <span key={header}>{header}</span>
        ))}
      </div>
      {children}
      {footer}
    </div>
  )
}
